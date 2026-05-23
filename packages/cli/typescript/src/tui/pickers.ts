import type { TUIProduct, TUIAction, PickerConfig } from "../tui-types.ts";
import { TUI_MANIFEST } from "../tui-manifest.generated.ts";
import { executeAction } from "./execute.ts";

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

function flatten(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) {
    return json.flatMap(flatten) as Record<string, unknown>[];
  }
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    // Common wrapper: { data: [...] } / { items: [...] } / { results: [...] }
    for (const key of ["data", "items", "results", "automation_builds", "automation_sessions", "projects", "builds", "sessions"]) {
      if (Array.isArray(obj[key])) return flatten(obj[key]);
    }
    // Single object: treat as a one-item list
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
  // Build minimum positional args — for now, only invoke if action has no required path/query params.
  // Many list-* actions are parameterless (list-projects, list-browsers); list-builds takes projectId
  // (handled via filterBy at runtime); list-sessions takes buildId. For those, we can't pre-fetch
  // without a parent value — the runtime should call fetchPickerItemsForAction with the parent value.
  if (action.fields.some(f => f.required && f.location !== "body")) {
    // Defer: the runtime will call fetchPickerItemsForAction with filter values.
    return [];
  }

  const { output, error } = await executeAction(product, action, {});
  if (error) {
    cache.set(picker.source, []);
    return [];
  }
  try {
    const json = JSON.parse(output);
    const rows = flatten(json);
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
  const cacheKey = picker.source + ":" + Object.entries(filterValues).sort().map(([k, v]) => `${k}=${v}`).join("&");
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;
  const { output, error } = await executeAction(product, action, filterValues);
  if (error) {
    cache.set(cacheKey, []);
    return [];
  }
  try {
    const json = JSON.parse(output);
    const rows = flatten(json);
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
