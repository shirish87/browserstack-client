/* AUTO-GENERATED — do not edit */
import type { operations } from "./accessibility";
import { APIClient, type ExecuteOptions } from "@dot-slash/browserstack-core";
import { HttpError, toCamelCase, toSnakeCase } from "@dot-slash/browserstack-openapi-transforms";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";

export type GetAccessibilityWorkflowAnalyzerReportsError = HttpError<unknown>;

export type GetAccessibilityWorkflowAnalyzerReportSummaryError = HttpError<unknown>;

export type GetAccessibilityWorkflowAnalyzerReportIssuesError = HttpError<unknown>;

export type GetAccessibilityAssistedTestReportsError = HttpError<unknown>;

export type GetAccessibilityAssistedTestReportSummaryError = HttpError<unknown>;

export type GetAccessibilityAssistedTestReportIssuesError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerAuthConfigsError = HttpError<unknown>;

export type CreateAccessibilityWebsiteScannerAuthConfigError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerScansError = HttpError<unknown>;

export type CreateAccessibilityWebsiteScannerScanError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerScanOverviewError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerScanRunsError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerScanRunSummaryError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerScanRunStatusError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerScanRunIssuesError = HttpError<unknown>;

export type GetAccessibilityWebsiteScannerScanRunLogsError = HttpError<unknown>;

export type GetAccessibilityAutomatedTestProjectsError = HttpError<unknown>;

export type GetAccessibilityAutomatedTestBuildsError = HttpError<unknown>;

export type GetAccessibilityAutomatedTestBuildTestCasesError = HttpError<unknown>;

export type GetAccessibilityAutomatedTestBuildSummaryError = HttpError<unknown>;

export type GetAccessibilityAutomatedTestBuildIssuesError = HttpError<unknown>;

export type GetAccessibilityAutomatedTestBuildTestCaseSummaryError = HttpError<unknown>;

export type GetAccessibilityAutomatedTestBuildTestCaseIssuesError = HttpError<unknown>;

