import {
  APIClient,
  APIFetchOptions,
  BrowserStackOptions,
} from "@browserstack-client/core";
import { BrowserStackError } from "@browserstack-client/core";
import { components, operations, paths } from "@browserstack-client/openapi/app-automate";

/**
 * AppAutomateClient represents a client for interacting with the BrowserStack App Automate API.
 * @see https://www.browserstack.com/app-automate/rest-api
 * @public
 */
export class AppAutomateClient extends APIClient<paths> {
  /**
   * Constructs a new instance of the AppAutomateClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/app-automate",
      "6.0.0"
    );
  }

  /**
   * Retrieves the plan information for App Automate.
   * @param options - The fetch options for the request.
   * @returns A promise that resolves with the plan information.
   */
  getPlan(options?: APIFetchOptions<operations["getAppAutomatePlan"]>) {
    return this.makeGetRequest("/app-automate/plan.json", options);
  }

  /**
   * Retrieves the list of devices available for App Automate.
   * @param options - The fetch options for the request.
   * @returns A promise that resolves with the list of devices.
   */
  getDevices(options?: APIFetchOptions<operations["getAppAutomateDevices"]>) {
    return this.makeGetRequest("/app-automate/devices.json", options);
  }

  /**
   * Retrieves the projects from the App Automate API.
   * @param options - The fetch options for the API request.
   * @returns A promise that resolves with the projects.
   */
  getProjects(options?: APIFetchOptions<operations["getAppAutomateProjects"]>) {
    return this.makeGetRequest("/app-automate/projects.json", options);
  }

