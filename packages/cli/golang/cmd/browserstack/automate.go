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

	result, err := automate.Dispatch(client, ctx, action, args)
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
	        if list, ok := result.(*[]automate.GetAutomateBuildsResponse); ok {
	                for _, b := range *list {
	                        fmt.Printf("%s %s %s\n", b.AutomationBuild.HashedId, b.AutomationBuild.Name, b.AutomationBuild.Status)
	                }
	                return nil
	        }
	case "list-sessions":
	        if list, ok := result.(*automate.GetAutomateSessionsResponse); ok {
	                for _, s := range *list {
	                        fmt.Printf("%s %s %s\n", s.AutomationSession.HashedId, s.AutomationSession.Name, s.AutomationSession.Status)
	                }
	                return nil
	        }
	case "list-projects":
	        if list, ok := result.(*[]automate.AutomateProject); ok {
	                for _, p := range *list {
	                        fmt.Printf("%.0f %s\n", p.Id, p.Name)
	                }
	                return nil
	        }
	case "list-media-files":
	        if list, ok := result.(*[]automate.AutomateMediaFile); ok {
	                for _, f := range *list {
	                        fmt.Printf("%s %s %s\n", f.MediaUrl, f.UploadedAt, f.MediaName)
	                }
	                return nil
	        }
	}
	return output.Print(result)
}
