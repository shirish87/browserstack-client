/// <reference types="node" />
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { AutomateClient } from "@dot-slash/browserstack-automate";
import { TestReportingClient } from "../index";

/** Real, sanitised API captures shared with the contract tests. */
const fixtureText = (name: string): string => readFileSync(new URL(`../../../contract-tests/fixtures/${name}`, import.meta.url), "utf8");
const json = (name: string): Response => new Response(fixtureText(name), { headers: { "content-type": "application/json" } });

const SESSION_ID = (JSON.parse(fixtureText("automate-session-playwright.json")) as { automation_session: { hashed_id: string } }).automation_session.hashed_id;
const XML_404 = '<?xml version="1.0" encoding="UTF-8"?><Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message></Error>';
const NGINX_404 = "<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center></body></html>";

interface Harness {
  tra: TestReportingClient;
  calls: string[];
}

function harness(): Harness {
  const calls: string[] = [];
  const fetchFn: typeof fetch = async (input) => {
    const url = new URL(String(input));
    calls.push(`${url.hostname}${url.pathname}${url.search}`);
    const p = url.pathname;

    if (p.endsWith("/testRuns")) {
      return url.searchParams.has("next_page") ? json("tra-test-runs-final-page.json") : json("tra-test-runs-playwright.json");
    }
    if (p === `/automate/sessions/${SESSION_ID}.json`) return json("automate-session-playwright.json");
    if (p === `/automate/sessions/${SESSION_ID}/logs`) return new Response("2026-10-4 15:56:7:143 REQUEST POST /session\n", { headers: { "content-type": "text/plain" } });
    if (p === `/automate/sessions/${SESSION_ID}/consolelogs`) return new Response("// No messages were logged in this Session.\n", { headers: { "content-type": "text/plain" } });
    if (p === `/automate/sessions/${SESSION_ID}/networklogs`) return json("automate-network-logs.har.json");
    if (p === `/automate/sessions/${SESSION_ID}/playwrightlogs`) return new Response(new TextEncoder().encode("pw:protocol SEND ► {}\n")); // no content-type, like the live API
    if (p === `/automate/sessions/${SESSION_ID}/seleniumlogs`) return new Response(XML_404, { status: 404, headers: { "content-type": "application/xml" } });
    if (p.startsWith("/automate/sessions/") || p.startsWith("/app-automate/sessions/")) {
      return new Response(NGINX_404, { status: 404, statusText: "Not Found", headers: { "content-type": "text/html" } });
    }
    return new Response("{}", { status: 500 });
  };
  const options = { username: "u", accessKey: "k", fetchFn };
  return { tra: new TestReportingClient({ ...options, automate: new AutomateClient(options) }), calls };
}

describe("TestReportingClient.getBuildTests", () => {
  it("flattens the ROOT → TEST tree into tests with their session, file and platform", async () => {
    const { tra } = harness();
    const tests = await tra.getBuildTests("tra-build");
    expect(tests.map((t) => t.name)).toEqual(["passes: example.com has the expected title", "fails on purpose: asserts a heading that does not exist"]);
    const failed = tests[1];
    expect(failed).toMatchObject({ kind: "TEST", status: "failed", sessionId: SESSION_ID, file: "tests/example.spec.js", attempts: 1 });
    expect(failed?.path).toEqual(["example.spec.js", "fails on purpose: asserts a heading that does not exist"]);
    expect(failed?.durationMs).toBeGreaterThan(1000);
    expect(failed?.failure.join("\n")).toContain("Expected:");
    expect(failed?.platform).toMatchObject({ os: "windows 11", browser: "chrome 154.0" });
  });

  it("follows pagination until the last page, including the empty trailing page", async () => {
    const { tra, calls } = harness();
    await tra.getBuildTests("tra-build");
    expect(calls.filter((c) => c.includes("/testRuns"))).toHaveLength(2);
    expect(calls[1]).toContain("next_page=");
  });

  it("treats a missing or empty session_id as no session", async () => {
    const { tra } = harness();
    const [first] = await tra.getBuildTests("tra-build");
    expect(first?.sessionId).toBe(SESSION_ID);
    expect(TestReportingClient.extractSessionId({ details: { sessionId: "" } })).toBeUndefined();
    expect(TestReportingClient.extractSessionId({ details: null })).toBeUndefined();
  });
});

describe("TestReportingClient.getBuildTestSessions", () => {
  it("groups tests by the session they ran in (sessions are per file/worker)", async () => {
    const { tra } = harness();
    const groups = await tra.getBuildTestSessions("tra-build");
    expect(groups).toHaveLength(1);
    expect(groups[0]?.sessionId).toBe(SESSION_ID);
    expect(groups[0]?.tests).toHaveLength(2);
  });
});

