package testmanagement

// Generated CLI constants. Do not modify.

const ProductTestManagement = "test-management"

const (
	ResourceProjects = "Projects"
	ResourceFolders = "Folders"
	ResourceTestCases = "TestCases"
	ResourceAttachments = "Attachments"
	ResourceTestResults = "TestResults"
	ResourceTestRuns = "TestRuns"
	ResourceTestPlans = "TestPlans"
	ResourceConfigurations = "Configurations"
	ResourceCustomFields = "CustomFields"
)

// Projects actions
const (
	ProjectsActionListProjects = "list-projects"
	ProjectsActionCreateProject = "create-project"
	ProjectsActionGetProject = "get-project"
	ProjectsActionUpdateProject = "update-project"
	ProjectsActionDeleteProject = "delete-project"
)

// Folders actions
const (
	FoldersActionListFolders = "list-folders"
	FoldersActionCreateFolder = "create-folder"
	FoldersActionGetFolder = "get-folder"
	FoldersActionUpdateFolder = "update-folder"
	FoldersActionDeleteFolder = "delete-folder"
	FoldersActionMoveFolder = "move-folder"
)

// TestCases actions
const (
	TestCasesActionListTestCases = "list-test-cases"
	TestCasesActionBulkEditTestCases = "bulk-edit-test-cases"
	TestCasesActionBulkDeleteTestCases = "bulk-delete-test-cases"
	TestCasesActionBulkArchiveTestCases = "bulk-archive-test-cases"
	TestCasesActionBulkUnarchiveTestCases = "bulk-unarchive-test-cases"
	TestCasesActionBulkEditTestCasesWithOperations = "bulk-edit-test-cases-with-operations"
	TestCasesActionCreateTestCase = "create-test-case"
	TestCasesActionUpdateTestCase = "update-test-case"
	TestCasesActionDeleteTestCase = "delete-test-case"
	TestCasesActionArchiveTestCase = "archive-test-case"
	TestCasesActionUnarchiveTestCase = "unarchive-test-case"
	TestCasesActionMoveTestCase = "move-test-case"
)

// Attachments actions
const (
	AttachmentsActionListTestCaseAttachments = "list-test-case-attachments"
	AttachmentsActionAddTestCaseAttachment = "add-test-case-attachment"
	AttachmentsActionDeleteTestCaseAttachment = "delete-test-case-attachment"
	AttachmentsActionListTestResultAttachments = "list-test-result-attachments"
	AttachmentsActionAddTestResultAttachment = "add-test-result-attachment"
	AttachmentsActionDeleteTestResultAttachment = "delete-test-result-attachment"
)

// TestResults actions
const (
	TestResultsActionListTestCaseResults = "list-test-case-results"
	TestResultsActionListTestRunResults = "list-test-run-results"
	TestResultsActionAddTestRunResults = "add-test-run-results"
	TestResultsActionListTestRunTestCaseResults = "list-test-run-test-case-results"
)

// TestRuns actions
const (
	TestRunsActionListTestRuns = "list-test-runs"
	TestRunsActionCreateTestRun = "create-test-run"
	TestRunsActionGetTestRun = "get-test-run"
	TestRunsActionListTestRunTestCases = "list-test-run-test-cases"
	TestRunsActionPatchTestRun = "patch-test-run"
	TestRunsActionUpdateTestRun = "update-test-run"
	TestRunsActionAssignTestRunTestCases = "assign-test-run-test-cases"
	TestRunsActionCloseTestRun = "close-test-run"
	TestRunsActionDeleteTestRun = "delete-test-run"
)

// TestPlans actions
const (
	TestPlansActionListTestPlans = "list-test-plans"
	TestPlansActionCreateTestPlan = "create-test-plan"
	TestPlansActionGetTestPlan = "get-test-plan"
	TestPlansActionUpdateTestPlan = "update-test-plan"
	TestPlansActionListTestPlanTestRuns = "list-test-plan-test-runs"
)

// Configurations actions
const (
	ConfigurationsActionListConfigurations = "list-configurations"
	ConfigurationsActionCreateConfiguration = "create-configuration"
	ConfigurationsActionGetConfiguration = "get-configuration"
)

// CustomFields actions
const (
	CustomFieldsActionListCustomFields = "list-custom-fields"
	CustomFieldsActionCreateCustomField = "create-custom-field"
	CustomFieldsActionUpdateCustomField = "update-custom-field"
	CustomFieldsActionDeleteCustomField = "delete-custom-field"
)

