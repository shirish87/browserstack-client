import { describe, expect, it, vi } from "vitest";
import { createWebRouter, createGateway } from "../index";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";

describe("Server-Side Router", () => {
  const allowedHosts = ["api.browserstack.com"];

  it("requires at least one allowed host", () => {
    expect(() => createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts: [],
    })).toThrow("allowedHosts must include at least one host");
  });

  it("rejects target hosts not configured by the server", async () => {
    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
    });

    const request = new Request("http://localhost/gateway?url=https://malicious-site.com/steal");
    const response = await router(request);

    expect(response.status).toBe(403);
    const body = await response.text();
    expect(body).toBe("Forbidden target host");
  });

  it("rejects non-HTTPS target URLs", async () => {
    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
    });

    const request = new Request("http://localhost/gateway?url=http://api.browserstack.com/automate/projects.json");
    const response = await router(request);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("Forbidden target protocol");
  });

  it("injects Basic Auth header and forwards whitelisted request", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (url, init) => {
      expect(url).toBe("https://api.browserstack.com/automate/projects.json");
      expect((init?.headers as any).get("Authorization")).toBe("Basic dXNlcjprZXk="); // base64 of 'user:key'
      return new Response('{"ok":true}', { status: 200 });
    });

    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
      fetchFn: fetchMock,
    });

    const request = new Request("http://localhost/gateway?url=https://api.browserstack.com/automate/projects.json");
    const response = await router(request);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("respects and caps timeout header", async () => {
    let fetchOptions: any;
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => {
      fetchOptions = init;
      return new Response("{}", { status: 200 });
    });

    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
      fetchFn: fetchMock,
      maxTimeout: 1000,
    });

    // Request specifying a high timeout (e.g. 5000ms)
    const request = new Request(
      "http://localhost/gateway?url=https://api.browserstack.com/automate/projects.json",
      {
        headers: { "x-browserstack-timeout": "5000" },
      }
    );
    await router(request);
    
    // Header should be deleted from forwarded headers so it doesn't propagate upstream
    const forwardedHeaders = fetchOptions.headers;
    expect(forwardedHeaders.get("x-browserstack-timeout")).toBeNull();
  });

  it("respects and caps timeout header using fake timers", async () => {
    vi.useFakeTimers();

    let fetchSignal: AbortSignal | undefined;
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => {
      fetchSignal = init?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        if (fetchSignal) {
          const onAbort = () => {
            const err = new Error("The user aborted a request.");
            err.name = "AbortError";
            reject(err);
          };
          if (fetchSignal.aborted) {
            onAbort();
          } else {
            fetchSignal.addEventListener("abort", onAbort);
          }
        }
      });
    });

    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
      fetchFn: fetchMock,
      maxTimeout: 1000, // max timeout 1000ms
    });

    const request = new Request(
      "http://localhost/gateway?url=https://api.browserstack.com/automate/projects.json",
      {
        headers: { "x-browserstack-timeout": "5000" }, // client requests 5000ms
      }
    );

    const responsePromise = router(request);

    // Fast-forward 900ms - should NOT be aborted yet
    await vi.advanceTimersByTimeAsync(900);
    expect(fetchSignal?.aborted).toBe(false);

    // Fast-forward another 150ms (total 1050ms) - should be aborted since it is capped at 1000ms
    await vi.advanceTimersByTimeAsync(150);
    expect(fetchSignal?.aborted).toBe(true);

    const response = await responsePromise;
    expect(response.status).toBe(504);
    expect(await response.text()).toBe("Gateway Timeout");

    vi.useRealTimers();
  });

  it("uses default timeout when no header is provided", async () => {
    vi.useFakeTimers();

    let fetchSignal: AbortSignal | undefined;
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => {
      fetchSignal = init?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        if (fetchSignal) {
          const onAbort = () => {
            const err = new Error("The user aborted a request.");
            err.name = "AbortError";
            reject(err);
          };
          if (fetchSignal.aborted) {
            onAbort();
          } else {
            fetchSignal.addEventListener("abort", onAbort);
          }
        }
      });
    });

    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
      fetchFn: fetchMock,
      defaultTimeout: 500, // default 500ms
    });

    const request = new Request("http://localhost/gateway?url=https://api.browserstack.com/automate/projects.json");
    const responsePromise = router(request);

    // Fast-forward 400ms - should not abort
    await vi.advanceTimersByTimeAsync(400);
    expect(fetchSignal?.aborted).toBe(false);

    // Fast-forward another 150ms (total 550ms) - should abort
    await vi.advanceTimersByTimeAsync(150);
    expect(fetchSignal?.aborted).toBe(true);

    const response = await responsePromise;
    expect(response.status).toBe(504);

    vi.useRealTimers();
  });

  it("strips content-encoding/content-length from upstream responses (fetch already decodes the body)", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => {
      return new Response('{"ok":true}', {
        status: 200,
        headers: {
          "content-encoding": "br",
          "content-length": "12345",
          "content-type": "application/json; charset=utf-8",
        },
      });
    });

    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
      fetchFn: fetchMock,
    });

    const request = new Request("http://localhost/gateway?url=https://api.browserstack.com/automate/projects.json");
    const response = await router(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-encoding")).toBeNull();
    expect(response.headers.get("content-length")).toBeNull();
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await response.text()).toBe('{"ok":true}');
  });

  it("transparently returns 502 on network-level upstream failures", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => {
      throw new Error("DNS resolution failed");
    });

    const router = createWebRouter({
      username: "user",
      accessKey: "key",
      allowedHosts,
      fetchFn: fetchMock,
    });

    const request = new Request("http://localhost/gateway?url=https://api.browserstack.com/automate/projects.json");
    const response = await router(request);

    expect(response.status).toBe(502);
    const body = await response.text();
    expect(body).toBe("Bad Gateway: DNS resolution failed");
  });

  it("gateway handles request and streams response", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (_url, _init) => {
      return new Response("hello from upstream", {
        status: 201,
        statusText: "Created",
        headers: { "x-upstream-header": "yes" },
      });
    });

    const gateway = createGateway({
      username: "user",
      accessKey: "key",
      allowedHosts,
      fetchFn: fetchMock,
    });

    // Create a mock socket
    const socket = new Socket();

    // Create mock req
    const req = new IncomingMessage(socket);
    req.method = "GET";
    req.url = "/gateway?url=https://api.browserstack.com/automate/projects.json";
    req.headers = { host: "localhost:3000" };

    // Create mock res
    const headers: Record<string, any> = {};
    const chunks: any[] = [];
    let ended = false;

    const res = {
      socket,
      statusCode: 200,
      statusMessage: "",
      setHeader(name: string, value: any) {
        headers[name.toLowerCase()] = value;
      },
      write(chunk: any) {
        chunks.push(Buffer.from(chunk));
      },
      end() {
        ended = true;
      },
    } as unknown as ServerResponse;

    await gateway(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.statusMessage).toBe("Created");
    expect(headers["x-upstream-header"]).toBe("yes");
    const responseBody = Buffer.concat(chunks).toString("utf-8");
    expect(responseBody).toBe("hello from upstream");
    expect(ended).toBe(true);
  });
});
