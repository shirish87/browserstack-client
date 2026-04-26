package main

import (
	"context"
	"fmt"

	"github.com/browserstack/browserstack-client/generated/automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAutomate(c *browserstackhttp.Client, action string, args []string) error {
	client := automate.New(c)
	ctx := context.Background()

	const usage = "Usage: automate <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	result, err := automate.Dispatch(client, ctx, action, args)
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
