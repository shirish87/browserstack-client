package main

import (
	"context"
	"fmt"
	"strconv"

	testmanagement "github.com/browserstack/browserstack-client/generated/test-management"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runTestManagement(c *browserstackhttp.Client, action string, args []string) error {
	client := testmanagement.New(c)
	ctx := context.Background()

	const usage = "Valid actions:\n" +
		"  get-projects, create-project, get-project, update-project, delete-project\n" +
		"  get-folders, create-folder, get-folder, update-folder, delete-folder, move-folder\n" +
		"  get-test-cases, bulk-edit-test-cases, bulk-delete-test-cases, bulk-archive-test-cases\n" +
		"  bulk-unarchive-test-cases, bulk-edit-test-cases-with-operations, create-test-case\n" +
		"  update-test-case, delete-test-case, archive-test-case, unarchive-test-case, move-test-case\n" +
		"  get-test-case-attachments, add-test-case-attachment, delete-test-case-attachment\n" +
		"  get-test-result-attachments, add-test-result-attachment, delete-test-result-attachment\n" +
		"  get-test-case-results, get-test-run-results, add-test-run-results, get-test-run-test-case-results\n" +
		"  get-test-runs, create-test-run, get-test-run, get-test-run-test-cases, patch-test-run\n" +
		"  update-test-run, assign-test-run-test-cases, close-test-run, delete-test-run\n" +
		"  get-test-plans, create-test-plan, get-test-plan, update-test-plan, get-test-plan-test-runs\n" +
		"  get-configurations, create-configuration, get-configuration\n" +
		"  get-custom-fields, create-custom-field, update-custom-field, delete-custom-field"

	switch action {
	case "help":
		fmt.Println("Usage: test-management <action> [args...]")
		fmt.Println(usage)
		return nil

	case testmanagement.ProjectsActionListProjects:
		result, err := client.GetProjects(ctx, 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.ProjectsActionGetProject:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management get-project <projectId>")
		}
		result, err := client.GetProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.ProjectsActionDeleteProject:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management delete-project <projectId>")
		}
		result, err := client.DeleteProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	case testmanagement.FoldersActionListFolders:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management get-folders <projectId>")
		}
		result, err := client.GetFolders(ctx, args[0], 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.FoldersActionGetFolder:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-folder <projectId> <folderId>")
		}
		id, _ := strconv.Atoi(args[1])
		result, err := client.GetFolder(ctx, args[0], id)
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.FoldersActionDeleteFolder:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management delete-folder <projectId> <folderId>")
		}
		id, _ := strconv.Atoi(args[1])
		result, err := client.DeleteFolder(ctx, args[0], id)
		if err != nil {
			return err
		}
		return output.Print(result)

	case testmanagement.TestCasesActionListTestCases:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management get-test-cases <projectId>")
		}
		result, err := client.GetTestCases(ctx, args[0], 0, 0, "", "", "", "", "", "", "", "", "", 0, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.TestCasesActionDeleteTestCase:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management delete-test-case <projectId> <testCaseId>")
		}
		result, err := client.DeleteTestCase(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.TestCasesActionArchiveTestCase:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management archive-test-case <projectId> <testCaseId>")
		}
		result, err := client.ArchiveTestCase(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.TestCasesActionUnarchiveTestCase:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management unarchive-test-case <projectId> <testCaseId>")
		}
		result, err := client.UnarchiveTestCase(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)

	case testmanagement.TestRunsActionListTestRuns:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management get-test-runs <projectId>")
		}
		result, err := client.GetTestRuns(ctx, args[0], "", "", "", "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.TestRunsActionGetTestRun:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-run <projectId> <testRunId>")
		}
		result, err := client.GetTestRun(ctx, args[0], args[1], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.TestRunsActionCloseTestRun:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management close-test-run <projectId> <testRunId>")
		}
		result, err := client.CloseTestRun(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.TestRunsActionDeleteTestRun:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management delete-test-run <projectId> <testRunId>")
		}
		result, err := client.DeleteTestRun(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)

	case testmanagement.TestPlansActionListTestPlans:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management get-test-plans <projectId>")
		}
		result, err := client.GetTestPlans(ctx, args[0], 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.TestPlansActionGetTestPlan:
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-plan <projectId> <testPlanId>")
		}
		result, err := client.GetTestPlan(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)

	case testmanagement.ConfigurationsActionListConfigurations:
		result, err := client.GetConfigurations(ctx, 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)

	case testmanagement.CustomFieldsActionListCustomFields:
		result, err := client.GetCustomFields(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case testmanagement.CustomFieldsActionDeleteCustomField:
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management delete-custom-field <fieldId>")
		}
		result, err := client.DeleteCustomField(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\n%s", action, usage)
	}
}
