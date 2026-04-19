function snakeKey(key: string, overrides?: Record<string, string>): string {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
}

function camelKey(key: string, overrides?: Record<string, string>): string {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toSnakeCase(value: unknown, overrides?: Record<string, string>): unknown {
  if (Array.isArray(value)) return value.map((v) => toSnakeCase(v, overrides));
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[snakeKey(k, overrides)] = toSnakeCase(v, overrides);
    }
    return out;
  }
  return value;
}

export function toCamelCase(value: unknown, overrides?: Record<string, string>): unknown {
  if (Array.isArray(value)) return value.map((v) => toCamelCase(v, overrides));
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[camelKey(k, overrides)] = toCamelCase(v, overrides);
    }
    return out;
  }
  return value;
}
