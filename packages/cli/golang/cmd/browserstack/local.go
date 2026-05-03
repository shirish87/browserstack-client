package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strings"
	"sync"
	"syscall"

	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	browserstacklocal "github.com/browserstack/browserstack-client/internal/local"
)

const UsageLocal = `Usage: local <action> [args...]
Actions: start, stop, list, run-with, list-instances, get-instance, disconnect-instance
Note: run-with accepts -- or --- as the command separator (use --- in Windows PowerShell)`

func runLocalWrapper(c *browserstackhttp.Client, accessKey, action string, args []string) error {
	if action == "help" {
		fmt.Println(UsageLocal)
		return nil
	}

	binaryActions := map[string]bool{"start": true, "stop": true, "list": true, "run-with": true}
	if binaryActions[action] {
		return runLocal(accessKey, action, args)
	}

	return runLocalTesting(c, action, args)
}

func defaultBinHome() string {
	if v := os.Getenv("BROWSERSTACK_LOCAL_BINARY_HOME"); v != "" {
		return v
	}
	// BROWSERSTACK_LOCAL_BINARY_PATH is treated as a directory path (binHome), not a file path.
	if v := os.Getenv("BROWSERSTACK_LOCAL_BINARY_PATH"); v != "" {
		return v
	}
	home, err := os.UserHomeDir()
	if err != nil {
		home = os.TempDir()
	}
	return filepath.Join(home, ".browserstack")
}

func runLocal(accessKey, action string, args []string) error {
	switch action {
	case "start":
		return localStart(accessKey, args)
	case "stop":
		return localStop(accessKey, args)
	case "list":
		return localList()
	case "run-with":
		return localRunWith(accessKey, args)
	default:
		return fmt.Errorf("invalid action: %s\n%s", action, UsageLocal)
	}
}

