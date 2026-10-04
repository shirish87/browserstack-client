import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { createDashboardHandler } from "../handler";

const fixtureText = (name: string): string =>
  readFileSync(new URL(`../../../contract-tests/fixtures/${name}`, import.meta.url), "utf8");
const json = (name: string): Response => new Response(fixtureText(name), { headers: { "content-type": "application/json" } });

const SESSION_ID = (JSON.parse(fixtureText("automate-session-playwright.json")) as { automation_session: { hashed_id: string } })
  .automation_session.hashed_id;

function setup() {
  const calls: string[] = [];
  const fetchFn: typeof fetch = async (input) => {
    const url = new URL(String(input));
    calls.push(`${url.hostname}${url.pathname}${url.search}`);
    const p = url.pathname;
    if (p.endsWith("/builds")) return json("tra-build-list.json");
    if (p.endsWith("/testRuns")) return json(url.searchParams.has("next_page") ? "tra-test-runs-final-page.json" : "tra-test-runs-playwright.json");
    if (p === `/automate/sessions/${SESSION_ID}.json`) return json("automate-session-playwright.json");
    if (p === `/automate/sessions/${SESSION_ID}/logs`) {
      return new Response("REQUEST POST /session\n", { headers: { "content-type": "text/plain" } });
    }
    return new Response("not found", { status: 404, headers: { "content-type": "text/plain" } });
  };
  const tra = new TestReportingClient({ username: "u", accessKey: "k", fetchFn });
  return { handle: createDashboardHandler({ tra }), calls };
}

const get = (path: string) => new Request(`http://localhost${path}`);

describe("dashboard handler", () => {
  it("serves the HTML shell at /", async () => {
    const res = await setup().handle(get("/"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(await res.text()).toContain("<title>");
  });

  it("links builds by the camelCased buildId the client returns", async () => {
    const { handle } = setup();
    const body = (await (await handle(get("/api/projects/123/builds"))).json()) as { builds: Array<{ buildId?: string }> };
    expect(body.builds[0]?.buildId).toMatch(/^[0-9a-f]{40}$/);
    expect(await (await handle(get("/"))).text()).toContain("b.buildId");
  });

  it("lists a project's builds", async () => {
    const { handle, calls } = setup();
    const res = await handle(get("/api/projects/123/builds"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toHaveProperty("builds");
    expect(calls[0]).toContain("/projects/123/builds");
  });

  it("rejects a non-numeric project id", async () => {
    const res = await setup().handle(get("/api/projects/abc/builds"));
    expect(res.status).toBe(400);
  });

  it("lists a build's tests, each with its session id", async () => {
    const res = await setup().handle(get("/api/builds/b1/tests"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { tests: Array<{ name: string; sessionId?: string }> };
    expect(Array.isArray(body.tests)).toBe(true);
    expect(body.tests.length).toBeGreaterThan(0);
    expect(body.tests[0]).toHaveProperty("name");
  });

  it("returns the linked Automate session", async () => {
    const res = await setup().handle(get(`/api/sessions/${SESSION_ID}`));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { product: string };
    expect(body.product).toBe("automate");
  });

  it("404s for an unknown session", async () => {
    const res = await setup().handle(get("/api/sessions/nope"));
    expect(res.status).toBe(404);
  });

  it("returns session logs, honouring ?kinds", async () => {
    const { handle, calls } = setup();
    const res = await handle(get(`/api/sessions/${SESSION_ID}/logs?kinds=text`));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { text: { status: string; data: string } };
    expect(body.text).toEqual({ status: "ok", data: "REQUEST POST /session\n" });
    expect(calls.some((c) => c.endsWith("/consolelogs"))).toBe(false);
  });

  it("rejects unknown log kinds", async () => {
    const res = await setup().handle(get(`/api/sessions/${SESSION_ID}/logs?kinds=bogus`));
    expect(res.status).toBe(400);
  });

  it("serializes a failed log fetch as a message, not a bare Error", async () => {
    const { handle } = setup();
    const res = await handle(get(`/api/sessions/${SESSION_ID}/logs?kinds=console`));
    const body = (await res.json()) as { console: { status: string; error?: string } };
    expect(body.console.status).toBe("missing");
  });

  it("only accepts GET and returns 404 for unknown routes", async () => {
    const { handle } = setup();
    expect((await handle(new Request("http://localhost/api/projects", { method: "POST" }))).status).toBe(405);
    expect((await handle(get("/api/nope"))).status).toBe(404);
  });

  it("maps upstream failures to 502", async () => {
    const tra = new TestReportingClient({
      username: "u",
      accessKey: "k",
      fetchFn: async () => new Response("boom", { status: 500 }),
    });
    const res = await createDashboardHandler({ tra })(get("/api/projects/1/builds"));
    expect(res.status).toBe(502);
  });
});
