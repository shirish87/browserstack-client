import { Writable } from "node:stream";
import type { TUIProduct, TUIAction, TUIField } from "../tui-types.ts";

import { main as runLocal } from "../browserstack-local.ts";
import { main as runAppAutomate } from "../browserstack-app-automate.ts";
import { main as runAutomate } from "../browserstack-automate.ts";
import { main as runLocalTesting } from "../browserstack-local-testing.ts";
import { main as runTestManagement } from "../browserstack-test-management.ts";
import { main as runAccessibility } from "../browserstack-accessibility.ts";
import { main as runTestReporting } from "../browserstack-test-reporting.ts";
import { main as runScreenshots } from "../browserstack-screenshots.ts";

type Runner = (args: string[], logger: Console) => Promise<void>;

const runners: Record<string, Runner> = {
  "automate": runAutomate,
  "app-automate": runAppAutomate,
  "screenshots": runScreenshots,
  "local-testing": runLocalTesting,
  "test-management": runTestManagement,
  "test-reporting": runTestReporting,
  "accessibility": runAccessibility,
  "local": runLocal,
};

function buildArgs(action: TUIAction, values: Record<string, string>): string[] {
  const args: string[] = [action.id];

  const ordered: TUIField[] = [
    ...action.fields.filter(f => f.location === "path"),
    ...action.fields.filter(f => f.location === "query"),
    ...action.fields.filter(f => f.location === "body"),
  ];

  for (const field of ordered) {
    const v = values[field.name];
    if (v == null || v === "") {
      if (field.required) {
        args.push("");
      }
      continue;
    }
    args.push(v);
  }
  return args;
}

class BufferStream extends Writable {
  chunks: Buffer[] = [];
  override _write(chunk: Buffer | string, _enc: string, cb: (err?: Error | null) => void): void {
    this.chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    cb();
  }
  toString(): string {
    return Buffer.concat(this.chunks).toString("utf8");
  }
}

export async function executeAction(
  product: TUIProduct,
  action: TUIAction,
  values: Record<string, string>,
): Promise<{ output: string; error: string | null }> {
  const runner = runners[product.id];
  if (!runner) {
    return { output: "", error: `Unknown product: ${product.id}` };
  }

  const buf = new BufferStream();
  const logger: Console = {
    ...console,
    log: (...a: unknown[]) => buf.write(a.map(String).join(" ") + "\n"),
    info: (...a: unknown[]) => buf.write(a.map(String).join(" ") + "\n"),
    warn: (...a: unknown[]) => buf.write(a.map(String).join(" ") + "\n"),
    error: (...a: unknown[]) => buf.write(a.map(String).join(" ") + "\n"),
  } as unknown as Console;

  const args = buildArgs(action, values);

  const originalExit = process.exit;
  let exitCode: number | null = null;
  (process as { exit: (code?: number) => never }).exit = ((code?: number) => {
    exitCode = code ?? 0;
    throw new Error("__TUI_EXIT__");
  }) as never;

  try {
    await runner(args, logger);
    return { output: buf.toString(), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === "__TUI_EXIT__" && exitCode === 0) {
      return { output: buf.toString(), error: null };
    }
    const output = buf.toString();
    return { output, error: message === "__TUI_EXIT__" ? output || "Command failed" : message };
  } finally {
    process.exit = originalExit;
  }
}
