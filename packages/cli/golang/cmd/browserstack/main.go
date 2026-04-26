package main

import (
	"fmt"
	"os"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
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
		fmt.Fprintln(os.Stderr, "Products: automate, app-automate, screenshots, local-testing, test-management, test-reporting, accessibility")
		os.Exit(1)
	}

	product := os.Args[1]
	action := os.Args[2]
	args := os.Args[3:]

	httpClient := bshttp.New("https://api.browserstack.com", username, accessKey)

	var err error
	switch product {
	case "automate":
		err = runAutomate(httpClient, action, args)
	default:
		fmt.Fprintf(os.Stderr, "unknown product: %s\n", product)
		os.Exit(1)
	}

	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(1)
	}
}
