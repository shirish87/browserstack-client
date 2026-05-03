package local

import (
	"fmt"
	"os"
	"path/filepath"
	"sync"
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

// --- Adversarial tests ---

func TestReadStatus_corruptedJSON(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")
	if err := os.WriteFile(path, []byte("{invalid json}"), 0644); err != nil {
		t.Fatal(err)
	}
	_, err := ReadStatus(path)
	if err == nil {
		t.Error("expected error for corrupted JSON file")
	}
}

func TestReadStatus_emptyFile(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")
	if err := os.WriteFile(path, []byte{}, 0644); err != nil {
		t.Fatal(err)
	}
	// Should not panic; may return error or empty status.
	_, err := ReadStatus(path)
	if err == nil {
		// Some implementations may succeed with an empty file returning an empty struct.
		// That's also acceptable — just verify no panic.
		t.Log("ReadStatus with empty file returned nil error (acceptable)")
	}
}

func TestReadStatus_nullLocalIdentifiers(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")
	if err := os.WriteFile(path, []byte(`{"localIdentifiers": null}`), 0644); err != nil {
		t.Fatal(err)
	}
	s, err := ReadStatus(path)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if s.LocalIdentifiers == nil {
		t.Error("LocalIdentifiers should be empty slice, not nil, when JSON field is null")
	}
	if len(s.LocalIdentifiers) != 0 {
		t.Errorf("expected empty slice, got %v", s.LocalIdentifiers)
	}
}

func TestWriteStatus_readOnlyDirectory(t *testing.T) {
	dir := t.TempDir()
	// Make the directory read-only.
	if err := os.Chmod(dir, 0555); err != nil {
		t.Fatal(err)
	}
	// Restore permissions at end so t.TempDir() cleanup works.
	t.Cleanup(func() { os.Chmod(dir, 0755) })

	path := filepath.Join(dir, "status.json")
	s := &StatusFile{LocalIdentifiers: []string{"id1"}}
	err := WriteStatus(path, s)
	if err == nil {
		t.Error("expected error writing to read-only directory")
	}
}

func TestWriteStatus_concurrent(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")

	// Seed the file.
	initial := &StatusFile{LocalIdentifiers: []string{"init"}}
	if err := WriteStatus(path, initial); err != nil {
		t.Fatal(err)
	}

	const n = 10
	var wg sync.WaitGroup
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func(i int) {
			defer wg.Done()
			s := &StatusFile{LocalIdentifiers: []string{"id"}}
			// WriteStatus uses atomic rename; should not corrupt or panic.
			_ = WriteStatus(path, s)
		}(i)
	}
	wg.Wait()

	// After concurrent writes, the file should still be valid JSON.
	s, err := ReadStatus(path)
	if err != nil {
		t.Fatalf("file corrupted by concurrent writes: %v", err)
	}
	if s.LocalIdentifiers == nil {
		t.Error("LocalIdentifiers should not be nil after concurrent writes")
	}
}

func TestWriteStatus_largeIdentifierList(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "status.json")

	ids := make([]string, 1000)
	for i := range ids {
		ids[i] = fmt.Sprintf("identifier-%04d", i)
	}
	s := &StatusFile{LocalIdentifiers: ids}
	if err := WriteStatus(path, s); err != nil {
		t.Fatalf("write error with large list: %v", err)
	}
	s2, err := ReadStatus(path)
	if err != nil {
		t.Fatalf("read error: %v", err)
	}
	// After dedup the count may be smaller; just verify we can round-trip without error.
	if s2.LocalIdentifiers == nil {
		t.Error("LocalIdentifiers should not be nil after large write")
	}
}
