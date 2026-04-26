package appautomate

// Generated CLI dispatcher. Do not modify.

import (
	"context"
	"fmt"
)

func argAt(args []string, i int) string {
	if i < len(args) { return args[i] }
	return ""
}

func Dispatch(client *AppAutomateClient, ctx context.Context, action string, args []string) (interface{}, error) {
	switch action {
	case ActionGetBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-build <buildId>")
		}
		return client.GetBuild(ctx, args[0])
	case ActionUpdateBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate update-build <buildId>")
		}
		return client.UpdateBuild(ctx, args[0], nil)
	case ActionDeleteBuild:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-build <buildId>")
		}
		return client.DeleteBuild(ctx, args[0])
	case ActionGetMediaFilesByCustomId:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-media-files-by-custom-id <customId>")
		}
		return client.GetMediaFilesByCustomId(ctx, args[0])
	case ActionListSessionLogs:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: app-automate list-session-logs <buildId> <sessionId>")
		}
		return client.GetSessionLogs(ctx, args[0], args[1])
	case ActionListApps:
		return client.GetApps(ctx)
	case ActionListGroupMediaFiles:
		return client.GetGroupMediaFiles(ctx)
	case ActionGetXcuiTestApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-xcui-test-app <appId>")
		}
		return client.GetXCUITestApp(ctx, args[0])
	case ActionDeleteXcuiTestApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-xcui-test-app <appId>")
		}
		return client.DeleteXCUITestApp(ctx, args[0])
	case ActionListNetworkLogs:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: app-automate list-network-logs <buildId> <sessionId>")
		}
		return client.GetNetworkLogs(ctx, args[0], args[1])
	case ActionUploadBuildTerminalLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate upload-build-terminal-logs <buildId>")
		}
		return client.UploadBuildTerminalLogs(ctx, args[0], nil, "", nil)
	case ActionUploadFlutterAndroidApp:
		return client.UploadFlutterAndroidApp(ctx, nil, "", nil)
	case ActionUploadDetoxAndroidApp:
		return client.UploadDetoxAndroidApp(ctx, nil, "", nil)
	case ActionListXcuiTestApps:
		return client.GetXCUITestApps(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionUploadSessionTerminalLogs:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate upload-session-terminal-logs <sessionId>")
		}
		return client.UploadSessionTerminalLogs(ctx, args[0], nil, "", nil)
	case ActionGetPlan:
		return client.GetPlan(ctx)
	case ActionUploadFlutteriOsApp:
		return client.UploadFlutteriOSApp(ctx, nil, "", nil)
	case ActionUploadDetoxAndroidAppClient:
		return client.UploadDetoxAndroidAppClient(ctx, nil, "", nil)
	case ActionUploadXcuiTestApp:
		return client.UploadXCUITestApp(ctx, nil, "", nil)
	case ActionGetProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-project <projectId>")
		}
		return client.GetProject(ctx, args[0])
	case ActionUpdateProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate update-project <projectId>")
		}
		return client.UpdateProject(ctx, args[0], nil)
	case ActionDeleteProject:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-project <projectId>")
		}
		return client.DeleteProject(ctx, args[0])
	case ActionListDevices:
		return client.GetDevices(ctx)
	case ActionListAppiumLogs:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: app-automate list-appium-logs <buildId> <sessionId>")
		}
		return client.GetAppiumLogs(ctx, args[0], args[1])
	case ActionDeleteApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-app <appId>")
		}
		return client.DeleteApp(ctx, args[0])
	case ActionGetFlutterAndroidApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-flutter-android-app <appId>")
		}
		return client.GetFlutterAndroidApp(ctx, args[0])
	case ActionDeleteFlutterAndroidApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-flutter-android-app <appId>")
		}
		return client.DeleteFlutterAndroidApp(ctx, args[0])
	case ActionUploadMediaFile:
		return client.UploadMediaFile(ctx, nil, "", nil)
	case ActionListEspressoApps:
		return client.GetEspressoApps(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionGetAppProfilingDataV2:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: app-automate get-app-profiling-data-v2 <buildId> <sessionId>")
		}
		return client.GetAppProfilingDataV2(ctx, args[0], args[1])
	case ActionGetSession:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-session <sessionId>")
		}
		return client.GetSession(ctx, args[0])
	case ActionUpdateSession:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate update-session <sessionId>")
		}
		return client.UpdateSession(ctx, args[0], nil)
	case ActionDeleteSession:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-session <sessionId>")
		}
		return client.DeleteSession(ctx, args[0])
	case ActionListProjects:
		return client.GetProjects(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionDeleteMediaFile:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-media-file <mediaId>")
		}
		return client.DeleteMediaFile(ctx, args[0])
	case ActionGetEspressoApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-espresso-app <appId>")
		}
		return client.GetEspressoApp(ctx, args[0])
	case ActionDeleteEspressoApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-espresso-app <appId>")
		}
		return client.DeleteEspressoApp(ctx, args[0])
	case ActionListMediaFiles:
		return client.GetMediaFiles(ctx)
	case ActionListFlutteriOsApps:
		return client.GetFlutteriOSApps(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionUploadApp:
		return client.UploadApp(ctx, nil, "", nil)
	case ActionListGroupApps:
		return client.GetGroupApps(ctx)
	case ActionUploadEspressoApp:
		return client.UploadEspressoApp(ctx, nil, "", nil)
	case ActionGetAppsByCustomId:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-apps-by-custom-id <customId>")
		}
		return client.GetAppsByCustomId(ctx, args[0])
	case ActionListFlutterAndroidApps:
		return client.GetFlutterAndroidApps(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2))
	case ActionListDeviceLogs:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: app-automate list-device-logs <buildId> <sessionId>")
		}
		return client.GetDeviceLogs(ctx, args[0], args[1])
	case ActionGetAppProfilingDataV1:
		if len(args) < 2 {
			return nil, fmt.Errorf("usage: app-automate get-app-profiling-data-v1 <buildId> <sessionId>")
		}
		return client.GetAppProfilingDataV1(ctx, args[0], args[1])
	case ActionListBuilds:
		return client.GetBuilds(ctx, argAt(args, 0), argAt(args, 1), argAt(args, 2), argAt(args, 3))
	case ActionGetFlutteriOsApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-flutteri-os-app <appId>")
		}
		return client.GetFlutteriOSApp(ctx, args[0])
	case ActionDeleteFlutteriOsApp:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate delete-flutteri-os-app <appId>")
		}
		return client.DeleteFlutteriOSApp(ctx, args[0])
	case ActionGetProjectBadgeKey:
		if len(args) < 1 {
			return nil, fmt.Errorf("usage: app-automate get-project-badge-key <projectId>")
		}
		return client.GetProjectBadgeKey(ctx, args[0])
	default:
		return nil, fmt.Errorf("unknown action: %s", action)
	}
}
