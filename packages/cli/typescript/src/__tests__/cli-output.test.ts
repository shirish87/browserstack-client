/**
 * Happy-path output tests for all CLI handler functions.
 *
 * These tests verify that when an action succeeds the handler actually
 * prints meaningful output — catching "action runs but produces no output"
 * regressions.
 *
 * Credentials are faked via the mutable `env` object from core.
 * HTTP is intercepted via `vi.stubGlobal("fetch", ...)`.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { env } from "@dot-slash/browserstack-core";
import {
  runAutomateCli,
  runAppAutomateCli,
  runLocalTestingCli,
  runTestManagementCli,
  runTestReportingCli,
  runScreenshotsCli,
} from "../index.ts";

// ── helpers ──────────────────────────────────────────────────────────────────

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

function makeLogger(): { logger: Logger; infoCalls: string[]; errorCalls: string[] } {
  const infoCalls: string[] = [];
  const errorCalls: string[] = [];
  return {
    logger: {
      info: (msg: string, ...rest: unknown[]) =>
        infoCalls.push([msg, ...rest.map(String)].join(" ")),
      error: (msg: string) => errorCalls.push(msg),
    },
    infoCalls,
    errorCalls,
  };
}

/** Build a fetch mock that returns the given body as JSON (default) or text. */
function makeFetch(body: unknown, status = 200, contentType = "application/json") {
  const bodyStr = contentType === "application/json" ? JSON.stringify(body) : String(body);
  return vi.fn(async () =>
    new Response(bodyStr, {
      status,
      headers: { "content-type": contentType },
    })
  ) as unknown as typeof fetch;
}

// ── wire-format fixtures ──────────────────────────────────────────────────────

const AUTOMATE_PROJECTS_WIRE = [
  {
    id: 17053335,
    name: "mock-project",
    group_id: 2259240,
    user_id: 23803,
    created_at: "2026-04-19T05:16:49.000Z",
    updated_at: "2026-04-26T15:58:35.000Z",
    sub_group_id: 0,
  },
];

// getBuilds uses json-unwrap $[*].automation_build
const AUTOMATE_BUILDS_WIRE = [
  {
    automation_build: {
      name: "mock-build",
      hashed_id: "abc123build",
      duration: 37,
      status: "failed",
      build_tag: "mock-tag",
      public_url: null,
    },
  },
];

// getSessions uses json-unwrap $[*].automation_session
const AUTOMATE_SESSIONS_WIRE = [
  {
    automation_session: {
      name: "mock-session",
      hashed_id: "abc123session",
      status: "failed",
      duration: 63,
      os: "Windows",
      os_version: "10",
      browser_version: "147.0",
      browser: "chrome",
      device: null,
      reason: null,
      build_name: "mock-build",
      project_name: "mock-project",
      build_hashed_id: "abc123build",
      test_priority: null,
    },
  },
];

// getSession uses json-unwrap $.automation_session
const AUTOMATE_SESSION_WIRE = {
  automation_session: {
    name: "mock-session",
    hashed_id: "abc123session",
    status: "failed",
    duration: 63,
    os: "Windows",
    os_version: "10",
    browser_version: "147.0",
    browser: "chrome",
    device: null,
    reason: null,
    build_name: "mock-build",
    project_name: "mock-project",
    build_hashed_id: "abc123build",
    test_priority: null,
  },
};

// getBuild uses json-compose base=$.build.automation_build, merge sessions=$.build.sessions[*].automation_session
const AUTOMATE_BUILD_WIRE = {
  build: {
    automation_build: {
      name: "mock-build",
      hashed_id: "abc123build",
      duration: 37,
      status: "failed",
      build_tag: "mock-tag",
      public_url: null,
    },
    sessions: [],
  },
};

const AUTOMATE_MEDIA_FILES_WIRE = [
  {
    media_name: "test.txt",
    media_url: "media://abc123media",
    media_id: "abc123media",
    uploaded_at: "2026-04-24 19:04:52 UTC",
  },
];

const AUTOMATE_BADGE_KEY_WIRE = "badge-key-value";

const AUTOMATE_PLAN_WIRE = {
  automate_plan: "Automate Mobile",
  terminal_access: "Public",
  parallel_sessions_running: 0,
  team_parallel_sessions_max_allowed: 5,
  parallel_sessions_max_allowed: 5,
  queued_sessions: 0,
  queued_sessions_max_allowed: 5,
};

const APP_AUTOMATE_PLAN_WIRE = {
  automate_plan: "App Automate Mobile",
  parallel_sessions_running: 0,
  parallel_sessions_max_allowed: 5,
};

const APP_AUTOMATE_DEVICES_WIRE = [
  { device: "Samsung Galaxy S22", os_version: "12.0", os: "android" },
];

