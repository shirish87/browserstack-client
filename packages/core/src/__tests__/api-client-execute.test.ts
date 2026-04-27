import { describe, expect, it, vi } from "vitest";
import { APIClient } from "../api-client";
import { HttpError } from "@dot-slash/browserstack-openapi-transforms";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class TestClient extends APIClient {
  run(path: string, method: HttpMethod) {
    return this.execute({
      operationId: "x", method, path, responseCodec: "json", responseCodecConfig: {}, baseUrl: "sdk",
    });
  }
}

describe("APIClient.execute()", () => {
  it("resolves sdk base URL and returns JSON", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response('{"ok":true}', { status: 200, headers: { "content-type": "application/json" } }));
    const c = new TestClient({ username: "u", accessKey: "k", fetchFn }, "https://api.example.com", "https://api-cloud.example.com", "pkg", "1.0");
    await expect(c.run("/foo", "GET")).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledWith("https://api.example.com/foo", expect.objectContaining({ method: "GET" }));
    const callInit = fetchFn.mock.calls[0]?.[1] as RequestInit & { headers: Record<string, string> };
    expect(callInit.headers.Authorization).toMatch(/^Basic /);
  });
  it("routes to cloud base URL when baseUrl: 'sdkCloud'", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response('{}', { status: 200, headers: { "content-type": "application/json" } }));
    class C extends APIClient {
      run() { return this.execute({ operationId: "x", method: "GET", path: "/a", responseCodec: "json", responseCodecConfig: {}, baseUrl: "sdkCloud" }); }
    }
    const c = new C({ username: "u", accessKey: "k", fetchFn }, "https://sdk", "https://cloud", "p", "1");
    await c.run();
    expect(fetchFn).toHaveBeenCalledWith("https://cloud/a", expect.anything());
  });
  it("non-2xx throws HttpError", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response('{"error":"nope"}', { status: 400, headers: { "content-type": "application/json" } }));
    const c = new TestClient({ username: "u", accessKey: "k", fetchFn }, "https://a", "https://b", "p", "1");
    await expect(c.run("/x", "GET")).rejects.toBeInstanceOf(HttpError);
  });
});