describe("TestReportingClient.getTestSession", () => {
  it("resolves the Automate session behind a test's session id", async () => {
    const { tra } = harness();
    const linked = await tra.getTestSession(SESSION_ID);
    expect(linked?.product).toBe("automate");
    expect(linked?.session.hashedId).toBe(SESSION_ID);
    expect(linked?.session.buildHashedId).toMatch(/^[0-9a-f]{40}$/);
  });

  it("caches lookups and returns undefined when the id is unknown (HTML 404)", async () => {
    const { tra, calls } = harness();
    await tra.getTestSession(SESSION_ID);
    await tra.getTestSession(SESSION_ID);
    expect(calls.filter((c) => c.endsWith(`${SESSION_ID}.json`))).toHaveLength(1);
    expect(await tra.getTestSession("0".repeat(40))).toBeUndefined();
  });
});

describe("TestReportingClient.getTestSessionLogs", () => {
  it("fetches the log kinds a session actually has, by default", async () => {
    const { tra, calls } = harness();
    const logs = await tra.getTestSessionLogs(SESSION_ID);
    expect(logs.text).toMatchObject({ status: "ok" });
    expect(logs.console).toMatchObject({ status: "ok" });
    expect(logs.playwright).toMatchObject({ status: "ok", data: expect.stringContaining("pw:protocol") });
    expect(logs.network?.status).toBe("ok");
    // This Playwright session has no selenium/appium log URLs, so they are not requested at all.
    expect(logs.selenium).toBeUndefined();
    expect(calls.some((c) => c.includes("/seleniumlogs") || c.includes("/appiumlogs"))).toBe(false);
  });

  it("reports a missing log as 'missing' with the readable reason, without throwing", async () => {
    const { tra } = harness();
    const logs = await tra.getTestSessionLogs(SESSION_ID, ["selenium", "text"]);
    expect(logs.selenium).toEqual({ status: "missing", reason: "NoSuchKey: The specified key does not exist." });
    expect(logs.text?.status).toBe("ok");
  });

  it("returns nothing for an unknown session when no kinds are requested", async () => {
    const { tra } = harness();
    expect(await tra.getTestSessionLogs("0".repeat(40))).toEqual({});
  });
});

// --- App Automate (a mobile test's session_id resolves here, not in Automate) --------------------------------------------

const APP_SESSION = (JSON.parse(fixtureText("app-automate-session.json")) as { automation_session: { hashed_id: string; build_hashed_id: string } }).automation_session;
const NOT_CAPTURED = fixtureText("app-automate-network-logs-not-captured.json");
// Synthetic one-liners in the shape of the real endpoints. Real session logs hold device serials, URLs and ids, so none are committed.
const APP_LOGS = {
  logs: "2026-10-4 16:28:3:343 SESSION_SETUP_TIME {\"initialising_device\":1}\n",
  appiumlogs: "2026-10-04 16:28:03:360 - [HTTP] --> POST /wd/hub/session\n",
  devicelogs: "10-04 16:28:08.959 I/libc    (1): SetHeapTaggingLevel: tag level set to 0\n",
};
const text = (body: string): Response => new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });

function appHarness(): Harness {
  const calls: string[] = [];
  const fetchFn: typeof fetch = async (input) => {
    const url = new URL(String(input));
    calls.push(`${url.hostname}${url.pathname}`);
    const p = url.pathname;
    const base = `/app-automate/builds/${APP_SESSION.build_hashed_id}/sessions/${APP_SESSION.hashed_id}`;

    if (p.endsWith("/testRuns")) return url.searchParams.has("next_page") ? json("tra-test-runs-final-page.json") : json("tra-test-runs-appium.json");
    if (p === `/app-automate/sessions/${APP_SESSION.hashed_id}.json`) return json("app-automate-session.json");
    if (p === `${base}/logs`) return text(APP_LOGS.logs);
    if (p === `${base}/appiumlogs`) return text(APP_LOGS.appiumlogs);
    if (p === `${base}/devicelogs`) return text(APP_LOGS.devicelogs);
    if (p === `${base}/networklogs`) return new Response(NOT_CAPTURED, { status: 400, headers: { "content-type": "application/json" } });
    // Automate (web) doesn't know a mobile session id.
    if (p.startsWith("/automate/sessions/")) return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain" } });
    if (p.startsWith("/app-automate/sessions/")) return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain" } });
    return new Response("{}", { status: 500 });
  };
  const options = { username: "u", accessKey: "k", fetchFn };
  const tra = new TestReportingClient({ ...options, automate: new AutomateClient(options), appAutomate: new AppAutomateClient(options) });
  return { tra, calls };
}

