package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"path/filepath"

	testreporting "github.com/browserstack/browserstack-client/generated/test-reporting"
	browserstackhttp "github.com/browserstack/browserstack-client/internal/http"
	"github.com/browserstack/browserstack-client/internal/output"
)

const testReportingBaseURL = "https://api-test-reporting.browserstack.com"
const testReportingUploadURL = "https://upload-automation.browserstack.com"

func runTestReporting(username, accessKey, action string, args []string) error {
	c := browserstackhttp.New(testReportingBaseURL, username, accessKey)
	client := testreporting.New(c)
	ctx := context.Background()

	const usage = "Usage: test-reporting <action> [args...]"

	if action == "help" {
		fmt.Println(usage)
		return nil
	}

	// upload-report requires a file and named flags — handle before generic dispatch.
	if action == testreporting.ActionUploadReport {
		return runUploadReport(username, accessKey, ctx, args)
	}

	res, err := testreporting.Dispatch(client, ctx, action, args)
	if err != nil {
		return err
	}

	return output.Print(res)
}

func runUploadReport(username, accessKey string, ctx context.Context, args []string) error {
	fs := flag.NewFlagSet("upload-report", flag.ContinueOnError)
	projectName := fs.String("project-name", "", "Project name (required)")
	buildName := fs.String("build-name", "", "Build name (required)")
	format := fs.String("format", "junit", "Report format: junit or allure")
	buildIdentifier := fs.String("build-identifier", "", "Unique identifier for split/re-run uploads (expires 6h)")
	tags := fs.String("tags", "", "Comma-separated tags (e.g. 'regression, nightly')")
	ci := fs.String("ci", "", "CI job URL")
	frameworkVersion := fs.String("framework-version", "", "Framework name and version (e.g. 'junit, 5.8')")

	if err := fs.Parse(args); err != nil {
		return err
	}

	filePath := fs.Arg(0)
	if filePath == "" {
		return fmt.Errorf("usage: test-reporting upload-report <file.xml|file.zip> --project-name <name> --build-name <name> [--format junit|allure] [--build-identifier <id>] [--tags <tags>] [--ci <url>] [--framework-version <ver>]")
	}
	if *projectName == "" {
		return fmt.Errorf("--project-name is required")
	}
	if *buildName == "" {
		return fmt.Errorf("--build-name is required")
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read file %q: %w", filePath, err)
	}
	fileName := filepath.Base(filePath)

	fields := map[string]string{
		"project_name": *projectName,
		"build_name":   *buildName,
		"format":       *format,
	}
	if *buildIdentifier != "" {
		fields["build_identifier"] = *buildIdentifier
	}
	if *tags != "" {
		fields["tags"] = *tags
	}
	if *ci != "" {
		fields["ci"] = *ci
	}
	if *frameworkVersion != "" {
		fields["framework_version"] = *frameworkVersion
	}

	// Upload goes to a different host than the rest of the test-reporting API.
	uploadClient := testreporting.New(browserstackhttp.New(testReportingUploadURL, username, accessKey))
	res, err := uploadClient.UploadReport(ctx, data, fileName, fields)
	if err != nil {
		return err
	}
	return output.Print(&testreporting.DispatchResult{Action: testreporting.ActionUploadReport, UploadReport: res})
}
