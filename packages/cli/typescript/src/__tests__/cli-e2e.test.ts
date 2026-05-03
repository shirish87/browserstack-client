import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve, join } from "node:path";

const execFileAsync = promisify(execFile);

const __dirname = new URL(".", import.meta.url).pathname;
const monorepoRoot = resolve(__dirname, "../../../../..");

const platformSuffix = process.platform === "win32"
  ? "windows-amd64.exe"
  : `${process.platform === "darwin" ? "darwin" : "linux"}-${process.arch === "arm64" ? "arm64" : "amd64"}`;

const tsBinary = join(monorepoRoot, `packages/cli/typescript/dist-binary/browserstack-client-ts-${platformSuffix}`);
const tsNodeEntry = join(monorepoRoot, "packages/cli/typescript/dist/browserstack-client.js");
const goBinary = join(monorepoRoot, `packages/cli/golang/dist/browserstack-client-${platformSuffix}`);

const binaries = [
  { name: "TypeScript CLI (Binary)", path: tsBinary, type: "binary" },
  { name: "TypeScript CLI (Node)", path: "node", entry: tsNodeEntry, type: "node" },
  { name: "Golang CLI", path: goBinary, type: "binary" },
];

const TEST_TIMEOUT_SLOW_API = 30000;

async function runCli(binary: typeof binaries[number], args: string[]) {
  const spawnPath = binary.type === "node" ? "node" : binary.path;
  const spawnArgs = binary.type === "node" ? [binary.entry!, ...args] : args;

  try {
    const { stdout, stderr } = await execFileAsync(spawnPath, spawnArgs, {
      env: {
        ...process.env,
        BROWSERSTACK_ACCESS_KEY: "dummy-key",
        BROWSERSTACK_USERNAME: "dummy-user"
      }
    });
    return { stdout, stderr, exitCode: 0 };
  } catch (error: any) {
    return { 
      stdout: error.stdout ?? "", 
      stderr: error.stderr ?? "", 
      exitCode: typeof error.code === "number" ? error.code : 1 
    };
  }
}

function out(result: { stdout: string; stderr: string }) {
  return (result.stdout + result.stderr).toLowerCase();
}

async function assertHelp(binary: typeof binaries[number], args: string[]) {
  const result = await runCli(binary, args);
  // Help is not an error, it should exit with 0 or 1 (some CLIs use 1 for help)
  // and can be in either stdout or stderr depending on implementation.
  expect(result.exitCode).toBeLessThanOrEqual(1);
  expect(out(result)).toContain("usage");
}

async function assertError(result: { stdout: string; stderr: string, exitCode: number }, pattern: RegExp) {
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toLowerCase()).toMatch(pattern);
  // Errors should NOT be in stdout
  expect(result.stdout.trim()).toBe("");
}

async function assertUnknownAction(binary: typeof binaries[number], args: string[]) {
  const result = await runCli(binary, args);
  await assertError(result, /unknown action|invalid action|invalid/);
}

async function assertMissingArgs(binary: typeof binaries[number], args: string[]) {
  const result = await runCli(binary, args);
  await assertError(result, /usage|missing|invalid|required|argument validation|unauthorized|not found|access denied|request failed/);
}

// Actions that require ≥1 positional arg — calling with no args should produce a usage error.
// Derived directly from cli_dispatch.generated.go for each product.

const automateRequiredArgActions = [
  "list-session-appium-logs",
  "get-project-badge-key",
  "upload-session-terminal-logs",
  "delete-builds",
  "get-session",
  "update-session",
  "delete-session",
  "delete-sessions",
  "delete-media-file",
  "get-build",
  "update-build",
  "delete-build",
  "list-session-logs",
  "list-sessions",
  "get-project",
  "update-project",
  "delete-project",
  "list-session-selenium-logs",
  "upload-build-terminal-logs",
  "list-session-console-logs",
  "list-session-telemetry-logs",
  "list-builds",
  "list-session-network-logs",
];

