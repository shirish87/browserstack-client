/**
 * Generated CLI schemas. Do not modify.
 */

import { z } from "zod";
import * as Constants from "./constants.generated";

export namespace AutomateSchemas {
  export const ListBrowsersArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const GetPlanArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListSessionAppiumLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const GetProjectBadgeKeyArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const UploadSessionTerminalLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const DeleteBuildsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      "buildId[]": z.array(z.string()),
    }).optional(),
  });
  export const GetSessionArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UpdateSessionArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.any(),
  });
  export const DeleteSessionArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const DeleteSessionsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      "sessionId[]": z.array(z.string()),
    }).optional(),
  });
  export const DeleteMediaFileArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const GetBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UpdateBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ name: z.string().optional(), build_tag: z.string().optional() }),
  });
  export const DeleteBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListSessionLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UploadMediaFileArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const RecycleKeyArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.object({  }).optional(),
  });
  export const ListSessionsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      status: z.string().optional(),
    }).optional(),
  });
  export const GetProjectArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const UpdateProjectArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
    body: z.object({ name: z.string() }),
  });
  export const DeleteProjectArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const ListSessionSeleniumLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UploadBuildTerminalLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListMediaFilesArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListProjectsArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListSessionConsoleLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListSessionTelemetryLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListBuildsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      projectId: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      status: z.string().optional(),
    }).optional(),
  });
  export const ListSessionNetworkLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.Automate.Action.ListBrowsers]: {
      schema: ListBrowsersArgs,
      call: (client, _data) => client.getBrowsers()
    },
    [Constants.Automate.Action.GetPlan]: {
      schema: GetPlanArgs,
      call: (client, _data) => client.getPlan()
    },
    [Constants.Automate.Action.ListSessionAppiumLogs]: {
      schema: ListSessionAppiumLogsArgs,
      call: (client, data) => client.getSessionAppiumLogs(data.positional[0])
    },
    [Constants.Automate.Action.GetProjectBadgeKey]: {
      schema: GetProjectBadgeKeyArgs,
      call: (client, data) => client.getProjectBadgeKey(data.positional[0])
    },
    [Constants.Automate.Action.UploadSessionTerminalLogs]: {
      schema: UploadSessionTerminalLogsArgs,
      call: (client, data) => client.uploadSessionTerminalLogs(data.positional[0], data.body)
    },
    [Constants.Automate.Action.DeleteBuilds]: {
      schema: DeleteBuildsArgs,
      call: (client, data) => client.deleteBuilds(data.options?.["buildId[]"])
    },
    [Constants.Automate.Action.GetSession]: {
      schema: GetSessionArgs,
      call: (client, data) => client.getSession(data.positional[0])
    },
    [Constants.Automate.Action.UpdateSession]: {
      schema: UpdateSessionArgs,
      call: (client, data) => client.updateSession(data.positional[0], data.body)
    },
    [Constants.Automate.Action.DeleteSession]: {
      schema: DeleteSessionArgs,
      call: (client, data) => client.deleteSession(data.positional[0])
    },
    [Constants.Automate.Action.DeleteSessions]: {
      schema: DeleteSessionsArgs,
      call: (client, data) => client.deleteSessions(data.options?.["sessionId[]"])
    },
    [Constants.Automate.Action.DeleteMediaFile]: {
      schema: DeleteMediaFileArgs,
      call: (client, data) => client.deleteMediaFile(data.positional[0])
    },
    [Constants.Automate.Action.GetBuild]: {
      schema: GetBuildArgs,
      call: (client, data) => client.getBuild(data.positional[0])
    },
    [Constants.Automate.Action.UpdateBuild]: {
      schema: UpdateBuildArgs,
      call: (client, data) => client.updateBuild(data.positional[0], data.body)
    },
    [Constants.Automate.Action.DeleteBuild]: {
      schema: DeleteBuildArgs,
      call: (client, data) => client.deleteBuild(data.positional[0])
    },
    [Constants.Automate.Action.ListSessionLogs]: {
      schema: ListSessionLogsArgs,
      call: (client, data) => client.getSessionLogs(data.positional[0])
    },
    [Constants.Automate.Action.UploadMediaFile]: {
      schema: UploadMediaFileArgs,
      call: (client, data) => client.uploadMediaFile(data.body)
    },
    [Constants.Automate.Action.RecycleKey]: {
      schema: RecycleKeyArgs,
      call: (client, data) => client.recycleKey(data.body)
    },
    [Constants.Automate.Action.ListSessions]: {
      schema: ListSessionsArgs,
      call: (client, data) => client.getSessions(data.positional[0], data.options?.["limit"], data.options?.["offset"], data.options?.["status"])
    },
    [Constants.Automate.Action.GetProject]: {
      schema: GetProjectArgs,
      call: (client, data) => client.getProject(data.positional[0])
    },
    [Constants.Automate.Action.UpdateProject]: {
      schema: UpdateProjectArgs,
      call: (client, data) => client.updateProject(data.positional[0], data.body)
    },
    [Constants.Automate.Action.DeleteProject]: {
      schema: DeleteProjectArgs,
      call: (client, data) => client.deleteProject(data.positional[0])
    },
    [Constants.Automate.Action.ListSessionSeleniumLogs]: {
      schema: ListSessionSeleniumLogsArgs,
      call: (client, data) => client.getSessionSeleniumLogs(data.positional[0])
    },
    [Constants.Automate.Action.UploadBuildTerminalLogs]: {
      schema: UploadBuildTerminalLogsArgs,
      call: (client, data) => client.uploadBuildTerminalLogs(data.positional[0], data.body)
    },
    [Constants.Automate.Action.ListMediaFiles]: {
      schema: ListMediaFilesArgs,
      call: (client, _data) => client.getMediaFiles()
    },
    [Constants.Automate.Action.ListProjects]: {
      schema: ListProjectsArgs,
      call: (client, _data) => client.getProjects()
    },
    [Constants.Automate.Action.ListSessionConsoleLogs]: {
      schema: ListSessionConsoleLogsArgs,
      call: (client, data) => client.getSessionConsoleLogs(data.positional[0])
    },
    [Constants.Automate.Action.ListSessionTelemetryLogs]: {
      schema: ListSessionTelemetryLogsArgs,
      call: (client, data) => client.getSessionTelemetryLogs(data.positional[0])
    },
    [Constants.Automate.Action.ListBuilds]: {
      schema: ListBuildsArgs,
      call: (client, data) => client.getBuilds(data.options?.["projectId"], data.options?.["limit"], data.options?.["offset"], data.options?.["status"])
    },
    [Constants.Automate.Action.ListSessionNetworkLogs]: {
      schema: ListSessionNetworkLogsArgs,
      call: (client, data) => client.getSessionNetworkLogs(data.positional[0])
    },
  };
}

