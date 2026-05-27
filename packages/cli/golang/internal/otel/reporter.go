package otel

import (
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"
)

// EnsureReporter extracts the embedded register.cjs to cacheDir/<hash>/register.cjs
// if not already present. Returns the absolute path to the file.
func EnsureReporter(cacheDir string) (string, error) {
	bundle := BundleBytes()
	hash := fmt.Sprintf("%x", sha256.Sum256(bundle))[:16]
	outDir := filepath.Join(cacheDir, hash)
	outPath := filepath.Join(outDir, "register.cjs")

	if _, err := os.Stat(outPath); err == nil {
		return outPath, nil // already extracted
	}

	if err := os.MkdirAll(outDir, 0755); err != nil {
		return "", fmt.Errorf("create cache dir: %w", err)
	}
	if err := os.WriteFile(outPath, bundle, 0644); err != nil {
		return "", fmt.Errorf("write reporter: %w", err)
	}
	return outPath, nil
}

// DefaultCacheDir returns ~/.browserstack/watch as the cache directory.
func DefaultCacheDir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("home dir: %w", err)
	}
	return filepath.Join(home, ".browserstack", "watch"), nil
}