/** @interface */
export type GetAccessibilityWebsiteScannerAuthConfigsResult = DeepCamelCase<((operations["getAccessibilityWebsiteScannerAuthConfigs"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"] & Record<"authConfigs", unknown>)["authConfigs"]>;
/** @interface */
export type CreateAccessibilityWebsiteScannerAuthConfigResult = DeepCamelCase<(operations["createAccessibilityWebsiteScannerAuthConfig"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>;
/** @interface */
export type CreateAccessibilityWebsiteScannerScanResult = DeepCamelCase<(operations["createAccessibilityWebsiteScannerScan"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>;
/** @interface */
export type GetAccessibilityWebsiteScannerScanOverviewResult = DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanOverview"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>;
/** @interface */
export type GetAccessibilityWebsiteScannerScanRunStatusResult = DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanRunStatus"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>;
/** @interface */
export type GetAccessibilityWebsiteScannerScanRunLogsResult = DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanRunLogs"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>;
/** @interface */
export type GetAccessibilityAutomatedTestBuildTestCasesResult = DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildTestCases"]["responses"][200]["content"]["application/json"] & Record<"testCases", unknown>)["testCases"]>;
/** @interface */
export type GetAccessibilityAutomatedTestBuildSummaryResult = DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildSummary"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>;
/** @interface */
export type GetAccessibilityAutomatedTestBuildTestCaseSummaryResult = DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildTestCaseSummary"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>;

export class GeneratedAccessibilityClient extends APIClient {
/**
 * Returns a paginated list of all Workflow Analyzer accessibility reports for your account.
 *
 * @param options - Optional abort signal and other request options
 */
  getWorkflowAnalyzerReports(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReports"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/workflow-analyzer/v1/reports",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWorkflowAnalyzerReports",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReports"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the summary for a specific Workflow Analyzer report, including score, issue counts, and scan metadata.
 *
 * @param options - Optional abort signal and other request options
 */
  getWorkflowAnalyzerReportSummary(reportId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReportSummary"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/workflow-analyzer/v1/reports/{report_id}",
      params: { path: { report_id: reportId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWorkflowAnalyzerReportSummary",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReportSummary"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the paginated list of accessibility issues for a specific Workflow Analyzer report, optionally filtered by task.
 *
 * @param options - Optional abort signal and other request options
 */
  getWorkflowAnalyzerReportIssues(reportId?: number, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReportIssues"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/workflow-analyzer/v1/reports/issues",
      params: { query: { "report_id": reportId, "task_id": taskId, "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWorkflowAnalyzerReportIssues",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReportIssues"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns a paginated list of all Assisted Test accessibility reports for your account.
 *
 * @param options - Optional abort signal and other request options
 */
  getAssistedTestReports(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReports"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/assisted-test/v1/reports",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAssistedTestReports",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReports"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the summary for a specific Assisted Test report, including score, issue counts, and scan metadata.
 *
 * @param options - Optional abort signal and other request options
 */
  getAssistedTestReportSummary(reportId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReportSummary"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/assisted-test/v1/reports/{report_id}",
      params: { path: { report_id: reportId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAssistedTestReportSummary",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReportSummary"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the paginated list of accessibility issues for a specific Assisted Test report, optionally filtered by task.
 *
 * @param options - Optional abort signal and other request options
 */
  getAssistedTestReportIssues(reportId?: number, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReportIssues"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/assisted-test/v1/reports/issues",
      params: { query: { "report_id": reportId, "task_id": taskId, "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAssistedTestReportIssues",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReportIssues"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns all saved authentication configurations used by the Website Scanner for login-protected pages.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerAuthConfigs(options?: ExecuteOptions): Promise<GetAccessibilityWebsiteScannerAuthConfigsResult> {
    return (this.execute({
      path: "/api/website-scanner/v1/auth_configs",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data.authConfigs"},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerAuthConfigs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAccessibilityWebsiteScannerAuthConfigsResult>;
  }

/**
 * Creates a new authentication configuration for the Website Scanner to access login-protected pages during scans.
 *
 * @param options - Optional abort signal and other request options
 */
  createWebsiteScannerAuthConfig(body: DeepCamelCase<operations["createAccessibilityWebsiteScannerAuthConfig"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<CreateAccessibilityWebsiteScannerAuthConfigResult> {
    return (this.execute({
      path: "/api/website-scanner/v1/auth_configs",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data"},
      baseUrl: "sdk" as const,
      operationId: "createAccessibilityWebsiteScannerAuthConfig",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<CreateAccessibilityWebsiteScannerAuthConfigResult>;
  }

/**
 * Returns a paginated list of all configured Website Scanner scans for your account.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScans(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScans"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerScans",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScans"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Creates and triggers a new Website Scanner accessibility scan for the specified URL.
 *
 * @param options - Optional abort signal and other request options
 */
  createWebsiteScannerScan(body: DeepCamelCase<operations["createAccessibilityWebsiteScannerScan"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<CreateAccessibilityWebsiteScannerScanResult> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data"},
      baseUrl: "sdk" as const,
      operationId: "createAccessibilityWebsiteScannerScan",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<CreateAccessibilityWebsiteScannerScanResult>;
  }

/**
 * Returns the configuration overview for a specific Website Scanner scan, including URL list and scan settings.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanOverview(scanId: number, options?: ExecuteOptions): Promise<GetAccessibilityWebsiteScannerScanOverviewResult> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/overview",
      params: { path: { scan_id: scanId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data"},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerScanOverview",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAccessibilityWebsiteScannerScanOverviewResult>;
  }

/**
 * Returns a paginated list of all scan runs for a specific Website Scanner scan, including status and issue counts.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanRuns(scanId: number, page?: number, pageSize?: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRuns"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs",
      params: { path: { scan_id: scanId }, query: { "page": page, "page_size": pageSize } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerScanRuns",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRuns"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns a detailed summary for a specific scan run, including score, issue counts, and changes since the last run.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanRunSummary(scanId: number, scanRunId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRunSummary"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}",
      params: { path: { scan_id: scanId, scan_run_id: scanRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerScanRunSummary",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRunSummary"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the current execution status of a specific Website Scanner scan run.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanRunStatus(scanId: number, scanRunId: number, options?: ExecuteOptions): Promise<GetAccessibilityWebsiteScannerScanRunStatusResult> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}/status",
      params: { path: { scan_id: scanId, scan_run_id: scanRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data"},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerScanRunStatus",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAccessibilityWebsiteScannerScanRunStatusResult>;
  }

/**
 * Returns paginated accessibility issues found during a specific Website Scanner scan run, optionally filtered by task.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanRunIssues(scanId: number, scanRunId?: number, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRunIssues"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/issues",
      params: { path: { scan_id: scanId }, query: { "scan_run_id": scanRunId, "task_id": taskId, "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerScanRunIssues",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRunIssues"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the crawl logs for a specific Website Scanner scan run, including per-URL status, redirects, and errors.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanRunLogs(scanId: number, scanRunId: number, options?: ExecuteOptions): Promise<GetAccessibilityWebsiteScannerScanRunLogsResult> {
    return (this.execute({
      path: "/api/website-scanner/v1/scans/{scan_id}/scan_runs/{scan_run_id}/scan_logs",
      params: { path: { scan_id: scanId, scan_run_id: scanRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data"},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityWebsiteScannerScanRunLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAccessibilityWebsiteScannerScanRunLogsResult>;
  }

/**
 * Returns a paginated list of all Automated Test accessibility projects for your account.
 *
 * @param options - Optional abort signal and other request options
 */
  getAutomatedTestProjects(nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestProjects"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/automated-tests/v1/projects",
      params: { query: { "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAutomatedTestProjects",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestProjects"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns a paginated list of Automated Test accessibility builds, optionally filtered by project.
 *
 * @param options - Optional abort signal and other request options
 */
  getAutomatedTestBuilds(nextPage?: string, projectId?: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuilds"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/automated-tests/v1/builds",
      params: { query: { "next_page": nextPage, "projectId": projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAutomatedTestBuilds",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuilds"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the paginated list of test cases and their accessibility results for a specific Automated Test build.
 *
 * @param options - Optional abort signal and other request options
 */
  getAutomatedTestBuildTestCases(thBuildId: string, nextPage?: string, options?: ExecuteOptions): Promise<GetAccessibilityAutomatedTestBuildTestCasesResult> {
    return (this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}/test-cases",
      params: { path: { thBuildId: thBuildId }, query: { "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.testCases"},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAutomatedTestBuildTestCases",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAccessibilityAutomatedTestBuildTestCasesResult>;
  }

/**
 * Returns the summary for a specific Automated Test build, including score, health stats, and issue counts.
 *
 * @param options - Optional abort signal and other request options
 */
  getAutomatedTestBuildSummary(thBuildId: string, nextPage?: string, options?: ExecuteOptions): Promise<GetAccessibilityAutomatedTestBuildSummaryResult> {
    return (this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}",
      params: { path: { thBuildId: thBuildId }, query: { "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data"},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAutomatedTestBuildSummary",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAccessibilityAutomatedTestBuildSummaryResult>;
  }

/**
 * Returns paginated accessibility issues for a specific Automated Test build, optionally filtered by task.
 *
 * @param options - Optional abort signal and other request options
 */
  getAutomatedTestBuildIssues(buildId?: string, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuildIssues"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/automated-tests/v1/builds/issues",
      params: { query: { "build_id": buildId, "task_id": taskId, "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAutomatedTestBuildIssues",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuildIssues"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the accessibility summary for a specific test case within an Automated Test build.
 *
 * @param options - Optional abort signal and other request options
 */
  getAutomatedTestBuildTestCaseSummary(thBuildId: string, testCaseId: string, nextPage?: string, options?: ExecuteOptions): Promise<GetAccessibilityAutomatedTestBuildTestCaseSummaryResult> {
    return (this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}/test-cases/{test_case_id}",
      params: { path: { thBuildId: thBuildId, test_case_id: testCaseId }, query: { "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data"},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAutomatedTestBuildTestCaseSummary",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAccessibilityAutomatedTestBuildTestCaseSummaryResult>;
  }

/**
 * Returns paginated accessibility issues for a specific test case within an Automated Test build.
 *
 * @param options - Optional abort signal and other request options
 */
  getAutomatedTestBuildTestCaseIssues(thBuildId: string, testCase?: string, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuildTestCaseIssues"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/automated-tests/v1/builds/{thBuildId}/issues",
      params: { path: { thBuildId: thBuildId }, query: { "test_case": testCase, "task_id": taskId, "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAccessibilityAutomatedTestBuildTestCaseIssues",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuildTestCaseIssues"]["responses"][200]["content"]["application/json"]>>;
  }
}
