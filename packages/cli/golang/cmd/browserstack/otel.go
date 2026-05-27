package main

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func buildOtelCommand() *cobra.Command {
	otel := &cobra.Command{
		Use:   "otel",
		Short: "OpenTelemetry test instrumentation",
	}
	otel.AddCommand(buildUseReporterCommand())
	otel.AddCommand(buildOtelStartCommand())
	return otel
}

func buildUseReporterCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "use-reporter",
		Short: "Extract the embedded OTEL reporter bundle and print its path",
		Long: `Extracts the embedded register.cjs reporter bundle to
~/.browserstack/otel/<hash>/register.cjs (idempotent) and prints the
absolute path to stdout.

Use this to wire the reporter manually:

  NODE_OPTIONS="--require $(browserstack-client otel use-reporter)" npx playwright test`,
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

func buildOtelStartCommand() *cobra.Command {
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
		Short: "Wrap a test command with OTEL instrumentation",
		Long: `Transparent process wrapper. Sets NODE_OPTIONS and PLAYWRIGHT_REPORTER
to inject the embedded reporter, then runs your command with all stdout,
stderr, stdin, and exit codes passed through unchanged.

Example:
  browserstack-client otel start -- npx playwright test
  browserstack-client otel start -- npx mocha test/**/*.spec.js`,
		Args: cobra.ArbitraryArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			// Resolve endpoint from flag or env
			ep := endpoint
			if ep == "" {
				ep = os.Getenv("BROWSERSTACK_OTEL_ENDPOINT")
			}
			if ep == "" {
				return fmt.Errorf("--endpoint or BROWSERSTACK_OTEL_ENDPOINT is required")
			}

			// Resolve headers from flag or env
			hdrs := headers
			if hdrs == "" {
				hdrs = os.Getenv("BROWSERSTACK_OTEL_HEADERS")
			}

			// Resolve flush timeout
			ft := flushTimeout
			if ft == "" {
				ft = os.Getenv("BROWSERSTACK_OTEL_FLUSH_TIMEOUT")
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

			if len(args) == 0 {
				return fmt.Errorf("no command provided after --")
			}

			exitCode, err := internalotel.Run(cfg, args, flushDur)
			if err != nil {
				return err
			}
			os.Exit(exitCode)
			return nil
		},
	}

	cmd.Flags().StringVar(&endpoint, "endpoint", "", "OTLP base URL (or set BROWSERSTACK_OTEL_ENDPOINT)")
	cmd.Flags().StringVar(&headers, "headers", "", "Auth headers: key=value,key=value (or set BROWSERSTACK_OTEL_HEADERS)")
	cmd.Flags().StringVar(&flushTimeout, "flush-timeout", "", "Max wait for reporter flush after exit (default 30s)")
	cmd.Flags().StringVar(&batchSize, "batch-size", "", "Max spans per export batch (default 512)")
	cmd.Flags().StringVar(&batchTimeout, "batch-timeout", "", "Max time before flushing partial batch (default 5s)")
	cmd.Flags().StringVar(&exportTimeout, "export-timeout", "", "Per-export-request timeout (default 10s)")
	cmd.Flags().StringVar(&attachmentThreshold, "attachment-threshold", "", "Max inline attachment size (default 5MB)")

	return cmd
}
