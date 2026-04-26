package main

import (
	"context"
	"fmt"

	localtesting "github.com/browserstack/browserstack-client/generated/local-testing"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runLocalTesting(c *browserstackhttp.Client, action string, args []string) error {
	client := localtesting.New(c)
	ctx := context.Background()

	const usage = "Usage: local-testing <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	result, err := localtesting.Dispatch(client, ctx, action, args)
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
