import { APIClient, APIClientOptions } from "@/api";
import { BrowserStackError } from "@/error";
import { operations } from "@/generated/openapi";
import { FetchOptions } from "openapi-fetch";

/**
 * AppAutomateClient represents a client for interacting with the BrowserStack App Automate API.
 * @see https://www.browserstack.com/app-automate/rest-api
 * @public
 */
export class AppAutomateClient extends APIClient {
  /**
   * Constructs a new instance of the AppAutomateClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://api.browserstack.com",
    });
  }

  /**
   * Retrieves the plan information for App Automate.
   * @param options - The fetch options for the request.
   * @returns A promise that resolves with the plan information.
   */
  getPlan(options?: FetchOptions<operations["getAppAutomatePlan"]>) {
    return this.makeGetRequest("/app-automate/plan.json", options);
  }

  /**
   * Retrieves the list of devices available for App Automate.
   * @param options - The fetch options for the request.
   * @returns A promise that resolves with the list of devices.
   */
  getDevices(options?: FetchOptions<operations["getAppAutomateDevices"]>) {
    return this.makeGetRequest("/app-automate/devices.json", options);
  }

  /**
   * Retrieves the projects from the App Automate API.
   * @param options - The fetch options for the API request.
   * @returns A promise that resolves with the projects.
   */
  getProjects(options?: FetchOptions<operations["getAppAutomateProjects"]>) {
    return this.makeGetRequest("/app-automate/projects.json", options);
  }

  /**
   * Retrieves a project by its ID.
   * @param projectId The ID of the project to retrieve.
   * @param options Additional options for the fetch request.
   * @returns A promise that resolves to the retrieved project.
   */
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

  /**
   * Updates a project in the App Automate API.
   *
   * @param projectId - The ID of the project to update.
   * @param body - The request body containing the updated project data.
   * @param options - Additional options for the request.
   * @returns A promise that resolves with the updated project data.
   */
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

  /**
   * Deletes a project.
   * @param projectId The ID of the project to delete.
   * @param options The fetch options for the delete request.
   * @returns A promise that resolves when the project is successfully deleted.
   */
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

  /**
   * Retrieves the badge key for a specific project.
   * @param projectId The ID of the project.
   * @param options Additional options for the fetch request.
   * @returns A promise that resolves to the badge key.
   */
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

  /**
   * Retrieves a list of builds from the App Automate API.
   *
   * @param query - Optional query parameters for filtering the builds.
   * @param options - Optional fetch options for the API request.
   * @returns A promise that resolves to an array of automation builds.
   */
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

  /**
   * Retrieves information about a specific build.
   * @param id - The ID of the build to retrieve.
   * @param options - Additional options for the fetch request.
   * @returns A promise that resolves to the build information, including the build details and associated sessions.
   */
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