const APP_AUTOMATE_APPS_WIRE = [
  { app_name: "mock-app", app_id: "bs://mock123", app_version: "1.0" },
];

const LOCAL_TESTING_INSTANCES_WIRE = {
  api_version: "v1",
  meta_data: {},
  instances: [],
};

// test-management list-projects uses json-unwrap $.projects
const TEST_MANAGEMENT_PROJECTS_WIRE = {
  projects: [
    {
      name: "API Tests",
      identifier: "PR-4",
      urls: { self: "https://test-management.browserstack.com/api/v2/projects/PR-4" },
      duplicates_tc_count: 0,
    },
  ],
};

const TEST_REPORTING_PROJECTS_WIRE = {
  projects: [
    { id: 42, name: "Reporting Project", framework: "pytest" },
  ],
};

const ACCESSIBILITY_REPORTS_WIRE = {
  reports: [],
};

// ── lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  env.BROWSERSTACK_USERNAME = "test-user";
  env.BROWSERSTACK_ACCESS_KEY = "test-key";
  // Default stub — individual tests override as needed
  vi.stubGlobal("fetch", makeFetch({}));
});

afterEach(() => {
  delete env.BROWSERSTACK_USERNAME;
  delete env.BROWSERSTACK_ACCESS_KEY;
  vi.unstubAllGlobals();
});

// ── runAutomateCli ────────────────────────────────────────────────────────────

