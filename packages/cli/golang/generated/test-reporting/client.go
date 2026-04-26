package reporting

import (
	"context"
	"strconv"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type TestReportingClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *TestReportingClient {
	return &TestReportingClient{http: c}
}

func (c *TestReportingClient) GetTestReportingProjects(ctx context.Context, next_page string) (*GetTestReportingProjectsResponse, error) {
	var out GetTestReportingProjectsResponse
	if err := c.http.Get(ctx, "/projects", map[string]string{"next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingProjectBuilds(ctx context.Context, projectId int, unique_build_names string, build_tags string, build_status string, users string, frameworks string, is_archived string, date_range string, next_page string) (*GetTestReportingProjectBuildsResponse, error) {
	var out GetTestReportingProjectBuildsResponse
	if err := c.http.Get(ctx, "/projects/" + strconv.Itoa(projectId) + "/builds", map[string]string{"unique_build_names": unique_build_names, "build_tags": build_tags, "build_status": build_status, "users": users, "frameworks": frameworks, "is_archived": is_archived, "date_range": date_range, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) StartTestReportingBuild(ctx context.Context, body *StartBuildRequest) (*StartTestReportingBuildResponse, error) {
	var out StartTestReportingBuildResponse
	if err := c.http.Post(ctx, "/builds/start", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingLatestBuild(ctx context.Context, project_name string, build_name string, user_name string, build_tags string, framework string) (*BuildDetails, error) {
	var out BuildDetails
	if err := c.http.Get(ctx, "/builds/latest", map[string]string{"project_name": project_name, "build_name": build_name, "user_name": user_name, "build_tags": build_tags, "framework": framework}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingBuild(ctx context.Context, buildId string) (*BuildDetails, error) {
	var out BuildDetails
	if err := c.http.Get(ctx, "/builds/" + buildId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) UpdateTestReportingBuild(ctx context.Context, buildId string, body *UpdateTestReportingBuildRequest) (*UpdateTestReportingBuildResponse, error) {
	var out UpdateTestReportingBuildResponse
	if err := c.http.Patch(ctx, "/builds/" + buildId, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) FinishTestReportingBuild(ctx context.Context, buildHashedId string, body *FinishTestReportingBuildRequest) (*FinishTestReportingBuildResponse, error) {
	var out FinishTestReportingBuildResponse
	if err := c.http.Put(ctx, "/builds/" + buildHashedId + "/finish", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) StartTestReportingTestRun(ctx context.Context, buildHashedId string, body *StartTestRunRequest) (*StartTestReportingTestRunResponse, error) {
	var out StartTestReportingTestRunResponse
	if err := c.http.Post(ctx, "/builds/" + buildHashedId + "/tests/start", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) FinishTestReportingTestRun(ctx context.Context, buildHashedId string, testRunUuid string, body *FinishTestRunRequest) (*FinishTestReportingTestRunResponse, error) {
	var out FinishTestReportingTestRunResponse
	if err := c.http.Put(ctx, "/builds/" + buildHashedId + "/tests/" + testRunUuid + "/finish", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) StartTestReportingHookRun(ctx context.Context, buildHashedId string, body *StartHookRunRequest) (*StartTestReportingHookRunResponse, error) {
	var out StartTestReportingHookRunResponse
	if err := c.http.Post(ctx, "/builds/" + buildHashedId + "/hooks/start", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) FinishTestReportingHookRun(ctx context.Context, buildHashedId string, hookRunUuid string, body *FinishHookRunRequest) (*FinishTestReportingHookRunResponse, error) {
	var out FinishTestReportingHookRunResponse
	if err := c.http.Put(ctx, "/builds/" + buildHashedId + "/hooks/" + hookRunUuid + "/finish", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) AddTestReportingBuildLogs(ctx context.Context, buildHashedId string, body *AddTestReportingBuildLogsRequest) (*AddTestReportingBuildLogsResponse, error) {
	var out AddTestReportingBuildLogsResponse
	if err := c.http.Post(ctx, "/builds/" + buildHashedId + "/logs", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingTestRuns(ctx context.Context, buildId string, re_runs string, test_statuses string, is_flaky string, is_new_failure string, sort string, order string, next_page string) (*TestRunsResponse, error) {
	var out TestRunsResponse
	if err := c.http.Get(ctx, "/builds/" + buildId + "/testRuns", map[string]string{"re_runs": re_runs, "test_statuses": test_statuses, "is_flaky": is_flaky, "is_new_failure": is_new_failure, "sort": sort, "order": order, "next_page": next_page}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingSelfHealingReport(ctx context.Context, buildUuid string) (*GetTestReportingSelfHealingReportResponse, error) {
	var out GetTestReportingSelfHealingReportResponse
	if err := c.http.Get(ctx, "/builds/" + buildUuid + "/selfHealingReport", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingQualityGateStatus(ctx context.Context, buildUuid string) (*QualityGateStatus, error) {
	var out QualityGateStatus
	if err := c.http.Get(ctx, "/quality-gates/" + buildUuid, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingQualityGateSettings(ctx context.Context, projectName string) (*QualityGateSettings, error) {
	var out QualityGateSettings
	if err := c.http.Get(ctx, "/quality-gates/" + projectName + "/settings", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) UpdateTestReportingQualityGateSettings(ctx context.Context, projectName string, body *UpdateTestReportingQualityGateSettingsRequest) (*UpdateTestReportingQualityGateSettingsResponse, error) {
	var out UpdateTestReportingQualityGateSettingsResponse
	if err := c.http.Put(ctx, "/quality-gates/" + projectName + "/settings", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) CreateTestReportingQualityGateProfile(ctx context.Context, projectName string, body *QualityGateProfileRequest) (*CreateTestReportingQualityGateProfileResponse, error) {
	var out CreateTestReportingQualityGateProfileResponse
	if err := c.http.Post(ctx, "/quality-gates/" + projectName + "/profiles", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) GetTestReportingQualityGateProfile(ctx context.Context, projectName string, profileUuid string) (*QualityGateProfile, error) {
	var out QualityGateProfile
	if err := c.http.Get(ctx, "/quality-gates/" + projectName + "/profiles/" + profileUuid, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) UpdateTestReportingQualityGateProfile(ctx context.Context, projectName string, profileUuid string, body *QualityGateProfileRequest) (*UpdateTestReportingQualityGateProfileResponse, error) {
	var out UpdateTestReportingQualityGateProfileResponse
	if err := c.http.Put(ctx, "/quality-gates/" + projectName + "/profiles/" + profileUuid, body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) DeleteTestReportingQualityGateProfile(ctx context.Context, projectName string, profileUuid string) (*DeleteTestReportingQualityGateProfileResponse, error) {
	var out DeleteTestReportingQualityGateProfileResponse
	if err := c.http.Delete(ctx, "/quality-gates/" + projectName + "/profiles/" + profileUuid, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) ToggleTestReportingQualityGateProfile(ctx context.Context, projectName string, profileUuid string, body *ToggleTestReportingQualityGateProfileRequest) (*ToggleTestReportingQualityGateProfileResponse, error) {
	var out ToggleTestReportingQualityGateProfileResponse
	if err := c.http.Put(ctx, "/quality-gates/" + projectName + "/profiles/" + profileUuid + "/toggle", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *TestReportingClient) UploadTestReportingReport(ctx context.Context, file []byte, fileName string, fields map[string]string) (*UploadTestReportingReportResponse, error) {
	var out UploadTestReportingReportResponse
	if err := c.http.PostMultipart(ctx, "/upload", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
