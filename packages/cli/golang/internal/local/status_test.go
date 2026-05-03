package local

import (
	"os"
	"path/filepath"
	"testing"
)

func TestReadStatus_missingFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")
	s, err := ReadStatus(path)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if s.LocalIdentifiers == nil {
		t.Error("LocalIdentifiers should be empty slice, not nil")
	}
	if len(s.LocalIdentifiers) != 0 {
		t.Errorf("expected empty, got %v", s.LocalIdentifiers)
	}
	if _, err := os.Stat(path); os.IsNotExist(err) {
		t.Error("status file should be created on first read")
	}
}

func TestReadStatus_existingFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")
	if err := os.WriteFile(path, []byte(`{"localIdentifiers":["id1","id2"]}`), 0644); err != nil {
		t.Fatal(err)
	}
	s, err := ReadStatus(path)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(s.LocalIdentifiers) != 2 || s.LocalIdentifiers[0] != "id1" || s.LocalIdentifiers[1] != "id2" {
		t.Errorf("got %v", s.LocalIdentifiers)
	}
}

func TestWriteStatus_roundtrip(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")
	s := &StatusFile{LocalIdentifiers: []string{"abc", "def"}}
	if err := WriteStatus(path, s); err != nil {
		t.Fatalf("write error: %v", err)
	}
	s2, err := ReadStatus(path)
	if err != nil {
		t.Fatalf("read error: %v", err)
	}
	if len(s2.LocalIdentifiers) != 2 || s2.LocalIdentifiers[0] != "abc" {
		t.Errorf("got %v", s2.LocalIdentifiers)
	}
}

func TestWriteStatus_deduplicates(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")
	s := &StatusFile{LocalIdentifiers: []string{"id1", "id1", "id2"}}
	if err := WriteStatus(path, s); err != nil {
		t.Fatal(err)
	}
	s2, err := ReadStatus(path)
	if err != nil {
		t.Fatal(err)
	}
	if len(s2.LocalIdentifiers) != 2 {
		t.Errorf("expected deduplication, got %v", s2.LocalIdentifiers)
	}
}