export namespace AppAutomateSchemas {
  export const GetBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UpdateBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ build_tag: z.string() }),
  });
  export const DeleteBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const GetMediaFilesByCustomIdArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListSessionLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const ListAppsArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListGroupMediaFilesArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const GetXcuiTestAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const DeleteXcuiTestAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListNetworkLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const UploadBuildTerminalLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UploadFlutterAndroidAppArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const UploadDetoxAndroidAppArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListXcuiTestAppsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      scope: z.string().optional(),
      custom_id: z.string().optional(),
      limit: z.coerce.number().optional(),
    }).optional(),
  });
  export const UploadSessionTerminalLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const GetPlanArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const UploadFlutteriOsAppArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const UploadDetoxAndroidAppClientArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const UploadXcuiTestAppArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const GetProjectArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const UpdateProjectArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
    body: z.object({ name: z.string() }),
  });
  export const DeleteProjectArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const ListDevicesArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListAppiumLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const DeleteAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const GetFlutterAndroidAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const DeleteFlutterAndroidAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UploadMediaFileArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListEspressoAppsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      scope: z.string().optional(),
      custom_id: z.string().optional(),
      limit: z.coerce.number().optional(),
    }).optional(),
  });
  export const GetAppProfilingDataV2Args = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const GetSessionArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UpdateSessionArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ status: z.string(), reason: z.string() }),
  });
  export const DeleteSessionArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListProjectsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      status: z.string().optional(),
    }).optional(),
  });
  export const DeleteMediaFileArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const GetEspressoAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const DeleteEspressoAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListMediaFilesArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListFlutteriOsAppsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      scope: z.string().optional(),
      custom_id: z.string().optional(),
      limit: z.coerce.number().optional(),
    }).optional(),
  });
  export const UploadAppArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ListGroupAppsArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const UploadEspressoAppArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const GetAppsByCustomIdArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListFlutterAndroidAppsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      scope: z.string().optional(),
      custom_id: z.string().optional(),
      limit: z.coerce.number().optional(),
    }).optional(),
  });
  export const ListDeviceLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const GetAppProfilingDataV1Args = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const ListBuildsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      projectId: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      status: z.string().optional(),
    }).optional(),
  });
  export const GetFlutteriOsAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const DeleteFlutteriOsAppArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const GetProjectBadgeKeyArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const ActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.AppAutomate.Action.GetBuild]: {
      schema: GetBuildArgs,
      call: (client, data) => client.getBuild(data.positional[0])
    },
    [Constants.AppAutomate.Action.UpdateBuild]: {
      schema: UpdateBuildArgs,
      call: (client, data) => client.updateBuild(data.positional[0], data.body)
    },
    [Constants.AppAutomate.Action.DeleteBuild]: {
      schema: DeleteBuildArgs,
      call: (client, data) => client.deleteBuild(data.positional[0])
    },
    [Constants.AppAutomate.Action.GetMediaFilesByCustomId]: {
      schema: GetMediaFilesByCustomIdArgs,
      call: (client, data) => client.getMediaFilesByCustomId(data.positional[0])
    },
    [Constants.AppAutomate.Action.ListSessionLogs]: {
      schema: ListSessionLogsArgs,
      call: (client, data) => client.getSessionLogs(data.positional[0], data.positional[1])
    },
    [Constants.AppAutomate.Action.ListApps]: {
      schema: ListAppsArgs,
      call: (client, _data) => client.getApps()
    },
    [Constants.AppAutomate.Action.ListGroupMediaFiles]: {
      schema: ListGroupMediaFilesArgs,
      call: (client, _data) => client.getGroupMediaFiles()
    },
    [Constants.AppAutomate.Action.GetXcuiTestApp]: {
      schema: GetXcuiTestAppArgs,
      call: (client, data) => client.getXCUITestApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.DeleteXcuiTestApp]: {
      schema: DeleteXcuiTestAppArgs,
      call: (client, data) => client.deleteXCUITestApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.ListNetworkLogs]: {
      schema: ListNetworkLogsArgs,
      call: (client, data) => client.getNetworkLogs(data.positional[0], data.positional[1])
    },
    [Constants.AppAutomate.Action.UploadBuildTerminalLogs]: {
      schema: UploadBuildTerminalLogsArgs,
      call: (client, data) => client.uploadBuildTerminalLogs(data.positional[0], data.body)
    },
    [Constants.AppAutomate.Action.UploadFlutterAndroidApp]: {
      schema: UploadFlutterAndroidAppArgs,
      call: (client, data) => client.uploadFlutterAndroidApp(data.body)
    },
    [Constants.AppAutomate.Action.UploadDetoxAndroidApp]: {
      schema: UploadDetoxAndroidAppArgs,
      call: (client, data) => client.uploadDetoxAndroidApp(data.body)
    },
    [Constants.AppAutomate.Action.ListXcuiTestApps]: {
      schema: ListXcuiTestAppsArgs,
      call: (client, data) => client.getXCUITestApps(data.options?.["scope"], data.options?.["custom_id"], data.options?.["limit"])
    },
    [Constants.AppAutomate.Action.UploadSessionTerminalLogs]: {
      schema: UploadSessionTerminalLogsArgs,
      call: (client, data) => client.uploadSessionTerminalLogs(data.positional[0], data.body)
    },
    [Constants.AppAutomate.Action.GetPlan]: {
      schema: GetPlanArgs,
      call: (client, _data) => client.getPlan()
    },
    [Constants.AppAutomate.Action.UploadFlutteriOsApp]: {
      schema: UploadFlutteriOsAppArgs,
      call: (client, data) => client.uploadFlutteriOSApp(data.body)
    },
    [Constants.AppAutomate.Action.UploadDetoxAndroidAppClient]: {
      schema: UploadDetoxAndroidAppClientArgs,
      call: (client, data) => client.uploadDetoxAndroidAppClient(data.body)
    },
    [Constants.AppAutomate.Action.UploadXcuiTestApp]: {
      schema: UploadXcuiTestAppArgs,
      call: (client, data) => client.uploadXCUITestApp(data.body)
    },
    [Constants.AppAutomate.Action.GetProject]: {
      schema: GetProjectArgs,
      call: (client, data) => client.getProject(data.positional[0])
    },
    [Constants.AppAutomate.Action.UpdateProject]: {
      schema: UpdateProjectArgs,
      call: (client, data) => client.updateProject(data.positional[0], data.body)
    },
    [Constants.AppAutomate.Action.DeleteProject]: {
      schema: DeleteProjectArgs,
      call: (client, data) => client.deleteProject(data.positional[0])
    },
    [Constants.AppAutomate.Action.ListDevices]: {
      schema: ListDevicesArgs,
      call: (client, _data) => client.getDevices()
    },
    [Constants.AppAutomate.Action.ListAppiumLogs]: {
      schema: ListAppiumLogsArgs,
      call: (client, data) => client.getAppiumLogs(data.positional[0], data.positional[1])
    },
    [Constants.AppAutomate.Action.DeleteApp]: {
      schema: DeleteAppArgs,
      call: (client, data) => client.deleteApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.GetFlutterAndroidApp]: {
      schema: GetFlutterAndroidAppArgs,
      call: (client, data) => client.getFlutterAndroidApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.DeleteFlutterAndroidApp]: {
      schema: DeleteFlutterAndroidAppArgs,
      call: (client, data) => client.deleteFlutterAndroidApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.UploadMediaFile]: {
      schema: UploadMediaFileArgs,
      call: (client, data) => client.uploadMediaFile(data.body)
    },
    [Constants.AppAutomate.Action.ListEspressoApps]: {
      schema: ListEspressoAppsArgs,
      call: (client, data) => client.getEspressoApps(data.options?.["scope"], data.options?.["custom_id"], data.options?.["limit"])
    },
    [Constants.AppAutomate.Action.GetAppProfilingDataV2]: {
      schema: GetAppProfilingDataV2Args,
      call: (client, data) => client.getAppProfilingDataV2(data.positional[0], data.positional[1])
    },
    [Constants.AppAutomate.Action.GetSession]: {
      schema: GetSessionArgs,
      call: (client, data) => client.getSession(data.positional[0])
    },
    [Constants.AppAutomate.Action.UpdateSession]: {
      schema: UpdateSessionArgs,
      call: (client, data) => client.updateSession(data.positional[0], data.body)
    },
    [Constants.AppAutomate.Action.DeleteSession]: {
      schema: DeleteSessionArgs,
      call: (client, data) => client.deleteSession(data.positional[0])
    },
    [Constants.AppAutomate.Action.ListProjects]: {
      schema: ListProjectsArgs,
      call: (client, data) => client.getProjects(data.options?.["limit"], data.options?.["offset"], data.options?.["status"])
    },
    [Constants.AppAutomate.Action.DeleteMediaFile]: {
      schema: DeleteMediaFileArgs,
      call: (client, data) => client.deleteMediaFile(data.positional[0])
    },
    [Constants.AppAutomate.Action.GetEspressoApp]: {
      schema: GetEspressoAppArgs,
      call: (client, data) => client.getEspressoApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.DeleteEspressoApp]: {
      schema: DeleteEspressoAppArgs,
      call: (client, data) => client.deleteEspressoApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.ListMediaFiles]: {
      schema: ListMediaFilesArgs,
      call: (client, _data) => client.getMediaFiles()
    },
    [Constants.AppAutomate.Action.ListFlutteriOsApps]: {
      schema: ListFlutteriOsAppsArgs,
      call: (client, data) => client.getFlutteriOSApps(data.options?.["scope"], data.options?.["custom_id"], data.options?.["limit"])
    },
    [Constants.AppAutomate.Action.UploadApp]: {
      schema: UploadAppArgs,
      call: (client, data) => client.uploadApp(data.body)
    },
    [Constants.AppAutomate.Action.ListGroupApps]: {
      schema: ListGroupAppsArgs,
      call: (client, _data) => client.getGroupApps()
    },
    [Constants.AppAutomate.Action.UploadEspressoApp]: {
      schema: UploadEspressoAppArgs,
      call: (client, data) => client.uploadEspressoApp(data.body)
    },
    [Constants.AppAutomate.Action.GetAppsByCustomId]: {
      schema: GetAppsByCustomIdArgs,
      call: (client, data) => client.getAppsByCustomId(data.positional[0])
    },
    [Constants.AppAutomate.Action.ListFlutterAndroidApps]: {
      schema: ListFlutterAndroidAppsArgs,
      call: (client, data) => client.getFlutterAndroidApps(data.options?.["scope"], data.options?.["custom_id"], data.options?.["limit"])
    },
    [Constants.AppAutomate.Action.ListDeviceLogs]: {
      schema: ListDeviceLogsArgs,
      call: (client, data) => client.getDeviceLogs(data.positional[0], data.positional[1])
    },
    [Constants.AppAutomate.Action.GetAppProfilingDataV1]: {
      schema: GetAppProfilingDataV1Args,
      call: (client, data) => client.getAppProfilingDataV1(data.positional[0], data.positional[1])
    },
    [Constants.AppAutomate.Action.ListBuilds]: {
      schema: ListBuildsArgs,
      call: (client, data) => client.getBuilds(data.options?.["projectId"], data.options?.["limit"], data.options?.["offset"], data.options?.["status"])
    },
    [Constants.AppAutomate.Action.GetFlutteriOsApp]: {
      schema: GetFlutteriOsAppArgs,
      call: (client, data) => client.getFlutteriOSApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.DeleteFlutteriOsApp]: {
      schema: DeleteFlutteriOsAppArgs,
      call: (client, data) => client.deleteFlutteriOSApp(data.positional[0])
    },
    [Constants.AppAutomate.Action.GetProjectBadgeKey]: {
      schema: GetProjectBadgeKeyArgs,
      call: (client, data) => client.getProjectBadgeKey(data.positional[0])
    },
  };
}

