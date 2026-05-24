/* AUTO-GENERATED — do not edit */
import type { operations } from "./website-scanner";
import { APIClient, type ExecuteOptions } from "@dot-slash/browserstack-core";
import { HttpError, toCamelCase, toSnakeCase } from "@dot-slash/browserstack-openapi-transforms";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";

export type ListWebsiteScannerAuthConfigsError = HttpError<
  | (operations["listWebsiteScannerAuthConfigs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerAuthConfigs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerAuthConfigs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerAuthConfigs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerAuthConfigs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateWebsiteScannerAuthConfigError = HttpError<
  | (operations["createWebsiteScannerAuthConfig"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerAuthConfig"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerAuthConfig"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerAuthConfig"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerAuthConfig"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type ListWebsiteScannerScansError = HttpError<
  | (operations["listWebsiteScannerScans"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScans"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScans"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScans"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScans"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetWebsiteScannerScanError = HttpError<
  | (operations["getWebsiteScannerScan"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScan"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScan"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScan"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScan"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateWebsiteScannerScanError = HttpError<
  | (operations["createWebsiteScannerScan"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerScan"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerScan"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerScan"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWebsiteScannerScan"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type TriggerWebsiteScannerScanRunError = HttpError<
  | (operations["triggerWebsiteScannerScanRun"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["triggerWebsiteScannerScanRun"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["triggerWebsiteScannerScanRun"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["triggerWebsiteScannerScanRun"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["triggerWebsiteScannerScanRun"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type ListWebsiteScannerScanRunsError = HttpError<
  | (operations["listWebsiteScannerScanRuns"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScanRuns"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScanRuns"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScanRuns"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["listWebsiteScannerScanRuns"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetWebsiteScannerScanRunStatusError = HttpError<
  | (operations["getWebsiteScannerScanRunStatus"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunStatus"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunStatus"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunStatus"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunStatus"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetWebsiteScannerScanRunSummaryError = HttpError<
  | (operations["getWebsiteScannerScanRunSummary"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunSummary"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunSummary"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunSummary"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWebsiteScannerScanRunSummary"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export class GeneratedWebsiteScannerClient extends APIClient {
/**
 * Returns all saved authentication configurations used by the Website Scanner for login-protected pages.
 *
 * @param options - Optional abort signal and other request options
 */
  listWebsiteScannerAuthConfigs(options?: ExecuteOptions): Promise<DeepCamelCase<operations["listWebsiteScannerAuthConfigs"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/auth_configs",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "listWebsiteScannerAuthConfigs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["listWebsiteScannerAuthConfigs"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Creates a new authentication configuration for the Website Scanner to access login-protected pages during scans.
 *
 * @param options - Optional abort signal and other request options
 */
  createWebsiteScannerAuthConfig(body: DeepCamelCase<operations["createWebsiteScannerAuthConfig"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["createWebsiteScannerAuthConfig"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/auth_configs",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "createWebsiteScannerAuthConfig",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["createWebsiteScannerAuthConfig"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns a paginated list of all configured Website Scanner scans for your account.
 *
 * @param options - Optional abort signal and other request options
 */
  listWebsiteScannerScans(page?: number, pageSize?: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["listWebsiteScannerScans"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner",
      params: { query: { "page": page, "page_size": pageSize } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "listWebsiteScannerScans",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["listWebsiteScannerScans"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns details for a specific Website Scanner scan project.
 *
 * @param projId - The unique ID of the scan project
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScan(projId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getWebsiteScannerScan"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/{proj_id}",
      params: { path: { proj_id: projId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getWebsiteScannerScan",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getWebsiteScannerScan"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Creates a new Website Scanner scan project with the specified configuration.
 *
 * @param options - Optional abort signal and other request options
 */
  createWebsiteScannerScan(body: DeepCamelCase<operations["createWebsiteScannerScan"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["createWebsiteScannerScan"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/create",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "createWebsiteScannerScan",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["createWebsiteScannerScan"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Triggers a new scan run for an existing Website Scanner scan project.
 *
 * @param projectId - The unique ID of the scan project
 * @param options - Optional abort signal and other request options
 */
  triggerWebsiteScannerScanRun(projectId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["triggerWebsiteScannerScanRun"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/scans/{project_id}/new_scan",
      params: { path: { project_id: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "triggerWebsiteScannerScanRun",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["triggerWebsiteScannerScanRun"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns a paginated list of all scan runs for a specific Website Scanner scan project.
 *
 * @param projId - The unique ID of the scan project
 * @param options - Optional abort signal and other request options
 */
  listWebsiteScannerScanRuns(projId: number, page?: number, pageSize?: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["listWebsiteScannerScanRuns"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/{proj_id}/scan_builds",
      params: { path: { proj_id: projId }, query: { "page": page, "page_size": pageSize } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "listWebsiteScannerScanRuns",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["listWebsiteScannerScanRuns"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the current execution status of a specific Website Scanner scan run.
 *
 * @param reportId - The unique ID of the scan run report
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanRunStatus(projId: number, reportId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getWebsiteScannerScanRunStatus"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/{proj_id}/scan_builds/{report_id}/status",
      params: { path: { proj_id: projId, report_id: reportId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getWebsiteScannerScanRunStatus",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getWebsiteScannerScanRunStatus"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Returns the summary for a specific Website Scanner scan run, including issue counts and scan metadata.
 *
 * @param options - Optional abort signal and other request options
 */
  getWebsiteScannerScanRunSummary(projId: number, reportId: number, product?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getWebsiteScannerScanRunSummary"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v1/scanner/{proj_id}/scan_builds/{report_id}",
      params: { path: { proj_id: projId, report_id: reportId }, query: { "product": product } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getWebsiteScannerScanRunSummary",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getWebsiteScannerScanRunSummary"]["responses"][200]["content"]["application/json"]>>;
  }
}
