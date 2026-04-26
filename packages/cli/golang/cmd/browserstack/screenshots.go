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

	const usage = "Valid actions:\n" +
		"  get-job, create-job, get-browsers"

	switch action {
	case "help":
		fmt.Println("Usage: screenshots <action> [args...]")
		fmt.Println(usage)
		return nil

	case screenshots.ActionListBrowsers:
		result, err := client.GetBrowsers(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case screenshots.ActionGetJob:
		if len(args) < 1 {
			return fmt.Errorf("usage: screenshots get-job <jobId>")
		}
		result, err := client.GetJob(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case screenshots.ActionCreateJob:
		// Need to implement job creation logic/args
		return fmt.Errorf("create-job not implemented in CLI yet")
	default:
		return fmt.Errorf("unknown action: %s\n\n%s", action, usage)
	}
}
