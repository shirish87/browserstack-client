import type { TUIProduct, TUIAction, PickerConfig } from "../tui-types.ts";
import { TUI_MANIFEST } from "../tui-manifest.generated.ts";
import { dispatchPickerAction } from "./picker-dispatch.ts";

export interface PickerItem {
  /** Raw object from the source API. */
  raw: Record<string, unknown>;
  /** Concrete value passed back when selected. */
  value: string;
  /** Display string (used by the search index and shown in the list). */
  label: string;
}

const cache = new Map<string, PickerItem[]>();

function findAction(sourceId: string): { product: TUIProduct; action: TUIAction } | null {
  const dot = sourceId.indexOf(".");
  if (dot < 0) return null;
  const productId = sourceId.slice(0, dot);
  const actionId = sourceId.slice(dot + 1);
  const product = TUI_MANIFEST.find(p => p.id === productId);
  if (!product) return null;
  for (const r of product.resources) {
    const action = r.actions.find(a => a.id === actionId);
    if (action) return { product, action };
  }
  return null;
}

function pickValue(item: Record<string, unknown>, path: string): string {
  // path may be dotted; resolve safely
  let cur: unknown = item;
  for (const seg of path.split(".")) {
    if (cur && typeof cur === "object" && seg in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[seg];
    } else {
      return "";
    }
  }
  if (cur == null) return "";
  return typeof cur === "string" ? cur : JSON.stringify(cur);
}

const LIST_WRAP_KEYS = [
  "data", "items", "results",
  "automation_builds", "automation_sessions", "automate_builds",
  "projects", "builds", "sessions",
  "reports", "scans", "scan_runs", "testCases",
] as const;

export function flatten(json: unknown, itemPath?: string): Record<string, unknown>[] {
  if (Array.isArray(json)) {
    return json.flatMap(el => flatten(el, itemPath)) as Record<string, unknown>[];
  }
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    for (const key of LIST_WRAP_KEYS) {
      if (Array.isArray(obj[key])) return flatten(obj[key], itemPath);
      if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) return flatten(obj[key], itemPath);
    }
    // Per-item envelope unwrap using itemPath hint from PickerConfig
    if (itemPath && obj[itemPath] && typeof obj[itemPath] === "object" && !Array.isArray(obj[itemPath])) {
      return [obj[itemPath] as Record<string, unknown>];
    }
    return [obj];
  }
  return [];
}

/**
 * Fetch picker source items, caching by source action id.
 * Returns empty list on failure (e.g. missing credentials, network error).
 */
export async function fetchPickerItems(picker: PickerConfig): Promise<PickerItem[]> {
  if (cache.has(picker.source)) return cache.get(picker.source)!;

  const found = findAction(picker.source);
  if (!found) {
    cache.set(picker.source, []);
    return [];
  }

  const { product, action } = found;
  // Defer if action has required path/query params — caller must supply filter values.
  if (action.fields.some(f => f.required && f.location !== "body")) {
    return [];
  }

  let output: string;
  try {
    output = await dispatchPickerAction(product.id, action, {});
  } catch {
    cache.set(picker.source, []);
    return [];
  }
  try {
    const json = JSON.parse(output);
    const rows = flatten(json, picker.itemPath);
    const items: PickerItem[] = rows.map(raw => ({
      raw,
      value: pickValue(raw, picker.valueField),
      label: (picker.labelFields ?? [picker.valueField]).map(f => pickValue(raw, f)).filter(Boolean).join(" · "),
    })).filter(it => it.value !== "");
    cache.set(picker.source, items);
    return items;
  } catch {
    cache.set(picker.source, []);
    return [];
  }
}

/**
 * Same as fetchPickerItems but supplies the picker source action with filter values
 * (e.g. fetching list-builds with projectId=X).
 */
export async function fetchPickerItemsForAction(
  picker: PickerConfig,
  filterValues: Record<string, string>,
): Promise<PickerItem[]> {
  const found = findAction(picker.source);
  if (!found) return [];
  const { product, action } = found;
  const cacheKey = picker.source + ":" + Object.entries(filterValues).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("&");
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;
  let output: string;
  try {
    output = await dispatchPickerAction(product.id, action, filterValues);
  } catch {
    cache.set(cacheKey, []);
    return [];
  }
  try {
    const json = JSON.parse(output);
    const rows = flatten(json, picker.itemPath);
    const items: PickerItem[] = rows.map(raw => ({
      raw,
      value: pickValue(raw, picker.valueField),
      label: (picker.labelFields ?? [picker.valueField]).map(f => pickValue(raw, f)).filter(Boolean).join(" · "),
    })).filter(it => it.value !== "");
    cache.set(cacheKey, items);
    return items;
  } catch {
    cache.set(cacheKey, []);
    return [];
  }
}
