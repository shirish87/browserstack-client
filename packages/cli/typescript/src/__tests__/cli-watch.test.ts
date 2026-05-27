import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(__dirname, "../../../../..");
const tsNodeEntry = join(monorepoRoot, "packages/cli/typescript/dist-binary/browserstack-client.cjs");
const TEST_TIMEOUT = 10_000;

function runWatch(
  args: string[],
  env: Record<string, string> = {},
): { stdout: string; stderr: string; exitCode: number } {
  const result = spawnSync(
    "node",
    [tsNodeEntry, "test-reporting", "watch", ...args],
    {
      encoding: "utf8",
      env: { ...process.env, BROWSERSTACK_WATCH_ENDPOINT: "", ...env },
      timeout: 8_000,
    },
  );
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    exitCode: result.status ?? (result.signal ? 1 : 0),
  };
}

const watchEnv = {
  BROWSERSTACK_WATCH_ENDPOINT: "http://localhost:4318",
  BROWSERSTACK_WATCH_FLUSH_TIMEOUT: "500ms",
  BROWSERSTACK_WATCH_REPORTER_PATH: "/dev/null",
};

it("passthrough: forwards stdout and propagates exit code", () => {
  const { stdout, exitCode } = runWatch(["start", "--", "sh", "-c", "printf 'hello world\\n'; exit 7"]);
  expect(stdout).toContain("hello world");
  expect(exitCode).toBe(7);
}, TEST_TIMEOUT);

it("passthrough: does not strip sentinel", () => {
  const sentinel = `BROWSERSTACK_WATCH_FLUSH:{"spans":1,"logs":0,"status":"ok"}`;
  const { stdout } = runWatch(["start", "--", "sh", "-c", `echo '${sentinel}'`]);
  expect(stdout).toContain("BROWSERSTACK_WATCH_FLUSH");
}, TEST_TIMEOUT);

it("instrumented: forwards stdout, strips sentinel, propagates exit code", () => {
  const sentinel = `BROWSERSTACK_WATCH_FLUSH:{"spans":3,"logs":0,"status":"ok"}`;
  const { stdout, exitCode } = runWatch(
    ["start", "--", "sh", "-c", `echo before; echo '${sentinel}'; echo after; exit 5`],
    watchEnv,
  );
  expect(stdout).toContain("before");
  expect(stdout).toContain("after");
  expect(stdout).not.toContain("BROWSERSTACK_WATCH_FLUSH");
  expect(exitCode).toBe(5);
}, TEST_TIMEOUT);

it("instrumented: stdout does not contain stderr output", () => {
  const { stdout } = runWatch(
    ["start", "--", "sh", "-c", "echo stdout-msg; echo stderr-msg >&2"],
    watchEnv,
  );
  expect(stdout).toContain("stdout-msg");
  expect(stdout).not.toContain("stderr-msg");
}, TEST_TIMEOUT);

it("instrumented: exit code propagated after flush timeout (no sentinel)", () => {
  const { exitCode } = runWatch(["start", "--", "sh", "-c", "exit 99"], watchEnv);
  expect(exitCode).toBe(99);
}, TEST_TIMEOUT);
