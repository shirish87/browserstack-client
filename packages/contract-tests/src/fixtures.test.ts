import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { toCamelCase } from "@dot-slash/browserstack-openapi-transforms";
import { BuildDetailsSchema, BuildListResponseSchema, TestRunsResponseSchema } from "@dot-slash/browserstack-test-reporting/models";
import { AutomateBuildSchema, AutomateSessionSchema, HarArchiveSchema } from "@dot-slash/browserstack-automate/models";
import { AppAutomateBuildContainerSchema, AppAutomateSessionSchema } from "@dot-slash/browserstack-app-automate/models";
import { unmodelledKeys } from "./drift";

/** Real API responses captured with scripts/capture.mjs and sanitised. Raw (snake_case) as sent on the wire. */
function raw(name: string): unknown {
  return JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));
}

/** The clients camelCase every response before returning it; models describe that shape. */
const client = (name: string): unknown => toCamelCase(raw(name));

const Wrapped = <K extends string>(key: K) => z.object({ [key]: z.unknown() });

describe("Test Reporting & Analytics fixtures match the generated models", () => {
  it("build list", () => {
    const data = client("tra-build-list.json");
    const parsed = BuildListResponseSchema.parse(data);
    expect(parsed.builds?.length).toBeGreaterThan(0);
    expect(unmodelledKeys(BuildListResponseSchema, data)).toEqual([]);
  });

  it("build details, including millisecond durations", () => {
    const data = client("tra-build-details.json");
    const parsed = BuildDetailsSchema.parse(data);
    expect(parsed.duration).toBeGreaterThan(1000); // ms, not seconds
    expect(parsed.statusStats).toMatchObject({ passed: expect.any(Number), failed: expect.any(Number) });
    expect(unmodelledKeys(BuildDetailsSchema, data)).toEqual([]);
  });

  it.each(["tra-test-runs-playwright.json", "tra-test-runs-selenium.json", "tra-test-runs-final-page.json"])("test runs: %s", (name) => {
    const data = client(name);
    TestRunsResponseSchema.parse(data);
    expect(unmodelledKeys(TestRunsResponseSchema, data)).toEqual([]);
  });

  it("test tree: ROOT → DESCRIBE → TEST, with display names, retries and log keys intact", () => {
    const parsed = TestRunsResponseSchema.parse(client("tra-test-runs-selenium.json"));
    const root = parsed.hierarchy?.[0];
    expect(root?.type).toBe("ROOT");
    const describeNode = root?.children?.[0];
    expect(describeNode?.type).toBe("DESCRIBE");
    expect(describeNode?.details).toBeNull();
    const failed = describeNode?.children?.find((t) => t.details?.status === "failed");
    expect(failed?.displayName).toMatch(/fails on purpose/);
    expect(failed?.details?.retries?.[0]?.logs?.TEST_FAILURE?.length).toBeGreaterThan(0);
  });

  it("an empty final page terminates pagination", () => {
    const parsed = TestRunsResponseSchema.parse(client("tra-test-runs-final-page.json"));
    expect(parsed.hierarchy).toEqual([]);
    expect(parsed.pagination?.hasNext).toBe(false);
  });
});

