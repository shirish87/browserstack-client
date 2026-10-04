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
