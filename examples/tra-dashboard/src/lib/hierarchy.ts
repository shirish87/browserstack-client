import type { HierarchyNode, StatusStats } from "./schemas";

export type NormStatus = "passed" | "failed" | "skipped" | "pending" | "unknown";

export interface TestNode {
  id: string;
  name: string;
  status: NormStatus;
  durationMs: number | null;
  isFlaky: boolean;
  isNewFailure: boolean;
  retries: number | null;
  /** Remaining detail fields, shown verbatim in the drawer. */
  extra: Record<string, unknown>;
  children: TestNode[];
  /** Roll-up of leaf statuses under this node (a leaf counts itself). */
  counts: StatusStats;
  leafCount: number;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const asString = (v: unknown): string | undefined => (typeof v === "string" && v.length > 0 ? v : undefined);
const asNumber = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const asBool = (v: unknown): boolean => v === true || v === 1 || v === "true";

export function normalizeStatus(raw: unknown): NormStatus {
  const s = typeof raw === "string" ? raw.toLowerCase() : "";
  if (s === "passed" || s === "pass" || s === "success") return "passed";
  if (s === "failed" || s === "fail" || s === "error" || s === "timeout") return "failed";
  if (s === "skipped" || s === "skip") return "skipped";
  if (s === "pending" || s === "running" || s === "queued") return "pending";
  return "unknown";
}

const KNOWN_DETAIL_KEYS = new Set([
  "status",
  "result",
  "duration",
  "durationInMs",
  "isFlaky",
  "isNewFailure",
  "retries",
  "name",
]);

function pick(node: HierarchyNode, key: string): unknown {
  const details = isRecord(node.details) ? node.details : undefined;
  return details && key in details ? details[key] : node[key];
}

const STATUS_KEYS: readonly (keyof StatusStats)[] = ["passed", "failed", "pending", "skipped", "unknown"];

const emptyCounts = (): StatusStats => ({ passed: 0, failed: 0, pending: 0, skipped: 0, unknown: 0 });

export function normalizeHierarchy(nodes: HierarchyNode[], parentId = ""): TestNode[] {
  return nodes.map((node, index) => {
    const id = `${parentId}/${index}`;
    const children = normalizeHierarchy(node.children ?? [], id);
    const status = normalizeStatus(pick(node, "status") ?? pick(node, "result"));
    const retriesRaw = pick(node, "retries");
    const retries = Array.isArray(retriesRaw) ? retriesRaw.length : (asNumber(retriesRaw) ?? null);

    const counts = emptyCounts();
    let leafCount = 0;
    if (children.length === 0) {
      counts[status] += 1;
      leafCount = 1;
    } else {
      for (const child of children) {
        leafCount += child.leafCount;
        for (const key of STATUS_KEYS) counts[key] += child.counts[key];
      }
    }

    const extra: Record<string, unknown> = {};
    if (isRecord(node.details)) {
      for (const [k, v] of Object.entries(node.details)) if (!KNOWN_DETAIL_KEYS.has(k)) extra[k] = v;
    }

    return {
      id,
      name: asString(node.name) ?? asString(pick(node, "name")) ?? "(unnamed)",
      status,
      durationMs: asNumber(pick(node, "duration")) ?? asNumber(pick(node, "durationInMs")) ?? null,
      isFlaky: asBool(pick(node, "isFlaky")),
      isNewFailure: asBool(pick(node, "isNewFailure")),
      retries,
      extra,
      children,
      counts,
      leafCount,
    };
  });
}

/** Keeps nodes whose subtree contains a leaf matching the query (case-insensitive). */
export function filterTree(nodes: TestNode[], query: string): TestNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  const out: TestNode[] = [];
  for (const node of nodes) {
    if (node.name.toLowerCase().includes(q)) {
      out.push(node);
      continue;
    }
    const kids = filterTree(node.children, q);
    if (kids.length > 0) out.push({ ...node, children: kids });
  }
  return out;
}
