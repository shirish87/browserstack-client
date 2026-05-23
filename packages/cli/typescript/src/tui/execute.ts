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

function setNested(target: Record<string, unknown>, dottedKey: string, value: unknown) {
  const parts = dottedKey.split(".");
  let cur: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!cur[p] || typeof cur[p] !== "object") cur[p] = {};
    cur = cur[p] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]] = value;
}

function coerceBodyValue(field: TUIField, raw: string): unknown {
  if (field.type === "boolean") return raw === "true";
  if (field.type === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  }
  return raw;
}

function buildArgs(action: TUIAction, values: Record<string, string>): string[] {
  const args: string[] = [action.id];

  // Path then query as positional
  for (const field of action.fields.filter(f => f.location === "path")) {
    const v = values[field.name];
    if (v != null && v !== "") args.push(v);
    else if (field.required) args.push("");
  }
  for (const field of action.fields.filter(f => f.location === "query")) {
    const v = values[field.name];
    if (v != null && v !== "") args.push(v);
    else if (field.required) args.push("");
  }

  // Body: collapse nested-dotted keys into a single JSON object, append as one positional
  const bodyFields = action.fields.filter(f => f.location === "body");
  if (bodyFields.length > 0) {
    const body: Record<string, unknown> = {};
    let hasAny = false;
    for (const field of bodyFields) {
      const v = values[field.name];
      if (v == null || v === "") continue;
      setNested(body, field.name, coerceBodyValue(field, v));
      hasAny = true;
    }
    if (hasAny) {
      args.push(JSON.stringify(body));
    }
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
    return Buffer.concat(this.chunks as unknown as Uint8Array[]).toString("utf8");
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
