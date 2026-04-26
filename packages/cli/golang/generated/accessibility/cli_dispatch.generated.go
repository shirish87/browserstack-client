package accessibility

// Generated CLI dispatcher. Do not modify.

import (
	"context"
	"fmt"
)

func argAt(args []string, i int) string {
	if i < len(args) { return args[i] }
	return ""
}

func Dispatch(client *AccessibilityClient, ctx context.Context, action string, args []string) (interface{}, error) {
	switch action {
	case ActionListWorkflowAnalyzerReports:
		return client.GetWorkflowAnalyzerReports(ctx)
	case ActionGetWorkflowAnalyzerReportSummary:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility get-workflow-analyzer-report-summary <report_id>")
		}
		return client.GetWorkflowAnalyzerReportSummary(ctx, args[0])
	case ActionListWorkflowAnalyzerReportIssues:
		return client.GetWorkflowAnalyzerReportIssues(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionListAssistedTestReports:
		return client.GetAssistedTestReports(ctx)
	case ActionGetAssistedTestReportSummary:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility get-assisted-test-report-summary <report_id>")
		}
		return client.GetAssistedTestReportSummary(ctx, args[0])
	case ActionListAssistedTestReportIssues:
		return client.GetAssistedTestReportIssues(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionListWebsiteScannerAuthConfigs:
		return client.GetWebsiteScannerAuthConfigs(ctx)
	case ActionCreateWebsiteScannerAuthConfig:
		return client.CreateWebsiteScannerAuthConfig(ctx, nil)
	case ActionListWebsiteScannerScans:
		return client.GetWebsiteScannerScans(ctx)
	case ActionCreateWebsiteScannerScan:
		return client.CreateWebsiteScannerScan(ctx, nil)
	case ActionGetWebsiteScannerScanOverview:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility get-website-scanner-scan-overview <scan_id>")
		}
		return client.GetWebsiteScannerScanOverview(ctx, args[0])
	case ActionListWebsiteScannerScanRuns:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility list-website-scanner-scan-runs <scan_id> <page> <page_size>")
		}
		return client.GetWebsiteScannerScanRuns(ctx, args[0], argAt(args, 1), argAt(args, 2))
	case ActionGetWebsiteScannerScanRunSummary:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: accessibility get-website-scanner-scan-run-summary <scan_id> <scan_run_id>")
		}
		return client.GetWebsiteScannerScanRunSummary(ctx, args[0], args[1])
	case ActionListWebsiteScannerScanRunStatus:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: accessibility list-website-scanner-scan-run-status <scan_id> <scan_run_id>")
		}
		return client.GetWebsiteScannerScanRunStatus(ctx, args[0], args[1])
	case ActionListWebsiteScannerScanRunIssues:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility list-website-scanner-scan-run-issues <scan_id> <scan_run_id> <task_id> <next_page>")
		}
		return client.GetWebsiteScannerScanRunIssues(ctx, args[0], argAt(args, 1), argAt(args, 2), argAt(args, 3))
	case ActionListWebsiteScannerScanRunLogs:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: accessibility list-website-scanner-scan-run-logs <scan_id> <scan_run_id>")
		}
		return client.GetWebsiteScannerScanRunLogs(ctx, args[0], args[1])
	case ActionListAutomatedTestProjects:
		return client.GetAutomatedTestProjects(ctx, argAt(args, 0))
	case ActionListAutomatedTestBuilds:
		return client.GetAutomatedTestBuilds(ctx, argAt(args, 0), argAt(args, 1))
	case ActionListAutomatedTestBuildTestCases:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility list-automated-test-build-test-cases <thBuildId> <next_page>")
		}
		return client.GetAutomatedTestBuildTestCases(ctx, args[0], argAt(args, 1))
	case ActionGetAutomatedTestBuildSummary:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility get-automated-test-build-summary <thBuildId> <next_page>")
		}
		return client.GetAutomatedTestBuildSummary(ctx, args[0], argAt(args, 1))
	case ActionListAutomatedTestBuildIssues:
		return client.GetAutomatedTestBuildIssues(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionGetAutomatedTestBuildTestCaseSummary:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: accessibility get-automated-test-build-test-case-summary <thBuildId> <test_case_id> <next_page>")
		}
		return client.GetAutomatedTestBuildTestCaseSummary(ctx, args[0], args[1], argAt(args, 2))
	case ActionListAutomatedTestBuildTestCaseIssues:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: accessibility list-automated-test-build-test-case-issues <thBuildId> <test_case> <task_id> <next_page>")
		}
		return client.GetAutomatedTestBuildTestCaseIssues(ctx, args[0], argAt(args, 1), argAt(args, 2), argAt(args, 3))
	default:
		return nil, fmt.Errorf("unknown action: %s", action)
	}
}
