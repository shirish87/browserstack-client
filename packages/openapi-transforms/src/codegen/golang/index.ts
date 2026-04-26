import yaml from "yaml";
import fs from "node:fs/promises";
import { emitGoFile } from "./emit-file";
import { emitGoMethod, type GoMethodInput } from "./emit-method";
import { emitGoTypes } from "./emit-types";
import { toPascalCase } from "./case";
import { stripOperationPrefix } from "../shared/operation";

export interface GenerateGoModuleOptions {
  specPath: string;
  product: string;
  modulePath?: string;
}

interface SpecParam {
  name: string;
  in: string;
  schema?: { type?: string };
  $ref?: string;
}

interface SpecResponseSchema {
  $ref?: string;
  type?: string;
  title?: string;
  properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string } }>;
  required?: string[];
  oneOf?: unknown[];
  anyOf?: unknown[];
  items?: SpecResponseSchema;
}

interface SpecOp {
  operationId?: string;
  parameters?: Array<SpecParam>;
  requestBody?: { content?: Record<string, { schema?: SpecResponseSchema }> };
  responses?: Record<string, { content?: Record<string, { schema?: SpecResponseSchema }> }>;
  "x-response-transform"?: { codec: string; config?: unknown } | string;
  "x-request-transform"?: { codec: string; config?: unknown } | string;
  "x-response-custom"?: boolean;
  "x-request-custom"?: boolean;
  [key: string]: unknown;
}

interface SpecDoc {
  paths?: Record<string, Record<string, SpecOp | undefined>>;
  components?: {
    parameters?: Record<string, SpecParam>;
    schemas?: Record<string, unknown>;
  };
}

function resolveResponseCodec(op: SpecOp): string {
  const rt = op["x-response-transform"];
  if (!rt) return "json";
  if (typeof rt === "string") return rt;
  return rt.codec;
}

function resolveRequestCodec(op: SpecOp): string {
  const rt = op["x-request-transform"];
  if (!rt) return "json";
  if (typeof rt === "string") return rt;
  return rt.codec;
}

function resolveJsonComposeResultName(operationId: string): string {
  return toPascalCase(operationId) + "Result";
}

