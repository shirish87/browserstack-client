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

	switch action {
	case "list-instances":
		result, err := client.GetInstances(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-instance":
		if len(args) < 1 {
			return fmt.Errorf("usage: local-testing get-instance <instanceId>")
		}
		result, err := client.GetInstance(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "disconnect-instance":
		if len(args) < 1 {
			return fmt.Errorf("usage: local-testing disconnect-instance <instanceId>")
		}
		result, err := client.DisconnectInstance(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	default:
		return fmt.Errorf("unknown action: %s\n\nValid actions:\n"+
			"  list-instances, get-instance, disconnect-instance", action)
	}
}
