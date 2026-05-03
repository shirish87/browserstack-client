package local

import (
	"archive/zip"
	"bytes"
	"runtime"
	"strings"
	"testing"
)

func TestCurrentOSArch_returnsKnownValue(t *testing.T) {
	arch, err := currentOSArch()
	if err != nil {
		if runtime.GOOS == "linux" {
			t.Skipf("linux musl detection unavailable: %v", err)
		}
		t.Fatalf("unexpected error: %v", err)
	}
	valid := map[string]bool{
		"linux-x64":    true,
		"linux-ia32":   true,
		"alpine":       true,
		"darwin-x64":   true,
		"darwin-arm64": true,
		"win32":        true,
	}
	if !valid[arch] {
		t.Errorf("currentOSArch() = %q, not a recognized value", arch)
	}
}

func TestExtractMessage_stringValue(t *testing.T) {
	got := ExtractMessage("hello world")
	if got != "hello world" {
		t.Errorf("got %q", got)
	}
}

func TestExtractMessage_nestedObject(t *testing.T) {
	got := ExtractMessage(map[string]any{"message": "nested msg"})
	if got != "nested msg" {
		t.Errorf("got %q", got)
	}
}

func TestExtractMessage_nil(t *testing.T) {
	got := ExtractMessage(nil)
	if got != "" {
		t.Errorf("got %q, want empty", got)
	}
}

// --- Adversarial tests ---

func TestExtractMessage_numericValue(t *testing.T) {
	// float64 is how JSON numbers arrive via any; should not panic.
	got := ExtractMessage(42.0)
	if got == "" {
		t.Error("expected non-empty string for numeric value 42.0")
	}
	if !strings.Contains(got, "42") {
		t.Errorf("got %q, want string containing 42", got)
	}
}

func TestExtractMessage_emptyString(t *testing.T) {
	got := ExtractMessage("")
	if got != "" {
		t.Errorf("got %q, want empty string", got)
	}
}

func TestExtractMessage_nestedMapMissingMessageKey(t *testing.T) {
	// Map without "message" key — should not panic, should return non-empty.
	got := ExtractMessage(map[string]any{"other": "val"})
	if got == "" {
		t.Error("expected non-empty fallback string for map missing 'message' key")
	}
}

func TestExtractZip_invalidZipData(t *testing.T) {
	dir := t.TempDir()
	// Completely invalid zip bytes should return error, not panic.
	_, err := extractZip([]byte("this is not a zip file"), dir)
	if err == nil {
		t.Error("expected error for invalid zip data")
	}
}

func TestExtractZip_emptyZip(t *testing.T) {
	dir := t.TempDir()
	// Build a valid but empty zip archive.
	var buf bytes.Buffer
	w := zip.NewWriter(&buf)
	if err := w.Close(); err != nil {
		t.Fatal(err)
	}
	_, err := extractZip(buf.Bytes(), dir)
	if err == nil {
		t.Error("expected error for zip with no matching binary")
	}
}

func TestExtractZip_zipMissingBinary(t *testing.T) {
	dir := t.TempDir()
	// Build a zip containing a README but not the BrowserStackLocal binary.
	var buf bytes.Buffer
	w := zip.NewWriter(&buf)
	f, err := w.Create("README.txt")
	if err != nil {
		t.Fatal(err)
	}
	_, err = f.Write([]byte("hello"))
	if err != nil {
		t.Fatal(err)
	}
	if err := w.Close(); err != nil {
		t.Fatal(err)
	}

	_, extractErr := extractZip(buf.Bytes(), dir)
	if extractErr == nil {
		t.Error("expected error when binary not found in zip")
	}
	if !strings.Contains(extractErr.Error(), "not found in zip") {
		t.Errorf("error message should mention 'not found in zip', got: %v", extractErr)
	}
}

func TestBinaryPath_currentOS(t *testing.T) {
	dir := "/tmp/binarytest"
	p := binaryPath(dir)
	if !strings.HasPrefix(p, dir) {
		t.Errorf("binaryPath should be under %q, got %q", dir, p)
	}
	if runtime.GOOS == "windows" {
		if !strings.HasSuffix(p, "BrowserStackLocal.exe") {
			t.Errorf("on Windows, binaryPath should end in BrowserStackLocal.exe, got %q", p)
		}
	} else {
		if !strings.HasSuffix(p, "BrowserStackLocal") {
			t.Errorf("on non-Windows, binaryPath should end in BrowserStackLocal, got %q", p)
		}
	}
}
