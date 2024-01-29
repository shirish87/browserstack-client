import { APIClient, APIClientOptions } from "@/api";
import { BrowserStackError } from "@/error";
import { operations } from "@/generated/openapi";
import { FetchOptions } from "openapi-fetch";

export default class AutomateClient extends APIClient {
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://api.browserstack.com",
    });
  }

  recycleKey(options?: FetchOptions<operations["recycleAutomateKey"]>) {
    return this.makePutRequest("/automate/recycle_key.json", options);
  }

  getPlan(options?: FetchOptions<operations["getAutomatePlan"]>) {
    return this.makeGetRequest("/automate/plan.json", options);
  }

  getBrowsers(options?: FetchOptions<operations["getAutomateBrowsers"]>) {
    return this.makeGetRequest("/automate/browsers.json", options);
  }

  getProjects(options?: FetchOptions<operations["getAutomateProjects"]>) {
    return this.makeGetRequest("/automate/projects.json", options);
  }

  getProject(
    id: number,
    options?: Omit<FetchOptions<operations["getAutomateProject"]>, "params">
  ) {
    return this.makeGetRequest("/automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId: id,
        },
      },
    }).then((data) => data.project);
  }

  updateProject(
    id: number,
    body: operations["updateAutomateProject"]["requestBody"]["content"]["application/json"],
    options?: Omit<
      FetchOptions<operations["updateAutomateProject"]>,
      "params" | "body"
    >
  ) {
    return this.makePutRequest("/automate/projects/{projectId}.json", {
      ...options,
      body,
      params: {
        path: {
          projectId: id,
        },
      },
    });
  }

  deleteProject(
    id: number,
    options?: Omit<FetchOptions<operations["deleteAutomateProject"]>, "params">
  ) {
    return this.makeDeleteRequest("/automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId: id,
        },
      },
    });
  }

  getBadgeKey(
    projectId: number,
    options?: Omit<
      FetchOptions<operations["getAutomateProjectBadgeKey"]>,
      "params"
    >
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

  getBuilds(
    query?: operations["getAutomateBuilds"]["parameters"]["query"],
    options?: FetchOptions<operations["getAutomateBuilds"]>
  ) {
    return this.makeGetRequest("/automate/builds.json", {
      ...options,
      params: {
        query,
      },
    }).then((data) => data.map((build) => build.automation_build));
  }

  getBuild(
    id: string,
    options?: Omit<FetchOptions<operations["getAutomateBuild"]>, "params">
  ) {
    return this.makeGetRequest("/automate/builds/{buildId}.json", {
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
    body: operations["updateAutomateBuild"]["requestBody"]["content"]["application/json"],
    options?: Omit<
      FetchOptions<operations["updateAutomateBuild"]>,
      "params" | "body"
    >
  ) {
    return this.makePutRequest("/automate/builds/{buildId}.json", {
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

  deleteBuild(
    id: string,
    options?: Omit<FetchOptions<operations["deleteAutomateBuild"]>, "params">
  ) {
    return this.makeDeleteRequest("/automate/builds/{buildId}.json", {
      ...options,
      params: {
        path: {
          buildId: id,
        },
      },
    });
  }

  deleteBuilds(
    buildIds: string[],
    options?: Omit<FetchOptions<operations["deleteAutomateBuilds"]>, "params">
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

  getSessions(
    buildId: string,
    query?: operations["getAutomateSessions"]["parameters"]["query"],
    options?: FetchOptions<operations["getAutomateSessions"]>
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

  getSession(
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAutomateSession"]>, "params">
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

  updateSession(
    sessionId: string,
    body: operations["updateAutomateSession"]["requestBody"]["content"]["application/json"],
    options?: Omit<
      FetchOptions<operations["updateAutomateSession"]>,
      "params" | "body"
    >
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

  deleteSession(
    sessionId: string,
    options?: Omit<FetchOptions<operations["deleteAutomateSession"]>, "params">
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

  deleteSessions(
    sessionIds: string[],
    options?: Omit<FetchOptions<operations["deleteAutomateSessions"]>, "params">
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

  uploadBuildTerminalLogs(
    buildId: string,
    body: operations["uploadAutomateBuildTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAutomateBuildTerminalLogs"]>,
      "params" | "body"
    >
  ) {
    // makePostRequest produces a non-JSON response
    return this.makeCloudPostRequest("/automate/builds/{buildId}/terminallogs", {
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
    body: operations["uploadAutomateSessionTerminalLogs"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAutomateSessionTerminalLogs"]>,
      "params" | "body"
    >
  ) {
    // makePostRequest produces a non-JSON response
    return this.makeCloudPostRequest("/automate/sessions/{sessionId}/terminallogs", {
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

  getSessionLogs(
    sessionId: string,
    options?: Omit<FetchOptions<operations["getAutomateSessionLogs"]>, "params">
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

  getSessionNetworkLogs(
    sessionId: string,
    options?: Omit<
      FetchOptions<operations["getAutomateSessionNetworkLogs"]>,
      "params"
    >
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

  getSessionConsoleLogs(
    sessionId: string,
    options?: Omit<
      FetchOptions<operations["getAutomateSessionConsoleLogs"]>,
      "params"
    >
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

  getSessionSeleniumLogs(
    sessionId: string,
    options?: Omit<
      FetchOptions<operations["getAutomateSessionSeleniumLogs"]>,
      "params"
    >
  ) {
    // makeGetRequest produces a non-JSON response
    return this.makeCloudGetRequest("/automate/sessions/{sessionId}/seleniumlogs", {
      ...options,
      params: {
        path: {
          sessionId,
        },
      },
      parseAs: "text",
    });
  }

  getSessionAppiumLogs(
    sessionId: string,
    options?: Omit<
      FetchOptions<operations["getAutomateSessionAppiumLogs"]>,
      "params"
    >
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

  getSessionTelemetryLogs(
    sessionId: string,
    options?: Omit<
      FetchOptions<operations["getAutomateSessionTelemetryLogs"]>,
      "params"
    >
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

  uploadMediaFile(
    body: operations["uploadAutomateMediaFile"]["requestBody"]["content"]["multipart/form-data"] & {
      filename: string;
    },
    options?: Omit<
      FetchOptions<operations["uploadAutomateMediaFile"]>,
      "params" | "body"
    >
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

  getMediaFiles(
    options?: FetchOptions<operations["getAutomateMediaFiles"]>
  ) {
    return this.makeGetRequest("/automate/recent_media_files", options);
  }

  deleteMediaFile(
    mediaId: string,
    options?: Omit<
      FetchOptions<operations["deleteAutomateMediaFile"]>,
      "params"
    >
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
