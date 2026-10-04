import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { filterTree, normalizeHierarchy, normalizeStatus } from "./hierarchy";
import { formatDuration, formatPercent, outcomes, passRate, totalTests } from "./format";
import { CredentialsSchema, TestRunsResponseSchema, hasBuildId, isNamedProject } from "./schemas";

/** Real, sanitised API captures shared with the contract tests. */
const fixture = (name: string): string => readFileSync(new URL(`../../../../packages/contract-tests/fixtures/${name}`, import.meta.url), "utf8");

/** Runs a capture through the real client, so the dashboard parses exactly what it will receive. */
async function testRuns(name: string) {
  const client = new TestReportingClient({
    username: "u",
    accessKey: "k",
    fetchFn: async () => new Response(fixture(name), { headers: { "content-type": "application/json" } }),
  });
  return TestRunsResponseSchema.parse(await client.getTestRuns("b"));
}

describe("normalizeStatus", () => {
  it("maps TRA's vocabulary onto five outcomes", () => {
    expect(normalizeStatus("PASSED")).toBe("passed");
    expect(normalizeStatus("timeout")).toBe("failed");
    expect(normalizeStatus("in progress")).toBe("pending");
    expect(normalizeStatus("blocked")).toBe("skipped");
    expect(normalizeStatus(42)).toBe("unknown");
  });
});

describe("normalizeHierarchy on a real capture", async () => {
  const parsed = await testRuns("tra-test-runs-diverse-page1.json");
  const tree = normalizeHierarchy(parsed.hierarchy ?? []);
  const failures = tree.find((r) => r.name === "failures.spec.js");
  const leaves = (n: (typeof tree)[number]): (typeof tree)[number][] => (n.children.length === 0 ? [n] : n.children.flatMap(leaves));
  const timeout = failures && leaves(failures).find((t) => t.name.startsWith("timeout:"));

  it("names nodes by displayName and keeps ROOT → DESCRIBE → TEST structure", () => {
    expect(failures?.type).toBe("ROOT");
    expect(timeout?.type).toBe("TEST");
  });
  it("rolls up counts of the leaves", () => {
    expect(failures?.counts.failed).toBe(5);
    expect(failures?.leafCount).toBe(6);
  });
  it("reads status, millisecond duration, start time and the session it ran in", () => {
    expect(timeout).toMatchObject({ status: "failed", durationMs: 40933, startedAt: "2026-10-04T16:00:22.447+00:00" });
    expect(timeout?.sessionId).toMatch(/^[0-9a-f]{40}$/);
  });
  it("takes the failure from the last attempt: first line is the message, the rest the stack", () => {
    expect(timeout?.failures[0]?.error).toBe("TimeoutError: page.waitForSelector: Timeout 2500ms exceeded.");
    expect(timeout?.failures[0]?.backtrace).toContain("failures.spec.js:12:16");
  });
  it("inherits where it ran from its ROOT", () => {
    expect(timeout?.platform).toEqual({ browser: "chrome 154.0", os: "windows 11", file: "tests/failures.spec.js" });
  });
  it("filters by name keeping ancestors", () => {
    const hit = filterTree(tree, "timeout:");
    expect(hit[0]?.name).toBe("failures.spec.js");
    expect(leaves(hit[0] ?? tree[0]!).map((l) => l.name)).toEqual([timeout?.name]);
    expect(filterTree(tree, "zzz")).toEqual([]);
  });
});

describe("normalizeHierarchy on a mobile capture", async () => {
  const parsed = await testRuns("tra-test-runs-appium.json");
  const first = normalizeHierarchy(parsed.hierarchy ?? [])[0];
  it("reports the device and no browser, and several files share no session", () => {
    expect(first?.platform.device).toBe("Google Pixel 7");
    expect(first?.platform.browser).toBeUndefined();
  });
});

describe("derived flags", () => {
  const mk = (details: Record<string, unknown>) =>
    normalizeHierarchy([{ type: "TEST", displayName: "t", children: [], details }])[0];
  it("calls a pass after a failed attempt flaky when the smart tag is absent (plan-gated)", () => {
    expect(mk({ status: "passed", retries: [{ status: "failed" }, { status: "passed" }] })).toMatchObject({ isFlaky: true, retries: 1, attempts: 2 });
    expect(mk({ status: "passed", retries: [{ status: "passed" }] })).toMatchObject({ isFlaky: false, retries: null });
  });
  it("trusts the smart tag when TRA sends one", () => {
    expect(mk({ status: "passed", isFlaky: false, retries: [{ status: "failed" }, { status: "passed" }] })?.isFlaky).toBe(false);
  });
  it("treats an empty session_id as no session", () => {
    expect(mk({ status: "passed", sessionId: "" })?.sessionId).toBeUndefined();
  });
});

describe("format", () => {
  it("formats durations", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(450)).toBe("450ms");
    expect(formatDuration(65_000)).toBe("1m 5s");
    expect(formatDuration(3_700_000)).toBe("1h 1m");
  });
  it("folds TRA's wider status vocabulary into the five outcomes", () => {
    expect(outcomes({ passed: 3, failed: 1, timeout: 1, "in progress": 2, untested: 1, retest: 1, blocked: 1, skipped: 1, pending: 1 })).toEqual({ passed: 3, failed: 2, pending: 5, skipped: 2, unknown: 0 });
  });
  it("computes rates", () => {
    const s = { passed: 3, failed: 1, skipped: 2 };
    expect(totalTests(s)).toBe(6);
    expect(formatPercent(passRate(s))).toBe("75%");
    expect(passRate({ passed: 0, failed: 0, skipped: 1 })).toBeNull();
    expect(passRate(undefined)).toBeNull();
  });
});

describe("schemas", () => {
  it("rejects blank credentials", () => {
    expect(CredentialsSchema.safeParse({ username: " ", accessKey: "k" }).success).toBe(false);
  });
  it("keeps only builds and projects the UI can open", () => {
    expect(hasBuildId({ buildId: "b" })).toBe(true);
    expect(hasBuildId({ name: "x" })).toBe(false);
    expect(isNamedProject({ id: 1, name: "p" })).toBe(true);
    expect(isNamedProject({ id: 1 })).toBe(false);
  });
});