describe("TestReportingClient linked sessions with App Automate", () => {
  it("lists a mobile build's tests with the device, no browser, and the session each ran in", async () => {
    const { tra } = appHarness();
    const tests = await tra.getBuildTests("tra-mobile-build");
    expect(tests.length).toBe(5);
    expect(tests[0]?.platform).toEqual({ os: "android 13.0", device: "Google Pixel 7" });
    expect(new Set(tests.map((t) => t.sessionId)).size).toBe(3);
  });

  it("resolves a mobile session in App Automate after Automate says it doesn't know it", async () => {
    const { tra, calls } = appHarness();
    const linked = await tra.getTestSession(APP_SESSION.hashed_id);
    expect(linked?.product).toBe("app-automate");
    expect(linked?.session.hashedId).toBe(APP_SESSION.hashed_id);
    expect(calls.findIndex((c) => c.includes("/automate/sessions/"))).toBeLessThan(calls.findIndex((c) => c.includes("/app-automate/sessions/")));
  });

  it("asks App Automate first when the test ran on a device, saving the wasted lookup", async () => {
    const { tra, calls } = appHarness();
    await tra.getTestSession(APP_SESSION.hashed_id, { device: "Google Pixel 7" });
    expect(calls.some((c) => c.startsWith("api.browserstack.com/automate/sessions/"))).toBe(false);
  });

  it("fetches App Automate logs with the build id taken from the session, and reports uncaptured network logs as missing", async () => {
    const { tra } = appHarness();
    const logs = await tra.getTestSessionLogs(APP_SESSION.hashed_id, ["text", "appium", "device", "network"]);
    expect(logs.text).toMatchObject({ status: "ok", data: expect.stringContaining("SESSION_SETUP_TIME") });
    expect(logs.appium?.status).toBe("ok");
    expect(logs.device?.status).toBe("ok");
    expect(logs.network).toMatchObject({ status: "missing", reason: expect.stringContaining("NETWORK_LOGS_NOT_CAPTURED") });
  });

  it("by default requests only the logs the mobile session reports (text, appium, device)", async () => {
    const { tra, calls } = appHarness();
    const logs = await tra.getTestSessionLogs(APP_SESSION.hashed_id);
    expect(Object.keys(logs).sort()).toEqual(["appium", "device", "text"]);
    expect(calls.some((c) => c.includes("networklogs"))).toBe(false);
  });

  it("says plainly that web-only log kinds don't exist for a mobile session", async () => {
    const { tra } = appHarness();
    const logs = await tra.getTestSessionLogs(APP_SESSION.hashed_id, ["selenium", "playwright", "console"]);
    for (const kind of ["selenium", "playwright", "console"] as const) {
      expect(logs[kind]).toMatchObject({ status: "missing", reason: expect.stringContaining("App Automate") });
    }
  });

});

describe("TestReportingClient default sibling clients", () => {
  it("builds Automate and App Automate clients from the same options, without reusing the Test Reporting base URL", async () => {
    const hosts: string[] = [];
    const fetchFn: typeof fetch = async (input) => {
      const url = new URL(String(input));
      hosts.push(url.hostname);
      if (url.pathname === `/automate/sessions/${SESSION_ID}.json`) return json("automate-session-playwright.json");
      return new Response("not found", { status: 404, headers: { "content-type": "text/plain" } });
    };
    const tra = new TestReportingClient({ username: "u", accessKey: "k", fetchFn, baseUrl: "https://tra.example.test/ext/v1" });
    const linked = await tra.getTestSession(SESSION_ID);
    expect(linked?.product).toBe("automate");
    expect(hosts).toEqual(["api.browserstack.com"]);
  });

  it("also reaches App Automate by default, for mobile sessions", async () => {
    const fetchFn: typeof fetch = async (input) => {
      const p = new URL(String(input)).pathname;
      if (p === `/app-automate/sessions/${APP_SESSION.hashed_id}.json`) return json("app-automate-session.json");
      return new Response("not found", { status: 404, headers: { "content-type": "text/plain" } });
    };
    const tra = new TestReportingClient({ username: "u", accessKey: "k", fetchFn });
    expect((await tra.getTestSession(APP_SESSION.hashed_id))?.product).toBe("app-automate");
  });
});
