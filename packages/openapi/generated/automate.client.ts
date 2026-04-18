/* AUTO-GENERATED — do not edit */
import type { operations, components, paths } from "./automate";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

export type GetAutomateBrowsersError = HttpError<
  | operations["getAutomateBrowsers"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateBrowsers"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateBrowsers"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateBrowsers"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateBrowsers"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomatePlanError = HttpError<
  | operations["getAutomatePlan"]["responses"][400]["content"]["application/json"]
  | operations["getAutomatePlan"]["responses"][401]["content"]["application/json"]
  | operations["getAutomatePlan"]["responses"][404]["content"]["application/json"]
  | operations["getAutomatePlan"]["responses"][422]["content"]["application/json"]
  | operations["getAutomatePlan"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionAppiumLogsError = HttpError<
  | operations["getAutomateSessionAppiumLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSessionAppiumLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSessionAppiumLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSessionAppiumLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSessionAppiumLogs"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateProjectBadgeKeyError = HttpError<
  | operations["getAutomateProjectBadgeKey"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateProjectBadgeKey"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateProjectBadgeKey"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateProjectBadgeKey"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateProjectBadgeKey"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAutomateBuildsError = HttpError<
  | operations["deleteAutomateBuilds"]["responses"][400]["content"]["application/json"]
  | operations["deleteAutomateBuilds"]["responses"][401]["content"]["application/json"]
  | operations["deleteAutomateBuilds"]["responses"][404]["content"]["application/json"]
  | operations["deleteAutomateBuilds"]["responses"][422]["content"]["application/json"]
  | operations["deleteAutomateBuilds"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionError = HttpError<
  | operations["getAutomateSession"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSession"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSession"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSession"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSession"]["responses"][500]["content"]["application/json"]
>;

export type UpdateAutomateSessionError = HttpError<
  | operations["updateAutomateSession"]["responses"][400]["content"]["application/json"]
  | operations["updateAutomateSession"]["responses"][401]["content"]["application/json"]
  | operations["updateAutomateSession"]["responses"][404]["content"]["application/json"]
  | operations["updateAutomateSession"]["responses"][422]["content"]["application/json"]
  | operations["updateAutomateSession"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAutomateSessionError = HttpError<
  | operations["deleteAutomateSession"]["responses"][400]["content"]["application/json"]
  | operations["deleteAutomateSession"]["responses"][401]["content"]["application/json"]
  | operations["deleteAutomateSession"]["responses"][404]["content"]["application/json"]
  | operations["deleteAutomateSession"]["responses"][422]["content"]["application/json"]
  | operations["deleteAutomateSession"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAutomateSessionsError = HttpError<
  | operations["deleteAutomateSessions"]["responses"][400]["content"]["application/json"]
  | operations["deleteAutomateSessions"]["responses"][401]["content"]["application/json"]
  | operations["deleteAutomateSessions"]["responses"][404]["content"]["application/json"]
  | operations["deleteAutomateSessions"]["responses"][422]["content"]["application/json"]
  | operations["deleteAutomateSessions"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAutomateMediaFileError = HttpError<
  | operations["deleteAutomateMediaFile"]["responses"][400]["content"]["application/json"]
  | operations["deleteAutomateMediaFile"]["responses"][401]["content"]["application/json"]
  | operations["deleteAutomateMediaFile"]["responses"][404]["content"]["application/json"]
  | operations["deleteAutomateMediaFile"]["responses"][422]["content"]["application/json"]
  | operations["deleteAutomateMediaFile"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateBuildError = HttpError<
  | operations["getAutomateBuild"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateBuild"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateBuild"]["responses"][403]["content"]["application/json"]
  | operations["getAutomateBuild"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateBuild"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateBuild"]["responses"][500]["content"]["application/json"]
>;

export type UpdateAutomateBuildError = HttpError<
  | operations["updateAutomateBuild"]["responses"][400]["content"]["application/json"]
  | operations["updateAutomateBuild"]["responses"][401]["content"]["application/json"]
  | operations["updateAutomateBuild"]["responses"][404]["content"]["application/json"]
  | operations["updateAutomateBuild"]["responses"][422]["content"]["application/json"]
  | operations["updateAutomateBuild"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAutomateBuildError = HttpError<
  | operations["deleteAutomateBuild"]["responses"][400]["content"]["application/json"]
  | operations["deleteAutomateBuild"]["responses"][401]["content"]["application/json"]
  | operations["deleteAutomateBuild"]["responses"][404]["content"]["application/json"]
  | operations["deleteAutomateBuild"]["responses"][422]["content"]["application/json"]
  | operations["deleteAutomateBuild"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionLogsError = HttpError<
  | operations["getAutomateSessionLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSessionLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSessionLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSessionLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSessionLogs"]["responses"][500]["content"]["application/json"]
>;

export type RecycleAutomateKeyError = HttpError<
  | operations["recycleAutomateKey"]["responses"][400]["content"]["application/json"]
  | operations["recycleAutomateKey"]["responses"][401]["content"]["application/json"]
  | operations["recycleAutomateKey"]["responses"][404]["content"]["application/json"]
  | operations["recycleAutomateKey"]["responses"][422]["content"]["application/json"]
  | operations["recycleAutomateKey"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionsError = HttpError<
  | operations["getAutomateSessions"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSessions"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSessions"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSessions"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSessions"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateProjectError = HttpError<
  | operations["getAutomateProject"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateProject"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateProject"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateProject"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateProject"]["responses"][500]["content"]["application/json"]
>;

export type UpdateAutomateProjectError = HttpError<
  | operations["updateAutomateProject"]["responses"][400]["content"]["application/json"]
  | operations["updateAutomateProject"]["responses"][401]["content"]["application/json"]
  | operations["updateAutomateProject"]["responses"][404]["content"]["application/json"]
  | operations["updateAutomateProject"]["responses"][422]["content"]["application/json"]
  | operations["updateAutomateProject"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAutomateProjectError = HttpError<
  | operations["deleteAutomateProject"]["responses"][400]["content"]["application/json"]
  | operations["deleteAutomateProject"]["responses"][401]["content"]["application/json"]
  | operations["deleteAutomateProject"]["responses"][404]["content"]["application/json"]
  | operations["deleteAutomateProject"]["responses"][422]["content"]["application/json"]
  | operations["deleteAutomateProject"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionSeleniumLogsError = HttpError<
  | operations["getAutomateSessionSeleniumLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSessionSeleniumLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSessionSeleniumLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSessionSeleniumLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSessionSeleniumLogs"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateMediaFilesError = HttpError<
  | operations["getAutomateMediaFiles"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateMediaFiles"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateMediaFiles"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateMediaFiles"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateMediaFiles"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateProjectsError = HttpError<
  | operations["getAutomateProjects"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateProjects"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateProjects"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateProjects"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateProjects"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionConsoleLogsError = HttpError<
  | operations["getAutomateSessionConsoleLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSessionConsoleLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSessionConsoleLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSessionConsoleLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSessionConsoleLogs"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionTelemetryLogsError = HttpError<
  | operations["getAutomateSessionTelemetryLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSessionTelemetryLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSessionTelemetryLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSessionTelemetryLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSessionTelemetryLogs"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateBuildsError = HttpError<
  | operations["getAutomateBuilds"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateBuilds"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateBuilds"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateBuilds"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateBuilds"]["responses"][500]["content"]["application/json"]
>;

export type GetAutomateSessionNetworkLogsError = HttpError<
  | operations["getAutomateSessionNetworkLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAutomateSessionNetworkLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAutomateSessionNetworkLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAutomateSessionNetworkLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAutomateSessionNetworkLogs"]["responses"][500]["content"]["application/json"]
>;

export abstract class GeneratedAutomateClient extends APIClient<paths> {
getAutomateBrowsers(options?: APIFetchOptions<operations["getAutomateBrowsers"]>): Promise<operations["getAutomateBrowsers"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAutomateBrowsers",
      method: "GET",
      path: "/automate/browsers.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomateBrowsers"]["responses"][200]["content"]["application/json"]>;
  }

getAutomatePlan(options?: APIFetchOptions<operations["getAutomatePlan"]>): Promise<operations["getAutomatePlan"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAutomatePlan",
      method: "GET",
      path: "/automate/plan.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomatePlan"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionAppiumLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionAppiumLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getAutomateSessionAppiumLogs",
      method: "GET",
      path: "/automate/sessions/{sessionId}/appiumlogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

getAutomateProjectBadgeKey(projectId: string, options?: APIFetchOptions<operations["getAutomateProjectBadgeKey"]>): Promise<string> {
    return this.execute({
      operationId: "getAutomateProjectBadgeKey",
      method: "GET",
      path: "/automate/projects/{projectId}/badge_key",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

deleteAutomateBuilds(options?: APIFetchOptions<operations["deleteAutomateBuilds"]>): Promise<operations["deleteAutomateBuilds"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAutomateBuilds",
      method: "DELETE",
      path: "/automate/builds",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAutomateBuilds"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSession(sessionId: string, options?: APIFetchOptions<operations["getAutomateSession"]>): Promise<operations["getAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]> {
    return this.execute({
      operationId: "getAutomateSession",
      method: "GET",
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.automation_session"},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]>;
  }

updateAutomateSession(sessionId: string, body: operations["updateAutomateSession"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAutomateSession"]>): Promise<operations["updateAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]> {
    return this.execute({
      operationId: "updateAutomateSession",
      method: "PUT",
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.automation_session"},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["updateAutomateSession"]["responses"][200]["content"]["application/json"]["automation_session"]>;
  }

deleteAutomateSession(sessionId: string, options?: APIFetchOptions<operations["deleteAutomateSession"]>): Promise<operations["deleteAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAutomateSession",
      method: "DELETE",
      path: "/automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateSessions(options?: APIFetchOptions<operations["deleteAutomateSessions"]>): Promise<operations["deleteAutomateSessions"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAutomateSessions",
      method: "DELETE",
      path: "/automate/sessions",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAutomateSessions"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateMediaFile(mediaId: string, options?: APIFetchOptions<operations["deleteAutomateMediaFile"]>): Promise<operations["deleteAutomateMediaFile"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAutomateMediaFile",
      method: "DELETE",
      path: "/automate/custom_media/delete/{mediaId}",
      params: { path: { mediaId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAutomateMediaFile"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateBuild(buildId: string, options?: APIFetchOptions<operations["getAutomateBuild"]>): Promise<operations["getAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAutomateBuild",
      method: "GET",
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-compose",
      responseCodecConfig: {"base":"$.build.automation_build","merge":{"sessions":"$.build.sessions[*].automation_session"}},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

updateAutomateBuild(buildId: string, body: operations["updateAutomateBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAutomateBuild"]>): Promise<operations["updateAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "updateAutomateBuild",
      method: "PUT",
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["updateAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateBuild(buildId: string, options?: APIFetchOptions<operations["deleteAutomateBuild"]>): Promise<operations["deleteAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAutomateBuild",
      method: "DELETE",
      path: "/automate/builds/{buildId}.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getAutomateSessionLogs",
      method: "GET",
      path: "/automate/sessions/{sessionId}/logs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

recycleAutomateKey(body: operations["recycleAutomateKey"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["recycleAutomateKey"]>): Promise<operations["recycleAutomateKey"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "recycleAutomateKey",
      method: "PUT",
      path: "/automate/recycle_key.json",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["recycleAutomateKey"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessions(buildId: string, options?: APIFetchOptions<operations["getAutomateSessions"]>): Promise<Array<operations["getAutomateSessions"]["responses"][200]["content"]["application/json"][number]["automation_session"]>> {
    return this.execute({
      operationId: "getAutomateSessions",
      method: "GET",
      path: "/automate/builds/{buildId}/sessions.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$[*].automation_session"},
      baseUrl: "sdk",
      ...options,
    }) as Promise<Array<operations["getAutomateSessions"]["responses"][200]["content"]["application/json"][number]["automation_session"]>>;
  }

getAutomateProject(projectId: string, options?: APIFetchOptions<operations["getAutomateProject"]>): Promise<operations["getAutomateProject"]["responses"][200]["content"]["application/json"]["project"]> {
    return this.execute({
      operationId: "getAutomateProject",
      method: "GET",
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomateProject"]["responses"][200]["content"]["application/json"]["project"]>;
  }

updateAutomateProject(projectId: string, body: operations["updateAutomateProject"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAutomateProject"]>): Promise<operations["updateAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "updateAutomateProject",
      method: "PUT",
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["updateAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

deleteAutomateProject(projectId: string, options?: APIFetchOptions<operations["deleteAutomateProject"]>): Promise<operations["deleteAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAutomateProject",
      method: "DELETE",
      path: "/automate/projects/{projectId}.json",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionSeleniumLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionSeleniumLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getAutomateSessionSeleniumLogs",
      method: "GET",
      path: "/automate/sessions/{sessionId}/seleniumlogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

getAutomateMediaFiles(options?: APIFetchOptions<operations["getAutomateMediaFiles"]>): Promise<operations["getAutomateMediaFiles"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAutomateMediaFiles",
      method: "GET",
      path: "/automate/recent_media_files",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomateMediaFiles"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateProjects(options?: APIFetchOptions<operations["getAutomateProjects"]>): Promise<operations["getAutomateProjects"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAutomateProjects",
      method: "GET",
      path: "/automate/projects.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomateProjects"]["responses"][200]["content"]["application/json"]>;
  }

getAutomateSessionConsoleLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionConsoleLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getAutomateSessionConsoleLogs",
      method: "GET",
      path: "/automate/sessions/{sessionId}/consolelogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

getAutomateSessionTelemetryLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionTelemetryLogs"]>): Promise<ArrayBuffer> {
    return this.execute({
      operationId: "getAutomateSessionTelemetryLogs",
      method: "GET",
      path: "/automate/sessions/{sessionId}/telemetrylogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "binary",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<ArrayBuffer>;
  }

getAutomateBuilds(options?: APIFetchOptions<operations["getAutomateBuilds"]>): Promise<Array<operations["getAutomateBuilds"]["responses"][200]["content"]["application/json"][number]["automation_build"]>> {
    return this.execute({
      operationId: "getAutomateBuilds",
      method: "GET",
      path: "/automate/builds.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$[*].automation_build"},
      baseUrl: "sdk",
      ...options,
    }) as Promise<Array<operations["getAutomateBuilds"]["responses"][200]["content"]["application/json"][number]["automation_build"]>>;
  }

getAutomateSessionNetworkLogs(sessionId: string, options?: APIFetchOptions<operations["getAutomateSessionNetworkLogs"]>): Promise<operations["getAutomateSessionNetworkLogs"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAutomateSessionNetworkLogs",
      method: "GET",
      path: "/automate/sessions/{sessionId}/networklogs",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAutomateSessionNetworkLogs"]["responses"][200]["content"]["application/json"]>;
  }
}