  /**
   * Updates a build in the App Automate API.
   *
   * @param id - The ID of the build to update.
   * @param body - The request body containing the updated build information.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the updated build.
   * @throws {BrowserStackError} If an error occurs during the update.
   */
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
        throw new BrowserStackError(data.error, { response: data });
      }

      return data.automation_build;
    });
  }

  /**
   * Deletes a build with the specified ID.
   * @param id The ID of the build to delete.
   * @param options Additional options for the delete request.
   * @returns A promise that resolves when the build is successfully deleted.
   */
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

  /**
   * Uploads terminal logs for a specific build.
   * @param buildId - The ID of the build.
   * @param body - The request body containing the logs file and its filename.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the response of the request.
   */
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

  /**
   * Uploads terminal logs for a session.
   * @param sessionId - The ID of the session.
   * @param body - The request body containing the logs file and filename.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the response of the request.
   */
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

  /**
   * Retrieves the session details for a given session ID.
   * @param sessionId - The ID of the session to retrieve.
   * @param options - Additional options for the fetch request.
   * @returns A promise that resolves to the automation session data.
   */
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

  /**
   * Updates the status of a session in the App Automate API.
   *
   * @param sessionId - The ID of the session to update.
   * @param body - The request body containing the updated session status.
   * @param options - Additional options for the API request.
   * @returns A Promise that resolves to the updated automation session.
   */
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

  /**
   * Deletes a session in the App Automate API.
   * @param sessionId - The ID of the session to delete.
   * @param options - Additional options for the delete request.
   * @returns A promise that resolves when the session is successfully deleted.
   */
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

  /**
   * Retrieves the session logs for a specific build and session.
   *
   * @param buildId - The ID of the build.
   * @param sessionId - The ID of the session.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the session logs.
   */
  getSessionLogs(
    buildId: string,
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAppAutomateSessionLogs"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}/sessions/{sessionId}/logs", {
      ...options,
      params: {
        path: {
          buildId,
          sessionId,
        },
      },
      parseAs: "text",
    });
  }

  /**
   * Retrieves the device logs for a specific session.
   *
   * @param buildId - The ID of the build.
   * @param sessionId - The ID of the session.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves with the device logs.
   */
  getSessionDeviceLogs(
    buildId: string,
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAppAutomateDeviceLogs"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}/sessions/{sessionId}/devicelogs", {
      ...options,
      params: {
        path: {
          buildId,
          sessionId,
        },
      },
      parseAs: "text",
    });
  }

  /**
   * Retrieves the Appium logs for a specific session.
   *
   * @param buildId - The ID of the build.
   * @param sessionId - The ID of the session.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the Appium logs.
   */
  getSessionAppiumLogs(
    buildId: string,
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAppAutomateAppiumLogs"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}/sessions/{sessionId}/appiumlogs", {
      ...options,
      params: {
        path: {
          buildId,
          sessionId,
        },
      },
      parseAs: "text",
    });
  }

  /**
   * Retrieves the network logs for a specific session in a build.
   * @param buildId The ID of the build.
   * @param sessionId The ID of the session.
   * @param options Additional options for the network logs request.
   * @returns A Promise that resolves to the network logs response.
   */
  getSessionNetworkLogs(
    buildId: string,
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAppAutomateNetworkLogs"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}/sessions/{sessionId}/networklogs", {
      ...options,
      params: {
        path: {
          buildId,
          sessionId,
        },
      },
    });
  }

  /**
   * Retrieves the app profiling data for a specific session in a build.
   * @param buildId The ID of the build.
   * @param sessionId The ID of the session.
   * @param options Additional options for the request.
   * @returns A promise that resolves to the app profiling data.
   */
  getSessionAppProfilingDataV1(
    buildId: string,
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAppAutomateAppProfilingDataV1"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling", {
      ...options,
      params: {
        path: {
          buildId,
          sessionId,
        },
      },
    });
  }

  /**
   * Retrieves the app profiling data for a specific session in a build.
   * @param buildId The ID of the build.
   * @param sessionId The ID of the session.
   * @param options Additional options for the API request.
   * @returns A promise that resolves with the app profiling data.
   */
  getSessionAppProfilingDataV2(
    buildId: string,
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAppAutomateAppProfilingDataV2"]>, "params">
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling/v2", {
      ...options,
      params: {
        path: {
          buildId,
          sessionId,
        },
      },
    });
  }

  /**
   * Uploads a media file to the App Automate API.
   *
   * @param body - The request body containing the media file to upload.
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to the response of the API request.
   */
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

  /**
   * Retrieves the media files associated with the App Automate session.
   *
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to an array of media files, or an empty array if no media files are found.
   */
  getMediaFiles(
    options?: FetchOptions<operations["getAppAutomateMediaFiles"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/recent_media_files",
      options
    ).then((data) => ("message" in data ? [] : data));
  }

  /**
   * Retrieves media files by custom ID.
   * @param customId - The custom ID to filter media files.
   * @param options - Optional fetch options.
   * @returns A promise that resolves to an array of media files or an empty array if no media files are found.
   */
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

  /**
   * Retrieves the group's media files from the App Automate API.
   *
   * @param options - Optional fetch options for the API request.
   * @returns A promise that resolves to an array of group media files, or an empty array if the response contains a "message" property.
   */
  getGroupMediaFiles(
    options?: FetchOptions<operations["getAppAutomateGroupMediaFiles"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/recent_group_media",
      options
    ).then((data) => ("message" in data ? [] : data));
  }

  /**
   * Deletes a media file from the app automate custom media.
   * @param mediaId The ID of the media file to delete.
   * @param options The fetch options for the delete request.
   * @returns A promise that resolves when the media file is successfully deleted.
   */
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

  /**
   * Uploads an Appium app to BrowserStack App Automate.
   *
   * @param body - The request body containing the app file or URL to be uploaded.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the response of the upload request.
   */
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

  /**
   * Retrieves the list of Appium apps from the App Automate API.
   *
   * @param options - Optional fetch options for customizing the request.
   * @returns A promise that resolves to an array of Appium apps, or an empty array if no apps are found.
   */
  getAppiumApps(options?: FetchOptions<operations["getAppAutomateApps"]>) {
    return this.makeGetRequest("/app-automate/recent_apps", options).then(
      (data) => ("message" in data ? [] : data)
    );
  }

  /**
   * Retrieves the Appium apps by custom ID.
   * @param customId The custom ID of the app.
   * @param options The fetch options for the request.
   * @returns A promise that resolves to the retrieved Appium apps.
   */
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

  /**
   * Retrieves the list of App Automate apps for the group using the specified fetch options.
   * @param options The fetch options for the request.
   * @returns A promise that resolves to the list of group apps, or an empty array if there is a "message" property in the response data.
   */
  getAppiumGroupApps(
    options?: FetchOptions<operations["getAppAutomateGroupApps"]>
  ) {
    return this.makeGetRequest("/app-automate/recent_group_apps", options).then(
      (data) => ("message" in data ? [] : data)
    );
  }

  /**
   * Deletes an Appium app.
   *
   * @param appId - The ID of the app to delete.
   * @param options - Optional fetch options for the delete request.
   * @returns A promise that resolves when the app is successfully deleted.
   */
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

  /**
   * Uploads a Flutter app for App Automate.
   *
   * @param body - The request body containing the app file or URL and other optional parameters.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the response of the request.
   */
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

  /**
   * Retrieves the list of Flutter apps for Android.
   *
   * @param options - The fetch options for the request.
   * @returns A promise that resolves to an array of Flutter apps, or an empty array if no apps are found.
   */
  getFlutterApps(
    options?: FetchOptions<operations["getAppAutomateFlutterApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/flutter-integration-tests/v2/android/apps",
      options
    ).then((data) => ("apps" in data ? data.apps : []));
  }

  /**
   * Retrieves the Flutter app with the specified appId.
   * @param appId The ID of the Flutter app to retrieve.
   * @param options The fetch options for the request.
   * @returns A promise that resolves to the retrieved Flutter app.
   */
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

  /**
   * Deletes a Flutter app from the BrowserStack App Automate service.
   * @param appId The ID of the app to delete.
   * @param options The fetch options for the delete request.
   * @returns A promise that resolves when the app is successfully deleted.
   */
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

  /**
   * Uploads an Espresso app to BrowserStack.
   *
   * @param body - The request body containing the app file or URL.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the response from the server.
   */
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

  /**
   * Retrieves the Espresso apps from the App Automate API.
   * @param options - The fetch options for the API request.
   * @returns A promise that resolves to an array of Espresso apps.
   */
  getEspressoApps(
    options?: FetchOptions<operations["getAppAutomateEspressoApps"]>
  ) {
    return this.makeGetRequest("/app-automate/espresso/v2/apps", options).then(
      (data) => ("apps" in data ? data.apps : [])
    );
  }

  /**
   * Retrieves the Espresso app with the specified appId.
   * @param appId The ID of the Espresso app to retrieve.
   * @param options The fetch options for the request.
   * @returns A promise that resolves to the retrieved Espresso app.
   */
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

  /**
   * Deletes an Espresso app.
   * @param appId The ID of the app to delete.
   * @param options The fetch options for the delete request.
   * @returns A promise that resolves when the app is deleted.
   */
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

  /**
   * Uploads an XCUITest app to BrowserStack App Automate.
   *
   * @param body - The request body containing the XCUITest app file or URL.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the response of the request.
   */
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

  /**
   * Retrieves the XCUITest apps available in the BrowserStack App Automate.
   * @param options - The fetch options for the request.
   * @returns A promise that resolves to an array of XCUITest apps.
   */
  getXCUITestApps(
    options?: FetchOptions<operations["getAppAutomateXCUITestApps"]>
  ) {
    return this.makeGetRequest("/app-automate/xcuitest/v2/apps", options).then(
      (data) => ("apps" in data ? data.apps : [])
    );
  }

  /**
   * Retrieves the XCUITest app with the specified appId.
   * @param appId The ID of the XCUITest app to retrieve.
   * @param options The fetch options for the request.
   * @returns A promise that resolves to the XCUITest app.
   */
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

  /**
   * Deletes an XCUITest app.
   * @param appId The ID of the app to delete.
   * @param options The fetch options for the delete request.
   * @returns A promise that resolves when the app is successfully deleted.
   */
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
