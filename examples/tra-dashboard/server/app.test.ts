import { afterEach, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { z } from "zod";
import { createApp } from "./app";

const BASIC = `Basic ${Buffer.from("u:k").toString("base64")}`;
const TRA = "https://api-automation.browserstack.com/ext/v1/projects";

/** Upstream double: 200 only when the Basic auth header matches u:k. */
const upstream: typeof fetch = async (_url, init) => {
  const auth = new Headers(init?.headers).get("authorization");
  if (auth !== BASIC) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  return new Response(JSON.stringify({ projects: [{ id: 1, name: "p" }] }), {
    headers: { "content-type": "application/json" },
  });
};

let server: Server | undefined;
afterEach(() => server?.close());

async function start(): Promise<string> {
  const app = createApp({ fetchFn: upstream, publicDir: undefined, cookieSecure: false, sessionTtlMs: 60_000 });
  const s = await new Promise<Server>((resolve) => {
    const l = app.listen(0, () => resolve(l));
  });
  server = s;
  const addr = s.address();
  if (addr === null || typeof addr === "string") throw new Error("not listening");
  return `http://127.0.0.1:${addr.port}`;
}

const SessionBody = z.object({ username: z.string() });

async function login(base: string, creds = { username: "u", accessKey: "k" }): Promise<{ res: Response; cookie: string }> {
  const res = await fetch(`${base}/api/session`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: base },
    body: JSON.stringify(creds),
  });
  return { res, cookie: res.headers.get("set-cookie")?.split(";")[0] ?? "" };
}

describe("session API", () => {
  it("rejects invalid bodies with 400", async () => {
    const base = await start();
    const { res } = await login(base, { username: "", accessKey: "" });
    expect(res.status).toBe(400);
  });

  it("rejects credentials TRA refuses with 401 and sets no cookie", async () => {
    const base = await start();
    const { res } = await login(base, { username: "u", accessKey: "wrong" });
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("logs in with an HttpOnly SameSite=Strict cookie and never echoes the key", async () => {
    const base = await start();
    const { res } = await login(base);
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Strict/i);
    const text = await res.text();
    expect(SessionBody.parse(JSON.parse(text))).toEqual({ username: "u" });
    expect(text).not.toContain("k\"");
  });

  it("GET reports the current user, 401 when anonymous, and logout ends the session", async () => {
    const base = await start();
    expect((await fetch(`${base}/api/session`)).status).toBe(401);
    const { cookie } = await login(base);
    const me = await fetch(`${base}/api/session`, { headers: { cookie } });
    expect(SessionBody.parse(await me.json())).toEqual({ username: "u" });
    const out = await fetch(`${base}/api/session`, { method: "DELETE", headers: { cookie, origin: base } });
    expect(out.status).toBe(204);
    expect((await fetch(`${base}/api/session`, { headers: { cookie } })).status).toBe(401);
  });

  it("refuses cross-origin state changes", async () => {
    const base = await start();
    const res = await fetch(`${base}/api/session`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://evil.example" },
      body: JSON.stringify({ username: "u", accessKey: "k" }),
    });
    expect(res.status).toBe(403);
  });
});

describe("gateway", () => {
  it("requires a session", async () => {
    const base = await start();
    expect((await fetch(`${base}/gateway?url=${encodeURIComponent(TRA)}`)).status).toBe(401);
  });

  it("forwards TRA calls using the session's credentials, ignoring client-sent auth", async () => {
    const base = await start();
    const { cookie } = await login(base);
    const res = await fetch(`${base}/gateway?url=${encodeURIComponent(TRA)}`, {
      headers: { cookie, authorization: "Basic bogus" },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ projects: [{ id: 1, name: "p" }] });
  });

  it("blocks hosts outside the TRA allowlist", async () => {
    const base = await start();
    const { cookie } = await login(base);
    const res = await fetch(`${base}/gateway?url=${encodeURIComponent("https://evil.example.com/x")}`, { headers: { cookie } });
    expect(res.status).toBe(403);
  });
});

describe("routing", () => {
  it("404s unknown API paths as JSON instead of serving the SPA", async () => {
    const base = await start();
    const res = await fetch(`${base}/api/nope`);
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toMatch(/json/);
  });
});
