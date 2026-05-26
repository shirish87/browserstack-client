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

function formatActionHelp(
  productId: string,
  actionId: string,
  summary: string,
  description: string,
  fields: TUIField[]
): string {
  const visible = fields.filter((f) => f.location !== "none");

  const argParts = visible.map((f) =>
    f.required ? `<${f.name}>` : `[${f.name}]`
  );
  const usageLine = `Usage: ${productId} ${actionId}${argParts.length ? " " + argParts.join(" ") : ""}`;

  const lines: string[] = [usageLine];

  const desc = description || summary;
  if (desc) {
    lines.push("", desc);
  }

  if (visible.length > 0) {
    lines.push("", "Arguments:");

    const maxLen = visible.reduce((m, f) => {
      const n = f.name.length + 2; // < > or [ ]
      return n > m ? n : m;
    }, 0);

    for (const f of visible) {
      const placeholder = f.required ? `<${f.name}>` : `[${f.name}]`;
      const padding = " ".repeat(maxLen - placeholder.length + 2);
      let fieldDesc = f.description ?? "";
      if (f.enum && f.enum.length > 0) {
        fieldDesc += fieldDesc ? ` (${f.enum.join("|")})` : `(${f.enum.join("|")})`;
      }
      lines.push(`  ${placeholder}${padding}${fieldDesc}`);
    }
  }

  return lines.join("\n");
}
