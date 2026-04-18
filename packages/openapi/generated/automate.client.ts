/* AUTO-GENERATED — do not edit */
import type { operations, paths } from "./automate";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

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

export abstract class GeneratedAutomateClient extends APIClient<paths> {
getAutomateBrowsers(options?: APIFetchOptions<operations["getAutomateBrowsers"]>): Promise<operations["getAutomateBrowsers"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/browsers.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateBrowsers",
      method: "GET" as const,
    }) as Promise<operations["getAutomateBrowsers"]["responses"][200]["content"]["application/json"]>;
  }

getAutomatePlan(options?: APIFetchOptions<operations["getAutomatePlan"]>): Promise<operations["getAutomatePlan"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/plan.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomatePlan",
      method: "GET" as const,
    }) as Promise<operations["getAutomatePlan"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionAppiumLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionAppiumLogs"]>): Promise<string> {
    return this.execute({
      path: "/automate/sessions/{sessionId}/appiumlogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSessionAppiumLogs",
      method: "GET" as const,
    }) as Promise<string>;
  }

getAutomateProjectBadgeKey(projectId: string, options?: APIFetchOptions<operations["getAutomateProjectBadgeKey"]>): Promise<string> {
    return this.execute({
      path: "/automate/projects/{projectId}/badge_key",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateProjectBadgeKey",
      method: "GET" as const,
    }) as Promise<string>;
  }

deleteAutomateBuilds(options?: APIFetchOptions<operations["deleteAutomateBuilds"]>): Promise<operations["deleteAutomateBuilds"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/builds",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "deleteAutomateBuilds",
      method: "DELETE" as const,
    }) as Promise<operations["deleteAutomateBuilds"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSession(sessionId: string, options?: APIFetchOptions<operations["getAutomateSession"]>): Promise<operations["getAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]> {
    return this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.automation_session"},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSession",
      method: "GET" as const,
    }) as Promise<operations["getAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]>;
  }

updateAutomateSession(sessionId: string, body: operations["updateAutomateSession"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAutomateSession"]>): Promise<operations["updateAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]> {
    return this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.automation_session"},
      baseUrl: "sdk",
      ...options,
      operationId: "updateAutomateSession",
      method: "PUT" as const,
    }) as Promise<operations["updateAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]>;
  }

deleteAutomateSession(sessionId: string, options?: APIFetchOptions<operations["deleteAutomateSession"]>): Promise<operations["deleteAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "deleteAutomateSession",
      method: "DELETE" as const,
    }) as Promise<operations["deleteAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateSessions(options?: APIFetchOptions<operations["deleteAutomateSessions"]>): Promise<operations["deleteAutomateSessions"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/sessions",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "deleteAutomateSessions",
      method: "DELETE" as const,
    }) as Promise<operations["deleteAutomateSessions"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateMediaFile(mediaId: string, options?: APIFetchOptions<operations["deleteAutomateMediaFile"]>): Promise<operations["deleteAutomateMediaFile"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/custom_media/delete/{mediaId}",
      params: { path: { mediaId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "deleteAutomateMediaFile",
      method: "DELETE" as const,
    }) as Promise<operations["deleteAutomateMediaFile"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateBuild(buildId: string, options?: APIFetchOptions<operations["getAutomateBuild"]>): Promise<any> {
    return this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-compose",
      responseCodecConfig: {"base":"$.build.automation_build","merge":{"sessions":"$.build.sessions[*].automation_session"}},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateBuild",
      method: "GET" as const,
    }) as Promise<any>;
  }

updateAutomateBuild(buildId: string, body: operations["updateAutomateBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAutomateBuild"]>): Promise<operations["updateAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "updateAutomateBuild",
      method: "PUT" as const,
    }) as Promise<operations["updateAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateBuild(buildId: string, options?: APIFetchOptions<operations["deleteAutomateBuild"]>): Promise<operations["deleteAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "deleteAutomateBuild",
      method: "DELETE" as const,
    }) as Promise<operations["deleteAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionLogs"]>): Promise<string> {
    return this.execute({
      path: "/automate/sessions/{sessionId}/logs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSessionLogs",
      method: "GET" as const,
    }) as Promise<string>;
  }