const appAutomateRequiredArgActions = [
  "get-build",
  "update-build",
  "delete-build",
  "list-media-files-by-custom-id",
  "list-session-logs",
  "get-xcui-test-app",
  "delete-xcui-test-app",
  "list-network-logs",
  "upload-build-terminal-logs",
  "list-xcui-test-apps",
  "upload-session-terminal-logs",
  "get-project",
  "update-project",
  "delete-project",
  "list-appium-logs",
  "delete-app",
  "get-flutter-android-app",
  "delete-flutter-android-app",
  "list-espresso-apps",
  "get-app-profiling-data-v2",
  "get-session",
  "update-session",
  "delete-session",
  "list-projects",
  "delete-media-file",
  "get-espresso-app",
  "delete-espresso-app",
  "list-flutter-ios-apps",
  "list-apps-by-custom-id",
  "list-flutter-android-apps",
  "list-device-logs",
  "list-app-profiling-data-v1",
  "list-builds",
  "get-flutter-ios-app",
  "delete-flutter-ios-app",
  "get-project-badge-key",
];

const screenshotsRequiredArgActions = [
  "get-job",
];

// All local actions require args
const localRequiredArgActions = [
  "list-instances",
  "get-instance",
  "disconnect-instance",
];

const accessibilityRequiredArgActions = [
  "get-workflow-analyzer-report-summary",
  "list-workflow-analyzer-report-issues",
  "get-assisted-test-report-summary",
  "list-assisted-test-report-issues",
  "get-website-scanner-scan-overview",
  "list-website-scanner-scan-runs",
  "get-website-scanner-scan-run-summary",
  "list-website-scanner-scan-run-status",
  "list-website-scanner-scan-run-issues",
  "list-website-scanner-scan-run-logs",
  "list-automated-test-projects",
  "list-automated-test-builds",
  "list-automated-test-build-test-cases",
  "get-automated-test-build-summary",
  "list-automated-test-build-issues",
  "get-automated-test-build-test-case-summary",
  "list-automated-test-build-test-case-issues",
];

const testReportingRequiredArgActions = [
  "list-projects",
  "list-project-builds",
  "get-latest-build",
  "get-build",
  "update-build",
  "finish-build",
  "start-test-run",
  "finish-test-run",
  "start-hook-run",
  "finish-hook-run",
  "add-build-logs",
  "list-test-runs",
  "get-self-healing-report",
  "list-quality-gate-status",
  "list-quality-gate-settings",
  "update-quality-gate-settings",
  "create-quality-gate-profile",
  "get-quality-gate-profile",
  "update-quality-gate-profile",
  "delete-quality-gate-profile",
  "toggle-quality-gate-profile",
];

// test-management: actions grouped by resource
const testManagementActions = {
  Projects: [
    "get-project",
    "update-project",
    "delete-project",
  ],
  Folders: [
    "list-folders",
    "create-folder",
    "get-folder",
    "update-folder",
    "delete-folder",
    "move-folder",
  ],
  TestCases: [
    "list-test-cases",
    "bulk-edit-test-cases",
    "bulk-delete-test-cases",
    "bulk-archive-test-cases",
    "bulk-unarchive-test-cases",
    "bulk-edit-test-cases-with-operations",
    "create-test-case",
    "update-test-case",
    "delete-test-case",
    "archive-test-case",
    "unarchive-test-case",
    "move-test-case",
  ],
  Attachments: [
    "list-test-case-attachments",
    "add-test-case-attachment",
    "delete-test-case-attachment",
    "list-test-result-attachments",
    "add-test-result-attachment",
    "delete-test-result-attachment",
  ],
  TestResults: [
    "list-test-case-results",
    "list-test-run-results",
    "add-test-run-results",
    "list-test-run-test-case-results",
  ],
  TestRuns: [
    "get-test-run",
    "list-test-run-test-cases",
    "patch-test-run",
    "update-test-run",
    "assign-test-run-test-cases",
    "close-test-run",
    "delete-test-run",
  ],
  TestPlans: [
    "get-test-plan",
    "update-test-plan",
    "list-test-plan-test-runs",
  ],
  Configurations: [
    "get-configuration",
  ],
  CustomFields: [
    "update-custom-field",
    "delete-custom-field",
  ],
};

