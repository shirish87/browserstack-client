package main

import (
	"context"
	"fmt"
	"strconv"

	management "github.com/browserstack/browserstack-client/generated/test-management"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runTestManagement(c *browserstackhttp.Client, action string, args []string) error {
	client := management.New(c)
	ctx := context.Background()

	switch action {
	// Projects
	case "list-projects":
		result, err := client.GetProjects(ctx, 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-project":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management get-project <projectId>")
		}
		result, err := client.GetProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-project":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management delete-project <projectId>")
		}
		result, err := client.DeleteProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Folders
	case "list-folders":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management list-folders <projectId>")
		}
		result, err := client.GetFolders(ctx, args[0], 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-folder":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-folder <projectId> <folderId>")
		}
		folderID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("folderId must be an integer")
		}
		result, err := client.GetFolder(ctx, args[0], folderID)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-folder":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management delete-folder <projectId> <folderId>")
		}
		folderID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("folderId must be an integer")
		}
		result, err := client.DeleteFolder(ctx, args[0], folderID)
		if err != nil {
			return err
		}
		return output.Print(result)

	// Test Cases
	case "list-test-cases":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management list-test-cases <projectId>")
		}
		result, err := client.GetTestCases(ctx, args[0], 0, 0, "", "", "", "", "", "", "", "", "", 0, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-test-case":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management delete-test-case <projectId> <testCaseId>")
		}
		result, err := client.DeleteTestCase(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "archive-test-case":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management archive-test-case <projectId> <testCaseId>")
		}
		result, err := client.ArchiveTestCase(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "unarchive-test-case":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management unarchive-test-case <projectId> <testCaseId>")
		}
		result, err := client.UnarchiveTestCase(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-test-case-results":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-case-results <projectId> <testCaseId>")
		}
		result, err := client.GetTestCaseResults(ctx, args[0], args[1], 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-test-case-attachments":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management list-test-case-attachments <projectId> <testCaseId>")
		}
		result, err := client.GetTestCaseAttachments(ctx, args[0], args[1], 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-test-case-attachment":
		if len(args) < 3 {
			return fmt.Errorf("usage: test-management delete-test-case-attachment <projectId> <testCaseId> <attachmentId>")
		}
		attachmentID, err := strconv.Atoi(args[2])
		if err != nil {
			return fmt.Errorf("attachmentId must be an integer")
		}
		result, err := client.DeleteTestCaseAttachment(ctx, args[0], args[1], attachmentID)
		if err != nil {
			return err
		}
		return output.Print(result)

	// Test Runs
	case "list-test-runs":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management list-test-runs <projectId>")
		}
		result, err := client.GetTestRuns(ctx, args[0], "", "", "", "", "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-test-run":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-run <projectId> <testRunId>")
		}
		result, err := client.GetTestRun(ctx, args[0], args[1], "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-test-run-test-cases":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-run-test-cases <projectId> <testRunId>")
		}
		result, err := client.GetTestRunTestCases(ctx, args[0], args[1], 0, "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "close-test-run":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management close-test-run <projectId> <testRunId>")
		}
		result, err := client.CloseTestRun(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-test-run":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management delete-test-run <projectId> <testRunId>")
		}
		result, err := client.DeleteTestRun(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-test-run-results":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-run-results <projectId> <testRunId>")
		}
		result, err := client.GetTestRunResults(ctx, args[0], args[1], 0, "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-test-run-test-case-results":
		if len(args) < 3 {
			return fmt.Errorf("usage: test-management get-test-run-test-case-results <projectId> <testRunId> <testCaseId>")
		}
		result, err := client.GetTestRunTestCaseResults(ctx, args[0], args[1], args[2], 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-test-result-attachments":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management list-test-result-attachments <projectId> <testResultId>")
		}
		resultID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("testResultId must be an integer")
		}
		result, err := client.GetTestResultAttachments(ctx, args[0], resultID, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-test-result-attachment":
		if len(args) < 3 {
			return fmt.Errorf("usage: test-management delete-test-result-attachment <projectId> <testResultId> <attachmentId>")
		}
		resultID, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("testResultId must be an integer")
		}
		attachmentID, err := strconv.Atoi(args[2])
		if err != nil {
			return fmt.Errorf("attachmentId must be an integer")
		}
		result, err := client.DeleteTestResultAttachment(ctx, args[0], resultID, attachmentID)
		if err != nil {
			return err
		}
		return output.Print(result)

	// Test Plans
	case "list-test-plans":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management list-test-plans <projectId>")
		}
		result, err := client.GetTestPlans(ctx, args[0], 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-test-plan":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-plan <projectId> <testPlanId>")
		}
		result, err := client.GetTestPlan(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-test-plan-runs":
		if len(args) < 2 {
			return fmt.Errorf("usage: test-management get-test-plan-runs <projectId> <testPlanId>")
		}
		result, err := client.GetTestPlanTestRuns(ctx, args[0], args[1], 0)
		if err != nil {
			return err
		}
		return output.Print(result)

	// Configurations
	case "list-configurations":
		result, err := client.GetConfigurations(ctx, 0, 0)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-configuration":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management get-configuration <configurationId>")
		}
		result, err := client.GetConfiguration(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Custom Fields
	case "list-custom-fields":
		result, err := client.GetCustomFields(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-custom-field":
		if len(args) < 1 {
			return fmt.Errorf("usage: test-management delete-custom-field <customFieldId>")
		}
		result, err := client.DeleteCustomField(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\nValid actions:\n"+
			"  list-projects, get-project, delete-project\n"+
			"  list-folders, get-folder, delete-folder\n"+
			"  list-test-cases, delete-test-case, archive-test-case, unarchive-test-case\n"+
			"  get-test-case-results, list-test-case-attachments, delete-test-case-attachment\n"+
			"  list-test-runs, get-test-run, get-test-run-test-cases, close-test-run, delete-test-run\n"+
			"  get-test-run-results, get-test-run-test-case-results\n"+
			"  list-test-result-attachments, delete-test-result-attachment\n"+
			"  list-test-plans, get-test-plan, get-test-plan-runs\n"+
			"  list-configurations, get-configuration\n"+
			"  list-custom-fields, delete-custom-field", action)
	}
}