  /**
   * Retrieves a project by its ID.
   * @param projectId The ID of the project to retrieve.
   * @param options Additional options for the fetch request.
   * @returns A promise that resolves to the retrieved project.
   */
  getProject(
    projectId: number,
    options?: APIFetchOptions<operations["getAppAutomateProject"]>
  ) {
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
    options?: APIFetchOptions<operations["updateAppAutomateProject"]>
  ) {
    return this.makePutRequest("/app-automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId,
        },
      },
      body,
    }).then((data) => {
      if ("project" in data) {
        return data.project;
      }
      return data;
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
    options?: APIFetchOptions<operations["deleteAppAutomateProject"]>
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
    options?: APIFetchOptions<operations["getAppAutomateProjectBadgeKey"]>
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
    options?: APIFetchOptions<operations["getAppAutomateBuilds"]>
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
   * @param buildId - The ID of the build to retrieve.
   * @param options - Additional options for the fetch request.
   * @returns A promise that resolves to the build information, including the build details and associated sessions.
   */
  getBuild(
    buildId: string,
    options?: APIFetchOptions<operations["getAppAutomateBuild"]>
  ) {
    return this.makeGetRequest("/app-automate/builds/{buildId}.json", {
      ...options,
      params: {
        path: {
          buildId,
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
   * @param buildId - The ID of the build to update.
   * @param body - The request body containing the updated build information.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the updated build.
   * @throws {BrowserStackError} If an error occurs during the update.
   */
  updateBuild(
    buildId: string,
    body: operations["updateAppAutomateBuild"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["updateAppAutomateBuild"]>
  ) {
    return this.makePutRequest("/app-automate/builds/{buildId}.json", {
      ...options,
      body,
      params: {
        path: {
          buildId,
        },
      },
    }).then((data) => {
      if ("error" in data) {
        throw new BrowserStackError(data.error, { response: data });
      }

      return data.automation_build;
    });
  }

  /**
   * Deletes a build with the specified ID.
   * @param buildId The ID of the build to delete.
   * @param options Additional options for the delete request.
   * @returns A promise that resolves when the build is successfully deleted.
   */
  deleteBuild(
    buildId: string,
    options?: APIFetchOptions<operations["deleteAppAutomateBuild"]>
  ) {
    return this.makeDeleteRequest("/app-automate/builds/{buildId}.json", {
      ...options,
      params: {
        path: {
          buildId,
        },
      },
    });
  }

  /**
   * Uploads terminal logs for a specific build.
   * @param buildId - The ID of the build.
   * @param data - The request body containing the logs file and its filename.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the response of the request.
   */
  uploadBuildTerminalLogs(
    buildId: string,
    data: operations["uploadAppAutomateBuildTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAppAutomateBuildTerminalLogs"]>
  ) {
    return this.makeCloudPostRequest(
      "/app-automate/builds/{buildId}/terminallogs",
      {
        ...options,
        body: data,
        bodySerializer: (body) => {
          const formData = new FormData();
          formData.append("file", body.file, data.filename);
          return formData;
        },
        params: {
          path: {
            buildId,
          },
        },
      }
    );
  }

  /**
   * Uploads terminal logs for a session.
   * @param sessionId - The ID of the session.
   * @param data - The request body containing the logs file and filename.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the response of the request.
   */
  uploadSessionTerminalLogs(
    sessionId: string,
    data: operations["uploadAppAutomateSessionTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAppAutomateSessionTerminalLogs"]>
  ) {
    return this.makeCloudPostRequest(
      "/app-automate/sessions/{sessionId}/terminallogs",
      {
        ...options,
        body: data,
        bodySerializer: (body) => {
          const formData = new FormData();
          formData.append("file", body.file, data.filename);
          return formData;
        },
        params: {
          path: {
            sessionId,
          },
        },
      }
    );
  }

  /**
   * Retrieves the session details for a given session ID.
   * @param sessionId - The ID of the session to retrieve.
   * @param options - Additional options for the fetch request.
   * @returns A promise that resolves to the automation session data.
   */
  getSession(
    sessionId: string,
    options?: APIFetchOptions<operations["getAppAutomateSession"]>
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
    options?: APIFetchOptions<operations["updateAppAutomateSession"]>
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
    options?: APIFetchOptions<operations["deleteAppAutomateSession"]>
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
    options?: APIFetchOptions<operations["getAppAutomateSessionLogs"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/builds/{buildId}/sessions/{sessionId}/logs",
      {
        ...options,
        params: {
          path: {
            buildId,
            sessionId,
          },
        },
        parseAs: "text",
      }
    );
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
    options?: APIFetchOptions<operations["getAppAutomateDeviceLogs"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/builds/{buildId}/sessions/{sessionId}/devicelogs",
      {
        ...options,
        params: {
          path: {
            buildId,
            sessionId,
          },
        },
        parseAs: "text",
      }
    );
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
    options?: APIFetchOptions<operations["getAppAutomateAppiumLogs"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/builds/{buildId}/sessions/{sessionId}/appiumlogs",
      {
        ...options,
        params: {
          path: {
            buildId,
            sessionId,
          },
        },
        parseAs: "text",
      }
    );
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
    options?: APIFetchOptions<operations["getAppAutomateNetworkLogs"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/builds/{buildId}/sessions/{sessionId}/networklogs",
      {
        ...options,
        params: {
          path: {
            buildId,
            sessionId,
          },
        },
      }
    );
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
    options?: APIFetchOptions<operations["getAppAutomateAppProfilingDataV1"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling",
      {
        ...options,
        params: {
          path: {
            buildId,
            sessionId,
          },
        },
      }
    );
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
    options?: APIFetchOptions<operations["getAppAutomateAppProfilingDataV2"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/builds/{buildId}/sessions/{sessionId}/appprofiling/v2",
      {
        ...options,
        params: {
          path: {
            buildId,
            sessionId,
          },
        },
      }
    );
  }

  /**
   * Uploads a media file to the App Automate API.
   *
   * @param data - The request body containing the media file to upload.
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to the response of the API request.
   */
  uploadMediaFile(
    data: operations["uploadAppAutomateMediaFile"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAppAutomateMediaFile"]>
  ) {
    return this.makePostRequest("/app-automate/upload-media", {
      ...options,
      body: data,
      bodySerializer: (body) => {
        const formData = new FormData();
        formData.append("file", body.file, data.filename);

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
    options?: APIFetchOptions<operations["getAppAutomateMediaFiles"]>
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
    options?: APIFetchOptions<operations["getAppAutomateMediaFilesByCustomId"]>
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
    options?: APIFetchOptions<operations["getAppAutomateGroupMediaFiles"]>
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
    options?: APIFetchOptions<operations["deleteAppAutomateMediaFile"]>
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
   * @param data - The request body containing the app file or URL to be uploaded.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the response of the upload request.
   */
  uploadAppiumApp(
    data: operations["uploadAppAutomateApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAppAutomateApp"]>
  ) {
    return this.makePostRequest("/app-automate/upload", {
      ...options,
      body: data,
      bodySerializer: (body) => {
        const formData = new FormData();
        if ("file" in body) {
          formData.append("file", body.file, data.filename);
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
  getAppiumApps(options?: APIFetchOptions<operations["getAppAutomateApps"]>) {
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
    options?: APIFetchOptions<operations["getAppAutomateAppsByCustomId"]>
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
   * Retrieves the list of App Automate apps for the group.
   * @param options The fetch options for the request.
   * @returns A promise that resolves to the list of group apps, or an empty array if there is a "message" property in the response data.
   */
  getAppiumGroupApps(
    options?: APIFetchOptions<operations["getAppAutomateGroupApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/recent_group_apps",
      options
    ).then((data) => ("message" in data ? [] : data));
  }

  /**
   * Deletes an app from the custom app storage.
   * @param appId The ID of the app to delete.
   * @param options The fetch options for the delete request.
   * @returns A promise that resolves when the app is successfully deleted.
   */
  deleteAppiumApp(
    appId: string,
    options?: APIFetchOptions<operations["deleteAppAutomateApp"]>
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
   * Retrieves sessions from the App Automate API filtered by build and/or status.
   *
   * @param query - Optional query parameters for filtering the sessions.
   * @param options - Optional fetch options for the API request.
   * @returns A Promise that resolves to an array of automation sessions.
   */
  getSessions(
    query?: operations["getAppAutomateSessions"]["parameters"]["query"],
    options?: APIFetchOptions<operations["getAppAutomateSessions"]>
  ) {
    return this.makeGetRequest("/app-automate/sessions.json", {
      ...options,
      params: {
        query,
      },
    }).then((data) => data.map((session) => session.automation_session));
  }

  /**
   * @internal
   * Creates a bodySerializer for multipart/form-data upload requests.
   */
  private static appUploadSerializer(filename: string) {
    return (body: Record<string, unknown>) => {
      const formData = new FormData();
      if ("file" in body) {
        formData.append("file", body.file as Blob, filename);
      } else if ("url" in body) {
        formData.append("url", String(body.url));
      }
      if (body.custom_id) {
        formData.append("custom_id", String(body.custom_id));
      }
      return formData;
    };
  }

  // --- Flutter Apps ---

  uploadFlutterApp(
    platform: "android",
    data: operations["uploadAppAutomateFlutterAndroidApp"]["requestBody"]["content"]["multipart/form-data"] & { filename: string },
    options?: APIFetchOptions<operations["uploadAppAutomateFlutterAndroidApp"]>
  ): Promise<components["schemas"]["AppAutomateApp"]>;
  uploadFlutterApp(
    platform: "ios",
    data: operations["uploadAppAutomateFlutteriOSApp"]["requestBody"]["content"]["multipart/form-data"] & { filename: string },
    options?: APIFetchOptions<operations["uploadAppAutomateFlutteriOSApp"]>
  ): Promise<components["schemas"]["AppAutomateTestPackage"]>;
  uploadFlutterApp(
    platform: "android" | "ios",
    data: (operations["uploadAppAutomateFlutterAndroidApp"]["requestBody"]["content"]["multipart/form-data"] | operations["uploadAppAutomateFlutteriOSApp"]["requestBody"]["content"]["multipart/form-data"]) & { filename: string },
    options?: APIFetchOptions<operations["uploadAppAutomateFlutterAndroidApp"]>
  ) {
    if (platform === "android") {
      return this.makePostRequest("/app-automate/flutter-integration-tests/v2/android/app", {
        ...options,
        body: data,
        bodySerializer: AppAutomateClient.appUploadSerializer(data.filename),
      });
    }

    return this.makePostRequest("/app-automate/flutter-integration-tests/v2/ios/test-package", {
      ...options,
      body: data,
      bodySerializer: AppAutomateClient.appUploadSerializer(data.filename),
    });
  }

  getFlutterApps(
    platform: "android",
    options?: APIFetchOptions<operations["getAppAutomateFlutterAndroidApps"]>
  ): Promise<components["schemas"]["AppAutomateApp"][]>;
  getFlutterApps(
    platform: "ios",
    options?: APIFetchOptions<operations["getAppAutomateFlutteriOSApps"]>
  ): Promise<components["schemas"]["AppAutomateTestPackage"][]>;
  getFlutterApps(
    platform: "android" | "ios",
    options?: APIFetchOptions<operations["getAppAutomateFlutterAndroidApps"]>
  ) {
    if (platform === "android") {
      return this.makeGetRequest(
        "/app-automate/flutter-integration-tests/v2/android/apps",
        options
      ).then((data) => ("message" in data ? [] : data.apps));
    }

    return this.makeGetRequest(
      "/app-automate/flutter-integration-tests/v2/ios/test-packages",
      options
    ).then((data) => ("message" in data ? [] : data.test_packages));
  }

  getFlutterApp(
    platform: "android",
    appId: string,
    options?: APIFetchOptions<operations["getAppAutomateFlutterAndroidApp"]>
  ): Promise<components["schemas"]["AppAutomateApp"]>;
  getFlutterApp(
    platform: "ios",
    appId: string,
    options?: APIFetchOptions<operations["getAppAutomateFlutteriOSApp"]>
  ): Promise<components["schemas"]["AppAutomateTestPackage"]>;
  getFlutterApp(
    platform: "android" | "ios",
    appId: string,
    options?: APIFetchOptions<operations["getAppAutomateFlutterAndroidApp"]>
  ) {
    if (platform === "android") {
      return this.makeGetRequest(
        "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
        { ...options, params: { path: { appId } } }
      ).then((data) => data.app);
    }

    return this.makeGetRequest(
      "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      { ...options, params: { path: { appId } } }
    ).then((data) => data.test_package);
  }

  deleteFlutterApp(
    platform: "android",
    appId: string,
    options?: APIFetchOptions<operations["deleteAppAutomateFlutterAndroidApp"]>
  ): ReturnType<typeof this.makeDeleteRequest<"/app-automate/flutter-integration-tests/v2/android/apps/{appId}">>;
  deleteFlutterApp(
    platform: "ios",
    appId: string,
    options?: APIFetchOptions<operations["deleteAppAutomateFlutteriOSApp"]>
  ): ReturnType<typeof this.makeDeleteRequest<"/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}">>;
  deleteFlutterApp(
    platform: "android" | "ios",
    appId: string,
    options?: APIFetchOptions<operations["deleteAppAutomateFlutterAndroidApp"]>
  ) {
    if (platform === "android") {
      return this.makeDeleteRequest(
        "/app-automate/flutter-integration-tests/v2/android/apps/{appId}",
        { ...options, params: { path: { appId } } }
      );
    }

    return this.makeDeleteRequest(
      "/app-automate/flutter-integration-tests/v2/ios/test-package/{appId}",
      { ...options, params: { path: { appId } } }
    );
  }

  // --- Espresso Apps ---

  uploadEspressoApp(
    data: operations["uploadAppAutomateEspressoApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAppAutomateEspressoApp"]>
  ) {
    return this.makePostRequest("/app-automate/espresso/v2/app", {
      ...options,
      body: data,
      bodySerializer: AppAutomateClient.appUploadSerializer(data.filename),
    });
  }

  getEspressoApps(
    options?: APIFetchOptions<operations["getAppAutomateEspressoApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/espresso/v2/apps",
      options
    ).then((data) => ("message" in data ? [] : data.apps));
  }

  getEspressoApp(
    appId: string,
    options?: APIFetchOptions<operations["getAppAutomateEspressoApp"]>
  ) {
    return this.makeGetRequest("/app-automate/espresso/v2/apps/{appId}", {
      ...options,
      params: {
        path: { appId },
      },
    }).then((data) => data.app);
  }

  deleteEspressoApp(
    appId: string,
    options?: APIFetchOptions<operations["deleteAppAutomateEspressoApp"]>
  ) {
    return this.makeDeleteRequest("/app-automate/espresso/v2/apps/{appId}", {
      ...options,
      params: {
        path: { appId },
      },
    });
  }

  // --- XCUITest Apps ---

  uploadXCUITestApp(
    data: operations["uploadAppAutomateXCUITestApp"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAppAutomateXCUITestApp"]>
  ) {
    return this.makePostRequest("/app-automate/xcuitest/v2/app", {
      ...options,
      body: data,
      bodySerializer: AppAutomateClient.appUploadSerializer(data.filename),
    });
  }

  getXCUITestApps(
    options?: APIFetchOptions<operations["getAppAutomateXCUITestApps"]>
  ) {
    return this.makeGetRequest(
      "/app-automate/xcuitest/v2/apps",
      options
    ).then((data) => ("message" in data ? [] : data.apps));
  }

  getXCUITestApp(
    appId: string,
    options?: APIFetchOptions<operations["getAppAutomateXCUITestApp"]>
  ) {
    return this.makeGetRequest("/app-automate/xcuitest/v2/apps/{appId}", {
      ...options,
      params: {
        path: { appId },
      },
    }).then((data) => data.app);
  }

  deleteXCUITestApp(
    appId: string,
    options?: APIFetchOptions<operations["deleteAppAutomateXCUITestApp"]>
  ) {
    return this.makeDeleteRequest("/app-automate/xcuitest/v2/apps/{appId}", {
      ...options,
      params: {
        path: { appId },
      },
    });
  }

  // --- Detox Android Apps ---

  uploadDetoxAndroidApp(
    type: "app",
    data: operations["uploadAppAutomateDetoxAndroidApp"]["requestBody"]["content"]["multipart/form-data"] & { filename: string },
    options?: APIFetchOptions<operations["uploadAppAutomateDetoxAndroidApp"]>
  ): ReturnType<typeof this.makePostRequest<"/app-automate/detox/v2/android/app">>;
  uploadDetoxAndroidApp(
    type: "app-client",
    data: operations["uploadAppAutomateDetoxAndroidAppClient"]["requestBody"]["content"]["multipart/form-data"] & { filename: string },
    options?: APIFetchOptions<operations["uploadAppAutomateDetoxAndroidAppClient"]>
  ): ReturnType<typeof this.makePostRequest<"/app-automate/detox/v2/android/app-client">>;
  uploadDetoxAndroidApp(
    type: "app" | "app-client",
    data: operations["uploadAppAutomateDetoxAndroidApp"]["requestBody"]["content"]["multipart/form-data"] & { filename: string },
    options?: APIFetchOptions<operations["uploadAppAutomateDetoxAndroidApp"]>
  ) {
    if (type === "app") {
      return this.makePostRequest("/app-automate/detox/v2/android/app", {
        ...options,
        body: data,
        bodySerializer: AppAutomateClient.appUploadSerializer(data.filename),
      });
    }

    return this.makePostRequest("/app-automate/detox/v2/android/app-client", {
      ...options,
      body: data,
      bodySerializer: AppAutomateClient.appUploadSerializer(data.filename),
    });
  }
}
