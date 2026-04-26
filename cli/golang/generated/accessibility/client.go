package accessibility

import (
	"context"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type AccessibilityClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *AccessibilityClient {
	return &AccessibilityClient{http: c}
}

func (c *AccessibilityClient) GetAccessibilityWorkflowAnalyzerReports(ctx context.Context) (*GetAccessibilityWorkflowAnalyzerReportsResponse, error) {
	var out GetAccessibilityWorkflowAnalyzerReportsResponse
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWorkflowAnalyzerReportSummary(ctx context.Context, report_id int) (*GetAccessibilityWorkflowAnalyzerReportSummaryResponse, error) {
	var out GetAccessibilityWorkflowAnalyzerReportSummaryResponse
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports/" + report_id, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWorkflowAnalyzerReportIssues(ctx context.Context, report_id int, task_id string, next_page string) (*GetAccessibilityWorkflowAnalyzerReportIssuesResponse, error) {
	var out GetAccessibilityWorkflowAnalyzerReportIssuesResponse
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports/issues", map[string]string{"report_id": report_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAssistedTestReports(ctx context.Context) (*GetAccessibilityAssistedTestReportsResponse, error) {
	var out GetAccessibilityAssistedTestReportsResponse
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAssistedTestReportSummary(ctx context.Context, report_id int) (*GetAccessibilityAssistedTestReportSummaryResponse, error) {
	var out GetAccessibilityAssistedTestReportSummaryResponse
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports/" + report_id, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAssistedTestReportIssues(ctx context.Context, report_id int, task_id string, next_page string) (*GetAccessibilityAssistedTestReportIssuesResponse, error) {
	var out GetAccessibilityAssistedTestReportIssuesResponse
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports/issues", map[string]string{"report_id": report_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerAuthConfigs(ctx context.Context) (*GetAccessibilityWebsiteScannerAuthConfigsResponse, error) {
	var out GetAccessibilityWebsiteScannerAuthConfigsResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/auth_configs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) CreateAccessibilityWebsiteScannerAuthConfig(ctx context.Context, body *CreateAccessibilityWebsiteScannerAuthConfigRequest) (*CreateAccessibilityWebsiteScannerAuthConfigResponse, error) {
	var out CreateAccessibilityWebsiteScannerAuthConfigResponse
	if err := c.http.Post(ctx, "/api/website-scanner/v1/auth_configs", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScans(ctx context.Context) (*GetAccessibilityWebsiteScannerScansResponse, error) {
	var out GetAccessibilityWebsiteScannerScansResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) CreateAccessibilityWebsiteScannerScan(ctx context.Context, body *CreateAccessibilityWebsiteScannerScanRequest) (*CreateAccessibilityWebsiteScannerScanResponse, error) {
	var out CreateAccessibilityWebsiteScannerScanResponse
	if err := c.http.Post(ctx, "/api/website-scanner/v1/scans", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanOverview(ctx context.Context, scan_id int) (*GetAccessibilityWebsiteScannerScanOverviewResponse, error) {
	var out GetAccessibilityWebsiteScannerScanOverviewResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + scan_id + "/overview", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRuns(ctx context.Context, scan_id int, page int, page_size int) (*GetAccessibilityWebsiteScannerScanRunsResponse, error) {
	var out GetAccessibilityWebsiteScannerScanRunsResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + scan_id + "/scan_runs", map[string]string{"page": page, "page_size": page_size}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunSummary(ctx context.Context, scan_id int, scan_run_id int) (*GetAccessibilityWebsiteScannerScanRunSummaryResponse, error) {
	var out GetAccessibilityWebsiteScannerScanRunSummaryResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + scan_id + "/scan_runs/" + scan_run_id, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunStatus(ctx context.Context, scan_id int, scan_run_id int) (*GetAccessibilityWebsiteScannerScanRunStatusResponse, error) {
	var out GetAccessibilityWebsiteScannerScanRunStatusResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + scan_id + "/scan_runs/" + scan_run_id + "/status", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunIssues(ctx context.Context, scan_id int, scan_run_id int, task_id string, next_page string) (*GetAccessibilityWebsiteScannerScanRunIssuesResponse, error) {
	var out GetAccessibilityWebsiteScannerScanRunIssuesResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + scan_id + "/scan_runs/issues", map[string]string{"scan_run_id": scan_run_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunLogs(ctx context.Context, scan_id int, scan_run_id int) (*GetAccessibilityWebsiteScannerScanRunLogsResponse, error) {
	var out GetAccessibilityWebsiteScannerScanRunLogsResponse
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + scan_id + "/scan_runs/" + scan_run_id + "/scan_logs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestProjects(ctx context.Context, next_page string) (*GetAccessibilityAutomatedTestProjectsResponse, error) {
	var out GetAccessibilityAutomatedTestProjectsResponse
	if err := c.http.Get(ctx, "/api/automated-tests/v1/projects", map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuilds(ctx context.Context, next_page string, projectId int) (*GetAccessibilityAutomatedTestBuildsResponse, error) {
	var out GetAccessibilityAutomatedTestBuildsResponse
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds", map[string]string{"next_page": next_page, "projectId": projectId}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildTestCases(ctx context.Context, thBuildId string, next_page string) (*GetAccessibilityAutomatedTestBuildTestCasesResponse, error) {
	var out GetAccessibilityAutomatedTestBuildTestCasesResponse
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId + "/test-cases", map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildSummary(ctx context.Context, thBuildId string, next_page string) (*GetAccessibilityAutomatedTestBuildSummaryResponse, error) {
	var out GetAccessibilityAutomatedTestBuildSummaryResponse
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId, map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildIssues(ctx context.Context, build_id string, task_id string, next_page string) (*GetAccessibilityAutomatedTestBuildIssuesResponse, error) {
	var out GetAccessibilityAutomatedTestBuildIssuesResponse
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/issues", map[string]string{"build_id": build_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildTestCaseSummary(ctx context.Context, thBuildId string, test_case_id string, next_page string) (*GetAccessibilityAutomatedTestBuildTestCaseSummaryResponse, error) {
	var out GetAccessibilityAutomatedTestBuildTestCaseSummaryResponse
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId + "/test-cases/" + test_case_id, map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildTestCaseIssues(ctx context.Context, thBuildId string, test_case string, task_id string, next_page string) (*GetAccessibilityAutomatedTestBuildTestCaseIssuesResponse, error) {
	var out GetAccessibilityAutomatedTestBuildTestCaseIssuesResponse
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId + "/issues", map[string]string{"test_case": test_case, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
