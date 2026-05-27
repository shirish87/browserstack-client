package main

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func buildWatchCommand() *cobra.Command {
	watch := &cobra.Command{
		Use:   "watch",
		Short: "Instrument test runs with OpenTelemetry",
		Long: `Wrap your test command to collect OpenTelemetry spans and ship them to any
OTLP-compatible backend (Grafana, Jaeger, Tempo, Honeycomb, etc.).

The embedded reporter is injected automatically — no changes to your project
config are needed. For Playwright, the reporter is injected via --reporter so
that terminal output is preserved alongside instrumentation.

When no endpoint is configured the command runs unchanged and its exit code is
always propagated, so this wrapper is safe to leave in CI pipelines.

Subcommands:
  start      Wrap a test command with instrumentation
  reporter   Print the path to the extracted reporter bundle

Playwright quick-start:
  export BROWSERSTACK_WATCH_ENDPOINT=https://otlp.example.com
  export BROWSERSTACK_WATCH_HEADERS="Authorization=Basic <base64>"
  browserstack-client test-reporting watch start -- npx playwright test

Manual reporter wiring (if you prefer explicit config):
  browserstack-client test-reporting watch reporter
  # paste the printed path into playwright.config.ts reporter array`,
	}
	watch.AddCommand(buildUseReporterCommand())
	watch.AddCommand(buildWatchStartCommand())
	return watch
}

func buildUseReporterCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "reporter",
		Short: "Print the path to the extracted reporter bundle",
		Long: `Extracts the embedded register.cjs bundle to
~/.browserstack/watch/<hash>/register.cjs (idempotent, content-addressed)
and prints the absolute path to stdout.

The hash changes only when the bundle content changes, so repeated calls are
instant after the first extraction.

Use this when you want to wire the reporter explicitly instead of using
"watch start":

  # Playwright config
  reporter: [['list'], ['/path/from/reporter']]

  # Or via NODE_OPTIONS for non-Playwright frameworks
  NODE_OPTIONS="--require $(browserstack-client test-reporting watch reporter)" npx mocha`,
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
		Short: "Wrap a test command with OpenTelemetry instrumentation",
		Long: `Transparent process wrapper that injects the embedded OpenTelemetry reporter
and runs your command with stdout, stderr, stdin, and exit codes passed through
unchanged.

Reporter injection:
  - Playwright   --reporter list,<path> is injected after "playwright test" so
                 terminal output is preserved alongside instrumentation.
  - Other        NODE_OPTIONS=--require <path> loads the reporter in each Node
                 process via the standard require hook.

No endpoint configured? The command runs as-is with no instrumentation. The
exit code is always propagated regardless, so this wrapper is safe to keep in
CI even before an endpoint is set up.

Environment variables (all optional — flags take precedence):
  BROWSERSTACK_WATCH_ENDPOINT           OTLP base URL
  BROWSERSTACK_WATCH_HEADERS            Auth headers (key=value,key=value)
  BROWSERSTACK_WATCH_FLUSH_TIMEOUT      Max wait after exit for reporter flush
  BROWSERSTACK_WATCH_BATCH_SIZE         Max spans per export batch
  BROWSERSTACK_WATCH_BATCH_TIMEOUT      Max time before flushing a partial batch
  BROWSERSTACK_WATCH_EXPORT_TIMEOUT     Per-export-request timeout
  BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD  Max inline attachment size

Playwright examples:
  browserstack-client test-reporting watch start -- npx playwright test
  browserstack-client test-reporting watch start --project chromium -- npx playwright test
  browserstack-client test-reporting watch start \
    --endpoint https://otlp.example.com \
    --headers "Authorization=Basic <base64>" \
    -- npx playwright test --reporter list`,
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
