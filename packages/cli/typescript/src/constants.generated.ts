/**
 * Generated CLI constants. Do not modify.
 */

export enum Product {
  Automate = "automate",
  AppAutomate = "app-automate",
  Screenshots = "screenshots",
  LocalTesting = "local-testing",
  TestManagement = "test-management",
  Accessibility = "accessibility",
  TestReporting = "test-reporting",
}

export namespace Automate {
  export enum Action {
    ListBrowsers = "list-browsers",
    GetPlan = "get-plan",
    ListSessionAppiumLogs = "list-session-appium-logs",
    GetProjectBadgeKey = "get-project-badge-key",
    UploadSessionTerminalLogs = "upload-session-terminal-logs",
    DeleteBuilds = "delete-builds",
    GetSession = "get-session",
    UpdateSession = "update-session",
    DeleteSession = "delete-session",
    DeleteSessions = "delete-sessions",
    DeleteMediaFile = "delete-media-file",
    GetBuild = "get-build",
    UpdateBuild = "update-build",
    DeleteBuild = "delete-build",
    ListSessionLogs = "list-session-logs",
    UploadMediaFile = "upload-media-file",
    RecycleKey = "recycle-key",
    ListSessions = "list-sessions",
    GetProject = "get-project",
    UpdateProject = "update-project",
    DeleteProject = "delete-project",
    ListSessionSeleniumLogs = "list-session-selenium-logs",
    UploadBuildTerminalLogs = "upload-build-terminal-logs",
    ListMediaFiles = "list-media-files",
    ListProjects = "list-projects",
    ListSessionConsoleLogs = "list-session-console-logs",
    ListSessionTelemetryLogs = "list-session-telemetry-logs",
    ListBuilds = "list-builds",
    ListSessionNetworkLogs = "list-session-network-logs",
  }
}

export namespace AppAutomate {
  export enum Action {
    GetBuild = "get-build",
    UpdateBuild = "update-build",
    DeleteBuild = "delete-build",
    GetMediaFilesByCustomId = "get-media-files-by-custom-id",
    ListSessionLogs = "list-session-logs",
    ListApps = "list-apps",
    ListGroupMediaFiles = "list-group-media-files",
    GetXcuiTestApp = "get-xcui-test-app",
    DeleteXcuiTestApp = "delete-xcui-test-app",
    ListNetworkLogs = "list-network-logs",
    UploadBuildTerminalLogs = "upload-build-terminal-logs",
    UploadFlutterAndroidApp = "upload-flutter-android-app",
    UploadDetoxAndroidApp = "upload-detox-android-app",
    ListXcuiTestApps = "list-xcui-test-apps",
    UploadSessionTerminalLogs = "upload-session-terminal-logs",
    GetPlan = "get-plan",
    UploadFlutteriOsApp = "upload-flutteri-os-app",
    UploadDetoxAndroidAppClient = "upload-detox-android-app-client",
    UploadXcuiTestApp = "upload-xcui-test-app",
    GetProject = "get-project",
    UpdateProject = "update-project",
    DeleteProject = "delete-project",
    ListDevices = "list-devices",
    ListAppiumLogs = "list-appium-logs",
    DeleteApp = "delete-app",
    GetFlutterAndroidApp = "get-flutter-android-app",
    DeleteFlutterAndroidApp = "delete-flutter-android-app",
    UploadMediaFile = "upload-media-file",
    ListEspressoApps = "list-espresso-apps",
    GetAppProfilingDataV2 = "get-app-profiling-data-v2",
    GetSession = "get-session",
    UpdateSession = "update-session",
    DeleteSession = "delete-session",
    ListProjects = "list-projects",
    DeleteMediaFile = "delete-media-file",
    GetEspressoApp = "get-espresso-app",
    DeleteEspressoApp = "delete-espresso-app",
    ListMediaFiles = "list-media-files",
    ListFlutteriOsApps = "list-flutteri-os-apps",
    UploadApp = "upload-app",
    ListGroupApps = "list-group-apps",
    UploadEspressoApp = "upload-espresso-app",
    GetAppsByCustomId = "get-apps-by-custom-id",
    ListFlutterAndroidApps = "list-flutter-android-apps",
    ListDeviceLogs = "list-device-logs",
    GetAppProfilingDataV1 = "get-app-profiling-data-v1",
    ListBuilds = "list-builds",
    GetFlutteriOsApp = "get-flutteri-os-app",
    DeleteFlutteriOsApp = "delete-flutteri-os-app",
    GetProjectBadgeKey = "get-project-badge-key",
  }
}

export namespace Screenshots {
  export enum Action {
    GetJob = "get-job",
    CreateJob = "create-job",
    ListBrowsers = "list-browsers",
  }
}

export namespace LocalTesting {
  export enum Action {
    ListInstances = "list-instances",
    GetInstance = "get-instance",
    DisconnectInstance = "disconnect-instance",
  }
}

export namespace TestManagement {
  export enum Resource {
    Projects = "Projects",
    Folders = "Folders",
    TestCases = "TestCases",
    Attachments = "Attachments",
    TestResults = "TestResults",
    TestRuns = "TestRuns",
    TestPlans = "TestPlans",
    Configurations = "Configurations",
    CustomFields = "CustomFields",
  }

