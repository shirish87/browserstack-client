package main

import (
	"context"
	"fmt"
	"strconv"

	reporting "github.com/browserstack/browserstack-client/generated/test-reporting"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

const testReportingBaseURL = "https://api-automation.browserstack.com/ext/v1"

func runTestReporting(username, accessKey, action string, args []string) error {
	c := browserstackhttp.New(testReportingBaseURL, username, accessKey)
	client := reporting.New(c)
	ctx := context.Background()

	switch action {
	// Projects
	case "list-projects":
		result, err := client.GetProjects(ctx, "")
		if err != nil {
			return err
		}
		return output.Print(result)

	// Builds
	case "get-build":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-build <buildId>")
		}
		result, err := client.GetBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-latest-build":
		result, err := client.GetLatestBuild(ctx, "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-project-builds":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting list-project-builds <projectId>")
		}
		projectID, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("projectId must be an integer")
		}
		result, err := client.GetProjectBuilds(ctx, projectID, "", "", "", "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)

	// Test runs
	case "list-test-runs":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting list-test-runs <buildId>")
		}
		result, err := client.GetTestRuns(ctx, args[0], "", "", "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-self-healing-report":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-self-healing-report <buildUuid>")
		}
		result, err := client.GetSelfHealingReport(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Quality gates
	case "get-quality-gate-status":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-quality-gate-status <buildUuid>")
		}
		result, err := client.GetQualityGateStatus(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-quality-gate-settings":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-quality-gate-settings <projectName>")
		}
		result, err := client.GetQualityGateSettings(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-quality-gate-profile":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-reporting get-quality-gate-profile <projectName> <profileUuid>")
		}
		result, err := client.GetQualityGateProfile(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-quality-gate-profile":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-reporting delete-quality-gate-profile <projectName> <profileUuid>")
		}
		result, err := client.DeleteQualityGateProfile(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\nValid actions:\n"+
			"  list-projects\n"+
			"  get-build, get-latest-build, list-project-builds\n"+
			"  list-test-runs, get-self-healing-report\n"+
			"  get-quality-gate-status, get-quality-gate-settings, get-quality-gate-profile, delete-quality-gate-profile", action)
	}
}
