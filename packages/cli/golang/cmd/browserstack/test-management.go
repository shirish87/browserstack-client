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

	res, err := testmanagement.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, testmanagement.DisplayColumns(action))
}
