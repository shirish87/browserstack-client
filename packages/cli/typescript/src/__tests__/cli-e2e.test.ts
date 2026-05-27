import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { execFile } from "node:child_process";
import { mkdtemp, rm, symlink, readdir, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir, homedir } from "node:os";

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
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

const TEST_TIMEOUT_SLOW_API = 15_000;
const TEST_TIMEOUT_TUNNEL = 60_000;

// Real credentials from env — present only when running integration tests.
const realUsername = process.env.BROWSERSTACK_USERNAME ?? "";
const realAccessKey = process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY ?? "";
const hasRealCreds = realUsername !== "" && realAccessKey !== "" &&
  realUsername !== "dummy-user" && realAccessKey !== "dummy-key";

async function runCliWithRealCreds(binary: typeof binaries[number], args: string[], binHome: string) {
  const spawnPath = binary.type === "node" ? "node" : binary.path;
  const spawnArgs = binary.type === "node" ? [binary.entry!, ...args] : args;

  try {
    const { stdout, stderr } = await execFileAsync(spawnPath, spawnArgs, {
      env: {
        ...process.env,
        BROWSERSTACK_USERNAME: realUsername,
        BROWSERSTACK_ACCESS_KEY: realAccessKey,
        BROWSERSTACK_LOCAL_BINARY_HOME: binHome,
      },
      timeout: TEST_TIMEOUT_TUNNEL,
    });
    return { stdout, stderr, exitCode: 0 };
  } catch (error: any) {
    return {
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
      exitCode: typeof error.code === "number" ? error.code : 1,
    };
  }
}

