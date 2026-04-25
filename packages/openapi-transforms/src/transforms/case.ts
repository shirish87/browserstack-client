// ─── Type-level transforms ────────────────────────────────────────────────────

type CamelKey<S extends string> =
  S extends `${infer H}_${infer T}`
    ? `${H}${Capitalize<CamelKey<T>>}`
    : S;

type SnakeKey<S extends string, Acc extends string = ""> =
  S extends `${infer H}${infer T}`
    ? H extends Uppercase<H> & string
      ? H extends Lowercase<H>
        ? SnakeKey<T, `${Acc}${H}`>
        : SnakeKey<T, `${Acc}_${Lowercase<H>}`>
      : SnakeKey<T, `${Acc}${H}`>
    : Acc;

export type DeepCamelCase<T> =
  T extends Array<infer U>
    ? Array<DeepCamelCase<U>>
    : T extends Record<string, unknown>
      ? { [K in keyof T as CamelKey<K & string>]: DeepCamelCase<T[K]> }
      : T;

export type DeepSnakeCase<T> =
  T extends Array<infer U>
    ? Array<DeepSnakeCase<U>>
    : T extends Record<string, unknown>
      ? { [K in keyof T as SnakeKey<K & string>]: DeepSnakeCase<T[K]> }
      : T;

// ─── Runtime transforms ───────────────────────────────────────────────────────

function snakeKey(key: string, overrides?: Record<string, string>): string {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/([A-Z])/g, (c) => `_${c.toLowerCase()}`);
}

function camelKey(key: string, overrides?: Record<string, string>): string {
  if (overrides && key in overrides) return overrides[key];
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

export function toSnakeCase<T>(value: T, overrides?: Record<string, string>): DeepSnakeCase<T> {
  if (Array.isArray(value)) return value.map((v) => toSnakeCase(v, overrides)) as DeepSnakeCase<T>;
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[snakeKey(k, overrides)] = toSnakeCase(v, overrides);
    }
    return out as DeepSnakeCase<T>;
  }
  return value as DeepSnakeCase<T>;
}

export function toCamelCase<T>(value: T, overrides?: Record<string, string>): DeepCamelCase<T> {
  if (Array.isArray(value)) return value.map((v) => toCamelCase(v, overrides)) as DeepCamelCase<T>;
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[camelKey(k, overrides)] = toCamelCase(v, overrides);
    }
    return out as DeepCamelCase<T>;
  }
  return value as DeepCamelCase<T>;
}

export function camelize(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
