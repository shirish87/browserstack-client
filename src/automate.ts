import { APIClient, BrowserStackOptions, APIFetchOptions } from "@/api-client";
import { BrowserStackError } from "@/error";
import { operations } from "@/generated/openapi";

/**
 * AutomateClient represents a client for interacting with the BrowserStack Automate API.
 * @see https://www.browserstack.com/automate/rest-api
 * @public
 */
export class AutomateClient extends APIClient {
  /**
   * Constructs a new instance of the AutomateClient class.
   * @param options - Options to customize the client.
   */
  constructor(options?: BrowserStackOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://api.browserstack.com",
    });
  }

  /**
   * Recycles the automate key.
   * @param options The fetch options for the request.
   * @returns {} A promise that resolves to the response of the request.
   */
  recycleKey(options?: APIFetchOptions<operations["recycleAutomateKey"]>) {
    return this.makePutRequest("/automate/recycle_key.json", options);
  }

  /**
   * Retrieves the automate plan.
   * @param options - The fetch options for the request.
   * @returns A promise that resolves with the automate plan.
   */
  getPlan(options?: APIFetchOptions<operations["getAutomatePlan"]>) {
    return this.makeGetRequest("/automate/plan.json", options);
  }

  /**
   * Retrieves the list of available browsers for BrowserStack Automate.
   * @param options - Optional fetch options for customizing the request.
   * @returns A Promise that resolves to the list of available browsers.
   */
  getBrowsers(options?: APIFetchOptions<operations["getAutomateBrowsers"]>) {
    return this.makeGetRequest("/automate/browsers.json", options);
  }

  /**
   * Retrieves the projects from the BrowserStack Automate API.
   * @param options - The fetch options for the API request.
   * @returns A promise that resolves with the projects data.
   */
  getProjects(options?: APIFetchOptions<operations["getAutomateProjects"]>) {
    return this.makeGetRequest("/automate/projects.json", options);
  }

  /**
   * Retrieves a project by its ID.
   * @param projectId The ID of the project to retrieve.
   * @param options Additional options for the fetch request.
   * @returns A promise that resolves to the retrieved project.
   */
  getProject(
    projectId: number,
    options?: APIFetchOptions<operations["getAutomateProject"]>
  ) {
    return this.makeGetRequest("/automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId,
        },
      },
    }).then((data) => data.project);
  }

  /**
   * Updates a project with the specified ID.
   *
   * @param projectId - The ID of the project to update.
   * @param body - The request body containing the updated project details.
   * @param options - Additional options for the request.
   * @returns A promise that resolves with the updated project.
   */
  updateProject(
    projectId: number,
    body: operations["updateAutomateProject"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["updateAutomateProject"]>
  ) {
    return this.makePutRequest("/automate/projects/{projectId}.json", {
      ...options,
      body,
      params: {
        path: {
          projectId,
        },
      },
    });
  }

  /**
   * Deletes a project with the specified ID.
   * @param projectId The ID of the project to delete.
   * @param options Additional options for the delete request.
   * @returns A promise that resolves when the project is successfully deleted.
   */
  deleteProject(
    projectId: number,
    options?: APIFetchOptions<operations["deleteAutomateProject"]>
  ) {
    return this.makeDeleteRequest("/automate/projects/{projectId}.json", {
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
   * @param options Additional options for the request.
   * @returns A promise that resolves to the badge key.
   */
  getBadgeKey(
    projectId: number,
    options?: APIFetchOptions<operations["getAutomateProjectBadgeKey"]>
  ) {
    return this.makeGetRequest("/automate/projects/{projectId}/badge_key", {
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
   * Retrieves a list of builds from the BrowserStack Automate API.
   *
   * @param query - Optional query parameters for filtering the builds.
   * @param options - Optional fetch options for the API request.
   * @returns A Promise that resolves to an array of automation builds.
   */
  getBuilds(
    query?: operations["getAutomateBuilds"]["parameters"]["query"],
    options?: APIFetchOptions<operations["getAutomateBuilds"]>
  ) {
    return this.makeGetRequest("/automate/builds.json", {
      ...options,
      params: {
        query,
      },
    }).then((data) => data.map((build) => build.automation_build));
  }

  /**
   * Retrieves information about a specific build.
   * @param buildId - The ID of the build.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the build information.
   */
  getBuild(
    buildId: string,
    options?: APIFetchOptions<operations["getAutomateBuild"]>
  ) {
    return this.makeGetRequest("/automate/builds/{buildId}.json", {
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
   * Updates a build in the BrowserStack Automate API.
   *
   * @param buildId - The ID of the build to update.
   * @param body - The request body containing the updated build data.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the updated build data.
   * @throws {BrowserStackError} If an error occurs during the update.
   */
  updateBuild(
    buildId: string,
    body: operations["updateAutomateBuild"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["updateAutomateBuild"]>
  ) {
    return this.makePutRequest("/automate/builds/{buildId}.json", {
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
    options?: APIFetchOptions<operations["deleteAutomateBuild"]>
  ) {
    return this.makeDeleteRequest("/automate/builds/{buildId}.json", {
      ...options,
      params: {
        path: {
          buildId,
        },
      },
    });
  }

  /**
   * Deletes multiple builds from the BrowserStack Automate API.
   * @param buildIds An array of build IDs to be deleted.
   * @param options Additional options for the delete request.
   * @returns A promise that resolves when the delete request is successful.
   */
  deleteBuilds(
    buildIds: string[],
    options?: APIFetchOptions<operations["deleteAutomateBuilds"]>
  ) {
    return this.makeDeleteRequest("/automate/builds", {
      ...options,
      params: {
        query: {
          "buildId[]": buildIds,
        },
      },
    });
  }

  /**
   * Retrieves the sessions associated with a specific build.
   *
   * @param buildId - The ID of the build.
   * @param query - Optional query parameters for filtering the sessions.
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to an array of automation sessions.
   */
  getSessions(
    buildId: string,
    query?: operations["getAutomateSessions"]["parameters"]["query"],
    options?: APIFetchOptions<operations["getAutomateSessions"]>
  ) {
    return this.makeGetRequest("/automate/builds/{buildId}/sessions.json", {
      ...options,
      params: {
        path: {
          buildId,
        },
        query,
      },
    }).then((data) => data.map((session) => session.automation_session));
  }

  /**
   * Retrieves the details of a specific session.
   * @param sessionId - The ID of the session to retrieve.
   * @param options - Additional options for the fetch request.
   * @returns A promise that resolves to the automation session data.
   */
  getSession(
    sessionId: string,
    options?: APIFetchOptions<operations["getAutomateSession"]>
  ) {
    return this.makeGetRequest("/automate/sessions/{sessionId}.json", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
    }).then((data) => data.automation_session);
  }

  /**
   * Updates an automate session.
   *
   * @param sessionId - The ID of the session to update.
   * @param body - The request body containing the updated session data.
   * @param options - Additional options for the request.
   * @returns A promise that resolves to the updated automation session.
   */
  updateSession(
    sessionId: string,
    body: operations["updateAutomateSession"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["updateAutomateSession"]>
  ) {
    return this.makePutRequest("/automate/sessions/{sessionId}.json", {
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
   * Deletes a session by its session ID.
   * @param sessionId The ID of the session to delete.
   * @param options Additional options for the delete request.
   * @returns A promise that resolves when the session is successfully deleted.
   */
  deleteSession(
    sessionId: string,
    options?: APIFetchOptions<operations["deleteAutomateSession"]>
  ) {
    return this.makeDeleteRequest("/automate/sessions/{sessionId}.json", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
    });
  }

  /**
   * Deletes the specified sessions.
   * @param sessionIds - An array of session IDs to delete.
   * @param options - Additional options for the delete request.
   * @returns A promise that resolves when the delete request is complete.
   */
  deleteSessions(
    sessionIds: string[],
    options?: APIFetchOptions<operations["deleteAutomateSessions"]>
  ) {
    return this.makeDeleteRequest("/automate/sessions", {
      ...options,
      params: {
        query: {
          "sessionId[]": sessionIds,
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
    body: operations["uploadAutomateBuildTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAutomateBuildTerminalLogs"]>
  ) {
    // makePostRequest produces a non-JSON response
    return this.makeCloudPostRequest(
      "/automate/builds/{buildId}/terminallogs",
      {
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
      }
    );
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
    body: operations["uploadAutomateSessionTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAutomateSessionTerminalLogs"]>
  ) {
    // makePostRequest produces a non-JSON response
    return this.makeCloudPostRequest(
      "/automate/sessions/{sessionId}/terminallogs",
      {
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
      }
    );
  }

  /**
   * Retrieves the logs for a specific session.
   *
   * @param sessionId - The ID of the session.
   * @param options - Additional options for the request.
   * @returns A promise that resolves with the logs of the session.
   */
  getSessionLogs(
    sessionId: string,
    options?: APIFetchOptions<operations["getAutomateSessionLogs"]>
  ) {
    return this.makeGetRequest("/automate/sessions/{sessionId}/logs", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
      parseAs: "text",
    });
  }

  /**
   * Retrieves the network logs for a specific session.
   * @param sessionId - The ID of the session.
   * @param options - Additional options for the network logs request.
   * @returns A Promise that resolves to the network logs response.
   */
  getSessionNetworkLogs(
    sessionId: string,
    options?: APIFetchOptions<operations["getAutomateSessionNetworkLogs"]>
  ) {
    return this.makeGetRequest("/automate/sessions/{sessionId}/networklogs", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
    });
  }

  /**
   * Retrieves the console logs for a specific session.
   * @param sessionId The ID of the session.
   * @param options Additional options for the request.
   * @returns A Promise that resolves to the console logs.
   */
  getSessionConsoleLogs(
    sessionId: string,
    options?: APIFetchOptions<operations["getAutomateSessionConsoleLogs"]>
  ) {
    return this.makeGetRequest("/automate/sessions/{sessionId}/consolelogs", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
      parseAs: "text",
    });
  }

  /**
   * Retrieves the Selenium logs for a specific session.
   * @param sessionId The ID of the session.
   * @param options Additional options for the request.
   * @returns A Promise that resolves to the Selenium logs.
   */
  getSessionSeleniumLogs(
    sessionId: string,
    options?: APIFetchOptions<operations["getAutomateSessionSeleniumLogs"]>
  ) {
    // makeGetRequest produces a non-JSON response
    return this.makeCloudGetRequest(
      "/automate/sessions/{sessionId}/seleniumlogs",
      {
        ...options,
        params: {
          path: {
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
   * @param sessionId - The ID of the session.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves to the Appium logs.
   */
  getSessionAppiumLogs(
    sessionId: string,
    options?: APIFetchOptions<operations["getAutomateSessionAppiumLogs"]>
  ) {
    return this.makeGetRequest("/automate/sessions/{sessionId}/appiumlogs", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
      parseAs: "text",
    });
  }

  /**
   * Retrieves the telemetry logs for a specific session.
   * @param sessionId - The ID of the session.
   * @param options - Additional options for the request.
   * @returns A Promise that resolves with the telemetry logs.
   */
  getSessionTelemetryLogs(
    sessionId: string,
    options?: APIFetchOptions<operations["getAutomateSessionTelemetryLogs"]>
  ) {
    return this.makeGetRequest("/automate/sessions/{sessionId}/telemetrylogs", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
    });
  }

  /**
   * Uploads a media file to the BrowserStack Automate API.
   *
   * @param body - The content of the media file to be uploaded, along with its filename.
   * @param options - Additional options for the API request.
   * @returns A Promise that resolves to the response of the API request.
   */
  uploadMediaFile(
    body: operations["uploadAutomateMediaFile"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAutomateMediaFile"]>
  ) {
    return this.makePostRequest("/automate/upload-media", {
      ...options,
      body,
      bodySerializer: () => {
        const formData = new FormData();
        formData.append("file", body.file, body.filename);
        return formData;
      },
    });
  }

  /**
   * Retrieves the recent media files from the BrowserStack Automate API.
   * @param options - Optional fetch options for the API request.
   * @returns A promise that resolves with the response from the API.
   */
  getMediaFiles(options?: APIFetchOptions<operations["getAutomateMediaFiles"]>) {
    return this.makeGetRequest("/automate/recent_media_files", options);
  }

  /**
   * Deletes a media file.
   * @param mediaId The ID of the media file to delete.
   * @param options Additional options for the delete request.
   * @returns A promise that resolves when the media file is successfully deleted.
   */
  deleteMediaFile(
    mediaId: string,
    options?: APIFetchOptions<operations["deleteAutomateMediaFile"]>
  ) {
    return this.makeDeleteRequest("/automate/custom_media/delete/{mediaId}", {
      ...options,
      params: {
        path: {
          mediaId,
        },
      },
    });
  }
}