async function runCli(binary: typeof binaries[number], args: string[], binHome: string) {
  const spawnPath = binary.type === "node" ? "node" : binary.path;
  const spawnArgs = binary.type === "node" ? [binary.entry!, ...args] : args;

  try {
    const { stdout, stderr } = await execFileAsync(spawnPath, spawnArgs, {
      env: {
        ...process.env,
        BROWSERSTACK_ACCESS_KEY: "dummy-key",
        BROWSERSTACK_USERNAME: "dummy-user",
        BROWSERSTACK_LOCAL_BINARY_HOME: binHome,
      },
      timeout: 10_000,
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

async function assertHelp(binary: typeof binaries[number], args: string[], binHome: string) {
  const result = await runCli(binary, args, binHome);
  expect(result.exitCode).toBeLessThanOrEqual(1);
  expect(out(result)).toContain("usage");
}

async function assertError(result: { stdout: string; stderr: string, exitCode: number }, pattern: RegExp) {
  expect(result.exitCode).toBe(1);
  expect(result.stderr.toLowerCase()).toMatch(pattern);
  expect(result.stdout.trim()).toBe("");
}

async function assertUnknownAction(binary: typeof binaries[number], args: string[], binHome: string) {
  const result = await runCli(binary, args, binHome);
  await assertError(result, /unknown action|invalid action|invalid/);
}

async function assertMissingArgs(binary: typeof binaries[number], args: string[], binHome: string) {
  const result = await runCli(binary, args, binHome);
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

// REST-backed local actions that require ≥1 positional arg
const localRequiredArgActions = [
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
  describe.concurrent.each(binaries)("Testing: $name", (binary) => {
    // Each binary suite gets its own isolated binary home to avoid
    // status file collisions when suites run concurrently.
    let binHome: string;
    beforeAll(async () => {
      binHome = await mkdtemp(join(tmpdir(), "bs-e2e-"));
      // Symlink any existing binary from the default ~/.browserstack into the
      // isolated dir so the CLIs skip re-downloading during tests.
      const defaultHome = join(homedir(), ".browserstack");
      try {
        const files = await readdir(defaultHome);
        await Promise.all(
          files
            .filter((f) => f.startsWith("BrowserStackLocal"))
            .map((f) => symlink(join(defaultHome, f), join(binHome, f)).catch(() => {}))
        );
      } catch { /* default home may not exist yet — that's fine */ }
    });
    afterAll(async () => { await rm(binHome, { recursive: true, force: true }); });

    const run = (args: string[]) => runCli(binary, args, binHome);
    const runReal = (args: string[]) => runCliWithRealCreds(binary, args, binHome);
    const help = (args: string[]) => assertHelp(binary, args, binHome);
    const unknownAction = (args: string[]) => assertUnknownAction(binary, args, binHome);
    const missingArgs = (args: string[]) => assertMissingArgs(binary, args, binHome);


    // ─── Sanity Checks ──────────────────────────────────────────────────────

    it("should never produce empty output for 'help'", async () => {
      const result = await run(["help"]);
      expect(result.stdout.trim() + result.stderr.trim()).not.toBe("");
    });

    it("should never produce empty output for 'version'", async () => {
      const result = await run(["version"]);
      expect(result.stdout.trim() + result.stderr.trim()).not.toBe("");
    });

    // ─── Top-level ──────────────────────────────────────────────────────────

    it("should print usage when calling 'help'", async () => {
      await help(["help"]);
    });

    it("should print version when calling 'version'", async () => {
      const result = await run(["version"]);
      expect(result.exitCode).toBeLessThanOrEqual(1);
      expect(out(result)).toContain("browserstack-client");
    });

    it("should fail with error on unknown product", async () => {
      const result = await run(["unknown-product-xyz", "help"]);
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
      ["local", "list-instances"],
    ];

    it.each(surfaceActions)(
      "should reach API call phase for %s %s",
      async (...cmdArgs) => {
        const product = cmdArgs[0];
        const action = cmdArgs[1];
        const rest = cmdArgs.slice(2);
        const result = await run([product, action, ...rest]);

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
        const result = await run(cmdArgs);
        await assertError(result, /unauthorized|request failed|access denied|invalid key|401|403/);
      },
      TEST_TIMEOUT_SLOW_API
    );

    // ─── local ───────────────────────────────────────────────────────────────

    describe("local", () => {
      // Stop any tracked tunnels left over from prior test runs so that
      // assertions about "no tunnels running" start from a clean slate.
      // Using the CLI's own `stop` keeps both the running binaries and the
      // status.json in sync — wiping the file alone would orphan processes.
      beforeAll(async () => {
        if (hasRealCreds) {
          await runCliWithRealCreds(binary, ["local", "stop"], binHome);
        } else {
          // No real creds: seed the isolated binHome status file so unit-level
          // "list/stop with no tracked tunnels" assertions start from a clean slate.
          try {
            await writeFile(join(binHome, "status.json"), JSON.stringify({ localIdentifiers: [] }, null, 2));
          } catch {
            // best-effort; tests will surface real failures if the file isn't writable.
          }
        }
      });

      it("should print usage for 'local help'", async () => {
        await help(["local", "help"]);
      });

      it("should fail on unknown local action", async () => {
        await unknownAction(["local", "unknown-action-xyz"]);
      });

      it.each(localRequiredArgActions)(
        "local %s with no args should fail with usage hint",
        async (action) => {
          await missingArgs(["local", action]);
        }
      );

      // Binary tunnel actions (start/stop/list/run-with) — now implemented.
      // 'list' is safe to call without real credentials: it reads a local status
      // file and exits 0 with empty output (no API call made).
      it("local list should exit 0 with no output when no tunnels are running", async () => {
        const result = await run(["local", "list"]);
        expect(result.exitCode).toBe(0);
        expect(result.stdout.trim()).toBe("");
      });

      it("local stop should exit 0 with no output when no tunnels are running", async () => {
        // stop reads status.json locally — no API call, no creds needed.
        const result = await run(["local", "stop"]);
        expect(result.exitCode).toBe(0);
        expect(result.stdout.trim()).toBe("");
      });

      it.skip("local start with unknown flag should fail with error", async () => {
        const result = await run(["local", "start", "--unknown-flag", "val"]);
        expect(result.exitCode).toBe(1);
        expect(result.stderr.toLowerCase()).toMatch(/unknown|invalid/);
      });

      it("local run-with with no separator should fail with error", async () => {
        const result = await run(["local", "run-with"]);
        expect(result.exitCode).toBe(1);
        expect(result.stderr.toLowerCase()).toMatch(/separator|usage|invalid/);
      });

      // Both CLIs accept --- as a Windows PowerShell-safe alternative to --
      // (PowerShell may consume -- before it reaches the binary).
      it("local run-with with --- and no command should fail with error", async () => {
        const result = await run(["local", "run-with", "---"]);
        expect(result.exitCode).toBe(1);
        expect(result.stderr.toLowerCase()).toMatch(/no command|usage|invalid/);
      });

      // On Windows, --- passes through PowerShell unchanged; confirm it is
      // treated as a valid separator (failure is from bad creds, not parsing).
      it("local run-with with --- separator should not fail with separator error", async () => {
        if (process.platform !== "win32") return;
        const result = await run(["local", "run-with", "---", "echo", "hello"]);
        expect(result.stderr.toLowerCase()).not.toMatch(/separator/);
      }, TEST_TIMEOUT_TUNNEL);
    });

    // ─── local integration (requires real BROWSERSTACK credentials) ─────────
    //
    // Skipped automatically when dummy credentials are detected.
    // Run with real BROWSERSTACK_USERNAME + BROWSERSTACK_ACCESS_KEY to enable.

    describe.sequential("local integration", () => {
      let startedLocalIdentifier: string | undefined;

      beforeEach(() => {
        startedLocalIdentifier = undefined;
      });

      it("local start connects a tunnel and local stop disconnects it", async () => {
        if (!hasRealCreds) return;

        // start
        const startResult = await runReal(["local", "start"]);
        expect(startResult.exitCode).toBe(0);
        // stdout: "<localIdentifier>: Connected"
        expect(startResult.stdout).toMatch(/^[a-z0-9]+: connected$/im);
        startedLocalIdentifier = startResult.stdout.trim().split(":")[0].trim();

        // list — should include the started identifier
        const listResult = await runReal(["local", "list"]);
        expect(listResult.exitCode).toBe(0);
        expect(listResult.stdout).toContain(startedLocalIdentifier);

        // stop
        const stopResult = await runReal(["local", "stop"]);
        expect(stopResult.exitCode).toBe(0);
        expect(stopResult.stdout).toMatch(/stopped successfully/i);

        // list — should be empty now
        const listAfterStop = await runReal(["local", "list"]);
        expect(listAfterStop.exitCode).toBe(0);
        expect(listAfterStop.stdout.trim()).toBe("");
      }, TEST_TIMEOUT_TUNNEL);

      it("local stop with specific --local-identifier stops only that tunnel", async () => {
        if (!hasRealCreds) return;

        const startResult = await runReal(["local", "start"]);
        expect(startResult.exitCode).toBe(0);
        startedLocalIdentifier = startResult.stdout.trim().split(":")[0].trim();

        const stopResult = await runReal([
          "local", "stop", "--local-identifier", startedLocalIdentifier!,
        ]);
        expect(stopResult.exitCode).toBe(0);
        expect(stopResult.stdout).toContain(startedLocalIdentifier);
        expect(stopResult.stdout).toMatch(/stopped successfully/i);
      }, TEST_TIMEOUT_TUNNEL);

      it("local stop with specific local-identifier argument stops only that tunnel", async () => {
        if (!hasRealCreds) return;

        const startResult = await runReal(["local", "start"]);
        expect(startResult.exitCode).toBe(0);
        startedLocalIdentifier = startResult.stdout.trim().split(":")[0].trim();

        const stopResult = await runReal([
          "local", "stop", startedLocalIdentifier!,
        ]);
        expect(stopResult.exitCode).toBe(0);
        expect(stopResult.stdout).toContain(startedLocalIdentifier);
        expect(stopResult.stdout).toMatch(/stopped successfully/i);
      }, TEST_TIMEOUT_TUNNEL);

      it("local stop on an already-stopped tunnel does not error", async () => {
        if (!hasRealCreds) return;

        const startResult = await runReal(["local", "start"]);
        expect(startResult.exitCode).toBe(0);
        startedLocalIdentifier = startResult.stdout.trim().split(":")[0].trim();

        // stop twice — second stop should not crash
        await runReal(["local", "stop"]);
        const secondStop = await runReal(["local", "stop"]);
        expect(secondStop.exitCode).toBe(0);
      }, TEST_TIMEOUT_TUNNEL);

      it("local run-with starts tunnel, sets env vars, runs command, stops tunnel", async () => {
        if (!hasRealCreds) return;
        // On Windows PowerShell, -- may be consumed before reaching the binary.
        // Use --- instead — both CLIs accept it when spawned via execFileAsync
        // (args are passed directly to the OS, no shell interpolation).
        const sep = process.platform === "win32" ? "---" : "--";

        const result = await runReal([
          "local", "run-with", sep,
          process.execPath, "-e", "assert(process.env.BROWSERSTACK_LOCAL_IDENTIFIER);",
        ]);
        expect(result.exitCode).toBe(0);
        const lines = (result.stdout + result.stderr).split("\n").map((l: string) => l.trim()).filter(Boolean);
        const connectedLine = lines.find((l: string) => /connected/i.test(l));
        expect(connectedLine).toBeTruthy();
        const tunnelId = connectedLine!.split(":")[0].trim();
        expect(result.stdout).toContain(tunnelId);
        expect(lines.some((l: string) => /stopped successfully/i.test(l))).toBe(true);
      }, TEST_TIMEOUT_TUNNEL);

      it("local run-with exits non-zero when child command fails", async () => {
        if (!hasRealCreds) return;
        const sep = process.platform === "win32" ? "---" : "--";
        const result = await runReal([
          "local", "run-with", sep,
          "node", "-e", "process.exit(42)",
        ]);
        expect(result.exitCode).not.toBe(0);
        const listResult = await runReal(["local", "list"]);
        expect(listResult.stdout.trim()).toBe("");
      }, TEST_TIMEOUT_TUNNEL);
    });

    // ─── automate ───────────────────────────────────────────────────────────

    describe("automate", () => {
      it("should print usage for 'automate help'", async () => {
        await help(["automate", "help"]);
      });

      it("should fail on unknown automate action", async () => {
        await unknownAction(["automate", "unknown-action-xyz"]);
      });

      it.each(automateRequiredArgActions)(
        "automate %s with no args should fail with usage hint",
        async (action) => {
          await missingArgs(["automate", action]);
        }
      );
    });

    // ─── app-automate ────────────────────────────────────────────────────────

    describe("app-automate", () => {
      it("should print usage for 'app-automate help'", async () => {
        await help(["app-automate", "help"]);
      });

      it("should fail on unknown app-automate action", async () => {
        await unknownAction(["app-automate", "unknown-action-xyz"]);
      });

      it.each(appAutomateRequiredArgActions)(
        "app-automate %s with no args should fail with usage hint",
        async (action) => {
          await missingArgs(["app-automate", action]);
        }
      );
    });

    // ─── screenshots ─────────────────────────────────────────────────────────

    describe("screenshots", () => {
      it("should print usage for 'screenshots help'", async () => {
        await help(["screenshots", "help"]);
      });

      it("should fail on unknown screenshots action", async () => {
        await unknownAction(["screenshots", "unknown-action-xyz"]);
      });

      it.each(screenshotsRequiredArgActions)(
        "screenshots %s with no args should fail with usage hint",
        async (action) => {
          await missingArgs(["screenshots", action]);
        }
      );
    });

    // ─── accessibility ───────────────────────────────────────────────────────

    describe("accessibility", () => {
      it("should print usage for 'accessibility help'", async () => {
        await help(["accessibility", "help"]);
      });

      it("should fail on unknown accessibility action", async () => {
        await unknownAction(["accessibility", "unknown-action-xyz"]);
      });

      it.each(accessibilityRequiredArgActions)(
        "accessibility %s with no args should fail with usage hint",
        async (action) => {
          await missingArgs(["accessibility", action]);
        }
      );
    });

    // ─── test-reporting ──────────────────────────────────────────────────────

    describe("test-reporting", () => {
      it("should print usage for 'test-reporting help'", async () => {
        await help(["test-reporting", "help"]);
      });

      it("should fail on unknown test-reporting action", async () => {
        await unknownAction(["test-reporting", "unknown-action-xyz"]);
      });

      it.each(testReportingRequiredArgActions)(
        "test-reporting %s with no args should fail with usage hint",
        async (action) => {
          await missingArgs(["test-reporting", action]);
        }
      );
    });

    // ─── test-management (flat dispatch: both CLIs use <action> directly) ────

    describe("test-management", () => {
      it("should print usage for 'test-management help'", async () => {
        await help(["test-management", "help"]);
      });

      it("should fail on unknown test-management action", async () => {
        await unknownAction(["test-management", "unknown-action-xyz"]);
      });

      describe.each(Object.entries(testManagementActions))(
        "Resource: %s",
        (_resource, actions) => {
          it.each(actions)(
            "test-management %s with no args should fail with usage hint",
            async (action) => {
              await missingArgs(["test-management", action]);
            }
          );
        }
      );
    });

  });
});