function buildJsonComposeSchema(
  op: SpecOp,
  operationId: string
): { name: string; schema: InlineSchemas[string] } | undefined {
  const rt = op["x-response-transform"];
  if (!rt || typeof rt === "string" || rt.codec !== "json-compose") return undefined;
  const cfg = rt.config as { base?: string; merge?: Record<string, string> } | undefined;
  if (!cfg?.base) return undefined;

  // Resolve base: e.g. "$.build.automation_build" → find the $ref at that path in the response schema
  const rawSchema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  if (!rawSchema) return undefined;

  // Walk the base path segments (skip leading "$.")
  const baseSegments = cfg.base.replace(/^\$\./, "").split(".");
  let node: SpecResponseSchema | undefined = rawSchema;
  for (const seg of baseSegments) {
    node = (node?.properties as Record<string, SpecResponseSchema> | undefined)?.[seg];
    if (!node) return undefined;
  }
  const baseRef = node?.$ref?.replace(/^.*\//, "");
  if (!baseRef) return undefined;
  const baseGoName = toPascalCase(baseRef);

  // Build properties for result struct: embed base type + merge fields
  const props: InlineSchemas[string]["properties"] = {};
  const required: string[] = [];

  // For each merge entry, resolve the element type
  for (const [field, path] of Object.entries(cfg.merge ?? {})) {
    // e.g. "$.build.sessions[*].automation_session"
    // split on "." then handle [*] segments
    const parts = path.replace(/^\$\./, "").split(".");
    let mergeNode: SpecResponseSchema | undefined = rawSchema;
    let reachedWildcard = false;
    for (const part of parts) {
      if (part === "[*]") { reachedWildcard = true; break; }
      const cleanPart = part.replace(/\[\*\]$/, "");
      const isWildcard = part.endsWith("[*]");
      mergeNode = (mergeNode?.properties as Record<string, SpecResponseSchema> | undefined)?.[cleanPart];
      if (!mergeNode) break;
      if (isWildcard) { reachedWildcard = true; break; }
    }
    // After wildcard, remaining parts walk into items.properties to find the element $ref
    let itemRef: string | undefined;
    if (reachedWildcard && mergeNode) {
      // Find index of the wildcard part
      const wildcardIdx = parts.findIndex((p) => p === "[*]" || p.endsWith("[*]"));
      const remaining = parts.slice(wildcardIdx + 1);
      // Start from items of the array schema
      let itemNode: SpecResponseSchema | undefined = mergeNode.items;
      for (const part of remaining) {
        itemNode = (itemNode?.properties as Record<string, SpecResponseSchema> | undefined)?.[part];
        if (!itemNode) break;
      }
      if (itemNode?.$ref) {
        itemRef = itemNode.$ref.replace(/^.*\//, "");
      } else if (!remaining.length && mergeNode.items?.$ref) {
        itemRef = mergeNode.items.$ref.replace(/^.*\//, "");
      }
    } else if (mergeNode?.items?.$ref) {
      itemRef = mergeNode.items.$ref.replace(/^.*\//, "");
    }
    if (itemRef) {
      props[field] = { type: "array", items: { $ref: `#/components/schemas/${itemRef}` } };
      required.push(field);
    }
  }

  const name = resolveJsonComposeResultName(operationId);
  return {
    name,
    schema: {
      type: "object",
      properties: props,
      required,
      _baseEmbed: baseGoName,
    },
  };
}

function responseType(op: SpecOp, operationId: string, knownSchemas: Set<string>): string {
  const responseCodec = resolveResponseCodec(op);
  if (responseCodec === "text") return "string";
  if (responseCodec === "binary") return "[]byte";

  if (responseCodec === "json-compose") {
    const resultName = resolveJsonComposeResultName(operationId);
    return knownSchemas.has(resultName) ? resultName : "map[string]any";
  }

  const schema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  if (!schema) return "map[string]any";

  if (schema.type === "array" && schema.items) {
    if (schema.title) {
      const name = toPascalCase(schema.title);
      return knownSchemas.has(name) ? name : "map[string]any";
    }
    
    let elemType = "any";
    if (schema.items.$ref) {
      const name = toPascalCase(schema.items.$ref.replace(/^.*\//, ""));
      elemType = knownSchemas.has(name) ? name : "map[string]any";
    } else if (schema.items.type === "object" || schema.items.properties) {
      const defaultName = toPascalCase(operationId) + "Response";
      const name = toPascalCase(schema.items.title ?? (defaultName + "Item"));
      elemType = knownSchemas.has(name) ? name : "map[string]any";
    } else {
      elemType = schema.items.type === "string" ? "string"
        : schema.items.type === "integer" ? "int"
        : schema.items.type === "number" ? "float64"
        : schema.items.type === "boolean" ? "bool"
        : "any";
    }
    return "[]" + elemType;
  }

  if (schema.$ref) {
    const refName = schema.$ref.replace(/^.*\//, "");
    const goName = toPascalCase(refName);
    return knownSchemas.has(goName) ? goName : "map[string]any";
  }

  if (schema.type === "object" || schema.properties) {
    const name = toPascalCase(schema.title ?? (toPascalCase(operationId) + "Response"));
    return knownSchemas.has(name) ? name : "map[string]any";
  }
  return "map[string]any";
}

type InlineSchemas = Record<string, { type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string; $ref?: string } }>; required?: string[]; items?: { type?: string; $ref?: string; title?: string; properties?: Record<string, { type?: string; $ref?: string }>; required?: string[] }; _baseEmbed?: string }>;

function collectInlineSchemas(
  paths: Record<string, Record<string, SpecOp | undefined>>
): InlineSchemas {
  const extra: InlineSchemas = {};
  for (const pathItem of Object.values(paths)) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const op = pathItem[method];
      if (!op?.operationId) continue;
      if (op["x-response-custom"] || op["x-request-custom"]) continue;

      const responseCodec = resolveResponseCodec(op);

      if (responseCodec === "json-compose") {
        const composed = buildJsonComposeSchema(op, op.operationId);
        if (composed) extra[composed.name] = composed.schema;
      }

      if (responseCodec !== "text" && responseCodec !== "binary") {
        const respSchema = op.responses?.["200"]?.content?.["application/json"]?.schema;
        if (respSchema && !respSchema.$ref) {
          if (respSchema.type === "object" || respSchema.properties) {
            const name = toPascalCase(respSchema.title ?? (toPascalCase(op.operationId) + "Response"));
            extra[name] = { type: "object", properties: respSchema.properties, required: respSchema.required };
          } else if (respSchema.type === "array") {
            const name = toPascalCase(respSchema.title ?? (toPascalCase(op.operationId) + "Response"));
            if (respSchema.title) {
              extra[name] = { type: "array", items: respSchema.items };
            }
            if (respSchema.items && !respSchema.items.$ref && (respSchema.items.type === "object" || respSchema.items.properties)) {
              const itemName = toPascalCase(respSchema.items.title ?? (name + "Item"));
              extra[itemName] = { type: "object", properties: respSchema.items.properties, required: respSchema.items.required };
            }
          }
        }
      }

      const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
      if (bodySchema && !bodySchema.$ref) {
        const name = toPascalCase(bodySchema.title ?? (toPascalCase(op.operationId) + "Request"));
        extra[name] = { type: "object", properties: bodySchema.properties, required: bodySchema.required };
      }
    }
  }
  return extra;
}

export async function generateGoModule(
  opts: GenerateGoModuleOptions
): Promise<{ typesGo: string; clientGo: string }> {
  const modulePath =
    opts.modulePath ?? "github.com/browserstack/browserstack-client";
  const raw = await fs.readFile(opts.specPath, "utf8");
  const doc = yaml.parse(raw) as SpecDoc;

  const className = toPascalCase(opts.product) + "Client";
  const componentSchemas = (doc.components?.schemas ?? {}) as Record<
    string,
    { type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string } }>; required?: string[]; allOf?: Array<{ $ref?: string; type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string } }>; required?: string[] }>; items?: { type?: string; $ref?: string } }
  >;
  const inlineSchemas = collectInlineSchemas(doc.paths ?? {});
  const schemas = { ...componentSchemas, ...inlineSchemas };
  const allKnownSchemas = new Set(Object.keys(schemas).map(toPascalCase));

  const methods: string[] = [];

  for (const [path, pathItem] of Object.entries(doc.paths ?? {})) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const op = pathItem[method];
      if (!op?.operationId) continue;
      if (op["x-response-custom"] || op["x-request-custom"]) continue;

      const resolvedParams = (op.parameters ?? []).map((p) => {
        if (p.$ref) {
          const refName = p.$ref.replace("#/components/parameters/", "");
          return doc.components?.parameters?.[refName] ?? p;
        }
        return p;
      });

      const pathParams = resolvedParams
        .filter((p) => p.in === "path")
        .map((p) => ({
          name: p.name,
          goType: "string", // Always treat URL parameters as strings in Go
        }));

      const queryParams = resolvedParams
        .filter((p) => p.in === "query")
        .map((p) => ({
          name: p.name.replace(/\[\]$/, ""),
          goType: "string", // Always treat URL parameters as strings in Go
        }));

      const requestCodec = resolveRequestCodec(op);
      const respType = responseType(op, op.operationId, allKnownSchemas);
      const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
      const requestBodyType = op.requestBody
        ? bodySchema?.$ref
          ? (() => { const n = toPascalCase(bodySchema.$ref.replace(/^.*\//, "")); return allKnownSchemas.has(n) ? n : undefined; })()
          : toPascalCase(op.operationId) + "Request"
        : undefined;

      const input: GoMethodInput = {
        operationId: op.operationId,
        methodName: stripOperationPrefix(op.operationId, opts.product),
        cliAction: `${opts.product} ${op.operationId.replace(toPascalCase(opts.product), "").replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")}`,
        method: method.toUpperCase() as GoMethodInput["method"],
        path,
        pathParams,
        queryParams,
        hasRequestBody: Boolean(op.requestBody) && requestBodyType !== undefined,
        requestCodec,
        responseType: respType,
        className,
        requestBodyType,
      };

      methods.push(emitGoMethod(input));
    }
  }

  const needsStrconv = methods.some((m) => m.includes("strconv.Itoa("));
  const needsUrl = methods.some((m) => m.includes("url.PathEscape("));
  const fileHeader = emitGoFile(opts.product, className, modulePath, needsStrconv, needsUrl);
  const clientGo = fileHeader + "\n" + methods.join("\n\n") + "\n";
  const typesGo = emitGoTypes(opts.product, schemas);

  return { typesGo, clientGo };
}
