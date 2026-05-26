package main

import (
	"context"
	"fmt"

	"github.com/browserstack/browserstack-client/generated/screenshots"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
	"github.com/browserstack/browserstack-client/internal/tui"
)

func runScreenshots(c *browserstackhttp.Client, action string, args []string) error {
	client := screenshots.New(c)
	ctx := context.Background()

	const usage = `Usage: screenshots <action> [args...]

Actions:
  list-browsers
  create-job
  get-job   <jobId>`

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	if len(args) > 0 && args[len(args)-1] == "help" {
		if h := tui.ActionHelp(screenshots.ProductScreenshots, action); h != "" {
			fmt.Println(h)
			return nil
		}
	}

	res, err := screenshots.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, screenshots.DisplayColumns(action))
}
