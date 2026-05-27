export interface OtelConfig {
  enabled: boolean;
  endpoint: string;
  batchSize: number;
  batchTimeoutMs: number;
  exportTimeoutMs: number;
  attachmentThresholdBytes: number;
}

export function parseBytes(s: string): number {
  const mb = s.match(/^(\d+(?:\.\d+)?)\s*MB$/i);
  if (mb) return Math.floor(parseFloat(mb[1]) * 1024 * 1024);
  const kb = s.match(/^(\d+(?:\.\d+)?)\s*KB$/i);
  if (kb) return Math.floor(parseFloat(kb[1]) * 1024);
  const bytes = s.match(/^(\d+)$/);
  if (bytes) return parseInt(bytes[1], 10);
  throw new Error(`Cannot parse byte size: "${s}"`);
}

function parseDurationMs(s: string): number {
  const sec = s.match(/^(\d+(?:\.\d+)?)s$/);
  if (sec) return Math.floor(parseFloat(sec[1]) * 1000);
  const ms = s.match(/^(\d+)ms$/);
  if (ms) return parseInt(ms[1], 10);
  const plain = s.match(/^(\d+)$/);
  if (plain) return parseInt(plain[1], 10);
  throw new Error(`Cannot parse duration: "${s}"`);
}

export function readConfig(): OtelConfig {
  const endpoint =
    process.env.BROWSERSTACK_WATCH_ENDPOINT ??
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    "";
  return {
    endpoint,
    enabled: endpoint !== "",
    batchSize: process.env.BROWSERSTACK_WATCH_BATCH_SIZE
      ? parseInt(process.env.BROWSERSTACK_WATCH_BATCH_SIZE, 10)
      : 512,
    batchTimeoutMs: process.env.BROWSERSTACK_WATCH_BATCH_TIMEOUT
      ? parseDurationMs(process.env.BROWSERSTACK_WATCH_BATCH_TIMEOUT)
      : 5000,
    exportTimeoutMs: process.env.BROWSERSTACK_WATCH_EXPORT_TIMEOUT
      ? parseDurationMs(process.env.BROWSERSTACK_WATCH_EXPORT_TIMEOUT)
      : 10000,
    attachmentThresholdBytes: process.env.BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD
      ? parseBytes(process.env.BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD)
      : 5 * 1024 * 1024,
  };
}
