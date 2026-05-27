package otel_test

import (
	"strings"
	"testing"
	"time"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func TestScanLines_DetectsSentinel(t *testing.T) {
	lines := []string{
		"test output line 1",
		`BROWSERSTACK_OTEL_FLUSH:{"spans":5,"logs":2,"status":"ok"}`,
		"test output line 2",
	}
	result, filtered := internalotel.ScanLines(lines)
	if result == nil {
		t.Fatal("expected sentinel to be detected")
	}
	if result.Spans != 5 || result.Logs != 2 || result.Status != "ok" {
		t.Fatalf("unexpected result: %+v", result)
	}
	if len(filtered) != 2 {
		t.Fatalf("expected 2 filtered lines, got %d", len(filtered))
	}
	for _, l := range filtered {
		if strings.Contains(l, "BROWSERSTACK_OTEL_FLUSH") {
			t.Fatal("sentinel line leaked into filtered output")
		}
	}
}

func TestScanLines_NoSentinel(t *testing.T) {
	lines := []string{"line 1", "line 2"}
	result, filtered := internalotel.ScanLines(lines)
	if result != nil {
		t.Fatal("expected no sentinel")
	}
	if len(filtered) != 2 {
		t.Fatalf("expected 2 lines, got %d", len(filtered))
	}
}

func TestRun_ExitCode(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	code, err := internalotel.Run(cfg, []string{"sh", "-c", "exit 42"}, time.Second*2)
	if err != nil {
		t.Fatalf("Run error: %v", err)
	}
	if code != 42 {
		t.Fatalf("expected exit code 42, got %d", code)
	}
}

func TestRun_ZeroExitCode(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	code, err := internalotel.Run(cfg, []string{"echo", "hello"}, time.Second*2)
	if err != nil {
		t.Fatalf("Run error: %v", err)
	}
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
}
