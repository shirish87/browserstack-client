package management

import (
	"context"
	"strconv"

	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

type TestManagementClient struct {
	http *browserstackhttp.Client
}

func New(c *browserstackhttp.Client) *TestManagementClient {
	return &TestManagementClient{http: c}
}

func (c *TestManagementClient) GetProjects(ctx context.Context, p int, page_size int) (*GetTestManagementProjectsResponse, error) {
	var out GetTestManagementProjectsResponse
	if err := c.http.Get(ctx, "/api/v2/projects", map[string]string{"p": strconv.Itoa(p), "page_size": strconv.Itoa(page_size)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateProject(ctx context.Context, body *CreateTestManagementProjectRequest) (*CreateTestManagementProjectResponse, error) {
	var out CreateTestManagementProjectResponse
	if err := c.http.Post(ctx, "/api/v2/projects", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetProject(ctx context.Context, projectId string) (*GetTestManagementProjectResponse, error) {
	var out GetTestManagementProjectResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateProject(ctx context.Context, projectId string, body *UpdateTestManagementProjectRequest) (*UpdateTestManagementProjectResponse, error) {
	var out UpdateTestManagementProjectResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteProject(ctx context.Context, projectId string) (*DeleteTestManagementProjectResponse, error) {
	var out DeleteTestManagementProjectResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetFolders(ctx context.Context, projectId string, p int, page_size int) (*GetTestManagementFoldersResponse, error) {
	var out GetTestManagementFoldersResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/folders", map[string]string{"p": strconv.Itoa(p), "page_size": strconv.Itoa(page_size)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateFolder(ctx context.Context, projectId string, body *CreateTestManagementFolderRequest) (*CreateTestManagementFolderResponse, error) {
	var out CreateTestManagementFolderResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/folders", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetFolder(ctx context.Context, projectId string, folderId int) (*GetTestManagementFolderResponse, error) {
	var out GetTestManagementFolderResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/folders/" + strconv.Itoa(folderId), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateFolder(ctx context.Context, projectId string, folderId int, body *UpdateTestManagementFolderRequest) (*UpdateTestManagementFolderResponse, error) {
	var out UpdateTestManagementFolderResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/folders/" + strconv.Itoa(folderId), body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteFolder(ctx context.Context, projectId string, folderId int) (*DeleteTestManagementFolderResponse, error) {
	var out DeleteTestManagementFolderResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/folders/" + strconv.Itoa(folderId), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) MoveFolder(ctx context.Context, projectId string, folderId int, body *MoveTestManagementFolderRequest) (*MoveTestManagementFolderResponse, error) {
	var out MoveTestManagementFolderResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/folders/" + strconv.Itoa(folderId) + "/move", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestCases(ctx context.Context, projectId string, p int, page_size int, updated_after string, updated_before string, archived string, minify string, id string, status string, priority string, owner string, case_type string, folder_id int, tags string, issue_ids string, issue_type string) (*GetTestManagementTestCasesResponse, error) {
	var out GetTestManagementTestCasesResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-cases", map[string]string{"p": strconv.Itoa(p), "page_size": strconv.Itoa(page_size), "updated_after": updated_after, "updated_before": updated_before, "archived": archived, "minify": minify, "id": id, "status": status, "priority": priority, "owner": owner, "case_type": case_type, "folder_id": strconv.Itoa(folder_id), "tags": tags, "issue_ids": issue_ids, "issue_type": issue_type}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkEditTestCases(ctx context.Context, projectId string, body *BulkEditTestManagementTestCasesRequest) (*BulkEditTestManagementTestCasesResponse, error) {
	var out BulkEditTestManagementTestCasesResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-cases", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkDeleteTestCases(ctx context.Context, projectId string, body *BulkDeleteTestManagementTestCasesRequest) (*BulkDeleteTestManagementTestCasesResponse, error) {
	var out BulkDeleteTestManagementTestCasesResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-cases", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkArchiveTestCases(ctx context.Context, projectId string, body *BulkArchiveTestManagementTestCasesRequest) (*BulkArchiveTestManagementTestCasesResponse, error) {
	var out BulkArchiveTestManagementTestCasesResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/archive", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkUnarchiveTestCases(ctx context.Context, projectId string, body *BulkUnarchiveTestManagementTestCasesRequest) (*BulkUnarchiveTestManagementTestCasesResponse, error) {
	var out BulkUnarchiveTestManagementTestCasesResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/unarchive", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkEditTestCasesWithOperations(ctx context.Context, projectId string, body *BulkEditTestManagementTestCasesWithOperationsRequest) (*BulkEditTestManagementTestCasesWithOperationsResponse, error) {
	var out BulkEditTestManagementTestCasesWithOperationsResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-cases/with-operations", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestCase(ctx context.Context, projectId string, folderId int, body *CreateTestManagementTestCaseRequest) (*CreateTestManagementTestCaseResponse, error) {
	var out CreateTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/folders/" + strconv.Itoa(folderId) + "/test-cases", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestCase(ctx context.Context, projectId string, testCaseId string, body *UpdateTestManagementTestCaseRequest) (*UpdateTestManagementTestCaseResponse, error) {
	var out UpdateTestManagementTestCaseResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestCase(ctx context.Context, projectId string, testCaseId string) (*DeleteTestManagementTestCaseResponse, error) {
	var out DeleteTestManagementTestCaseResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) ArchiveTestCase(ctx context.Context, projectId string, testCaseId string) (*ArchiveTestManagementTestCaseResponse, error) {
	var out ArchiveTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/archive", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UnarchiveTestCase(ctx context.Context, projectId string, testCaseId string) (*UnarchiveTestManagementTestCaseResponse, error) {
	var out UnarchiveTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/unarchive", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) MoveTestCase(ctx context.Context, projectId string, testCaseId string, body *MoveTestManagementTestCaseRequest) (*MoveTestManagementTestCaseResponse, error) {
	var out MoveTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/move", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestCaseAttachments(ctx context.Context, projectId string, testCaseId string, p int) (*GetTestManagementTestCaseAttachmentsResponse, error) {
	var out GetTestManagementTestCaseAttachmentsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/attachments", map[string]string{"p": strconv.Itoa(p)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AddTestCaseAttachment(ctx context.Context, projectId string, testCaseId string, inline string, file []byte, fileName string, fields map[string]string) (*AddTestManagementTestCaseAttachmentResponse, error) {
	var out AddTestManagementTestCaseAttachmentResponse
	if err := c.http.PostMultipart(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/attachments", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestCaseAttachment(ctx context.Context, projectId string, testCaseId string, attachmentId int) (*DeleteTestManagementTestCaseAttachmentResponse, error) {
	var out DeleteTestManagementTestCaseAttachmentResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/attachments/" + strconv.Itoa(attachmentId), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestCaseResults(ctx context.Context, projectId string, testCaseId string, p int) (*GetTestManagementTestCaseResultsResponse, error) {
	var out GetTestManagementTestCaseResultsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/results", map[string]string{"p": strconv.Itoa(p)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestRuns(ctx context.Context, projectId string, closed_before string, closed_after string, created_before string, created_after string, test_plan_id string, assignee string, include_closed string, run_state string) (*GetTestManagementTestRunsResponse, error) {
	var out GetTestManagementTestRunsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs", map[string]string{"closed_before": closed_before, "closed_after": closed_after, "created_before": created_before, "created_after": created_after, "test_plan_id": test_plan_id, "assignee": assignee, "include_closed": include_closed, "run_state": run_state}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestRun(ctx context.Context, projectId string, body *CreateTestManagementTestRunRequest) (*CreateTestManagementTestRunResponse, error) {
	var out CreateTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestRun(ctx context.Context, projectId string, testRunId string, minify string) (*GetTestManagementTestRunResponse, error) {
	var out GetTestManagementTestRunResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId, map[string]string{"minify": minify}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestRunTestCases(ctx context.Context, projectId string, testRunId string, p int, fetch_steps string, minify string) (*GetTestManagementTestRunTestCasesResponse, error) {
	var out GetTestManagementTestRunTestCasesResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/test-cases", map[string]string{"p": strconv.Itoa(p), "fetch_steps": fetch_steps, "minify": minify}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestRun(ctx context.Context, projectId string, testRunId string, body *UpdateTestManagementTestRunRequest) (*UpdateTestManagementTestRunResponse, error) {
	var out UpdateTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/update", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) PatchTestRun(ctx context.Context, projectId string, testRunId string, body *PatchTestManagementTestRunRequest) (*PatchTestManagementTestRunResponse, error) {
	var out PatchTestManagementTestRunResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/update", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AssignTestRunTestCases(ctx context.Context, projectId string, testRunId string, body *AssignTestManagementTestRunTestCasesRequest) (*AssignTestManagementTestRunTestCasesResponse, error) {
	var out AssignTestManagementTestRunTestCasesResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/assign", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CloseTestRun(ctx context.Context, projectId string, testRunId string) (*CloseTestManagementTestRunResponse, error) {
	var out CloseTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/close", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestRun(ctx context.Context, projectId string, testRunId string) (*DeleteTestManagementTestRunResponse, error) {
	var out DeleteTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/delete", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestRunResults(ctx context.Context, projectId string, testRunId string, p int, validate_tc string) (*GetTestManagementTestRunResultsResponse, error) {
	var out GetTestManagementTestRunResultsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/results", map[string]string{"p": strconv.Itoa(p), "validate_tc": validate_tc}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AddTestRunResults(ctx context.Context, projectId string, testRunId string, body *AddTestManagementTestRunResultsRequest) (*AddTestManagementTestRunResultsResponse, error) {
	var out AddTestManagementTestRunResultsResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/results", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestRunTestCaseResults(ctx context.Context, projectId string, testRunId string, testCaseId string, p int) (*GetTestManagementTestRunTestCaseResultsResponse, error) {
	var out GetTestManagementTestRunTestCaseResultsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/test-cases/" + testCaseId + "/results", map[string]string{"p": strconv.Itoa(p)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestResultAttachments(ctx context.Context, projectId string, testResultId int, p int) (*GetTestManagementTestResultAttachmentsResponse, error) {
	var out GetTestManagementTestResultAttachmentsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-results/" + strconv.Itoa(testResultId) + "/attachments", map[string]string{"p": strconv.Itoa(p)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AddTestResultAttachment(ctx context.Context, projectId string, testResultId int, file []byte, fileName string, fields map[string]string) (*AddTestManagementTestResultAttachmentResponse, error) {
	var out AddTestManagementTestResultAttachmentResponse
	if err := c.http.PostMultipart(ctx, "/api/v2/projects/" + projectId + "/test-results/" + strconv.Itoa(testResultId) + "/attachments", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestResultAttachment(ctx context.Context, projectId string, testResultId int, attachmentId int) (*DeleteTestManagementTestResultAttachmentResponse, error) {
	var out DeleteTestManagementTestResultAttachmentResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-results/" + strconv.Itoa(testResultId) + "/attachments/" + strconv.Itoa(attachmentId), nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestPlans(ctx context.Context, projectId string, p int, page_size int) (*GetTestManagementTestPlansResponse, error) {
	var out GetTestManagementTestPlansResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-plans", map[string]string{"p": strconv.Itoa(p), "page_size": strconv.Itoa(page_size)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestPlan(ctx context.Context, projectId string, body *CreateTestManagementTestPlanRequest) (*CreateTestManagementTestPlanResponse, error) {
	var out CreateTestManagementTestPlanResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-plans", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestPlan(ctx context.Context, projectId string, testPlanId string) (*GetTestManagementTestPlanResponse, error) {
	var out GetTestManagementTestPlanResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-plans/" + testPlanId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestPlan(ctx context.Context, projectId string, testPlanId string, body *UpdateTestManagementTestPlanRequest) (*UpdateTestManagementTestPlanResponse, error) {
	var out UpdateTestManagementTestPlanResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-plans/" + testPlanId + "/update", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestPlanTestRuns(ctx context.Context, projectId string, testPlanId string, p int) (*GetTestManagementTestPlanTestRunsResponse, error) {
	var out GetTestManagementTestPlanTestRunsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-plans/" + testPlanId + "/test-runs", map[string]string{"p": strconv.Itoa(p)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetConfigurations(ctx context.Context, p int, page_size int) (*GetTestManagementConfigurationsResponse, error) {
	var out GetTestManagementConfigurationsResponse
	if err := c.http.Get(ctx, "/api/v2/configurations", map[string]string{"p": strconv.Itoa(p), "page_size": strconv.Itoa(page_size)}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateConfiguration(ctx context.Context, body *CreateTestManagementConfigurationRequest) (*CreateTestManagementConfigurationResponse, error) {
	var out CreateTestManagementConfigurationResponse
	if err := c.http.Post(ctx, "/api/v2/configurations", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetConfiguration(ctx context.Context, configurationId string) (*GetTestManagementConfigurationResponse, error) {
	var out GetTestManagementConfigurationResponse
	if err := c.http.Get(ctx, "/api/v2/configurations/" + configurationId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetCustomFields(ctx context.Context) (*GetTestManagementCustomFieldsResponse, error) {
	var out GetTestManagementCustomFieldsResponse
	if err := c.http.Get(ctx, "/api/v2/custom-fields", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateCustomField(ctx context.Context, body *CreateTestManagementCustomFieldRequest) (*CreateTestManagementCustomFieldResponse, error) {
	var out CreateTestManagementCustomFieldResponse
	if err := c.http.Post(ctx, "/api/v2/custom-fields", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateCustomField(ctx context.Context, customFieldId string, body *UpdateTestManagementCustomFieldRequest) (*UpdateTestManagementCustomFieldResponse, error) {
	var out UpdateTestManagementCustomFieldResponse
	if err := c.http.Patch(ctx, "/api/v2/custom-fields/" + customFieldId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteCustomField(ctx context.Context, customFieldId string) (*DeleteTestManagementCustomFieldResponse, error) {
	var out DeleteTestManagementCustomFieldResponse
	if err := c.http.Delete(ctx, "/api/v2/custom-fields/" + customFieldId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
