package otel_test

import (
	"strings"
	"testing"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func findEnv(env []string, key string) string {
	prefix := key + "="
	for _, e := range env {
		if strings.HasPrefix(e, prefix) {
			return e[len(prefix):]
		}
	}
	return ""
}

func TestMergeEnv_AppendsNodeOptions(t *testing.T) {
	base := []string{"NODE_OPTIONS=--max-old-space-size=4096", "PATH=/usr/bin"}
	cfg := internalotel.Config{ReporterPath: "/tmp/register.cjs"}
	env := internalotel.MergeEnv(base, cfg)
	nodeOpts := findEnv(env, "NODE_OPTIONS")
	expected := "--max-old-space-size=4096 --require /tmp/register.cjs"
	if nodeOpts != expected {
		t.Fatalf("NODE_OPTIONS = %q, want %q", nodeOpts, expected)
	}
}

func TestMergeEnv_SetsNodeOptionsWhenAbsent(t *testing.T) {
	base := []string{"PATH=/usr/bin"}
	cfg := internalotel.Config{ReporterPath: "/tmp/register.cjs"}
	env := internalotel.MergeEnv(base, cfg)
	nodeOpts := findEnv(env, "NODE_OPTIONS")
	if nodeOpts != "--require /tmp/register.cjs" {
		t.Fatalf("NODE_OPTIONS = %q", nodeOpts)
	}
}

func TestMergeEnv_AppendsPlaywrightReporter(t *testing.T) {
	base := []string{"PLAYWRIGHT_REPORTER=my-reporter.ts"}
	cfg := internalotel.Config{ReporterPath: "/tmp/register.cjs"}
	env := internalotel.MergeEnv(base, cfg)
	pr := findEnv(env, "PLAYWRIGHT_REPORTER")
	expected := "my-reporter.ts,/tmp/register.cjs"
	if pr != expected {
		t.Fatalf("PLAYWRIGHT_REPORTER = %q, want %q", pr, expected)
	}
}

func TestMergeEnv_SetsOtelEndpoint(t *testing.T) {
	base := []string{}
	cfg := internalotel.Config{ReporterPath: "/tmp/r.cjs", Endpoint: "https://otel.example.com"}
	env := internalotel.MergeEnv(base, cfg)
	if findEnv(env, "OTEL_EXPORTER_OTLP_ENDPOINT") != "https://otel.example.com" {
		t.Fatal("OTEL_EXPORTER_OTLP_ENDPOINT not set")
	}
}

func TestMergeEnv_AppendsOtelHeaders(t *testing.T) {
	base := []string{"OTEL_EXPORTER_OTLP_HEADERS=x-existing=val"}
	cfg := internalotel.Config{ReporterPath: "/tmp/r.cjs", Headers: "Authorization=Bearer tok"}
	env := internalotel.MergeEnv(base, cfg)
	h := findEnv(env, "OTEL_EXPORTER_OTLP_HEADERS")
	expected := "x-existing=val,Authorization=Bearer tok"
	if h != expected {
		t.Fatalf("OTEL_EXPORTER_OTLP_HEADERS = %q, want %q", h, expected)
	}
}

func TestMergeEnv_PassesBatchConfig(t *testing.T) {
	base := []string{}
	cfg := internalotel.Config{
		ReporterPath:        "/tmp/r.cjs",
		BatchSize:           "256",
		BatchTimeout:        "3s",
		ExportTimeout:       "8s",
		AttachmentThreshold: "10MB",
	}
	env := internalotel.MergeEnv(base, cfg)
	if findEnv(env, "BROWSERSTACK_OTEL_BATCH_SIZE") != "256" {
		t.Fatal("BROWSERSTACK_OTEL_BATCH_SIZE not set")
	}
	if findEnv(env, "BROWSERSTACK_OTEL_BATCH_TIMEOUT") != "3s" {
		t.Fatal("BROWSERSTACK_OTEL_BATCH_TIMEOUT not set")
	}
}
