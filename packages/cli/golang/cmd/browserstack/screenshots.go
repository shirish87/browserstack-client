package main

import (
	"context"
	"fmt"

	"github.com/browserstack/browserstack-client/generated/screenshots"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runScreenshots(c *browserstackhttp.Client, action string, args []string) error {
	client := screenshots.New(c)
	ctx := context.Background()

	switch action {
	case "list-browsers":
		result, err := client.GetBrowsers(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-job":
		if len(args) < 1 {
			return fmt.Errorf("usage: screenshots get-job <jobId>")
		}
		result, err := client.GetJob(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	default:
		return fmt.Errorf("unknown action: %s\n\nValid actions:\n"+
			"  list-browsers, get-job", action)
	}
}
