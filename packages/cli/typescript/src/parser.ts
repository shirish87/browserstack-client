import { z } from "zod";
import { BrowserStackError } from "@dot-slash/browserstack-core";

/**
 * Parses raw CLI arguments into a structured object matching the generated Zod schema.
 */
export function parseArgs(schema: z.ZodObject<any>, args: string[], argNames?: string[]): any {
  const positionalSchema = schema.shape.positional as z.ZodTuple<any>;
  const positionalCount = positionalSchema._def.items.length;
  
  const positionalArgs = args.slice(0, positionalCount);
  const remainingArgs = args.slice(positionalCount);

  const data: any = {
    positional: positionalArgs,
  };

  const options: Record<string, any> = {};
  const body: Record<string, any> = {};

  for (const arg of remainingArgs) {
    const eq = arg.indexOf("=");
    if (eq > 0) {
      const k = arg.slice(0, eq);
      const v = arg.slice(eq + 1);
      
      // If it looks like a number, try to parse it (Zod coerce will also do this, but for nested objects it helps)
      let parsedV: any = v;
      if (v === "true") parsedV = true;
      else if (v === "false") parsedV = false;
      
      options[k] = parsedV;
      body[k] = parsedV;
    } else {
      // Try parsing as JSON for body
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

  if (schema.shape.options) {
    data.options = options;
  }
  if (schema.shape.body) {
    data.body = body;
    // If body is not an object schema, maybe it's the whole JSON string
    if (!(schema.shape.body instanceof z.ZodObject)) {
        try {
            data.body = JSON.parse(remainingArgs[0]);
        } catch {
            // ignore
        }
    }
  }

  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issues = err.issues.map(i => {
        let label = i.path.join(".");
        if (i.path[0] === "positional" && typeof i.path[1] === "number") {
          const name = argNames?.[i.path[1]];
          label = name ? `<${name}>` : `argument ${i.path[1]}`;
        } else if (i.path[0] === "body") {
          label = i.path.length > 1 ? `body.${i.path.slice(1).join(".")}` : "request body";
        } else if (i.path[0] === "options") {
          label = i.path.length > 1 ? `--${i.path.slice(1).join(".")}` : "options";
        }

        let message = i.message;
        if (message === "Required" || 
            message.toLowerCase().includes("expected string, received undefined") ||
            message.toLowerCase().includes("expected number, received undefined") ||
            message.toLowerCase().includes("expected boolean, received undefined")) {
          message = "is required";
        }

        return `${label}: ${message}`;
      }).join("\n");
      throw new BrowserStackError(`Argument validation failed:\n${issues}`);
    }
    throw err;
  }
}
