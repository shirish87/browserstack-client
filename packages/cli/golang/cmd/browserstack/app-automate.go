package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
	"github.com/browserstack/browserstack-client/internal/tui"
)

func runAppAutomate(c *browserstackhttp.Client, action string, args []string) error {
	client := appautomate.New(c)
	ctx := context.Background()

	const usage = `Usage: app-automate <action> [args...]

Actions:
  get-plan
  list-devices
  list-projects
  get-project             <projectId>
  update-project          <projectId>
  delete-project          <projectId>
  get-project-badge-key   <projectId>
  list-builds
  get-build               <buildId>
  update-build            <buildId>
  delete-build            <buildId>
  get-session             <sessionId>
  update-session          <sessionId>
  delete-session          <sessionId>
  list-session-logs       <buildId> <sessionId>
  list-appium-logs        <buildId> <sessionId>
  list-network-logs       <buildId> <sessionId>
  list-device-logs        <buildId> <sessionId>
  upload-session-terminal-logs   <sessionId>
  upload-build-terminal-logs     <buildId>
  list-apps
  list-group-apps
  list-apps-by-custom-id  <customId>
  upload-app              <file-path>
  delete-app              <appId>
  list-media-files
  list-group-media-files
  list-media-files-by-custom-id  <customId>
  upload-media-file       <file-path>
  delete-media-file       <mediaId>
  list-espresso-apps
  get-espresso-app        <appId>
  upload-espresso-app     <file-path>
  delete-espresso-app     <appId>
  list-xcui-test-apps
  get-xcui-test-app       <appId>
  upload-xcui-test-app    <file-path>
  delete-xcui-test-app    <appId>
  list-flutter-android-apps
  get-flutter-android-app     <appId>
  upload-flutter-android-app  <file-path>
  delete-flutter-android-app  <appId>
  list-flutter-ios-apps
  get-flutter-ios-app         <appId>
  upload-flutter-ios-app      <file-path>
  delete-flutter-ios-app      <appId>
  upload-detox-android-app        <file-path>
  upload-detox-android-app-client <file-path>
  list-app-profiling-data-v1  <buildId> <sessionId>
  get-app-profiling-data-v2   <buildId> <sessionId>`

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	if len(args) > 0 && args[len(args)-1] == "help" {
		if h := tui.ActionHelp(appautomate.ProductAppAutomate, action); h != "" {
			fmt.Println(h)
			return nil
		}
	}

	// Special handling for upload actions
	switch action {
	case appautomate.ActionUploadApp, appautomate.ActionUploadEspressoApp, appautomate.ActionUploadXcuiTestApp,
		appautomate.ActionUploadMediaFile, appautomate.ActionUploadFlutterAndroidApp, appautomate.ActionUploadFlutterIosApp,
		appautomate.ActionUploadDetoxAndroidApp, appautomate.ActionUploadDetoxAndroidAppClient:
		if len(args) < 1 {
			return fmt.Errorf("usage: app-automate %s <file-path>", action)
		}
		filePath := args[0]
		data, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read file: %w", err)
		}
		fileName := filepath.Base(filePath)

		var res *appautomate.DispatchResult
		switch action {
		case appautomate.ActionUploadApp:
			v, err := client.UploadApp(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadApp: v}
		case appautomate.ActionUploadEspressoApp:
			v, err := client.UploadEspressoApp(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadEspressoApp: v}
		case appautomate.ActionUploadXcuiTestApp:
			v, err := client.UploadXCUITestApp(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadXcuiTestApp: v}
		case appautomate.ActionUploadMediaFile:
			v, err := client.UploadMediaFile(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadMediaFile: v}
		case appautomate.ActionUploadFlutterAndroidApp:
			v, err := client.UploadFlutterAndroidApp(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadFlutterAndroidApp: v}
		case appautomate.ActionUploadFlutterIosApp:
			v, err := client.UploadFlutteriOSApp(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadFlutterIosApp: v}
		case appautomate.ActionUploadDetoxAndroidApp:
			v, err := client.UploadDetoxAndroidApp(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadDetoxAndroidApp: v}
		case appautomate.ActionUploadDetoxAndroidAppClient:
			v, err := client.UploadDetoxAndroidAppClient(ctx, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadDetoxAndroidAppClient: v}
		}
		return output.Print(res)

	case appautomate.ActionUploadBuildTerminalLogs, appautomate.ActionUploadSessionTerminalLogs:
		if len(args) < 2 {
			return fmt.Errorf("usage: app-automate %s <id> <file-path>", action)
		}
		id := args[0]
		filePath := args[1]
		data, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read file: %w", err)
		}
		fileName := filepath.Base(filePath)

		var res *appautomate.DispatchResult
		switch action {
		case appautomate.ActionUploadBuildTerminalLogs:
			v, err := client.UploadBuildTerminalLogs(ctx, id, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadBuildTerminalLogs: &v}
		case appautomate.ActionUploadSessionTerminalLogs:
			v, err := client.UploadSessionTerminalLogs(ctx, id, data, fileName, nil)
			if err != nil {
				return err
			}
			res = &appautomate.DispatchResult{Action: action, UploadSessionTerminalLogs: &v}
		}
		return output.Print(res)
	}

	res, err := appautomate.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	switch action {
	case appautomate.ActionListBuilds:
		if res.ListBuilds != nil {
			for _, b := range *res.ListBuilds {
				fmt.Printf("%s %s %s\n", b.AutomationBuild.HashedId, b.AutomationBuild.Name, b.AutomationBuild.Status)
			}
			return nil
		}
	case appautomate.ActionListProjects:
		if res.ListProjects != nil {
			for _, p := range *res.ListProjects {
				fmt.Printf("%.0f %s\n", p.Id, p.Name)
			}
			return nil
		}
	}

	return output.PrintWithColumns(res, appautomate.DisplayColumns(action))
}
