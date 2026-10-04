import { z } from "zod";

/** zod 4's `unwrap()` and `options` hand back the core type, so accept that rather than the classic `ZodType`. */
type AnySchema = z.core.$ZodType;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Keys present in `data` that `schema` does not model, as JSONPath-ish strings.
 *
 * The generated models are deliberately lenient (loose objects keep unknown fields), so a successful
 * parse says nothing about *new* fields. This walks the data alongside the schema to find them, which is
 * how contract tests notice that the API has started returning something the spec doesn't describe.
 */
export function unmodelledKeys(schema: AnySchema, data: unknown, path = "$"): string[] {
  if (data === null || data === undefined) return [];

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) return unmodelledKeys(schema.unwrap(), data, path);
  if (schema instanceof z.ZodLazy) return unmodelledKeys(schema.unwrap(), data, path);

  if (schema instanceof z.ZodArray) {
    return Array.isArray(data) ? data.flatMap((item, i) => unmodelledKeys(schema.element, item, `${path}[${i}]`)) : [];
  }

  if (schema instanceof z.ZodRecord) {
    return isRecord(data) ? Object.entries(data).flatMap(([k, v]) => unmodelledKeys(schema.valueType, v, `${path}.${k}`)) : [];
  }

  if (schema instanceof z.ZodUnion) {
    const match = schema.options.find((option) => z.safeParse(option, data).success);
    return match ? unmodelledKeys(match, data, path) : [];
  }

  if (schema instanceof z.ZodIntersection) {
    // A path is unmodelled only if neither side models it. A side that doesn't know a parent key reports the
    // parent (not its children), so a child counts as unknown to that side when any ancestor path is reported.
    const left = unmodelledKeys(schema.def.left, data, path);
    const right = unmodelledKeys(schema.def.right, data, path);
    const unknownTo = (found: string[], p: string): boolean => found.some((f) => f === p || p.startsWith(`${f}.`) || p.startsWith(`${f}[`));
    return [...new Set([...left, ...right])].filter((p) => unknownTo(left, p) && unknownTo(right, p));
  }

  if (schema instanceof z.ZodObject) {
    if (!isRecord(data)) return [];
    const shape = schema.shape;
    return Object.entries(data).flatMap(([key, value]) => {
      const child = shape[key];
      return child ? unmodelledKeys(child, value, `${path}.${key}`) : [`${path}.${key}`];
    });
  }

  return [];
}