export namespace ScreenshotsSchemas {
  export const GetJobArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const CreateJobArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.any(),
  });
  export const ListBrowsersArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.Screenshots.Action.GetJob]: {
      schema: GetJobArgs,
      call: (client, data) => client.getJob(data.positional[0])
    },
    [Constants.Screenshots.Action.CreateJob]: {
      schema: CreateJobArgs,
      call: (client, data) => client.createJob(data.body)
    },
    [Constants.Screenshots.Action.ListBrowsers]: {
      schema: ListBrowsersArgs,
      call: (client, _data) => client.getBrowsers()
    },
  };
}

export namespace LocalTestingSchemas {
  export const ListInstancesArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      auth_token: z.string().optional(),
      last: z.coerce.number().optional(),
      state: z.string().optional(),
    }).optional(),
  });
  export const GetInstanceArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      auth_token: z.string().optional(),
    }).optional(),
  });
  export const DisconnectInstanceArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      auth_token: z.string().optional(),
    }).optional(),
  });
  export const ActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.LocalTesting.Action.ListInstances]: {
      schema: ListInstancesArgs,
      call: (client, data) => client.getInstances(data.options?.["auth_token"], data.options?.["last"], data.options?.["state"])
    },
    [Constants.LocalTesting.Action.GetInstance]: {
      schema: GetInstanceArgs,
      call: (client, data) => client.getInstance(data.positional[0], data.options?.["auth_token"])
    },
    [Constants.LocalTesting.Action.DisconnectInstance]: {
      schema: DisconnectInstanceArgs,
      call: (client, data) => client.disconnectInstance(data.positional[0], data.options?.["auth_token"])
    },
  };
}

