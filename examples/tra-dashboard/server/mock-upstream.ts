/**
 * Offline stand-in for api-automation.browserstack.com, used with `TRA_MOCK=1 pnpm dev`
 * to explore the UI without credentials. Responses use the raw (snake_case) API shape.
 */

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const T0 = Date.parse("2026-10-03T09:00:00Z");
const iso = (offsetMin: number): string => new Date(T0 - offsetMin * 60_000).toISOString();

const PROJECTS = [
  { id: 101, name: "checkout-web", group_id: 7, created_by: 1, created_at: iso(90000), updated_at: iso(30) },
  { id: 102, name: "mobile-app-e2e", group_id: 7, created_by: 2, created_at: iso(70000), updated_at: iso(600) },
  { id: 103, name: "payments-api", group_id: 7, created_by: 1, created_at: iso(50000), updated_at: iso(4000) },
];

const STATUSES = ["passed", "failed", "passed", "passed", "running", "passed", "skipped", "failed"] as const;
const USERS = ["asha", "mateo", "li", "ci-bot"];

function stats(status: string, seed: number) {
  if (status === "passed") return { passed: 120 + seed, failed: 0, pending: 0, skipped: 3, unknown: 0 };
  if (status === "failed") return { passed: 98 + seed, failed: 14 + (seed % 5), pending: 0, skipped: 6, unknown: 1 };
  if (status === "running") return { passed: 40, failed: 2, pending: 70, skipped: 0, unknown: 0 };
  return { passed: 0, failed: 0, pending: 0, skipped: 40, unknown: 0 };
}

function build(projectId: number, i: number) {
  const status = STATUSES[i % STATUSES.length] ?? "passed";
  const id = `bld${projectId}${String(i).padStart(3, "0")}hashed`;
  return {
    name: i % 3 === 0 ? "nightly-regression" : "pr-validation",
    original_name: "regression",
    status,
    duration: 420 + i * 37,
    user: USERS[i % USERS.length],
    tags: i % 2 === 0 ? ["chrome", "smoke"] : ["firefox"],
    build_id: id,
    build_number: 240 - i,
    started_at: iso(i * 480 + 60),
    finished_at: status === "running" ? null : iso(i * 480 + 52),
    status_stats: stats(status, i),
    is_archived: false,
  };
}

const TESTS = [
  ["Login", ["accepts valid credentials", "rejects a wrong password", "locks the account after 5 attempts"]],
  ["Cart", ["adds an item", "applies a discount code", "persists across sessions", "removes an item"]],
  ["Checkout", ["pays with a card", "pays with a wallet", "shows tax for EU addresses", "handles declined cards"]],
] as const;

function hierarchy(buildKey: number) {
  return TESTS.map(([suite, names], s) => ({
    name: `${suite}.spec.ts`,
    details: {},
    children: [
      {
        name: suite,
        details: {},
        children: names.map((name, t) => {
          const roll = (buildKey + s * 7 + t * 3) % 9;
          const status = roll === 0 ? "failed" : roll === 4 ? "skipped" : "passed";
          return {
            name,
            details: {
              status,
              duration: 800 + ((s + 1) * (t + 2) * 613) % 9000,
              is_flaky: roll === 2,
              is_new_failure: roll === 0 && t % 2 === 0,
              retries: roll === 2 ? [{ status: "failed" }, { status: "passed" }] : [],
              browser: t % 2 ? "firefox 131" : "chrome 129",
              os: "macOS 14",
              ...(status === "failed"
                ? { failure: [{ error: "Expected 200 but received 500", backtrace: "at checkout.spec.ts:42:11" }] }
                : {}),
            },
          };
        }),
      },
    ],
  }));
}

export function createMockUpstream(): typeof fetch {
  return async (input) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const path = url.pathname.replace(/^\/ext\/v1/, "");
    await new Promise((r) => setTimeout(r, 120));

    if (path === "/projects") return json({ projects: PROJECTS, pagination: { has_next: false } });

    const builds = path.match(/^\/projects\/(\d+)\/builds$/);
    if (builds?.[1]) {
      const pid = Number(builds[1]);
      const status = url.searchParams.get("build_status");
      const page = Number(url.searchParams.get("next_page") ?? "0");
      const all = Array.from({ length: 36 }, (_, i) => build(pid, i)).filter((b) => !status || b.status === status);
      const slice = all.slice(page * 12, page * 12 + 12);
      return json({
        builds: slice,
        pagination: { has_next: (page + 1) * 12 < all.length, next_page: String(page + 1) },
      });
    }

    const runs = path.match(/^\/builds\/([^/]+)\/testRuns$/);
    if (runs?.[1]) {
      const key = runs[1].length;
      const tree = hierarchy(key + runs[1].charCodeAt(6));
      return json({
        name: "regression",
        project_id: 101,
        build_id: runs[1],
        build_name: "nightly-regression",
        build_number: 240,
        test_summary: { passed: 9, failed: 2, pending: 0, skipped: 1, unknown: 0 },
        hierarchy: tree,
        pagination: { has_next: false },
      });
    }

    const sh = path.match(/^\/builds\/([^/]+)\/selfHealingReport$/);
    if (sh) return json({ presigned_url: "https://example.com/report.json", expires_at: iso(-60) });

    const bd = path.match(/^\/builds\/([^/]+)$/);
    if (bd?.[1]) {
      const m = bd[1].match(/^bld(\d{3})(\d{3})/);
      const base = build(Number(m?.[1] ?? 101), Number(m?.[2] ?? 0));
      return json({
        ...base,
        build_id: bd[1],
        description: "Full cross-browser regression on every merge to main.",
        failure_categories: { "Assertion Error": 9, "Timeout": 3, "Element Not Found": 2, "Network Error": 1 },
        smart_tags: { is_flaky: 4, is_always_failing: 1, is_performance_anomaly: 2, is_new_failure: 3 },
        vcs_info: { name: "git", sha: "9eb4c05d1a7f3b2c8e6d4a0b9f1e2c3d4a5b6c7d", branch: "main" },
        ci_info: { name: "GitHub Actions", job_name: "e2e", build_number: "5821", build_url: "https://github.com/acme/web/actions/runs/5821" },
        host_info: { hostname: "runner-12", os: "linux" },
        observability_url: "https://automation.browserstack.com/",
      });
    }

    const qg = path.match(/^\/quality-gates\/([^/]+)\/settings$/);
    if (qg) {
      return json({
        enabled: true,
        should_override_build_status: true,
        quality_profiles: [
          { id: "p1", name: "Release gate", rules_count: 3, enabled: true, is_global_profile: true },
          { id: "p2", name: "Smoke only", rules_count: 1, enabled: false, is_global_profile: false },
        ],
      });
    }
    const qs = path.match(/^\/quality-gates\/([^/]+)$/);
    if (qs?.[1]) {
      return json({
        status: "completed",
        build_uuid: qs[1],
        quality_gate_result: "failed",
        quality_profiles: [
          {
            id: "p1",
            name: "Release gate",
            type: "global",
            result: "failed",
            rules: [
              { name: "Pass rate", operator: ">=", threshold: "95%", actual: "88%", result: "failed" },
              { name: "New failures", operator: "=", threshold: "0", actual: "3", result: "failed" },
              { name: "Flaky tests", operator: "<=", threshold: "5", actual: "4", result: "passed" },
            ],
          },
        ],
      });
    }

    return json({ message: `mock: no route for ${path}` }, 404);
  };
}
