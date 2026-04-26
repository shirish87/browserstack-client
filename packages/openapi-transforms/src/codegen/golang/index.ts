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

function responseType(op: SpecOp, operationId: string, knownSchemas: Set<string>): string {
  const responseCodec = resolveResponseCodec(op);
  if (responseCodec === "text") return "string";
  const schema = op.responses?.["200"]?.content?.["application/json"]?.schema;
  if (!schema) return "map[string]any";
  if (schema.$ref) {
    const refName = schema.$ref.replace(/^.*\//, "");
    const goName = toPascalCase(refName);
    return knownSchemas.has(goName) ? goName : "map[string]any";
  }
  if (schema.type === "object" || schema.properties) {
    const name = schema.title ?? (toPascalCase(operationId) + "Response");
    return toPascalCase(name);
  }
  return "map[string]any";
}

type InlineSchemas = Record<string, { type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string } }>; required?: string[] }>;

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
      if (responseCodec !== "text") {
        const respSchema = op.responses?.["200"]?.content?.["application/json"]?.schema;
        if (respSchema && !respSchema.$ref && (respSchema.type === "object" || respSchema.properties)) {
          const name = respSchema.title ?? (toPascalCase(op.operationId) + "Response");
          extra[toPascalCase(name)] = { type: "object", properties: respSchema.properties, required: respSchema.required };
        }
      }

      const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
      if (bodySchema && !bodySchema.$ref) {
        const name = bodySchema.title ?? (toPascalCase(op.operationId) + "Request");
        extra[toPascalCase(name)] = { type: "object", properties: bodySchema.properties, required: bodySchema.required };
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
  const knownSchemas = new Set(Object.keys(componentSchemas).map(toPascalCase));
  const inlineSchemas = collectInlineSchemas(doc.paths ?? {});
  const schemas = { ...componentSchemas, ...inlineSchemas };

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
      const respType = responseType(op, op.operationId, knownSchemas);
      const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
      const requestBodyType = op.requestBody
        ? bodySchema?.$ref
          ? (() => { const n = toPascalCase(bodySchema.$ref.replace(/^.*\//, "")); return knownSchemas.has(n) ? n : undefined; })()
          : toPascalCase(op.operationId) + "Request"
        : undefined;

      const input: GoMethodInput = {
        operationId: op.operationId,
        methodName: stripOperationPrefix(op.operationId, opts.product),
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
