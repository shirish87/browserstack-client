import { shutdownSDK, isSDKActive } from "./sdk.js";

export interface FlushResult {
  spans: number;
  logs: number;
  status: "ok" | "error";
  reason?: string;
}

export function buildFlushSentinel(result: FlushResult): string {
  const payload: Record<string, unknown> = {
    spans: result.spans,
    logs: result.logs,
    status: result.status,
  };
  if (result.reason !== undefined) payload.reason = result.reason;
  return `BROWSERSTACK_WATCH_FLUSH:${JSON.stringify(payload)}`;
}

let _spanCount = 0;
let _logCount = 0;

export function incrementSpanCount(): void {
  _spanCount++;
}

export function incrementLogCount(): void {
  _logCount++;
}

export async function flush(): Promise<void> {
  if (!isSDKActive()) return; // no endpoint configured — nothing to flush
  try {
    await shutdownSDK();
    process.stdout.write(
      buildFlushSentinel({ spans: _spanCount, logs: _logCount, status: "ok" }) + "\n",
    );
  } catch (err) {
    process.stdout.write(
      buildFlushSentinel({
        spans: _spanCount,
        logs: _logCount,
        status: "error",
        reason: err instanceof Error ? err.message : String(err),
      }) + "\n",
    );
  }
}
