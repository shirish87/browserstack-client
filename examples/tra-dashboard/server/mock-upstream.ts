/**
 * Offline stand-in for api-automation.browserstack.com, used with `TRA_MOCK=1`.
 * Deterministic, relative to "now": ~40 builds per project over ~30 days, a live build that
 * progresses in real time, recurring tests with a few chronic failures, one regression and one
 * fix in the latest completed build (so Compare has something to show). Raw snake_case API shape.
 */

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const MIN = 60_000;
const HOUR = 60 * MIN;
const PAGE_SIZE = 20;
const BUILD_COUNT = 40;
const LIVE_RUN_MS = 9 * MIN;

/** Stable pseudo-random in [0,1) from a string. */
function rand(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

interface Project {
  id: number;
  name: string;
  builds: number;
  liveBuild: boolean;
}
const PROJECTS: Project[] = [
  { id: 101, name: "checkout-web", builds: BUILD_COUNT, liveBuild: true },
  { id: 102, name: "mobile-app-e2e", builds: BUILD_COUNT, liveBuild: true },
  { id: 103, name: "payments-api", builds: BUILD_COUNT, liveBuild: false },
  { id: 104, name: "Default Project", builds: 0, liveBuild: false },
];

type Spec = { name: string; failRate?: number; slowFrom?: number };
const SUITES: { file: string; suite: string; tests: Spec[] }[] = [
  { file: "auth/login.spec.ts", suite: "Login", tests: [{ name: "accepts valid credentials" }, { name: "rejects a wrong password" }, { name: "locks the account after 5 attempts", failRate: 0.03 }, { name: "remembers the session" }, { name: "supports SSO redirect" }] },
  { file: "cart/cart.spec.ts", suite: "Cart", tests: [{ name: "adds an item" }, { name: "applies a discount code" }, { name: "persists across sessions", failRate: 0.02 }, { name: "removes an item" }, { name: "updates quantity" }, { name: "shows stock warnings" }] },
  { file: "checkout/pay.spec.ts", suite: "Checkout", tests: [{ name: "pays with a card" }, { name: "pays with a wallet" }, { name: "shows tax for EU addresses", failRate: 0.1 }, { name: "handles declined cards", slowFrom: 239 }, { name: "sends a receipt email" }, { name: "retries a timed-out payment", failRate: 0.04 }] },
  { file: "search/search.spec.ts", suite: "Search", tests: [{ name: "finds by name" }, { name: "filters by category" }, { name: "pages results" }, { name: "suggests while typing" }, { name: "handles empty results" }] },
  { file: "api/orders.spec.ts", suite: "Orders API", tests: [{ name: "creates an order" }, { name: "lists orders" }, { name: "rejects invalid payloads", failRate: 0.02 }, { name: "paginates" }, { name: "is idempotent" }] },
];

const ERRORS: [string, string][] = [
  ["Expected 200 but received 500", "Assertion Error"],
  ["Timed out 30000ms waiting for selector `[data-testid=submit]`", "Timeout"],
  ["Element not found: button[name=pay]", "Element Not Found"],
  ["net::ERR_CONNECTION_RESET at https://staging.example.com/api/orders", "Network Error"],
];

const LATEST_N = 240;
const numberFor = (i: number): number => LATEST_N - i;

interface TestOut {
  name: string;
  details: Record<string, unknown>;
}

function testStatus(pid: number, n: number, suiteName: string, spec: Spec): "passed" | "failed" | "skipped" {
  if (spec.name === "pays with a wallet") return n >= LATEST_N - 1 ? "failed" : "passed"; // regression
  if (spec.name === "applies a discount code") return n <= LATEST_N - 2 && n >= LATEST_N - 12 ? "failed" : "passed"; // fixed in latest
  const r = rand(`${pid}|${suiteName}|${spec.name}|${n}`);
  if (spec.failRate && r < spec.failRate) return "failed";
  return r > 0.985 ? "skipped" : "passed";
}

function testsFor(pid: number, n: number, progress: number | null): { tree: unknown[]; counts: Counts } {
  const all = SUITES.flatMap((s) => s.tests.map((t) => ({ s, t })));
  const doneCount = progress === null ? all.length : Math.floor(progress * all.length);
  const counts: Counts = { passed: 0, failed: 0, pending: 0, skipped: 0, unknown: 0, flaky: 0, newFailures: 0, categories: {} };
  let idx = 0;
  const tree = SUITES.map((s) => ({
    name: s.file,
    details: {},
    children: [
      {
        name: s.suite,
        details: {},
        children: s.tests.map<TestOut>((t) => {
          const i = idx++;
          const seed = `${pid}|${s.suite}|${t.name}|${n}`;
          const common = { browser: i % 2 ? "firefox 131" : "chrome 129", os: i % 3 ? "macOS 14" : "Windows 11" };
          if (i > doneCount) {
            counts.pending += 1;
            return { name: t.name, details: { status: "pending", ...common } };
          }
          if (progress !== null && i === doneCount) {
            counts.pending += 1;
            return { name: t.name, details: { status: "running", ...common } };
          }
          const status = testStatus(pid, n, s.suite, t);
          counts[status] += 1;
          const flaky = status === "passed" && rand(`${seed}|flaky`) < 0.07;
          if (flaky) counts.flaky += 1;
          const base = 900 + Math.floor(rand(`${t.name}|dur`) * 7000);
          const slow = t.slowFrom !== undefined && n >= t.slowFrom ? 3.4 : 1;
          const duration = Math.round(base * slow * (0.9 + rand(`${seed}|d`) * 0.25));
          const details: Record<string, unknown> = { status, duration, is_flaky: flaky, retries: flaky ? [{ status: "failed" }, { status: "passed" }] : [], ...common };
          if (status === "failed") {
            const [msg, cat] = ERRORS[Math.floor(rand(`${seed}|e`) * ERRORS.length)] ?? ERRORS[0] ?? ["error", "Error"];
            counts.categories[cat] = (counts.categories[cat] ?? 0) + 1;
            const newFail = t.name === "pays with a wallet" && n === LATEST_N - 1;
            if (newFail) counts.newFailures += 1;
            details["is_new_failure"] = newFail;
            details["failure"] = [{ error: msg, backtrace: `at ${s.file}:${20 + Math.floor(rand(`${seed}|l`) * 80)}:11\n    at async Page.click (playwright-core/lib/client/page.js:312:14)` }];
          }
          return { name: t.name, details };
        }),
      },
    ],
  }));
  return { tree, counts };
}

interface Counts {
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  unknown: number;
  flaky: number;
  newFailures: number;
  categories: Record<string, number>;
}

const USERS = ["asha", "mateo", "li", "ci-bot"];
const TAG_SETS = [["chrome", "smoke"], ["firefox"], ["chrome", "regression"]];

function buildFor(project: Project, i: number, now: number) {
  const n = numberFor(i);
  const live = project.liveBuild && i === 0;
  const startedMs = live ? now - 4 * MIN : now - 6 * MIN - i * 17 * HOUR - Math.floor(rand(`${project.id}|${n}|s`) * 3 * HOUR);
  const progress = live ? Math.min(0.97, (now - startedMs) / LIVE_RUN_MS) : null;
  const { tree, counts } = testsFor(project.id, n, progress);
  const status = live ? "running" : counts.failed > 0 ? "failed" : "passed";
  const durationSec = live ? Math.round((now - startedMs) / 1000) : 380 + Math.floor(rand(`${project.id}|${n}|du`) * 260) + (n >= LATEST_N - 1 ? 90 : 0);
  return {
    n,
    tree,
    counts,
    summary: {
      name: i % 3 === 0 ? "nightly-regression" : "pr-validation",
      original_name: "regression",
      status,
      duration: durationSec,
      user: USERS[i % USERS.length],
      tags: TAG_SETS[i % TAG_SETS.length],
      build_id: `bld${project.id}-${n}`,
      build_number: n,
      started_at: new Date(startedMs).toISOString(),
      finished_at: live ? null : new Date(startedMs + durationSec * 1000).toISOString(),
      status_stats: { passed: counts.passed, failed: counts.failed, pending: counts.pending, skipped: counts.skipped, unknown: 0 },
      is_archived: false,
      observability_url: `https://observability.browserstack.com/projects/${encodeURIComponent(project.name)}/builds/bld${project.id}-${n}`,
    },
  };
}

function parseBuildId(id: string): { project: Project; i: number } | undefined {
  const m = id.match(/^bld(\d+)-(\d+)$/);
  if (!m?.[1] || !m[2]) return undefined;
  const project = PROJECTS.find((p) => p.id === Number(m[1]));
  const i = LATEST_N - Number(m[2]);
  return project && i >= 0 && i < project.builds ? { project, i } : undefined;
}

export function createMockUpstream(): typeof fetch {
  return async (input) => {
    const now = Date.now();
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const path = url.pathname.replace(/^\/ext\/v1/, "");
    await new Promise((r) => setTimeout(r, 90));

    if (path === "/projects") {
      return json({ projects: PROJECTS.map((p) => ({ id: p.id, name: p.name, group_id: 7, created_by: 1, created_at: new Date(now - 90 * 24 * HOUR).toISOString(), updated_at: new Date(now - p.id * 7 * MIN).toISOString(), observability_url: `https://observability.browserstack.com/projects/${encodeURIComponent(p.name)}/builds` })), pagination: { has_next: false } });
    }

    const list = path.match(/^\/projects\/(\d+)\/builds$/);
    if (list?.[1]) {
      const project = PROJECTS.find((p) => p.id === Number(list[1]));
      if (!project) return json({ message: "Project not found" }, 404);
      const status = url.searchParams.get("build_status");
      const users = url.searchParams.get("users")?.split(",").filter(Boolean);
      const tags = url.searchParams.get("build_tags")?.split(",").filter(Boolean);
      const range = url.searchParams.get("date_range")?.split(",").map(Number);
      const offset = Number(url.searchParams.get("next_page") ?? "0");
      const all = Array.from({ length: project.builds }, (_, i) => buildFor(project, i, now).summary).filter(
        (b) =>
          (!status || b.status === status) &&
          (!users?.length || users.includes(b.user ?? "")) &&
          (!tags?.length || tags.some((t) => b.tags?.includes(t))) &&
          (!range || range.length !== 2 || (Date.parse(b.started_at) >= (range[0] ?? 0) && Date.parse(b.started_at) <= (range[1] ?? Infinity))),
      );
      const slice = all.slice(offset, offset + PAGE_SIZE);
      return json({ id: project.id, name: project.name, builds: slice, pagination: { has_next: offset + PAGE_SIZE < all.length, next_page: String(offset + PAGE_SIZE) } });
    }

    const runs = path.match(/^\/builds\/([^/]+)\/testRuns$/);
    if (runs?.[1]) {
      const ref = parseBuildId(runs[1]);
      if (!ref) return json({ message: "Build not found" }, 404);
      const b = buildFor(ref.project, ref.i, now);
      const statuses = url.searchParams.get("test_statuses")?.split(",").filter(Boolean);
      const hierarchy = statuses?.length ? filterTree(b.tree, statuses) : b.tree;
      return json({ name: b.summary.original_name, project_id: ref.project.id, build_id: runs[1], build_name: b.summary.name, build_number: b.n, test_summary: b.summary.status_stats, hierarchy, pagination: { has_next: false } });
    }

    if (path.match(/^\/builds\/([^/]+)\/selfHealingReport$/)) return json({ message: "No self-healing report for this build" }, 404);

    const bd = path.match(/^\/builds\/([^/]+)$/);
    if (bd?.[1]) {
      const ref = parseBuildId(bd[1]);
      if (!ref) return json({ message: "Build not found" }, 404);
      const b = buildFor(ref.project, ref.i, now);
      return json({
        ...b.summary,
        description: "Full cross-browser regression, triggered on every merge to main.",
        failure_categories: b.counts.categories,
        smart_tags: { is_flaky: b.counts.flaky, is_always_failing: b.counts.failed > 0 ? 1 : 0, is_performance_anomaly: b.n >= LATEST_N - 1 ? 1 : 0, is_new_failure: b.counts.newFailures },
        vcs_info: { name: "git", sha: `9eb4c05d1a7f3b2c8e6d4a0b9f1e2c3d4a5b${b.n}`.slice(0, 40), branch: b.n % 5 === 0 ? "release/2.4" : "main" },
        ci_info: { name: "GitHub Actions", job_name: "e2e", build_number: String(5000 + b.n), build_url: `https://github.com/acme/web/actions/runs/${5000 + b.n}` },
        host_info: { hostname: "runner-12", os: "linux" },
        observability_url: `https://observability.browserstack.com/projects/${encodeURIComponent(ref.project.name)}/builds/${bd[1]}`,
      });
    }

    const qgSettings = path.match(/^\/quality-gates\/([^/]+)\/settings$/);
    if (qgSettings?.[1]) {
      if (decodeURIComponent(qgSettings[1]) === "Default Project") return json({ message: "Cannot access this feature with existing plan" }, 403);
      return json({ enabled: true, should_override_build_status: true, quality_profiles: [{ id: "p1", name: "Release gate", rules_count: 3, enabled: true, is_global_profile: true }, { id: "p2", name: "Smoke only", rules_count: 1, enabled: false, is_global_profile: false }] });
    }
    const qg = path.match(/^\/quality-gates\/([^/]+)$/);
    if (qg?.[1]) {
      const ref = parseBuildId(qg[1]);
      const failed = ref ? buildFor(ref.project, ref.i, now).counts.failed : 0;
      return json({ status: "completed", build_uuid: qg[1], quality_gate_result: failed > 1 ? "failed" : "passed", quality_profiles: [{ id: "p1", name: "Release gate", type: "global", result: failed > 1 ? "failed" : "passed", rules: [{ name: "Failed tests", operator: "<=", threshold: "1", actual: String(failed), result: failed > 1 ? "failed" : "passed" }] }] });
    }

    return json({ message: `mock: no route for ${path}` }, 404);
  };
}

type Node = { name: string; details: Record<string, unknown>; children?: Node[] };
function isNode(v: unknown): v is Node {
  return typeof v === "object" && v !== null && "name" in v && "details" in v;
}
function filterTree(nodes: unknown[], statuses: string[]): unknown[] {
  const out: unknown[] = [];
  for (const n of nodes) {
    if (!isNode(n)) continue;
    if (n.children) {
      const kids = filterTree(n.children, statuses);
      if (kids.length) out.push({ ...n, children: kids });
    } else if (statuses.includes(String(n.details["status"]))) out.push(n);
  }
  return out;
}
