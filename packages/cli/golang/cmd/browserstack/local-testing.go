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

	const usage = "Valid actions:\n" +
		"  get-instances, get-instance, disconnect-instance"

	switch action {
	case "help":
		fmt.Println("Usage: local-testing <action> [args...]")
		fmt.Println(usage)
		return nil

	case localtesting.ActionListInstances:
		result, err := client.GetInstances(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case localtesting.ActionGetInstance:
		if len(args) < 1 {
			return fmt.Errorf("usage: local-testing get-instance <instanceId>")
		}
		result, err := client.GetInstance(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case localtesting.ActionDisconnectInstance:
		if len(args) < 1 {
			return fmt.Errorf("usage: local-testing disconnect-instance <instanceId>")
		}
		result, err := client.DisconnectInstance(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	default:
		return fmt.Errorf("unknown action: %s\n\n%s", action, usage)
	}
}