  export enum ProjectsAction {
    ListProjects = "list-projects",
    CreateProject = "create-project",
    GetProject = "get-project",
    UpdateProject = "update-project",
    DeleteProject = "delete-project",
  }
  export enum FoldersAction {
    ListFolders = "list-folders",
    CreateFolder = "create-folder",
    GetFolder = "get-folder",
    UpdateFolder = "update-folder",
    DeleteFolder = "delete-folder",
    MoveFolder = "move-folder",
  }
  export enum TestCasesAction {
    ListTestCases = "list-test-cases",
    BulkEditTestCases = "bulk-edit-test-cases",
    BulkDeleteTestCases = "bulk-delete-test-cases",
    BulkArchiveTestCases = "bulk-archive-test-cases",
    BulkUnarchiveTestCases = "bulk-unarchive-test-cases",
    BulkEditTestCasesWithOperations = "bulk-edit-test-cases-with-operations",
    CreateTestCase = "create-test-case",
    UpdateTestCase = "update-test-case",
    DeleteTestCase = "delete-test-case",
    ArchiveTestCase = "archive-test-case",
    UnarchiveTestCase = "unarchive-test-case",
    MoveTestCase = "move-test-case",
  }
  export enum AttachmentsAction {
    ListTestCaseAttachments = "list-test-case-attachments",
    AddTestCaseAttachment = "add-test-case-attachment",
    DeleteTestCaseAttachment = "delete-test-case-attachment",
    ListTestResultAttachments = "list-test-result-attachments",
    AddTestResultAttachment = "add-test-result-attachment",
    DeleteTestResultAttachment = "delete-test-result-attachment",
  }
  export enum TestResultsAction {
    ListTestCaseResults = "list-test-case-results",
    ListTestRunResults = "list-test-run-results",
    AddTestRunResults = "add-test-run-results",
    ListTestRunTestCaseResults = "list-test-run-test-case-results",
  }
  export enum TestRunsAction {
    ListTestRuns = "list-test-runs",
    CreateTestRun = "create-test-run",
    GetTestRun = "get-test-run",
    ListTestRunTestCases = "list-test-run-test-cases",
    PatchTestRun = "patch-test-run",
    UpdateTestRun = "update-test-run",
    AssignTestRunTestCases = "assign-test-run-test-cases",
    CloseTestRun = "close-test-run",
    DeleteTestRun = "delete-test-run",
  }
  export enum TestPlansAction {
    ListTestPlans = "list-test-plans",
    CreateTestPlan = "create-test-plan",
    GetTestPlan = "get-test-plan",
    UpdateTestPlan = "update-test-plan",
    ListTestPlanTestRuns = "list-test-plan-test-runs",
  }
  export enum ConfigurationsAction {
    ListConfigurations = "list-configurations",
    CreateConfiguration = "create-configuration",
    GetConfiguration = "get-configuration",
  }
  export enum CustomFieldsAction {
    ListCustomFields = "list-custom-fields",
    CreateCustomField = "create-custom-field",
    UpdateCustomField = "update-custom-field",
    DeleteCustomField = "delete-custom-field",
  }
}

export namespace Accessibility {
  export enum Action {
    ListWorkflowAnalyzerReports = "list-workflow-analyzer-reports",
    GetWorkflowAnalyzerReportSummary = "get-workflow-analyzer-report-summary",
    ListWorkflowAnalyzerReportIssues = "list-workflow-analyzer-report-issues",
    ListAssistedTestReports = "list-assisted-test-reports",
    GetAssistedTestReportSummary = "get-assisted-test-report-summary",
    ListAssistedTestReportIssues = "list-assisted-test-report-issues",
    ListWebsiteScannerAuthConfigs = "list-website-scanner-auth-configs",
    CreateWebsiteScannerAuthConfig = "create-website-scanner-auth-config",
    ListWebsiteScannerScans = "list-website-scanner-scans",
    CreateWebsiteScannerScan = "create-website-scanner-scan",
    GetWebsiteScannerScanOverview = "get-website-scanner-scan-overview",
    ListWebsiteScannerScanRuns = "list-website-scanner-scan-runs",
    GetWebsiteScannerScanRunSummary = "get-website-scanner-scan-run-summary",
    ListWebsiteScannerScanRunStatus = "list-website-scanner-scan-run-status",
    ListWebsiteScannerScanRunIssues = "list-website-scanner-scan-run-issues",
    ListWebsiteScannerScanRunLogs = "list-website-scanner-scan-run-logs",
    ListAutomatedTestProjects = "list-automated-test-projects",
    ListAutomatedTestBuilds = "list-automated-test-builds",
    ListAutomatedTestBuildTestCases = "list-automated-test-build-test-cases",
    GetAutomatedTestBuildSummary = "get-automated-test-build-summary",
    ListAutomatedTestBuildIssues = "list-automated-test-build-issues",
    GetAutomatedTestBuildTestCaseSummary = "get-automated-test-build-test-case-summary",
    ListAutomatedTestBuildTestCaseIssues = "list-automated-test-build-test-case-issues",
  }
}

export namespace TestReporting {
  export enum Action {
    ListProjects = "list-projects",
    ListProjectBuilds = "list-project-builds",
    StartBuild = "start-build",
    GetLatestBuild = "get-latest-build",
    GetBuild = "get-build",
    UpdateBuild = "update-build",
    FinishBuild = "finish-build",
    StartTestRun = "start-test-run",
    FinishTestRun = "finish-test-run",
    StartHookRun = "start-hook-run",
    FinishHookRun = "finish-hook-run",
    AddBuildLogs = "add-build-logs",
    ListTestRuns = "list-test-runs",
    GetSelfHealingReport = "get-self-healing-report",
    ListQualityGateStatus = "list-quality-gate-status",
    ListQualityGateSettings = "list-quality-gate-settings",
    UpdateQualityGateSettings = "update-quality-gate-settings",
    CreateQualityGateProfile = "create-quality-gate-profile",
    GetQualityGateProfile = "get-quality-gate-profile",
    UpdateQualityGateProfile = "update-quality-gate-profile",
    DeleteQualityGateProfile = "delete-quality-gate-profile",
    ToggleQualityGateProfile = "toggle-quality-gate-profile",
    UploadReport = "upload-report",
  }
}

