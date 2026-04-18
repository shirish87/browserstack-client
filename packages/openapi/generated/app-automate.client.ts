/* AUTO-GENERATED — do not edit */
import type { operations, components, paths } from "./app-automate";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

export type GetAppAutomateBuildError = HttpError<
  | operations["getAppAutomateBuild"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateBuild"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateBuild"]["responses"][403]["content"]["application/json"]
  | operations["getAppAutomateBuild"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateBuild"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateBuild"]["responses"][500]["content"]["application/json"]
>;

export type UpdateAppAutomateBuildError = HttpError<
  | operations["updateAppAutomateBuild"]["responses"][400]["content"]["application/json"]
  | operations["updateAppAutomateBuild"]["responses"][401]["content"]["application/json"]
  | operations["updateAppAutomateBuild"]["responses"][404]["content"]["application/json"]
  | operations["updateAppAutomateBuild"]["responses"][422]["content"]["application/json"]
  | operations["updateAppAutomateBuild"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateBuildError = HttpError<
  | operations["deleteAppAutomateBuild"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateBuild"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateBuild"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateBuild"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateBuild"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateMediaFilesByCustomIdError = HttpError<
  | operations["getAppAutomateMediaFilesByCustomId"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateMediaFilesByCustomId"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateMediaFilesByCustomId"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateMediaFilesByCustomId"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateMediaFilesByCustomId"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateSessionLogsError = HttpError<
  | operations["getAppAutomateSessionLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateSessionLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateSessionLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateSessionLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateSessionLogs"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateAppsError = HttpError<
  | operations["getAppAutomateApps"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateApps"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateApps"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateApps"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateApps"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateGroupMediaFilesError = HttpError<
  | operations["getAppAutomateGroupMediaFiles"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateGroupMediaFiles"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateGroupMediaFiles"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateGroupMediaFiles"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateGroupMediaFiles"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateXCUITestAppError = HttpError<
  | operations["getAppAutomateXCUITestApp"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApp"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApp"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApp"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApp"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateXCUITestAppError = HttpError<
  | operations["deleteAppAutomateXCUITestApp"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateXCUITestApp"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateXCUITestApp"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateXCUITestApp"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateXCUITestApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateNetworkLogsError = HttpError<
  | operations["getAppAutomateNetworkLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateNetworkLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateNetworkLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateNetworkLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateNetworkLogs"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateBuildTerminalLogsError = HttpError<
  | operations["uploadAppAutomateBuildTerminalLogs"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateBuildTerminalLogs"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateBuildTerminalLogs"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateBuildTerminalLogs"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateBuildTerminalLogs"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateFlutterAndroidAppError = HttpError<
  | operations["uploadAppAutomateFlutterAndroidApp"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateFlutterAndroidApp"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateFlutterAndroidApp"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateFlutterAndroidApp"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateFlutterAndroidApp"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateDetoxAndroidAppError = HttpError<
  | operations["uploadAppAutomateDetoxAndroidApp"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidApp"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidApp"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidApp"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateXCUITestAppsError = HttpError<
  | operations["getAppAutomateXCUITestApps"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApps"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApps"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApps"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateXCUITestApps"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateSessionTerminalLogsError = HttpError<
  | operations["uploadAppAutomateSessionTerminalLogs"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateSessionTerminalLogs"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateSessionTerminalLogs"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateSessionTerminalLogs"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateSessionTerminalLogs"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomatePlanError = HttpError<
  | operations["getAppAutomatePlan"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomatePlan"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomatePlan"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomatePlan"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomatePlan"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateFlutteriOSAppError = HttpError<
  | operations["uploadAppAutomateFlutteriOSApp"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateFlutteriOSApp"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateFlutteriOSApp"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateFlutteriOSApp"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateFlutteriOSApp"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateDetoxAndroidAppClientError = HttpError<
  | operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateXCUITestAppError = HttpError<
  | operations["uploadAppAutomateXCUITestApp"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateXCUITestApp"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateXCUITestApp"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateXCUITestApp"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateXCUITestApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateProjectError = HttpError<
  | operations["getAppAutomateProject"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateProject"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateProject"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateProject"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateProject"]["responses"][500]["content"]["application/json"]
>;

export type UpdateAppAutomateProjectError = HttpError<
  | operations["updateAppAutomateProject"]["responses"][400]["content"]["application/json"]
  | operations["updateAppAutomateProject"]["responses"][401]["content"]["application/json"]
  | operations["updateAppAutomateProject"]["responses"][404]["content"]["application/json"]
  | operations["updateAppAutomateProject"]["responses"][422]["content"]["application/json"]
  | operations["updateAppAutomateProject"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateProjectError = HttpError<
  | operations["deleteAppAutomateProject"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateProject"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateProject"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateProject"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateProject"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateDevicesError = HttpError<
  | operations["getAppAutomateDevices"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateDevices"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateDevices"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateDevices"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateDevices"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateAppiumLogsError = HttpError<
  | operations["getAppAutomateAppiumLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateAppiumLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateAppiumLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateAppiumLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateAppiumLogs"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateAppError = HttpError<
  | operations["deleteAppAutomateApp"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateApp"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateApp"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateApp"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateFlutterAndroidAppError = HttpError<
  | operations["getAppAutomateFlutterAndroidApp"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApp"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApp"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApp"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApp"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateFlutterAndroidAppError = HttpError<
  | operations["deleteAppAutomateFlutterAndroidApp"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateFlutterAndroidApp"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateFlutterAndroidApp"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateFlutterAndroidApp"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateFlutterAndroidApp"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateMediaFileError = HttpError<
  | operations["uploadAppAutomateMediaFile"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateMediaFile"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateMediaFile"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateMediaFile"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateMediaFile"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateEspressoAppsError = HttpError<
  | operations["getAppAutomateEspressoApps"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateEspressoApps"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateEspressoApps"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateEspressoApps"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateEspressoApps"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateAppProfilingDataV2Error = HttpError<
  | operations["getAppAutomateAppProfilingDataV2"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV2"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV2"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV2"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV2"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateSessionError = HttpError<
  | operations["getAppAutomateSession"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateSession"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateSession"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateSession"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateSession"]["responses"][500]["content"]["application/json"]
>;

export type UpdateAppAutomateSessionError = HttpError<
  | operations["updateAppAutomateSession"]["responses"][400]["content"]["application/json"]
  | operations["updateAppAutomateSession"]["responses"][401]["content"]["application/json"]
  | operations["updateAppAutomateSession"]["responses"][404]["content"]["application/json"]
  | operations["updateAppAutomateSession"]["responses"][422]["content"]["application/json"]
  | operations["updateAppAutomateSession"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateSessionError = HttpError<
  | operations["deleteAppAutomateSession"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateSession"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateSession"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateSession"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateSession"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateProjectsError = HttpError<
  | operations["getAppAutomateProjects"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateProjects"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateProjects"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateProjects"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateProjects"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateMediaFileError = HttpError<
  | operations["deleteAppAutomateMediaFile"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateMediaFile"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateMediaFile"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateMediaFile"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateMediaFile"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateEspressoAppError = HttpError<
  | operations["getAppAutomateEspressoApp"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateEspressoApp"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateEspressoApp"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateEspressoApp"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateEspressoApp"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateEspressoAppError = HttpError<
  | operations["deleteAppAutomateEspressoApp"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateEspressoApp"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateEspressoApp"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateEspressoApp"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateEspressoApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateMediaFilesError = HttpError<
  | operations["getAppAutomateMediaFiles"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateMediaFiles"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateMediaFiles"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateMediaFiles"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateMediaFiles"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateFlutteriOSAppsError = HttpError<
  | operations["getAppAutomateFlutteriOSApps"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApps"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApps"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApps"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApps"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateAppError = HttpError<
  | operations["uploadAppAutomateApp"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateApp"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateApp"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateApp"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateGroupAppsError = HttpError<
  | operations["getAppAutomateGroupApps"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateGroupApps"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateGroupApps"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateGroupApps"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateGroupApps"]["responses"][500]["content"]["application/json"]
>;

export type UploadAppAutomateEspressoAppError = HttpError<
  | operations["uploadAppAutomateEspressoApp"]["responses"][400]["content"]["application/json"]
  | operations["uploadAppAutomateEspressoApp"]["responses"][401]["content"]["application/json"]
  | operations["uploadAppAutomateEspressoApp"]["responses"][404]["content"]["application/json"]
  | operations["uploadAppAutomateEspressoApp"]["responses"][422]["content"]["application/json"]
  | operations["uploadAppAutomateEspressoApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateAppsByCustomIdError = HttpError<
  | operations["getAppAutomateAppsByCustomId"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateAppsByCustomId"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateAppsByCustomId"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateAppsByCustomId"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateAppsByCustomId"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateFlutterAndroidAppsError = HttpError<
  | operations["getAppAutomateFlutterAndroidApps"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApps"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApps"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApps"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateFlutterAndroidApps"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateDeviceLogsError = HttpError<
  | operations["getAppAutomateDeviceLogs"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateDeviceLogs"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateDeviceLogs"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateDeviceLogs"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateDeviceLogs"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateAppProfilingDataV1Error = HttpError<
  | operations["getAppAutomateAppProfilingDataV1"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV1"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV1"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV1"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateAppProfilingDataV1"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateBuildsError = HttpError<
  | operations["getAppAutomateBuilds"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateBuilds"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateBuilds"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateBuilds"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateBuilds"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateFlutteriOSAppError = HttpError<
  | operations["getAppAutomateFlutteriOSApp"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApp"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApp"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApp"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateFlutteriOSApp"]["responses"][500]["content"]["application/json"]
>;

export type DeleteAppAutomateFlutteriOSAppError = HttpError<
  | operations["deleteAppAutomateFlutteriOSApp"]["responses"][400]["content"]["application/json"]
  | operations["deleteAppAutomateFlutteriOSApp"]["responses"][401]["content"]["application/json"]
  | operations["deleteAppAutomateFlutteriOSApp"]["responses"][404]["content"]["application/json"]
  | operations["deleteAppAutomateFlutteriOSApp"]["responses"][422]["content"]["application/json"]
  | operations["deleteAppAutomateFlutteriOSApp"]["responses"][500]["content"]["application/json"]
>;

export type GetAppAutomateProjectBadgeKeyError = HttpError<
  | operations["getAppAutomateProjectBadgeKey"]["responses"][400]["content"]["application/json"]
  | operations["getAppAutomateProjectBadgeKey"]["responses"][401]["content"]["application/json"]
  | operations["getAppAutomateProjectBadgeKey"]["responses"][404]["content"]["application/json"]
  | operations["getAppAutomateProjectBadgeKey"]["responses"][422]["content"]["application/json"]
  | operations["getAppAutomateProjectBadgeKey"]["responses"][500]["content"]["application/json"]
>;

export abstract class GeneratedAppAutomateClient extends APIClient<paths> {
getAppAutomateBuild(buildId: string, options?: APIFetchOptions<operations["getAppAutomateBuild"]>): Promise<operations["getAppAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateBuild",
      method: "GET",
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

updateAppAutomateBuild(buildId: string, body: operations["updateAppAutomateBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAppAutomateBuild"]>): Promise<operations["updateAppAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "updateAppAutomateBuild",
      method: "PUT",
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["updateAppAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateBuild(buildId: string, options?: APIFetchOptions<operations["deleteAppAutomateBuild"]>): Promise<operations["deleteAppAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateBuild",
      method: "DELETE",
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateMediaFilesByCustomId(customId: string, options?: APIFetchOptions<operations["getAppAutomateMediaFilesByCustomId"]>): Promise<operations["getAppAutomateMediaFilesByCustomId"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateMediaFilesByCustomId",
      method: "GET",
      path: "/app-automate/recent_media_files/{customId}",
      params: { path: { customId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateMediaFilesByCustomId"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateSessionLogs(buildId: string, sessionId: string, options?: APIFetchOptions<operations["getAppAutomateSessionLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getAppAutomateSessionLogs",
      method: "GET",
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/logs",
      params: { path: { buildId, sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

getAppAutomateApps(options?: APIFetchOptions<operations["getAppAutomateApps"]>): Promise<operations["getAppAutomateApps"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateApps",
      method: "GET",
      path: "/app-automate/recent_apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateApps"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateGroupMediaFiles(options?: APIFetchOptions<operations["getAppAutomateGroupMediaFiles"]>): Promise<operations["getAppAutomateGroupMediaFiles"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateGroupMediaFiles",
      method: "GET",
      path: "/app-automate/recent_group_media",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateGroupMediaFiles"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateXCUITestApp(appId: string, options?: APIFetchOptions<operations["getAppAutomateXCUITestApp"]>): Promise<operations["getAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateXCUITestApp",
      method: "GET",
      path: "/app-automate/xcuitest/v2/apps/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateXCUITestApp(appId: string, options?: APIFetchOptions<operations["deleteAppAutomateXCUITestApp"]>): Promise<operations["deleteAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateXCUITestApp",
      method: "DELETE",
      path: "/app-automate/xcuitest/v2/apps/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateNetworkLogs(buildId: string, sessionId: string, options?: APIFetchOptions<operations["getAppAutomateNetworkLogs"]>): Promise<operations["getAppAutomateNetworkLogs"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateNetworkLogs",
      method: "GET",
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/networklogs",
      params: { path: { buildId, sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateNetworkLogs"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateBuildTerminalLogs(buildId: string, body: operations["uploadAppAutomateBuildTerminalLogs"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateBuildTerminalLogs"]>): Promise<operations["uploadAppAutomateBuildTerminalLogs"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateBuildTerminalLogs",
      method: "POST",
      path: "/app-automate/builds/{buildId}/terminallogs",
      params: { path: { buildId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateBuildTerminalLogs"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateFlutterAndroidApp(body: operations["uploadAppAutomateFlutterAndroidApp"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateFlutterAndroidApp"]>): Promise<operations["uploadAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateFlutterAndroidApp",
      method: "POST",
      path: "/app-automate/flutter-integration-tests/v2/android/app",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateDetoxAndroidApp(body: operations["uploadAppAutomateDetoxAndroidApp"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateDetoxAndroidApp"]>): Promise<operations["uploadAppAutomateDetoxAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateDetoxAndroidApp",
      method: "POST",
      path: "/app-automate/detox/v2/android/app",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateDetoxAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateXCUITestApps(options?: APIFetchOptions<operations["getAppAutomateXCUITestApps"]>): Promise<operations["getAppAutomateXCUITestApps"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateXCUITestApps",
      method: "GET",
      path: "/app-automate/xcuitest/v2/apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateXCUITestApps"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateSessionTerminalLogs(sessionId: string, body: operations["uploadAppAutomateSessionTerminalLogs"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateSessionTerminalLogs"]>): Promise<operations["uploadAppAutomateSessionTerminalLogs"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateSessionTerminalLogs",
      method: "POST",
      path: "/app-automate/sessions/{sessionId}/terminallogs",
      params: { path: { sessionId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateSessionTerminalLogs"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomatePlan(options?: APIFetchOptions<operations["getAppAutomatePlan"]>): Promise<operations["getAppAutomatePlan"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomatePlan",
      method: "GET",
      path: "/app-automate/plan.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomatePlan"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateFlutteriOSApp(body: operations["uploadAppAutomateFlutteriOSApp"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateFlutteriOSApp"]>): Promise<operations["uploadAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateFlutteriOSApp",
      method: "POST",
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateDetoxAndroidAppClient(body: operations["uploadAppAutomateDetoxAndroidAppClient"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateDetoxAndroidAppClient"]>): Promise<operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateDetoxAndroidAppClient",
      method: "POST",
      path: "/app-automate/detox/v2/android/app-client",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateXCUITestApp(body: operations["uploadAppAutomateXCUITestApp"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateXCUITestApp"]>): Promise<operations["uploadAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateXCUITestApp",
      method: "POST",
      path: "/app-automate/xcuitest/v2/app",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateProject(projectId: string, options?: APIFetchOptions<operations["getAppAutomateProject"]>): Promise<operations["getAppAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateProject",
      method: "GET",
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

updateAppAutomateProject(projectId: string, body: operations["updateAppAutomateProject"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAppAutomateProject"]>): Promise<operations["updateAppAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "updateAppAutomateProject",
      method: "PUT",
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["updateAppAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateProject(projectId: string, options?: APIFetchOptions<operations["deleteAppAutomateProject"]>): Promise<operations["deleteAppAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateProject",
      method: "DELETE",
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateDevices(options?: APIFetchOptions<operations["getAppAutomateDevices"]>): Promise<operations["getAppAutomateDevices"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateDevices",
      method: "GET",
      path: "/app-automate/devices.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateDevices"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateAppiumLogs(buildId: string, sessionId: string, options?: APIFetchOptions<operations["getAppAutomateAppiumLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getAppAutomateAppiumLogs",
      method: "GET",
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appiumlogs",
      params: { path: { buildId, sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

deleteAppAutomateApp(appId: string, options?: APIFetchOptions<operations["deleteAppAutomateApp"]>): Promise<operations["deleteAppAutomateApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateApp",
      method: "DELETE",
      path: "/app-automate/app/delete/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutterAndroidApp(appId: string, options?: APIFetchOptions<operations["getAppAutomateFlutterAndroidApp"]>): Promise<operations["getAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateFlutterAndroidApp",
      method: "GET",
      path: "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateFlutterAndroidApp(appId: string, options?: APIFetchOptions<operations["deleteAppAutomateFlutterAndroidApp"]>): Promise<operations["deleteAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateFlutterAndroidApp",
      method: "DELETE",
      path: "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateMediaFile(body: operations["uploadAppAutomateMediaFile"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateMediaFile"]>): Promise<operations["uploadAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateMediaFile",
      method: "POST",
      path: "/app-automate/upload-media",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateEspressoApps(options?: APIFetchOptions<operations["getAppAutomateEspressoApps"]>): Promise<operations["getAppAutomateEspressoApps"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateEspressoApps",
      method: "GET",
      path: "/app-automate/espresso/v2/apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateEspressoApps"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateAppProfilingDataV2(buildId: string, sessionId: string, options?: APIFetchOptions<operations["getAppAutomateAppProfilingDataV2"]>): Promise<operations["getAppAutomateAppProfilingDataV2"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateAppProfilingDataV2",
      method: "GET",
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling/v2",
      params: { path: { buildId, sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateAppProfilingDataV2"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateSession(sessionId: string, options?: APIFetchOptions<operations["getAppAutomateSession"]>): Promise<operations["getAppAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateSession",
      method: "GET",
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

updateAppAutomateSession(sessionId: string, body: operations["updateAppAutomateSession"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateAppAutomateSession"]>): Promise<operations["updateAppAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "updateAppAutomateSession",
      method: "PUT",
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["updateAppAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateSession(sessionId: string, options?: APIFetchOptions<operations["deleteAppAutomateSession"]>): Promise<operations["deleteAppAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateSession",
      method: "DELETE",
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateProjects(options?: APIFetchOptions<operations["getAppAutomateProjects"]>): Promise<operations["getAppAutomateProjects"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateProjects",
      method: "GET",
      path: "/app-automate/projects.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateProjects"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateMediaFile(mediaId: string, options?: APIFetchOptions<operations["deleteAppAutomateMediaFile"]>): Promise<operations["deleteAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateMediaFile",
      method: "DELETE",
      path: "/app-automate/custom_media/delete/{mediaId}",
      params: { path: { mediaId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateEspressoApp(appId: string, options?: APIFetchOptions<operations["getAppAutomateEspressoApp"]>): Promise<operations["getAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateEspressoApp",
      method: "GET",
      path: "/app-automate/espresso/v2/apps/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateEspressoApp(appId: string, options?: APIFetchOptions<operations["deleteAppAutomateEspressoApp"]>): Promise<operations["deleteAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateEspressoApp",
      method: "DELETE",
      path: "/app-automate/espresso/v2/apps/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateMediaFiles(options?: APIFetchOptions<operations["getAppAutomateMediaFiles"]>): Promise<operations["getAppAutomateMediaFiles"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateMediaFiles",
      method: "GET",
      path: "/app-automate/recent_media_files",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateMediaFiles"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutteriOSApps(options?: APIFetchOptions<operations["getAppAutomateFlutteriOSApps"]>): Promise<operations["getAppAutomateFlutteriOSApps"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateFlutteriOSApps",
      method: "GET",
      path: "/app-automate/flutter-integration-tests/v2/ios/test-packages",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateFlutteriOSApps"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateApp(body: operations["uploadAppAutomateApp"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateApp"]>): Promise<operations["uploadAppAutomateApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateApp",
      method: "POST",
      path: "/app-automate/upload",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateGroupApps(options?: APIFetchOptions<operations["getAppAutomateGroupApps"]>): Promise<operations["getAppAutomateGroupApps"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateGroupApps",
      method: "GET",
      path: "/app-automate/recent_group_apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateGroupApps"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateEspressoApp(body: operations["uploadAppAutomateEspressoApp"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["uploadAppAutomateEspressoApp"]>): Promise<operations["uploadAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "uploadAppAutomateEspressoApp",
      method: "POST",
      path: "/app-automate/espresso/v2/app",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["uploadAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateAppsByCustomId(customId: string, options?: APIFetchOptions<operations["getAppAutomateAppsByCustomId"]>): Promise<operations["getAppAutomateAppsByCustomId"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateAppsByCustomId",
      method: "GET",
      path: "/app-automate/recent_apps/{customId}",
      params: { path: { customId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateAppsByCustomId"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutterAndroidApps(options?: APIFetchOptions<operations["getAppAutomateFlutterAndroidApps"]>): Promise<operations["getAppAutomateFlutterAndroidApps"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateFlutterAndroidApps",
      method: "GET",
      path: "/app-automate/flutter-integration-tests/v2/android/apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateFlutterAndroidApps"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateDeviceLogs(buildId: string, sessionId: string, options?: APIFetchOptions<operations["getAppAutomateDeviceLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getAppAutomateDeviceLogs",
      method: "GET",
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/devicelogs",
      params: { path: { buildId, sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }

getAppAutomateAppProfilingDataV1(buildId: string, sessionId: string, options?: APIFetchOptions<operations["getAppAutomateAppProfilingDataV1"]>): Promise<operations["getAppAutomateAppProfilingDataV1"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateAppProfilingDataV1",
      method: "GET",
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling",
      params: { path: { buildId, sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateAppProfilingDataV1"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateBuilds(options?: APIFetchOptions<operations["getAppAutomateBuilds"]>): Promise<operations["getAppAutomateBuilds"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateBuilds",
      method: "GET",
      path: "/app-automate/builds.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateBuilds"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutteriOSApp(appId: string, options?: APIFetchOptions<operations["getAppAutomateFlutteriOSApp"]>): Promise<operations["getAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getAppAutomateFlutteriOSApp",
      method: "GET",
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateFlutteriOSApp(appId: string, options?: APIFetchOptions<operations["deleteAppAutomateFlutteriOSApp"]>): Promise<operations["deleteAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteAppAutomateFlutteriOSApp",
      method: "DELETE",
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      params: { path: { appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateProjectBadgeKey(projectId: string, options?: APIFetchOptions<operations["getAppAutomateProjectBadgeKey"]>): Promise<string> {
    return this.execute({
      operationId: "getAppAutomateProjectBadgeKey",
      method: "GET",
      path: "/app-automate/projects/{projectId}/badge_key",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }
}
