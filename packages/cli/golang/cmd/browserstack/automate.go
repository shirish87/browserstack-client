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

	switch action {
	case "get-plan":
		result, err := client.GetPlan(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-browsers":
		result, err := client.GetBrowsers(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)

	// Builds
	case "list-builds":
		result, err := client.GetBuilds(ctx, "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-build":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-build <buildId>")
		}
		result, err := client.GetBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-build":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-build <buildId>")
		}
		result, err := client.DeleteBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Sessions
	case "list-sessions":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate list-sessions <buildId>")
		}
		result, err := client.GetSessions(ctx, args[0], "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-session":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session <sessionId>")
		}
		result, err := client.GetSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-session":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-session <sessionId>")
		}
		result, err := client.DeleteSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-session-logs":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session-logs <sessionId>")
		}
		result, err := client.GetSessionLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case "get-selenium-logs":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-selenium-logs <sessionId>")
		}
		result, err := client.GetSessionSeleniumLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case "get-console-logs":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-console-logs <sessionId>")
		}
		result, err := client.GetSessionConsoleLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case "get-appium-logs":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-appium-logs <sessionId>")
		}
		result, err := client.GetSessionAppiumLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case "get-network-logs":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-network-logs <sessionId>")
		}
		result, err := client.GetSessionNetworkLogs(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-telemetry-logs":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-telemetry-logs <sessionId>")
		}
		result, err := client.GetSessionTelemetryLogs(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Projects
	case "list-projects":
		result, err := client.GetProjects(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-project":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-project <projectId>")
		}
		result, err := client.GetProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-project":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-project <projectId>")
		}
		result, err := client.DeleteProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-project-badge-key":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-project-badge-key <projectId>")
		}
		result, err := client.GetProjectBadgeKey(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil

	// Media files
	case "list-media-files":
		result, err := client.GetMediaFiles(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-media-file":
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-media-file <mediaId>")
		}
		result, err := client.DeleteMediaFile(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\nValid actions:\n"+
			"  get-plan, list-browsers\n"+
			"  list-builds, get-build, delete-build\n"+
			"  list-sessions, get-session, delete-session\n"+
			"  get-session-logs, get-selenium-logs, get-console-logs, get-appium-logs, get-network-logs, get-telemetry-logs\n"+
			"  list-projects, get-project, delete-project, get-project-badge-key\n"+
			"  list-media-files, delete-media-file", action)
	}
}