recycleAutomateKey(body: operations["recycleAutomateKey"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["recycleAutomateKey"]>): Promise<operations["recycleAutomateKey"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/recycle_key.json",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "recycleAutomateKey",
      method: "PUT" as const,
    }) as Promise<operations["recycleAutomateKey"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessions(buildId: string, options?: APIFetchOptions<operations["getAutomateSessions"]>): Promise<Array<operations["getAutomateSessions"]["responses"][200]["content"]["application/json"][number]["automation_session"]>> {
    return this.execute({
      path: "/automate/builds/{buildId}/sessions.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$[*].automation_session"},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSessions",
      method: "GET" as const,
    }) as Promise<Array<operations["getAutomateSessions"]["responses"][200]["content"]["application/json"][number]["automation_session"]>>;
  }

getAutomateProject(projectId: string, options?: APIFetchOptions<operations["getAutomateProject"]>): Promise<operations["getAutomateProject"]["responses"][200]["content"]["application/json"]["project"]> {
    return this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateProject",
      method: "GET" as const,
    }) as Promise<operations["getAutomateProject"]["responses"][200]["content"]["application/json"]["project"]>;
  }

updateAutomateProject(projectId: string, body: operations["updateAutomateProject"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAutomateProject"]>): Promise<operations["updateAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "updateAutomateProject",
      method: "PUT" as const,
    }) as Promise<operations["updateAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateProject(projectId: string, options?: APIFetchOptions<operations["deleteAutomateProject"]>): Promise<operations["deleteAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "deleteAutomateProject",
      method: "DELETE" as const,
    }) as Promise<operations["deleteAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionSeleniumLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionSeleniumLogs"]>): Promise<string> {
    return this.execute({
      path: "/automate/sessions/{sessionId}/seleniumlogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSessionSeleniumLogs",
      method: "GET" as const,
    }) as Promise<string>;
  }

getAutomateMediaFiles(options?: APIFetchOptions<operations["getAutomateMediaFiles"]>): Promise<operations["getAutomateMediaFiles"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/recent_media_files",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateMediaFiles",
      method: "GET" as const,
    }) as Promise<operations["getAutomateMediaFiles"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateProjects(options?: APIFetchOptions<operations["getAutomateProjects"]>): Promise<operations["getAutomateProjects"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/projects.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateProjects",
      method: "GET" as const,
    }) as Promise<operations["getAutomateProjects"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionConsoleLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionConsoleLogs"]>): Promise<string> {
    return this.execute({
      path: "/automate/sessions/{sessionId}/consolelogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSessionConsoleLogs",
      method: "GET" as const,
    }) as Promise<string>;
  }

getAutomateSessionTelemetryLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionTelemetryLogs"]>): Promise<ArrayBuffer> {
    return this.execute({
      path: "/automate/sessions/{sessionId}/telemetrylogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "binary",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSessionTelemetryLogs",
      method: "GET" as const,
    }) as Promise<ArrayBuffer>;
  }

getAutomateBuilds(options?: APIFetchOptions<operations["getAutomateBuilds"]>): Promise<Array<operations["getAutomateBuilds"]["responses"][200]["content"]["application/json"][number]["automation_build"]>> {
    return this.execute({
      path: "/automate/builds.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$[*].automation_build"},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateBuilds",
      method: "GET" as const,
    }) as Promise<Array<operations["getAutomateBuilds"]["responses"][200]["content"]["application/json"][number]["automation_build"]>>;
  }

getAutomateSessionNetworkLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionNetworkLogs"]>): Promise<operations["getAutomateSessionNetworkLogs"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/automate/sessions/{sessionId}/networklogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getAutomateSessionNetworkLogs",
      method: "GET" as const,
    }) as Promise<operations["getAutomateSessionNetworkLogs"]["responses"][200]["content"]["application/json"]>;
  }
}
