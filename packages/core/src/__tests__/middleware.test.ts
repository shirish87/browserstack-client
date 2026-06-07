import { describe, it, expect, vi } from "vitest";
import { composeMiddleware } from "../middleware";
import type { MiddlewareFunction } from "../middleware";

describe("composeMiddleware", () => {
  it("executes middleware in order and falls back to fetch", async () => {
    const logs: string[] = [];
    const mw1: MiddlewareFunction = async (req, next) => {
      logs.push("mw1 start");
      const res = await next(req);
      logs.push("mw1 end");
      return res;
    };
    const mw2: MiddlewareFunction = async (req, next) => {
      logs.push("mw2 start");
      const res = await next(req);
      logs.push("mw2 end");
      return res;
    };

    const mockFetch = vi.fn<typeof fetch>(async () => {
      logs.push("fetch");
      return new Response("ok");
    });

    const composed = composeMiddleware([mw1, mw2], mockFetch);
    const response = await composed("https://api.browserstack.com/test");

    expect(await response.text()).toBe("ok");
    expect(logs).toEqual(["mw1 start", "mw2 start", "fetch", "mw2 end", "mw1 end"]);
  });

  it("handles request modification and headers correctly", async () => {
    const mw: MiddlewareFunction = async (req, next) => {
      const headers = { ...req.headers, "x-custom-header": "custom-value" };
      return next({ ...req, headers });
    };

    const mockFetch = vi.fn<typeof fetch>(async (_url, init) => {
      const headers = init?.headers as Record<string, string>;
      return new Response(headers["x-custom-header"]);
    });

    const composed = composeMiddleware([mw], mockFetch);
    const response = await composed("https://api.browserstack.com/test", {
      headers: { "x-existing": "existing-value" },
    });

    expect(await response.text()).toBe("custom-value");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        headers: {
          "x-existing": "existing-value",
          "x-custom-header": "custom-value",
        },
      })
    );
  });

  it("prevents next() from being called multiple times", async () => {
    const mw: MiddlewareFunction = async (req, next) => {
      await next(req);
      return next(req); // double call should throw
    };

    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([mw], mockFetch);

    await expect(composed("https://api.browserstack.com/test")).rejects.toThrow(
      "next() called multiple times in middleware pipeline"
    );
  });

  it("handles request with standard Headers instances correctly", async () => {
    const requestHeaders = new Headers();
    requestHeaders.append("x-req-header", "req-val");
    const req = new Request("https://api.browserstack.com/test", {
      headers: requestHeaders,
      method: "POST"
    });

    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);
    await composed(req);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        method: "POST",
        headers: {
          "x-req-header": "req-val",
        },
      })
    );

    const initHeaders = new Headers();
    initHeaders.append("x-init-header", "init-val");
    await composed("https://api.browserstack.com/test", {
      headers: initHeaders,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        headers: {
          "x-init-header": "init-val",
        },
      })
    );
  });

  it("preserves initial standard RequestInit settings when calling the fallback fetch", async () => {
    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);

    await composed("https://api.browserstack.com/test", {
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
    } as RequestInit);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
      })
    );
  });

  it("handles array-formatted headers correctly", async () => {
    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);

    await composed("https://api.browserstack.com/test", {
      headers: [
        ["X-Array-Header-One", "value1"],
        ["X-Array-Header-Two", "value2"],
      ],
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        headers: {
          "x-array-header-one": "value1",
          "x-array-header-two": "value2",
        },
      })
    );
  });

  it("preserves standard settings from a Request object", async () => {
    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);

    const req = new Request("https://api.browserstack.com/test", {
      mode: "same-origin",
      credentials: "omit",
      cache: "no-store",
      redirect: "manual",
      referrer: "about:client",
      referrerPolicy: "no-referrer",
      integrity: "sha256-abc",
      keepalive: true,
    });

    await composed(req);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        mode: "same-origin",
        credentials: "omit",
        cache: "no-store",
        redirect: "manual",
        referrer: "about:client",
        referrerPolicy: "no-referrer",
        integrity: "sha256-abc",
        keepalive: true,
      })
    );
  });

  it("attaches duplex: 'half' when request body has a getReader function", async () => {
    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);

    const mockStream = {
      getReader: () => {},
    };

    await composed("https://api.browserstack.com/test", {
      method: "POST",
      body: mockStream as any,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        body: mockStream,
        duplex: "half",
      })
    );
  });

  it("attaches duplex: 'half' when request body has a pipe function (Node.js Readable stream)", async () => {
    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);

    const mockStream = {
      pipe: () => {},
    };

    await composed("https://api.browserstack.com/test", {
      method: "POST",
      body: mockStream as any,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        body: mockStream,
        duplex: "half",
      })
    );
  });

  it("safely handles malformed array headers (1D or length < 2)", async () => {
    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);

    await composed("https://api.browserstack.com/test", {
      headers: [
        ["X-Good-Header", "good"],
        ["X-Bad-Header-Short"],
        "X-Bad-String-Header",
      ] as any,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.browserstack.com/test",
      expect.objectContaining({
        headers: {
          "x-good-header": "good",
        },
      })
    );
  });

  it("coerces non-string header keys to string correctly", async () => {
    const composed = composeMiddleware([], vi.fn<typeof fetch>(async () => new Response("ok")));
    const res = await composed("http://api.x", { headers: [[123 as any, "value"]] });
    expect(res).toBeDefined();
  });

  it("coerces non-string header values in forEach branch to string correctly", async () => {
    const mockFetch = vi.fn<typeof fetch>(async () => new Response("ok"));
    const composed = composeMiddleware([], mockFetch);
    const customHeaders = {
      forEach: (cb: (value: unknown, key: string) => void) => {
        cb(123, "X-Num-Header");
      }
    };
    await composed("http://api.x", { headers: customHeaders as unknown as HeadersInit });
    expect(mockFetch).toHaveBeenCalledWith(
      "http://api.x",
      expect.objectContaining({
        headers: {
          "x-num-header": "123",
        },
      })
    );
  });
});

