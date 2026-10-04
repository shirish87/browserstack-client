import { isLiveSession, LIVE_LOG_POLL_MS } from "./session";
import { queryOptions } from "@tanstack/react-query";
import type { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import type { TestManagementClient } from "@dot-slash/browserstack-test-management";
import { extrasApi, tmApi, traApi } from "./api";
import { telemetryDownloadUrl } from "./extras";
import { isNamedProject, type NamedProject } from "./schemas";

/** Poll interval while a build is running (TRA has no push events). */
export const LIVE_POLL_MS = 5000;

export const projectsQuery = (client: TestReportingClient, username: string) =>
  queryOptions({
    queryKey: ["projects-all", username],
    queryFn: async () => {
      const out: NamedProject[] = [];
      let next: string | undefined;
      for (let page = 0; page < 10; page++) {
        const res = await traApi.projects(client, next);
        out.push(...(res.projects ?? []).filter(isNamedProject));
        if (!res.pagination?.hasNext || !res.pagination.nextPage) break;
        next = res.pagination.nextPage;
      }
      return out;
    },
  });

export const windowQuery = (client: TestReportingClient, username: string, projectId: number, days: number) =>
  queryOptions({
    queryKey: ["builds-window", username, projectId, days],
    queryFn: () => traApi.buildsWindow(client, projectId, { days }),
  });

export const runningQuery = (client: TestReportingClient, username: string, projectId: number) =>
  queryOptions({
    queryKey: ["builds-running", username, projectId],
    queryFn: () => traApi.builds(client, projectId, { status: "running" }),
    refetchInterval: LIVE_POLL_MS * 2,
  });

export const buildQuery = (client: TestReportingClient, username: string, buildId: string) =>
  queryOptions({
    queryKey: ["build", username, buildId],
    queryFn: () => traApi.build(client, buildId),
  });

export const testsQuery = (client: TestReportingClient, username: string, buildId: string, live = false) =>
  queryOptions({
    queryKey: ["tests-flat", username, buildId],
    queryFn: () => traApi.allTests(client, buildId),
    ...(live ? { refetchInterval: LIVE_POLL_MS } : {}),
  });

export const linkedSessionQuery = (client: TestReportingClient, username: string, sessionId: string, device?: string) =>
  queryOptions({
    queryKey: ["linked-session", username, sessionId],
    queryFn: () => client.getTestSession(sessionId, { device }),
    retry: false,
    // A running session is re-read until it ends, so its status badge flips to done by itself.
    refetchInterval: (query) => (isLiveSession(query.state.data?.session.status) ? LIVE_LOG_POLL_MS : false),
  });

/** `live` re-reads the logs every few seconds (a running session keeps writing them); a finished session's logs never change. */
export const sessionLogsQuery = (client: TestReportingClient, username: string, sessionId: string, device?: string, live = false) =>
  queryOptions({
    queryKey: ["session-logs", username, sessionId],
    queryFn: () => client.getTestSessionLogs(sessionId, undefined, { device }),
    retry: false,
    staleTime: live ? 0 : Infinity,
    ...(live ? { refetchInterval: LIVE_LOG_POLL_MS } : {}),
  });

export const tmProjectQuery = (client: TestManagementClient, username: string, projectName: string) =>
  queryOptions({
    queryKey: ["tm-project", username, projectName],
    queryFn: () => tmApi.projectIdFor(client, projectName),
    retry: false,
    staleTime: Infinity,
  });

export const tmCasesQuery = (client: TestManagementClient, username: string, projectId: string) =>
  queryOptions({ queryKey: ["tm-cases", username, projectId], queryFn: () => tmApi.cases(client, projectId), retry: false });

export const tmRunsQuery = (client: TestManagementClient, username: string, projectId: string) =>
  queryOptions({ queryKey: ["tm-runs", username, projectId], queryFn: () => tmApi.runs(client, projectId), retry: false });

/** App Automate resource profiling for a session; sessions run without profiling answer 4xx, which the page shows as "not captured". */
export const profilingQuery = (username: string, buildId: string, sessionId: string, live = false) =>
  queryOptions({
    queryKey: ["profiling", username, sessionId],
    queryFn: async () => ({ samples: await extrasApi.profiling(buildId, sessionId), v2: await extrasApi.profilingV2(buildId, sessionId).catch(() => undefined) }),
    retry: false,
    staleTime: live ? 0 : Infinity,
    ...(live ? { refetchInterval: LIVE_LOG_POLL_MS } : {}),
  });

export const PLAN_POLL_MS = 15000;
export const planQuery = (username: string, product: "automate" | "app-automate") =>
  queryOptions({ queryKey: ["plan", username, product], queryFn: () => extrasApi.plan(product), retry: false, refetchInterval: PLAN_POLL_MS });

/** Whether the session has a telemetry archive: only Selenium 4 sessions run with `telemetryLogs` do, and the rest answer 404. */
export const telemetryAvailableQuery = (username: string, sessionId: string) =>
  queryOptions({
    queryKey: ["telemetry", username, sessionId],
    queryFn: async () => (await fetch(telemetryDownloadUrl(sessionId), { method: "HEAD" })).ok,
    retry: false,
    staleTime: Infinity,
  });
