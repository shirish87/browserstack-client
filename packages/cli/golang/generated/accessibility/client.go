package accessibility

import (
	"context"
	"strconv"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type AccessibilityClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *AccessibilityClient {
	return &AccessibilityClient{http: c}
}

func (c *AccessibilityClient) GetAccessibilityWorkflowAnalyzerReports(ctx context.Context) (*WorkflowAnalyzerReportList, error) {
	var out WorkflowAnalyzerReportList
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWorkflowAnalyzerReportSummary(ctx context.Context, report_id int) (*WorkflowAnalyzerReportSummary, error) {
	var out WorkflowAnalyzerReportSummary
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports/" + strconv.Itoa(report_id), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWorkflowAnalyzerReportIssues(ctx context.Context, report_id int, task_id string, next_page string) (*WorkflowAnalyzerReportIssues, error) {
	var out WorkflowAnalyzerReportIssues
	if err := c.http.Get(ctx, "/api/workflow-analyzer/v1/reports/issues", map[string]string{"report_id": strconv.Itoa(report_id), "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAssistedTestReports(ctx context.Context) (*AssistedTestReportList, error) {
	var out AssistedTestReportList
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAssistedTestReportSummary(ctx context.Context, report_id int) (*AssistedTestReportSummary, error) {
	var out AssistedTestReportSummary
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports/" + strconv.Itoa(report_id), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAssistedTestReportIssues(ctx context.Context, report_id int, task_id string, next_page string) (*AssistedTestReportIssues, error) {
	var out AssistedTestReportIssues
	if err := c.http.Get(ctx, "/api/assisted-test/v1/reports/issues", map[string]string{"report_id": strconv.Itoa(report_id), "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerAuthConfigs(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/api/website-scanner/v1/auth_configs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) CreateAccessibilityWebsiteScannerAuthConfig(ctx context.Context, body *CreateAccessibilityWebsiteScannerAuthConfigRequest) (*AuthConfig, error) {
	var out AuthConfig
	if err := c.http.Post(ctx, "/api/website-scanner/v1/auth_configs", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScans(ctx context.Context) (*WebsiteScannerScanList, error) {
	var out WebsiteScannerScanList
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) CreateAccessibilityWebsiteScannerScan(ctx context.Context, body *CreateAccessibilityWebsiteScannerScanRequest) (*WebsiteScannerScanCreated, error) {
	var out WebsiteScannerScanCreated
	if err := c.http.Post(ctx, "/api/website-scanner/v1/scans", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanOverview(ctx context.Context, scan_id int) (*WebsiteScannerScanOverview, error) {
	var out WebsiteScannerScanOverview
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + strconv.Itoa(scan_id) + "/overview", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRuns(ctx context.Context, scan_id int, page int, page_size int) (*WebsiteScannerScanRunList, error) {
	var out WebsiteScannerScanRunList
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + strconv.Itoa(scan_id) + "/scan_runs", map[string]string{"page": strconv.Itoa(page), "page_size": strconv.Itoa(page_size)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunSummary(ctx context.Context, scan_id int, scan_run_id int) (*WebsiteScannerScanRunSummary, error) {
	var out WebsiteScannerScanRunSummary
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + strconv.Itoa(scan_id) + "/scan_runs/" + strconv.Itoa(scan_run_id), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunStatus(ctx context.Context, scan_id int, scan_run_id int) (*WebsiteScannerScanRunStatus, error) {
	var out WebsiteScannerScanRunStatus
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + strconv.Itoa(scan_id) + "/scan_runs/" + strconv.Itoa(scan_run_id) + "/status", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunIssues(ctx context.Context, scan_id int, scan_run_id int, task_id string, next_page string) (*WebsiteScannerScanRunIssues, error) {
	var out WebsiteScannerScanRunIssues
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + strconv.Itoa(scan_id) + "/scan_runs/issues", map[string]string{"scan_run_id": strconv.Itoa(scan_run_id), "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityWebsiteScannerScanRunLogs(ctx context.Context, scan_id int, scan_run_id int) (*WebsiteScannerScanRunLogs, error) {
	var out WebsiteScannerScanRunLogs
	if err := c.http.Get(ctx, "/api/website-scanner/v1/scans/" + strconv.Itoa(scan_id) + "/scan_runs/" + strconv.Itoa(scan_run_id) + "/scan_logs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestProjects(ctx context.Context, next_page string) (*AutomatedTestsProjectList, error) {
	var out AutomatedTestsProjectList
	if err := c.http.Get(ctx, "/api/automated-tests/v1/projects", map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuilds(ctx context.Context, next_page string, projectId int) (*AutomatedTestsBuildList, error) {
	var out AutomatedTestsBuildList
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds", map[string]string{"next_page": next_page, "projectId": strconv.Itoa(projectId)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildTestCases(ctx context.Context, thBuildId string, next_page string) (*AutomatedTestsBuildTestCases, error) {
	var out AutomatedTestsBuildTestCases
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId + "/test-cases", map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildSummary(ctx context.Context, thBuildId string, next_page string) (*AutomatedTestsBuildSummary, error) {
	var out AutomatedTestsBuildSummary
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId, map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildIssues(ctx context.Context, build_id string, task_id string, next_page string) (*AutomatedTestsBuildIssues, error) {
	var out AutomatedTestsBuildIssues
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/issues", map[string]string{"build_id": build_id, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildTestCaseSummary(ctx context.Context, thBuildId string, test_case_id string, next_page string) (*AutomatedTestsTestCaseSummary, error) {
	var out AutomatedTestsTestCaseSummary
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId + "/test-cases/" + test_case_id, map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AccessibilityClient) GetAccessibilityAutomatedTestBuildTestCaseIssues(ctx context.Context, thBuildId string, test_case string, task_id string, next_page string) (*AutomatedTestsTestCaseIssues, error) {
	var out AutomatedTestsTestCaseIssues
	if err := c.http.Get(ctx, "/api/automated-tests/v1/builds/" + thBuildId + "/issues", map[string]string{"test_case": test_case, "task_id": task_id, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
