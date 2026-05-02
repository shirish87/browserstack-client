import yaml from "yaml";
import fs from "node:fs/promises";
import { emitGoFile } from "./emit-file";
import { emitGoMethod, type GoMethodInput } from "./emit-method";
import { emitGoTypes } from "./emit-types";
import { emitDispatchResult, type DispatchAction } from "./emit-dispatch-result";
import { toCLIAction } from "../shared/operation";

export interface ActionResponseInfo {
  responseType: string;
  fieldName: string;
}
import { toPascalCase } from "./case";
import { stripOperationPrefix } from "../shared/operation";

export interface GenerateGoModuleOptions {
  specPath: string;
  specDoc?: SpecDoc;  // if provided, skip the file read
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

function walkPath(node: SpecResponseSchema, segments: string[]): SpecResponseSchema | undefined {
  let cur: SpecResponseSchema | undefined = node;
  for (const seg of segments) {
    cur = (cur?.properties as Record<string, SpecResponseSchema> | undefined)?.[seg];
    if (!cur) return undefined;
  }
  return cur;
}

function resolveWildcardRef(
  mergeNode: SpecResponseSchema,
  parts: string[],
  wildcardIdx: number
): string | undefined {
  const remaining = parts.slice(wildcardIdx + 1);
  let itemNode: SpecResponseSchema | undefined = mergeNode.items;
  for (const part of remaining) {
    itemNode = (itemNode?.properties as Record<string, SpecResponseSchema> | undefined)?.[part];
    if (!itemNode) break;
  }
  if (itemNode?.$ref) return itemNode.$ref.replace(/^.*\//, "");
  if (!remaining.length && mergeNode.items?.$ref) return mergeNode.items.$ref.replace(/^.*\//, "");
  return undefined;
}

function walkMergePath(
  rawSchema: SpecResponseSchema,
  path: string
): { mergeNode: SpecResponseSchema | undefined; reachedWildcard: boolean } {
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
  return { mergeNode, reachedWildcard };
}

function resolveMergeFieldRef(
  rawSchema: SpecResponseSchema,
  path: string
): string | undefined {
  const parts = path.replace(/^\$\./, "").split(".");
  const { mergeNode, reachedWildcard } = walkMergePath(rawSchema, path);
  if (reachedWildcard && mergeNode) {
    const wildcardIdx = parts.findIndex((p) => p === "[*]" || p.endsWith("[*]"));
    return resolveWildcardRef(mergeNode, parts, wildcardIdx);
  }
  if (mergeNode?.items?.$ref) return mergeNode.items.$ref.replace(/^.*\//, "");
  return undefined;
}

function buildJsonComposeSchema(
  op: SpecOp,
  operationId: string
): { name: string; schema: InlineSchemas[string] } | undefined {
  const rt = op["x-response-transform"];
  if (!rt || typeof rt === "string" || rt.codec !== "json-compose") return undefined;
  const cfg = rt.config as { base?: string; merge?: Record<string, string> } | undefined;
  if (!cfg?.base) return undefined;

  const rawSchema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  if (!rawSchema) return undefined;

  const node = walkPath(rawSchema, cfg.base.replace(/^\$\./, "").split("."));
  const baseRef = node?.$ref?.replace(/^.*\//, "");
  if (!baseRef) return undefined;

  const props: InlineSchemas[string]["properties"] = {};
  const required: string[] = [];

  for (const [field, path] of Object.entries(cfg.merge ?? {})) {
    const itemRef = resolveMergeFieldRef(rawSchema, path);
    if (itemRef) {
      props[field] = { type: "array", items: { $ref: `#/components/schemas/${itemRef}` } };
      required.push(field);
    }
  }

  const name = resolveJsonComposeResultName(operationId);
  return { name, schema: { type: "object", properties: props, required, _baseEmbed: toPascalCase(baseRef) } };
}

function resolvePrimitiveElemType(type: string | undefined): string {
  switch (type) {
    case "string":  return "string";
    case "integer": return "int";
    case "number":  return "float64";
    case "boolean": return "bool";
    default:        return "any";
  }
}

function resolveArrayResponseType(
  schema: SpecResponseSchema,
  operationId: string,
  knownSchemas: Set<string>
): string {
  if (!schema.items) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — array schema missing items`);
  if (schema.title) {
    const name = toPascalCase(schema.title);
    if (!knownSchemas.has(name)) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — array response title "${name}" not in known schemas`);
    return name;
  }
  let elemType = "any";
  if (schema.items.$ref) {
    const name = toPascalCase(schema.items.$ref.replace(/^.*\//, ""));
    if (!knownSchemas.has(name)) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — array items $ref "${schema.items.$ref}" not in known schemas`);
    elemType = name;
  } else if (schema.items.type === "object" || schema.items.properties) {
    const defaultName = toPascalCase(operationId) + "Response";
    const name = toPascalCase(schema.items.title ?? (defaultName + "Item"));
    if (!knownSchemas.has(name)) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — array items inline object type not in known schemas — extract to named schema`);
    elemType = name;
  } else {
    elemType = resolvePrimitiveElemType(schema.items.type);
  }
  return "[]" + elemType;
}

function resolveJsonSchemaResponseType(
  schema: SpecResponseSchema,
  operationId: string,
  knownSchemas: Set<string>
): string {
  if (schema.type === "array" && schema.items) return resolveArrayResponseType(schema, operationId, knownSchemas);
  if (schema.$ref) {
    const goName = toPascalCase(schema.$ref.replace(/^.*\//, ""));
    if (!knownSchemas.has(goName)) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — $ref "${schema.$ref}" not in known schemas`);
    return goName;
  }
  if (schema.type === "object" || schema.properties) {
    const name = toPascalCase(schema.title ?? (toPascalCase(operationId) + "Response"));
    if (!knownSchemas.has(name)) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — inline object response type "${name}" not in known schemas`);
    return name;
  }
  if ((schema.oneOf || schema.anyOf) && schema.title) {
    const name = toPascalCase(schema.title);
    if (!knownSchemas.has(name)) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — oneOf/anyOf titled "${name}" not in known schemas`);
    return name;
  }
  throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — unresolvable schema type`);
}

function responseType(op: SpecOp, operationId: string, knownSchemas: Set<string>): string {
  const responseCodec = resolveResponseCodec(op);
  if (responseCodec === "text") return "string";
  if (responseCodec === "binary") return "[]byte";
  if (responseCodec === "json-compose") {
    const resultName = resolveJsonComposeResultName(operationId);
    if (!knownSchemas.has(resultName)) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — json-compose result type "${resultName}" not found in known schemas`);
    return resultName;
  }
  const schema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  if (!schema) throw new Error(`[go-codegen] Operation "${operationId}": cannot resolve response type — no 200 response schema defined`);
  return resolveJsonSchemaResponseType(schema, operationId, knownSchemas);
}

type InlineSchemas = Record<string, { type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string; $ref?: string } }>; required?: string[]; items?: { type?: string; $ref?: string; title?: string; properties?: Record<string, { type?: string; $ref?: string }>; required?: string[] }; _baseEmbed?: string }>;

function collectInlineObjectProps(
  props: Record<string, unknown>,
  extra: InlineSchemas
): void {
  for (const [, propSchema] of Object.entries(props)) {
    const p = propSchema as SpecResponseSchema;
    if (p.title && (p.type === "object" || p.properties) && !p.$ref) {
      const pName = toPascalCase(p.title);
      extra[pName] = { type: "object", properties: p.properties as InlineSchemas[string]["properties"], required: p.required };
    }
  }
}

function collectFromResponseSchema(
  respSchema: SpecResponseSchema,
  operationId: string,
  extra: InlineSchemas
): void {
  if (respSchema.type === "object" || respSchema.properties) {
    const name = toPascalCase(respSchema.title ?? (toPascalCase(operationId) + "Response"));
    extra[name] = { type: "object", properties: respSchema.properties, required: respSchema.required };
    collectInlineObjectProps(respSchema.properties ?? {}, extra);
  } else if (respSchema.type === "array") {
    const name = toPascalCase(respSchema.title ?? (toPascalCase(operationId) + "Response"));
    if (respSchema.title) {
      extra[name] = { type: "array", items: respSchema.items };
    }
    if (respSchema.items && !respSchema.items.$ref && (respSchema.items.type === "object" || respSchema.items.properties)) {
      const itemName = toPascalCase(respSchema.items.title ?? (name + "Item"));
      extra[itemName] = { type: "object", properties: respSchema.items.properties, required: respSchema.items.required };
    }
  } else if ((respSchema.oneOf || respSchema.anyOf) && respSchema.title) {
    const branches = (respSchema.oneOf ?? respSchema.anyOf) as Array<{ type?: string; properties?: Record<string, unknown>; required?: string[] }>;
    const dataBranch = branches.find(b => b.properties && !Object.keys(b.properties).every(k => k === "error"));
    if (dataBranch) {
      const name = toPascalCase(respSchema.title);
      extra[name] = { type: "object", properties: dataBranch.properties as InlineSchemas[string]["properties"], required: dataBranch.required };
    }
  }
}

function collectFromBodySchema(
  bodySchema: SpecResponseSchema,
  operationId: string,
  extra: InlineSchemas
): void {
  const name = toPascalCase(bodySchema.title ?? (toPascalCase(operationId) + "Request"));
  extra[name] = { type: "object", properties: bodySchema.properties, required: bodySchema.required };
  collectInlineObjectProps(bodySchema.properties ?? {}, extra);
}

function collectInlineSchemasForOp(op: SpecOp, extra: InlineSchemas): void {
  const responseCodec = resolveResponseCodec(op);
  if (responseCodec === "json-compose") {
    const composed = buildJsonComposeSchema(op, op.operationId!);
    if (composed) extra[composed.name] = composed.schema;
  }
  if (responseCodec !== "text" && responseCodec !== "binary") {
    const respSchema = op.responses?.["200"]?.content?.["application/json"]?.schema;
    if (respSchema && !respSchema.$ref) {
      collectFromResponseSchema(respSchema, op.operationId!, extra);
    }
  }
  const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
  if (bodySchema && !bodySchema.$ref) {
    collectFromBodySchema(bodySchema, op.operationId!, extra);
  }
}

function collectInlineSchemas(
  paths: Record<string, Record<string, SpecOp | undefined>>
): InlineSchemas {
  const extra: InlineSchemas = {};
  for (const pathItem of Object.values(paths)) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const op = pathItem[method];
      if (!op?.operationId) continue;
      if (op["x-response-custom"] || op["x-request-custom"]) continue;
      collectInlineSchemasForOp(op, extra);
    }
  }
  return extra;
}

function resolveRequestBodyType(
  op: SpecOp,
  bodySchema: SpecResponseSchema | undefined,
  allKnownSchemas: Set<string>,
  operationId: string
): string | undefined {
  if (!op.requestBody) return undefined;
  if (bodySchema?.$ref) {
    const n = toPascalCase(bodySchema.$ref.replace(/^.*\//, ""));
    return allKnownSchemas.has(n) ? n : undefined;
  }
  return toPascalCase(operationId) + "Request";
}

export async function generateGoModule(
  opts: GenerateGoModuleOptions
): Promise<{ typesGo: string; clientGo: string; dispatchResultGo: string; actionResponseTypes: Map<string, ActionResponseInfo> }> {
  const modulePath =
    opts.modulePath ?? "github.com/browserstack/browserstack-client";
  const doc = opts.specDoc ?? (yaml.parse(await fs.readFile(opts.specPath, "utf8")) as SpecDoc);

  const className = toPascalCase(opts.product) + "Client";
  const componentSchemas = (doc.components?.schemas ?? {}) as Record<
    string,
    { type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string } }>; required?: string[]; allOf?: Array<{ $ref?: string; type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string } }>; required?: string[] }>; items?: { type?: string; $ref?: string } }
  >;
  const inlineSchemas = collectInlineSchemas(doc.paths ?? {});
  const schemas = { ...componentSchemas, ...inlineSchemas };
  const allKnownSchemas = new Set(Object.keys(schemas).map(toPascalCase));

  const methods: string[] = [];
  const dispatchActions: DispatchAction[] = [];
  const actionResponseTypes = new Map<string, ActionResponseInfo>();

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
          goType: "string",
        }));

      const queryParams = resolvedParams
        .filter((p) => p.in === "query")
        .map((p) => ({
          name: p.name.replace(/\[\]$/, ""),
          goType: "string",
        }));

      const requestCodec = resolveRequestCodec(op);
      const respType = responseType(op, op.operationId, allKnownSchemas);
      const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
      const requestBodyType = resolveRequestBodyType(op, bodySchema, allKnownSchemas, op.operationId);

      const input: GoMethodInput = {
        operationId: op.operationId,
        methodName: stripOperationPrefix(op.operationId, opts.product),
        cliAction: (op["x-cli-action"] as string) || toCLIAction(stripOperationPrefix(op.operationId, opts.product), op.responses?.["200"]?.content?.["application/json"]?.schema),
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

      const actionSlug = input.cliAction || "";
      const fieldName = toPascalCase(actionSlug.replace(/-/g, "_"));
      dispatchActions.push({ fieldName, responseType: respType });
      actionResponseTypes.set(actionSlug, { responseType: respType, fieldName });
    }
  }

  const needsStrconv = methods.some((m) => m.includes("strconv.Itoa("));
  const needsUrl = methods.some((m) => m.includes("url.PathEscape("));
  const fileHeader = emitGoFile(opts.product, className, modulePath, needsStrconv, needsUrl);
  const clientGo = fileHeader + "\n" + methods.join("\n\n") + "\n";
  const typesGo = emitGoTypes(opts.product, schemas);
  const dispatchResultGo = emitDispatchResult(opts.product, dispatchActions);

  return { typesGo, clientGo, dispatchResultGo, actionResponseTypes };
}
