/**
 * Deterministic model behind the offline mock (`TRA_MOCK=1`): projects, builds and the tests inside them,
 * with real timings. Test runs, sessions, logs and HAR all derive from this one model, so what the tree
 * says about a test is what its session timeline shows.
 */

export const MIN = 60_000;
export const HOUR = 60 * MIN;

/** Stable pseudo-random in [0,1) from a string. */
export function rand(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

export type Product = "automate" | "app-automate" | "none";

export interface Project {
  id: number;
  name: string;
  builds: number;
  liveBuild: boolean;
  /** Which BrowserStack product the tests ran on; "none" means no session (API tests). */
  product: Product;
  /** Smart tags and failure categories are plan-gated: some projects don't get them. */
  smartTags: boolean;
}

export const BUILD_COUNT = 40;
export const LATEST_N = 240;

export const PROJECTS: Project[] = [
  { id: 101, name: "checkout-web", builds: BUILD_COUNT, liveBuild: true, product: "automate", smartTags: true },
  { id: 102, name: "mobile-app-e2e", builds: BUILD_COUNT, liveBuild: true, product: "app-automate", smartTags: true },
  { id: 103, name: "payments-api", builds: BUILD_COUNT, liveBuild: false, product: "none", smartTags: false },
  { id: 104, name: "Default Project", builds: 0, liveBuild: false, product: "none", smartTags: false },
];

type Spec = { name: string; failRate?: number; slowFrom?: number };
export const SUITES: { file: string; suite: string; tests: Spec[] }[] = [
  { file: "auth/login.spec.ts", suite: "Login", tests: [{ name: "accepts valid credentials" }, { name: "rejects a wrong password" }, { name: "locks the account after 5 attempts", failRate: 0.03 }, { name: "remembers the session" }, { name: "supports SSO redirect" }] },
  { file: "cart/cart.spec.ts", suite: "Cart", tests: [{ name: "adds an item" }, { name: "applies a discount code" }, { name: "persists across sessions", failRate: 0.02 }, { name: "removes an item" }, { name: "updates quantity" }, { name: "shows stock warnings" }] },
  { file: "checkout/pay.spec.ts", suite: "Checkout", tests: [{ name: "pays with a card" }, { name: "pays with a wallet" }, { name: "shows tax for EU addresses", failRate: 0.1 }, { name: "handles declined cards", slowFrom: 239 }, { name: "sends a receipt email" }, { name: "retries a timed-out payment", failRate: 0.04 }] },
  { file: "search/search.spec.ts", suite: "Search", tests: [{ name: "finds by name" }, { name: "filters by category" }, { name: "pages results" }, { name: "suggests while typing" }, { name: "handles empty results" }] },
  { file: "api/orders.spec.ts", suite: "Orders API", tests: [{ name: "creates an order" }, { name: "lists orders" }, { name: "rejects invalid payloads", failRate: 0.02 }, { name: "paginates" }, { name: "is idempotent" }] },
];

/** The failure modes, each with the signal it leaves in the network (what a reader should find in the window). */
export type Cause = "server-error" | "timeout" | "missing-element" | "connection-reset";
export const ERRORS: { message: string; category: string; cause: Cause }[] = [
  { message: "Expected 200 but received 500", category: "Assertion Error", cause: "server-error" },
  { message: "Timed out 30000ms waiting for selector `[data-testid=submit]`", category: "Timeout", cause: "timeout" },
  { message: "Element not found: button[name=pay]", category: "Element Not Found", cause: "missing-element" },
  { message: "net::ERR_CONNECTION_RESET at https://staging.example.com/api/orders", category: "Network Error", cause: "connection-reset" },
];

export type TestStatus = "passed" | "failed" | "skipped" | "pending" | "in progress";

export interface ModelAttempt {
  uuid: string;
  status: "passed" | "failed";
  durationMs: number;
  failure?: string[];
}

export interface ModelTest {
  name: string;
  suite: string;
  file: string;
  status: TestStatus;
  durationMs: number;
  /** Epoch ms; absent for tests that haven't started. */
  startMs: number | undefined;
  attempts: ModelAttempt[];
  flaky: boolean;
  newFailure: boolean;
  slow: boolean;
  error: (typeof ERRORS)[number] | undefined;
}

export interface Platform {
  os: { name: string; version: string };
  browser: { name: string; version: string };
  device: string;
}

export interface ModelFile {
  file: string;
  suite: string;
  index: number;
  sessionId: string | undefined;
  platform: Platform;
  tests: ModelTest[];
}

const hex = (v: number, w: number): string => v.toString(16).padStart(w, "0");

/** 40 hex chars like a real session id, but decodable: project, build number and file index sit in the prefix. */
export function sessionIdFor(projectId: number, n: number, fileIndex: number): string {
  let tail = "";
  for (let i = 0; i < 30; i++) tail += "0123456789abcdef"[Math.floor(rand(`sid|${projectId}|${n}|${fileIndex}|${i}`) * 16)];
  return `${hex(projectId, 4)}${hex(n, 4)}${hex(fileIndex, 2)}${tail}`;
}

export function parseSessionId(id: string): { project: Project; n: number; fileIndex: number } | undefined {
  const m = id.match(/^([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{2})[0-9a-f]{30}$/);
  if (!m?.[1] || !m[2] || !m[3]) return undefined;
  const project = PROJECTS.find((p) => p.id === parseInt(m[1] ?? "", 16));
  const fileIndex = parseInt(m[3], 16);
  return project && fileIndex < SUITES.length ? { project, n: parseInt(m[2], 16), fileIndex } : undefined;
}

export const numberFor = (i: number): number => LATEST_N - i;

function platformFor(project: Project, index: number): Platform {
  if (project.product === "app-automate") {
    return index % 2 ? { os: { name: "ios", version: "17" }, browser: { name: "Unknown", version: "app" }, device: "iPhone 15" } : { os: { name: "android", version: "13.0" }, browser: { name: "Unknown", version: "app" }, device: "Google Pixel 7" };
  }
  if (project.product === "none") return { os: { name: "linux", version: "" }, browser: { name: "", version: "" }, device: "" };
  return {
    os: index % 3 ? { name: "OS X", version: "Sonoma" } : { name: "Windows", version: "11" },
    browser: index % 2 ? { name: "firefox", version: "131.0" } : { name: "chrome", version: "129.0" },
    device: "",
  };
}

function testStatus(pid: number, n: number, suiteName: string, spec: Spec): "passed" | "failed" | "skipped" {
  if (spec.name === "pays with a wallet") return n >= LATEST_N - 1 ? "failed" : "passed"; // regression
  if (spec.name === "applies a discount code") return n <= LATEST_N - 2 && n >= LATEST_N - 12 ? "failed" : "passed"; // fixed in latest
  const r = rand(`${pid}|${suiteName}|${spec.name}|${n}`);
  if (spec.failRate && r < spec.failRate) return "failed";
  return r > 0.985 ? "skipped" : "passed";
}

/** Gap between a test finishing and the next one starting, and between workers starting. */
const TEST_GAP_MS = 350;
const WORKER_STAGGER_MS = 900;

/**
 * Lays the build's files out in time: each file is one worker/session, its tests run back to back.
 * `progress` (0..1) cuts the build off mid-run for a live build.
 */
export function modelFor(project: Project, n: number, startMs: number, progress: number | null): ModelFile[] {
  const all = SUITES.flatMap((s) => s.tests.map((t) => ({ s, t })));
  const doneCount = progress === null ? all.length : Math.floor(progress * all.length);
  let flat = 0;
  return SUITES.map((s, index) => {
    let cursor = startMs + index * WORKER_STAGGER_MS;
    const tests = s.tests.map<ModelTest>((t) => {
      const i = flat++;
      const seed = `${project.id}|${s.suite}|${t.name}|${n}`;
      const base: Omit<ModelTest, "status" | "durationMs" | "startMs" | "attempts" | "flaky" | "newFailure" | "slow" | "error"> = { name: t.name, suite: s.suite, file: s.file };
      if (i > doneCount) return { ...base, status: "pending", durationMs: 0, startMs: undefined, attempts: [], flaky: false, newFailure: false, slow: false, error: undefined };
      if (progress !== null && i === doneCount) {
        const test: ModelTest = { ...base, status: "in progress", durationMs: 0, startMs: cursor, attempts: [], flaky: false, newFailure: false, slow: false, error: undefined };
        return test;
      }
      const status = testStatus(project.id, n, s.suite, t);
      const slow = t.slowFrom !== undefined && n >= t.slowFrom;
      const baseMs = 700 + Math.floor(rand(`${t.name}|dur`) * 3200);
      let durationMs = Math.round(baseMs * (slow ? 3.4 : 1) * (0.9 + rand(`${seed}|d`) * 0.25));
      const flaky = status === "passed" && rand(`${seed}|flaky`) < 0.07;
      const error = status === "failed" ? ERRORS[Math.floor(rand(`${seed}|e`) * ERRORS.length)] : undefined;
      if (error?.cause === "timeout") durationMs = 9000 + Math.floor(rand(`${seed}|t`) * 2500);
      const attempts: ModelAttempt[] = [];
      if (status === "skipped") {
        durationMs = 0;
      } else if (status === "failed" && error) {
        const line = 20 + Math.floor(rand(`${seed}|l`) * 80);
        attempts.push({ uuid: `att-${seed}`, status: "failed", durationMs, failure: [error.message, `    at ${s.file}:${line}:11`, "    at async Page.click (playwright-core/lib/client/page.js:312:14)"] });
      } else if (flaky) {
        const first = Math.round(durationMs * 0.7);
        attempts.push({ uuid: `att-${seed}-1`, status: "failed", durationMs: first, failure: ["Error: Execution context was destroyed, most likely because of a navigation", `    at ${s.file}:${30 + Math.floor(rand(`${seed}|fl`) * 50)}:9`] });
        attempts.push({ uuid: `att-${seed}-2`, status: "passed", durationMs });
        durationMs += first;
      } else {
        attempts.push({ uuid: `att-${seed}`, status: "passed", durationMs });
      }
      const startMsTest = cursor;
      cursor += durationMs + TEST_GAP_MS;
      const newFailure = t.name === "pays with a wallet" && status === "failed" && n === LATEST_N - 1;
      return { ...base, status, durationMs, startMs: startMsTest, attempts, flaky, newFailure, slow, error };
    });
    return { file: s.file, suite: s.suite, index, sessionId: project.product === "none" ? undefined : sessionIdFor(project.id, n, index), platform: platformFor(project, index), tests };
  });
}

export function buildEndMs(files: ModelFile[], fallback: number): number {
  let end = fallback;
  for (const f of files) for (const t of f.tests) if (t.startMs !== undefined) end = Math.max(end, t.startMs + t.durationMs);
  return end;
}

export const LIVE_RUN_MS = 60_000;

/** When build `i` (0 = newest) started, relative to `now`. */
export function buildStartMs(project: Project, i: number, now: number): number {
  const live = project.liveBuild && i === 0;
  return live ? now - 4 * MIN : now - 6 * MIN - i * 17 * HOUR - Math.floor(rand(`${project.id}|${numberFor(i)}|s`) * 3 * HOUR);
}

export function liveProgress(project: Project, i: number, startMs: number, now: number): number | null {
  return project.liveBuild && i === 0 ? Math.min(0.97, (now - startMs) / LIVE_RUN_MS) : null;
}
