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
