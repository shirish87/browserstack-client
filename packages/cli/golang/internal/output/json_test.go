package output_test

import (
	"bytes"
	"io"
	"os"
	"strings"
	"testing"

	"github.com/browserstack/browserstack-client/internal/output"
)

func TestPrint(t *testing.T) {
	// Capture stdout
	old := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w

	type S struct {
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	if err := output.Print(S{Name: "my-build", Status: "passed"}); err != nil {
		t.Fatalf("Print returned error: %v", err)
	}

	w.Close()
	os.Stdout = old
	var buf bytes.Buffer
	io.Copy(&buf, r)

	got := buf.String()
	if !strings.Contains(got, `"name": "my-build"`) {
		t.Errorf("expected name field in output, got: %s", got)
	}
	if !strings.Contains(got, `"status": "passed"`) {
		t.Errorf("expected status field in output, got: %s", got)
	}
}

func TestPrintError(t *testing.T) {
	// Channels cannot be marshaled
	err := output.Print(make(chan int))
	if err == nil {
		t.Fatal("expected error marshaling channel, got nil")
	}
}
