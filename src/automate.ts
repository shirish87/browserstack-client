import { APIClient, APIClientOptions } from "@/api";
import { operations } from "@/generated/openapi";
import { FetchOptions } from "openapi-fetch";


export default class AutomateClient extends APIClient {
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://api.browserstack.com",
    });
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
    options: Omit<FetchOptions<operations["updateAutomateProject"]>, "params">
  ) {
    return this.makePutRequest("/automate/projects/{projectId}.json", {
      ...options,
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
    return this.sdk.DELETE("/automate/projects/{projectId}.json", {
      ...options,
      params: {
        path: {
          projectId: id,
        },
      },
    });
  }

  getBadgeKey(
    id: number,
    options?: Omit<
      FetchOptions<operations["getAutomateProjectBadgeKey"]>,
      "params"
    >
  ) {
    return this.makeGetRequest("/automate/projects/{projectId}/badge_key", {
      ...options,
      params: {
        path: {
          projectId: id,
        },
      },
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
      sessions: data.build.sessions.map((session) => session.automation_session),
    }));
  }

  updateBuild(
    id: string,
    options: Omit<FetchOptions<operations["updateAutomateBuild"]>, "params">
  ) {
    return this.makePutRequest("/automate/builds/{buildId}.json", {
      ...options,
      params: {
        path: {
          buildId: id,
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
}
