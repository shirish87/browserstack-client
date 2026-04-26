package management

import (
	"context"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type TestManagementClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *TestManagementClient {
	return &TestManagementClient{http: c}
}

func (c *TestManagementClient) GetTestManagementProjects(ctx context.Context, p int, page_size int) (*GetTestManagementProjectsResponse, error) {
	var out GetTestManagementProjectsResponse
	if err := c.http.Get(ctx, "/api/v2/projects", map[string]string{"p": p, "page_size": page_size}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestManagementProject(ctx context.Context, body *CreateTestManagementProjectRequest) (*CreateTestManagementProjectResponse, error) {
	var out CreateTestManagementProjectResponse
	if err := c.http.Post(ctx, "/api/v2/projects", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementProject(ctx context.Context, projectId string) (*GetTestManagementProjectResponse, error) {
	var out GetTestManagementProjectResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestManagementProject(ctx context.Context, projectId string, body *UpdateTestManagementProjectRequest) (*UpdateTestManagementProjectResponse, error) {
	var out UpdateTestManagementProjectResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestManagementProject(ctx context.Context, projectId string) (*DeleteTestManagementProjectResponse, error) {
	var out DeleteTestManagementProjectResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementFolders(ctx context.Context, projectId string, p int, page_size int) (*GetTestManagementFoldersResponse, error) {
	var out GetTestManagementFoldersResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/folders", map[string]string{"p": p, "page_size": page_size}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestManagementFolder(ctx context.Context, projectId string, body *CreateTestManagementFolderRequest) (*CreateTestManagementFolderResponse, error) {
	var out CreateTestManagementFolderResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/folders", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementFolder(ctx context.Context, projectId string, folderId int) (*GetTestManagementFolderResponse, error) {
	var out GetTestManagementFolderResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/folders/" + folderId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestManagementFolder(ctx context.Context, projectId string, folderId int, body *UpdateTestManagementFolderRequest) (*UpdateTestManagementFolderResponse, error) {
	var out UpdateTestManagementFolderResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/folders/" + folderId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestManagementFolder(ctx context.Context, projectId string, folderId int) (*DeleteTestManagementFolderResponse, error) {
	var out DeleteTestManagementFolderResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/folders/" + folderId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) MoveTestManagementFolder(ctx context.Context, projectId string, folderId int, body *MoveTestManagementFolderRequest) (*MoveTestManagementFolderResponse, error) {
	var out MoveTestManagementFolderResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/folders/" + folderId + "/move", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestCases(ctx context.Context, projectId string, p int, page_size int, updated_after string, updated_before string, archived string, minify string, id string, status string, priority string, owner string, case_type string, folder_id int, tags string, issue_ids string, issue_type string) (*GetTestManagementTestCasesResponse, error) {
	var out GetTestManagementTestCasesResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-cases", map[string]string{"p": p, "page_size": page_size, "updated_after": updated_after, "updated_before": updated_before, "archived": archived, "minify": minify, "id": id, "status": status, "priority": priority, "owner": owner, "case_type": case_type, "folder_id": folder_id, "tags": tags, "issue_ids": issue_ids, "issue_type": issue_type}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkEditTestManagementTestCases(ctx context.Context, projectId string, body *BulkEditTestManagementTestCasesRequest) (*BulkEditTestManagementTestCasesResponse, error) {
	var out BulkEditTestManagementTestCasesResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-cases", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkDeleteTestManagementTestCases(ctx context.Context, projectId string, body *BulkDeleteTestManagementTestCasesRequest) (*BulkDeleteTestManagementTestCasesResponse, error) {
	var out BulkDeleteTestManagementTestCasesResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-cases", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkArchiveTestManagementTestCases(ctx context.Context, projectId string, body *BulkArchiveTestManagementTestCasesRequest) (*BulkArchiveTestManagementTestCasesResponse, error) {
	var out BulkArchiveTestManagementTestCasesResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/archive", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkUnarchiveTestManagementTestCases(ctx context.Context, projectId string, body *BulkUnarchiveTestManagementTestCasesRequest) (*BulkUnarchiveTestManagementTestCasesResponse, error) {
	var out BulkUnarchiveTestManagementTestCasesResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/unarchive", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) BulkEditTestManagementTestCasesWithOperations(ctx context.Context, projectId string, body *BulkEditTestManagementTestCasesWithOperationsRequest) (*BulkEditTestManagementTestCasesWithOperationsResponse, error) {
	var out BulkEditTestManagementTestCasesWithOperationsResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-cases/with-operations", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestManagementTestCase(ctx context.Context, projectId string, folderId int, body *CreateTestManagementTestCaseRequest) (*CreateTestManagementTestCaseResponse, error) {
	var out CreateTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/folders/" + folderId + "/test-cases", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestManagementTestCase(ctx context.Context, projectId string, testCaseId string, body *UpdateTestManagementTestCaseRequest) (*UpdateTestManagementTestCaseResponse, error) {
	var out UpdateTestManagementTestCaseResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestManagementTestCase(ctx context.Context, projectId string, testCaseId string) (*DeleteTestManagementTestCaseResponse, error) {
	var out DeleteTestManagementTestCaseResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) ArchiveTestManagementTestCase(ctx context.Context, projectId string, testCaseId string) (*ArchiveTestManagementTestCaseResponse, error) {
	var out ArchiveTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/archive", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UnarchiveTestManagementTestCase(ctx context.Context, projectId string, testCaseId string) (*UnarchiveTestManagementTestCaseResponse, error) {
	var out UnarchiveTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/unarchive", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) MoveTestManagementTestCase(ctx context.Context, projectId string, testCaseId string, body *MoveTestManagementTestCaseRequest) (*MoveTestManagementTestCaseResponse, error) {
	var out MoveTestManagementTestCaseResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/move", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestCaseAttachments(ctx context.Context, projectId string, testCaseId string, p int) (*GetTestManagementTestCaseAttachmentsResponse, error) {
	var out GetTestManagementTestCaseAttachmentsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/attachments", map[string]string{"p": p}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AddTestManagementTestCaseAttachment(ctx context.Context, projectId string, testCaseId string, inline string, file []byte, fileName string, fields map[string]string) (*AddTestManagementTestCaseAttachmentResponse, error) {
	var out AddTestManagementTestCaseAttachmentResponse
	if err := c.http.PostMultipart(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/attachments", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestManagementTestCaseAttachment(ctx context.Context, projectId string, testCaseId string, attachmentId int) (*DeleteTestManagementTestCaseAttachmentResponse, error) {
	var out DeleteTestManagementTestCaseAttachmentResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/attachments/" + attachmentId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestCaseResults(ctx context.Context, projectId string, testCaseId string, p int) (*GetTestManagementTestCaseResultsResponse, error) {
	var out GetTestManagementTestCaseResultsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-cases/" + testCaseId + "/results", map[string]string{"p": p}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestRuns(ctx context.Context, projectId string, closed_before string, closed_after string, created_before string, created_after string, test_plan_id string, assignee string, include_closed string, run_state string) (*GetTestManagementTestRunsResponse, error) {
	var out GetTestManagementTestRunsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs", map[string]string{"closed_before": closed_before, "closed_after": closed_after, "created_before": created_before, "created_after": created_after, "test_plan_id": test_plan_id, "assignee": assignee, "include_closed": include_closed, "run_state": run_state}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestManagementTestRun(ctx context.Context, projectId string, body *CreateTestManagementTestRunRequest) (*CreateTestManagementTestRunResponse, error) {
	var out CreateTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestRun(ctx context.Context, projectId string, testRunId string, minify string) (*GetTestManagementTestRunResponse, error) {
	var out GetTestManagementTestRunResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId, map[string]string{"minify": minify}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestRunTestCases(ctx context.Context, projectId string, testRunId string, p int, fetch_steps string, minify string) (*GetTestManagementTestRunTestCasesResponse, error) {
	var out GetTestManagementTestRunTestCasesResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/test-cases", map[string]string{"p": p, "fetch_steps": fetch_steps, "minify": minify}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestManagementTestRun(ctx context.Context, projectId string, testRunId string, body *UpdateTestManagementTestRunRequest) (*UpdateTestManagementTestRunResponse, error) {
	var out UpdateTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/update", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) PatchTestManagementTestRun(ctx context.Context, projectId string, testRunId string, body *PatchTestManagementTestRunRequest) (*PatchTestManagementTestRunResponse, error) {
	var out PatchTestManagementTestRunResponse
	if err := c.http.Patch(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/update", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AssignTestManagementTestRunTestCases(ctx context.Context, projectId string, testRunId string, body *AssignTestManagementTestRunTestCasesRequest) (*AssignTestManagementTestRunTestCasesResponse, error) {
	var out AssignTestManagementTestRunTestCasesResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/assign", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CloseTestManagementTestRun(ctx context.Context, projectId string, testRunId string) (*CloseTestManagementTestRunResponse, error) {
	var out CloseTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/close", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestManagementTestRun(ctx context.Context, projectId string, testRunId string) (*DeleteTestManagementTestRunResponse, error) {
	var out DeleteTestManagementTestRunResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/delete", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestRunResults(ctx context.Context, projectId string, testRunId string, p int, validate_tc string) (*GetTestManagementTestRunResultsResponse, error) {
	var out GetTestManagementTestRunResultsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/results", map[string]string{"p": p, "validate_tc": validate_tc}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AddTestManagementTestRunResults(ctx context.Context, projectId string, testRunId string, body *AddTestManagementTestRunResultsRequest) (*AddTestManagementTestRunResultsResponse, error) {
	var out AddTestManagementTestRunResultsResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/results", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestRunTestCaseResults(ctx context.Context, projectId string, testRunId string, testCaseId string, p int) (*GetTestManagementTestRunTestCaseResultsResponse, error) {
	var out GetTestManagementTestRunTestCaseResultsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-runs/" + testRunId + "/test-cases/" + testCaseId + "/results", map[string]string{"p": p}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestResultAttachments(ctx context.Context, projectId string, testResultId int, p int) (*GetTestManagementTestResultAttachmentsResponse, error) {
	var out GetTestManagementTestResultAttachmentsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-results/" + testResultId + "/attachments", map[string]string{"p": p}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) AddTestManagementTestResultAttachment(ctx context.Context, projectId string, testResultId int, file []byte, fileName string, fields map[string]string) (*AddTestManagementTestResultAttachmentResponse, error) {
	var out AddTestManagementTestResultAttachmentResponse
	if err := c.http.PostMultipart(ctx, "/api/v2/projects/" + projectId + "/test-results/" + testResultId + "/attachments", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestManagementTestResultAttachment(ctx context.Context, projectId string, testResultId int, attachmentId int) (*DeleteTestManagementTestResultAttachmentResponse, error) {
	var out DeleteTestManagementTestResultAttachmentResponse
	if err := c.http.Delete(ctx, "/api/v2/projects/" + projectId + "/test-results/" + testResultId + "/attachments/" + attachmentId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestPlans(ctx context.Context, projectId string, p int, page_size int) (*GetTestManagementTestPlansResponse, error) {
	var out GetTestManagementTestPlansResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-plans", map[string]string{"p": p, "page_size": page_size}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestManagementTestPlan(ctx context.Context, projectId string, body *CreateTestManagementTestPlanRequest) (*CreateTestManagementTestPlanResponse, error) {
	var out CreateTestManagementTestPlanResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-plans", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestPlan(ctx context.Context, projectId string, testPlanId string) (*GetTestManagementTestPlanResponse, error) {
	var out GetTestManagementTestPlanResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-plans/" + testPlanId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestManagementTestPlan(ctx context.Context, projectId string, testPlanId string, body *UpdateTestManagementTestPlanRequest) (*UpdateTestManagementTestPlanResponse, error) {
	var out UpdateTestManagementTestPlanResponse
	if err := c.http.Post(ctx, "/api/v2/projects/" + projectId + "/test-plans/" + testPlanId + "/update", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementTestPlanTestRuns(ctx context.Context, projectId string, testPlanId string, p int) (*GetTestManagementTestPlanTestRunsResponse, error) {
	var out GetTestManagementTestPlanTestRunsResponse
	if err := c.http.Get(ctx, "/api/v2/projects/" + projectId + "/test-plans/" + testPlanId + "/test-runs", map[string]string{"p": p}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementConfigurations(ctx context.Context, p int, page_size int) (*GetTestManagementConfigurationsResponse, error) {
	var out GetTestManagementConfigurationsResponse
	if err := c.http.Get(ctx, "/api/v2/configurations", map[string]string{"p": p, "page_size": page_size}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestManagementConfiguration(ctx context.Context, body *CreateTestManagementConfigurationRequest) (*CreateTestManagementConfigurationResponse, error) {
	var out CreateTestManagementConfigurationResponse
	if err := c.http.Post(ctx, "/api/v2/configurations", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementConfiguration(ctx context.Context, configurationId string) (*GetTestManagementConfigurationResponse, error) {
	var out GetTestManagementConfigurationResponse
	if err := c.http.Get(ctx, "/api/v2/configurations/" + configurationId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) GetTestManagementCustomFields(ctx context.Context) (*GetTestManagementCustomFieldsResponse, error) {
	var out GetTestManagementCustomFieldsResponse
	if err := c.http.Get(ctx, "/api/v2/custom-fields", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) CreateTestManagementCustomField(ctx context.Context, body *CreateTestManagementCustomFieldRequest) (*CreateTestManagementCustomFieldResponse, error) {
	var out CreateTestManagementCustomFieldResponse
	if err := c.http.Post(ctx, "/api/v2/custom-fields", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) UpdateTestManagementCustomField(ctx context.Context, customFieldId string, body *UpdateTestManagementCustomFieldRequest) (*UpdateTestManagementCustomFieldResponse, error) {
	var out UpdateTestManagementCustomFieldResponse
	if err := c.http.Patch(ctx, "/api/v2/custom-fields/" + customFieldId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestManagementClient) DeleteTestManagementCustomField(ctx context.Context, customFieldId string) (*DeleteTestManagementCustomFieldResponse, error) {
	var out DeleteTestManagementCustomFieldResponse
	if err := c.http.Delete(ctx, "/api/v2/custom-fields/" + customFieldId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