export namespace TestManagementSchemas {
  export const ProjectsListProjectsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
      page_size: z.coerce.number().optional(),
    }).optional(),
  });
  export const ProjectsCreateProjectArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.object({ project: z.object({ name: z.string(), description: z.string().optional() }).optional() }),
  });
  export const ProjectsGetProjectArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ProjectsUpdateProjectArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ project: z.object({ name: z.string().optional(), description: z.string().optional() }).optional() }),
  });
  export const ProjectsDeleteProjectArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ProjectsActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.ProjectsAction.ListProjects]: {
      schema: ProjectsListProjectsArgs,
      call: (client, data) => client.getProjects(data.options?.["p"], data.options?.["page_size"])
    },
    [Constants.TestManagement.ProjectsAction.CreateProject]: {
      schema: ProjectsCreateProjectArgs,
      call: (client, data) => client.createProject(data.body)
    },
    [Constants.TestManagement.ProjectsAction.GetProject]: {
      schema: ProjectsGetProjectArgs,
      call: (client, data) => client.getProject(data.positional[0])
    },
    [Constants.TestManagement.ProjectsAction.UpdateProject]: {
      schema: ProjectsUpdateProjectArgs,
      call: (client, data) => client.updateProject(data.positional[0], data.body)
    },
    [Constants.TestManagement.ProjectsAction.DeleteProject]: {
      schema: ProjectsDeleteProjectArgs,
      call: (client, data) => client.deleteProject(data.positional[0])
    },
  };
  export const FoldersListFoldersArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
      page_size: z.coerce.number().optional(),
    }).optional(),
  });
  export const FoldersCreateFolderArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ folder: z.object({ name: z.string(), description: z.string(), parent_id: z.coerce.number().optional() }).optional() }),
  });
  export const FoldersGetFolderArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const FoldersUpdateFolderArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ folder: z.object({ name: z.string().optional(), description: z.string().optional() }).optional() }),
  });
  export const FoldersDeleteFolderArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const FoldersMoveFolderArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ parent_id: z.coerce.number().optional() }),
  });
  export const FoldersActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.FoldersAction.ListFolders]: {
      schema: FoldersListFoldersArgs,
      call: (client, data) => client.getFolders(data.positional[0], data.options?.["p"], data.options?.["page_size"])
    },
    [Constants.TestManagement.FoldersAction.CreateFolder]: {
      schema: FoldersCreateFolderArgs,
      call: (client, data) => client.createFolder(data.positional[0], data.body)
    },
    [Constants.TestManagement.FoldersAction.GetFolder]: {
      schema: FoldersGetFolderArgs,
      call: (client, data) => client.getFolder(data.positional[0], data.positional[1])
    },
    [Constants.TestManagement.FoldersAction.UpdateFolder]: {
      schema: FoldersUpdateFolderArgs,
      call: (client, data) => client.updateFolder(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.FoldersAction.DeleteFolder]: {
      schema: FoldersDeleteFolderArgs,
      call: (client, data) => client.deleteFolder(data.positional[0], data.positional[1])
    },
    [Constants.TestManagement.FoldersAction.MoveFolder]: {
      schema: FoldersMoveFolderArgs,
      call: (client, data) => client.moveFolder(data.positional[0], data.positional[1], data.body)
    },
  };
  export const TestCasesListTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
      page_size: z.coerce.number().optional(),
      updated_after: z.string().optional(),
      updated_before: z.string().optional(),
      archived: z.coerce.boolean().optional(),
      minify: z.coerce.boolean().optional(),
      id: z.string().optional(),
      status: z.string().optional(),
      priority: z.string().optional(),
      owner: z.string().optional(),
      case_type: z.string().optional(),
      folder_id: z.coerce.number().optional(),
      tags: z.string().optional(),
      issue_ids: z.string().optional(),
      issue_type: z.string().optional(),
    }).optional(),
  });
  export const TestCasesBulkEditTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ ids: z.array(z.string()), test_case: z.object({ preconditions: z.string().optional(), owner: z.string().optional(), tags: z.array(z.string()).optional(), custom_fields: z.object({  }).optional(), automation_status: z.string().optional(), case_type: z.string().optional(), priority: z.string().optional(), status: z.string().optional() }) }),
  });
  export const TestCasesBulkDeleteTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ ids: z.array(z.string()) }),
  });
  export const TestCasesBulkArchiveTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ ids: z.array(z.string()) }),
  });
  export const TestCasesBulkUnarchiveTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ ids: z.array(z.string()) }),
  });
  export const TestCasesBulkEditTestCasesWithOperationsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ ids: z.array(z.string()), test_case: z.object({  }) }),
  });
  export const TestCasesCreateTestCaseArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ test_case: z.object({ name: z.string().optional(), template: z.string().optional(), description: z.string().optional(), owner: z.string().optional(), preconditions: z.string().optional(), test_case_steps: z.array(z.object({ description: z.string().optional(), result: z.string().optional() })).optional(), issues: z.array(z.string()).optional(), issue_tracker: z.object({ name: z.string().optional(), host: z.string().optional() }).optional(), tags: z.array(z.string()).optional(), case_type: z.string().optional(), priority: z.string().optional(), custom_fields: z.object({  }).optional(), feature: z.string().optional(), scenario: z.string().optional(), background: z.string().optional() }).optional() }),
  });
  export const TestCasesUpdateTestCaseArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ test_case: z.object({ name: z.string().optional(), case_type: z.string().optional(), priority: z.string().optional(), status: z.string().optional(), description: z.string().optional(), owner: z.string().optional(), preconditions: z.string().optional(), test_case_steps: z.array(z.object({ description: z.string().optional(), result: z.string().optional() })).optional(), issues: z.array(z.string()).optional(), issue_tracker: z.object({ name: z.string().optional(), host: z.string().optional() }).optional(), tags: z.array(z.string()).optional(), custom_fields: z.object({  }).optional(), automation_status: z.string().optional(), feature: z.string().optional(), scenario: z.string().optional(), background: z.string().optional() }).optional() }),
  });
  export const TestCasesDeleteTestCaseArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const TestCasesArchiveTestCaseArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const TestCasesUnarchiveTestCaseArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const TestCasesMoveTestCaseArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ destination_folder_id: z.coerce.number() }),
  });
  export const TestCasesActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.TestCasesAction.ListTestCases]: {
      schema: TestCasesListTestCasesArgs,
      call: (client, data) => client.getTestCases(data.positional[0], data.options?.["p"], data.options?.["page_size"], data.options?.["updated_after"], data.options?.["updated_before"], data.options?.["archived"], data.options?.["minify"], data.options?.["id"], data.options?.["status"], data.options?.["priority"], data.options?.["owner"], data.options?.["case_type"], data.options?.["folder_id"], data.options?.["tags"], data.options?.["issue_ids"], data.options?.["issue_type"])
    },
    [Constants.TestManagement.TestCasesAction.BulkEditTestCases]: {
      schema: TestCasesBulkEditTestCasesArgs,
      call: (client, data) => client.bulkEditTestCases(data.positional[0], data.body)
    },
    [Constants.TestManagement.TestCasesAction.BulkDeleteTestCases]: {
      schema: TestCasesBulkDeleteTestCasesArgs,
      call: (client, data) => client.bulkDeleteTestCases(data.positional[0], data.body)
    },
    [Constants.TestManagement.TestCasesAction.BulkArchiveTestCases]: {
      schema: TestCasesBulkArchiveTestCasesArgs,
      call: (client, data) => client.bulkArchiveTestCases(data.positional[0], data.body)
    },
    [Constants.TestManagement.TestCasesAction.BulkUnarchiveTestCases]: {
      schema: TestCasesBulkUnarchiveTestCasesArgs,
      call: (client, data) => client.bulkUnarchiveTestCases(data.positional[0], data.body)
    },
    [Constants.TestManagement.TestCasesAction.BulkEditTestCasesWithOperations]: {
      schema: TestCasesBulkEditTestCasesWithOperationsArgs,
      call: (client, data) => client.bulkEditTestCasesWithOperations(data.positional[0], data.body)
    },
    [Constants.TestManagement.TestCasesAction.CreateTestCase]: {
      schema: TestCasesCreateTestCaseArgs,
      call: (client, data) => client.createTestCase(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.TestCasesAction.UpdateTestCase]: {
      schema: TestCasesUpdateTestCaseArgs,
      call: (client, data) => client.updateTestCase(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.TestCasesAction.DeleteTestCase]: {
      schema: TestCasesDeleteTestCaseArgs,
      call: (client, data) => client.deleteTestCase(data.positional[0], data.positional[1])
    },
    [Constants.TestManagement.TestCasesAction.ArchiveTestCase]: {
      schema: TestCasesArchiveTestCaseArgs,
      call: (client, data) => client.archiveTestCase(data.positional[0], data.positional[1])
    },
    [Constants.TestManagement.TestCasesAction.UnarchiveTestCase]: {
      schema: TestCasesUnarchiveTestCaseArgs,
      call: (client, data) => client.unarchiveTestCase(data.positional[0], data.positional[1])
    },
    [Constants.TestManagement.TestCasesAction.MoveTestCase]: {
      schema: TestCasesMoveTestCaseArgs,
      call: (client, data) => client.moveTestCase(data.positional[0], data.positional[1], data.body)
    },
  };
  export const AttachmentsListTestCaseAttachmentsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
    }).optional(),
  });
  export const AttachmentsAddTestCaseAttachmentArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      inline: z.coerce.boolean().optional(),
    }).optional(),
  });
  export const AttachmentsDeleteTestCaseAttachmentArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
      z.string(),
    ]),
  });
  export const AttachmentsListTestResultAttachmentsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
    }).optional(),
  });
  export const AttachmentsAddTestResultAttachmentArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const AttachmentsDeleteTestResultAttachmentArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
      z.string(),
    ]),
  });
  export const AttachmentsActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.AttachmentsAction.ListTestCaseAttachments]: {
      schema: AttachmentsListTestCaseAttachmentsArgs,
      call: (client, data) => client.getTestCaseAttachments(data.positional[0], data.positional[1], data.options?.["p"])
    },
    [Constants.TestManagement.AttachmentsAction.AddTestCaseAttachment]: {
      schema: AttachmentsAddTestCaseAttachmentArgs,
      call: (client, data) => client.addTestCaseAttachment(data.positional[0], data.positional[1], data.body, data.options?.["inline"])
    },
    [Constants.TestManagement.AttachmentsAction.DeleteTestCaseAttachment]: {
      schema: AttachmentsDeleteTestCaseAttachmentArgs,
      call: (client, data) => client.deleteTestCaseAttachment(data.positional[0], data.positional[1], data.positional[2])
    },
    [Constants.TestManagement.AttachmentsAction.ListTestResultAttachments]: {
      schema: AttachmentsListTestResultAttachmentsArgs,
      call: (client, data) => client.getTestResultAttachments(data.positional[0], data.positional[1], data.options?.["p"])
    },
    [Constants.TestManagement.AttachmentsAction.AddTestResultAttachment]: {
      schema: AttachmentsAddTestResultAttachmentArgs,
      call: (client, data) => client.addTestResultAttachment(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.AttachmentsAction.DeleteTestResultAttachment]: {
      schema: AttachmentsDeleteTestResultAttachmentArgs,
      call: (client, data) => client.deleteTestResultAttachment(data.positional[0], data.positional[1], data.positional[2])
    },
  };
  export const TestResultsListTestCaseResultsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
    }).optional(),
  });
  export const TestResultsListTestRunResultsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
      validate_tc: z.coerce.boolean().optional(),
    }).optional(),
  });
  export const TestResultsAddTestRunResultsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.any(),
  });
  export const TestResultsListTestRunTestCaseResultsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
    }).optional(),
  });
  export const TestResultsActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.TestResultsAction.ListTestCaseResults]: {
      schema: TestResultsListTestCaseResultsArgs,
      call: (client, data) => client.getTestCaseResults(data.positional[0], data.positional[1], data.options?.["p"])
    },
    [Constants.TestManagement.TestResultsAction.ListTestRunResults]: {
      schema: TestResultsListTestRunResultsArgs,
      call: (client, data) => client.getTestRunResults(data.positional[0], data.positional[1], data.options?.["p"], data.options?.["validate_tc"])
    },
    [Constants.TestManagement.TestResultsAction.AddTestRunResults]: {
      schema: TestResultsAddTestRunResultsArgs,
      call: (client, data) => client.addTestRunResults(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.TestResultsAction.ListTestRunTestCaseResults]: {
      schema: TestResultsListTestRunTestCaseResultsArgs,
      call: (client, data) => client.getTestRunTestCaseResults(data.positional[0], data.positional[1], data.positional[2], data.options?.["p"])
    },
  };
  export const TestRunsListTestRunsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      closed_before: z.string().optional(),
      closed_after: z.string().optional(),
      created_before: z.string().optional(),
      created_after: z.string().optional(),
      test_plan_id: z.string().optional(),
      assignee: z.string().optional(),
      include_closed: z.coerce.boolean().optional(),
      run_state: z.string().optional(),
    }).optional(),
  });
  export const TestRunsCreateTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ test_run: z.any() }),
  });
  export const TestRunsGetTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      minify: z.coerce.boolean().optional(),
    }).optional(),
  });
  export const TestRunsListTestRunTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
      fetch_steps: z.coerce.boolean().optional(),
      minify: z.coerce.boolean().optional(),
    }).optional(),
  });
  export const TestRunsPatchTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ test_run: z.any() }),
  });
  export const TestRunsUpdateTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ test_run: z.any() }),
  });
  export const TestRunsAssignTestRunTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ assign_to: z.array(z.object({ test_case_id: z.string().optional(), configuration_id: z.coerce.number().optional(), assignee: z.string().optional() })) }),
  });
  export const TestRunsCloseTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const TestRunsDeleteTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const TestRunsActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.TestRunsAction.ListTestRuns]: {
      schema: TestRunsListTestRunsArgs,
      call: (client, data) => client.getTestRuns(data.positional[0], data.options?.["closed_before"], data.options?.["closed_after"], data.options?.["created_before"], data.options?.["created_after"], data.options?.["test_plan_id"], data.options?.["assignee"], data.options?.["include_closed"], data.options?.["run_state"])
    },
    [Constants.TestManagement.TestRunsAction.CreateTestRun]: {
      schema: TestRunsCreateTestRunArgs,
      call: (client, data) => client.createTestRun(data.positional[0], data.body)
    },
    [Constants.TestManagement.TestRunsAction.GetTestRun]: {
      schema: TestRunsGetTestRunArgs,
      call: (client, data) => client.getTestRun(data.positional[0], data.positional[1], data.options?.["minify"])
    },
    [Constants.TestManagement.TestRunsAction.ListTestRunTestCases]: {
      schema: TestRunsListTestRunTestCasesArgs,
      call: (client, data) => client.getTestRunTestCases(data.positional[0], data.positional[1], data.options?.["p"], data.options?.["fetch_steps"], data.options?.["minify"])
    },
    [Constants.TestManagement.TestRunsAction.PatchTestRun]: {
      schema: TestRunsPatchTestRunArgs,
      call: (client, data) => client.patchTestRun(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.TestRunsAction.UpdateTestRun]: {
      schema: TestRunsUpdateTestRunArgs,
      call: (client, data) => client.updateTestRun(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.TestRunsAction.AssignTestRunTestCases]: {
      schema: TestRunsAssignTestRunTestCasesArgs,
      call: (client, data) => client.assignTestRunTestCases(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.TestRunsAction.CloseTestRun]: {
      schema: TestRunsCloseTestRunArgs,
      call: (client, data) => client.closeTestRun(data.positional[0], data.positional[1])
    },
    [Constants.TestManagement.TestRunsAction.DeleteTestRun]: {
      schema: TestRunsDeleteTestRunArgs,
      call: (client, data) => client.deleteTestRun(data.positional[0], data.positional[1])
    },
  };
  export const TestPlansListTestPlansArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
      page_size: z.coerce.number().optional(),
    }).optional(),
  });
  export const TestPlansCreateTestPlanArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ test_plan: z.object({ name: z.string(), plan_status: z.string().optional(), description: z.string().optional(), start_date: z.string().optional(), end_date: z.string().optional() }).optional() }),
  });
  export const TestPlansGetTestPlanArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const TestPlansUpdateTestPlanArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ test_plan: z.object({ name: z.string().optional(), plan_status: z.string().optional(), description: z.string().optional(), start_date: z.string().optional(), end_date: z.string().optional() }).optional() }),
  });
  export const TestPlansListTestPlanTestRunsArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
    }).optional(),
  });
  export const TestPlansActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.TestPlansAction.ListTestPlans]: {
      schema: TestPlansListTestPlansArgs,
      call: (client, data) => client.getTestPlans(data.positional[0], data.options?.["p"], data.options?.["page_size"])
    },
    [Constants.TestManagement.TestPlansAction.CreateTestPlan]: {
      schema: TestPlansCreateTestPlanArgs,
      call: (client, data) => client.createTestPlan(data.positional[0], data.body)
    },
    [Constants.TestManagement.TestPlansAction.GetTestPlan]: {
      schema: TestPlansGetTestPlanArgs,
      call: (client, data) => client.getTestPlan(data.positional[0], data.positional[1])
    },
    [Constants.TestManagement.TestPlansAction.UpdateTestPlan]: {
      schema: TestPlansUpdateTestPlanArgs,
      call: (client, data) => client.updateTestPlan(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestManagement.TestPlansAction.ListTestPlanTestRuns]: {
      schema: TestPlansListTestPlanTestRunsArgs,
      call: (client, data) => client.getTestPlanTestRuns(data.positional[0], data.positional[1], data.options?.["p"])
    },
  };
  export const ConfigurationsListConfigurationsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      p: z.coerce.number().optional(),
      page_size: z.coerce.number().optional(),
    }).optional(),
  });
  export const ConfigurationsCreateConfigurationArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.object({ name: z.string() }),
  });
  export const ConfigurationsGetConfigurationArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ConfigurationsActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.ConfigurationsAction.ListConfigurations]: {
      schema: ConfigurationsListConfigurationsArgs,
      call: (client, data) => client.getConfigurations(data.options?.["p"], data.options?.["page_size"])
    },
    [Constants.TestManagement.ConfigurationsAction.CreateConfiguration]: {
      schema: ConfigurationsCreateConfigurationArgs,
      call: (client, data) => client.createConfiguration(data.body)
    },
    [Constants.TestManagement.ConfigurationsAction.GetConfiguration]: {
      schema: ConfigurationsGetConfigurationArgs,
      call: (client, data) => client.getConfiguration(data.positional[0])
    },
  };
  export const CustomFieldsListCustomFieldsArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const CustomFieldsCreateCustomFieldArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.object({ field_name: z.string(), place_holder_text: z.string().optional(), field_type: z.string(), is_required: z.coerce.boolean().optional(), options: z.array(z.object({ option_value: z.string().optional(), is_default: z.coerce.boolean().optional() })).optional(), applies_to_all_projects: z.coerce.boolean().optional(), field_entity_type: z.string(), link_to_future_projects: z.coerce.boolean().optional(), assigned_projects: z.array(z.string()).optional() }),
  });
  export const CustomFieldsUpdateCustomFieldArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ field_name: z.string().optional(), place_holder_text: z.string().optional(), field_type: z.string().optional(), is_required: z.coerce.boolean().optional(), options: z.array(z.object({  })).optional(), applies_to_all_projects: z.coerce.boolean().optional(), field_entity_type: z.string().optional(), link_to_future_projects: z.coerce.boolean().optional(), assigned_projects: z.array(z.string()).optional() }),
  });
  export const CustomFieldsDeleteCustomFieldArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const CustomFieldsActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestManagement.CustomFieldsAction.ListCustomFields]: {
      schema: CustomFieldsListCustomFieldsArgs,
      call: (client, _data) => client.getCustomFields()
    },
    [Constants.TestManagement.CustomFieldsAction.CreateCustomField]: {
      schema: CustomFieldsCreateCustomFieldArgs,
      call: (client, data) => client.createCustomField(data.body)
    },
    [Constants.TestManagement.CustomFieldsAction.UpdateCustomField]: {
      schema: CustomFieldsUpdateCustomFieldArgs,
      call: (client, data) => client.updateCustomField(data.positional[0], data.body)
    },
    [Constants.TestManagement.CustomFieldsAction.DeleteCustomField]: {
      schema: CustomFieldsDeleteCustomFieldArgs,
      call: (client, data) => client.deleteCustomField(data.positional[0])
    },
  };
}

