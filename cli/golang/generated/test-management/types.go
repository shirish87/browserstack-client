package management

type PaginationInfo struct {
	Page *int `json:"page"`
	PageSize *int `json:"page_size"`
	Count *int `json:"count"`
	Prev *int `json:"prev"`
	Next *int `json:"next"`
}

type ProjectSummary struct {
	Name *string `json:"name"`
	Identifier *string `json:"identifier"`
}

type Project struct {
	Name *string `json:"name"`
	Identifier *string `json:"identifier"`
	Description *string `json:"description"`
	CreatedAt *string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	TeamId []int `json:"team_id"`
}

type FolderSummary struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	ParentId *int `json:"parent_id"`
	SubFoldersCount *int `json:"sub_folders_count"`
	Links map[string]any `json:"links"`
}

type Folder struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	Description *string `json:"description"`
	ParentId *int `json:"parent_id"`
	CasesCount *int `json:"cases_count"`
	SubFoldersCount *int `json:"sub_folders_count"`
	Links map[string]any `json:"links"`
}

type TestCaseStep struct {
	Id *int `json:"id"`
	Order *int `json:"order"`
	Description *string `json:"description"`
	Result *string `json:"result"`
}

type TestCase struct {
	Identifier *string `json:"identifier"`
	Name *string `json:"name"`
	Description *string `json:"description"`
	Owner *string `json:"owner"`
	Preconditions *string `json:"preconditions"`
	CaseType *string `json:"case_type"`
	Priority *string `json:"priority"`
	Status *string `json:"status"`
	AutomationStatus *string `json:"automation_status"`
	Archived *string `json:"archived"`
	FolderId *int `json:"folder_id"`
	Template *string `json:"template"`
	Tags []string `json:"tags"`
	TestCaseSteps []any `json:"test_case_steps"`
	Issues []string `json:"issues"`
	CustomFields map[string]any `json:"custom_fields"`
	CreatedAt *string `json:"created_at"`
	UpdatedAt *string `json:"updated_at"`
	Feature *string `json:"feature"`
	Scenario *string `json:"scenario"`
	Background *string `json:"background"`
}

type TestRunSummary struct {
	Identifier *string `json:"identifier"`
	Name *string `json:"name"`
	ActiveState *string `json:"active_state"`
	RunState *string `json:"run_state"`
	Assignee *string `json:"assignee"`
	CreatedAt *string `json:"created_at"`
	ProjectId *string `json:"project_id"`
	TestCasesCount *int `json:"test_cases_count"`
	Configurations []int `json:"configurations"`
}

type TestRun struct {
	Identifier *string `json:"identifier"`
	Name *string `json:"name"`
	Description *string `json:"description"`
	ActiveState *string `json:"active_state"`
	RunState *string `json:"run_state"`
	Assignee *string `json:"assignee"`
	CreatedAt *string `json:"created_at"`
	UpdatedAt *string `json:"updated_at"`
	ProjectId *string `json:"project_id"`
	TestCasesCount *int `json:"test_cases_count"`
	Tags []string `json:"tags"`
	Issues []string `json:"issues"`
	TestPlan map[string]any `json:"test_plan"`
}

type TestRunTestCase struct {
	Identifier *string `json:"identifier"`
	Name *string `json:"name"`
	Description *string `json:"description"`
	CaseType *string `json:"case_type"`
	Priority *string `json:"priority"`
	Status *string `json:"status"`
	Assignee *string `json:"assignee"`
	LatestStatus *string `json:"latest_status"`
	LatestResultId *int `json:"latest_result_id"`
	ConfigurationId *int `json:"configuration_id"`
	FolderPath []int `json:"folder_path"`
	Steps []any `json:"steps"`
	Dataset []any `json:"dataset"`
	CreatedAt *string `json:"created_at"`
	LastUpdatedAt *string `json:"last_updated_at"`
	CreatedBy *string `json:"created_by"`
	LastUpdatedBy *string `json:"last_updated_by"`
}

type TestRunInput struct {
	Name *string `json:"name"`
	Description *string `json:"description"`
	RunState *string `json:"run_state"`
	Assignee *string `json:"assignee"`
	TestCaseAssignee *string `json:"test_case_assignee"`
	Tags []string `json:"tags"`
	Issues []string `json:"issues"`
	IssueTracker map[string]any `json:"issue_tracker"`
	TestPlanId *string `json:"test_plan_id"`
	Configurations []int `json:"configurations"`
	ConfigurationMap []any `json:"configuration_map"`
	TestCases []string `json:"test_cases"`
	FolderIds []int `json:"folder_ids"`
	IncludeAll *bool `json:"include_all"`
	FilterTestCases map[string]any `json:"filter_test_cases"`
}

type TestRunPatchInput struct {
	Name *string `json:"name"`
	RunState *string `json:"run_state"`
	Tags []string `json:"tags"`
	Configurations []int `json:"configurations"`
	ConfigurationMap []any `json:"configuration_map"`
	FilterTestCases map[string]any `json:"filter_test_cases"`
}

type TestPlan struct {
	Identifier *string `json:"identifier"`
	Name *string `json:"name"`
	Description *string `json:"description"`
	ActiveState *string `json:"active_state"`
	PlanStatus *string `json:"plan_status"`
	ProjectId *string `json:"project_id"`
	StartDate *string `json:"start_date"`
	EndDate *string `json:"end_date"`
	CreatedAt *string `json:"created_at"`
	TestRunsCount map[string]any `json:"test_runs_count"`
}

type TestResult struct {
	Id *int `json:"id"`
	TestRunId *string `json:"test_run_id"`
	TestCaseId *string `json:"test_case_id"`
	ConfigurationId *int `json:"configuration_id"`
	Status *string `json:"status"`
	Comment *string `json:"comment"`
	Duration *int `json:"duration"`
	CreatedAt *string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	Attachments []any `json:"attachments"`
	Issues []string `json:"issues"`
	CustomFields map[string]any `json:"custom_fields"`
}

type TestResultInput struct {
	Status string `json:"status"`
	Comment *string `json:"comment"`
	Duration *int `json:"duration"`
	Issues []string `json:"issues"`
	IssueTracker map[string]any `json:"issue_tracker"`
	CustomFields map[string]any `json:"custom_fields"`
}

type Attachment struct {
	Id *int `json:"id"`
	Filename *string `json:"filename"`
	FileSize *int `json:"file_size"`
	CreatedAt *string `json:"created_at"`
	CreatedBy *string `json:"created_by"`
	Url *string `json:"url"`
	Inline *bool `json:"inline"`
}

type Configuration struct {
	Id *int `json:"id"`
	Name *string `json:"name"`
	CreatedAt *string `json:"created_at"`
}

type CustomField struct {
	Id *string `json:"id"`
	FieldName *string `json:"field_name"`
	PlaceHolderText *string `json:"place_holder_text"`
	FieldType *string `json:"field_type"`
	IsRequired *bool `json:"is_required"`
	Options []any `json:"options"`
	AppliesToAllProjects *bool `json:"applies_to_all_projects"`
	FieldEntityType *string `json:"field_entity_type"`
	LinkToFutureProjects *bool `json:"link_to_future_projects"`
	AssignedProjects []string `json:"assigned_projects"`
	CreatedAt *string `json:"created_at"`
}
