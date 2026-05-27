import { describe, it, expect, beforeAll } from "vitest";
import { spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(__dirname, "../../../../..");
const TEST_TIMEOUT = 10_000;

let watchBundle: string;
let tmpDir: string;

beforeAll(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "bswatch-test-"));
  watchBundle = join(tmpDir, "watch.cjs");
  const esbuild = join(monorepoRoot, "node_modules/.bin/esbuild");
  const watchSrc = join(monorepoRoot, "packages/cli/typescript/src/browserstack-watch.ts");
  const fixture = join(tmpDir, "fixture.ts");
  writeFileSync(fixture, `import { main } from ${JSON.stringify(watchSrc)};\nmain();\n`);
  execFileSync(esbuild, [
    fixture,
    "--bundle",
    "--platform=node",
    "--format=cjs",
    `--outfile=${watchBundle}`,
    "--external:node:*",
    "--log-level=silent",
  ]);
}, 30_000);

function runWatch(
  args: string[],
  env: Record<string, string> = {},
): { stdout: string; stderr: string; exitCode: number } {
  const result = spawnSync(
    process.execPath,
    [watchBundle, ...args],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        BROWSERSTACK_WATCH_ENDPOINT: "",
        ...env,
      },
      timeout: 8_000,
    },
  );
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    exitCode: result.status ?? (result.signal ? 1 : 0),
  };
}

// ── Passthrough (no endpoint) ─────────────────────────────────────────────────

describe("browserstack-watch passthrough (no endpoint)", () => {
  it("forwards stdout from child process", () => {
    const { stdout, exitCode } = runWatch([
      "start", "--", "sh", "-c", "printf 'hello world\\n'",
    ]);
    expect(stdout).toContain("hello world");
    expect(exitCode).toBe(0);
  }, TEST_TIMEOUT);

  it("forwards stderr from child process", () => {
    const { stderr } = runWatch([
      "start", "--", "sh", "-c", "echo error-line >&2",
    ]);
    expect(stderr).toContain("error-line");
  }, TEST_TIMEOUT);

  it("propagates non-zero exit code", () => {
    const { exitCode } = runWatch(["start", "--", "sh", "-c", "exit 7"]);
    expect(exitCode).toBe(7);
  }, TEST_TIMEOUT);

  it("propagates zero exit code", () => {
    const { exitCode } = runWatch(["start", "--", "true"]);
    expect(exitCode).toBe(0);
  }, TEST_TIMEOUT);

  it("does not strip sentinel in passthrough mode", () => {
    const sentinel = `BROWSERSTACK_WATCH_FLUSH:{"spans":1,"logs":0,"status":"ok"}`;
    const { stdout } = runWatch([
      "start", "--", "sh", "-c", `echo '${sentinel}'`,
    ]);
    expect(stdout).toContain("BROWSERSTACK_WATCH_FLUSH");
  }, TEST_TIMEOUT);
});

// ── Instrumented (with endpoint) ─────────────────────────────────────────────

describe("browserstack-watch instrumented (with endpoint)", () => {
  const watchEnv = {
    BROWSERSTACK_WATCH_ENDPOINT: "http://localhost:4318",
    BROWSERSTACK_WATCH_FLUSH_TIMEOUT: "500ms",
    BROWSERSTACK_WATCH_REPORTER_PATH: "/dev/null",
  };

  it("forwards stdout from child process", () => {
    const { stdout } = runWatch(
      ["start", "--", "sh", "-c", "printf 'line one\\nline two\\n'"],
      watchEnv,
    );
    expect(stdout).toContain("line one");
    expect(stdout).toContain("line two");
  }, TEST_TIMEOUT);

  it("strips sentinel from stdout", () => {
    const sentinel = `BROWSERSTACK_WATCH_FLUSH:{"spans":3,"logs":0,"status":"ok"}`;
    const { stdout } = runWatch(
      ["start", "--", "sh", "-c", `echo before; echo '${sentinel}'; echo after`],
      watchEnv,
    );
    expect(stdout).not.toContain("BROWSERSTACK_WATCH_FLUSH");
    expect(stdout).toContain("before");
    expect(stdout).toContain("after");
  }, TEST_TIMEOUT);

  it("forwards stderr from child process", () => {
    const { stderr } = runWatch(
      ["start", "--", "sh", "-c", "echo error-line >&2"],
      watchEnv,
    );
    expect(stderr).toContain("error-line");
  }, TEST_TIMEOUT);

  it("does not leak stderr into stdout", () => {
    const { stdout } = runWatch(
      ["start", "--", "sh", "-c", "echo stdout-msg; echo stderr-msg >&2"],
      watchEnv,
    );
    expect(stdout).toContain("stdout-msg");
    expect(stdout).not.toContain("stderr-msg");
  }, TEST_TIMEOUT);

  it("does not leak stdout into stderr", () => {
    const { stderr } = runWatch(
      ["start", "--", "sh", "-c", "echo stdout-msg; echo stderr-msg >&2"],
      watchEnv,
    );
    expect(stderr).not.toContain("stdout-msg");
  }, TEST_TIMEOUT);

  it("propagates non-zero exit code", () => {
    const { exitCode } = runWatch(
      ["start", "--", "sh", "-c", "exit 13"],
      watchEnv,
    );
    expect(exitCode).toBe(13);
  }, TEST_TIMEOUT);

  it("preserves stdout alongside non-zero exit code", () => {
    const { stdout, exitCode } = runWatch(
      ["start", "--", "sh", "-c", "echo output-before-fail; exit 5"],
      watchEnv,
    );
    expect(exitCode).toBe(5);
    expect(stdout).toContain("output-before-fail");
  }, TEST_TIMEOUT);

  it("strips sentinel and preserves exit code zero", () => {
    const sentinel = `BROWSERSTACK_WATCH_FLUSH:{"spans":7,"logs":1,"status":"ok"}`;
    const { stdout, exitCode } = runWatch(
      ["start", "--", "sh", "-c", `echo real-output; echo '${sentinel}'`],
      watchEnv,
    );
    expect(exitCode).toBe(0);
    expect(stdout).not.toContain("BROWSERSTACK_WATCH_FLUSH");
    expect(stdout).toContain("real-output");
  }, TEST_TIMEOUT);

  it("propagates exit code after flush timeout when no sentinel written", () => {
    const { exitCode } = runWatch(
      ["start", "--", "sh", "-c", "exit 99"],
      watchEnv,
    );
    expect(exitCode).toBe(99);
  }, TEST_TIMEOUT);
});
