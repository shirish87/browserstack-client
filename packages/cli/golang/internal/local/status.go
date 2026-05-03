package local

import (
	"encoding/json"
	"os"
	"path/filepath"
)

// StatusFile tracks local tunnel instances started by this CLI.
type StatusFile struct {
	LocalIdentifiers []string `json:"localIdentifiers"`
}

// ReadStatus reads the status file at statusPath, creating it with an empty
// LocalIdentifiers list if it does not exist.
func ReadStatus(statusPath string) (*StatusFile, error) {
	data, err := os.ReadFile(statusPath)
	if err != nil {
		if os.IsNotExist(err) {
			s := &StatusFile{LocalIdentifiers: []string{}}
			if werr := WriteStatus(statusPath, s); werr != nil {
				return nil, werr
			}
			return s, nil
		}
		return nil, err
	}

	var s StatusFile
	if err := json.Unmarshal(data, &s); err != nil {
		return nil, err
	}
	if s.LocalIdentifiers == nil {
		s.LocalIdentifiers = []string{}
	}
	return &s, nil
}

// WriteStatus atomically writes s to statusPath, deduplicating LocalIdentifiers.
func WriteStatus(statusPath string, s *StatusFile) error {
	seen := make(map[string]bool)
	unique := s.LocalIdentifiers[:0:0]
	for _, id := range s.LocalIdentifiers {
		if !seen[id] {
			seen[id] = true
			unique = append(unique, id)
		}
	}
	s.LocalIdentifiers = unique

	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}

	tmp := statusPath + ".tmp"
	defer os.Remove(tmp) // clean up on rename failure
	if err := os.MkdirAll(filepath.Dir(statusPath), 0755); err != nil {
		return err
	}
	if err := os.WriteFile(tmp, data, 0644); err != nil {
		return err
	}
	return os.Rename(tmp, statusPath)
}
