package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/mattn/go-isatty"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	"github.com/browserstack/browserstack-client/generated/automate"
	localtesting "github.com/browserstack/browserstack-client/generated/local-testing"
	"github.com/browserstack/browserstack-client/generated/screenshots"
	testmanagement "github.com/browserstack/browserstack-client/generated/test-management"
	testreporting "github.com/browserstack/browserstack-client/generated/test-reporting"
	websitescanner "github.com/browserstack/browserstack-client/generated/website-scanner"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/tui"
)

// version is set at build time via -ldflags "-X main.version=<ver>"
var version = "dev"

func main() {
	root := buildRootCommand()
	if err := root.Execute(); err != nil {
		os.Exit(1)
	}
}

func buildRootCommand() *cobra.Command {
	root := &cobra.Command{
		Use:           "browserstack-client",
		Short:         "BrowserStack CLI",
		Version:       version,
		SilenceErrors: true,
		SilenceUsage:  true,
		// No args: launch TUI if stdout is a terminal, else print usage.
		RunE: func(cmd *cobra.Command, args []string) error {
			if !isatty.IsTerminal(os.Stdout.Fd()) {
				return cmd.Help()
			}
			username, accessKey, err := requireCreds()
			if err != nil {
				return err
			}
			prefills := map[string]string{"auth_token": accessKey}
			model := tui.NewModel(version, makeExecutor(username, accessKey), makePickerFetcher(username, accessKey), prefills)
			p := tea.NewProgram(model, tea.WithAltScreen())
			if _, err := p.Run(); err != nil {
				return fmt.Errorf("TUI error: %w", err)
			}
			return nil
		},
	}

	// Credentials are resolved lazily inside each RunE, so we only validate
	// them when an actual API call is made (not for --help or completion).

	username := os.Getenv("BROWSERSTACK_USERNAME")
	accessKey := os.Getenv("BROWSERSTACK_ACCESS_KEY")

	apiClient := browserstackhttp.New(baseURLAPI, username, accessKey)
	accessibilityClient := browserstackhttp.New(baseURLAccessibility, username, accessKey)
	testManagementClient := browserstackhttp.New(baseURLTestManagement, username, accessKey)
	screenshotsClient := browserstackhttp.New(baseURLScreenshots, username, accessKey)
	websiteScannerClient := browserstackhttp.New(baseURLWebsiteScanner, username, accessKey)

	type productDef struct {
		id          string
		description string
		run         func(action string, args []string) error
	}

	products := []productDef{
		{
			id:          automate.ProductAutomate,
			description: "Browser automation — builds, sessions, projects, logs",
			run: func(action string, args []string) error {
				_, ak, err := requireCreds()
				if err != nil {
					return err
				}
				c := browserstackhttp.New(baseURLAPI, os.Getenv("BROWSERSTACK_USERNAME"), ak)
				return runAutomate(c, action, args)
			},
		},
		{
			id:          appautomate.ProductAppAutomate,
			description: "Mobile app automation — builds, sessions, apps, devices",
			run: func(action string, args []string) error {
				_, ak, err := requireCreds()
				if err != nil {
					return err
				}
				c := browserstackhttp.New(baseURLAPI, os.Getenv("BROWSERSTACK_USERNAME"), ak)
				return runAppAutomate(c, action, args)
			},
		},
		{
			id:          screenshots.ProductScreenshots,
			description: "Cross-browser screenshot jobs",
			run: func(action string, args []string) error {
				if err := requireCredsEnv(); err != nil {
					return err
				}
				return runScreenshots(screenshotsClient, action, args)
			},
		},
		{
			id:          accessibility.ProductAccessibility,
			description: "Accessibility reports and automated test analysis",
			run: func(action string, args []string) error {
				if err := requireCredsEnv(); err != nil {
					return err
				}
				return runAccessibility(accessibilityClient, action, args)
			},
		},
		{
			id:          testmanagement.ProductTestManagement,
			description: "Test cases, test runs, test plans",
			run: func(action string, args []string) error {
				if err := requireCredsEnv(); err != nil {
					return err
				}
				return runTestManagement(testManagementClient, action, args)
			},
		},
		{
			id:          testreporting.ProductTestReporting,
			description: "Upload reports, track builds and quality gates",
			run: func(action string, args []string) error {
				u, ak, err := requireCreds()
				if err != nil {
					return err
				}
				return runTestReporting(u, ak, action, args)
			},
		},
		{
			id:          websitescanner.ProductWebsiteScanner,
			description: "Website compliance and accessibility scans",
			run: func(action string, args []string) error {
				if err := requireCredsEnv(); err != nil {
					return err
				}
				return runWebsiteScanner(websiteScannerClient, action, args)
			},
		},
		{
			id:          localtesting.ProductLocalTesting,
			description: "BrowserStack Local tunnel instances",
			run: func(action string, args []string) error {
				if err := requireCredsEnv(); err != nil {
					return err
				}
				return runLocalTesting(apiClient, action, args)
			},
		},
	}

	for _, pd := range products {
		pd := pd // capture
		productCmd := buildProductCommand(pd.id, pd.description, pd.run)
		root.AddCommand(productCmd)
	}

	// local tunnel management (binary wrapper, separate from local-testing API)
	localCmd := buildLocalCommand(apiClient, accessKey)
	root.AddCommand(localCmd)

	return root
}

// buildProductCommand builds a Cobra subcommand for a manifest-driven product.
// Each action in the TUI manifest becomes its own sub-subcommand.
func buildProductCommand(productID, description string, run func(action string, args []string) error) *cobra.Command {
	cmd := &cobra.Command{
		Use:                productID,
		Short:              description,
		DisableFlagParsing: false,
	}

	for i := range tui.Manifest {
		prod := &tui.Manifest[i]
		if prod.ID != productID {
			continue
		}
		for ri := range prod.Resources {
			for ai := range prod.Resources[ri].Actions {
				act := &prod.Resources[ri].Actions[ai]
				actionID := act.ID
				short := act.Summary
				long := tui.ActionHelp(productID, actionID)

				actionCmd := &cobra.Command{
					Use:  actionID,
					Short: short,
					Long:  long,
					Args:  cobra.ArbitraryArgs,
					RunE: func(cmd *cobra.Command, args []string) error {
						return run(actionID, args)
					},
				}
				cmd.AddCommand(actionCmd)
			}
		}
		break
	}

	return cmd
}

func requireCreds() (username, accessKey string, err error) {
	username = os.Getenv("BROWSERSTACK_USERNAME")
	accessKey = os.Getenv("BROWSERSTACK_ACCESS_KEY")
	if username == "" || accessKey == "" {
		return "", "", fmt.Errorf("BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set")
	}
	return username, accessKey, nil
}

func requireCredsEnv() error {
	_, _, err := requireCreds()
	return err
}
