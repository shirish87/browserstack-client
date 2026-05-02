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

	res, err := appautomate.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	switch action {
	case appautomate.ActionListBuilds:
		if res.ListBuilds != nil {
			for _, b := range *res.ListBuilds {
				fmt.Printf("%s %s %s\n", b.AutomationBuild.HashedId, b.AutomationBuild.Name, b.AutomationBuild.Status)
			}
			return nil
		}
	case appautomate.ActionListProjects:
		if res.ListProjects != nil {
			for _, p := range *res.ListProjects {
				fmt.Printf("%.0f %s\n", p.Id, p.Name)
			}
			return nil
		}
	}

	return output.Print(res)
}
