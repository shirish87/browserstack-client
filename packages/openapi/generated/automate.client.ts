/* AUTO-GENERATED — do not edit */
import type { operations } from "./automate";
import { APIClient, type ExecuteOptions } from "@dot-slash/browserstack-core";
import { HttpError, toCamelCase, toSnakeCase } from "@dot-slash/browserstack-openapi-transforms";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";

export type GetAutomateBrowsersError = HttpError<
  | (operations["getAutomateBrowsers"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBrowsers"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBrowsers"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBrowsers"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBrowsers"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomatePlanError = HttpError<
  | (operations["getAutomatePlan"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomatePlan"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomatePlan"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomatePlan"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomatePlan"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionAppiumLogsError = HttpError<
  | (operations["getAutomateSessionAppiumLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionAppiumLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionAppiumLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionAppiumLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionAppiumLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateProjectBadgeKeyError = HttpError<
  | (operations["getAutomateProjectBadgeKey"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjectBadgeKey"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjectBadgeKey"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjectBadgeKey"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjectBadgeKey"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAutomateSessionTerminalLogsError = HttpError<
  | (operations["uploadAutomateSessionTerminalLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateSessionTerminalLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateSessionTerminalLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateSessionTerminalLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateSessionTerminalLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAutomateBuildsError = HttpError<
  | (operations["deleteAutomateBuilds"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuilds"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuilds"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuilds"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuilds"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionError = HttpError<
  | (operations["getAutomateSession"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSession"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSession"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSession"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSession"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateAutomateSessionError = HttpError<
  | (operations["updateAutomateSession"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateSession"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateSession"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateSession"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateSession"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAutomateSessionError = HttpError<
  | (operations["deleteAutomateSession"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSession"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSession"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSession"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSession"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAutomateSessionsError = HttpError<
  | (operations["deleteAutomateSessions"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSessions"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSessions"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSessions"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateSessions"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAutomateMediaFileError = HttpError<
  | (operations["deleteAutomateMediaFile"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateMediaFile"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateMediaFile"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateMediaFile"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateMediaFile"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateBuildError = HttpError<
  | (operations["getAutomateBuild"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuild"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuild"]["responses"][403] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuild"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuild"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuild"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateAutomateBuildError = HttpError<
  | (operations["updateAutomateBuild"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateBuild"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateBuild"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateBuild"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateBuild"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAutomateBuildError = HttpError<
  | (operations["deleteAutomateBuild"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuild"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuild"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuild"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateBuild"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionLogsError = HttpError<
  | (operations["getAutomateSessionLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAutomateMediaFileError = HttpError<
  | (operations["uploadAutomateMediaFile"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateMediaFile"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateMediaFile"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateMediaFile"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateMediaFile"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type RecycleAutomateKeyError = HttpError<
  | (operations["recycleAutomateKey"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["recycleAutomateKey"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["recycleAutomateKey"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["recycleAutomateKey"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["recycleAutomateKey"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionsError = HttpError<
  | (operations["getAutomateSessions"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessions"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessions"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessions"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessions"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateProjectError = HttpError<
  | (operations["getAutomateProject"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProject"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProject"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateAutomateProjectError = HttpError<
  | (operations["updateAutomateProject"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateProject"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAutomateProject"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAutomateProjectError = HttpError<
  | (operations["deleteAutomateProject"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateProject"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAutomateProject"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionSeleniumLogsError = HttpError<
  | (operations["getAutomateSessionSeleniumLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionSeleniumLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionSeleniumLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionSeleniumLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionSeleniumLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAutomateBuildTerminalLogsError = HttpError<
  | (operations["uploadAutomateBuildTerminalLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateBuildTerminalLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateBuildTerminalLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateBuildTerminalLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAutomateBuildTerminalLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateMediaFilesError = HttpError<
  | (operations["getAutomateMediaFiles"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateMediaFiles"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateMediaFiles"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateMediaFiles"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateMediaFiles"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateProjectsError = HttpError<
  | (operations["getAutomateProjects"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjects"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjects"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjects"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateProjects"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionConsoleLogsError = HttpError<
  | (operations["getAutomateSessionConsoleLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionConsoleLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionConsoleLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionConsoleLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionConsoleLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionTelemetryLogsError = HttpError<
  | (operations["getAutomateSessionTelemetryLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionTelemetryLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionTelemetryLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionTelemetryLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionTelemetryLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateBuildsError = HttpError<
  | (operations["getAutomateBuilds"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuilds"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuilds"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuilds"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateBuilds"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAutomateSessionNetworkLogsError = HttpError<
  | (operations["getAutomateSessionNetworkLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionNetworkLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionNetworkLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionNetworkLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAutomateSessionNetworkLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

/** @interface */
export type GetAutomateSessionResult = DeepCamelCase<(operations["getAutomateSession"]["responses"][200]["content"]["application/json"] & Record<"automation_session", unknown>)["automation_session"]>;
/** @interface */
export type UpdateAutomateSessionResult = DeepCamelCase<(operations["updateAutomateSession"]["responses"][200]["content"]["application/json"] & Record<"automation_session", unknown>)["automation_session"]>;
/** @interface */
export type GetAutomateBuildSessionsItem = DeepCamelCase<(((operations["getAutomateBuild"]["responses"][200]["content"]["application/json"] & Record<"build", unknown>)["build"] & Record<"sessions", unknown>)["sessions"][number] & Record<"automation_session", unknown>)["automation_session"]>;
/** @interface */
export type GetAutomateBuildResult = DeepCamelCase<((operations["getAutomateBuild"]["responses"][200]["content"]["application/json"] & Record<"build", unknown>)["build"] & Record<"automation_build", unknown>)["automation_build"]> & { sessions: Array<GetAutomateBuildSessionsItem> };
/** @interface */
export type GetAutomateSessionsResultItem = DeepCamelCase<(operations["getAutomateSessions"]["responses"][200]["content"]["application/json"][number] & Record<"automation_session", unknown>)["automation_session"]>;
export type GetAutomateSessionsResult = Array<GetAutomateSessionsResultItem>;
/** @interface */
export type GetAutomateProjectResult = DeepCamelCase<(operations["getAutomateProject"]["responses"][200]["content"]["application/json"] & Record<"project", unknown>)["project"]>;
/** @interface */
export type GetAutomateBuildsResultItem = DeepCamelCase<(operations["getAutomateBuilds"]["responses"][200]["content"]["application/json"][number] & Record<"automation_build", unknown>)["automation_build"]>;
export type GetAutomateBuildsResult = Array<GetAutomateBuildsResultItem>;

export class GeneratedAutomateClient extends APIClient {
/**
 * Fetches all automate browsers.
 *
 * @param options - Optional abort signal and other request options
 */
  getBrowsers(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAutomateBrowsers"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/browsers.json",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateBrowsers",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAutomateBrowsers"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches Automate plan details
 *
 * @param options - Optional abort signal and other request options
 */
  getPlan(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAutomatePlan"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/plan.json",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomatePlan",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAutomatePlan"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches Appium logs for a session. Raw Appium Logs for each session are available to you in text format.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  getSessionAppiumLogs(sessionId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}/appiumlogs",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSessionAppiumLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

/**
 * Fetches the badge key for sharing a public link for the Automate dashboard to view the latest build and sessions for that project
 *
 * @param projectId - ID of your project
 * @param options - Optional abort signal and other request options
 */
  getProjectBadgeKey(projectId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/automate/projects/{projectId}/badge_key",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateProjectBadgeKey",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

/**
 * Upload terminal logs for your session.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  uploadSessionTerminalLogs(sessionId: string, body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}/terminallogs",
      params: { path: { sessionId: sessionId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdkCloud" as const,
      operationId: "uploadAutomateSessionTerminalLogs",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

/**
 * Delete multiple builds on the server. You can delete a maximum of 5 builds at a time. Builds once deleted cannot be recovered.
 *
 * @param buildId - IDs of your builds
 * @param options - Optional abort signal and other request options
 */
  deleteBuilds(buildId?: string[], options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteAutomateBuilds"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/builds",
      params: { query: { "buildId[]": buildId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAutomateBuilds",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteAutomateBuilds"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches a session for a particular build
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  getSession(sessionId: string, options?: ExecuteOptions): Promise<GetAutomateSessionResult> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.automation_session"},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSession",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAutomateSessionResult>;
  }

/**
 * Set the status for a session or update the name of the session. You can mark test status as passed or failed along with a reason.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  updateSession(sessionId: string, body: DeepCamelCase<operations["updateAutomateSession"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<UpdateAutomateSessionResult> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId: sessionId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.automation_session"},
      baseUrl: "sdk" as const,
      operationId: "updateAutomateSession",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<UpdateAutomateSessionResult>;
  }

/**
 * Delete a session on the server. Sessions once deleted cannot be recovered
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  deleteSession(sessionId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteAutomateSession"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAutomateSession",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteAutomateSession"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Delete multiple sessions on the server. Sessions once deleted cannot be recovered.
 *
 * @param sessionId - IDs of your sessions
 * @param options - Optional abort signal and other request options
 */
  deleteSessions(sessionId?: string[], options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteAutomateSessions"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/sessions",
      params: { query: { "sessionId[]": sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAutomateSessions",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteAutomateSessions"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Delete a media file on the server. Media files once deleted cannot be recovered
 *
 * @param mediaId - ID of your media file
 * @param options - Optional abort signal and other request options
 */
  deleteMediaFile(mediaId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteAutomateMediaFile"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/custom_media/delete/{mediaId}",
      params: { path: { mediaId: mediaId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAutomateMediaFile",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteAutomateMediaFile"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches a build
 *
 * @param buildId - ID of your build
 * @param options - Optional abort signal and other request options
 */
  getBuild(buildId: string, options?: ExecuteOptions): Promise<GetAutomateBuildResult> {
    return (this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId: buildId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-compose",
      responseCodecConfig: {"base":"$.build.automation_build","merge":{"sessions":"$.build.sessions[*].automation_session"}},
      baseUrl: "sdk" as const,
      operationId: "getAutomateBuild",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAutomateBuildResult>;
  }

/**
 * Update the name or tag of your build after the build is complete. To delete a build tag, simply pass an empty string as value for build_tag.
 *
 * @param buildId - ID of your build
 * @param options - Optional abort signal and other request options
 */
  updateBuild(buildId: string, body: DeepCamelCase<operations["updateAutomateBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateAutomateBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId: buildId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateAutomateBuild",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["updateAutomateBuild"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Delete a build on the server. Please note that deleting a build will delete all the sessions contained within it. Builds once deleted cannot be recovered
 *
 * @param buildId - ID of your build
 * @param options - Optional abort signal and other request options
 */
  deleteBuild(buildId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteAutomateBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId: buildId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAutomateBuild",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteAutomateBuild"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches session logs. Whenever you execute a session on BrowserStack, a session log is generated. These logs are available to you in text format.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  getSessionLogs(sessionId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}/logs",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSessionLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

/**
 * Upload a media file you want to use in your tests
 *
 * @param options - Optional abort signal and other request options
 */
  uploadMediaFile(body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["uploadAutomateMediaFile"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/upload-media",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAutomateMediaFile",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["uploadAutomateMediaFile"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Reset Automate access key
 *
 * @param options - Optional abort signal and other request options
 */
  recycleKey(body: DeepCamelCase<operations["recycleAutomateKey"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["recycleAutomateKey"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/recycle_key.json",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "recycleAutomateKey",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["recycleAutomateKey"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches list of sessions for a particular build
 *
 * @param buildId - ID of your build
 * @param limit - Specify the number of results to be displayed. The default value is 10, and the maximum value is 100
 * @param offset - Retrieve sessions from a specific point using the offset parameter
 * @param status - Status of the session
 * @param options - Optional abort signal and other request options
 */
  getSessions(buildId: string, limit?: string, offset?: string, status?: string, options?: ExecuteOptions): Promise<GetAutomateSessionsResult> {
    return (this.execute({
      path: "/automate/builds/{buildId}/sessions.json",
      params: { path: { buildId: buildId }, query: { "limit": limit, "offset": offset, "status": status } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$[*].automation_session"},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSessions",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAutomateSessionsResult>;
  }

/**
 * Specific information about a particular project can be queried using the project ID
 *
 * @param projectId - ID of your project
 * @param options - Optional abort signal and other request options
 */
  getProject(projectId: string, options?: ExecuteOptions): Promise<GetAutomateProjectResult> {
    return (this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk" as const,
      operationId: "getAutomateProject",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAutomateProjectResult>;
  }

/**
 * Update the name of your project after the project is complete
 *
 * @param projectId - ID of your project
 * @param options - Optional abort signal and other request options
 */
  updateProject(projectId: string, body: DeepCamelCase<operations["updateAutomateProject"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateAutomateProject"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateAutomateProject",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["updateAutomateProject"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Delete a project on the server using the DELETE method. Please note that to delete a project, it needs to be empty of builds and sessions, and projects once deleted cannot be recovered
 *
 * @param projectId - ID of your project
 * @param options - Optional abort signal and other request options
 */
  deleteProject(projectId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteAutomateProject"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAutomateProject",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteAutomateProject"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches Selenium logs for a session. Raw Selenium logs for each session are available to you in text format.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  getSessionSeleniumLogs(sessionId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}/seleniumlogs",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSessionSeleniumLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

/**
 * Upload terminal logs for your build.
 *
 * @param buildId - ID of your build
 * @param options - Optional abort signal and other request options
 */
  uploadBuildTerminalLogs(buildId: string, body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/automate/builds/{buildId}/terminallogs",
      params: { path: { buildId: buildId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAutomateBuildTerminalLogs",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

/**
 * Fetches list of recently uploaded media files
 *
 * @param options - Optional abort signal and other request options
 */
  getMediaFiles(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAutomateMediaFiles"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/recent_media_files",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateMediaFiles",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAutomateMediaFiles"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches list of projects associated with your username and access key. You will need the id of the project for invoking any other Project API that follows in this document
 *
 * @param options - Optional abort signal and other request options
 */
  getProjects(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAutomateProjects"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/projects.json",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateProjects",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAutomateProjects"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches console logs for a session. Console logs are enabled by default and are set to errors. You can disable them or change verbosity options by using the browserstack.console capability to disabled, errors, warnings, info, verbose. Raw Console Logs for each session are available to you in text format.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  getSessionConsoleLogs(sessionId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}/consolelogs",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSessionConsoleLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

/**
 * Fetches telemetry logs for a session. Telemetry logs for a session are available for tests run using Selenium 4. Telemetry logs are by default disabled for a session.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  getSessionTelemetryLogs(sessionId: string, options?: ExecuteOptions): Promise<ArrayBuffer> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}/telemetrylogs",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "binary",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSessionTelemetryLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<ArrayBuffer>;
  }

/**
 * Fetch the 10 recent test builds that have run on BrowserStack. You can also limit the number of builds and paginate through your data
 *
 * @param projectId - ID of your project
 * @param limit - Specify the number of results to be displayed. The default value is 10, and the maximum value is 100
 * @param offset - Retrieve builds from a specific point using the offset parameter
 * @param status - Status of the build
 * @param options - Optional abort signal and other request options
 */
  getBuilds(projectId?: string, limit?: string, offset?: string, status?: string, options?: ExecuteOptions): Promise<GetAutomateBuildsResult> {
    return (this.execute({
      path: "/automate/builds.json",
      params: { query: { "projectId": projectId, "limit": limit, "offset": offset, "status": status } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$[*].automation_build"},
      baseUrl: "sdk" as const,
      operationId: "getAutomateBuilds",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<GetAutomateBuildsResult>;
  }

/**
 * Fetches network logs for a session. Network Logs for each session are available to you in HAR (HTTP Archive) format.
 *
 * @param sessionId - ID of your session
 * @param options - Optional abort signal and other request options
 */
  getSessionNetworkLogs(sessionId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getAutomateSessionNetworkLogs"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/automate/sessions/{sessionId}/networklogs",
      params: { path: { sessionId: sessionId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAutomateSessionNetworkLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getAutomateSessionNetworkLogs"]["responses"][200]["content"]["application/json"]>>;
  }
}
