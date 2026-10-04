import { describe, expect, it } from "vitest";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { traApi } from "./api";

/** A client that records the URL of the request it makes and answers with an empty hierarchy. */
function recording() {
  const urls: URL[] = [];
  const client = new TestReportingClient({
    username: "u",
    accessKey: "k",
    fetchFn: async (input) => {
      urls.push(new URL(input instanceof Request ? input.url : String(input)));
      return new Response(JSON.stringify({ name: "p", hierarchy: [] }), { headers: { "content-type": "application/json" } });
    },
  });
  return { client, urls };
}

describe("traApi.testRuns", () => {
  // Live TRA answers 500 "Internal System Exception" to `sort` without `order`.
  it("always sends an order with a sort", async () => {
    const { client, urls } = recording();
    await traApi.testRuns(client, "b", { sort: "DURATION" });
    expect(urls[0]?.searchParams.get("sort")).toBe("DURATION");
    expect(urls[0]?.searchParams.get("order")).toBe("Asc");
  });

  it("sends neither when no sort is asked for", async () => {
    const { client, urls } = recording();
    await traApi.testRuns(client, "b", {});
    expect(urls[0]?.searchParams.has("sort")).toBe(false);
    expect(urls[0]?.searchParams.has("order")).toBe(false);
  });
});

describe("traApi.qualityGateProfile", () => {
  it("reads one profile's rules by project name and profile id", async () => {
    const urls: string[] = [];
    const client = new TestReportingClient({
      username: "u",
      accessKey: "k",
      fetchFn: async (input) => {
        urls.push(new URL(input instanceof Request ? input.url : String(input)).pathname);
        return new Response(JSON.stringify({ id: "p1", name: "Release gate", enabled: true, is_global_profile: false, rules: [{ metric: "failed", operator: "<=", value: 1 }], rule_status: "fail", hooks_visibility: "failed", applicable_builds: { tags: ["release"] } }), { headers: { "content-type": "application/json" } });
      },
    });
    const p = await traApi.qualityGateProfile(client, "My Project", "p1");
    expect(urls[0]).toMatch(/\/quality-gates\/My%20Project\/profiles\/p1$/);
    expect(p).toMatchObject({ name: "Release gate", ruleStatus: "fail", hooksVisibility: "failed", rules: [{ metric: "failed" }] });
  });
});
