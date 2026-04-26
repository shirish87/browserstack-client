package main

import (
	"context"
	"fmt"

	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAppAutomate(c *browserstackhttp.Client, action string, args []string) error {
	client := appautomate.New(c)
	ctx := context.Background()

	const usage = "Valid actions:\n" +
		"  get-build, update-build, delete-build, get-media-files-by-custom-id,\n" +
		"  get-session-logs, get-apps, get-group-media-files, get-xcui-test-app,\n" +
		"  delete-xcui-test-app, get-network-logs, upload-flutter-android-app,\n" +
		"  upload-detox-android-app, get-xcui-test-apps, get-plan, upload-flutter-ios-app,\n" +
		"  upload-detox-android-app-client, upload-xcui-test-app, get-project, update-project,\n" +
		"  delete-project, get-devices, get-appium-logs, delete-app, get-flutter-android-app,\n" +
		"  delete-flutter-android-app, upload-media-file, get-espresso-apps, get-app-profiling-data-v2,\n" +
		"  get-session, update-session, delete-session, get-projects, delete-media-file,\n" +
		"  get-espresso-app, delete-espresso-app, get-media-files, get-flutter-ios-apps,\n" +
		"  upload-app, get-group-apps, upload-espresso-app, get-apps-by-custom-id,\n" +
		"  get-flutter-android-apps, get-device-logs, get-app-profiling-data-v1,\n" +
		"  get-builds, get-flutter-ios-app, delete-flutter-ios-app, get-project-badge-key"

	switch action {
	case "help":
		fmt.Println("Usage: app-automate <action> [args...]")
		fmt.Println(usage)
		return nil

	case appautomate.ActionGetBuild:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-build <buildId>")
		}
		result, err := client.GetBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionUpdateBuild:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate update-build <buildId>")
		}
		result, err := client.UpdateBuild(ctx, args[0], nil) // nil for now, need KV parser
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteBuild:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-build <buildId>")
		}
		result, err := client.DeleteBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetMediaFilesByCustomId:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-media-files-by-custom-id <customId>")
		}
		result, err := client.GetMediaFilesByCustomId(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListSessionLogs:
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-session-logs <buildId> <sessionId>")
		}
		result, err := client.GetSessionLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case appautomate.ActionListApps:
		result, err := client.GetApps(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListGroupMediaFiles:
		result, err := client.GetGroupMediaFiles(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetXcuiTestApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-xcui-test-app <appId>")
		}
		result, err := client.GetXCUITestApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteXcuiTestApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-xcui-test-app <appId>")
		}
		result, err := client.DeleteXCUITestApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListNetworkLogs:
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-network-logs <buildId> <sessionId>")
		}
		result, err := client.GetNetworkLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListXcuiTestApps:
		result, err := client.GetXCUITestApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetPlan:
		result, err := client.GetPlan(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetProject:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-project <projectId>")
		}
		result, err := client.GetProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteProject:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-project <projectId>")
		}
		result, err := client.DeleteProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListDevices:
		result, err := client.GetDevices(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListAppiumLogs:
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-appium-logs <buildId> <sessionId>")
		}
		result, err := client.GetAppiumLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case appautomate.ActionDeleteApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-app <appId>")
		}
		result, err := client.DeleteApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetFlutterAndroidApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-flutter-android-app <appId>")
		}
		result, err := client.GetFlutterAndroidApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteFlutterAndroidApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-flutter-android-app <appId>")
		}
		result, err := client.DeleteFlutterAndroidApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListEspressoApps:
		result, err := client.GetEspressoApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetAppProfilingDataV2:
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-app-profiling-data-v2 <buildId> <sessionId>")
		}
		result, err := client.GetAppProfilingDataV2(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetSession:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-session <sessionId>")
		}
		result, err := client.GetSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteSession:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-session <sessionId>")
		}
		result, err := client.DeleteSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListProjects:
		result, err := client.GetProjects(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteMediaFile:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-media-file <mediaId>")
		}
		result, err := client.DeleteMediaFile(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetEspressoApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-espresso-app <appId>")
		}
		result, err := client.GetEspressoApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteEspressoApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-espresso-app <appId>")
		}
		result, err := client.DeleteEspressoApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListMediaFiles:
		result, err := client.GetMediaFiles(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListFlutteriOsApps:
		result, err := client.GetFlutteriOSApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListGroupApps:
		result, err := client.GetGroupApps(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetAppsByCustomId:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-apps-by-custom-id <customId>")
		}
		result, err := client.GetAppsByCustomId(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListFlutterAndroidApps:
		result, err := client.GetFlutterAndroidApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListDeviceLogs:
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-device-logs <buildId> <sessionId>")
		}
		result, err := client.GetDeviceLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case appautomate.ActionGetAppProfilingDataV1:
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-app-profiling-data-v1 <buildId> <sessionId>")
		}
		result, err := client.GetAppProfilingDataV1(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionListBuilds:
		result, err := client.GetBuilds(ctx, "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetFlutteriOsApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-flutter-ios-app <appId>")
		}
		result, err := client.GetFlutteriOSApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionDeleteFlutteriOsApp:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-flutter-ios-app <appId>")
		}
		result, err := client.DeleteFlutteriOSApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case appautomate.ActionGetProjectBadgeKey:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-project-badge-key <projectId>")
		}
		result, err := client.GetProjectBadgeKey(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil

	default:
		return fmt.Errorf("unknown action: %s\n\n%s", action, usage)
	}
}
