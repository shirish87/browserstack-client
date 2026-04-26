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

	switch action {
	case "get-plan":
		result, err := client.GetPlan(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-devices":
		result, err := client.GetDevices(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)

	// Builds
	case "list-builds":
		result, err := client.GetBuilds(ctx, "", "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-build":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-build <buildId>")
		}
		result, err := client.GetBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-build":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-build <buildId>")
		}
		result, err := client.DeleteBuild(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Sessions
	case "get-session":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-session <sessionId>")
		}
		result, err := client.GetSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-session":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-session <sessionId>")
		}
		result, err := client.DeleteSession(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-session-logs":
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-session-logs <buildId> <sessionId>")
		}
		result, err := client.GetSessionLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case "get-appium-logs":
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-appium-logs <buildId> <sessionId>")
		}
		result, err := client.GetAppiumLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case "get-device-logs":
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-device-logs <buildId> <sessionId>")
		}
		result, err := client.GetDeviceLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil
	case "get-network-logs":
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-network-logs <buildId> <sessionId>")
		}
		result, err := client.GetNetworkLogs(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-app-profiling-v1":
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-app-profiling-v1 <buildId> <sessionId>")
		}
		result, err := client.GetAppProfilingDataV1(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-app-profiling-v2":
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate get-app-profiling-v2 <buildId> <sessionId>")
		}
		result, err := client.GetAppProfilingDataV2(ctx, args[0], args[1])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Projects
	case "list-projects":
		result, err := client.GetProjects(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-project":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-project <projectId>")
		}
		result, err := client.GetProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-project":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-project <projectId>")
		}
		result, err := client.DeleteProject(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-project-badge-key":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-project-badge-key <projectId>")
		}
		result, err := client.GetProjectBadgeKey(ctx, args[0])
		if err != nil {
			return err
		}
		fmt.Println(result)
		return nil

	// Apps
	case "list-apps":
		result, err := client.GetApps(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-group-apps":
		result, err := client.GetGroupApps(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-apps-by-custom-id":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-apps-by-custom-id <customId>")
		}
		result, err := client.GetAppsByCustomId(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-app <appId>")
		}
		result, err := client.DeleteApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Media files
	case "list-media-files":
		result, err := client.GetMediaFiles(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "list-group-media-files":
		result, err := client.GetGroupMediaFiles(ctx)
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-media-files-by-custom-id":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-media-files-by-custom-id <customId>")
		}
		result, err := client.GetMediaFilesByCustomId(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-media-file":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-media-file <mediaId>")
		}
		result, err := client.DeleteMediaFile(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Espresso
	case "list-espresso-apps":
		result, err := client.GetEspressoApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-espresso-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-espresso-app <appId>")
		}
		result, err := client.GetEspressoApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-espresso-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-espresso-app <appId>")
		}
		result, err := client.DeleteEspressoApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// XCUITest
	case "list-xcuitest-apps":
		result, err := client.GetXCUITestApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-xcuitest-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-xcuitest-app <appId>")
		}
		result, err := client.GetXCUITestApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-xcuitest-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-xcuitest-app <appId>")
		}
		result, err := client.DeleteXCUITestApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Flutter Android
	case "list-flutter-android-apps":
		result, err := client.GetFlutterAndroidApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-flutter-android-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-flutter-android-app <appId>")
		}
		result, err := client.GetFlutterAndroidApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-flutter-android-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-flutter-android-app <appId>")
		}
		result, err := client.DeleteFlutterAndroidApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	// Flutter iOS
	case "list-flutter-ios-apps":
		result, err := client.GetFlutteriOSApps(ctx, "", "", "")
		if err != nil {
			return err
		}
		return output.Print(result)
	case "get-flutter-ios-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate get-flutter-ios-app <appId>")
		}
		result, err := client.GetFlutteriOSApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)
	case "delete-flutter-ios-app":
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate delete-flutter-ios-app <appId>")
		}
		result, err := client.DeleteFlutteriOSApp(ctx, args[0])
		if err != nil {
			return err
		}
		return output.Print(result)

	default:
		return fmt.Errorf("unknown action: %s\n\nValid actions:\n"+
			"  get-plan, get-devices\n"+
			"  list-builds, get-build, delete-build\n"+
			"  get-session, delete-session, get-session-logs, get-appium-logs, get-device-logs, get-network-logs, get-app-profiling-v1, get-app-profiling-v2\n"+
			"  list-projects, get-project, delete-project, get-project-badge-key\n"+
			"  list-apps, list-group-apps, get-apps-by-custom-id, delete-app\n"+
			"  list-media-files, list-group-media-files, get-media-files-by-custom-id, delete-media-file\n"+
			"  list-espresso-apps, get-espresso-app, delete-espresso-app\n"+
			"  list-xcuitest-apps, get-xcuitest-app, delete-xcuitest-app\n"+
			"  list-flutter-android-apps, get-flutter-android-app, delete-flutter-android-app\n"+
			"  list-flutter-ios-apps, get-flutter-ios-app, delete-flutter-ios-app", action)
	}
}
