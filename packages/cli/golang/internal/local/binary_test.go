package local

import (
	"runtime"
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
		"linux-x64":  true,
		"linux-ia32": true,
		"alpine":     true,
		"darwin-x64": true,
		"win32":      true,
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
