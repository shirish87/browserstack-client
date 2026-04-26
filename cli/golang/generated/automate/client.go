package automate

import (
	"context"

	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type AutomateClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *AutomateClient {
	return &AutomateClient{http: c}
}

func (c *AutomateClient) GetAutomateBrowsers(ctx context.Context) (*GetAutomateBrowsersResponse, error) {
	var out GetAutomateBrowsersResponse
	if err := c.http.Get(ctx, "/automate/browsers.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomatePlan(ctx context.Context) (*GetAutomatePlanResponse, error) {
	var out GetAutomatePlanResponse
	if err := c.http.Get(ctx, "/automate/plan.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateSessionAppiumLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/appiumlogs", nil)
}

func (c *AutomateClient) GetAutomateProjectBadgeKey(ctx context.Context, projectId string) (string, error) {
	return c.http.GetText(ctx, "/automate/projects/" + projectId + "/badge_key", nil)
}

func (c *AutomateClient) UploadAutomateSessionTerminalLogs(ctx context.Context, sessionId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/terminallogs", nil)
}

func (c *AutomateClient) DeleteAutomateBuilds(ctx context.Context, buildId[] string) (*DeleteAutomateBuildsResponse, error) {
	var out DeleteAutomateBuildsResponse
	if err := c.http.Delete(ctx, "/automate/builds", map[string]string{"buildId[]": buildId[]}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateSession(ctx context.Context, sessionId string) (*GetAutomateSessionResponse, error) {
	var out GetAutomateSessionResponse
	if err := c.http.Get(ctx, "/automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) UpdateAutomateSession(ctx context.Context, sessionId string, body *UpdateAutomateSessionRequest) (*UpdateAutomateSessionResponse, error) {
	var out UpdateAutomateSessionResponse
	if err := c.http.Put(ctx, "/automate/sessions/" + sessionId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteAutomateSession(ctx context.Context, sessionId string) (*DeleteAutomateSessionResponse, error) {
	var out DeleteAutomateSessionResponse
	if err := c.http.Delete(ctx, "/automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteAutomateSessions(ctx context.Context, sessionId[] string) (*DeleteAutomateSessionsResponse, error) {
	var out DeleteAutomateSessionsResponse
	if err := c.http.Delete(ctx, "/automate/sessions", map[string]string{"sessionId[]": sessionId[]}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteAutomateMediaFile(ctx context.Context, mediaId string) (*DeleteAutomateMediaFileResponse, error) {
	var out DeleteAutomateMediaFileResponse
	if err := c.http.Delete(ctx, "/automate/custom_media/delete/" + mediaId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateBuild(ctx context.Context, buildId string) (*GetAutomateBuildResponse, error) {
	var out GetAutomateBuildResponse
	if err := c.http.Get(ctx, "/automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) UpdateAutomateBuild(ctx context.Context, buildId string, body *UpdateAutomateBuildRequest) (*UpdateAutomateBuildResponse, error) {
	var out UpdateAutomateBuildResponse
	if err := c.http.Put(ctx, "/automate/builds/" + buildId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteAutomateBuild(ctx context.Context, buildId string) (*DeleteAutomateBuildResponse, error) {
	var out DeleteAutomateBuildResponse
	if err := c.http.Delete(ctx, "/automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateSessionLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/logs", nil)
}

func (c *AutomateClient) UploadAutomateMediaFile(ctx context.Context, file []byte, fileName string, fields map[string]string) (*UploadAutomateMediaFileResponse, error) {
	var out UploadAutomateMediaFileResponse
	if err := c.http.PostMultipart(ctx, "/automate/upload-media", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) RecycleAutomateKey(ctx context.Context, body *RecycleAutomateKeyRequest) (*RecycleAutomateKeyResponse, error) {
	var out RecycleAutomateKeyResponse
	if err := c.http.Put(ctx, "/automate/recycle_key.json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateSessions(ctx context.Context, buildId string, limit string, offset string, status string) (*GetAutomateSessionsResponse, error) {
	var out GetAutomateSessionsResponse
	if err := c.http.Get(ctx, "/automate/builds/" + buildId + "/sessions.json", map[string]string{"limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateProject(ctx context.Context, projectId string) (*GetAutomateProjectResponse, error) {
	var out GetAutomateProjectResponse
	if err := c.http.Get(ctx, "/automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) UpdateAutomateProject(ctx context.Context, projectId string, body *UpdateAutomateProjectRequest) (*UpdateAutomateProjectResponse, error) {
	var out UpdateAutomateProjectResponse
	if err := c.http.Put(ctx, "/automate/projects/" + projectId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) DeleteAutomateProject(ctx context.Context, projectId string) (*DeleteAutomateProjectResponse, error) {
	var out DeleteAutomateProjectResponse
	if err := c.http.Delete(ctx, "/automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateSessionSeleniumLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/seleniumlogs", nil)
}

func (c *AutomateClient) UploadAutomateBuildTerminalLogs(ctx context.Context, buildId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/automate/builds/" + buildId + "/terminallogs", nil)
}

func (c *AutomateClient) GetAutomateMediaFiles(ctx context.Context) (*GetAutomateMediaFilesResponse, error) {
	var out GetAutomateMediaFilesResponse
	if err := c.http.Get(ctx, "/automate/recent_media_files", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateProjects(ctx context.Context) (*GetAutomateProjectsResponse, error) {
	var out GetAutomateProjectsResponse
	if err := c.http.Get(ctx, "/automate/projects.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateSessionConsoleLogs(ctx context.Context, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/automate/sessions/" + sessionId + "/consolelogs", nil)
}

func (c *AutomateClient) GetAutomateSessionTelemetryLogs(ctx context.Context, sessionId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/automate/sessions/" + sessionId + "/telemetrylogs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateBuilds(ctx context.Context, projectId string, limit string, offset string, status string) (*GetAutomateBuildsResponse, error) {
	var out GetAutomateBuildsResponse
	if err := c.http.Get(ctx, "/automate/builds.json", map[string]string{"projectId": projectId, "limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AutomateClient) GetAutomateSessionNetworkLogs(ctx context.Context, sessionId string) (*GetAutomateSessionNetworkLogsResponse, error) {
	var out GetAutomateSessionNetworkLogsResponse
	if err := c.http.Get(ctx, "/automate/sessions/" + sessionId + "/networklogs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
