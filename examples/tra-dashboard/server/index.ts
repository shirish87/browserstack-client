import path from "node:path";
import { z } from "zod";
import { createApp } from "./app";
import { createMockUpstream } from "./mock-upstream";

const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  /** `TRA_MOCK=1` serves offline fixtures instead of calling BrowserStack. */
  TRA_MOCK: z.enum(["0", "1"]).default("0"),
  SESSION_TTL_HOURS: z.coerce.number().positive().default(8),
  /** Defaults to true in production; set 0 to allow plain-http deployments. */
  COOKIE_SECURE: z.enum(["0", "1"]).optional(),
});

const env = EnvSchema.parse(process.env);

const app = createApp({
  ...(env.TRA_MOCK === "1" ? { fetchFn: createMockUpstream() } : {}),
  publicDir: path.resolve(import.meta.dirname, "../public"),
  cookieSecure: (env.COOKIE_SECURE ?? (env.NODE_ENV === "production" ? "1" : "0")) === "1",
  sessionTtlMs: env.SESSION_TTL_HOURS * 3_600_000,
});

app.listen(env.PORT, () => {
  console.log(`TRA dashboard on http://localhost:${env.PORT}${env.TRA_MOCK === "1" ? " (mock upstream)" : ""}`);
});
