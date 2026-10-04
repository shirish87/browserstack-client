import { describe, expect, it } from "vitest";
import { filterTree, normalizeHierarchy, normalizeStatus } from "./hierarchy";
import { formatDuration, formatPercent, passRate, totalTests } from "./format";
import { CredentialsSchema, TestRunsResponseSchema, BuildsResponseSchema } from "./schemas";

describe("normalizeStatus", () => {
  it("maps variants", () => {
    expect(normalizeStatus("PASSED")).toBe("passed");
    expect(normalizeStatus("timeout")).toBe("failed");
    expect(normalizeStatus(42)).toBe("unknown");
  });
});

describe("normalizeHierarchy", () => {
  const parsed = TestRunsResponseSchema.parse({
    hierarchy: [
      {
        name: "Suite",
        children: [
          { name: "a", details: { status: "passed", duration: 1500, isFlaky: true, browser: "chrome" } },
          { name: "b", details: { status: "failed", retries: [{}, {}] } },
        ],
      },
    ],
  });
  const tree = normalizeHierarchy(parsed.hierarchy);

  it("rolls up counts", () => {
    expect(tree[0]?.counts).toMatchObject({ passed: 1, failed: 1 });
    expect(tree[0]?.leafCount).toBe(2);
  });
  it("reads details and keeps extras", () => {
    const a = tree[0]?.children[0];
    expect(a?.durationMs).toBe(1500);
    expect(a?.isFlaky).toBe(true);
    expect(a?.extra).toEqual({ browser: "chrome" });
    expect(tree[0]?.children[1]?.retries).toBe(2);
  });
  it("filters by name keeping ancestors", () => {
    expect(filterTree(tree, "b")[0]?.children.map((c) => c.name)).toEqual(["b"]);
    expect(filterTree(tree, "zzz")).toEqual([]);
  });
});

describe("format", () => {
  it("formats durations", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(450)).toBe("450ms");
    expect(formatDuration(65_000)).toBe("1m 5s");
    expect(formatDuration(3_700_000)).toBe("1h 1m");
  });
  it("computes rates", () => {
    const s = { passed: 3, failed: 1, pending: 0, skipped: 2, unknown: 0 };
    expect(totalTests(s)).toBe(6);
    expect(formatPercent(passRate(s))).toBe("75%");
    expect(passRate({ passed: 0, failed: 0, pending: 0, skipped: 1, unknown: 0 })).toBeNull();
  });
});

describe("schemas", () => {
  it("rejects blank credentials", () => {
    expect(CredentialsSchema.safeParse({ username: " ", accessKey: "k" }).success).toBe(false);
  });
  it("defaults missing arrays", () => {
    expect(BuildsResponseSchema.parse({}).builds).toEqual([]);
  });
  it("rejects a build without an id", () => {
    expect(BuildsResponseSchema.safeParse({ builds: [{ name: "x" }] }).success).toBe(false);
  });
});
