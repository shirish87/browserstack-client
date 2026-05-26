package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/mattn/go-isatty"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	"github.com/browserstack/browserstack-client/generated/automate"
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
	if len(os.Args) >= 2 && os.Args[1] == "version" {
		fmt.Printf("browserstack-client %s\n", version)
		return
	}

	if len(os.Args) == 1 && isatty.IsTerminal(os.Stdout.Fd()) {
		username := os.Getenv("BROWSERSTACK_USERNAME")
		accessKey := os.Getenv("BROWSERSTACK_ACCESS_KEY")
		if username == "" || accessKey == "" {
			fmt.Fprintln(os.Stderr, "BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set")
			os.Exit(1)
		}
		prefills := map[string]string{
			"auth_token": accessKey,
		}
		model := tui.NewModel(version, makeExecutor(username, accessKey), makePickerFetcher(username, accessKey), prefills)
		p := tea.NewProgram(model, tea.WithAltScreen())
		if _, err := p.Run(); err != nil {
			fmt.Fprintf(os.Stderr, "TUI error: %v\n", err)
			os.Exit(1)
		}
		return
	}

	username := os.Getenv("BROWSERSTACK_USERNAME")
	accessKey := os.Getenv("BROWSERSTACK_ACCESS_KEY")

	if username == "" || accessKey == "" {
		fmt.Fprintln(os.Stderr, "BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set")
		os.Exit(1)
	}

	product := ""
	if len(os.Args) >= 2 {
		product = os.Args[1]
	}

	if product == "help" {
		fmt.Println(`Usage: browserstack-client <product> <action> [args...]
       browserstack-client version

Products:
  automate          Browser automation — builds, sessions, projects, logs
  app-automate      Mobile app automation — builds, sessions, apps, devices
  screenshots       Cross-browser screenshot jobs
  accessibility     Accessibility reports and automated test analysis
  website-scanner   Website compliance and accessibility scans
  test-management   Test cases, test runs, test plans
  test-reporting    Upload reports, track builds and quality gates
  local             BrowserStack Local tunnel management

Run 'browserstack-client <product> help' for a full list of actions.`)
		return
	}

	if len(os.Args) < 3 {
		fmt.Fprintln(os.Stderr, "Usage: browserstack-client <product> <action> [args...]")
		fmt.Fprintln(os.Stderr, "Run 'browserstack-client help' for available products and actions.")
		os.Exit(1)
	}

	action := os.Args[2]
	args := os.Args[3:]

	apiClient := browserstackhttp.New(baseURLAPI, username, accessKey)
	accessibilityClient := browserstackhttp.New(baseURLAccessibility, username, accessKey)
	testManagementClient := browserstackhttp.New(baseURLTestManagement, username, accessKey)
	screenshotsClient := browserstackhttp.New(baseURLScreenshots, username, accessKey)
	websiteScannerClient := browserstackhttp.New(baseURLWebsiteScanner, username, accessKey)

	var err error
	switch product {
	case "local":
		err = runLocalWrapper(apiClient, accessKey, action, args)
	case automate.ProductAutomate:
		err = runAutomate(apiClient, action, args)
	case appautomate.ProductAppAutomate:
		err = runAppAutomate(apiClient, action, args)
	case screenshots.ProductScreenshots:
		err = runScreenshots(screenshotsClient, action, args)
	case accessibility.ProductAccessibility:
		err = runAccessibility(accessibilityClient, action, args)
	case testmanagement.ProductTestManagement:
		err = runTestManagement(testManagementClient, action, args)
	case testreporting.ProductTestReporting:
		// test-reporting uses a different base URL; its handler creates its own client
		err = runTestReporting(username, accessKey, action, args)
	case websitescanner.ProductWebsiteScanner:
		err = runWebsiteScanner(websiteScannerClient, action, args)
	default:
		fmt.Fprintf(os.Stderr, "unknown product: %s\n", product)
		os.Exit(1)
	}

	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(1)
	}
}
