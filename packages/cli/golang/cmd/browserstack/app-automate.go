package main

import (
	"context"
	"fmt"

	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAppAutomate(c *browserstackhttp.Client, action string, args []string) error {
	client := appautomate.New(c)
	ctx := context.Background()

	const usage = "Usage: app-automate <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	result, err := appautomate.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	// Handle string output directly, otherwise print as JSON
	if strResult, ok := result.(string); ok {
		fmt.Println(strResult)
		return nil
	}

	return output.Print(result)
}
