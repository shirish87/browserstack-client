import { z } from "zod";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import type { ParsedArgs } from "./schemas.generated.ts";

function isParsedArgs(obj: unknown): obj is ParsedArgs {
  return typeof obj === "object" && obj !== null && "positional" in obj && Array.isArray((obj as ParsedArgs).positional);
}

function parseRemainingArgs(remainingArgs: string[]): { options: Record<string, unknown>; body: Record<string, unknown> } {
  const options: Record<string, unknown> = {};
  const body: Record<string, unknown> = {};
  for (const arg of remainingArgs) {
    const eq = arg.indexOf("=");
    if (eq > 0) {
      const k = arg.slice(0, eq);
      const v = arg.slice(eq + 1);
      let parsedV: unknown = v;
      if (v === "true") parsedV = true;
      else if (v === "false") parsedV = false;
      options[k] = parsedV;
      body[k] = parsedV;
    } else {
      try {
        const json = JSON.parse(arg);
        if (typeof json === "object" && json !== null) {
          Object.assign(body, json);
        }
      } catch {
        // Not JSON, ignore
      }
    }
  }
  return { options, body };
}

function formatZodIssue(issue: z.ZodIssue, argNames?: string[]): string {
  let label = issue.path.join(".");
  if (issue.path[0] === "positional" && typeof issue.path[1] === "number") {
    const name = argNames?.[issue.path[1]];
    label = name ? `<${name}>` : `argument ${issue.path[1]}`;
  } else if (issue.path[0] === "body") {
    label = issue.path.length > 1 ? `body.${issue.path.slice(1).join(".")}` : "request body";
  } else if (issue.path[0] === "options") {
    label = issue.path.length > 1 ? `--${issue.path.slice(1).join(".")}` : "options";
  }

  let message = issue.message;
  if (message === "Required" ||
      message.toLowerCase().includes("expected string, received undefined") ||
      message.toLowerCase().includes("expected number, received undefined") ||
      message.toLowerCase().includes("expected boolean, received undefined")) {
    message = "is required";
  }
  return `${label}: ${message}`;
}

/**
 * Parses raw CLI arguments into a structured object matching the generated Zod schema.
 */
export function parseArgs<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  args: string[],
  argNames?: string[]
): ParsedArgs {
  const positionalSchema = schema.shape.positional as z.ZodTuple<any>;
  const positionalCount = positionalSchema._def.items.length;

  const positionalArgs = args.slice(0, positionalCount);
  const remainingArgs = args.slice(positionalCount);

  const { options, body } = parseRemainingArgs(remainingArgs);
  const data: Record<string, unknown> = { positional: positionalArgs };

  if (schema.shape.options) {
    data.options = options;
  }
  if (schema.shape.body) {
    data.body = body;
    if (!(schema.shape.body instanceof z.ZodObject)) {
      try {
        data.body = JSON.parse(remainingArgs[0]);
      } catch {
        // ignore
      }
    }
  }

  try {
    const result: unknown = schema.parse(data);
    if (!isParsedArgs(result)) {
      throw new BrowserStackError("Parsed arguments missing required 'positional' field");
    }
    return result;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issues = err.issues.map(i => formatZodIssue(i, argNames)).join("\n");
      throw new BrowserStackError(`Argument validation failed:\n${issues}`);
    }
    throw err;
  }
}
