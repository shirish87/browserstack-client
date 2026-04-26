package testmanagement

// Generated CLI dispatcher. Do not modify.

import (
	"context"
	"fmt"
)

func argAt(args []string, i int) string {
	if i < len(args) { return args[i] }
	return ""
}

func Dispatch(client *TestManagementClient, ctx context.Context, action string, args []string) (interface{}, error) {
	switch action {
	case ProjectsActionListProjects:
		return client.GetProjects(ctx, argAt(args, 0), argAt(args, 1))
	case ProjectsActionCreateProject:
		return client.CreateProject(ctx, nil)
	case ProjectsActionGetProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management get-project <projectId>")
		}
		return client.GetProject(ctx, args[0])
	case ProjectsActionUpdateProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management update-project <projectId>")
		}
		return client.UpdateProject(ctx, args[0], nil)
	case ProjectsActionDeleteProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management delete-project <projectId>")
		}
		return client.DeleteProject(ctx, args[0])
	case FoldersActionListFolders:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management list-folders <projectId> <p> <page_size>")
		}
		return client.GetFolders(ctx, args[0], argAt(args, 1), argAt(args, 2))
	case FoldersActionCreateFolder:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management create-folder <projectId>")
		}
		return client.CreateFolder(ctx, args[0], nil)
	case FoldersActionGetFolder:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management get-folder <projectId> <folderId>")
		}
		return client.GetFolder(ctx, args[0], args[1])
	case FoldersActionUpdateFolder:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management update-folder <projectId> <folderId>")
		}
		return client.UpdateFolder(ctx, args[0], args[1], nil)
	case FoldersActionDeleteFolder:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management delete-folder <projectId> <folderId>")
		}
		return client.DeleteFolder(ctx, args[0], args[1])
	case FoldersActionMoveFolder:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management move-folder <projectId> <folderId>")
		}
		return client.MoveFolder(ctx, args[0], args[1], nil)
	case TestCasesActionListTestCases:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management list-test-cases <projectId> <p> <page_size> <updated_after> <updated_before> <archived> <minify> <id> <status> <priority> <owner> <case_type> <folder_id> <tags> <issue_ids> <issue_type>")
		}
		return client.GetTestCases(ctx, args[0], argAt(args, 1), argAt(args, 2), argAt(args, 3), argAt(args, 4), argAt(args, 5), argAt(args, 6), argAt(args, 7), argAt(args, 8), argAt(args, 9), argAt(args, 10), argAt(args, 11), argAt(args, 12), argAt(args, 13), argAt(args, 14), argAt(args, 15))
	case TestCasesActionBulkEditTestCases:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management bulk-edit-test-cases <projectId>")
		}
		return client.BulkEditTestCases(ctx, args[0], nil)
	case TestCasesActionBulkDeleteTestCases:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management bulk-delete-test-cases <projectId>")
		}
		return client.BulkDeleteTestCases(ctx, args[0], nil)
	case TestCasesActionBulkArchiveTestCases:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management bulk-archive-test-cases <projectId>")
		}
		return client.BulkArchiveTestCases(ctx, args[0], nil)
	case TestCasesActionBulkUnarchiveTestCases:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management bulk-unarchive-test-cases <projectId>")
		}
		return client.BulkUnarchiveTestCases(ctx, args[0], nil)
	case TestCasesActionBulkEditTestCasesWithOperations:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management bulk-edit-test-cases-with-operations <projectId>")
		}
		return client.BulkEditTestCasesWithOperations(ctx, args[0], nil)
	case TestCasesActionCreateTestCase:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management create-test-case <projectId> <folderId>")
		}
		return client.CreateTestCase(ctx, args[0], args[1], nil)
	case TestCasesActionUpdateTestCase:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management update-test-case <projectId> <testCaseId>")
		}
		return client.UpdateTestCase(ctx, args[0], args[1], nil)
	case TestCasesActionDeleteTestCase:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management delete-test-case <projectId> <testCaseId>")
		}
		return client.DeleteTestCase(ctx, args[0], args[1])
	case TestCasesActionArchiveTestCase:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management archive-test-case <projectId> <testCaseId>")
		}
		return client.ArchiveTestCase(ctx, args[0], args[1])
	case TestCasesActionUnarchiveTestCase:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management unarchive-test-case <projectId> <testCaseId>")
		}
		return client.UnarchiveTestCase(ctx, args[0], args[1])
	case TestCasesActionMoveTestCase:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management move-test-case <projectId> <testCaseId>")
		}
		return client.MoveTestCase(ctx, args[0], args[1], nil)
	case AttachmentsActionListTestCaseAttachments:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management list-test-case-attachments <projectId> <testCaseId> <p>")
		}
		return client.GetTestCaseAttachments(ctx, args[0], args[1], argAt(args, 2))
	case AttachmentsActionAddTestCaseAttachment:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management add-test-case-attachment <projectId> <testCaseId> <inline>")
		}
		return client.AddTestCaseAttachment(ctx, args[0], args[1], argAt(args, 2), nil, "", nil)
	case AttachmentsActionDeleteTestCaseAttachment:
		if len(args) < 3 {
			return nil, fmt.Errorf("usage: test-management delete-test-case-attachment <projectId> <testCaseId> <attachmentId>")
		}
		return client.DeleteTestCaseAttachment(ctx, args[0], args[1], args[2])
	case AttachmentsActionListTestResultAttachments:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management list-test-result-attachments <projectId> <testResultId> <p>")
		}
		return client.GetTestResultAttachments(ctx, args[0], args[1], argAt(args, 2))
	case AttachmentsActionAddTestResultAttachment:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management add-test-result-attachment <projectId> <testResultId>")
		}
		return client.AddTestResultAttachment(ctx, args[0], args[1], nil, "", nil)
	case AttachmentsActionDeleteTestResultAttachment:
		if len(args) < 3 {
			return nil, fmt.Errorf("usage: test-management delete-test-result-attachment <projectId> <testResultId> <attachmentId>")
		}
		return client.DeleteTestResultAttachment(ctx, args[0], args[1], args[2])
	case TestResultsActionListTestCaseResults:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management list-test-case-results <projectId> <testCaseId> <p>")
		}
		return client.GetTestCaseResults(ctx, args[0], args[1], argAt(args, 2))
	case TestResultsActionListTestRunResults:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management list-test-run-results <projectId> <testRunId> <p> <validate_tc>")
		}
		return client.GetTestRunResults(ctx, args[0], args[1], argAt(args, 2), argAt(args, 3))
	case TestResultsActionAddTestRunResults:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management add-test-run-results <projectId> <testRunId>")
		}
		return client.AddTestRunResults(ctx, args[0], args[1], nil)
	case TestResultsActionListTestRunTestCaseResults:
		if len(args) < 3 {
			return nil, fmt.Errorf("usage: test-management list-test-run-test-case-results <projectId> <testRunId> <testCaseId> <p>")
		}
		return client.GetTestRunTestCaseResults(ctx, args[0], args[1], args[2], argAt(args, 3))
	case TestRunsActionListTestRuns:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management list-test-runs <projectId> <closed_before> <closed_after> <created_before> <created_after> <test_plan_id> <assignee> <include_closed> <run_state>")
		}
		return client.GetTestRuns(ctx, args[0], argAt(args, 1), argAt(args, 2), argAt(args, 3), argAt(args, 4), argAt(args, 5), argAt(args, 6), argAt(args, 7), argAt(args, 8))
	case TestRunsActionCreateTestRun:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management create-test-run <projectId>")
		}
		return client.CreateTestRun(ctx, args[0], nil)
	case TestRunsActionGetTestRun:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management get-test-run <projectId> <testRunId> <minify>")
		}
		return client.GetTestRun(ctx, args[0], args[1], argAt(args, 2))
	case TestRunsActionListTestRunTestCases:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management list-test-run-test-cases <projectId> <testRunId> <p> <fetch_steps> <minify>")
		}
		return client.GetTestRunTestCases(ctx, args[0], args[1], argAt(args, 2), argAt(args, 3), argAt(args, 4))
	case TestRunsActionPatchTestRun:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management patch-test-run <projectId> <testRunId>")
		}
		return client.PatchTestRun(ctx, args[0], args[1], nil)
	case TestRunsActionUpdateTestRun:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management update-test-run <projectId> <testRunId>")
		}
		return client.UpdateTestRun(ctx, args[0], args[1], nil)
	case TestRunsActionAssignTestRunTestCases:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management assign-test-run-test-cases <projectId> <testRunId>")
		}
		return client.AssignTestRunTestCases(ctx, args[0], args[1], nil)
	case TestRunsActionCloseTestRun:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management close-test-run <projectId> <testRunId>")
		}
		return client.CloseTestRun(ctx, args[0], args[1])
	case TestRunsActionDeleteTestRun:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management delete-test-run <projectId> <testRunId>")
		}
		return client.DeleteTestRun(ctx, args[0], args[1])
	case TestPlansActionListTestPlans:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management list-test-plans <projectId> <p> <page_size>")
		}
		return client.GetTestPlans(ctx, args[0], argAt(args, 1), argAt(args, 2))
	case TestPlansActionCreateTestPlan:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management create-test-plan <projectId>")
		}
		return client.CreateTestPlan(ctx, args[0], nil)
	case TestPlansActionGetTestPlan:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management get-test-plan <projectId> <testPlanId>")
		}
		return client.GetTestPlan(ctx, args[0], args[1])
	case TestPlansActionUpdateTestPlan:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management update-test-plan <projectId> <testPlanId>")
		}
		return client.UpdateTestPlan(ctx, args[0], args[1], nil)
	case TestPlansActionListTestPlanTestRuns:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: test-management list-test-plan-test-runs <projectId> <testPlanId> <p>")
		}
		return client.GetTestPlanTestRuns(ctx, args[0], args[1], argAt(args, 2))
	case ConfigurationsActionListConfigurations:
		return client.GetConfigurations(ctx, argAt(args, 0), argAt(args, 1))
	case ConfigurationsActionCreateConfiguration:
		return client.CreateConfiguration(ctx, nil)
	case ConfigurationsActionGetConfiguration:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management get-configuration <configurationId>")
		}
		return client.GetConfiguration(ctx, args[0])
	case CustomFieldsActionListCustomFields:
		return client.GetCustomFields(ctx)
	case CustomFieldsActionCreateCustomField:
		return client.CreateCustomField(ctx, nil)
	case CustomFieldsActionUpdateCustomField:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management update-custom-field <customFieldId>")
		}
		return client.UpdateCustomField(ctx, args[0], nil)
	case CustomFieldsActionDeleteCustomField:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: test-management delete-custom-field <customFieldId>")
		}
		return client.DeleteCustomField(ctx, args[0])
	default:
		return nil, fmt.Errorf("unknown action: %s", action)
	}
}
