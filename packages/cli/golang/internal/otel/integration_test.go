package otel_test

import (
	"bytes"
	"io"
	"os"
	"strings"
	"testing"
	"time"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

// captureOutputs redirects os.Stdout and os.Stderr for the duration of fn,
// returning everything written to each.
func captureOutputs(fn func()) (stdout, stderr string) {
	// Capture stdout
	rOut, wOut, _ := os.Pipe()
	origOut := os.Stdout
	os.Stdout = wOut

	// Capture stderr
	rErr, wErr, _ := os.Pipe()
	origErr := os.Stderr
	os.Stderr = wErr

	fn()

	wOut.Close()
	wErr.Close()
	os.Stdout = origOut
	os.Stderr = origErr

	var bufOut, bufErr bytes.Buffer
	io.Copy(&bufOut, rOut)
	io.Copy(&bufErr, rErr)
	return bufOut.String(), bufErr.String()
}

// ── Run: stdout passthrough ───────────────────────────────────────────────────

func TestRun_StdoutPassthrough(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	stdout, _ := captureOutputs(func() {
		internalotel.Run(cfg, []string{"sh", "-c", "printf 'line one\nline two\n'"}, time.Second*2)
	})
	if !strings.Contains(stdout, "line one") || !strings.Contains(stdout, "line two") {
		t.Fatalf("stdout not forwarded: %q", stdout)
	}
}

func TestRun_StdoutSentinelStripped(t *testing.T) {
	sentinel := `BROWSERSTACK_WATCH_FLUSH:{"spans":3,"logs":0,"status":"ok"}`
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	stdout, _ := captureOutputs(func() {
		internalotel.Run(cfg,
			[]string{"sh", "-c", "echo before; echo '" + sentinel + "'; echo after"},
			time.Second*2)
	})
	if strings.Contains(stdout, "BROWSERSTACK_WATCH_FLUSH") {
		t.Fatalf("sentinel leaked into stdout: %q", stdout)
	}
	if !strings.Contains(stdout, "before") || !strings.Contains(stdout, "after") {
		t.Fatalf("surrounding lines not preserved: %q", stdout)
	}
}

func TestRun_StderrPassthrough(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	_, stderr := captureOutputs(func() {
		internalotel.Run(cfg, []string{"sh", "-c", "echo error-line >&2"}, time.Second*2)
	})
	if !strings.Contains(stderr, "error-line") {
		t.Fatalf("stderr not forwarded: %q", stderr)
	}
}

func TestRun_StderrNotMangledByStdout(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	stdout, stderr := captureOutputs(func() {
		internalotel.Run(cfg,
			[]string{"sh", "-c", "echo stdout-msg; echo stderr-msg >&2"},
			time.Second*2)
	})
	if !strings.Contains(stdout, "stdout-msg") {
		t.Fatalf("stdout missing: %q", stdout)
	}
	if !strings.Contains(stderr, "stderr-msg") {
		t.Fatalf("stderr missing: %q", stderr)
	}
	if strings.Contains(stdout, "stderr-msg") {
		t.Fatalf("stderr leaked into stdout: %q", stdout)
	}
	if strings.Contains(stderr, "stdout-msg") {
		t.Fatalf("stdout leaked into stderr: %q", stderr)
	}
}

func TestRun_ExitCodeNonZero(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	var code int
	captureOutputs(func() {
		code, _ = internalotel.Run(cfg, []string{"sh", "-c", "exit 13"}, time.Second*2)
	})
	if code != 13 {
		t.Fatalf("expected exit code 13, got %d", code)
	}
}

func TestRun_ExitCodePreservedWithOutput(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	var code int
	stdout, _ := captureOutputs(func() {
		code, _ = internalotel.Run(cfg,
			[]string{"sh", "-c", "echo output-before-fail; exit 5"},
			time.Second*2)
	})
	if code != 5 {
		t.Fatalf("expected exit code 5, got %d", code)
	}
	if !strings.Contains(stdout, "output-before-fail") {
		t.Fatalf("stdout not preserved alongside non-zero exit: %q", stdout)
	}
}

func TestRun_SentinelFlushWait(t *testing.T) {
	sentinel := `BROWSERSTACK_WATCH_FLUSH:{"spans":7,"logs":1,"status":"ok"}`
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	var code int
	stdout, _ := captureOutputs(func() {
		code, _ = internalotel.Run(cfg,
			[]string{"sh", "-c", "echo real-output; echo '" + sentinel + "'"},
			time.Second*5)
	})
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
	if strings.Contains(stdout, "BROWSERSTACK_WATCH_FLUSH") {
		t.Fatalf("sentinel must not appear in stdout: %q", stdout)
	}
	if !strings.Contains(stdout, "real-output") {
		t.Fatalf("real output missing from stdout: %q", stdout)
	}
}

func TestRun_FlushTimeoutStillPropagatesExitCode(t *testing.T) {
	// No sentinel written — flush timeout fires; exit code must still be correct.
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	var code int
	captureOutputs(func() {
		code, _ = internalotel.Run(cfg, []string{"sh", "-c", "exit 99"}, time.Millisecond*200)
	})
	if code != 99 {
		t.Fatalf("expected exit code 99 after flush timeout, got %d", code)
	}
}

// ── RunPassthrough: stdout / stderr / exit code ───────────────────────────────

func TestRunPassthrough_StdoutPassthrough(t *testing.T) {
	var code int
	stdout, _ := captureOutputs(func() {
		code, _ = internalotel.RunPassthrough([]string{"sh", "-c", "echo passthrough-line"})
	})
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
	if !strings.Contains(stdout, "passthrough-line") {
		t.Fatalf("stdout not forwarded in passthrough: %q", stdout)
	}
}

func TestRunPassthrough_StderrPassthrough(t *testing.T) {
	_, stderr := captureOutputs(func() {
		internalotel.RunPassthrough([]string{"sh", "-c", "echo passthrough-err >&2"})
	})
	if !strings.Contains(stderr, "passthrough-err") {
		t.Fatalf("stderr not forwarded in passthrough: %q", stderr)
	}
}

func TestRunPassthrough_SentinelNotStripped(t *testing.T) {
	// RunPassthrough does zero filtering — sentinel appears verbatim in stdout.
	sentinel := `BROWSERSTACK_WATCH_FLUSH:{"spans":1,"logs":0,"status":"ok"}`
	stdout, _ := captureOutputs(func() {
		internalotel.RunPassthrough([]string{"sh", "-c", "echo '" + sentinel + "'"})
	})
	if !strings.Contains(stdout, "BROWSERSTACK_WATCH_FLUSH") {
		t.Fatalf("passthrough should NOT strip sentinel: %q", stdout)
	}
}

func TestRunPassthrough_ExitCodeNonZero(t *testing.T) {
	var code int
	captureOutputs(func() {
		code, _ = internalotel.RunPassthrough([]string{"sh", "-c", "exit 88"})
	})
	if code != 88 {
		t.Fatalf("expected exit code 88, got %d", code)
	}
}
