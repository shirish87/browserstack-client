/**
 * Offline stand-in for BrowserStack, used with `TRA_MOCK=1`. Serves the real response shapes (snake_case,
 * TRA durations in milliseconds, `display_name`/`type` tree nodes, per-attempt `retries`) for Test Reporting
 * and, for the session deep-dive, Automate and App Automate sessions and their logs.
 *
 * Deterministic, relative to "now": ~40 builds per project over ~30 days, a live build that progresses in
 * real time, recurring tests with a few chronic failures, one regression and one fix in the latest completed
 * build (so Compare has something to show). One project has no sessions and one has no smart tags, as on
 * real plans.
 */
import { HOUR, LATEST_N, MIN, PROJECTS, buildEndMs, buildStartMs, liveProgress, modelFor, numberFor, type ModelFile, type Project } from "./mock-model";
import { sessionRoutes } from "./mock-sessions";

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const PAGE_SIZE = 20;

const keyOf = (p: { name: string; version: string }): string => (p.name ? `${p.name},${p.version}` : "");
const platformKey = (name: string, version: string): { name: string; version: string; key: string } => ({ name, version, key: keyOf({ name, version }) });

interface Counts {
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  inProgress: number;
  flaky: number;
  newFailures: number;
  categories: Record<string, number>;
}

function countsOf(files: ModelFile[]): Counts {
  const c: Counts = { passed: 0, failed: 0, pending: 0, skipped: 0, inProgress: 0, flaky: 0, newFailures: 0, categories: {} };
  for (const f of files) {
    for (const t of f.tests) {
      if (t.status === "passed") c.passed += 1;
      else if (t.status === "failed") c.failed += 1;
      else if (t.status === "skipped") c.skipped += 1;
      else if (t.status === "in progress") c.inProgress += 1;
      else c.pending += 1;
      if (t.flaky) c.flaky += 1;
      if (t.newFailure) c.newFailures += 1;
      if (t.error) c.categories[t.error.category] = (c.categories[t.error.category] ?? 0) + 1;
    }
  }
  return c;
}

const statusStats = (c: Counts) => ({ passed: c.passed, failed: c.failed, "in progress": c.inProgress, skipped: c.skipped, retest: 0, blocked: 0, untested: 0, pending: c.pending, unknown: 0 });

function treeFor(project: Project, files: ModelFile[], buildKey: string): unknown[] {
  let rank = 0;
  return files.map((f) => {
    const c = countsOf([f]);
    const total = f.tests.length;
    const root = {
      summary: { aggregate: total, passed: c.passed, failed: c.failed, pending: c.pending + c.inProgress, skipped: c.skipped, unknown: 0 },
      is_after_all_hook: null,
      rank: rank++,
      details: {
        file_path: f.file,
        os: platformKey(f.platform.os.name, f.platform.os.version),
        finished_at: null,
        browser: platformKey(f.platform.browser.name, f.platform.browser.version),
        vc_file_url: "",
        isRealDevice: project.product === "app-automate",
        device: f.platform.device,
        middle_scopes: null,
      },
      type: "ROOT",
      display_name: f.file,
      is_before_all_hook: null,
      children: [
        {
          summary: null,
          is_after_all_hook: null,
          rank: rank++,
          details: {},
          type: "DESCRIBE",
          display_name: f.suite,
          is_before_all_hook: null,
          children: f.tests.map((t) => {
            const details: Record<string, unknown> = {
              last_executed_by: "ci-bot",
              is_auto_analyzed: null,
              testCases: [],
              observability_url: `https://observability.browserstack.com/projects/${encodeURIComponent(project.name)}/builds/${encodeURIComponent(buildKey)}`,
              pm_tool_details: [],
              session_id: f.sessionId ?? "",
              is_muted: false,
              tags: [],
              run_count: 0,
              duration: t.durationMs,
              retries: t.attempts.map((a) => ({
                uuid: a.uuid,
                status: a.status,
                duration: a.durationMs,
                workflowStatus: a.status === "failed" ? "Failed" : "Passed",
                logs: a.failure ? { TEST_FAILURE: a.failure } : {},
              })),
              is_auto_analyzer_running: false,
              started_at: t.startMs === undefined ? null : new Date(t.startMs).toISOString(),
              is_latest: true,
              last_executed_by_id: 1,
              status: t.status,
            };
            if (project.smartTags) {
              details["is_flaky"] = t.flaky;
              details["is_new_failure"] = t.newFailure;
              details["is_always_failing"] = false;
              details["is_performance_anomaly"] = t.slow;
            }
            return { summary: null, is_after_all_hook: null, children: [], rank: rank++, details, type: "TEST", display_name: t.name, is_before_all_hook: null };
          }),
        },
      ],
    };
    return root;
  });
}

