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

	switch action {
	// Workflow Analyzer
	case "list-workflow-reports":
		result, err := client.GetWorkflowAnalyzerReports(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-workflow-report":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-workflow-report <reportId>")
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
	case "get-workflow-report-issues":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-workflow-report-issues <reportId>")
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

	// Assisted Test
	case "list-assisted-test-reports":
		result, err := client.GetAssistedTestReports(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-assisted-test-report":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-assisted-test-report <reportId>")
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
	case "get-assisted-test-report-issues":
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

	// Website Scanner
	case "list-website-scanner-auth-configs":
		result, err := client.GetWebsiteScannerAuthConfigs(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-website-scans":
		result, err := client.GetWebsiteScannerScans(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-website-scan-overview":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-website-scan-overview <scanId>")
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
	case "list-website-scan-runs":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility list-website-scan-runs <scanId>")
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
	case "get-website-scan-run":
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scan-run <scanId> <scanRunId>")
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
	case "get-website-scan-run-status":
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scan-run-status <scanId> <scanRunId>")
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
	case "get-website-scan-run-issues":
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scan-run-issues <scanId> <scanRunId>")
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
	case "get-website-scan-run-logs":
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-website-scan-run-logs <scanId> <scanRunId>")
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

	// Automated Tests
	case "list-automated-test-projects":
		result, err := client.GetAutomatedTestProjects(ctx, "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-automated-test-builds":
		result, err := client.GetAutomatedTestBuilds(ctx, "", 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-automated-test-build":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-automated-test-build <buildId>")
		}
		result, err := client.GetAutomatedTestBuildSummary(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-automated-test-build-test-cases":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-automated-test-build-test-cases <buildId>")
		}
		result, err := client.GetAutomatedTestBuildTestCases(ctx, args[0], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-automated-test-build-issues":
		if len(args) < 1 {
			return fmt.Errorf("usage: accessibility get-automated-test-build-issues <buildId>")
		}
		result, err := client.GetAutomatedTestBuildIssues(ctx, args[0], "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-automated-test-case-summary":
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-automated-test-case-summary <buildId> <testCaseId>")
		}
		result, err := client.GetAutomatedTestBuildTestCaseSummary(ctx, args[0], args[1], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-automated-test-case-issues":
		if len(args) < 2 {
			return fmt.Errorf("usage: accessibility get-automated-test-case-issues <buildId> <testCase>")
		}
		result, err := client.GetAutomatedTestBuildTestCaseIssues(ctx, args[0], args[1], "", "")
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\nValid actions:\n"+
			"  list-workflow-reports, get-workflow-report, get-workflow-report-issues\n"+
			"  list-assisted-test-reports, get-assisted-test-report, get-assisted-test-report-issues\n"+
			"  list-website-scanner-auth-configs, list-website-scans, get-website-scan-overview\n"+
			"  list-website-scan-runs, get-website-scan-run, get-website-scan-run-status, get-website-scan-run-issues, get-website-scan-run-logs\n"+
			"  list-automated-test-projects, list-automated-test-builds, get-automated-test-build\n"+
			"  get-automated-test-build-test-cases, get-automated-test-build-issues\n"+
			"  get-automated-test-case-summary, get-automated-test-case-issues", action)
	}
}
