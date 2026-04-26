package main

import (
	"context"
	"fmt"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAccessibility(c *browserstackhttp.Client, action string, args []string) error {
	client := accessibility.New(c)
	ctx := context.Background()

	const usage = "Usage: accessibility <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	result, err := accessibility.Dispatch(client, ctx, action, args)
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
