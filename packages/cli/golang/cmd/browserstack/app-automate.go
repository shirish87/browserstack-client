package main

import (
	"context"
	"fmt"

	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAppAutomate(c *browserstackhttp.Client, action string, args []string) error {
	client := appautomate.New(c)
	ctx := context.Background()

	const usage = "Usage: app-automate <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	result, err := appautomate.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	// Handle string output directly, otherwise print as JSON
	if strResult, ok := result.(string); ok {
		fmt.Println(strResult)
		return nil
	}

	// Handle custom formatting for specific actions
	switch action {
	case "list-builds":
		if list, ok := result.(*appautomate.GetAppAutomateBuildsResponse); ok {
			for _, b := range *list {
				fmt.Printf("%s %s %s\n", b.AutomationBuild.HashedId, b.AutomationBuild.Name, b.AutomationBuild.Status)
			}
			return nil
		}
	case "list-projects":
		if list, ok := result.(*[]appautomate.AutomateProject); ok {
			for _, p := range *list {
				fmt.Printf("%.0f %s\n", p.Id, p.Name)
			}
			return nil
		}
	case "list-apps":
		// GetApps returns *map[string]any currently
		if res, ok := result.(*map[string]any); ok {
			return output.Print(res)
		}
	case "list-media-files":
		// GetMediaFiles returns *map[string]any currently
		if res, ok := result.(*map[string]any); ok {
			return output.Print(res)
		}
	}

	return output.Print(result)
}
