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

	const usage = "Valid actions:\n" +
		"  get-browsers, get-plan, get-session-appium-logs, get-project-badge-key,\n" +
		"  upload-session-terminal-logs, delete-builds, get-session, update-session,\n" +
		"  delete-session, delete-sessions, delete-media-file, get-build, update-build,\n" +
		"  delete-build, get-session-logs, upload-media-file, recycle-key, get-sessions,\n" +
		"  get-project, update-project, delete-project, get-session-selenium-logs,\n" +
		"  upload-build-terminal-logs, get-media-files, get-projects,\n" +
		"  get-session-console-logs, get-session-telemetry-logs, get-builds, get-session-network-logs"

	switch action {
	case "help":
		fmt.Println("Usage: automate <action> [args...]")
		fmt.Println(usage)
		return nil

	case automate.ActionListBrowsers:
		result, err := client.GetBrowsers(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionGetPlan:
		result, err := client.GetPlan(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionListSessionAppiumLogs:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session-appium-logs <sessionId>")
		}
		result, err := client.GetSessionAppiumLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case automate.ActionGetProjectBadgeKey:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-project-badge-key <projectId>")
		}
		result, err := client.GetProjectBadgeKey(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case automate.ActionDeleteBuilds:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-builds <buildId>")
		}
		result, err := client.DeleteBuilds(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionGetSession:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session <sessionId>")
		}
		result, err := client.GetSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionDeleteSession:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-session <sessionId>")
		}
		result, err := client.DeleteSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionDeleteSessions:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-sessions <sessionId>")
		}
		result, err := client.DeleteSessions(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionDeleteMediaFile:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-media-file <mediaId>")
		}
		result, err := client.DeleteMediaFile(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionGetBuild:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-build <buildId>")
		}
		result, err := client.GetBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionDeleteBuild:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-build <buildId>")
		}
		result, err := client.DeleteBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionListSessionLogs:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session-logs <sessionId>")
		}
		result, err := client.GetSessionLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case automate.ActionListSessions:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-sessions <buildId>")
		}
		result, err := client.GetSessions(ctx, args[0], "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionGetProject:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-project <projectId>")
		}
		result, err := client.GetProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionDeleteProject:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate delete-project <projectId>")
		}
		result, err := client.DeleteProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionListSessionSeleniumLogs:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session-selenium-logs <sessionId>")
		}
		result, err := client.GetSessionSeleniumLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case automate.ActionListMediaFiles:
		result, err := client.GetMediaFiles(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionListProjects:
		result, err := client.GetProjects(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionListSessionConsoleLogs:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session-console-logs <sessionId>")
		}
		result, err := client.GetSessionConsoleLogs(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case automate.ActionListSessionTelemetryLogs:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session-telemetry-logs <sessionId>")
		}
		result, err := client.GetSessionTelemetryLogs(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionListBuilds:
		result, err := client.GetBuilds(ctx, "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case automate.ActionListSessionNetworkLogs:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate get-session-network-logs <sessionId>")
		}
		result, err := client.GetSessionNetworkLogs(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\n%s", action, usage)
	}
}
