package main

import (
	"context"
	"fmt"

	testmanagement "github.com/browserstack/browserstack-client/generated/test-management"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
	"github.com/browserstack/browserstack-client/internal/tui"
)

func runTestManagement(c *browserstackhttp.Client, action string, args []string) error {
	client := testmanagement.New(c)
	ctx := context.Background()

	const usage = `Usage: test-management <action> [args...]

Actions (Projects):
  list-projects
  create-project
  get-project     <projectId>
  update-project  <projectId>
  delete-project  <projectId>

Actions (Folders):
  list-folders    <projectId> [p [page_size]]
  create-folder   <projectId>
  get-folder      <projectId> <folderId>
  update-folder   <projectId> <folderId>
  delete-folder   <projectId> <folderId>
  move-folder     <projectId> <folderId>

Actions (Test Cases):
  list-test-cases         <projectId> [page [pageSize [updatedAfter [updatedBefore [archived [minify [id [status [priority [owner [caseType [folderId [tags [issueIds [issueType]]]]]]]]]]]]]]]]
  create-test-case        <projectId> <folderId>
  update-test-case        <projectId> <testCaseId>
  delete-test-case        <projectId> <testCaseId>
  archive-test-case       <projectId> <testCaseId>
  unarchive-test-case     <projectId> <testCaseId>
  move-test-case          <projectId> <testCaseId>
  bulk-edit-test-cases    <projectId>
  bulk-delete-test-cases  <projectId>
  bulk-archive-test-cases    <projectId>
  bulk-unarchive-test-cases  <projectId>

Actions (Test Runs):
  list-test-runs          <projectId> [closedBefore [closedAfter [createdBefore [createdAfter [testPlanId [assignee [includeClosed [runState]]]]]]]]
  create-test-run         <projectId>
  get-test-run            <projectId> <testRunId>
  update-test-run         <projectId> <testRunId>
  patch-test-run          <projectId> <testRunId>
  close-test-run          <projectId> <testRunId>
  delete-test-run         <projectId> <testRunId>
  assign-test-run-test-cases   <projectId> <testRunId>
  list-test-run-test-cases     <projectId> <testRunId> [page [fetchSteps [minify]]]
  add-test-run-results         <projectId> <testRunId>
  list-test-run-results        <projectId> <testRunId> [page [validateTc]]
  list-test-run-test-case-results  <projectId> <testRunId> <testCaseId> [page]

Actions (Test Plans):
  list-test-plans         <projectId> [page [pageSize]]
  create-test-plan        <projectId>
  get-test-plan           <projectId> <testPlanId>
  update-test-plan        <projectId> <testPlanId>
  list-test-plan-test-runs     <projectId> <testPlanId> [page]

Actions (Configurations):
  list-configurations     [page [pageSize]]
  create-configuration
  get-configuration       <configurationId>

Actions (Custom Fields):
  list-custom-fields
  create-custom-field
  update-custom-field  <customFieldId>
  delete-custom-field  <customFieldId>

Actions (Attachments):
  list-test-case-attachments      <projectId> <testCaseId> [page]
  add-test-case-attachment        <projectId> <testCaseId>
  delete-test-case-attachment     <projectId> <testCaseId> <attachmentId>
  list-test-result-attachments    <projectId> <testResultId> [page]
  add-test-result-attachment      <projectId> <testResultId>
  delete-test-result-attachment   <projectId> <testResultId> <attachmentId>
  list-test-case-results          <projectId> <testCaseId> [page]`

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	if len(args) > 0 && args[len(args)-1] == "help" {
		if h := tui.ActionHelp(testmanagement.ProductTestManagement, action); h != "" {
			fmt.Println(h)
			return nil
		}
	}

	res, err := testmanagement.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.PrintWithColumns(res, testmanagement.DisplayColumns(action))
}
