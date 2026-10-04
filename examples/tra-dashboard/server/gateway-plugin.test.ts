import { describe, expect, it } from "vitest";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createTraGatewayHandler } from "./gateway-plugin";

async function withServer<T>(fetchFn: typeof fetch, run: (base: string) => Promise<T>): Promise<T> {
  const handler = createTraGatewayHandler({ fetchFn });
  const server: Server = createServer((req, res) => {
    handler(req, res, (err) => {
      res.statusCode = 500;
      res.end(String(err));
    });
  });
  await new Promise<void>((r) => server.listen(0, r));
  try {
    const addr: AddressInfo | string | null = server.address();
    if (addr === null || typeof addr === "string") throw new Error("server not listening on a TCP port");
    return await run(`http://127.0.0.1:${addr.port}`);
  } finally {
    server.close();
  }
}

const target = encodeURIComponent("https://api-automation.browserstack.com/ext/v1/projects");
const echo: typeof fetch = async (_url, init) =>
  new Response(JSON.stringify({ auth: new Headers(init?.headers).get("authorization") }), {
    headers: { "content-type": "application/json" },
  });

describe("TRA gateway handler", () => {
  it("400s without credential headers", async () => {
    await withServer(echo, async (base) => {
      const res = await fetch(`${base}/?url=${target}`);
      expect(res.status).toBe(400);
    });
  });

  it("forwards allowed TRA hosts with Basic auth derived from the headers", async () => {
    await withServer(echo, async (base) => {
      const res = await fetch(`${base}/?url=${target}`, {
        headers: { "x-browserstack-username": "u", "x-browserstack-access-key": "k" },
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ auth: `Basic ${Buffer.from("u:k").toString("base64")}` });
    });
  });

  it("403s hosts outside the allowlist", async () => {
    await withServer(echo, async (base) => {
      const res = await fetch(`${base}/?url=${encodeURIComponent("https://evil.example.com/x")}`, {
        headers: { "x-browserstack-username": "u", "x-browserstack-access-key": "k" },
      });
      expect(res.status).toBe(403);
    });
  });
});