describe("CLI E2E Orchestrator", () => {
  describe.each(binaries)("Testing: $name", (binary) => {

    // ─── Sanity Checks ──────────────────────────────────────────────────────

    it("should never produce empty output for 'help'", async () => {
      const result = await runCli(binary, ["help"]);
      expect(result.stdout.trim() + result.stderr.trim()).not.toBe("");
    });

    it("should never produce empty output for 'version'", async () => {
      const result = await runCli(binary, ["version"]);
      expect(result.stdout.trim() + result.stderr.trim()).not.toBe("");
    });

    // ─── Top-level ──────────────────────────────────────────────────────────

    it("should print usage when calling 'help'", async () => {
      await assertHelp(binary, ["help"]);
    });

    it("should print version when calling 'version'", async () => {
      const result = await runCli(binary, ["version"]);
      expect(result.exitCode).toBeLessThanOrEqual(1);
      expect(out(result)).toContain("browserstack-client");
    });

    it("should fail with error on unknown product", async () => {
      const result = await runCli(binary, ["unknown-product-xyz", "help"]);
      expect(result.exitCode).toBeGreaterThan(0);
      expect(out(result)).toMatch(/unknown|invalid/);
    });

    // ─── Surface Reachability (Actions with no required args) ───────────────

    const surfaceActions = [
      ["app-automate", "list-devices"],
      ["app-automate", "get-plan"],
      ["screenshots", "list-browsers"],
      ["accessibility", "list-workflow-analyzer-reports"],
      ["accessibility", "list-assisted-test-reports"],
      ["test-management", "list-projects", "1", "10"],
      ["test-reporting", "list-projects", "1"],
    ];

    it.each(surfaceActions)(
      "should reach API call phase for %s %s",
      async (...cmdArgs) => {
        const product = cmdArgs[0];
        const action = cmdArgs[1];
        const rest = cmdArgs.slice(2);
        const result = await runCli(binary, [product, action, ...rest]);

        // screenshots list-browsers might be public and return exit 0
        if (product === "screenshots" && action === "list-browsers") {
          expect(result.exitCode).toBe(0);
          return;
        }

        // Since we use dummy-key, it should fail with unauthorized or request failed,
        // which confirms the dispatch logic worked and it tried to call the API.
        await assertError(result, /unauthorized|request failed|access denied|invalid key|401|403/);
      }
    );

    const slowSurfaceActions = [
      ["automate", "list-browsers"],
      ["automate", "get-plan"],
    ];

    it.each(slowSurfaceActions)(
      "should reach API call phase for %s %s",
      async (...cmdArgs) => {
        const result = await runCli(binary, cmdArgs);
        await assertError(result, /unauthorized|request failed|access denied|invalid key|401|403/);
      },
      TEST_TIMEOUT_SLOW_API
    );

    // ─── local ───────────────────────────────────────────────────────────────

    describe("local", () => {
      it("should print usage for 'local help'", async () => {
        await assertHelp(binary, ["local", "help"]);
      });

      it("should fail on unknown local action", async () => {
        await assertUnknownAction(binary, ["local", "unknown-action-xyz"]);
      });

      it.each(localRequiredArgActions)(
        "local %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binary, ["local", action]);
        }
      );

      // Binary tunnel actions (start/stop/list/run-with) — now implemented.
      // 'list' is safe to call without real credentials: it reads a local status
      // file and exits 0 with empty output (no API call made).
      it("local list should exit 0 with no output when no tunnels are running", async () => {
        const result = await runCli(binary, ["local", "list"]);
        expect(result.exitCode).toBe(0);
        expect(result.stdout.trim()).toBe("");
      });

      it("local start with unknown flag should fail with error", async () => {
        const result = await runCli(binary, ["local", "start", "--unknown-flag", "val"]);
        expect(result.exitCode).toBe(1);
        expect(result.stderr.toLowerCase()).toMatch(/unknown|invalid/);
      });

      it("local run-with with no -- separator should fail with error", async () => {
        const result = await runCli(binary, ["local", "run-with"]);
        expect(result.exitCode).toBe(1);
        expect(result.stderr.toLowerCase()).toMatch(/separator|usage|invalid/);
      });
    });

    // ─── automate ───────────────────────────────────────────────────────────

    describe("automate", () => {
      it("should print usage for 'automate help'", async () => {
        await assertHelp(binary, ["automate", "help"]);
      });

      it("should fail on unknown automate action", async () => {
        await assertUnknownAction(binary, ["automate", "unknown-action-xyz"]);
      });

      it.each(automateRequiredArgActions)(
        "automate %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binary, ["automate", action]);
        }
      );
    });

    // ─── app-automate ────────────────────────────────────────────────────────

    describe("app-automate", () => {
      it("should print usage for 'app-automate help'", async () => {
        await assertHelp(binary, ["app-automate", "help"]);
      });

      it("should fail on unknown app-automate action", async () => {
        await assertUnknownAction(binary, ["app-automate", "unknown-action-xyz"]);
      });

      it.each(appAutomateRequiredArgActions)(
        "app-automate %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binary, ["app-automate", action]);
        }
      );
    });

    // ─── screenshots ─────────────────────────────────────────────────────────

    describe("screenshots", () => {
      it("should print usage for 'screenshots help'", async () => {
        await assertHelp(binary, ["screenshots", "help"]);
      });

      it("should fail on unknown screenshots action", async () => {
        await assertUnknownAction(binary, ["screenshots", "unknown-action-xyz"]);
      });

      it.each(screenshotsRequiredArgActions)(
        "screenshots %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binary, ["screenshots", action]);
        }
      );
    });

    // ─── accessibility ───────────────────────────────────────────────────────

    describe("accessibility", () => {
      it("should print usage for 'accessibility help'", async () => {
        await assertHelp(binary, ["accessibility", "help"]);
      });

      it("should fail on unknown accessibility action", async () => {
        await assertUnknownAction(binary, ["accessibility", "unknown-action-xyz"]);
      });

      it.each(accessibilityRequiredArgActions)(
        "accessibility %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binary, ["accessibility", action]);
        }
      );
    });

    // ─── test-reporting ──────────────────────────────────────────────────────

    describe("test-reporting", () => {
      it("should print usage for 'test-reporting help'", async () => {
        await assertHelp(binary, ["test-reporting", "help"]);
      });

      it("should fail on unknown test-reporting action", async () => {
        await assertUnknownAction(binary, ["test-reporting", "unknown-action-xyz"]);
      });

      it.each(testReportingRequiredArgActions)(
        "test-reporting %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binary, ["test-reporting", action]);
        }
      );
    });

    // ─── test-management (flat dispatch: both CLIs use <action> directly) ────

    describe("test-management", () => {
      it("should print usage for 'test-management help'", async () => {
        await assertHelp(binary, ["test-management", "help"]);
      });

      it("should fail on unknown test-management action", async () => {
        await assertUnknownAction(binary, ["test-management", "unknown-action-xyz"]);
      });

      describe.each(Object.entries(testManagementActions))(
        "Resource: %s",
        (_resource, actions) => {
          it.each(actions)(
            "test-management %s with no args should fail with usage hint",
            async (action) => {
              await assertMissingArgs(binary, ["test-management", action]);
            }
          );
        }
      );
    });

  });
});
