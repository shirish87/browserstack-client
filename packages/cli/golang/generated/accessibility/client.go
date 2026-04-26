package accessibility

import (
	"context"
	"net/url"

	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

type AccessibilityClient struct {
	http *browserstackhttp.Client
}

func New(c *browserstackhttp.Client) *AccessibilityClient {
	return &AccessibilityClient{http: c}
}

func (c *AccessibilityClient) GetWorkflowAnalyzerReports(ctx context.Context) (*WorkflowAnalyzerReportList, error) {
	var out WorkflowAnalyzerReportList
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWorkflowAnalyzerReportSummary(ctx context.Context, report_id string) (*WorkflowAnalyzerReportSummary, error) {
	var out WorkflowAnalyzerReportSummary
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports/" + url.PathEscape(report_id), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWorkflowAnalyzerReportIssues(ctx context.Context, report_id string, task_id string, next_page string) (*WorkflowAnalyzerReportIssues, error) {
	var out WorkflowAnalyzerReportIssues
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports/issues", map[string]string{"report_id": report_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAssistedTestReports(ctx context.Context) (*AssistedTestReportList, error) {
	var out AssistedTestReportList
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAssistedTestReportSummary(ctx context.Context, report_id string) (*AssistedTestReportSummary, error) {
	var out AssistedTestReportSummary
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports/" + url.PathEscape(report_id), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAssistedTestReportIssues(ctx context.Context, report_id string, task_id string, next_page string) (*AssistedTestReportIssues, error) {
	var out AssistedTestReportIssues
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports/issues", map[string]string{"report_id": report_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerAuthConfigs(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/api/website-scanner/v1/auth_configs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) CreateWebsiteScannerAuthConfig(ctx context.Context, body *CreateAccessibilityWebsiteScannerAuthConfigRequest) (*AuthConfig, error) {
	var out AuthConfig
	if err := c.http.Post(ctx, "/api/website-scanner/v1/auth_configs", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerScans(ctx context.Context) (*WebsiteScannerScanList, error) {
	var out WebsiteScannerScanList
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) CreateWebsiteScannerScan(ctx context.Context, body *CreateAccessibilityWebsiteScannerScanRequest) (*WebsiteScannerScanCreated, error) {
	var out WebsiteScannerScanCreated
	if err := c.http.Post(ctx, "/api/website-scanner/v1/scans", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerScanOverview(ctx context.Context, scan_id string) (*WebsiteScannerScanOverview, error) {
	var out WebsiteScannerScanOverview
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + url.PathEscape(scan_id) + "/overview", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerScanRuns(ctx context.Context, scan_id string, page string, page_size string) (*WebsiteScannerScanRunList, error) {
	var out WebsiteScannerScanRunList
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + url.PathEscape(scan_id) + "/scan_runs", map[string]string{"page": page, "page_size": page_size}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerScanRunSummary(ctx context.Context, scan_id string, scan_run_id string) (*WebsiteScannerScanRunSummary, error) {
	var out WebsiteScannerScanRunSummary
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + url.PathEscape(scan_id) + "/scan_runs/" + url.PathEscape(scan_run_id), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerScanRunStatus(ctx context.Context, scan_id string, scan_run_id string) (*WebsiteScannerScanRunStatus, error) {
	var out WebsiteScannerScanRunStatus
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + url.PathEscape(scan_id) + "/scan_runs/" + url.PathEscape(scan_run_id) + "/status", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerScanRunIssues(ctx context.Context, scan_id string, scan_run_id string, task_id string, next_page string) (*WebsiteScannerScanRunIssues, error) {
	var out WebsiteScannerScanRunIssues
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + url.PathEscape(scan_id) + "/scan_runs/issues", map[string]string{"scan_run_id": scan_run_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetWebsiteScannerScanRunLogs(ctx context.Context, scan_id string, scan_run_id string) (*WebsiteScannerScanRunLogs, error) {
	var out WebsiteScannerScanRunLogs
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + url.PathEscape(scan_id) + "/scan_runs/" + url.PathEscape(scan_run_id) + "/scan_logs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAutomatedTestProjects(ctx context.Context, next_page string) (*AutomatedTestsProjectList, error) {
	var out AutomatedTestsProjectList
	if err := c.http.Get(ctx, "/api/automated-tests/v1/projects", map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAutomatedTestBuilds(ctx context.Context, next_page string, projectId string) (*AutomatedTestsBuildList, error) {
	var out AutomatedTestsBuildList
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds", map[string]string{"next_page": next_page, "projectId": projectId}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAutomatedTestBuildTestCases(ctx context.Context, thBuildId string, next_page string) (*AutomatedTestsBuildTestCases, error) {
	var out AutomatedTestsBuildTestCases
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + url.PathEscape(thBuildId) + "/test-cases", map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAutomatedTestBuildSummary(ctx context.Context, thBuildId string, next_page string) (*AutomatedTestsBuildSummary, error) {
	var out AutomatedTestsBuildSummary
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + url.PathEscape(thBuildId), map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAutomatedTestBuildIssues(ctx context.Context, build_id string, task_id string, next_page string) (*AutomatedTestsBuildIssues, error) {
	var out AutomatedTestsBuildIssues
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/issues", map[string]string{"build_id": build_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAutomatedTestBuildTestCaseSummary(ctx context.Context, thBuildId string, test_case_id string, next_page string) (*AutomatedTestsTestCaseSummary, error) {
	var out AutomatedTestsTestCaseSummary
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + url.PathEscape(thBuildId) + "/test-cases/" + url.PathEscape(test_case_id), map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAutomatedTestBuildTestCaseIssues(ctx context.Context, thBuildId string, test_case string, task_id string, next_page string) (*AutomatedTestsTestCaseIssues, error) {
	var out AutomatedTestsTestCaseIssues
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + url.PathEscape(thBuildId) + "/issues", map[string]string{"test_case": test_case, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
