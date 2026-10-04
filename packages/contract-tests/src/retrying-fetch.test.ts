import { describe, expect, it } from "vitest";
import { retryingFetch } from "./retrying-fetch";

const res = (status: number) => new Response(status === 200 ? "ok" : "no", { status });
const scripted = (...steps: (number | Error)[]): { fetchFn: typeof fetch; calls: () => number } => {
  let i = 0;
  return {
    calls: () => i,
    fetchFn: async () => {
      const step = steps[Math.min(i++, steps.length - 1)];
      if (step instanceof Error) throw step;
      return res(step ?? 200);
    },
  };
};
const fast = { retries: 2, baseDelayMs: 1 };

describe("retryingFetch", () => {
  it("retries a 503 until it succeeds", async () => {
    const s = scripted(503, 502, 200);
    const out = await retryingFetch(s.fetchFn, fast)("https://x");
    expect(out.status).toBe(200);
    expect(s.calls()).toBe(3);
  });

  it("retries rate limiting and thrown network errors", async () => {
    const s = scripted(429, new TypeError("fetch failed"), 200);
    expect((await retryingFetch(s.fetchFn, fast)("https://x")).status).toBe(200);
    expect(s.calls()).toBe(3);
  });

  it("never retries a client error: a 4xx is a contract answer, not a transient fault", async () => {
    for (const status of [400, 401, 403, 404]) {
      const s = scripted(status, 200);
      expect((await retryingFetch(s.fetchFn, fast)("https://x")).status).toBe(status);
      expect(s.calls()).toBe(1);
    }
  });

  it("gives up after the configured retries and returns the last response", async () => {
    const s = scripted(500);
    expect((await retryingFetch(s.fetchFn, fast)("https://x")).status).toBe(500);
    expect(s.calls()).toBe(3);
  });

  it("rethrows the network error once retries are exhausted", async () => {
    const s = scripted(new TypeError("fetch failed"));
    await expect(retryingFetch(s.fetchFn, fast)("https://x")).rejects.toThrow("fetch failed");
    expect(s.calls()).toBe(3);
  });
});