describe("a diverse real build (Playwright via the BrowserStack SDK, two browsers)", () => {
  const pages = ["tra-test-runs-diverse-page1.json", "tra-test-runs-diverse-page2.json", "tra-test-runs-diverse-page3.json"];
  type Node = NonNullable<z.infer<typeof TestRunsResponseSchema>["hierarchy"]>[number];
  const nodes = (): Node[] => {
    const out: Node[] = [];
    const walk = (n: Node) => {
      out.push(n);
      (n.children ?? []).forEach(walk);
    };
    for (const name of pages) TestRunsResponseSchema.parse(client(name)).hierarchy?.forEach(walk);
    return out;
  };

  it.each(pages)("%s matches the models with no unmodelled fields", (name) => {
    const data = client(name);
    TestRunsResponseSchema.parse(data);
    expect(unmodelledKeys(TestRunsResponseSchema, data)).toEqual([]);
  });

  it("paginates by file and platform, five roots per page", () => {
    for (const name of pages) expect(TestRunsResponseSchema.parse(client(name)).hierarchy).toHaveLength(5);
  });

  it("covers every observed node type and leaf status; HOOK nodes are never reported", () => {
    const all = nodes();
    expect(new Set(all.map((n) => n.type))).toEqual(new Set(["ROOT", "DESCRIBE", "TEST"]));
    const statuses = new Set(all.filter((n) => n.type === "TEST").map((n) => n.details?.status));
    expect(statuses).toEqual(new Set(["passed", "failed", "skipped", "pending"]));
  });

  it("reports one platform root per file and browser, plus 'NA' roots for tests that never got a browser", () => {
    const roots = nodes().filter((n) => n.type === "ROOT");
    const platforms = new Set(roots.map((r) => `${r.details?.os?.key}|${r.details?.browser?.key}`));
    expect([...platforms].some((p) => p === "NA|NA")).toBe(true);
    expect([...platforms].some((p) => p.startsWith("Windows,11|Chrome,"))).toBe(true);
    expect([...platforms].some((p) => p.startsWith("Windows,11|playwright-firefox,"))).toBe(true);
  });

  it("a test has a session unless it never launched a browser; sessions are mostly per test", () => {
    const tests = nodes().filter((n) => n.type === "TEST");
    const ids = tests.map((t) => t.details?.sessionId).filter((id): id is string => Boolean(id));
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.length).toBeLessThanOrEqual(tests.length);
    expect(new Set(ids).size).toBeGreaterThan(1);
  });

  it("failed tests carry TEST_FAILURE lines on their attempt; smart-tag fields are absent on a plan without them", () => {
    const failed = nodes().filter((n) => n.type === "TEST" && n.details?.status === "failed");
    expect(failed.length).toBeGreaterThan(0);
    for (const t of failed) expect(t.details?.retries?.some((r) => (r.logs?.TEST_FAILURE ?? []).length > 0)).toBe(true);
    for (const t of nodes().filter((n) => n.type === "TEST")) {
      expect(t.details?.isFlaky).toBeUndefined();
      expect(t.details?.isNewFailure).toBeUndefined();
    }
  });
});

describe("Automate fixtures match the generated models", () => {
  it("session", () => {
    const data = toCamelCase(Wrapped("automation_session").parse(raw("automate-session-playwright.json")).automation_session);
    const parsed = AutomateSessionSchema.parse(data);
    expect(parsed.buildHashedId).toMatch(/^[0-9a-f]{40}$/);
    expect(parsed.playwrightLogsUrl).toBeTruthy();
    expect(unmodelledKeys(AutomateSessionSchema, data)).toEqual([]);
  });

  it("network log (HAR)", () => {
    // HAR keys (startedDateTime, httpVersion, ...) are already camelCase and pass through the client unchanged.
    const data = client("automate-network-logs.har.json");
    const parsed = HarArchiveSchema.parse(data);
    expect(parsed.log?.entries?.[0]?.request?.method).toBeTruthy();
    expect(unmodelledKeys(HarArchiveSchema, data)).toEqual([]);
  });

  it("build", () => {
    const first = z.array(Wrapped("automation_build")).parse(raw("automate-builds.json"))[0];
    const data = toCamelCase(first?.automation_build);
    AutomateBuildSchema.parse(data);
    expect(unmodelledKeys(AutomateBuildSchema, data)).toEqual([]);
  });
});

describe("the TRA → Automate join", () => {
  it("a test's details.sessionId is the Automate session hashedId, shared by tests in a file", () => {
    const tra = TestRunsResponseSchema.parse(client("tra-test-runs-playwright.json"));
    const session = AutomateSessionSchema.parse(toCamelCase(Wrapped("automation_session").parse(raw("automate-session-playwright.json")).automation_session));
    const ids = (tra.hierarchy ?? []).flatMap((root) => (root.children ?? []).map((t) => t.details?.sessionId));
    expect(ids.length).toBeGreaterThan(1);
    expect(new Set(ids).size).toBe(1);
    expect(ids[0]).toBe(session.hashedId);
  });
});

