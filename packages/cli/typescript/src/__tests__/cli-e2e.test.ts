import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve, join } from "node:path";

const execFileAsync = promisify(execFile);

const __dirname = new URL(".", import.meta.url).pathname;
const monorepoRoot = resolve(__dirname, "../../../../..");

const isWindows = process.platform === "win32";
const platform = isWindows ? "windows" : process.platform === "darwin" ? "darwin" : "linux";
const arch = "amd64"; // We currently only build amd64 for tests
const ext = isWindows ? ".exe" : "";

const tsBinaryName = `browserstack-client-ts-${platform}-${arch}${ext}`;
const goBinaryName = `browserstack-client-${platform}-${arch}${ext}`;

const tsBinary = join(monorepoRoot, "packages/cli/typescript/dist-binary", tsBinaryName);
const goBinary = join(monorepoRoot, "packages/cli/golang/dist", goBinaryName);

const binaries = [
  { name: "TypeScript CLI", path: tsBinary },
  { name: "Golang CLI", path: goBinary },
];

async function runCli(binaryPath: string, args: string[]) {
  try {
    const { stdout, stderr } = await execFileAsync(binaryPath, args, {
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

async function assertHelp(binaryPath: string, args: string[]) {
  const result = await runCli(binaryPath, args);
  expect(result.exitCode).toBeLessThanOrEqual(1);
  expect(out(result)).toContain("usage");
}

async function assertUnknownAction(binaryPath: string, args: string[]) {
  const result = await runCli(binaryPath, args);
  expect(result.exitCode).toBeGreaterThan(0);
  expect(out(result)).toMatch(/unknown action|invalid action|invalid/);
}

async function assertMissingArgs(binaryPath: string, args: string[]) {
  const result = await runCli(binaryPath, args);
  expect(result.exitCode).toBeGreaterThan(0);
  expect(out(result)).toMatch(/usage|missing|invalid|required|argument validation|unauthorized|not found|access denied|request failed/);
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
  "get-media-files-by-custom-id",
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
  "list-flutteri-os-apps",
  "get-apps-by-custom-id",
  "list-flutter-android-apps",
  "list-device-logs",
  "get-app-profiling-data-v1",
  "list-builds",
  "get-flutteri-os-app",
  "delete-flutteri-os-app",
  "get-project-badge-key",
];

const screenshotsRequiredArgActions = [
  "get-job",
];

// All local-testing actions require args
const localTestingRequiredArgActions = [
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

// test-management: flat dispatch for both CLIs (TS updated to match Go)
const testManagementRequiredArgActions = [
  "get-project",
  "update-project",
  "delete-project",
  "list-folders",
  "create-folder",
  "get-folder",
  "update-folder",
  "delete-folder",
  "move-folder",
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
  "list-test-case-attachments",
  "add-test-case-attachment",
  "delete-test-case-attachment",
  "list-test-result-attachments",
  "add-test-result-attachment",
  "delete-test-result-attachment",
  "list-test-case-results",
  "list-test-run-results",
  "add-test-run-results",
  "list-test-run-test-case-results",
  "get-test-run",
  "list-test-run-test-cases",
  "patch-test-run",
  "update-test-run",
  "assign-test-run-test-cases",
  "close-test-run",
  "delete-test-run",
  "get-test-plan",
  "update-test-plan",
  "list-test-plan-test-runs",
  "get-configuration",
  "update-custom-field",
  "delete-custom-field",
];

describe("CLI E2E Orchestrator", () => {
  describe.each(binaries)("Testing binary: $name", ({ path: binaryPath }) => {

    // ─── Top-level ──────────────────────────────────────────────────────────

    it("should print usage when calling 'help'", async () => {
      await assertHelp(binaryPath, ["help"]);
    });

    it("should print version when calling 'version'", async () => {
      const result = await runCli(binaryPath, ["version"]);
      expect(result.exitCode).toBeLessThanOrEqual(1);
      expect(out(result)).toContain("browserstack-client");
    });

    it("should fail with error on unknown product", async () => {
      const result = await runCli(binaryPath, ["unknown-product-xyz", "help"]);
      expect(result.exitCode).toBeGreaterThan(0);
      expect(out(result)).toMatch(/unknown|invalid/);
    });

    // ─── automate ───────────────────────────────────────────────────────────

    describe("automate", () => {
      it("should print usage for 'automate help'", async () => {
        await assertHelp(binaryPath, ["automate", "help"]);
      });

      it("should fail on unknown automate action", async () => {
        await assertUnknownAction(binaryPath, ["automate", "unknown-action-xyz"]);
      });

      it.each(automateRequiredArgActions)(
        "automate %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binaryPath, ["automate", action]);
        }
      );
    });

    // ─── app-automate ────────────────────────────────────────────────────────

    describe("app-automate", () => {
      it("should print usage for 'app-automate help'", async () => {
        await assertHelp(binaryPath, ["app-automate", "help"]);
      });

      it("should fail on unknown app-automate action", async () => {
        await assertUnknownAction(binaryPath, ["app-automate", "unknown-action-xyz"]);
      });

      it.each(appAutomateRequiredArgActions)(
        "app-automate %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binaryPath, ["app-automate", action]);
        }
      );
    });

    // ─── screenshots ─────────────────────────────────────────────────────────

    describe("screenshots", () => {
      it("should print usage for 'screenshots help'", async () => {
        await assertHelp(binaryPath, ["screenshots", "help"]);
      });

      it("should fail on unknown screenshots action", async () => {
        await assertUnknownAction(binaryPath, ["screenshots", "unknown-action-xyz"]);
      });

      it.each(screenshotsRequiredArgActions)(
        "screenshots %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binaryPath, ["screenshots", action]);
        }
      );
    });

    // ─── local-testing ───────────────────────────────────────────────────────

    describe("local-testing", () => {
      it("should print usage for 'local-testing help'", async () => {
        await assertHelp(binaryPath, ["local-testing", "help"]);
      });

      it("should fail on unknown local-testing action", async () => {
        await assertUnknownAction(binaryPath, ["local-testing", "unknown-action-xyz"]);
      });

      it.each(localTestingRequiredArgActions)(
        "local-testing %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binaryPath, ["local-testing", action]);
        }
      );
    });

    // ─── accessibility ───────────────────────────────────────────────────────

    describe("accessibility", () => {
      it("should print usage for 'accessibility help'", async () => {
        await assertHelp(binaryPath, ["accessibility", "help"]);
      });

      it("should fail on unknown accessibility action", async () => {
        await assertUnknownAction(binaryPath, ["accessibility", "unknown-action-xyz"]);
      });

      it.each(accessibilityRequiredArgActions)(
        "accessibility %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binaryPath, ["accessibility", action]);
        }
      );
    });

    // ─── test-reporting ──────────────────────────────────────────────────────

    describe("test-reporting", () => {
      it("should print usage for 'test-reporting help'", async () => {
        await assertHelp(binaryPath, ["test-reporting", "help"]);
      });

      it("should fail on unknown test-reporting action", async () => {
        await assertUnknownAction(binaryPath, ["test-reporting", "unknown-action-xyz"]);
      });

      it.each(testReportingRequiredArgActions)(
        "test-reporting %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binaryPath, ["test-reporting", action]);
        }
      );
    });

    // ─── test-management (flat dispatch: both CLIs use <action> directly) ────

    describe("test-management", () => {
      it("should print usage for 'test-management help'", async () => {
        await assertHelp(binaryPath, ["test-management", "help"]);
      });

      it("should fail on unknown test-management action", async () => {
        await assertUnknownAction(binaryPath, ["test-management", "unknown-action-xyz"]);
      });

      it.each(testManagementRequiredArgActions)(
        "test-management %s with no args should fail with usage hint",
        async (action) => {
          await assertMissingArgs(binaryPath, ["test-management", action]);
        }
      );
    });

  });
});
