package otel

import (
	"fmt"
	"strings"
)

// Config holds all values the CLI passes to the child process environment.
type Config struct {
	ReporterPath        string
	Endpoint            string
	Headers             string
	FlushTimeout        string
	BatchSize           string
	BatchTimeout        string
	ExportTimeout       string
	AttachmentThreshold string
}

// MergeEnv takes a base environment (os.Environ() format: "KEY=VALUE" strings)
// and returns a new slice with OTEL-related vars merged in (append, never overwrite).
func MergeEnv(base []string, cfg Config) []string {
	env := make([]string, len(base))
	copy(env, base)

	// NODE_OPTIONS: append --require <path> so the reporter is loaded in every
	// Node.js process (workers, main). Playwright reporter injection is handled
	// separately via --reporter flag injection in runner.go.
	env = appendEnv(env, "NODE_OPTIONS", "--require "+cfg.ReporterPath, " ")

	// OTEL standard vars (translated from BROWSERSTACK_OTEL_* equivalents)
	if cfg.Endpoint != "" {
		env = setEnv(env, "OTEL_EXPORTER_OTLP_ENDPOINT", cfg.Endpoint)
	}
	if cfg.Headers != "" {
		env = appendEnv(env, "OTEL_EXPORTER_OTLP_HEADERS", cfg.Headers, ",")
	}

	// Pass batch config as BROWSERSTACK_OTEL_* so the reporter reads them
	if cfg.BatchSize != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_BATCH_SIZE", cfg.BatchSize)
	}
	if cfg.BatchTimeout != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_BATCH_TIMEOUT", cfg.BatchTimeout)
	}
	if cfg.ExportTimeout != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_EXPORT_TIMEOUT", cfg.ExportTimeout)
	}
	if cfg.AttachmentThreshold != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD", cfg.AttachmentThreshold)
	}
	if cfg.Endpoint != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_ENDPOINT", cfg.Endpoint)
	}

	return env
}

// appendEnv appends value to the existing value of key using sep,
// or sets key=value if the key is not present.
func appendEnv(env []string, key, value, sep string) []string {
	prefix := key + "="
	for i, e := range env {
		if strings.HasPrefix(e, prefix) {
			existing := e[len(prefix):]
			if existing == "" {
				env[i] = fmt.Sprintf("%s=%s", key, value)
			} else {
				env[i] = fmt.Sprintf("%s=%s%s%s", key, existing, sep, value)
			}
			return env
		}
	}
	return append(env, fmt.Sprintf("%s=%s", key, value))
}

// setEnv sets key=value, overwriting any existing value for key.
func setEnv(env []string, key, value string) []string {
	prefix := key + "="
	for i, e := range env {
		if strings.HasPrefix(e, prefix) {
			env[i] = fmt.Sprintf("%s=%s", key, value)
			return env
		}
	}
	return append(env, fmt.Sprintf("%s=%s", key, value))
}