const USERS = ["asha", "mateo", "li", "ci-bot"];
const TAG_SETS = [["chrome", "smoke"], ["firefox"], ["chrome", "regression"]];

function buildFor(project: Project, i: number, now: number) {
  const n = numberFor(i);
  const live = project.liveBuild && i === 0;
  const startedMs = buildStartMs(project, i, now);
  const progress = liveProgress(project, i, startedMs, now);
  const files = modelFor(project, n, startedMs, progress);
  const counts = countsOf(files);
  const status = live ? "running" : counts.failed > 0 ? "failed" : "passed";
  const endMs = live ? now : buildEndMs(files, startedMs);
  const buildId = `bld${project.id}-${n}`;
  return {
    n,
    files,
    counts,
    summary: {
      name: i % 3 === 0 ? "nightly-regression" : "pr-validation",
      original_name: "regression",
      status,
      duration: endMs - startedMs,
      user: USERS[i % USERS.length],
      tags: TAG_SETS[i % TAG_SETS.length],
      build_id: buildId,
      build_number: n,
      started_at: new Date(startedMs).toISOString(),
      finished_at: live ? null : new Date(endMs).toISOString(),
      status_stats: statusStats(counts),
      is_manually_overridden: false,
      is_archived: false,
      observability_url: `https://observability.browserstack.com/projects/${encodeURIComponent(project.name)}/builds/${buildId}`,
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
      const tree = treeFor(ref.project, b.files, runs[1]);
      const hierarchy = statuses?.length ? filterTree(tree, statuses) : tree;
      return json({ name: b.summary.original_name, project_id: ref.project.id, group_id: 7, build_id: runs[1], build_name: b.summary.name, build_number: b.n, original_name: b.summary.original_name, test_summary: b.summary.status_stats, is_manually_overridden: false, is_archived: false, hierarchy, pagination: { has_next: false } });
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
        ...(ref.project.smartTags
          ? {
              failure_categories: b.counts.categories,
              smart_tags: { is_flaky: b.counts.flaky, is_always_failing: b.counts.failed > 0 ? 1 : 0, is_performance_anomaly: b.n >= LATEST_N - 1 ? 1 : 0, is_new_failure: b.counts.newFailures },
            }
          : {}),
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

    const sessions = sessionRoutes(path, now);
    if (sessions) return sessions;

    return json({ message: `mock: no route for ${path}` }, 404);
  };
}

type Node = { display_name: string; type: string; details: Record<string, unknown>; children?: Node[] };
function isNode(v: unknown): v is Node {
  return typeof v === "object" && v !== null && "display_name" in v && "details" in v && "type" in v;
}
/** Keeps the ROOT → DESCRIBE → TEST path of every test whose status is wanted. */
function filterTree(nodes: unknown[], statuses: string[]): unknown[] {
  const out: unknown[] = [];
  for (const n of nodes) {
    if (!isNode(n)) continue;
    if (n.children && n.children.length > 0) {
      const kids = filterTree(n.children, statuses);
      if (kids.length) out.push({ ...n, children: kids });
    } else if (statuses.includes(String(n.details["status"]))) out.push(n);
  }
  return out;
}
