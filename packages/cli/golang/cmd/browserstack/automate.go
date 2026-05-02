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

	const usage = "Usage: automate <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	res, err := automate.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	switch action {
	case automate.ActionListBuilds:
		if res.ListBuilds != nil {
			for _, b := range *res.ListBuilds {
				fmt.Printf("%s %s %s\n", b.AutomationBuild.HashedId, b.AutomationBuild.Name, b.AutomationBuild.Status)
			}
			return nil
		}
	case automate.ActionListSessions:
		if res.ListSessions != nil {
			for _, s := range *res.ListSessions {
				fmt.Printf("%s %s %s\n", s.AutomationSession.HashedId, s.AutomationSession.Name, s.AutomationSession.Status)
			}
			return nil
		}
	case automate.ActionListProjects:
		if res.ListProjects != nil {
			for _, p := range *res.ListProjects {
				fmt.Printf("%.0f %s\n", p.Id, p.Name)
			}
			return nil
		}
	case automate.ActionListMediaFiles:
		if res.ListMediaFiles != nil {
			for _, f := range *res.ListMediaFiles {
				fmt.Printf("%s %s %s\n", f.MediaUrl, f.UploadedAt, f.MediaName)
			}
			return nil
		}
	case automate.ActionGetProjectBadgeKey:
		if res.GetProjectBadgeKey != nil {
			fmt.Println(*res.GetProjectBadgeKey)
			return nil
		}
	case automate.ActionListSessionLogs,
		automate.ActionListSessionAppiumLogs,
		automate.ActionListSessionSeleniumLogs,
		automate.ActionListSessionConsoleLogs:
		if res.ListSessionLogs != nil {
			fmt.Print(*res.ListSessionLogs)
			return nil
		}
		if res.ListSessionAppiumLogs != nil {
			fmt.Print(*res.ListSessionAppiumLogs)
			return nil
		}
		if res.ListSessionSeleniumLogs != nil {
			fmt.Print(*res.ListSessionSeleniumLogs)
			return nil
		}
		if res.ListSessionConsoleLogs != nil {
			fmt.Print(*res.ListSessionConsoleLogs)
			return nil
		}
	case automate.ActionListSessionTelemetryLogs:
		if res.ListSessionTelemetryLogs != nil {
			fmt.Print(string(*res.ListSessionTelemetryLogs))
			return nil
		}
	}

	return output.Print(res)
}
