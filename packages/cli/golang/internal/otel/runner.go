package otel

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"sync"
	"syscall"
	"time"
)

const flushSentinelPrefix = "BROWSERSTACK_WATCH_FLUSH:"

// FlushResult is parsed from the BROWSERSTACK_WATCH_FLUSH sentinel line.
type FlushResult struct {
	Spans  int    `json:"spans"`
	Logs   int    `json:"logs"`
	Status string `json:"status"`
	Reason string `json:"reason,omitempty"`
}

// ScanLines partitions lines into (flush result, non-sentinel lines).
// Returns nil FlushResult if no sentinel is found.
func ScanLines(lines []string) (*FlushResult, []string) {
	var result *FlushResult
	var filtered []string
	for _, line := range lines {
		if strings.HasPrefix(line, flushSentinelPrefix) {
			payload := line[len(flushSentinelPrefix):]
			var r FlushResult
			if err := json.Unmarshal([]byte(payload), &r); err == nil {
				result = &r
			}
			continue // consume sentinel — do not forward
		}
		filtered = append(filtered, line)
	}
	return result, filtered
}

// InjectPlaywrightReporter inserts --reporter list,<path> into playwright test args
// when the command looks like "npx playwright test ..." or "playwright test ...".
// "list" is prepended so terminal output is preserved alongside the OTEL reporter.
// The flag is inserted right after the "test" subcommand word.
func InjectPlaywrightReporter(args []string, reporterPath string) []string {
	for i, arg := range args {
		if (arg == "playwright" || strings.HasSuffix(arg, "/playwright")) && i+1 < len(args) && args[i+1] == "test" {
			result := make([]string, 0, len(args)+2)
			result = append(result, args[:i+2]...)
			result = append(result, "--reporter", "list,"+reporterPath)
			result = append(result, args[i+2:]...)
			return result
		}
	}
	return args
}

// RunPassthrough executes cmdArgs with inherited stdio and no instrumentation.
// The child's exit code is returned; the error is non-nil only for spawn failures.
func RunPassthrough(cmdArgs []string) (int, error) {
	if len(cmdArgs) == 0 {
		return 0, fmt.Errorf("no command provided")
	}
	cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		for sig := range sigCh {
			if cmd.Process != nil {
				_ = cmd.Process.Signal(sig)
			}
		}
	}()
	defer signal.Stop(sigCh)

	if err := cmd.Run(); err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			return exitErr.ExitCode(), nil
		}
		return 0, err
	}
	return 0, nil
}

// Run spawns cmd with the environment from MergeEnv(os.Environ(), cfg),
// proxies stdout/stderr/stdin, scans stdout for the flush sentinel,
// waits up to flushTimeout after child exit, and returns the child's exit code.
func Run(cfg Config, cmdArgs []string, flushTimeout time.Duration) (int, error) {
	if len(cmdArgs) == 0 {
		return 0, fmt.Errorf("no command provided")
	}

	// Inject Playwright reporter flag when running playwright test
	cmdArgs = InjectPlaywrightReporter(cmdArgs, cfg.ReporterPath)

	env := MergeEnv(os.Environ(), cfg)
	cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
	cmd.Env = env
	cmd.Stdin = os.Stdin

	stdoutPipe, err := cmd.StdoutPipe()
	if err != nil {
		return 0, fmt.Errorf("stdout pipe: %w", err)
	}
	stderrPipe, err := cmd.StderrPipe()
	if err != nil {
		return 0, fmt.Errorf("stderr pipe: %w", err)
	}

	if err := cmd.Start(); err != nil {
		return 0, fmt.Errorf("start command: %w", err)
	}

	// Forward signals to child
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		for sig := range sigCh {
			if cmd.Process != nil {
				_ = cmd.Process.Signal(sig)
			}
		}
	}()
	defer signal.Stop(sigCh)

	flushCh := make(chan *FlushResult, 1)
	var wg sync.WaitGroup

	// Stdout goroutine: scan for sentinel, proxy everything else
	wg.Add(1)
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stdoutPipe)
		for scanner.Scan() {
			line := scanner.Text()
			if strings.HasPrefix(line, flushSentinelPrefix) {
				payload := line[len(flushSentinelPrefix):]
				var r FlushResult
				if err := json.Unmarshal([]byte(payload), &r); err == nil {
					select {
					case flushCh <- &r:
					default:
					}
				}
				continue // consume sentinel — do not forward to our stdout
			}
			fmt.Println(line)
		}
	}()

	// Stderr goroutine: proxy verbatim
	wg.Add(1)
	go func() {
		defer wg.Done()
		_, _ = io.Copy(os.Stderr, stderrPipe)
	}()

	wg.Wait()
	cmdErr := cmd.Wait()

	// Determine exit code
	exitCode := 0
	if cmdErr != nil {
		if exitErr, ok := cmdErr.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		} else {
			return 0, cmdErr
		}
	}

	// Wait for flush sentinel up to flushTimeout
	if flushTimeout > 0 {
		select {
		case result := <-flushCh:
			if result.Status == "error" {
				_, _ = fmt.Fprintf(os.Stderr, "browserstack-watch: reporter flush error: %s\n", result.Reason)
			}
		case <-time.After(flushTimeout):
			_, _ = fmt.Fprintf(os.Stderr, "browserstack-watch: flush timeout after %s\n", flushTimeout)
		}
	}

	return exitCode, nil
}
