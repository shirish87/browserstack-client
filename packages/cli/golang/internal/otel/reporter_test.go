package otel_test

import (
	"os"
	"path/filepath"
	"testing"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func TestEnsureReporter_ExtractsFile(t *testing.T) {
	dir := t.TempDir()
	path, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatalf("EnsureReporter: %v", err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Fatalf("reporter file not found at %s: %v", path, err)
	}
}

func TestEnsureReporter_Idempotent(t *testing.T) {
	dir := t.TempDir()
	path1, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatal(err)
	}
	path2, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatal(err)
	}
	if path1 != path2 {
		t.Fatalf("paths differ: %s != %s", path1, path2)
	}
}

func TestEnsureReporter_UsesHashSubdir(t *testing.T) {
	dir := t.TempDir()
	path, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatal(err)
	}
	// Path must be <dir>/<hash>/register.cjs
	parent := filepath.Dir(path)
	if filepath.Dir(parent) != dir {
		t.Fatalf("expected <dir>/<hash>/register.cjs, got %s", path)
	}
	if filepath.Base(path) != "register.cjs" {
		t.Fatalf("expected register.cjs, got %s", filepath.Base(path))
	}
}
