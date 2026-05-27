package main

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func buildWatchCommand() *cobra.Command {
	observe := &cobra.Command{
		Use:   "watch",
		Short: "Instrument test runs and upload results",
	}
	observe.AddCommand(buildUseReporterCommand())
	observe.AddCommand(buildWatchStartCommand())
	return observe
}

func buildUseReporterCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "use-reporter",
		Short: "Extract the embedded reporter bundle and print its path",
		Long: `Extracts the embedded register.cjs reporter bundle to
~/.browserstack/watch/<hash>/register.cjs (idempotent) and prints the
absolute path to stdout.

Use this to wire the reporter manually:

  NODE_OPTIONS="--require $(browserstack-client test-reporting watch use-reporter)" npx playwright test`,
		RunE: func(cmd *cobra.Command, args []string) error {
			cacheDir, err := internalotel.DefaultCacheDir()
			if err != nil {
				return err
			}
			path, err := internalotel.EnsureReporter(cacheDir)
			if err != nil {
				return err
			}
			fmt.Println(path)
			return nil
		},
	}
}

func buildWatchStartCommand() *cobra.Command {
	var (
		endpoint            string
		headers             string
		flushTimeout        string
		batchSize           string
		batchTimeout        string
		exportTimeout       string
		attachmentThreshold string
	)

	cmd := &cobra.Command{
		Use:   "start -- <command> [args...]",
		Short: "Wrap a test command to instrument and record results",
		Long: `Transparent process wrapper that injects the embedded reporter and
runs your command with stdout, stderr, stdin, and exit codes passed through.

When no endpoint is configured (no --endpoint flag and no BROWSERSTACK_WATCH_ENDPOINT
or OTEL_EXPORTER_OTLP_ENDPOINT env var), the command is run without instrumentation
so tests always execute and their exit code is always propagated.

Example:
  browserstack-client test-reporting watch start -- npx playwright test
  browserstack-client test-reporting watch start -- npx mocha test/**/*.spec.js`,
		Args: cobra.ArbitraryArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			if len(args) == 0 {
				return fmt.Errorf("no command provided after --")
			}

			// Resolve endpoint from flag or env.
			// When absent, run the command without instrumentation so tests still execute.
			ep := endpoint
			if ep == "" {
				ep = os.Getenv("BROWSERSTACK_WATCH_ENDPOINT")
			}
			if ep == "" {
				ep = os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
			}
			if ep == "" {
				exitCode, err := internalotel.RunPassthrough(args)
				if err != nil {
					return err
				}
				os.Exit(exitCode)
				return nil
			}

			// Resolve headers from flag or env
			hdrs := headers
			if hdrs == "" {
				hdrs = os.Getenv("BROWSERSTACK_WATCH_HEADERS")
			}
			if hdrs == "" {
				hdrs = os.Getenv("OTEL_EXPORTER_OTLP_HEADERS")
			}

			// Resolve flush timeout
			ft := flushTimeout
			if ft == "" {
				ft = os.Getenv("BROWSERSTACK_WATCH_FLUSH_TIMEOUT")
			}
			if ft == "" {
				ft = "30s"
			}
			flushDur, err := time.ParseDuration(ft)
			if err != nil {
				return fmt.Errorf("invalid --flush-timeout %q: %w", ft, err)
			}

			// Ensure reporter is extracted
			cacheDir, err := internalotel.DefaultCacheDir()
			if err != nil {
				return err
			}
			reporterPath, err := internalotel.EnsureReporter(cacheDir)
			if err != nil {
				return fmt.Errorf("ensure reporter: %w", err)
			}

			cfg := internalotel.Config{
				ReporterPath:        reporterPath,
				Endpoint:            ep,
				Headers:             hdrs,
				FlushTimeout:        ft,
				BatchSize:           batchSize,
				BatchTimeout:        batchTimeout,
				ExportTimeout:       exportTimeout,
				AttachmentThreshold: attachmentThreshold,
			}

			exitCode, err := internalotel.Run(cfg, args, flushDur)
			if err != nil {
				return err
			}
			os.Exit(exitCode)
			return nil
		},
	}

	cmd.Flags().StringVar(&endpoint, "endpoint", "", "OTLP base URL (or set BROWSERSTACK_WATCH_ENDPOINT)")
	cmd.Flags().StringVar(&headers, "headers", "", "Auth headers: key=value,key=value (or set BROWSERSTACK_WATCH_HEADERS)")
	cmd.Flags().StringVar(&flushTimeout, "flush-timeout", "", "Max wait for reporter flush after exit (default 30s)")
	cmd.Flags().StringVar(&batchSize, "batch-size", "", "Max spans per export batch (default 512)")
	cmd.Flags().StringVar(&batchTimeout, "batch-timeout", "", "Max time before flushing partial batch (default 5s)")
	cmd.Flags().StringVar(&exportTimeout, "export-timeout", "", "Per-export-request timeout (default 10s)")
	cmd.Flags().StringVar(&attachmentThreshold, "attachment-threshold", "", "Max inline attachment size (default 5MB)")

	return cmd
}
