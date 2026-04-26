package main

import (
	"context"
	"fmt"
	"strconv"

	testreporting "github.com/browserstack/browserstack-client/generated/test-reporting"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

const testReportingBaseURL = "https://api-test-reporting.browserstack.com"

func runTestReporting(username, accessKey, action string, args []string) error {
	c := browserstackhttp.New(testReportingBaseURL, username, accessKey)
	client := testreporting.New(c)
	ctx := context.Background()

	const usage = "Valid actions:\n" +
		"  get-projects, get-project-builds, start-build, get-latest-build, get-build,\n" +
		"  update-build, finish-build, start-test-run, finish-test-run, start-hook-run,\n" +
		"  finish-hook-run, add-build-logs, get-test-runs, get-self-healing-report,\n" +
		"  get-quality-gate-status, get-quality-gate-settings, update-quality-gate-settings,\n" +
		"  create-quality-gate-profile, get-quality-gate-profile, update-quality-gate-profile,\n" +
		"  delete-quality-gate-profile, toggle-quality-gate-profile, upload-report"

	switch action {
	case "help":
		fmt.Println("Usage: test-reporting <action> [args...]")
		fmt.Println(usage)
		return nil

	case testreporting.ActionListProjects:
		result, err := client.GetProjects(ctx, "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionListProjectBuilds:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-project-builds <projectId>")
		}
		id, _ := strconv.Atoi(args[0])
		result, err := client.GetProjectBuilds(ctx, id, "", "", "", "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionGetBuild:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-build <buildId>")
		}
		result, err := client.GetBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionGetLatestBuild:
		result, err := client.GetLatestBuild(ctx, "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionListTestRuns:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-test-runs <buildId>")
		}
		result, err := client.GetTestRuns(ctx, args[0], "", "", "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionGetSelfHealingReport:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-self-healing-report <buildUuid>")
		}
		result, err := client.GetSelfHealingReport(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionListQualityGateStatus:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-quality-gate-status <buildUuid>")
		}
		result, err := client.GetQualityGateStatus(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionListQualityGateSettings:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-reporting get-quality-gate-settings <projectName>")
		}
		result, err := client.GetQualityGateSettings(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionGetQualityGateProfile:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-reporting get-quality-gate-profile <projectName> <profileUuid>")
		}
		result, err := client.GetQualityGateProfile(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testreporting.ActionDeleteQualityGateProfile:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-reporting delete-quality-gate-profile <projectName> <profileUuid>")
		}
		result, err := client.DeleteQualityGateProfile(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\n%s", action, usage)
	}
}
