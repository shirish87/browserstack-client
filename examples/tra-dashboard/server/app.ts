import express, { type Express, type NextFunction, type Request, type RequestHandler, type Response } from "express";
import { parse, serialize } from "cookie";
import path from "node:path";
import { createGateway } from "@dot-slash/browserstack-router";
import { CredentialsSchema, type Credentials, type SessionResponse } from "../src/lib/schemas";
import { SessionStore } from "./sessions";

/**
 * Test Reporting & Analytics, plus the Automate / App Automate REST API (api.browserstack.com), where the
 * session behind a test lives. The gateway is read-only (see below), so reaching Automate's host cannot
 * start, stop or delete anything.
 */
export const TRA_ALLOWED_HOSTS = ["api-automation.browserstack.com", "upload-automation.browserstack.com", "api.browserstack.com"];
const TRA_PROBE_URL = "https://api-automation.browserstack.com/ext/v1/projects";
const COOKIE_NAME = "tra_sid";

export interface AppOptions {
  /** Outbound HTTP, injectable for tests and mock mode. Defaults to global fetch. */
  fetchFn?: typeof fetch;
  /** Directory with the built frontend (index.html + assets). Omit to serve the API only. */
  publicDir: string | undefined;
  cookieSecure: boolean;
  sessionTtlMs: number;
}

type SessionHandler = (req: Request, res: Response, next: NextFunction, credentials: Credentials) => void;

export function createApp(options: AppOptions): Express {
  const fetchFn = options.fetchFn ?? fetch;
  const sessions = new SessionStore({ ttlMs: options.sessionTtlMs });
  const app = express();
  app.disable("x-powered-by");

  const sessionId = (req: Request): string | undefined => parse(req.headers.cookie ?? "")[COOKIE_NAME];

  const requireSession =
    (handler: SessionHandler): RequestHandler =>
    (req, res, next) => {
      const credentials = sessions.get(sessionId(req));
      if (!credentials) {
        res.status(401).json({ message: "Not signed in" });
        return;
      }
      handler(req, res, next, credentials);
    };

  const cookieOptions = { httpOnly: true, sameSite: "strict", secure: options.cookieSecure, path: "/" } as const;

  /** Browsers always send Origin on cross-site writes; reject any that isn't ours. */
  const sameOrigin: RequestHandler = (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return next();
    const origin = req.headers.origin;
    if (origin !== undefined) {
      let host: string | undefined;
      try {
        host = new URL(origin).host;
      } catch {
        host = undefined;
      }
      if (host !== req.headers.host) {
        res.status(403).json({ message: "Cross-origin request refused" });
        return;
      }
    }
    next();
  };

  app.use(["/api", "/gateway"], sameOrigin);

  // --- session API -------------------------------------------------------------------------
  const session = express.Router();
  session.use(express.json({ limit: "4kb" }));

  session.post("/", async (req, res, next) => {
    const parsed = CredentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues.map((i) => i.message).join(". ") });
      return;
    }
    const creds = parsed.data;
    try {
      const probe = await fetchFn(TRA_PROBE_URL, {
        headers: { authorization: `Basic ${Buffer.from(`${creds.username}:${creds.accessKey}`).toString("base64")}` },
        signal: AbortSignal.timeout(15_000),
      });
      if (probe.status === 401 || probe.status === 403) {
        res.status(401).json({ message: "BrowserStack rejected these credentials" });
        return;
      }
      if (!probe.ok) {
        res.status(502).json({ message: `BrowserStack responded with ${probe.status}` });
        return;
      }
    } catch (err) {
      next(err);
      return;
    }
    const id = sessions.create(creds);
    res.setHeader("set-cookie", serialize(COOKIE_NAME, id, cookieOptions));
    const body: SessionResponse = { username: creds.username };
    res.json(body);
  });

  session.get("/", requireSession((_req, res, _next, creds) => {
    const body: SessionResponse = { username: creds.username };
    res.json(body);
  }));

  session.delete("/", (req, res) => {
    sessions.destroy(sessionId(req));
    res.setHeader("set-cookie", serialize(COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 }));
    res.status(204).end();
  });

  app.use("/api/session", session);
  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // --- gateway: the browser's only path to BrowserStack ------------------------------------
  app.use(
    "/gateway",
    // The dashboard only reads. Anything else is refused before credentials are used.
    (req, res, next) => {
      if (req.method === "GET" || req.method === "HEAD") return next();
      res.setHeader("allow", "GET, HEAD");
      res.status(405).json({ message: "The dashboard is read-only" });
    },
    requireSession((req, res, next, creds) => {
      // Never forward the browser's cookies or auth upstream; the router adds Basic auth itself.
      delete req.headers["cookie"];
      delete req.headers["authorization"];
      delete req.headers["origin"];
      delete req.headers["referer"];
      void createGateway({
        username: creds.username,
        accessKey: creds.accessKey,
        allowedHosts: TRA_ALLOWED_HOSTS,
        fetchFn,
      })(req, res, next);
    }),
  );

  // --- static frontend + SPA fallback ------------------------------------------------------
  const publicDir = options.publicDir;
  if (publicDir) {
    app.use(express.static(publicDir, { index: false, maxAge: "1h", setHeaders: (res, file) => {
      // Hashed assets are immutable; everything else (index.html) must revalidate.
      if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader("cache-control", "public, max-age=31536000, immutable");
    } }));
    app.use((req, res, next) => {
      if (req.method !== "GET" && req.method !== "HEAD") return next();
      res.setHeader("cache-control", "no-cache");
      res.sendFile(path.join(publicDir, "index.html"), (err) => {
        if (err) next(err);
      });
    });
  }

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    if (res.headersSent) return;
    res.status(502).json({ message: err instanceof Error ? err.message : "Upstream error" });
  });

  return app;
}
