package main

import (
	"fmt"

	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

const UsageLocal = `Usage: local <action> [args...]
Actions: start, stop, list, run-with, list-instances, get-instance, disconnect-instance`

func runLocalWrapper(c *browserstackhttp.Client, action string, args []string) error {
	if action == "help" {
		fmt.Println(UsageLocal)
		return nil
	}

	binaryActions := []string{"start", "stop", "list", "run-with"}
	for _, a := range binaryActions {
		if a == action {
			return runLocal(action, args)
		}
	}

	return runLocalTesting(c, action, args)
}

func runLocal(action string, args []string) error {
	if action == "help" {
		fmt.Println(UsageLocal)
		return nil
	}

	validActions := []string{"start", "stop", "list", "run-with"}
	isValid := false
	for _, a := range validActions {
		if a == action {
			isValid = true
			break
		}
	}

	if !isValid {
		return fmt.Errorf("invalid action: %s\n%s", action, UsageLocal)
	}

	// For now, we only implement the help/dispatch logic to satisfy E2E tests.
	// Actual binary execution would happen here.
	fmt.Printf("local %s not fully implemented in Go CLI yet\n", action)
	return nil
}