describe("runAutomateCli output", () => {
  it("help: prints usage instructions", async () => {
    const { logger, infoCalls } = makeLogger();
    await runAutomateCli(["help"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("Usage: automate <action> [args...]");
    expect(infoCalls[0]).toContain("Actions:");
  });

  it("list-projects: prints project id and name", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_PROJECTS_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAutomateCli(["list-projects"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("17053335");
    expect(infoCalls[0]).toContain("mock-project");
  });

  it("list-builds: prints hashedId, name, status", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_BUILDS_WIRE));
    const { logger, infoCalls } = makeLogger();
    // list-builds schema has 4 positionals: projectId, limit, offset, status
    // Pass empty strings for optional args to satisfy the tuple length requirement
    await runAutomateCli(["list-builds", "", "", "", ""], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("abc123build");
    expect(output).toContain("mock-build");
    expect(output).toContain("failed");
  });

  it("list-sessions: prints hashedId, name, status", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_SESSIONS_WIRE));
    const { logger, infoCalls } = makeLogger();
    // list-sessions schema has 4 positionals: buildId, limit, offset, status
    // Pass empty strings for optional args to satisfy the tuple length requirement
    await runAutomateCli(["list-sessions", "abc123build", "", "", ""], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("abc123session");
    expect(output).toContain("mock-session");
    expect(output).toContain("failed");
  });

  it("list-media-files: prints mediaUrl and mediaName", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_MEDIA_FILES_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAutomateCli(["list-media-files"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("media://abc123media");
    expect(output).toContain("test.txt");
  });

  it("get-project-badge-key: prints the badge key string", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_BADGE_KEY_WIRE, 200, "text/plain"));
    const { logger, infoCalls } = makeLogger();
    await runAutomateCli(["get-project-badge-key", "17053335"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("badge-key-value");
  });

  it("get-plan: prints JSON with automatePlan field", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_PLAN_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAutomateCli(["get-plan"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("automatePlan");
    expect(output).toContain("Automate Mobile");
  });

  it("get-build: prints JSON with hashedId", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_BUILD_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAutomateCli(["get-build", "abc123build"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("abc123build");
  });

  it("get-session: prints JSON with hashedId", async () => {
    vi.stubGlobal("fetch", makeFetch(AUTOMATE_SESSION_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAutomateCli(["get-session", "abc123session"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("abc123session");
  });
});

// ── runAppAutomateCli ─────────────────────────────────────────────────────────

describe("runAppAutomateCli output", () => {
  it("help: prints usage instructions", async () => {
    const { logger, infoCalls } = makeLogger();
    await runAppAutomateCli(["help"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("Usage: app-automate <action> [args...]");
    expect(infoCalls[0]).toContain("Actions:");
  });

  it("get-plan: prints JSON with automatePlan field", async () => {
    vi.stubGlobal("fetch", makeFetch(APP_AUTOMATE_PLAN_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAppAutomateCli(["get-plan"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("automatePlan");
  });

  it("list-devices: prints non-empty JSON array", async () => {
    vi.stubGlobal("fetch", makeFetch(APP_AUTOMATE_DEVICES_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAppAutomateCli(["list-devices"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    // Should be valid JSON containing array content
    expect(output).toContain("Samsung Galaxy S22");
  });

  it("list-apps: prints JSON containing app data", async () => {
    vi.stubGlobal("fetch", makeFetch(APP_AUTOMATE_APPS_WIRE));
    const { logger, infoCalls } = makeLogger();
    await runAppAutomateCli(["list-apps"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("mock-app");
  });
});

// ── runLocalTestingCli ────────────────────────────────────────────────────────

describe("runLocalTestingCli output", () => {
  it("help: prints usage instructions", async () => {
    const { logger, infoCalls } = makeLogger();
    await runLocalTestingCli(["help"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("Usage: local <action> [args...]");
    expect(infoCalls[0]).toContain("Actions:");
  });

  it("list-instances: prints JSON containing instances array", async () => {
    vi.stubGlobal("fetch", makeFetch(LOCAL_TESTING_INSTANCES_WIRE));
    const { logger, infoCalls } = makeLogger();
    // list-instances schema has 3 positionals: auth_token, last, state (all optional)
    // Pass empty strings to satisfy the tuple length requirement
    await runLocalTestingCli(["list-instances", "", "", ""], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    // The response is JSON.stringify'd — should contain the instances key
    expect(output).toContain("instances");
  });
});

// ── runTestManagementCli ──────────────────────────────────────────────────────

describe("runTestManagementCli output", () => {
  it("help: prints usage instructions", async () => {
    const { logger, infoCalls } = makeLogger();
    await runTestManagementCli(["help"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("Usage: test-management <action> [args...]");
    expect(infoCalls[0]).toContain("Actions:");
  });

  it("list-projects: prints JSON containing project identifier", async () => {
    // test-management getProjects uses json-unwrap $.projects — wire body must have "projects" key
    vi.stubGlobal("fetch", makeFetch(TEST_MANAGEMENT_PROJECTS_WIRE));
    const { logger, infoCalls } = makeLogger();
    // list-projects schema has 2 positionals: p (page), page_size (both optional)
    // Pass empty strings to satisfy the tuple length requirement
    await runTestManagementCli(["list-projects", "", ""], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("PR-4");
  });
});

// ── runTestReportingCli ───────────────────────────────────────────────────────

describe("runTestReportingCli output", () => {
  it("help: prints usage instructions", async () => {
    const { logger, infoCalls } = makeLogger();
    await runTestReportingCli(["help"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("Usage: test-reporting <action> [args...]");
    expect(infoCalls[0]).toContain("Actions:");
  });

  it("list-projects: prints JSON containing project data", async () => {
    vi.stubGlobal("fetch", makeFetch(TEST_REPORTING_PROJECTS_WIRE));
    const { logger, infoCalls } = makeLogger();
    // list-projects schema has 1 positional: next_page (optional)
    // Pass empty string to satisfy the tuple length requirement
    await runTestReportingCli(["list-projects", ""], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    const output = infoCalls.join("\n");
    expect(output).toContain("Reporting Project");
  });
});

describe("runScreenshotsCli output", () => {
  it("help: prints usage instructions", async () => {
    const { logger, infoCalls } = makeLogger();
    await runScreenshotsCli(["help"], logger);
    expect(infoCalls.length).toBeGreaterThan(0);
    expect(infoCalls[0]).toContain("Usage: screenshots <action> [args...]");
    expect(infoCalls[0]).toContain("Actions:");
  });
});

// ── runAccessibilityCli ───────────────────────────────────────────────────────
//
// NOTE: runAccessibilityCli has a different signature — it only accepts
// args: string[] and logs to console directly (no logger injection).
// We test it by spying on console.log.

describe("runAccessibilityCli output", () => {
  it("help: prints usage instructions", async () => {
    // Dynamic import to avoid issues with the different signature at the top level
    const { runAccessibilityCli } = await import("../index.ts");

    const logCalls: string[] = [];
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      logCalls.push(args.map(String).join(" "));
    });

    await runAccessibilityCli(["help"]);

    expect(logCalls.length).toBeGreaterThan(0);
    expect(logCalls[0]).toContain("Usage: accessibility <action> [args...]");
    expect(logCalls[0]).toContain("Actions:");
  });

  it("list-workflow-analyzer-reports: console.log contains reports data", async () => {
    // Dynamic import to avoid issues with the different signature at the top level
    const { runAccessibilityCli } = await import("../index.ts");

    vi.stubGlobal("fetch", makeFetch(ACCESSIBILITY_REPORTS_WIRE));
    const logCalls: string[] = [];
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      logCalls.push(args.map(String).join(" "));
    });

    await runAccessibilityCli(["list-workflow-analyzer-reports"]);

    expect(logCalls.length).toBeGreaterThan(0);
    const output = logCalls.join("\n");
    // The result is JSON.stringify'd — should contain "reports" key
    expect(output).toContain("reports");
  });
});
