/* AUTO-GENERATED — do not edit */
import type { operations } from "./app-automate";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";

export type GetAppAutomateBuildError = HttpError<
  | (operations["getAppAutomateBuild"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuild"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuild"]["responses"][403] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuild"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuild"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuild"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateAppAutomateBuildError = HttpError<
  | (operations["updateAppAutomateBuild"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateBuild"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateBuild"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateBuild"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateBuild"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateBuildError = HttpError<
  | (operations["deleteAppAutomateBuild"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateBuild"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateBuild"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateBuild"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateBuild"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateMediaFilesByCustomIdError = HttpError<
  | (operations["getAppAutomateMediaFilesByCustomId"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFilesByCustomId"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFilesByCustomId"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFilesByCustomId"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFilesByCustomId"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateSessionLogsError = HttpError<
  | (operations["getAppAutomateSessionLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSessionLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSessionLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSessionLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSessionLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateAppsError = HttpError<
  | (operations["getAppAutomateApps"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateApps"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateApps"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateApps"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateApps"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateGroupMediaFilesError = HttpError<
  | (operations["getAppAutomateGroupMediaFiles"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupMediaFiles"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupMediaFiles"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupMediaFiles"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupMediaFiles"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateXCUITestAppError = HttpError<
  | (operations["getAppAutomateXCUITestApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateXCUITestAppError = HttpError<
  | (operations["deleteAppAutomateXCUITestApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateXCUITestApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateXCUITestApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateXCUITestApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateXCUITestApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateNetworkLogsError = HttpError<
  | (operations["getAppAutomateNetworkLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateNetworkLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateNetworkLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateNetworkLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateNetworkLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateBuildTerminalLogsError = HttpError<
  | (operations["uploadAppAutomateBuildTerminalLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateBuildTerminalLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateBuildTerminalLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateBuildTerminalLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateBuildTerminalLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateFlutterAndroidAppError = HttpError<
  | (operations["uploadAppAutomateFlutterAndroidApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutterAndroidApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutterAndroidApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutterAndroidApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutterAndroidApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateDetoxAndroidAppError = HttpError<
  | (operations["uploadAppAutomateDetoxAndroidApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateXCUITestAppsError = HttpError<
  | (operations["getAppAutomateXCUITestApps"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApps"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApps"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApps"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateXCUITestApps"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateSessionTerminalLogsError = HttpError<
  | (operations["uploadAppAutomateSessionTerminalLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateSessionTerminalLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateSessionTerminalLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateSessionTerminalLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateSessionTerminalLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomatePlanError = HttpError<
  | (operations["getAppAutomatePlan"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomatePlan"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomatePlan"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomatePlan"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomatePlan"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateFlutteriOSAppError = HttpError<
  | (operations["uploadAppAutomateFlutteriOSApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutteriOSApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutteriOSApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutteriOSApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateFlutteriOSApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateDetoxAndroidAppClientError = HttpError<
  | (operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateXCUITestAppError = HttpError<
  | (operations["uploadAppAutomateXCUITestApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateXCUITestApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateXCUITestApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateXCUITestApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateXCUITestApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateProjectError = HttpError<
  | (operations["getAppAutomateProject"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProject"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProject"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateAppAutomateProjectError = HttpError<
  | (operations["updateAppAutomateProject"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateProject"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateProject"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateProjectError = HttpError<
  | (operations["deleteAppAutomateProject"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateProject"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateProject"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateDevicesError = HttpError<
  | (operations["getAppAutomateDevices"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDevices"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDevices"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDevices"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDevices"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateAppiumLogsError = HttpError<
  | (operations["getAppAutomateAppiumLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppiumLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppiumLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppiumLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppiumLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateAppError = HttpError<
  | (operations["deleteAppAutomateApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateFlutterAndroidAppError = HttpError<
  | (operations["getAppAutomateFlutterAndroidApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateFlutterAndroidAppError = HttpError<
  | (operations["deleteAppAutomateFlutterAndroidApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutterAndroidApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutterAndroidApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutterAndroidApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutterAndroidApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateMediaFileError = HttpError<
  | (operations["uploadAppAutomateMediaFile"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateMediaFile"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateMediaFile"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateMediaFile"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateMediaFile"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateEspressoAppsError = HttpError<
  | (operations["getAppAutomateEspressoApps"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApps"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApps"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApps"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApps"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateAppProfilingDataV2Error = HttpError<
  | (operations["getAppAutomateAppProfilingDataV2"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV2"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV2"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV2"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV2"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateSessionError = HttpError<
  | (operations["getAppAutomateSession"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSession"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSession"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSession"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateSession"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateAppAutomateSessionError = HttpError<
  | (operations["updateAppAutomateSession"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateSession"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateSession"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateSession"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateAppAutomateSession"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateSessionError = HttpError<
  | (operations["deleteAppAutomateSession"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateSession"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateSession"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateSession"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateSession"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateProjectsError = HttpError<
  | (operations["getAppAutomateProjects"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjects"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjects"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjects"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjects"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateMediaFileError = HttpError<
  | (operations["deleteAppAutomateMediaFile"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateMediaFile"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateMediaFile"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateMediaFile"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateMediaFile"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateEspressoAppError = HttpError<
  | (operations["getAppAutomateEspressoApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateEspressoApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateEspressoAppError = HttpError<
  | (operations["deleteAppAutomateEspressoApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateEspressoApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateEspressoApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateEspressoApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateEspressoApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateMediaFilesError = HttpError<
  | (operations["getAppAutomateMediaFiles"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFiles"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFiles"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFiles"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateMediaFiles"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateFlutteriOSAppsError = HttpError<
  | (operations["getAppAutomateFlutteriOSApps"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApps"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApps"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApps"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApps"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UploadAppAutomateAppError = HttpError<
  | (operations["uploadAppAutomateApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["uploadAppAutomateApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateGroupAppsError = HttpError<
  | (operations["getAppAutomateGroupApps"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupApps"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupApps"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupApps"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateGroupApps"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateAppsByCustomIdError = HttpError<
  | (operations["getAppAutomateAppsByCustomId"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppsByCustomId"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppsByCustomId"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppsByCustomId"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppsByCustomId"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateFlutterAndroidAppsError = HttpError<
  | (operations["getAppAutomateFlutterAndroidApps"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApps"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApps"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApps"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutterAndroidApps"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateDeviceLogsError = HttpError<
  | (operations["getAppAutomateDeviceLogs"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDeviceLogs"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDeviceLogs"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDeviceLogs"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateDeviceLogs"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateAppProfilingDataV1Error = HttpError<
  | (operations["getAppAutomateAppProfilingDataV1"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV1"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV1"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV1"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateAppProfilingDataV1"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateBuildsError = HttpError<
  | (operations["getAppAutomateBuilds"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuilds"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuilds"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuilds"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateBuilds"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateFlutteriOSAppError = HttpError<
  | (operations["getAppAutomateFlutteriOSApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateFlutteriOSApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteAppAutomateFlutteriOSAppError = HttpError<
  | (operations["deleteAppAutomateFlutteriOSApp"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutteriOSApp"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutteriOSApp"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutteriOSApp"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteAppAutomateFlutteriOSApp"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetAppAutomateProjectBadgeKeyError = HttpError<
  | (operations["getAppAutomateProjectBadgeKey"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjectBadgeKey"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjectBadgeKey"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjectBadgeKey"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getAppAutomateProjectBadgeKey"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export abstract class GeneratedAppAutomateClient extends APIClient {
getAppAutomateBuild(buildId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId: buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateBuild",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

updateAppAutomateBuild(buildId: string, body: operations["updateAppAutomateBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: ExecuteOptions): Promise<operations["updateAppAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId: buildId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateAppAutomateBuild",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["updateAppAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateBuild(buildId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateBuild"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}.json",
      params: { path: { buildId: buildId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateBuild",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateBuild"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateMediaFilesByCustomId(customId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateMediaFilesByCustomId"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/recent_media_files/{customId}",
      params: { path: { customId: customId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateMediaFilesByCustomId",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateMediaFilesByCustomId"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateSessionLogs(buildId: string, sessionId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/logs",
      params: { path: { buildId: buildId, sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateSessionLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

getAppAutomateApps(options?: ExecuteOptions): Promise<operations["getAppAutomateApps"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/recent_apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateApps",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateApps"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateGroupMediaFiles(options?: ExecuteOptions): Promise<operations["getAppAutomateGroupMediaFiles"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/recent_group_media",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateGroupMediaFiles",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateGroupMediaFiles"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateXCUITestApp(appId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/xcuitest/v2/apps/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateXCUITestApp",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateXCUITestApp(appId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/xcuitest/v2/apps/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateXCUITestApp",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateNetworkLogs(buildId: string, sessionId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateNetworkLogs"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/networklogs",
      params: { path: { buildId: buildId, sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateNetworkLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateNetworkLogs"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateBuildTerminalLogs(buildId: string, body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateBuildTerminalLogs"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}/terminallogs",
      params: { path: { buildId: buildId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateBuildTerminalLogs",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateBuildTerminalLogs"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateFlutterAndroidApp(body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/app",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateFlutterAndroidApp",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateDetoxAndroidApp(body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateDetoxAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/detox/v2/android/app",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateDetoxAndroidApp",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateDetoxAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateXCUITestApps(options?: ExecuteOptions): Promise<operations["getAppAutomateXCUITestApps"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/xcuitest/v2/apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateXCUITestApps",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateXCUITestApps"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateSessionTerminalLogs(sessionId: string, body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateSessionTerminalLogs"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/sessions/{sessionId}/terminallogs",
      params: { path: { sessionId: sessionId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateSessionTerminalLogs",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateSessionTerminalLogs"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomatePlan(options?: ExecuteOptions): Promise<operations["getAppAutomatePlan"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/plan.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomatePlan",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomatePlan"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateFlutteriOSApp(body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateFlutteriOSApp",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateDetoxAndroidAppClient(body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/detox/v2/android/app-client",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateDetoxAndroidAppClient",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateDetoxAndroidAppClient"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateXCUITestApp(body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/xcuitest/v2/app",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateXCUITestApp",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateXCUITestApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateProject(projectId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId: projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateProject",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

updateAppAutomateProject(projectId: string, body: operations["updateAppAutomateProject"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: ExecuteOptions): Promise<operations["updateAppAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateAppAutomateProject",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["updateAppAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateProject(projectId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateProject"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/projects/{projectId}.json",
      params: { path: { projectId: projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateProject",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateProject"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateDevices(options?: ExecuteOptions): Promise<operations["getAppAutomateDevices"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/devices.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateDevices",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateDevices"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateAppiumLogs(buildId: string, sessionId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appiumlogs",
      params: { path: { buildId: buildId, sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateAppiumLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

deleteAppAutomateApp(appId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/app/delete/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateApp",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutterAndroidApp(appId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateFlutterAndroidApp",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateFlutterAndroidApp(appId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateFlutterAndroidApp",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateFlutterAndroidApp"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateMediaFile(body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/upload-media",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateMediaFile",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateEspressoApps(options?: ExecuteOptions): Promise<operations["getAppAutomateEspressoApps"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/espresso/v2/apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateEspressoApps",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateEspressoApps"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateAppProfilingDataV2(buildId: string, sessionId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateAppProfilingDataV2"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling/v2",
      params: { path: { buildId: buildId, sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateAppProfilingDataV2",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateAppProfilingDataV2"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateSession(sessionId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateSession",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

updateAppAutomateSession(sessionId: string, body: operations["updateAppAutomateSession"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: ExecuteOptions): Promise<operations["updateAppAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId: sessionId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateAppAutomateSession",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["updateAppAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateSession(sessionId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateSession"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/sessions/{sessionId}.json",
      params: { path: { sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateSession",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateSession"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateProjects(options?: ExecuteOptions): Promise<operations["getAppAutomateProjects"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/projects.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateProjects",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateProjects"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateMediaFile(mediaId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/custom_media/delete/{mediaId}",
      params: { path: { mediaId: mediaId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateMediaFile",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateMediaFile"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateEspressoApp(appId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/espresso/v2/apps/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateEspressoApp",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateEspressoApp(appId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/espresso/v2/apps/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateEspressoApp",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateEspressoApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateMediaFiles(options?: ExecuteOptions): Promise<operations["getAppAutomateMediaFiles"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/recent_media_files",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateMediaFiles",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateMediaFiles"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutteriOSApps(options?: ExecuteOptions): Promise<operations["getAppAutomateFlutteriOSApps"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-packages",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateFlutteriOSApps",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateFlutteriOSApps"]["responses"][200]["content"]["application/json"]>;
  }

uploadAppAutomateApp(body: { file: Blob; fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<operations["uploadAppAutomateApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/upload",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadAppAutomateApp",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["uploadAppAutomateApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateGroupApps(options?: ExecuteOptions): Promise<operations["getAppAutomateGroupApps"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/recent_group_apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateGroupApps",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateGroupApps"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateAppsByCustomId(customId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateAppsByCustomId"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/recent_apps/{customId}",
      params: { path: { customId: customId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateAppsByCustomId",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateAppsByCustomId"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutterAndroidApps(options?: ExecuteOptions): Promise<operations["getAppAutomateFlutterAndroidApps"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/android/apps",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateFlutterAndroidApps",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateFlutterAndroidApps"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateDeviceLogs(buildId: string, sessionId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/devicelogs",
      params: { path: { buildId: buildId, sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateDeviceLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }

getAppAutomateAppProfilingDataV1(buildId: string, sessionId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateAppProfilingDataV1"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling",
      params: { path: { buildId: buildId, sessionId: sessionId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateAppProfilingDataV1",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateAppProfilingDataV1"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateBuilds(options?: ExecuteOptions): Promise<operations["getAppAutomateBuilds"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/builds.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateBuilds",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateBuilds"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateFlutteriOSApp(appId: string, options?: ExecuteOptions): Promise<operations["getAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateFlutteriOSApp",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]>;
  }

deleteAppAutomateFlutteriOSApp(appId: string, options?: ExecuteOptions): Promise<operations["deleteAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      params: { path: { appId: appId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteAppAutomateFlutteriOSApp",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteAppAutomateFlutteriOSApp"]["responses"][200]["content"]["application/json"]>;
  }

getAppAutomateProjectBadgeKey(projectId: string, options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/app-automate/projects/{projectId}/badge_key",
      params: { path: { projectId: projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getAppAutomateProjectBadgeKey",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }
}
