package main

import (
	"context"
	"fmt"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
	"github.com/browserstack/browserstack-client/internal/tui"
)

func runAccessibility(c *browserstackhttp.Client, action string, args []string) error {
	client := accessibility.New(c)
	ctx := context.Background()

	const usage = `Usage: accessibility <action> [args...]

Actions:
  list-workflow-analyzer-reports
  get-workflow-analyzer-report-summary    <reportId>
  list-workflow-analyzer-report-issues    [reportId [taskId [nextPage]]]
  list-assisted-test-reports
  get-assisted-test-report-summary        <reportId>
  list-assisted-test-report-issues        [reportId [taskId [nextPage]]]
  list-automated-test-projects
  list-automated-test-builds              [projectId [nextPage]]
  get-automated-test-build-summary        <buildId> [nextPage]
  list-automated-test-build-issues        [buildId [taskId [nextPage]]]
  list-automated-test-build-test-cases    <buildId> [nextPage]
  get-automated-test-build-test-case-summary   <buildId> <testCaseId> [nextPage]
  list-automated-test-build-test-case-issues   <buildId> <testCaseId> [taskId [nextPage]]
  list-website-scanner-auth-configs
  create-website-scanner-auth-config
  list-website-scanner-scans
  create-website-scanner-scan
  get-website-scanner-scan-overview       <scanId>
  list-website-scanner-scan-runs          <scanId> [page [pageSize]]
  get-website-scanner-scan-run-summary    <scanId> <scanRunId>
  list-website-scanner-scan-run-status    <scanId> <scanRunId>
  list-website-scanner-scan-run-issues    <scanId> [scanRunId [taskId [nextPage]]]
  list-website-scanner-scan-run-logs      <scanId> <scanRunId>`

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	if len(args) > 0 && args[len(args)-1] == "help" {
		if h := tui.ActionHelp(accessibility.ProductAccessibility, action); h != "" {
			fmt.Println(h)
			return nil
		}
	}

	res, err := accessibility.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, accessibility.DisplayColumns(action))
}