export namespace AccessibilitySchemas {
  export const ListWorkflowAnalyzerReportsArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const GetWorkflowAnalyzerReportSummaryArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const ListWorkflowAnalyzerReportIssuesArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      report_id: z.coerce.number().optional(),
      task_id: z.string().optional(),
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ListAssistedTestReportsArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const GetAssistedTestReportSummaryArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const ListAssistedTestReportIssuesArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      report_id: z.coerce.number().optional(),
      task_id: z.string().optional(),
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ListWebsiteScannerAuthConfigsArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const CreateWebsiteScannerAuthConfigArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.object({ name: z.string().optional(), type: z.string().optional(), authData: z.object({ url: z.string().optional(), username: z.string().optional(), password: z.string().optional(), usernameSelector: z.string().optional(), passwordSelector: z.string().optional(), submitSelector: z.string().optional() }).optional() }),
  });
  export const ListWebsiteScannerScansArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const CreateWebsiteScannerScanArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.object({ scan_url: z.string().optional() }),
  });
  export const GetWebsiteScannerScanOverviewArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
  });
  export const ListWebsiteScannerScanRunsArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
    options: z.object({
      page: z.coerce.number().optional(),
      page_size: z.coerce.number().optional(),
    }).optional(),
  });
  export const GetWebsiteScannerScanRunSummaryArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
      z.coerce.number(),
    ]),
  });
  export const ListWebsiteScannerScanRunStatusArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
      z.coerce.number(),
    ]),
  });
  export const ListWebsiteScannerScanRunIssuesArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
    options: z.object({
      scan_run_id: z.coerce.number().optional(),
      task_id: z.string().optional(),
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ListWebsiteScannerScanRunLogsArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
      z.coerce.number(),
    ]),
  });
  export const ListAutomatedTestProjectsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ListAutomatedTestBuildsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      next_page: z.string().optional(),
      projectId: z.coerce.number().optional(),
    }).optional(),
  });
  export const ListAutomatedTestBuildTestCasesArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      next_page: z.string().optional(),
    }).optional(),
  });
  export const GetAutomatedTestBuildSummaryArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ListAutomatedTestBuildIssuesArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      build_id: z.string().optional(),
      task_id: z.string().optional(),
      next_page: z.string().optional(),
    }).optional(),
  });
  export const GetAutomatedTestBuildTestCaseSummaryArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    options: z.object({
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ListAutomatedTestBuildTestCaseIssuesArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      test_case: z.string().optional(),
      task_id: z.string().optional(),
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.Accessibility.Action.ListWorkflowAnalyzerReports]: {
      schema: ListWorkflowAnalyzerReportsArgs,
      call: (client, _data) => client.getWorkflowAnalyzerReports()
    },
    [Constants.Accessibility.Action.GetWorkflowAnalyzerReportSummary]: {
      schema: GetWorkflowAnalyzerReportSummaryArgs,
      call: (client, data) => client.getWorkflowAnalyzerReportSummary(data.positional[0])
    },
    [Constants.Accessibility.Action.ListWorkflowAnalyzerReportIssues]: {
      schema: ListWorkflowAnalyzerReportIssuesArgs,
      call: (client, data) => client.getWorkflowAnalyzerReportIssues(data.options?.["report_id"], data.options?.["task_id"], data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.ListAssistedTestReports]: {
      schema: ListAssistedTestReportsArgs,
      call: (client, _data) => client.getAssistedTestReports()
    },
    [Constants.Accessibility.Action.GetAssistedTestReportSummary]: {
      schema: GetAssistedTestReportSummaryArgs,
      call: (client, data) => client.getAssistedTestReportSummary(data.positional[0])
    },
    [Constants.Accessibility.Action.ListAssistedTestReportIssues]: {
      schema: ListAssistedTestReportIssuesArgs,
      call: (client, data) => client.getAssistedTestReportIssues(data.options?.["report_id"], data.options?.["task_id"], data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.ListWebsiteScannerAuthConfigs]: {
      schema: ListWebsiteScannerAuthConfigsArgs,
      call: (client, _data) => client.getWebsiteScannerAuthConfigs()
    },
    [Constants.Accessibility.Action.CreateWebsiteScannerAuthConfig]: {
      schema: CreateWebsiteScannerAuthConfigArgs,
      call: (client, data) => client.createWebsiteScannerAuthConfig(data.body)
    },
    [Constants.Accessibility.Action.ListWebsiteScannerScans]: {
      schema: ListWebsiteScannerScansArgs,
      call: (client, _data) => client.getWebsiteScannerScans()
    },
    [Constants.Accessibility.Action.CreateWebsiteScannerScan]: {
      schema: CreateWebsiteScannerScanArgs,
      call: (client, data) => client.createWebsiteScannerScan(data.body)
    },
    [Constants.Accessibility.Action.GetWebsiteScannerScanOverview]: {
      schema: GetWebsiteScannerScanOverviewArgs,
      call: (client, data) => client.getWebsiteScannerScanOverview(data.positional[0])
    },
    [Constants.Accessibility.Action.ListWebsiteScannerScanRuns]: {
      schema: ListWebsiteScannerScanRunsArgs,
      call: (client, data) => client.getWebsiteScannerScanRuns(data.positional[0], data.options?.["page"], data.options?.["page_size"])
    },
    [Constants.Accessibility.Action.GetWebsiteScannerScanRunSummary]: {
      schema: GetWebsiteScannerScanRunSummaryArgs,
      call: (client, data) => client.getWebsiteScannerScanRunSummary(data.positional[0], data.positional[1])
    },
    [Constants.Accessibility.Action.ListWebsiteScannerScanRunStatus]: {
      schema: ListWebsiteScannerScanRunStatusArgs,
      call: (client, data) => client.getWebsiteScannerScanRunStatus(data.positional[0], data.positional[1])
    },
    [Constants.Accessibility.Action.ListWebsiteScannerScanRunIssues]: {
      schema: ListWebsiteScannerScanRunIssuesArgs,
      call: (client, data) => client.getWebsiteScannerScanRunIssues(data.positional[0], data.options?.["scan_run_id"], data.options?.["task_id"], data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.ListWebsiteScannerScanRunLogs]: {
      schema: ListWebsiteScannerScanRunLogsArgs,
      call: (client, data) => client.getWebsiteScannerScanRunLogs(data.positional[0], data.positional[1])
    },
    [Constants.Accessibility.Action.ListAutomatedTestProjects]: {
      schema: ListAutomatedTestProjectsArgs,
      call: (client, data) => client.getAutomatedTestProjects(data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.ListAutomatedTestBuilds]: {
      schema: ListAutomatedTestBuildsArgs,
      call: (client, data) => client.getAutomatedTestBuilds(data.options?.["next_page"], data.options?.["projectId"])
    },
    [Constants.Accessibility.Action.ListAutomatedTestBuildTestCases]: {
      schema: ListAutomatedTestBuildTestCasesArgs,
      call: (client, data) => client.getAutomatedTestBuildTestCases(data.positional[0], data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.GetAutomatedTestBuildSummary]: {
      schema: GetAutomatedTestBuildSummaryArgs,
      call: (client, data) => client.getAutomatedTestBuildSummary(data.positional[0], data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.ListAutomatedTestBuildIssues]: {
      schema: ListAutomatedTestBuildIssuesArgs,
      call: (client, data) => client.getAutomatedTestBuildIssues(data.options?.["build_id"], data.options?.["task_id"], data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.GetAutomatedTestBuildTestCaseSummary]: {
      schema: GetAutomatedTestBuildTestCaseSummaryArgs,
      call: (client, data) => client.getAutomatedTestBuildTestCaseSummary(data.positional[0], data.positional[1], data.options?.["next_page"])
    },
    [Constants.Accessibility.Action.ListAutomatedTestBuildTestCaseIssues]: {
      schema: ListAutomatedTestBuildTestCaseIssuesArgs,
      call: (client, data) => client.getAutomatedTestBuildTestCaseIssues(data.positional[0], data.options?.["test_case"], data.options?.["task_id"], data.options?.["next_page"])
    },
  };
}

export namespace TestReportingSchemas {
  export const ListProjectsArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      next_page: z.string().optional(),
    }).optional(),
  });
  export const ListProjectBuildsArgs = z.object({
    positional: z.tuple([
      z.coerce.number(),
    ]),
    options: z.object({
      unique_build_names: z.string().optional(),
      build_tags: z.string().optional(),
      build_status: z.string().optional(),
      users: z.string().optional(),
      frameworks: z.string().optional(),
      is_archived: z.coerce.boolean().optional(),
      date_range: z.string().optional(),
      next_page: z.string().optional(),
    }).optional(),
  });
  export const StartBuildArgs = z.object({
    positional: z.tuple([
    ]),
    body: z.any(),
  });
  export const GetLatestBuildArgs = z.object({
    positional: z.tuple([
    ]),
    options: z.object({
      project_name: z.string(),
      build_name: z.string().optional(),
      user_name: z.string().optional(),
      build_tags: z.string().optional(),
      framework: z.string().optional(),
    }).optional(),
  });
  export const GetBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UpdateBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ build_tags: z.array(z.string()).optional() }),
  });
  export const FinishBuildArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ finished_at: z.string() }),
  });
  export const StartTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.any(),
  });
  export const FinishTestRunArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.any(),
  });
  export const StartHookRunArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.any(),
  });
  export const FinishHookRunArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.any(),
  });
  export const AddBuildLogsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ logs: z.array(z.any()) }),
  });
  export const ListTestRunsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    options: z.object({
      re_runs: z.string().optional(),
      test_statuses: z.string().optional(),
      is_flaky: z.coerce.boolean().optional(),
      is_new_failure: z.coerce.boolean().optional(),
      sort: z.string().optional(),
      order: z.string().optional(),
      next_page: z.string().optional(),
    }).optional(),
  });
  export const GetSelfHealingReportArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListQualityGateStatusArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const ListQualityGateSettingsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
  });
  export const UpdateQualityGateSettingsArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.object({ enabled: z.coerce.boolean() }),
  });
  export const CreateQualityGateProfileArgs = z.object({
    positional: z.tuple([
      z.string(),
    ]),
    body: z.any(),
  });
  export const GetQualityGateProfileArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const UpdateQualityGateProfileArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.any(),
  });
  export const DeleteQualityGateProfileArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
  });
  export const ToggleQualityGateProfileArgs = z.object({
    positional: z.tuple([
      z.string(),
      z.string(),
    ]),
    body: z.object({ enabled: z.coerce.boolean() }),
  });
  export const UploadReportArgs = z.object({
    positional: z.tuple([
    ]),
  });
  export const ActionSchemaMap: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {
    [Constants.TestReporting.Action.ListProjects]: {
      schema: ListProjectsArgs,
      call: (client, data) => client.getProjects(data.options?.["next_page"])
    },
    [Constants.TestReporting.Action.ListProjectBuilds]: {
      schema: ListProjectBuildsArgs,
      call: (client, data) => client.getProjectBuilds(data.positional[0], data.options?.["unique_build_names"], data.options?.["build_tags"], data.options?.["build_status"], data.options?.["users"], data.options?.["frameworks"], data.options?.["is_archived"], data.options?.["date_range"], data.options?.["next_page"])
    },
    [Constants.TestReporting.Action.StartBuild]: {
      schema: StartBuildArgs,
      call: (client, data) => client.startBuild(data.body)
    },
    [Constants.TestReporting.Action.GetLatestBuild]: {
      schema: GetLatestBuildArgs,
      call: (client, data) => client.getLatestBuild(data.options?.["project_name"], data.options?.["build_name"], data.options?.["user_name"], data.options?.["build_tags"], data.options?.["framework"])
    },
    [Constants.TestReporting.Action.GetBuild]: {
      schema: GetBuildArgs,
      call: (client, data) => client.getBuild(data.positional[0])
    },
    [Constants.TestReporting.Action.UpdateBuild]: {
      schema: UpdateBuildArgs,
      call: (client, data) => client.updateBuild(data.positional[0], data.body)
    },
    [Constants.TestReporting.Action.FinishBuild]: {
      schema: FinishBuildArgs,
      call: (client, data) => client.finishBuild(data.positional[0], data.body)
    },
    [Constants.TestReporting.Action.StartTestRun]: {
      schema: StartTestRunArgs,
      call: (client, data) => client.startTestRun(data.positional[0], data.body)
    },
    [Constants.TestReporting.Action.FinishTestRun]: {
      schema: FinishTestRunArgs,
      call: (client, data) => client.finishTestRun(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestReporting.Action.StartHookRun]: {
      schema: StartHookRunArgs,
      call: (client, data) => client.startHookRun(data.positional[0], data.body)
    },
    [Constants.TestReporting.Action.FinishHookRun]: {
      schema: FinishHookRunArgs,
      call: (client, data) => client.finishHookRun(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestReporting.Action.AddBuildLogs]: {
      schema: AddBuildLogsArgs,
      call: (client, data) => client.addBuildLogs(data.positional[0], data.body)
    },
    [Constants.TestReporting.Action.ListTestRuns]: {
      schema: ListTestRunsArgs,
      call: (client, data) => client.getTestRuns(data.positional[0], data.options?.["re_runs"], data.options?.["test_statuses"], data.options?.["is_flaky"], data.options?.["is_new_failure"], data.options?.["sort"], data.options?.["order"], data.options?.["next_page"])
    },
    [Constants.TestReporting.Action.GetSelfHealingReport]: {
      schema: GetSelfHealingReportArgs,
      call: (client, data) => client.getSelfHealingReport(data.positional[0])
    },
    [Constants.TestReporting.Action.ListQualityGateStatus]: {
      schema: ListQualityGateStatusArgs,
      call: (client, data) => client.getQualityGateStatus(data.positional[0])
    },
    [Constants.TestReporting.Action.ListQualityGateSettings]: {
      schema: ListQualityGateSettingsArgs,
      call: (client, data) => client.getQualityGateSettings(data.positional[0])
    },
    [Constants.TestReporting.Action.UpdateQualityGateSettings]: {
      schema: UpdateQualityGateSettingsArgs,
      call: (client, data) => client.updateQualityGateSettings(data.positional[0], data.body)
    },
    [Constants.TestReporting.Action.CreateQualityGateProfile]: {
      schema: CreateQualityGateProfileArgs,
      call: (client, data) => client.createQualityGateProfile(data.positional[0], data.body)
    },
    [Constants.TestReporting.Action.GetQualityGateProfile]: {
      schema: GetQualityGateProfileArgs,
      call: (client, data) => client.getQualityGateProfile(data.positional[0], data.positional[1])
    },
    [Constants.TestReporting.Action.UpdateQualityGateProfile]: {
      schema: UpdateQualityGateProfileArgs,
      call: (client, data) => client.updateQualityGateProfile(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestReporting.Action.DeleteQualityGateProfile]: {
      schema: DeleteQualityGateProfileArgs,
      call: (client, data) => client.deleteQualityGateProfile(data.positional[0], data.positional[1])
    },
    [Constants.TestReporting.Action.ToggleQualityGateProfile]: {
      schema: ToggleQualityGateProfileArgs,
      call: (client, data) => client.toggleQualityGateProfile(data.positional[0], data.positional[1], data.body)
    },
    [Constants.TestReporting.Action.UploadReport]: {
      schema: UploadReportArgs,
      call: (client, data) => client.uploadReport(data.body)
    },
  };
}

