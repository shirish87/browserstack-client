package main

import (
	"context"
	"fmt"

	"github.com/browserstack/browserstack-client/generated/automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

const threeColFmt = "%s %s %s\n"

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
		if res.ListBuilds != nil {
			for _, b := range *res.ListBuilds {
				fmt.Printf(threeColFmt, b.AutomationBuild.HashedId, b.AutomationBuild.Name, b.AutomationBuild.Status)
			}
			return true
		}
	case automate.ActionListSessions:
		if res.ListSessions != nil {
			for _, s := range *res.ListSessions {
				fmt.Printf(threeColFmt, s.AutomationSession.HashedId, s.AutomationSession.Name, s.AutomationSession.Status)
			}
			return true
		}
	case automate.ActionListProjects:
		if res.ListProjects != nil {
			for _, p := range *res.ListProjects {
				fmt.Printf("%.0f %s\n", p.Id, p.Name)
			}
			return true
		}
	case automate.ActionListMediaFiles:
		if res.ListMediaFiles != nil {
			for _, f := range *res.ListMediaFiles {
				fmt.Printf(threeColFmt, f.MediaUrl, f.UploadedAt, f.MediaName)
			}
			return true
		}
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

	const usage = "Usage: automate <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	res, err := automate.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	if printAutomateResult(res, action) {
		return nil
	}

	return output.Print(res)
}
