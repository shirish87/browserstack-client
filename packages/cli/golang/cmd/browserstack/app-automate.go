package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	appautomate "github.com/browserstack/browserstack-client/generated/app-automate"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

func runAppAutomate(c *browserstackhttp.Client, action string, args []string) error {
	client := appautomate.New(c)
	ctx := context.Background()

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
