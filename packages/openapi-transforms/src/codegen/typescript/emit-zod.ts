import { camelize } from "../../transforms/case";

/** The subset of OpenAPI 3.0 schema keywords the zod emitter understands. */
export interface ZodSchemaObject {
  $ref?: string;
  type?: string;
  nullable?: boolean;
  enum?: unknown[];
  description?: string;
  properties?: Record<string, ZodSchemaObject>;
  required?: string[];
  items?: ZodSchemaObject;
  additionalProperties?: boolean | ZodSchemaObject;
  allOf?: ZodSchemaObject[];
  oneOf?: ZodSchemaObject[];
  anyOf?: ZodSchemaObject[];
}

export interface EmitZodModuleInput {
  /** `components.schemas` of the (shared-merged) spec. */
  schemas: Record<string, ZodSchemaObject>;
  /** When set, only these schemas and everything they reference are emitted. */
  roots?: string[];
}

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const SCHEMA_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

const refName = (ref: string): string => ref.slice(ref.lastIndexOf("/") + 1);

/** Whether any $ref appears anywhere under this schema. */
function containsRef(s: ZodSchemaObject | undefined): boolean {
  if (!s) return false;
  if (s.$ref) return true;
  if (containsRef(s.items)) return true;
  if (typeof s.additionalProperties === "object" && containsRef(s.additionalProperties)) return true;
  for (const m of [...(s.allOf ?? []), ...(s.oneOf ?? []), ...(s.anyOf ?? [])]) if (containsRef(m)) return true;
  return Object.values(s.properties ?? {}).some(containsRef);
}

/** $refs that are evaluated eagerly (everything except property values, which are emitted as lazy getters). */
function eagerRefs(s: ZodSchemaObject | undefined, out = new Set<string>()): Set<string> {
  if (!s) return out;
  if (s.$ref) out.add(refName(s.$ref));
  eagerRefs(s.items, out);
  if (typeof s.additionalProperties === "object") eagerRefs(s.additionalProperties, out);
  for (const m of [...(s.allOf ?? []), ...(s.oneOf ?? []), ...(s.anyOf ?? [])]) eagerRefs(m, out);
  return out;
}

/** Every schema name reachable from `roots` through $refs. */
function closure(schemas: Record<string, ZodSchemaObject>, roots: string[]): Set<string> {
  const seen = new Set<string>();
  const walk = (s: ZodSchemaObject | undefined): void => {
    if (!s) return;
    if (s.$ref) visit(refName(s.$ref));
    walk(s.items);
    if (typeof s.additionalProperties === "object") walk(s.additionalProperties);
    for (const m of [...(s.allOf ?? []), ...(s.oneOf ?? []), ...(s.anyOf ?? [])]) walk(m);
    Object.values(s.properties ?? {}).forEach(walk);
  };
  const visit = (n: string): void => {
    if (seen.has(n) || !(n in schemas)) return;
    seen.add(n);
    walk(schemas[n]);
  };
  roots.forEach(visit);
  return seen;
}

export function emitZodModule({ schemas, roots }: EmitZodModuleInput): string {
  const wanted = roots ? closure(schemas, roots) : undefined;
  const names = Object.keys(schemas).filter((n) => SCHEMA_NAME.test(n) && (!wanted || wanted.has(n)));
  const known = new Set(names);

  const expr = (s: ZodSchemaObject | undefined, indent: string): string => {
    if (!s) return "z.unknown()";
    if (s.$ref) {
      const n = refName(s.$ref);
      return known.has(n) ? `${n}Schema` : "z.unknown()";
    }
    if (s.allOf?.length) return s.allOf.map((m) => expr(m, indent)).reduce((a, b) => `${a}.and(${b})`);
    const union = s.oneOf ?? s.anyOf;
    if (union?.length) return union.length === 1 ? expr(union[0], indent) : `z.union([${union.map((m) => expr(m, indent)).join(", ")}])`;
    if (s.enum?.length && s.type !== "object" && s.type !== "array") return "z.string()";
    switch (s.type) {
      case "string":
        return "z.string()";
      case "integer":
      case "number":
        return "z.number()";
      case "boolean":
        return "z.boolean()";
      case "array":
        return `z.array(${expr(s.items, indent)})`;
      case "object":
      case undefined:
        return objectExpr(s, indent);
      default:
        return "z.unknown()";
    }
  };

  const objectExpr = (s: ZodSchemaObject, indent: string): string => {
    const props = Object.entries(s.properties ?? {});
    if (props.length === 0) {
      if (s.type === undefined && !s.additionalProperties) return "z.unknown()";
      const value = typeof s.additionalProperties === "object" ? expr(s.additionalProperties, indent) : "z.unknown()";
      return `z.record(z.string(), ${value})`;
    }
    const required = new Set(s.required ?? []);
    const inner = `${indent}  `;
    const lines = props.map(([rawKey, prop]) => {
      const key = camelize(rawKey);
      const keyCode = IDENT.test(key) ? key : JSON.stringify(key);
      let value = expr(prop, inner);
      const isRequired = required.has(rawKey);
      if (!isRequired) value += ".nullish()";
      else if (prop.nullable) value += ".nullable()";
      const doc = propertyDoc(prop);
      const body = containsRef(prop) ? `get ${keyCode}() { return ${value}; },` : `${keyCode}: ${value},`;
      return `${doc ? `${inner}${doc}\n` : ""}${inner}${body}`;
    });
    const base = `z.looseObject({\n${lines.join("\n")}\n${indent}})`;
    return typeof s.additionalProperties === "object" ? `${base}.catchall(${expr(s.additionalProperties, indent)})` : base;
  };

  // Aliases must be declared after what they eagerly reference; property references are lazy.
  const ordered: string[] = [];
  const state = new Map<string, "visiting" | "done">();
  const visit = (n: string): void => {
    if (state.has(n)) return;
    state.set(n, "visiting");
    for (const dep of eagerRefs(schemas[n])) if (known.has(dep) && dep !== n) visit(dep);
    state.set(n, "done");
    ordered.push(n);
  };
  names.forEach(visit);

  const body = ordered
    .map((n) => `export const ${n}Schema = ${expr(schemas[n], "")};\nexport type ${n} = z.infer<typeof ${n}Schema>;`)
    .join("\n\n");

  return [
    "// GENERATED by @dot-slash/browserstack-openapi-transforms (emit-zod). DO NOT EDIT.",
    "// Zod models for the API's data shapes, with the same camelCase keys the clients return.",
    "// Objects are loose (unknown fields are preserved) and enums are open (documented, not enforced).",
    'import { z } from "zod";',
    "",
    body,
    "",
  ].join("\n");
}

function propertyDoc(prop: ZodSchemaObject): string | undefined {
  const parts: string[] = [];
  if (prop.description) parts.push(prop.description.replace(/\s+/g, " ").replace(/\*\//g, "*\\/").trim());
  if (prop.enum?.length && prop.type !== "object" && prop.type !== "array") parts.push(`Known values: ${prop.enum.join(", ")}`);
  return parts.length ? `/** ${parts.join(" ")} */` : undefined;
}
