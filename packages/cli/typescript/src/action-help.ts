import { TUI_MANIFEST } from "./tui-manifest.generated.ts";
import type { TUIField } from "./tui-types.js";

export function actionHelp(productId: string, actionId: string): string {
  for (const prod of TUI_MANIFEST) {
    if (prod.id !== productId) continue;
    for (const res of prod.resources) {
      for (const act of res.actions) {
        if (act.id !== actionId) continue;
        return formatActionHelp(productId, act.id, act.summary, act.description, act.fields);
      }
    }
  }
  return "";
}

function fieldSampleValue(f: TUIField): unknown {
  if (f.itemSample) {
    try {
      return [JSON.parse(f.itemSample)];
    } catch { /* fall through */ }
  }
  if (f.enum && f.enum.length > 0) return f.enum[0];
  switch (f.type) {
    case "number": return 0;
    case "boolean": return true;
    default: {
      const leaf = f.name.split(".").pop()!;
      return `<${leaf}>`;
    }
  }
}

function buildBodySample(fields: TUIField[]): Record<string, unknown> | null {
  const root: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "file") continue;
    const val = fieldSampleValue(f);
    const parts = f.name.split(".");
    let cur = root;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in cur)) cur[parts[i]] = {};
      cur = cur[parts[i]] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = val;
  }
  return Object.keys(root).length > 0 ? root : null;
}

function formatActionHelp(
  productId: string,
  actionId: string,
  summary: string,
  description: string,
  fields: TUIField[]
): string {
  const pathQuery = fields.filter((f) => f.location === "path" || f.location === "query");
  const body = fields.filter((f) => f.location === "body" && f.type !== "file");

  const argParts = pathQuery.map((f) => f.required ? `<${f.name}>` : `[${f.name}]`);
  const bodyToken = body.length > 0 ? " [body]" : "";
  const usageLine = `Usage: ${productId} ${actionId}${argParts.length ? " " + argParts.join(" ") : ""}${bodyToken}`;

  const lines: string[] = [usageLine];

  const desc = description || summary;
  if (desc) {
    lines.push("", desc);
  }

  if (pathQuery.length > 0) {
    lines.push("", "Arguments:");
    const maxLen = pathQuery.reduce((m, f) => Math.max(m, f.name.length + 2), 0);
    for (const f of pathQuery) {
      const placeholder = f.required ? `<${f.name}>` : `[${f.name}]`;
      const padding = " ".repeat(maxLen - placeholder.length + 2);
      let fieldDesc = f.description ?? "";
      if (f.enum && f.enum.length > 0) {
        fieldDesc += fieldDesc ? ` (${f.enum.join("|")})` : `(${f.enum.join("|")})`;
      }
      lines.push(`  ${placeholder}${padding}${fieldDesc}`);
    }
  }

  if (body.length > 0) {
    const sample = buildBodySample(body);
    if (sample) {
      lines.push("", "Body (JSON):");
      lines.push(JSON.stringify(sample, null, 2));
    }
  }

  return lines.join("\n");
}
