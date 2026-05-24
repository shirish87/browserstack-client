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

	const usage = "Usage: screenshots <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	res, err := screenshots.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, screenshots.DisplayColumns(action))
}
