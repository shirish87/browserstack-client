import { queryOptions } from "@tanstack/react-query";
import type { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { traApi } from "./api";
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
  });

export const sessionLogsQuery = (client: TestReportingClient, username: string, sessionId: string, device?: string) =>
  queryOptions({
    queryKey: ["session-logs", username, sessionId],
    queryFn: () => client.getTestSessionLogs(sessionId, undefined, { device }),
    retry: false,
    staleTime: Infinity,
  });
