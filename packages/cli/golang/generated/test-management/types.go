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

type TestRunDetail struct {
	Configurations []int `json:"configurations"`
	TestCases []any `json:"test_cases"`
	Links map[string]any `json:"links"`
	PassedCount *int `json:"passed_count"`
	FailedCount *int `json:"failed_count"`
	OverallProgress map[string]any `json:"overall_progress"`
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

type TestPlanDetail struct {
	TestRuns []any `json:"test_runs"`
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

type GetTestManagementProjectsResponse struct {
	Success *bool `json:"success"`
	Projects []any `json:"projects"`
	Info *PaginationInfo `json:"info"`
}

type CreateTestManagementProjectResponse struct {
	Success *bool `json:"success"`
	Project *Project `json:"project"`
}

type CreateTestManagementProjectRequest struct {
	Project map[string]any `json:"project"`
}

type GetTestManagementProjectResponse struct {
	Success *bool `json:"success"`
	Project *Project `json:"project"`
}

type UpdateTestManagementProjectResponse struct {
	Success *bool `json:"success"`
	Project *Project `json:"project"`
}

type UpdateTestManagementProjectRequest struct {
	Project map[string]any `json:"project"`
}

type DeleteTestManagementProjectResponse struct {
	Success *bool `json:"success"`
	Message *string `json:"message"`
}

type GetTestManagementFoldersResponse struct {
	Success *bool `json:"success"`
	Folders []any `json:"folders"`
	Info *PaginationInfo `json:"info"`
}

type CreateTestManagementFolderResponse struct {
	Success *bool `json:"success"`
	Folder *Folder `json:"folder"`
}

type CreateTestManagementFolderRequest struct {
	Folder map[string]any `json:"folder"`
}

type GetTestManagementFolderResponse struct {
	Success *bool `json:"success"`
	Folder *Folder `json:"folder"`
}

type UpdateTestManagementFolderResponse struct {
	Success *bool `json:"success"`
	Folder *Folder `json:"folder"`
}

type UpdateTestManagementFolderRequest struct {
	Folder map[string]any `json:"folder"`
}

type DeleteTestManagementFolderResponse struct {
	Success *bool `json:"success"`
}

type MoveTestManagementFolderResponse struct {
	Success *bool `json:"success"`
	Folder *Folder `json:"folder"`
}

type MoveTestManagementFolderRequest struct {
	ParentId *int `json:"parent_id"`
}

type GetTestManagementTestCasesResponse struct {
	Success *bool `json:"success"`
	TestCases []any `json:"test_cases"`
	Info *PaginationInfo `json:"info"`
}

type BulkEditTestManagementTestCasesResponse struct {
	Success *bool `json:"success"`
}

type BulkEditTestManagementTestCasesRequest struct {
	Ids []string `json:"ids"`
	TestCase map[string]any `json:"test_case"`
}

type BulkDeleteTestManagementTestCasesResponse struct {
	Success *bool `json:"success"`
}

type BulkDeleteTestManagementTestCasesRequest struct {
	Ids []string `json:"ids"`
}

type BulkArchiveTestManagementTestCasesResponse struct {
	Success *bool `json:"success"`
}

type BulkArchiveTestManagementTestCasesRequest struct {
	Ids []string `json:"ids"`
}

type BulkUnarchiveTestManagementTestCasesResponse struct {
	Success *bool `json:"success"`
}

type BulkUnarchiveTestManagementTestCasesRequest struct {
	Ids []string `json:"ids"`
}

type BulkEditTestManagementTestCasesWithOperationsResponse struct {
	Success *bool `json:"success"`
}

type BulkEditTestManagementTestCasesWithOperationsRequest struct {
	Ids []string `json:"ids"`
	TestCase map[string]any `json:"test_case"`
}

type CreateTestManagementTestCaseResponse struct {
	Success *bool `json:"success"`
	Data map[string]any `json:"data"`
}

type CreateTestManagementTestCaseRequest struct {
	TestCase map[string]any `json:"test_case"`
}

type UpdateTestManagementTestCaseResponse struct {
	Success *bool `json:"success"`
	Data map[string]any `json:"data"`
}

type UpdateTestManagementTestCaseRequest struct {
	TestCase map[string]any `json:"test_case"`
}

type DeleteTestManagementTestCaseResponse struct {
	Success *bool `json:"success"`
}

type ArchiveTestManagementTestCaseResponse struct {
	Success *bool `json:"success"`
	Data map[string]any `json:"data"`
}

type UnarchiveTestManagementTestCaseResponse struct {
	Success *bool `json:"success"`
	Data map[string]any `json:"data"`
}

type MoveTestManagementTestCaseResponse struct {
	Success *bool `json:"success"`
	Data map[string]any `json:"data"`
}

type MoveTestManagementTestCaseRequest struct {
	DestinationFolderId int `json:"destination_folder_id"`
}

type GetTestManagementTestCaseAttachmentsResponse struct {
	Success *bool `json:"success"`
	Attachments []any `json:"attachments"`
	Info *PaginationInfo `json:"info"`
}

type AddTestManagementTestCaseAttachmentResponse struct {
	Success *bool `json:"success"`
	Attachment *Attachment `json:"attachment"`
}

type DeleteTestManagementTestCaseAttachmentResponse struct {
	Success *bool `json:"success"`
}

type GetTestManagementTestCaseResultsResponse struct {
	Success *bool `json:"success"`
	TestResults []any `json:"test_results"`
	Info *PaginationInfo `json:"info"`
}

type GetTestManagementTestRunsResponse struct {
	Success *bool `json:"success"`
	TestRuns []any `json:"test_runs"`
}

type CreateTestManagementTestRunResponse struct {
	Success *bool `json:"success"`
	TestRun *TestRun `json:"test_run"`
}

type CreateTestManagementTestRunRequest struct {
	TestRun *TestRunInput `json:"test_run"`
}

type GetTestManagementTestRunResponse struct {
	Success *bool `json:"success"`
	TestRun *TestRunDetail `json:"test_run"`
}

type GetTestManagementTestRunTestCasesResponse struct {
	Success *bool `json:"success"`
	TestCases []any `json:"test_cases"`
	Info *PaginationInfo `json:"info"`
}

type UpdateTestManagementTestRunResponse struct {
	Success *bool `json:"success"`
	Testrun *TestRun `json:"testrun"`
}

type UpdateTestManagementTestRunRequest struct {
	TestRun *TestRunInput `json:"test_run"`
}

type PatchTestManagementTestRunResponse struct {
	Success *bool `json:"success"`
	Testrun *TestRun `json:"testrun"`
}

type PatchTestManagementTestRunRequest struct {
	TestRun *TestRunPatchInput `json:"test_run"`
}

type AssignTestManagementTestRunTestCasesResponse struct {
	Success *bool `json:"success"`
}

type AssignTestManagementTestRunTestCasesRequest struct {
	AssignTo []any `json:"assign_to"`
}

type CloseTestManagementTestRunResponse struct {
	Success *bool `json:"success"`
	Testrun *TestRun `json:"testrun"`
}

type DeleteTestManagementTestRunResponse struct {
	Success *bool `json:"success"`
	Message *string `json:"message"`
}

type GetTestManagementTestRunResultsResponse struct {
	Success *bool `json:"success"`
	TestResults []any `json:"test_results"`
	Info *PaginationInfo `json:"info"`
}

type AddTestManagementTestRunResultsResponse struct {
	Success *bool `json:"success"`
}

type AddTestManagementTestRunResultsRequest struct {

}

type GetTestManagementTestRunTestCaseResultsResponse struct {
	Success *bool `json:"success"`
	TestResults []any `json:"test_results"`
	Info *PaginationInfo `json:"info"`
}

type GetTestManagementTestResultAttachmentsResponse struct {
	Success *bool `json:"success"`
	Attachments []any `json:"attachments"`
	Info *PaginationInfo `json:"info"`
}

type AddTestManagementTestResultAttachmentResponse struct {
	Success *bool `json:"success"`
	Attachment *Attachment `json:"attachment"`
}

type DeleteTestManagementTestResultAttachmentResponse struct {
	Success *bool `json:"success"`
}

type GetTestManagementTestPlansResponse struct {
	Success *bool `json:"success"`
	TestPlans []any `json:"test_plans"`
	Info *PaginationInfo `json:"info"`
}

type CreateTestManagementTestPlanResponse struct {
	Success *bool `json:"success"`
	TestPlan *TestPlan `json:"test_plan"`
}

type CreateTestManagementTestPlanRequest struct {
	TestPlan map[string]any `json:"test_plan"`
}

type GetTestManagementTestPlanResponse struct {
	Success *bool `json:"success"`
	TestPlan *TestPlanDetail `json:"test_plan"`
}

type UpdateTestManagementTestPlanResponse struct {
	Success *bool `json:"success"`
	TestPlan *TestPlan `json:"test_plan"`
}

type UpdateTestManagementTestPlanRequest struct {
	TestPlan map[string]any `json:"test_plan"`
}

type GetTestManagementTestPlanTestRunsResponse struct {
	Success *bool `json:"success"`
	TestRuns []any `json:"test_runs"`
	Info *PaginationInfo `json:"info"`
}

type GetTestManagementConfigurationsResponse struct {
	Success *bool `json:"success"`
	Configurations []any `json:"configurations"`
	Info *PaginationInfo `json:"info"`
}

type CreateTestManagementConfigurationResponse struct {
	Success *bool `json:"success"`
	Id *int `json:"id"`
	Name *string `json:"name"`
}

type CreateTestManagementConfigurationRequest struct {
	Name string `json:"name"`
}

type GetTestManagementConfigurationResponse struct {
	Success *bool `json:"success"`
	Configuration *Configuration `json:"configuration"`
}

type GetTestManagementCustomFieldsResponse struct {
	Success *bool `json:"success"`
	CustomFields []any `json:"custom_fields"`
}

type CreateTestManagementCustomFieldResponse struct {
	Success *bool `json:"success"`
	CustomField *CustomField `json:"custom_field"`
}

type CreateTestManagementCustomFieldRequest struct {
	FieldName string `json:"field_name"`
	PlaceHolderText *string `json:"place_holder_text"`
	FieldType string `json:"field_type"`
	IsRequired *bool `json:"is_required"`
	Options []any `json:"options"`
	AppliesToAllProjects *bool `json:"applies_to_all_projects"`
	FieldEntityType string `json:"field_entity_type"`
	LinkToFutureProjects *bool `json:"link_to_future_projects"`
	AssignedProjects []string `json:"assigned_projects"`
}

type UpdateTestManagementCustomFieldResponse struct {
	Data map[string]any `json:"data"`
}

type UpdateTestManagementCustomFieldRequest struct {
	FieldName *string `json:"field_name"`
	PlaceHolderText *string `json:"place_holder_text"`
	FieldType *string `json:"field_type"`
	IsRequired *bool `json:"is_required"`
	Options []any `json:"options"`
	AppliesToAllProjects *bool `json:"applies_to_all_projects"`
	FieldEntityType *string `json:"field_entity_type"`
	LinkToFutureProjects *bool `json:"link_to_future_projects"`
	AssignedProjects []string `json:"assigned_projects"`
}

type DeleteTestManagementCustomFieldResponse struct {
	Success *bool `json:"success"`
}
