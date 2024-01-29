import { APIClient, APIClientOptions } from "@/api";
import { operations } from "./generated/openapi";
import { FetchOptions } from "openapi-fetch";

export default class AppAutomateClient extends APIClient {
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://api.browserstack.com",
    });
  }

  getPlan(options?: FetchOptions<operations["getAppAutomatePlan"]>) {
    return this.makeGetRequest("/app-automate/plan.json", options);
  }

  getDevices(options?: FetchOptions<operations["getAppAutomateDevices"]>) {
    return this.makeGetRequest("/app-automate/devices.json", options);
  }

  getProjects(options?: FetchOptions<operations["getAppAutomateProjects"]>) {
    return this.makeGetRequest("/app-automate/projects.json", options);
  }

  getProject(projectId: number, options?: FetchOptions<operations["getAppAutomateProject"]>) {
    return this.makeGetRequest("/app-automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId,
        },
      },
    }).then((data) => data.project);
  }

  updateProject(
    projectId: number,
    body: operations["updateAppAutomateProject"]["requestBody"]["content"]["application/json"],
    options?: Omit<
      FetchOptions<operations["updateAppAutomateProject"]>,
      "params" | "body"
    >
  ) {
    return this.makePutRequest("/app-automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId,
        },
      },
      body,
    });
  }

  deleteProject(
    projectId: number,
    options?: FetchOptions<operations["deleteAppAutomateProject"]>
  ) {
    return this.makeDeleteRequest("/app-automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId,
        },
      },
    });
  }

  getBadgeKey(
    projectId: number,
    options?: Omit<
      FetchOptions<operations["getAppAutomateProjectBadgeKey"]>,
      "params"
    >
  ) {
    return this.makeGetRequest("/app-automate/projects/{projectId}/badge_key", {
      ...options,
      params: {
        path: {
          projectId,
        },
      },
      parseAs: "text",
    });
  }

  getBuilds(
    query?: operations["getAppAutomateBuilds"]["parameters"]["query"],
    options?: FetchOptions<operations["getAppAutomateBuilds"]>
  ) {
    return this.makeGetRequest("/app-automate/builds.json", {
      ...options,
      params: {
        query,
      },
    }).then((data) => data.map((build) => build.automation_build));
  }

  getBuild(
    id: string,
    options?: Omit<FetchOptions<operations["getAppAutomateBuild"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}.json", {
      ...options,
      params: {
        path: {
          buildId: id,
        },
      },
    }).then((data) => ({
      ...data.build.automation_build,
      sessions: data.build.sessions.map(
        (session) => session.automation_session
      ),
    }));
  }

  updateBuild(
    id: string,
    body: operations["updateAppAutomateBuild"]["requestBody"]["content"]["application/json"],
    options?: Omit<
      FetchOptions<operations["updateAppAutomateBuild"]>,
      "params" | "body"
    >
  ) {
    return this.makePutRequest("/app-automate/builds/{buildId}.json", {
      ...options,
      body,
      params: {
        path: {
          buildId: id,
        },
      },
    }).then((data) => {
      if ('error' in data) {
        throw new Error(JSON.stringify(data.error));
      }

      return data.automation_build;
    });
  }

  deleteBuild(
    id: string,
    options?: Omit<FetchOptions<operations["deleteAppAutomateBuild"]>, "params">
  ) {
    return this.makeDeleteRequest("/app-automate/builds/{buildId}.json", {
      ...options,
      params: {
        path: {
          buildId: id,
        },
      },
    });
  }

  uploadBuildTerminalLogs(
    buildId: string,
    body: operations["uploadAppAutomateBuildTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateBuildTerminalLogs"]>,
      "params" | "body"
    >
  ) {
    // makePostRequest produces a non-JSON response
    return this.makeCloudPostRequest("/app-automate/builds/{buildId}/terminallogs", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        formData.append("file", body.file, body.filename);
        return formData;
      },
      params: {
        path: {
          buildId,
        },
      },
    });
  }

  uploadSessionTerminalLogs(
    sessionId: string,
    body: operations["uploadAppAutomateSessionTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateSessionTerminalLogs"]>,
      "params" | "body"
    >
  ) {
    // makePostRequest produces a non-JSON response
    return this.makeCloudPostRequest("/app-automate/sessions/{sessionId}/terminallogs", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        formData.append("file", body.file, body.filename);
        return formData;
      },
      params: {
        path: {
          sessionId,
        },
      },
    });
  }

  getSession(
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAppAutomateSession"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/sessions/{sessionId}.json", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
    }).then((data) => data.automation_session);
  }

  updateSessionStatus(
    sessionId: string,
    body: operations["updateAppAutomateSession"]["requestBody"]["content"]["application/json"],
    options?: Omit<
      FetchOptions<operations["updateAppAutomateSession"]>,
      "params" | "body"
    >
  ) {
    return this.makePutRequest("/app-automate/sessions/{sessionId}.json", {
      ...options,
      body,
      params: {
        path: {
          sessionId,
        },
      },
    }).then((data) => data.automation_session);
  }

  deleteSession(
    sessionId: string,
    options?: Omit<FetchOptions<operations["deleteAppAutomateSession"]>, "params">
  ) {
    return this.makeDeleteRequest("/app-automate/sessions/{sessionId}.json", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
    });
  }

  uploadMediaFile(
    body: operations["uploadAppAutomateMediaFile"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateMediaFile"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest("/app-automate/upload-media", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        formData.append("file", body.file, body.filename);

        if (body.custom_id) {
          formData.append("custom_id", body.custom_id);
        }

        return formData;
      },
    });
  }

  getMediaFiles(
    options?: FetchOptions<operations["getAppAutomateMediaFiles"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/recent_media_files",
      options
    ).then((data) => ("message" in data ? [] : data));
  }

  getMediaFilesByCustomId(
    customId: string,
    options?: FetchOptions<operations["getAppAutomateMediaFilesByCustomId"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_media_files/{customId}", {
      ...options,
      params: {
        path: {
          customId,
        },
      },
    }).then((data) => ("message" in data ? [] : data));
  }

  getGroupMediaFiles(
    options?: FetchOptions<operations["getAppAutomateGroupMediaFiles"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/recent_group_media",
      options
    ).then((data) => ("message" in data ? [] : data));
  }

  deleteMediaFile(
    mediaId: string,
    options?: FetchOptions<operations["deleteAppAutomateMediaFile"]>
  ) {
    return this.makeDeleteRequest(
      "/app-automate/custom_media/delete/{mediaId}",
      {
        ...options,
        params: {
          path: {
            mediaId,
          },
        },
      }
    );
  }

  uploadAppiumApp(
    body: operations["uploadAppAutomateApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest("/app-automate/upload", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        if ("file" in body) {
          formData.append("file", body.file, body.filename);
        } else {
          formData.append("url", body.url);
        }

        if (body.custom_id) {
          formData.append("custom_id", body.custom_id);
        }

        return formData;
      },
    });
  }

  getAppiumApps(options?: FetchOptions<operations["getAppAutomateApps"]>) {
    return this.makeGetRequest("/app-automate/recent_apps", options).then(
      (data) => ("message" in data ? [] : data)
    );
  }

  getAppiumAppsByCustomId(
    customId: string,
    options?: FetchOptions<operations["getAppAutomateAppsByCustomId"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_apps/{customId}", {
      ...options,
      params: {
        path: {
          customId,
        },
      },
    }).then((data) => ("message" in data ? [] : data));
  }

  getAppiumGroupApps(
    options?: FetchOptions<operations["getAppAutomateGroupApps"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_group_apps", options).then(
      (data) => ("message" in data ? [] : data)
    );
  }

  deleteAppiumApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateApp"]>
  ) {
    return this.makeDeleteRequest("/app-automate/app/delete/{appId}", {
      ...options,
      params: {
        path: {
          appId,
        },
      },
    });
  }

  uploadFlutterApp(
    body: operations["uploadAppAutomateFlutterApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateFlutterApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest(
      "/app-automate/flutter-integration-tests/v2/android/app",
      {
        ...options,
        body,
        bodySerializer: () => {
          const formData = new FormData();
          if ("file" in body) {
            formData.append("file", body.file, body.filename);
          } else {
            formData.append("url", body.url);
          }

          if (body.custom_id) {
            formData.append("custom_id", body.custom_id);
          }

          return formData;
        },
      }
    );
  }

  getFlutterApps(
    options?: FetchOptions<operations["getAppAutomateFlutterApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/flutter-integration-tests/v2/android/apps",
      options
    ).then((data) => ("apps" in data ? data.apps : []));
  }

  getFlutterApp(
    appId: string,
    options?: FetchOptions<operations["getAppAutomateFlutterApp"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      {
        ...options,
        params: {
          path: {
            appId,
          },
        },
      }
    ).then((data) => data.app);
  }

  deleteFlutterApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateFlutterApp"]>
  ) {
    return this.makeDeleteRequest(
      "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
      {
        ...options,
        params: {
          path: {
            appId,
          },
        },
      }
    );
  }

  uploadEspressoApp(
    body: operations["uploadAppAutomateEspressoApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateEspressoApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest("/app-automate/espresso/v2/app", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        if ("file" in body) {
          formData.append("file", body.file, body.filename);
        } else {
          formData.append("url", body.url);
        }

        if (body.custom_id) {
          formData.append("custom_id", body.custom_id);
        }

        return formData;
      },
    });
  }

  getEspressoApps(
    options?: FetchOptions<operations["getAppAutomateEspressoApps"]>
  ) {
    return this.makeGetRequest("/app-automate/espresso/v2/apps", options).then(
      (data) => ("apps" in data ? data.apps : [])
    );
  }

  getEspressoApp(
    appId: string,
    options?: FetchOptions<operations["getAppAutomateEspressoApp"]>
  ) {
    return this.makeGetRequest("/app-automate/espresso/v2/apps/{appId}", {
      ...options,
      params: {
        path: {
          appId,
        },
      },
    }).then((data) => data.app);
  }

  deleteEspressoApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateEspressoApp"]>
  ) {
    return this.makeDeleteRequest("/app-automate/espresso/v2/apps/{appId}", {
      ...options,
      params: {
        path: {
          appId,
        },
      },
    });
  }

  uploadXCUITestApp(
    body: operations["uploadAppAutomateXCUITestApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAppAutomateXCUITestApp"]>,
      "params" | "body"
    >
  ) {
    return this.makePostRequest("/app-automate/xcuitest/v2/app", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        if ("file" in body) {
          formData.append("file", body.file, body.filename);
        } else {
          formData.append("url", body.url);
        }

        if (body.custom_id) {
          formData.append("custom_id", body.custom_id);
        }

        return formData;
      },
    });
  }

  getXCUITestApps(
    options?: FetchOptions<operations["getAppAutomateXCUITestApps"]>
  ) {
    return this.makeGetRequest("/app-automate/xcuitest/v2/apps", options).then(
      (data) => ("apps" in data ? data.apps : [])
    );
  }

  getXCUITestApp(
    appId: string,
    options?: FetchOptions<operations["getAppAutomateXCUITestApp"]>
  ) {
    return this.makeGetRequest("/app-automate/xcuitest/v2/apps/{appId}", {
      ...options,
      params: {
        path: {
          appId,
        },
      },
    }).then((data) => data.app);
  }

  deleteXCUITestApp(
    appId: string,
    options?: FetchOptions<operations["deleteAppAutomateXCUITestApp"]>
  ) {
    return this.makeDeleteRequest("/app-automate/xcuitest/v2/apps/{appId}", {
      ...options,
      params: {
        path: {
          appId,
        },
      },
    });
  }
}
