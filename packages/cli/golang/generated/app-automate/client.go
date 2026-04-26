package appautomate

import (
	"context"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
)

type AppAutomateClient struct {
	http *browserstackhttp.Client
}

func New(c *browserstackhttp.Client) *AppAutomateClient {
	return &AppAutomateClient{http: c}
}

func (c *AppAutomateClient) GetBuild(ctx context.Context, buildId string) (*GetAppAutomateBuildResponse, error) {
	var out GetAppAutomateBuildResponse
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UpdateBuild(ctx context.Context, buildId string, body *UpdateAppAutomateBuildRequest) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Put(ctx, "/app-automate/builds/" + buildId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteBuild(ctx context.Context, buildId string) (*DeleteAppAutomateBuildResponse, error) {
	var out DeleteAppAutomateBuildResponse
	if err := c.http.Delete(ctx, "/app-automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetMediaFilesByCustomId(ctx context.Context, customId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_media_files/" + customId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetSessionLogs(ctx context.Context, buildId string, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/logs", nil)
}

func (c *AppAutomateClient) GetApps(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_apps", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetGroupMediaFiles(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_group_media", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetXCUITestApp(ctx context.Context, appId string) (*GetAppAutomateXCUITestAppResponse, error) {
	var out GetAppAutomateXCUITestAppResponse
	if err := c.http.Get(ctx, "/app-automate/xcuitest/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteXCUITestApp(ctx context.Context, appId string) (*DeleteAppAutomateXCUITestAppResponse, error) {
	var out DeleteAppAutomateXCUITestAppResponse
	if err := c.http.Delete(ctx, "/app-automate/xcuitest/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetNetworkLogs(ctx context.Context, buildId string, sessionId string) (*GetAppAutomateNetworkLogsResponse, error) {
	var out GetAppAutomateNetworkLogsResponse
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/networklogs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadBuildTerminalLogs(ctx context.Context, buildId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/terminallogs", nil)
}

func (c *AppAutomateClient) UploadFlutterAndroidApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/flutter-integration-tests/v2/android/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadDetoxAndroidApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/detox/v2/android/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetXCUITestApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/xcuitest/v2/apps", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadSessionTerminalLogs(ctx context.Context, sessionId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/sessions/" + sessionId + "/terminallogs", nil)
}

func (c *AppAutomateClient) GetPlan(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/plan.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadFlutteriOSApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateTestPackage, error) {
	var out AppAutomateTestPackage
	if err := c.http.PostMultipart(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-package", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadDetoxAndroidAppClient(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/detox/v2/android/app-client", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadXCUITestApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/xcuitest/v2/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetProject(ctx context.Context, projectId string) (*GetAppAutomateProjectResponse, error) {
	var out GetAppAutomateProjectResponse
	if err := c.http.Get(ctx, "/app-automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UpdateProject(ctx context.Context, projectId string, body *UpdateAppAutomateProjectRequest) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Put(ctx, "/app-automate/projects/" + projectId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteProject(ctx context.Context, projectId string) (*DeleteAppAutomateProjectResponse, error) {
	var out DeleteAppAutomateProjectResponse
	if err := c.http.Delete(ctx, "/app-automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetDevices(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/devices.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppiumLogs(ctx context.Context, buildId string, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/appiumlogs", nil)
}

func (c *AppAutomateClient) DeleteApp(ctx context.Context, appId string) (*DeleteAppAutomateAppResponse, error) {
	var out DeleteAppAutomateAppResponse
	if err := c.http.Delete(ctx, "/app-automate/app/delete/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetFlutterAndroidApp(ctx context.Context, appId string) (*GetAppAutomateFlutterAndroidAppResponse, error) {
	var out GetAppAutomateFlutterAndroidAppResponse
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/android/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteFlutterAndroidApp(ctx context.Context, appId string) (*DeleteAppAutomateFlutterAndroidAppResponse, error) {
	var out DeleteAppAutomateFlutterAndroidAppResponse
	if err := c.http.Delete(ctx, "/app-automate/flutter-integration-tests/v2/android/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadMediaFile(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateMediaFile, error) {
	var out AppAutomateMediaFile
	if err := c.http.PostMultipart(ctx, "/app-automate/upload-media", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetEspressoApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/espresso/v2/apps", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppProfilingDataV2(ctx context.Context, buildId string, sessionId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/appprofiling/v2", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetSession(ctx context.Context, sessionId string) (*GetAppAutomateSessionResponse, error) {
	var out GetAppAutomateSessionResponse
	if err := c.http.Get(ctx, "/app-automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UpdateSession(ctx context.Context, sessionId string, body *UpdateAppAutomateSessionRequest) (*UpdateAppAutomateSessionResponse, error) {
	var out UpdateAppAutomateSessionResponse
	if err := c.http.Put(ctx, "/app-automate/sessions/" + sessionId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteSession(ctx context.Context, sessionId string) (*DeleteAppAutomateSessionResponse, error) {
	var out DeleteAppAutomateSessionResponse
	if err := c.http.Delete(ctx, "/app-automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetProjects(ctx context.Context, limit string, offset string, status string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/projects.json", map[string]string{"limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteMediaFile(ctx context.Context, mediaId string) (*DeleteAppAutomateMediaFileResponse, error) {
	var out DeleteAppAutomateMediaFileResponse
	if err := c.http.Delete(ctx, "/app-automate/custom_media/delete/" + mediaId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetEspressoApp(ctx context.Context, appId string) (*GetAppAutomateEspressoAppResponse, error) {
	var out GetAppAutomateEspressoAppResponse
	if err := c.http.Get(ctx, "/app-automate/espresso/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteEspressoApp(ctx context.Context, appId string) (*DeleteAppAutomateEspressoAppResponse, error) {
	var out DeleteAppAutomateEspressoAppResponse
	if err := c.http.Delete(ctx, "/app-automate/espresso/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetMediaFiles(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_media_files", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetFlutteriOSApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-packages", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/upload", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetGroupApps(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_group_apps", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadEspressoApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/espresso/v2/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppsByCustomId(ctx context.Context, customId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_apps/" + customId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetFlutterAndroidApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/android/apps", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetDeviceLogs(ctx context.Context, buildId string, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/devicelogs", nil)
}

func (c *AppAutomateClient) GetAppProfilingDataV1(ctx context.Context, buildId string, sessionId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/appprofiling", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetBuilds(ctx context.Context, projectId string, limit string, offset string, status string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/builds.json", map[string]string{"projectId": projectId, "limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetFlutteriOSApp(ctx context.Context, appId string) (*GetAppAutomateFlutteriOSAppResponse, error) {
	var out GetAppAutomateFlutteriOSAppResponse
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-package/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteFlutteriOSApp(ctx context.Context, appId string) (*DeleteAppAutomateFlutteriOSAppResponse, error) {
	var out DeleteAppAutomateFlutteriOSAppResponse
	if err := c.http.Delete(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-package/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetProjectBadgeKey(ctx context.Context, projectId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/projects/" + projectId + "/badge_key", nil)
}
