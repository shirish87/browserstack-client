import type { LogKind, LogResult, SessionLogs, TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { PAGE_HTML } from "./page";

export interface DashboardHandlerOptions {
  tra: TestReportingClient;
}

const LOG_KINDS: readonly LogKind[] = ["text", "selenium", "console", "network", "playwright", "appium", "device"];

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const error = (status: number, message: string): Response => json({ error: message }, status);

/** `Error` doesn't survive JSON.stringify, so log failures are flattened to their message. */
function serializeLogs(logs: SessionLogs): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [kind, result] of Object.entries(logs) as Array<[string, LogResult<unknown>]>) {
    out[kind] = result.status === "error" ? { status: "error", error: result.error.message } : result;
  }
  return out;
}

/**
 * A Web-standard `(Request) => Response` handler for the dashboard: a read-only JSON API over a server-side
 * `TestReportingClient` (credentials never reach the browser) plus the single-page UI at `/`.
 */
export function createDashboardHandler({ tra }: DashboardHandlerOptions) {
  return async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path !== "/" && !path.startsWith("/api/")) return error(404, "Not found");
    if (request.method !== "GET") return error(405, "Method not allowed");
    if (path === "/") return new Response(PAGE_HTML, { headers: { "content-type": "text/html; charset=utf-8" } });

    try {
      if (path === "/api/projects") return json(await tra.getProjects(url.searchParams.get("nextPage") ?? undefined));

      let m = /^\/api\/projects\/([^/]+)\/builds$/.exec(path);
      if (m) {
        if (!/^\d+$/.test(m[1]!)) return error(400, "Project id must be numeric");
        return json(await tra.getProjectBuilds(Number(m[1]), undefined, undefined, undefined, undefined, undefined, undefined, undefined, url.searchParams.get("nextPage") ?? undefined));
      }

      m = /^\/api\/builds\/([^/]+)\/tests$/.exec(path);
      if (m) {
        const tests = await tra.getBuildTests(decodeURIComponent(m[1]!));
        // `node` is the raw TRA tree: large, and everything the UI needs is already flattened out of it.
        return json({ tests: tests.map((t) => ({ ...t, node: undefined })) });
      }

      m = /^\/api\/sessions\/([^/]+)$/.exec(path);
      if (m) {
        const linked = await tra.getTestSession(decodeURIComponent(m[1]!), { device: url.searchParams.get("device") ?? undefined });
        return linked ? json(linked) : error(404, "Session not found in Automate or App Automate");
      }

      m = /^\/api\/sessions\/([^/]+)\/logs$/.exec(path);
      if (m) {
        const raw = url.searchParams.get("kinds");
        const kinds = raw ? raw.split(",") : undefined;
        const bad = kinds?.find((k) => !LOG_KINDS.includes(k as LogKind));
        if (bad) return error(400, `Unknown log kind: ${bad}`);
        const logs = await tra.getTestSessionLogs(decodeURIComponent(m[1]!), kinds as LogKind[] | undefined, {
          device: url.searchParams.get("device") ?? undefined,
        });
        return json(serializeLogs(logs));
      }
    } catch (e) {
      return error(502, e instanceof Error ? e.message : "Upstream request failed");
    }
    return error(404, "Not found");
  };
}
