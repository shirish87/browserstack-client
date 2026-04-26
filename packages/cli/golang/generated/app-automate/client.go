package appautomate

import (
	"context"
	bshttp "github.com/browserstack/browserstack-client/internal/http"
)

type AppAutomateClient struct {
	http *bshttp.Client
}

func New(c *bshttp.Client) *AppAutomateClient {
	return &AppAutomateClient{http: c}
}

func (c *AppAutomateClient) GetAppAutomateBuild(ctx context.Context, buildId string) (*GetAppAutomateBuildResponse, error) {
	var out GetAppAutomateBuildResponse
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UpdateAppAutomateBuild(ctx context.Context, buildId string, body *UpdateAppAutomateBuildRequest) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Put(ctx, "/app-automate/builds/" + buildId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateBuild(ctx context.Context, buildId string) (*DeleteAppAutomateBuildResponse, error) {
	var out DeleteAppAutomateBuildResponse
	if err := c.http.Delete(ctx, "/app-automate/builds/" + buildId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateMediaFilesByCustomId(ctx context.Context, customId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_media_files/" + customId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateSessionLogs(ctx context.Context, buildId string, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/logs", nil)
}

func (c *AppAutomateClient) GetAppAutomateApps(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_apps", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateGroupMediaFiles(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_group_media", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateXCUITestApp(ctx context.Context, appId string) (*GetAppAutomateXCUITestAppResponse, error) {
	var out GetAppAutomateXCUITestAppResponse
	if err := c.http.Get(ctx, "/app-automate/xcuitest/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateXCUITestApp(ctx context.Context, appId string) (*DeleteAppAutomateXCUITestAppResponse, error) {
	var out DeleteAppAutomateXCUITestAppResponse
	if err := c.http.Delete(ctx, "/app-automate/xcuitest/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateNetworkLogs(ctx context.Context, buildId string, sessionId string) (*GetAppAutomateNetworkLogsResponse, error) {
	var out GetAppAutomateNetworkLogsResponse
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/networklogs", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateBuildTerminalLogs(ctx context.Context, buildId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/terminallogs", nil)
}

func (c *AppAutomateClient) UploadAppAutomateFlutterAndroidApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/flutter-integration-tests/v2/android/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateDetoxAndroidApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/detox/v2/android/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateXCUITestApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/xcuitest/v2/apps", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateSessionTerminalLogs(ctx context.Context, sessionId string, file []byte, fileName string, fields map[string]string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/sessions/" + sessionId + "/terminallogs", nil)
}

func (c *AppAutomateClient) GetAppAutomatePlan(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/plan.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateFlutteriOSApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateTestPackage, error) {
	var out AppAutomateTestPackage
	if err := c.http.PostMultipart(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-package", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateDetoxAndroidAppClient(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/detox/v2/android/app-client", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateXCUITestApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/xcuitest/v2/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateProject(ctx context.Context, projectId string) (*GetAppAutomateProjectResponse, error) {
	var out GetAppAutomateProjectResponse
	if err := c.http.Get(ctx, "/app-automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UpdateAppAutomateProject(ctx context.Context, projectId string, body *UpdateAppAutomateProjectRequest) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Put(ctx, "/app-automate/projects/" + projectId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateProject(ctx context.Context, projectId string) (*DeleteAppAutomateProjectResponse, error) {
	var out DeleteAppAutomateProjectResponse
	if err := c.http.Delete(ctx, "/app-automate/projects/" + projectId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateDevices(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/devices.json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateAppiumLogs(ctx context.Context, buildId string, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/appiumlogs", nil)
}

func (c *AppAutomateClient) DeleteAppAutomateApp(ctx context.Context, appId string) (*DeleteAppAutomateAppResponse, error) {
	var out DeleteAppAutomateAppResponse
	if err := c.http.Delete(ctx, "/app-automate/app/delete/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateFlutterAndroidApp(ctx context.Context, appId string) (*GetAppAutomateFlutterAndroidAppResponse, error) {
	var out GetAppAutomateFlutterAndroidAppResponse
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/android/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateFlutterAndroidApp(ctx context.Context, appId string) (*DeleteAppAutomateFlutterAndroidAppResponse, error) {
	var out DeleteAppAutomateFlutterAndroidAppResponse
	if err := c.http.Delete(ctx, "/app-automate/flutter-integration-tests/v2/android/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateMediaFile(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateMediaFile, error) {
	var out AppAutomateMediaFile
	if err := c.http.PostMultipart(ctx, "/app-automate/upload-media", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateEspressoApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/espresso/v2/apps", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateAppProfilingDataV2(ctx context.Context, buildId string, sessionId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/appprofiling/v2", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateSession(ctx context.Context, sessionId string) (*GetAppAutomateSessionResponse, error) {
	var out GetAppAutomateSessionResponse
	if err := c.http.Get(ctx, "/app-automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UpdateAppAutomateSession(ctx context.Context, sessionId string, body *UpdateAppAutomateSessionRequest) (*UpdateAppAutomateSessionResponse, error) {
	var out UpdateAppAutomateSessionResponse
	if err := c.http.Put(ctx, "/app-automate/sessions/" + sessionId + ".json", body, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateSession(ctx context.Context, sessionId string) (*DeleteAppAutomateSessionResponse, error) {
	var out DeleteAppAutomateSessionResponse
	if err := c.http.Delete(ctx, "/app-automate/sessions/" + sessionId + ".json", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateProjects(ctx context.Context, limit string, offset string, status string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/projects.json", map[string]string{"limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateMediaFile(ctx context.Context, mediaId string) (*DeleteAppAutomateMediaFileResponse, error) {
	var out DeleteAppAutomateMediaFileResponse
	if err := c.http.Delete(ctx, "/app-automate/custom_media/delete/" + mediaId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateEspressoApp(ctx context.Context, appId string) (*GetAppAutomateEspressoAppResponse, error) {
	var out GetAppAutomateEspressoAppResponse
	if err := c.http.Get(ctx, "/app-automate/espresso/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateEspressoApp(ctx context.Context, appId string) (*DeleteAppAutomateEspressoAppResponse, error) {
	var out DeleteAppAutomateEspressoAppResponse
	if err := c.http.Delete(ctx, "/app-automate/espresso/v2/apps/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateMediaFiles(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_media_files", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateFlutteriOSApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-packages", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/upload", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateGroupApps(ctx context.Context) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_group_apps", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) UploadAppAutomateEspressoApp(ctx context.Context, file []byte, fileName string, fields map[string]string) (*AppAutomateApp, error) {
	var out AppAutomateApp
	if err := c.http.PostMultipart(ctx, "/app-automate/espresso/v2/app", file, fileName, fields, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateAppsByCustomId(ctx context.Context, customId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/recent_apps/" + customId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateFlutterAndroidApps(ctx context.Context, scope string, custom_id string, limit string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/android/apps", map[string]string{"scope": scope, "custom_id": custom_id, "limit": limit}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateDeviceLogs(ctx context.Context, buildId string, sessionId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/devicelogs", nil)
}

func (c *AppAutomateClient) GetAppAutomateAppProfilingDataV1(ctx context.Context, buildId string, sessionId string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/builds/" + buildId + "/sessions/" + sessionId + "/appprofiling", nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateBuilds(ctx context.Context, projectId string, limit string, offset string, status string) (*map[string]any, error) {
	var out map[string]any
	if err := c.http.Get(ctx, "/app-automate/builds.json", map[string]string{"projectId": projectId, "limit": limit, "offset": offset, "status": status}, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateFlutteriOSApp(ctx context.Context, appId string) (*GetAppAutomateFlutteriOSAppResponse, error) {
	var out GetAppAutomateFlutteriOSAppResponse
	if err := c.http.Get(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-package/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) DeleteAppAutomateFlutteriOSApp(ctx context.Context, appId string) (*DeleteAppAutomateFlutteriOSAppResponse, error) {
	var out DeleteAppAutomateFlutteriOSAppResponse
	if err := c.http.Delete(ctx, "/app-automate/flutter-integration-tests/v2/ios/test-package/" + appId, nil, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (c *AppAutomateClient) GetAppAutomateProjectBadgeKey(ctx context.Context, projectId string) (string, error) {
	return c.http.GetText(ctx, "/app-automate/projects/" + projectId + "/badge_key", nil)
}
