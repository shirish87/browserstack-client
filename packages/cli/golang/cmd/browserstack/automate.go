package main

import (
	"context"
	"fmt"

	"github.com/browserstack/browserstack-client/generated/automate"
	bshttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAutomate(c *bshttp.Client, action string, args []string) error {
	client := automate.New(c)
	ctx := context.Background()

	switch action {
	case "list-builds":
		result, err := client.GetAutomateBuilds(ctx, "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-build":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-build <buildId>")
		}
		result, err := client.GetAutomateBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-plan":
		result, err := client.GetAutomatePlan(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-sessions":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate list-sessions <buildId>")
		}
		result, err := client.GetAutomateSessions(ctx, args[0], "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-session":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session <sessionId>")
		}
		result, err := client.GetAutomateSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	default:
		return fmt.Errorf("unknown action: %s (valid: list-builds, get-build, get-plan, list-sessions, get-session)", action)
	}
}
