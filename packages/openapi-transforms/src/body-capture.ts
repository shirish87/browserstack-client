import type { ErrorBody } from "./errors.js";

export async function captureErrorBody(
  response: Response,
  maxBytes: number,
): Promise<ErrorBody<unknown>> {
  const contentType = response.headers.get("content-type") ?? undefined;
  if (!response.body) return { contentType };

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let truncated = false;

  while (received < maxBytes) {
    const { value, done } = await reader.read();
    if (done) break;
    if (received + value.length > maxBytes) {
      chunks.push(value.subarray(0, maxBytes - received));
      received = maxBytes;
      truncated = true;
      try { await reader.cancel(); } catch { /* ignore */ }
      break;
    }
    chunks.push(value);
    received += value.length;
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) { merged.set(c, offset); offset += c.length; }
  const text = new TextDecoder().decode(merged);

  const out: ErrorBody<unknown> = { contentType, text, truncated };
  if (contentType?.includes("application/json")) {
    try { out.parsed = JSON.parse(text); } catch { /* ignore */ }
  }
  return out;
}
