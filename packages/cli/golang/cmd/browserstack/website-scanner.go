package main

import (
	"context"
	"fmt"

	websitescanner "github.com/browserstack/browserstack-client/generated/website-scanner"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runWebsiteScanner(c *browserstackhttp.Client, action string, args []string) error {
	client := websitescanner.New(c)
	ctx := context.Background()

	const usage = "Usage: website-scanner <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	res, err := websitescanner.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, websitescanner.DisplayColumns(action))
}
