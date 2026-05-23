package local

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

const (
	downloadBaseURL        = "https://www.browserstack.com/browserstack-local"
	binaryName             = "BrowserStackLocal"
	defaultDownloadTimeout = 5 * time.Minute
)

// DaemonResponse is the JSON output from the BrowserStackLocal binary.
type DaemonResponse struct {
	State   string `json:"state"`
	Status  string `json:"status"`
	PID     int    `json:"pid"`
	Message any    `json:"message"`
}

// EnsureBinaryExists returns the path to the BrowserStackLocal binary,
// downloading it if it doesn't already exist.
func EnsureBinaryExists(binHome string) (string, error) {
	if err := os.MkdirAll(binHome, 0755); err != nil {
		return "", fmt.Errorf("create binHome: %w", err)
	}
	binPath := binaryPath(binHome)
	if _, err := os.Stat(binPath); err == nil {
		return binPath, nil
	}
	return downloadBinary(binHome)
}

// ExecDaemon runs the BrowserStackLocal binary with the given args under ctx.
// On EACCES or non-JSON output it deletes the binary, re-downloads, and retries once.
func ExecDaemon(ctx context.Context, binHome, binPath string, args []string) (*DaemonResponse, error) {
	resp, err := execOnce(ctx, binPath, args)
	if err == nil {
		return resp, nil
	}

	if isPermissionError(err) || errors.Is(err, errNonJSON) {
		_ = os.Remove(binPath)
		newPath, dlErr := downloadBinary(binHome)
		if dlErr != nil {
			return nil, fmt.Errorf("re-download after exec error: %w", dlErr)
		}
		return execOnce(ctx, newPath, args)
	}
	return nil, err
}

var errNonJSON = errors.New("non-JSON output from binary")

func execOnce(ctx context.Context, binPath string, args []string) (*DaemonResponse, error) {
	cmd := exec.CommandContext(ctx, binPath, args...)
	out, err := cmd.Output()
	if err != nil {
		var exitErr *exec.ExitError
		if errors.As(err, &exitErr) {
			var resp DaemonResponse
			if jerr := json.Unmarshal(bytes.TrimSpace(exitErr.Stderr), &resp); jerr == nil {
				return nil, fmt.Errorf("%s", ExtractMessage(resp.Message))
			}
		}
		if isPermissionError(err) {
			return nil, err
		}
		return nil, fmt.Errorf("exec binary: %w", err)
	}

	trimmed := bytes.TrimSpace(out)
	var resp DaemonResponse
	if err := json.Unmarshal(trimmed, &resp); err != nil {
		return nil, errNonJSON
	}
	return &resp, nil
}

func isPermissionError(err error) bool {
	return err != nil && errors.Is(err, os.ErrPermission)
}

func downloadBinary(binHome string) (string, error) {
	osArch, err := currentOSArch()
	if err != nil {
		return "", err
	}

	url := fmt.Sprintf("%s/%s-%s.zip", downloadBaseURL, binaryName, osArch)
	ctx, cancel := context.WithTimeout(context.Background(), defaultDownloadTimeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return "", err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("download binary: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("download binary: HTTP %d for %s", resp.StatusCode, url)
	}

	const maxBinarySize = 100 * 1024 * 1024 // 100 MB
	zipData, err := io.ReadAll(io.LimitReader(resp.Body, maxBinarySize))
	if err != nil {
		return "", fmt.Errorf("read zip: %w", err)
	}

	binPath, err := extractZip(zipData, binHome)
	if err != nil {
		return "", fmt.Errorf("extract zip: %w", err)
	}
	return binPath, nil
}

func extractZip(zipData []byte, destDir string) (string, error) {
	r, err := zip.NewReader(bytes.NewReader(zipData), int64(len(zipData)))
	if err != nil {
		return "", err
	}

	expectedName := binaryName
	if runtime.GOOS == "windows" {
		expectedName = binaryName + ".exe"
	}

	for _, f := range r.File {
		if f.Name != expectedName {
			continue
		}
		rc, err := f.Open()
		if err != nil {
			return "", err
		}
		data, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			return "", err
		}

		destPath := binaryPath(destDir)
		tmpPath := destPath + ".tmp"
		defer os.Remove(tmpPath) // clean up on rename failure
		if err := os.WriteFile(tmpPath, data, 0755); err != nil {
			return "", err
		}
		if err := os.Rename(tmpPath, destPath); err != nil {
			return "", err
		}
		return destPath, nil
	}
	return "", fmt.Errorf("binary %q not found in zip", expectedName)
}

func binaryPath(binHome string) string {
	name := binaryName
	if runtime.GOOS == "windows" {
		name = binaryName + ".exe"
	}
	return filepath.Join(binHome, name)
}

// currentOSArch returns the BrowserStack OS/arch string for the current platform.
func currentOSArch() (string, error) {
	switch runtime.GOOS {
	case "darwin":
		if runtime.GOARCH == "arm64" {
			return "darwin-arm64", nil
		}
		return "darwin-x64", nil
	case "windows":
		return "win32", nil
	case "linux":
		if isMusl() {
			return "alpine", nil
		}
		if runtime.GOARCH == "386" {
			return "linux-ia32", nil
		}
		return "linux-x64", nil
	default:
		return "", fmt.Errorf("unsupported OS: %s", runtime.GOOS)
	}
}

// isMusl detects musl libc (Alpine Linux) by checking /proc/self/maps.
func isMusl() bool {
	data, err := os.ReadFile("/proc/self/maps")
	if err != nil {
		return false
	}
	return strings.Contains(string(data), "musl")
}

// ExtractMessage extracts the human-readable message from a DaemonResponse.Message.
func ExtractMessage(msg any) string {
	if msg == nil {
		return ""
	}
	switch v := msg.(type) {
	case string:
		return v
	case map[string]any:
		if s, ok := v["message"].(string); ok {
			return s
		}
	}
	return fmt.Sprintf("%v", msg)
}
