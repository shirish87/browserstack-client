package main

import (
	"context"
	"fmt"

	testreporting "github.com/browserstack/browserstack-client/generated/test-reporting"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

const testReportingBaseURL = "https://api-test-reporting.browserstack.com"

func runTestReporting(username, accessKey, action string, args []string) error {
	c := browserstackhttp.New(testReportingBaseURL, username, accessKey)
	client := testreporting.New(c)
	ctx := context.Background()

	const usage = "Usage: test-reporting <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	result, err := testreporting.Dispatch(client, ctx, action, args)
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
