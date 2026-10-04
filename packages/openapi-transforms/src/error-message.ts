function firstString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed.length ? trimmed.slice(0, 512) : undefined;
}

export function defaultErrorMessage(body: unknown): string | undefined {
  if (body == null) return undefined;
  if (typeof body === "string") {
    const s = body.trim().toLowerCase();
    if (
      s.startsWith("<html") ||
      s.startsWith("<!doctype html") ||
      s.includes("<head") ||
      s.includes("<body")
    ) {
      return undefined;
    }
    if (s.startsWith("<?xml") || s.startsWith("<error")) return xmlErrorMessage(body);
    return firstString(body);
  }
  if (typeof body !== "object") return undefined;
  const o = body as Record<string, unknown>;
  return (
    firstString(o.error) ??
    firstString(o.message) ??
    firstString(Array.isArray(o.errors) ? (o.errors as unknown[])[0] : undefined) ??
    firstString(o.detail) ??
    firstString(o.description)
  );
}

/** `<Error><Code>…</Code><Message>…</Message></Error>` as returned by S3-backed endpoints. */
function xmlErrorMessage(xml: string): string | undefined {
  const tag = (name: string): string | undefined => firstString(new RegExp(`<${name}>([^<]*)</${name}>`, "i").exec(xml)?.[1]);
  const code = tag("Code");
  const message = tag("Message");
  if (code && message) return `${code}: ${message}`;
  return code ?? message;
}
