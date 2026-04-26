package automate

import (
	"context"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

type AutomateClient struct {
	http *browserstackhttp.Client
}

func New(c *browserstackhttp.Client) *AutomateClient {
	return &AutomateClient{http: c}
}

func (c *AutomateClient) GetBrowsers(ctx context.Context) (*BrowserList, error) {
	var out BrowserList
	if err := c.http.Get(ctx, "/automate/browsers.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetPlan(ctx context.Context) (*AutomatePlan, error) {
	var out AutomatePlan
	if err := c.http.Get(ctx, "/automate/plan.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetSessionAppiumLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/appiumlogs", nil)
}

func (c *AutomateClient) GetProjectBadgeKey(ctx context.Context, projectId string) (string, error) {
	return c.http.GetText(ctx, "/automate/projects/" + projectId + "/badge_key", nil)
}

func (c *AutomateClient) UploadSessionTerminalLogs(ctx context.Context, sessionId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/terminallogs", nil)
}

func (c *AutomateClient) DeleteBuilds(ctx context.Context, buildId string) (*DeleteAutomateBuildsResponse, error) {
	var out DeleteAutomateBuildsResponse
	if err := c.http.Delete(ctx, "/automate/builds", map[string]string{"buildId": buildId}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetSession(ctx context.Context, sessionId string) (*GetAutomateSessionResponse, error) {
	var out GetAutomateSessionResponse
	if err := c.http.Get(ctx, "/automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) UpdateSession(ctx context.Context, sessionId string, body *UpdateAutomateSessionRequest) (*UpdateAutomateSessionResponse, error) {
	var out UpdateAutomateSessionResponse
	if err := c.http.Put(ctx, "/automate/sessions/" + sessionId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteSession(ctx context.Context, sessionId string) (*DeleteAutomateSessionResponse, error) {
	var out DeleteAutomateSessionResponse
	if err := c.http.Delete(ctx, "/automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteSessions(ctx context.Context, sessionId string) (*DeleteAutomateSessionsResponse, error) {
	var out DeleteAutomateSessionsResponse
	if err := c.http.Delete(ctx, "/automate/sessions", map[string]string{"sessionId": sessionId}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteMediaFile(ctx context.Context, mediaId string) (*DeleteAutomateMediaFileResponse, error) {
	var out DeleteAutomateMediaFileResponse
	if err := c.http.Delete(ctx, "/automate/custom_media/delete/" + mediaId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetBuild(ctx context.Context, buildId string) (*GetAutomateBuildResponse, error) {
	var out GetAutomateBuildResponse
	if err := c.http.Get(ctx, "/automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) UpdateBuild(ctx context.Context, buildId string, body *UpdateAutomateBuildRequest) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Put(ctx, "/automate/builds/" + buildId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteBuild(ctx context.Context, buildId string) (*DeleteAutomateBuildResponse, error) {
	var out DeleteAutomateBuildResponse
	if err := c.http.Delete(ctx, "/automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetSessionLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/logs", nil)
}

func (c *AutomateClient) UploadMediaFile(ctx context.Context, file []byte, fileName string, fields map[string]string) (*UploadAutomateMediaFileResponse, error) {
	var out UploadAutomateMediaFileResponse
	if err := c.http.PostMultipart(ctx, "/automate/upload-media", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) RecycleKey(ctx context.Context, body *RecycleAutomateKeyRequest) (*RecycleAutomateKeyResponse, error) {
	var out RecycleAutomateKeyResponse
	if err := c.http.Put(ctx, "/automate/recycle_key.json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetSessions(ctx context.Context, buildId string, limit string, offset string, status string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/automate/builds/" + buildId + "/sessions.json", map[string]string{"limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetProject(ctx context.Context, projectId string) (*GetAutomateProjectResponse, error) {
	var out GetAutomateProjectResponse
	if err := c.http.Get(ctx, "/automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) UpdateProject(ctx context.Context, projectId string, body *UpdateAutomateProjectRequest) (*AutomateProject, error) {
	var out AutomateProject
	if err := c.http.Put(ctx, "/automate/projects/" + projectId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteProject(ctx context.Context, projectId string) (*DeleteAutomateProjectResponse, error) {
	var out DeleteAutomateProjectResponse
	if err := c.http.Delete(ctx, "/automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetSessionSeleniumLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/seleniumlogs", nil)
}

func (c *AutomateClient) UploadBuildTerminalLogs(ctx context.Context, buildId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/automate/builds/" + buildId + "/terminallogs", nil)
}

func (c *AutomateClient) GetMediaFiles(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/automate/recent_media_files", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetProjects(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/automate/projects.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetSessionConsoleLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/consolelogs", nil)
}

func (c *AutomateClient) GetSessionTelemetryLogs(ctx context.Context, sessionId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/automate/sessions/" + sessionId + "/telemetrylogs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetBuilds(ctx context.Context, projectId string, limit string, offset string, status string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/automate/builds.json", map[string]string{"projectId": projectId, "limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetSessionNetworkLogs(ctx context.Context, sessionId string) (*GetAutomateSessionNetworkLogsResponse, error) {
	var out GetAutomateSessionNetworkLogsResponse
	if err := c.http.Get(ctx, "/automate/sessions/" + sessionId + "/networklogs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
