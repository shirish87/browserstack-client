import {
  APIFetchOptions,
  BrowserStackOptions,
} from "@browserstack-client/core";
import { BrowserStackError } from "@browserstack-client/core";
import { operations } from "@browserstack-client/openapi/automate";
import { GeneratedAutomateClient } from "@browserstack-client/openapi/automate/client";

/**
 * AutomateClient represents a client for interacting with the BrowserStack Automate API.
 * @see https://www.browserstack.com/automate/rest-api
 * @public
 */
export class AutomateClient extends GeneratedAutomateClient {
  /**
   * Constructs a new instance of the AutomateClient class.
   * @param options - Options to customize the client.
   */
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/automate",
      "6.0.0"
    );
  }

  /**
   * Recycles the automate key.
   * @param options The fetch options for the request.
   * @returns {} A promise that resolves to the response of the request.
   */
  recycleKey(options?: APIFetchOptions<operations["recycleAutomateKey"]>) {
    return this.recycleAutomateKey(undefined, options);
  }

  /**
   * Retrieves the automate plan.
   * @param options - The fetch options for the request.
   * @returns A promise that resolves with the automate plan.
   */
  getPlan(options?: APIFetchOptions<operations["getAutomatePlan"]>) {
    return this.getAutomatePlan(options);
  }

  /**
   * Retrieves the list of available browsers for BrowserStack Automate.
   * @param options - Optional fetch options for customizing the request.
   * @returns A Promise that resolves to the list of available browsers.
   */
  getBrowsers(options?: APIFetchOptions<operations["getAutomateBrowsers"]>) {
    return this.getAutomateBrowsers(options);
  }

  /**
   * Retrieves the projects from the BrowserStack Automate API.
   * @param options - The fetch options for the API request.
   * @returns A promise that resolves with the projects data.
   */
  getProjects(options?: APIFetchOptions<operations["getAutomateProjects"]>) {
    return this.getAutomateProjects(options);
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
    return this.getAutomateProject(String(projectId), options);
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
    return this.updateAutomateProject(String(projectId), body, options);
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
    return this.deleteAutomateProject(String(projectId), options);
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
    return this.getAutomateProjectBadgeKey(String(projectId), options);
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
    return this.getAutomateBuilds({
      ...options,
      params: {
        ...options?.params,
        query: {
          ...options?.params?.query,
          ...query,
        },
      },
    });
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
    return this.getAutomateBuild(buildId, options);
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
    return this.updateAutomateBuild(buildId, body, options).then((data) => {
      if ("error" in data) {
        throw new BrowserStackError(data.error as string, { response: data });
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
    return this.deleteAutomateBuild(buildId, options);
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
    return this.deleteAutomateBuilds({
      ...options,
      params: {
        ...options?.params,
        query: {
          ...options?.params?.query,
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
    return this.getAutomateSessions(buildId, {
      ...options,
      params: {
        ...options?.params,
        query: {
          ...options?.params?.query,
          ...query,
        },
      },
    });
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
    return this.getAutomateSession(sessionId, options);
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
    return this.updateAutomateSession(sessionId, body, options);
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
    return this.deleteAutomateSession(sessionId, options);
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
    return this.deleteAutomateSessions({
      ...options,
      params: {
        ...options?.params,
        query: {
          ...options?.params?.query,
          "sessionId[]": sessionIds,
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
    data: operations["uploadAutomateBuildTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAutomateBuildTerminalLogs"]>
  ) {
    return this.makeCloudPostRequest(
      "/automate/builds/{buildId}/terminallogs",
      {
        ...options,
        body: data,
        bodySerializer: (body) => {
          const formData = new FormData();
          formData.append("file", body.file as Blob, data.filename);
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
    data: operations["uploadAutomateSessionTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAutomateSessionTerminalLogs"]>
  ) {
    return this.makeCloudPostRequest(
      "/automate/sessions/{sessionId}/terminallogs",
      {
        ...options,
        body: data,
        bodySerializer: (body) => {
          const formData = new FormData();
          formData.append("file", body.file as Blob, data.filename);
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
    return this.getAutomateSessionLogs(sessionId, options);
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
    return this.getAutomateSessionNetworkLogs(sessionId, options);
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
    return this.getAutomateSessionConsoleLogs(sessionId, options);
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
    return this.getAutomateSessionAppiumLogs(sessionId, options);
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
    return this.getAutomateSessionTelemetryLogs(sessionId, options);
  }

  /**
   * Uploads a media file to the BrowserStack Automate API.
   *
   * @param data - The content of the media file to be uploaded, along with its filename.
   * @param options - Additional options for the API request.
   * @returns A Promise that resolves to the response of the API request.
   */
  uploadMediaFile(
    data: operations["uploadAutomateMediaFile"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: APIFetchOptions<operations["uploadAutomateMediaFile"]>
  ) {
    return this.makePostRequest("/automate/upload-media", {
      ...options,
      body: data,
      bodySerializer: (body) => {
        const formData = new FormData();
        formData.append("file", body.file as Blob, data.filename);
        return formData;
      },
    });
  }

  /**
   * Retrieves the recent media files from the BrowserStack Automate API.
   * @param options - Optional fetch options for the API request.
   * @returns A promise that resolves with the response from the API.
   */
  getMediaFiles(
    options?: APIFetchOptions<operations["getAutomateMediaFiles"]>
  ) {
    return this.getAutomateMediaFiles(options);
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
    return this.deleteAutomateMediaFile(mediaId, options);
  }
}
