/* AUTO-GENERATED — do not edit */
import type { operations } from "./accessibility";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";
import type { DeepCamelCase } from "@browserstack-client/openapi-transforms";

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

export class GeneratedAccessibilityClient extends APIClient {
getAccessibilityWorkflowAnalyzerReports(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReports"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityWorkflowAnalyzerReportSummary(reportId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReportSummary"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityWorkflowAnalyzerReportIssues(reportId?: number, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWorkflowAnalyzerReportIssues"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityAssistedTestReports(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReports"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityAssistedTestReportSummary(reportId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReportSummary"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityAssistedTestReportIssues(reportId?: number, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAssistedTestReportIssues"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityWebsiteScannerAuthConfigs(options?: ExecuteOptions): Promise<DeepCamelCase<((operations["getAccessibilityWebsiteScannerAuthConfigs"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"] & Record<"authConfigs", unknown>)["authConfigs"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<((operations["getAccessibilityWebsiteScannerAuthConfigs"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"] & Record<"authConfigs", unknown>)["authConfigs"]>>;
  }

createAccessibilityWebsiteScannerAuthConfig(body: DeepCamelCase<operations["createAccessibilityWebsiteScannerAuthConfig"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createAccessibilityWebsiteScannerAuthConfig"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createAccessibilityWebsiteScannerAuthConfig"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>>;
  }

getAccessibilityWebsiteScannerScans(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScans"]["responses"][200]["content"]["application/json"]>> {
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

createAccessibilityWebsiteScannerScan(body: DeepCamelCase<operations["createAccessibilityWebsiteScannerScan"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createAccessibilityWebsiteScannerScan"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createAccessibilityWebsiteScannerScan"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>>;
  }

getAccessibilityWebsiteScannerScanOverview(scanId: number, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanOverview"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanOverview"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>>;
  }

getAccessibilityWebsiteScannerScanRuns(scanId: number, page?: number, pageSize?: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRuns"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityWebsiteScannerScanRunSummary(scanId: number, scanRunId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRunSummary"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityWebsiteScannerScanRunStatus(scanId: number, scanRunId: number, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanRunStatus"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanRunStatus"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>>;
  }

getAccessibilityWebsiteScannerScanRunIssues(scanId: number, scanRunId?: number, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityWebsiteScannerScanRunIssues"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityWebsiteScannerScanRunLogs(scanId: number, scanRunId: number, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanRunLogs"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getAccessibilityWebsiteScannerScanRunLogs"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>>;
  }

getAccessibilityAutomatedTestProjects(nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestProjects"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityAutomatedTestBuilds(nextPage?: string, projectId?: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuilds"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityAutomatedTestBuildTestCases(thBuildId: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildTestCases"]["responses"][200]["content"]["application/json"] & Record<"testCases", unknown>)["testCases"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildTestCases"]["responses"][200]["content"]["application/json"] & Record<"testCases", unknown>)["testCases"]>>;
  }

getAccessibilityAutomatedTestBuildSummary(thBuildId: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildSummary"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildSummary"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>>;
  }

getAccessibilityAutomatedTestBuildIssues(buildId?: string, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuildIssues"]["responses"][200]["content"]["application/json"]>> {
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

getAccessibilityAutomatedTestBuildTestCaseSummary(thBuildId: string, testCaseId: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildTestCaseSummary"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>> {
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
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getAccessibilityAutomatedTestBuildTestCaseSummary"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"]>>;
  }

getAccessibilityAutomatedTestBuildTestCaseIssues(thBuildId: string, testCase?: string, taskId?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAccessibilityAutomatedTestBuildTestCaseIssues"]["responses"][200]["content"]["application/json"]>> {
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