import { APIClient } from "../api-client";
import { BrowserStackError } from "../error";

class TestClient extends APIClient {
  constructor(options: any) {
    super(options, "http://api.x", "http://api-cloud.x", "test-pkg", "1.0.0");
  }
  public run(spec: any) {
    return this.execute(spec);
  }
}

describe("Client Middleware Pipeline", () => {
  it("intercepts and transforms requests and responses", async () => {
    const middleware: MiddlewareFunction = async (req, next) => {
      const modifiedReq = {
        ...req,
        url: req.url + "/extra",
        headers: { ...req.headers, "X-Custom": "transformed" },
      };
      const res = await next(modifiedReq);
      return res;
    };

    const fetchMock = vi.fn<typeof fetch>(async (url, init) => {
      expect(url).toBe("http://api.x/a/extra");
      expect((init?.headers as any)["X-Custom"]).toBe("transformed");
      return new Response('{"success":true}', { status: 200, headers: { "content-type": "application/json" } });
    });

    const client = new TestClient({
      middleware: [middleware],
      fetchFn: fetchMock,
    });

    const res = await client.run({
      operationId: "op",
      method: "GET",
      path: "/a",
      responseCodec: "json",
      responseCodecConfig: {},
    });
    expect(res).toEqual({ success: true });
  });

  it("enforces the middleware count cap", () => {
    const list = Array(11).fill(() => {});
    expect(() => new TestClient({ middleware: list })).toThrow(BrowserStackError);
  });

  it("prevents calling next() multiple times", async () => {
    const badMiddleware: MiddlewareFunction = async (req, next) => {
      await next(req);
      return await next(req);
    };
    const client = new TestClient({
      middleware: [badMiddleware],
      fetchFn: async () => new Response("{}", { status: 200 }),
    });
    await expect(client.run({
      operationId: "op", method: "GET", path: "/a",
      responseCodec: "json", responseCodecConfig: {},
    })).rejects.toThrow("next() called multiple times");
  });

  it("prevents circular/runaway executions", async () => {
    const loopMiddleware: MiddlewareFunction = async (_req, _next) => {
      return await client.run({
        operationId: "op", method: "GET", path: "/a",
        responseCodec: "json", responseCodecConfig: {},
      }) as any;
    };
    const client = new TestClient({
      middleware: [loopMiddleware],
      fetchFn: async () => new Response("{}", { status: 200 }),
    });
    await expect(client.run({
      operationId: "op", method: "GET", path: "/a",
      responseCodec: "json", responseCodecConfig: {},
    })).rejects.toThrow("Circular middleware execution or excessive recursion detected");
  });

  it("allows high concurrency using Promise.all without triggering recursion guard", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => {
      return new Response('{"success":true}', { status: 200, headers: { "content-type": "application/json" } });
    });
    const client = new TestClient({
      fetchFn: fetchMock,
    });
    const requests = Array.from({ length: 60 }, () =>
      client.run({
        operationId: "op",
        method: "GET",
        path: "/a",
        responseCodec: "json",
        responseCodecConfig: {},
      })
    );
    const results = await Promise.all(requests);
    expect(results).toHaveLength(60);
    for (const res of results) {
      expect(res).toEqual({ success: true });
    }
  });

  it("enforces client-side timeout and aborts locally", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => {
      const signal = init?.signal;
      if (signal) {
        if (signal.aborted) {
          throw signal.reason || new DOMException("The operation was aborted.", "AbortError");
        }
        await new Promise<void>((resolve, reject) => {
          signal.addEventListener("abort", () => {
            reject(signal.reason || new DOMException("The operation was aborted.", "AbortError"));
          });
          // resolve after 200ms if not aborted
          setTimeout(resolve, 200);
        });
      }
      return new Response('{"success":true}', { status: 200, headers: { "content-type": "application/json" } });
    });

    const client = new TestClient({
      timeout: 50,
      fetchFn: fetchMock,
    });

    await expect(client.run({
      operationId: "op",
      method: "GET",
      path: "/a",
      responseCodec: "json",
      responseCodecConfig: {},
    })).rejects.toThrow(/aborted/i);
  });
});

