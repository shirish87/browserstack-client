package accessibility

type Pagination struct {
	HasNext *bool `json:"has_next"`
	NextPage *string `json:"next_page"`
}

type EngineInfo struct {
	Name *string `json:"name"`
	Version *string `json:"version"`
}

type IssueSummary struct {
	ComponentCount *int `json:"componentCount"`
	IssueCount *int `json:"issueCount"`
	PageCount *int `json:"pageCount"`
}

type IssueSummaryFull struct {
	IssueCount *int `json:"issueCount"`
	PageCount *int `json:"pageCount"`
	ComponentCount *int `json:"componentCount"`
	NeedsReview *int `json:"needsReview"`
	Hidden *int `json:"hidden"`
}

type IssueCount struct {
	IssueCountBySeverity map[string]any `json:"issueCountBySeverity"`
	IssueCountByURL []any `json:"issueCountByURL"`
	IssueCountByComponent []any `json:"issueCountByComponent"`
	IssueCountByCategory []any `json:"issueCountByCategory"`
}

type ScoreData struct {
	Score *int `json:"score"`
	Impact map[string]any `json:"impact"`
}

type ScoreDataDetailed struct {
	Score *int `json:"score"`
	Impact map[string]any `json:"impact"`
}

type ChangesSinceLastRun struct {
	NewIssues *int `json:"newIssues"`
	RetainedIssues *int `json:"retainedIssues"`
	ResolvedIssues *int `json:"resolvedIssues"`
}

type OsData struct {
	Name *string `json:"name"`
	Version *string `json:"version"`
	Logo *string `json:"logo"`
}

type BrowserData struct {
	Name *string `json:"name"`
	Version *string `json:"version"`
	Logo *string `json:"logo"`
}

type AuthConfig struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	Type *string `json:"type"`
	AuthData map[string]any `json:"authData"`
}

type WorkflowAnalyzerReportList struct {
	Reports []any `json:"reports"`
	Pagination *Pagination `json:"pagination"`
}

type WorkflowAnalyzerReportSummary struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	CreatedBy map[string]any `json:"createdBy"`
	Time *string `json:"time"`
	WcagVersion *string `json:"wcagVersion"`
	Status *string `json:"status"`
	NeedsReview *bool `json:"needsReview"`
	BestPractices *bool `json:"bestPractices"`
	Advanced *bool `json:"advanced"`
	ScanType *string `json:"scanType"`
	EngineInfo *EngineInfo `json:"engineInfo"`
	ScoreData *ScoreData `json:"scoreData"`
	IssueSummary *IssueSummary `json:"issueSummary"`
	IssueCount *IssueCount `json:"issueCount"`
}

type WorkflowAnalyzerReportIssues struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	Time *string `json:"time"`
	WcagVersion *string `json:"wcagVersion"`
	Status *string `json:"status"`
	NeedsReview *bool `json:"needsReview"`
	BestPractices *bool `json:"bestPractices"`
	Advanced *bool `json:"advanced"`
	ScanType *string `json:"scanType"`
	EngineInfo *EngineInfo `json:"engineInfo"`
	ReportLink *string `json:"report_link"`
	Pagination *Pagination `json:"pagination"`
}

type AssistedTestReportList struct {
	Reports []any `json:"reports"`
	Pagination *Pagination `json:"pagination"`
}

type AssistedTestReportSummary struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	CreatedBy map[string]any `json:"createdBy"`
	Time *string `json:"time"`
	WcagVersion *string `json:"wcagVersion"`
	Status *string `json:"status"`
	NeedsReview *bool `json:"needsReview"`
	BestPractices *bool `json:"bestPractices"`
	Advanced *bool `json:"advanced"`
	ScanType *string `json:"scanType"`
	EngineInfo *EngineInfo `json:"engineInfo"`
	ScoreData *ScoreData `json:"scoreData"`
	IssueSummary *IssueSummary `json:"issueSummary"`
	IssueCount *IssueCount `json:"issueCount"`
	AssistedTestType *string `json:"assistedTestType"`
}

type AssistedTestReportIssues struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	Time *string `json:"time"`
	WcagVersion *string `json:"wcagVersion"`
	Status *string `json:"status"`
	NeedsReview *bool `json:"needsReview"`
	BestPractices *bool `json:"bestPractices"`
	Advanced *bool `json:"advanced"`
	ScanType *string `json:"scanType"`
	EngineInfo *EngineInfo `json:"engineInfo"`
	ReportLink *string `json:"report_link"`
	Pagination *Pagination `json:"pagination"`
	AssistedTestType *string `json:"assistedTestType"`
}

type WebsiteScannerScanCreated struct {
	Id *int `json:"id"`
	ScanRunId *int `json:"scanRunId"`
	UrlCount *int `json:"urlCount"`
}

type WebsiteScannerScanList struct {
	Scans []any `json:"scans"`
	Pagination *Pagination `json:"pagination"`
}

