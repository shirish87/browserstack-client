import { z } from "zod";
import type { Outcomes } from "./format";
import type { TestRunNode } from "./schemas";

export const FailureSchema = z.object({ error: z.string().nullish(), backtrace: z.string().nullish() });
export type Failure = z.infer<typeof FailureSchema>;

export type NormStatus = "passed" | "failed" | "skipped" | "pending" | "unknown";

/** Where a test ran: set on the ROOT (one per spec file and platform) and shared by everything under it. */
export interface Platform {
  browser?: string;
  os?: string;
  device?: string;
  file?: string;
}

export interface TestNode {
  id: string;
  name: string;
  /** TRA node type: ROOT, DESCRIBE, TEST or HOOK. */
  type: string;
  status: NormStatus;
  durationMs: number | null;
  startedAt: string | undefined;
  /** Automate / App Automate session this test ran in. Shared by every test in the same file. */
  sessionId: string | undefined;
  isFlaky: boolean;
  isNewFailure: boolean;
  /** Attempts beyond the first. */
  retries: number | null;
  attempts: number;
  failures: Failure[];
  platform: Platform;
  observabilityUrl: string | undefined;
  children: TestNode[];
  /** Roll-up of leaf statuses under this node (a leaf counts itself). */
  counts: Outcomes;
  leafCount: number;
}

/** The statuses TRA reports, folded into the five the UI draws. */
export function normalizeStatus(raw: unknown): NormStatus {
  const s = typeof raw === "string" ? raw.toLowerCase() : "";
  if (s === "passed" || s === "pass" || s === "success") return "passed";
  if (s === "failed" || s === "fail" || s === "error" || s === "timeout") return "failed";
  if (s === "skipped" || s === "skip" || s === "blocked") return "skipped";
  if (s === "pending" || s === "running" || s === "queued" || s === "in progress" || s === "untested" || s === "retest") return "pending";
  return "unknown";
}

const KEYS: readonly (keyof Outcomes)[] = ["passed", "failed", "pending", "skipped", "unknown"];
const emptyCounts = (): Outcomes => ({ passed: 0, failed: 0, pending: 0, skipped: 0, unknown: 0 });

const label = (e: { name?: string | null | undefined; version?: string | null | undefined } | null | undefined): string | undefined =>
  e?.name ? [e.name, e.version].filter(Boolean).join(" ") : undefined;

function platformOf(node: TestRunNode): Platform {
  const d = node.details;
  const p: Platform = {};
  const browser = label(d?.browser);
  const os = label(d?.os);
  if (browser) p.browser = browser;
  if (os) p.os = os;
  if (d?.device) p.device = d.device;
  if (d?.filePath) p.file = d.filePath;
  return p;
}

/** The error of the last attempt that recorded one: first line is the message, the rest the stack. */
function failuresOf(node: TestRunNode): Failure[] {
  const retries = node.details?.retries ?? [];
  for (let i = retries.length - 1; i >= 0; i--) {
    const lines = retries[i]?.logs?.TEST_FAILURE ?? [];
    if (lines.length > 0) return [{ error: lines[0], backtrace: lines.slice(1).join("\n") }];
  }
  return [];
}

export function normalizeHierarchy(nodes: TestRunNode[], parentId = "", inherited: Platform = {}): TestNode[] {
  return nodes.map((node, index) => {
    const id = `${parentId}/${index}`;
    const platform = node.type === "ROOT" ? { ...inherited, ...platformOf(node) } : inherited;
    const children = normalizeHierarchy(node.children ?? [], id, platform);
    const d = node.details;
    const status = normalizeStatus(d?.status);
    const attempts = d?.retries?.length ?? 0;

    const counts = emptyCounts();
    let leafCount = 0;
    if (children.length === 0) {
      counts[status] += 1;
      leafCount = 1;
    } else {
      for (const child of children) {
        leafCount += child.leafCount;
        for (const key of KEYS) counts[key] += child.counts[key];
      }
    }

    return {
      id,
      name: node.displayName ?? "(unnamed)",
      type: node.type ?? "TEST",
      status,
      durationMs: d?.duration ?? null,
      startedAt: d?.startedAt ?? undefined,
      sessionId: d?.sessionId ? d.sessionId : undefined,
      // `isFlaky` is a smart tag (plan-gated, so often null); otherwise a pass after a failed attempt is flaky.
      isFlaky: d?.isFlaky ?? (status === "passed" && attempts > 1),
      isNewFailure: d?.isNewFailure === true,
      retries: attempts > 1 ? attempts - 1 : null,
      attempts,
      failures: failuresOf(node),
      platform,
      observabilityUrl: d?.observabilityUrl ?? undefined,
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
