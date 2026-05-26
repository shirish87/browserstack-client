package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/browserstack/browserstack-client/generated/automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
	"github.com/browserstack/browserstack-client/internal/tui"
)

const threeColFmt = "%s %s %s\n"

func printBuilds(res *automate.DispatchResult) bool {
	if res.ListBuilds == nil {
		return false
	}
	for _, b := range *res.ListBuilds {
		fmt.Printf(threeColFmt, b.AutomationBuild.HashedId, b.AutomationBuild.Name, b.AutomationBuild.Status)
	}
	return true
}

func printSessions(res *automate.DispatchResult) bool {
	if res.ListSessions == nil {
		return false
	}
	for _, s := range *res.ListSessions {
		fmt.Printf(threeColFmt, s.AutomationSession.HashedId, s.AutomationSession.Name, s.AutomationSession.Status)
	}
	return true
}

func printProjects(res *automate.DispatchResult) bool {
	if res.ListProjects == nil {
		return false
	}
	for _, p := range *res.ListProjects {
		fmt.Printf("%.0f %s\n", p.Id, p.Name)
	}
	return true
}

func printMediaFiles(res *automate.DispatchResult) bool {
	if res.ListMediaFiles == nil {
		return false
	}
	for _, f := range *res.ListMediaFiles {
		fmt.Printf(threeColFmt, f.MediaUrl, f.UploadedAt, f.MediaName)
	}
	return true
}

func printSessionLog(res *automate.DispatchResult) bool {
	if res.ListSessionLogs != nil {
		fmt.Print(*res.ListSessionLogs)
		return true
	}
	if res.ListSessionAppiumLogs != nil {
		fmt.Print(*res.ListSessionAppiumLogs)
		return true
	}
	if res.ListSessionSeleniumLogs != nil {
		fmt.Print(*res.ListSessionSeleniumLogs)
		return true
	}
	if res.ListSessionConsoleLogs != nil {
		fmt.Print(*res.ListSessionConsoleLogs)
		return true
	}
	return false
}

func printAutomateResult(res *automate.DispatchResult, action string) bool {
	switch action {
	case automate.ActionListBuilds:
		return printBuilds(res)
	case automate.ActionListSessions:
		return printSessions(res)
	case automate.ActionListProjects:
		return printProjects(res)
	case automate.ActionListMediaFiles:
		return printMediaFiles(res)
	case automate.ActionGetProjectBadgeKey:
		if res.GetProjectBadgeKey != nil {
			fmt.Println(*res.GetProjectBadgeKey)
			return true
		}
	case automate.ActionListSessionLogs,
		automate.ActionListSessionAppiumLogs,
		automate.ActionListSessionSeleniumLogs,
		automate.ActionListSessionConsoleLogs:
		return printSessionLog(res)
	case automate.ActionListSessionTelemetryLogs:
		if res.ListSessionTelemetryLogs != nil {
			fmt.Print(string(*res.ListSessionTelemetryLogs))
			return true
		}
	}
	return false
}

func runAutomate(c *browserstackhttp.Client, action string, args []string) error {
	client := automate.New(c)
	ctx := context.Background()

	const usage = `Usage: automate <action> [args...]

Actions:
  get-plan
  list-browsers
  list-projects
  get-project             <projectId>
  update-project          <projectId>
  delete-project          <projectId>
  get-project-badge-key   <projectId>
  list-builds
  get-build               <buildId>
  update-build            <buildId>
  delete-build            <buildId>
  delete-builds           <buildId[]>
  list-sessions           <buildId> [limit [offset [status]]]
  get-session             <sessionId>
  update-session          <sessionId>
  delete-session          <sessionId>
  delete-sessions         <sessionId[]>
  list-session-logs               <sessionId>
  list-session-appium-logs        <sessionId>
  list-session-selenium-logs      <sessionId>
  list-session-console-logs       <sessionId>
  list-session-network-logs       <sessionId>
  list-session-telemetry-logs     <sessionId>
  upload-session-terminal-logs    <sessionId> <file-path>
  upload-build-terminal-logs      <buildId> <file-path>
  list-media-files
  upload-media-file       <file-path>
  delete-media-file       <mediaId>
  recycle-key`

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	if len(args) > 0 && args[len(args)-1] == "help" {
		if h := tui.ActionHelp(automate.ProductAutomate, action); h != "" {
			fmt.Println(h)
			return nil
		}
	}

	// Special handling for upload actions
	switch action {
	case automate.ActionUploadMediaFile:
		if len(args) < 1 {
			return fmt.Errorf("usage: automate %s <file-path>", action)
		}
		filePath := args[0]
		data, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read file: %w", err)
		}
		fileName := filepath.Base(filePath)
		v, err := client.UploadMediaFile(ctx, data, fileName, nil)
		if err != nil {
			return err
		}
		return output.Print(&automate.DispatchResult{Action: action, UploadMediaFile: v})

	case automate.ActionUploadBuildTerminalLogs, automate.ActionUploadSessionTerminalLogs:
		if len(args) < 2 {
			return fmt.Errorf("usage: automate %s <id> <file-path>", action)
		}
		id := args[0]
		filePath := args[1]
		data, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read file: %w", err)
		}
		fileName := filepath.Base(filePath)

		var res *automate.DispatchResult
		switch action {
		case automate.ActionUploadBuildTerminalLogs:
			v, err := client.UploadBuildTerminalLogs(ctx, id, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &automate.DispatchResult{Action: action, UploadBuildTerminalLogs: &v}
		case automate.ActionUploadSessionTerminalLogs:
			v, err := client.UploadSessionTerminalLogs(ctx, id, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &automate.DispatchResult{Action: action, UploadSessionTerminalLogs: &v}
		}
		return output.Print(res)
	}

	res, err := automate.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	if printAutomateResult(res, action) {
		return nil
	}

	return output.PrintWithColumns(res, automate.DisplayColumns(action))
}