type WebsiteScannerScanOverview struct {
	ScanConfigInfo map[string]any `json:"scanConfigInfo"`
	UrlList []string `json:"urlList"`
}

type WebsiteScannerScanRunList struct {
	ScanRuns []any `json:"scan_runs"`
	Pagination *Pagination `json:"pagination"`
}

type WebsiteScannerScanRunSummary struct {
	ScanId *int `json:"scan_id"`
	ScanRunId *int `json:"scan_run_id"`
	Time *string `json:"time"`
	NeedsReview *bool `json:"needsReview"`
	BestPractices *bool `json:"bestPractices"`
	Advanced *bool `json:"advanced"`
	WcagVersion *string `json:"wcagVersion"`
	EngineInfo *EngineInfo `json:"engineInfo"`
	AuthEnabled *bool `json:"authEnabled"`
	LocalTestingEnabled *bool `json:"localTestingEnabled"`
	Status *string `json:"status"`
	ChangesSinceLastRun *ChangesSinceLastRun `json:"changesSinceLastRun"`
	ScoreData *ScoreData `json:"scoreData"`
	IssueSummary *IssueSummaryFull `json:"issueSummary"`
	IssueCount *IssueCount `json:"issueCount"`
	Pagination *Pagination `json:"pagination"`
}

type WebsiteScannerScanRunStatus struct {
	ScanId *int `json:"scan_id"`
	ScanRunId *int `json:"scan_run_id"`
	Status *string `json:"status"`
}

type WebsiteScannerScanRunIssues struct {
	ScanId *int `json:"scan_id"`
	ScanRunId *int `json:"scan_run_id"`
	Time *string `json:"time"`
	NeedsReview *bool `json:"needsReview"`
	BestPractices *bool `json:"bestPractices"`
	Advanced *bool `json:"advanced"`
	EngineInfo *EngineInfo `json:"engineInfo"`
	WcagVersion *string `json:"wcagVersion"`
	ReportLink *string `json:"report_link"`
}

type WebsiteScannerScanRunLogs struct {
	UrlCount *int `json:"urlCount"`
	ScanLogs []any `json:"scanLogs"`
}

type AutomatedTestsProjectList struct {
	Projects []any `json:"projects"`
	Pagination *Pagination `json:"pagination"`
}

type AutomatedTestsBuildList struct {
	Builds []any `json:"builds"`
	Pagination *Pagination `json:"pagination"`
}

type AutomatedTestsBuildTestCases struct {
	TestCases []any `json:"testCases"`
	Pagination *Pagination `json:"pagination"`
}

type AutomatedTestsBuildSummary struct {
	Id *int `json:"id"`
	BuildNumber *int `json:"buildNumber"`
	WcagVersion *string `json:"wcagVersion"`
	TestEngine *EngineInfo `json:"testEngine"`
	ChangesSinceLastRun *ChangesSinceLastRun `json:"changesSinceLastRun"`
	ScoreData *ScoreDataDetailed `json:"scoreData"`
	CreatedAt *string `json:"createdAt"`
	Advanced *bool `json:"advanced"`
	NeedsReview *bool `json:"needsReview"`
	BestPractice *bool `json:"bestPractice"`
	SessionData map[string]any `json:"sessionData"`
	HealthSummary map[string]any `json:"healthSummary"`
	IssueSummary *IssueSummaryFull `json:"issueSummary"`
	IssueCount *IssueCount `json:"issueCount"`
	Pagination *Pagination `json:"pagination"`
}

type AutomatedTestsBuildIssues struct {
	BuildNumber *int `json:"buildNumber"`
	BuildUId *string `json:"buildUId"`
	WcagVersion *string `json:"wcagVersion"`
	TestEngine *EngineInfo `json:"testEngine"`
	Time *string `json:"time"`
	Advanced *bool `json:"advanced"`
	NeedsReview *bool `json:"needsReview"`
	BestPractice *bool `json:"bestPractice"`
	ReportLink *string `json:"report_link"`
	Pagination *Pagination `json:"pagination"`
}

type AutomatedTestsTestCaseSummary struct {
	Name *string `json:"name"`
	Tags *string `json:"tags"`
	File *string `json:"file"`
	ScopeList []string `json:"scopeList"`
	OsData *OsData `json:"osData"`
	BrowserData *BrowserData `json:"browserData"`
	ChangesSinceLastRun *ChangesSinceLastRun `json:"changesSinceLastRun"`
	ScoreData *ScoreDataDetailed `json:"scoreData"`
	IssueSummary *IssueSummaryFull `json:"issueSummary"`
	IssueCount *IssueCount `json:"issueCount"`
	Pagination *Pagination `json:"pagination"`
}

type AutomatedTestsTestCaseIssues struct {
	Name *string `json:"name"`
	Tags *string `json:"tags"`
	File *string `json:"file"`
	ScopeList []string `json:"scopeList"`
	OsData *OsData `json:"osData"`
	BrowserData *BrowserData `json:"browserData"`
	ReportLink *string `json:"report_link"`
	Pagination *Pagination `json:"pagination"`
}
