package main

import (
	"context"
	"fmt"
	"strconv"

	"github.com/browserstack/browserstack-client/generated/accessibility"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAccessibility(c *browserstackhttp.Client, action string, args []string) error {
	client := accessibility.New(c)
	ctx := context.Background()

	const usage = "Valid actions:\n" +
		"  get-workflow-analyzer-reports, get-workflow-analyzer-report-summary,\n" +
		"  get-workflow-analyzer-report-issues, get-assisted-test-reports,\n" +
		"  get-assisted-test-report-summary, get-assisted-test-report-issues,\n" +
		"  get-website-scanner-auth-configs, create-website-scanner-auth-config,\n" +
		"  get-website-scanner-scans, create-website-scanner-scan,\n" +
		"  get-website-scanner-scan-overview, get-website-scanner-scan-runs,\n" +
		"  get-website-scanner-scan-run-summary, get-website-scanner-scan-run-status,\n" +
		"  get-website-scanner-scan-run-issues, get-website-scanner-scan-run-logs,\n" +
		"  get-automated-test-projects, get-automated-test-builds,\n" +
		"  get-automated-test-build-test-cases, get-automated-test-build-summary,\n" +
		"  get-automated-test-build-issues, get-automated-test-build-test-case-summary,\n" +
		"  get-automated-test-build-test-case-issues"

	switch action {
	case "help":
		fmt.Println("Usage: accessibility <action> [args...]")
		fmt.Println(usage)
		return nil

	case accessibility.ActionListWorkflowAnalyzerReports:
		result, err := client.GetWorkflowAnalyzerReports(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionGetWorkflowAnalyzerReportSummary:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-workflow-analyzer-report-summary <reportId>")
		}
		id, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("reportId must be an integer")
		}
		result, err := client.GetWorkflowAnalyzerReportSummary(ctx, id)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListWorkflowAnalyzerReportIssues:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-workflow-analyzer-report-issues <reportId>")
		}
		id, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("reportId must be an integer")
		}
		result, err := client.GetWorkflowAnalyzerReportIssues(ctx, id, "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListAssistedTestReports:
		result, err := client.GetAssistedTestReports(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionGetAssistedTestReportSummary:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-assisted-test-report-summary <reportId>")
		}
		id, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("reportId must be an integer")
		}
		result, err := client.GetAssistedTestReportSummary(ctx, id)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListAssistedTestReportIssues:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-assisted-test-report-issues <reportId>")
		}
		id, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("reportId must be an integer")
		}
		result, err := client.GetAssistedTestReportIssues(ctx, id, "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListWebsiteScannerAuthConfigs:
		result, err := client.GetWebsiteScannerAuthConfigs(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListWebsiteScannerScans:
		result, err := client.GetWebsiteScannerScans(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionGetWebsiteScannerScanOverview:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-website-scanner-scan-overview <scanId>")
		}
		id, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("scanId must be an integer")
		}
		result, err := client.GetWebsiteScannerScanOverview(ctx, id)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListWebsiteScannerScanRuns:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-website-scanner-scan-runs <scanId>")
		}
		id, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("scanId must be an integer")
		}
		result, err := client.GetWebsiteScannerScanRuns(ctx, id, 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionGetWebsiteScannerScanRunSummary:
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scanner-scan-run-summary <scanId> <scanRunId>")
		}
		scanID, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("scanId must be an integer")
		}
		runID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("scanRunId must be an integer")
		}
		result, err := client.GetWebsiteScannerScanRunSummary(ctx, scanID, runID)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListWebsiteScannerScanRunStatus:
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scanner-scan-run-status <scanId> <scanRunId>")
		}
		scanID, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("scanId must be an integer")
		}
		runID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("scanRunId must be an integer")
		}
		result, err := client.GetWebsiteScannerScanRunStatus(ctx, scanID, runID)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListWebsiteScannerScanRunIssues:
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scanner-scan-run-issues <scanId> <scanRunId>")
		}
		scanID, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("scanId must be an integer")
		}
		runID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("scanRunId must be an integer")
		}
		result, err := client.GetWebsiteScannerScanRunIssues(ctx, scanID, runID, "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListWebsiteScannerScanRunLogs:
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scanner-scan-run-logs <scanId> <scanRunId>")
		}
		scanID, err := strconv.Atoi(args[0])
		if err != nil {
			return fmt.Errorf("scanId must be an integer")
		}
		runID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("scanRunId must be an integer")
		}
		result, err := client.GetWebsiteScannerScanRunLogs(ctx, scanID, runID)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListAutomatedTestProjects:
		result, err := client.GetAutomatedTestProjects(ctx, "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListAutomatedTestBuilds:
		result, err := client.GetAutomatedTestBuilds(ctx, "", 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListAutomatedTestBuildTestCases:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-automated-test-build-test-cases <buildId>")
		}
		result, err := client.GetAutomatedTestBuildTestCases(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionGetAutomatedTestBuildSummary:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-automated-test-build-summary <buildId>")
		}
		result, err := client.GetAutomatedTestBuildSummary(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListAutomatedTestBuildIssues:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-automated-test-build-issues <buildId>")
		}
		result, err := client.GetAutomatedTestBuildIssues(ctx, args[0], "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionGetAutomatedTestBuildTestCaseSummary:
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-automated-test-build-test-case-summary <buildId> <testCaseId>")
		}
		result, err := client.GetAutomatedTestBuildTestCaseSummary(ctx, args[0], args[1], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case accessibility.ActionListAutomatedTestBuildTestCaseIssues:
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-automated-test-build-test-case-issues <buildId>")
		}
		result, err := client.GetAutomatedTestBuildTestCaseIssues(ctx, args[0], "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\n%s", action, usage)
	}
}