describe("App Automate (Appium on a real Android device) fixtures", () => {
  const unwrapSession = (name: string): unknown => toCamelCase(Wrapped("automation_session").parse(raw(name)).automation_session);

  it("session: matches the model, with null browser and the mobile-only fields", () => {
    const data = unwrapSession("app-automate-session.json");
    const parsed = AppAutomateSessionSchema.parse(data);
    expect(parsed.status).toBe("failed");
    expect(parsed.browser).toBeNull();
    expect(parsed.device).toBe("Google Pixel 7");
    expect(parsed.appDetails?.appUrl).toMatch(/^bs:\/\//);
    expect(parsed.deviceLogsUrl).toBeTruthy();
    expect(parsed.buildHashedId).toMatch(/^[0-9a-f]{40}$/);
    expect(unmodelledKeys(AppAutomateSessionSchema, data)).toEqual([]);
  });

  it("session list: unwrapped sessions use the passed/failed vocabulary", () => {
    const items = z.array(Wrapped("automation_session")).parse(raw("app-automate-sessions.json")).map((x) => toCamelCase(x.automation_session));
    expect(items).toHaveLength(3);
    for (const item of items) {
      AppAutomateSessionSchema.parse(item);
      expect(unmodelledKeys(AppAutomateSessionSchema, item)).toEqual([]);
    }
    expect(items.map((i) => AppAutomateSessionSchema.parse(i).status).sort()).toEqual(["failed", "passed", "passed"]);
  });

  it("build detail: keeps the wrapper (unlike Automate) with lighter embedded sessions", () => {
    // The client unwraps only `build`: { automationBuild, sessions: [{ automationSession }] }.
    const data = toCamelCase(z.object({ build: z.unknown() }).parse(raw("app-automate-build.json")).build);
    const parsed = AppAutomateBuildContainerSchema.parse(data);
    expect(parsed.sessions).toHaveLength(3);
    expect(unmodelledKeys(AppAutomateBuildContainerSchema, data)).toEqual([]);
  });

  it("an uncaptured network log is a 400 whose message carries a stable code", () => {
    const body = z.object({ status: z.literal(400), message: z.string() }).parse(raw("app-automate-network-logs-not-captured.json"));
    expect(body.message).toMatch(/^\[BROWSERSTACK_[A-Z_]+NOT_CAPTURED\]/);
  });

  it("no fixture carries a share token, device serial, install path or local path", () => {
    const dir = new URL("../fixtures/", import.meta.url);
    for (const name of readdirSync(dir)) {
      const body = readFileSync(new URL(name, dir), "utf8");
      expect(body, name).not.toMatch(/public-build\/(?!TOKEN\b)/);
      expect(body, name).not.toMatch(/udid"?\s*:\s*"(?!UDID")/i);
      expect(body, name).not.toMatch(/\/data\/app\/~~/);
      expect(body, name).not.toMatch(/\/(?:tmp|home|Users)\//);
    }
  });

  it("TRA: the mobile build's tree names the device and has no browser; sessions are per spec file", () => {
    const data = client("tra-test-runs-appium.json");
    const parsed = TestRunsResponseSchema.parse(data);
    expect(unmodelledKeys(TestRunsResponseSchema, data)).toEqual([]);
    const root = parsed.hierarchy?.[0];
    expect(root?.details?.device).toBe("Google Pixel 7");
    expect(root?.details?.isRealDevice).toBe(true);
    expect(root?.details?.browser?.key).toBe("Unknown,app");
    const tests: { name: string | null | undefined; status: string | null | undefined; session: string | null | undefined }[] = [];
    const walk = (n: NonNullable<typeof parsed.hierarchy>[number]) => {
      if (n.type === "TEST") tests.push({ name: n.displayName, status: n.details?.status, session: n.details?.sessionId });
      (n.children ?? []).forEach(walk);
    };
    parsed.hierarchy?.forEach(walk);
    expect(tests.map((t) => t.status).sort()).toEqual(["failed", "passed", "passed", "passed", "skipped"].sort());
    const skipped = tests.find((t) => t.status === "skipped");
    const sameFile = tests.filter((t) => t.session === skipped?.session);
    expect(sameFile.length).toBeGreaterThan(1); // a skipped test still reports its file's session
  });

  it("the TRA → App Automate join: every test session_id is in the App Automate build's session list, and not in Automate", () => {
    const tra = TestRunsResponseSchema.parse(client("tra-test-runs-appium.json"));
    const ids: string[] = [];
    const walk = (n: NonNullable<typeof tra.hierarchy>[number]) => {
      if (n.type === "TEST" && n.details?.sessionId) ids.push(n.details.sessionId);
      (n.children ?? []).forEach(walk);
    };
    tra.hierarchy?.forEach(walk);
    const known = new Set(z.array(Wrapped("automation_session")).parse(raw("app-automate-sessions.json")).map((x) => AppAutomateSessionSchema.parse(toCamelCase(x.automation_session)).hashedId));
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(known.has(id)).toBe(true);
  });

  it("TRA build details name the reporting framework", () => {
    const data = client("tra-build-details-appium.json");
    const parsed = BuildDetailsSchema.parse(data);
    expect(parsed.observabilityVersion?.frameworkName).toBe("WebdriverIO-mocha");
    expect(unmodelledKeys(BuildDetailsSchema, data)).toEqual([]);
  });
});