func localStart(accessKey string, args []string) error {
	opts, err := browserstacklocal.ParseArgs(args, accessKey)
	if err != nil {
		return err
	}

	binHome := defaultBinHome()
	opts.BinHome = binHome
	statusPath := filepath.Join(binHome, "status.json")

	binPath, err := browserstacklocal.EnsureBinaryExists(binHome)
	if err != nil {
		return fmt.Errorf("ensure binary: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), opts.CommandTimeout)
	defer cancel()

	daemonArgs := opts.DaemonArgs("start")
	resp, err := browserstacklocal.ExecDaemon(ctx, binHome, binPath, daemonArgs)
	if err != nil {
		if ctx.Err() != nil {
			fmt.Fprintf(os.Stderr, "%s: Failed to complete command within %dms timeout\n",
				opts.LocalIdentifier, opts.CommandTimeout.Milliseconds())
			return fmt.Errorf("timeout")
		}
		fmt.Fprintf(os.Stderr, "%s: %s\n", opts.LocalIdentifier, err.Error())
		return err
	}

	if resp.State != "connected" {
		return fmt.Errorf("%s: unexpected state %q: %s", opts.LocalIdentifier, resp.State, browserstacklocal.ExtractMessage(resp.Message))
	}

	s, err := browserstacklocal.ReadStatus(statusPath)
	if err != nil {
		return err
	}
	s.LocalIdentifiers = append(s.LocalIdentifiers, opts.LocalIdentifier)
	if err := browserstacklocal.WriteStatus(statusPath, s); err != nil {
		return err
	}

	fmt.Printf("%s: %s\n", opts.LocalIdentifier, browserstacklocal.ExtractMessage(resp.Message))
	return nil
}

func localStop(accessKey string, args []string) error {
	opts, err := browserstacklocal.ParseArgs(args, accessKey)
	if err != nil {
		return err
	}

	binHome := defaultBinHome()
	opts.BinHome = binHome
	statusPath := filepath.Join(binHome, "status.json")

	s, err := browserstacklocal.ReadStatus(statusPath)
	if err != nil {
		return err
	}

	// Only treat LocalIdentifier as a filter when the user explicitly passed
	// --local-identifier. ParseArgs always generates one, so we re-check args.
	var explicitID string
	for i, a := range args {
		if a == "--local-identifier" && i+1 < len(args) {
			explicitID = strings.TrimSpace(args[i+1])
			break
		}
	}

	var toStop []string
	if explicitID != "" {
		if !contains(s.LocalIdentifiers, explicitID) {
			fmt.Fprintf(os.Stderr, "warning: --local-identifier %q is not tracked; stopping all tracked instances\n", explicitID)
		} else {
			toStop = []string{explicitID}
		}
	}
	if len(toStop) == 0 {
		toStop = append([]string{}, s.LocalIdentifiers...)
	}

	// Nothing tracked — exit cleanly without touching the binary.
	if len(toStop) == 0 {
		return nil
	}

	binPath, err := browserstacklocal.EnsureBinaryExists(binHome)
	if err != nil {
		return fmt.Errorf("ensure binary: %w", err)
	}

	remaining := append([]string{}, s.LocalIdentifiers...)
	for _, id := range toStop {
		stopOpts := *opts
		stopOpts.LocalIdentifier = id
		daemonArgs := stopOpts.DaemonArgs("stop")

		ctx, cancel := context.WithTimeout(context.Background(), opts.CommandTimeout)
		resp, execErr := browserstacklocal.ExecDaemon(ctx, binHome, binPath, daemonArgs)
		cancel()

		msg := ""
		if execErr != nil {
			if strings.Contains(strings.ToLower(execErr.Error()), "process instance not found") {
				msg = execErr.Error()
			} else {
				fmt.Fprintf(os.Stderr, "%s: %s\n", id, execErr.Error())
				continue
			}
		} else {
			msg = browserstacklocal.ExtractMessage(resp.Message)
		}

		fmt.Printf("%s: %s\n", id, msg)
		remaining = removeFrom(remaining, id)
	}

	s.LocalIdentifiers = remaining
	return browserstacklocal.WriteStatus(statusPath, s)
}

func localList() error {
	binHome := defaultBinHome()
	statusPath := filepath.Join(binHome, "status.json")
	s, err := browserstacklocal.ReadStatus(statusPath)
	if err != nil {
		return err
	}
	for _, id := range s.LocalIdentifiers {
		fmt.Println(id)
	}
	return nil
}

// runWithSeparators lists accepted command separators for run-with.
// "---" is provided as a Windows PowerShell alternative: PowerShell may
// consume "--" before it reaches the binary, whereas "---" passes through
// unchanged in both PowerShell and cmd.exe.
var runWithSeparators = []string{"--", "---"}

func findSeparator(args []string) int {
	for i, a := range args {
		for _, sep := range runWithSeparators {
			if a == sep {
				return i
			}
		}
	}
	return -1
}

func localRunWith(accessKey string, args []string) error {
	sep := findSeparator(args)
	if sep == -1 {
		return fmt.Errorf("run-with: no command separator -- (or --- on Windows PowerShell) found\n%s", UsageLocal)
	}
	cmdArgs := args[sep+1:]
	if len(cmdArgs) == 0 {
		return fmt.Errorf("run-with: no command provided after --\n%s", UsageLocal)
	}

	opts, err := browserstacklocal.ParseArgs(args[:sep], accessKey)
	if err != nil {
		return err
	}

	binHome := defaultBinHome()
	opts.BinHome = binHome
	statusPath := filepath.Join(binHome, "status.json")

	binPath, err := browserstacklocal.EnsureBinaryExists(binHome)
	if err != nil {
		return fmt.Errorf("ensure binary: %w", err)
	}

	startCtx, startCancel := context.WithTimeout(context.Background(), opts.CommandTimeout)
	defer startCancel()

	startResp, err := browserstacklocal.ExecDaemon(startCtx, binHome, binPath, opts.DaemonArgs("start"))
	if err != nil {
		return fmt.Errorf("start tunnel: %w", err)
	}
	if startResp.State != "connected" {
		return fmt.Errorf("unexpected start state %q", startResp.State)
	}

	s, _ := browserstacklocal.ReadStatus(statusPath)
	if s == nil {
		s = &browserstacklocal.StatusFile{LocalIdentifiers: []string{}}
	}
	s.LocalIdentifiers = append(s.LocalIdentifiers, opts.LocalIdentifier)
	_ = browserstacklocal.WriteStatus(statusPath, s)
	fmt.Printf("%s: %s\n", opts.LocalIdentifier, browserstacklocal.ExtractMessage(startResp.Message))

	var stopOnce sync.Once
	stopTunnel := func() {
		stopOnce.Do(func() {
			stopOpts := *opts
			stopCtx, stopCancel := context.WithTimeout(context.Background(), opts.CommandTimeout)
			defer stopCancel()
			resp, err := browserstacklocal.ExecDaemon(stopCtx, binHome, binPath, stopOpts.DaemonArgs("stop"))
			if err == nil {
				fmt.Printf("%s: %s\n", opts.LocalIdentifier, browserstacklocal.ExtractMessage(resp.Message))
			}
			if st, rerr := browserstacklocal.ReadStatus(statusPath); rerr == nil {
				st.LocalIdentifiers = removeFrom(st.LocalIdentifiers, opts.LocalIdentifier)
				_ = browserstacklocal.WriteStatus(statusPath, st)
			}
		})
	}

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigCh
		stopTunnel()
		os.Exit(1)
	}()
	defer stopTunnel()

	cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = append(os.Environ(),
		"BROWSERSTACK_LOCAL_ID="+opts.LocalIdentifier,
		"BROWSERSTACK_LOCAL_IDENTIFIER="+opts.LocalIdentifier,
	)
	if err := cmd.Run(); err != nil {
		return err
	}
	return nil
}

func contains(slice []string, s string) bool {
	for _, v := range slice {
		if v == s {
			return true
		}
	}
	return false
}

func removeFrom(slice []string, s string) []string {
	result := slice[:0:0]
	for _, v := range slice {
		if v != s {
			result = append(result, v)
		}
	}
	return result
}
