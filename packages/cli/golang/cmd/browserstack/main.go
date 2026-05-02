package main

import (
	"fmt"
	"os"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	"github.com/browserstack/browserstack-client/generated/automate"
	localtesting "github.com/browserstack/browserstack-client/generated/local-testing"
	"github.com/browserstack/browserstack-client/generated/screenshots"
	testmanagement "github.com/browserstack/browserstack-client/generated/test-management"
	testreporting "github.com/browserstack/browserstack-client/generated/test-reporting"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

// version is set at build time via -ldflags "-X main.version=<ver>"
var version = "dev"

func main() {
	if len(os.Args) >= 2 && os.Args[1] == "version" {
		fmt.Printf("browserstack-client %s\n", version)
		return
	}

	username := os.Getenv("BROWSERSTACK_USERNAME")
	accessKey := os.Getenv("BROWSERSTACK_ACCESS_KEY")

	if username == "" || accessKey == "" {
		fmt.Fprintln(os.Stderr, "BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set")
		os.Exit(1)
	}

	if len(os.Args) < 3 {
		fmt.Fprintln(os.Stderr, "Usage: browserstack-client <product> <action> [args...]")
		fmt.Fprintln(os.Stderr, "       browserstack-client version")
		fmt.Fprintf(os.Stderr, "Products: %s, %s, %s, %s, %s, %s, %s\n",
			automate.ProductAutomate, appautomate.ProductAppAutomate, screenshots.ProductScreenshots, localtesting.ProductLocalTesting,
			accessibility.ProductAccessibility, testmanagement.ProductTestManagement, testreporting.ProductTestReporting)
		os.Exit(1)
	}

	product := os.Args[1]
	action := os.Args[2]
	args := os.Args[3:]

	if product == "help" {
		fmt.Fprintln(os.Stdout, "Usage: browserstack-client <product> <action> [args...]")
		fmt.Fprintln(os.Stdout, "       browserstack-client version")
		fmt.Printf("Products: %s, %s, %s, %s, %s, %s, %s\n",
			automate.ProductAutomate, appautomate.ProductAppAutomate, screenshots.ProductScreenshots, localtesting.ProductLocalTesting,
			accessibility.ProductAccessibility, testmanagement.ProductTestManagement, testreporting.ProductTestReporting)
		return
	}

	apiClient := browserstackhttp.New("https://api.browserstack.com", username, accessKey)
	accessibilityClient := browserstackhttp.New("https://api-accessibility.browserstack.com", username, accessKey)
	testManagementClient := browserstackhttp.New("https://test-management.browserstack.com", username, accessKey)
	screenshotsClient := browserstackhttp.New("https://www.browserstack.com", username, accessKey)

	var err error
	switch product {
	case automate.ProductAutomate:
		err = runAutomate(apiClient, action, args)
	case appautomate.ProductAppAutomate:
		err = runAppAutomate(apiClient, action, args)
	case screenshots.ProductScreenshots:
		err = runScreenshots(screenshotsClient, action, args)
	case localtesting.ProductLocalTesting:
		err = runLocalTesting(apiClient, action, args)
	case accessibility.ProductAccessibility:
		err = runAccessibility(accessibilityClient, action, args)
	case testmanagement.ProductTestManagement:
		err = runTestManagement(testManagementClient, action, args)
	case testreporting.ProductTestReporting:
		// test-reporting uses a different base URL; its handler creates its own client
		err = runTestReporting(username, accessKey, action, args)
	default:
		fmt.Fprintf(os.Stderr, "unknown product: %s\n", product)
		os.Exit(1)
	}

	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(1)
	}
}
