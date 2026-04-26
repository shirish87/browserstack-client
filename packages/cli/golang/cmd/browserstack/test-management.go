package main

import (
	"context"
	"fmt"

	testmanagement "github.com/browserstack/browserstack-client/generated/test-management"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runTestManagement(c *browserstackhttp.Client, action string, args []string) error {
	client := testmanagement.New(c)
	ctx := context.Background()

	const usage = "Usage: test-management <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	result, err := testmanagement.Dispatch(client, ctx, action, args)
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
