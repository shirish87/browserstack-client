import yaml from "yaml";
import fs from "node:fs/promises";
import type { CodecRegistry } from "../../registry";
import { readAnnotations } from "./annotations";
import { emitModule } from "./emit-module";
import type { EmitMethodInput } from "./emit-method";
import { deriveReturnType } from "./derive-return-type";
import { loadFieldOverrides, type FieldOverrides } from "./field-overrides";
import { stripOperationPrefix } from "../shared/operation";

export interface GenerateClientOptions {
  specPath: string;
  product: string;
  className: string;
  typesImportPath: string;
  registry: CodecRegistry;
  baseUrl: "sdk" | "sdkCloud";
  fieldOverridesPath?: string;
}

interface SpecParam {
  name: string;
  in: string;
  schema?: { type?: string };
  $ref?: string;
}

interface SpecDoc {
  paths?: Record<string, Record<string, SpecOp | undefined>>;
  components?: {
    parameters?: Record<string, SpecParam>;
  };
}
interface SpecOp {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: Array<SpecParam>;
  requestBody?: unknown;
  responses?: Record<string, { content?: Record<string, unknown> }>;
  "x-response-transform"?: { codec: string; config?: unknown } | string;
  "x-request-transform"?: { codec: string; config?: unknown } | string;
  "x-response-custom"?: boolean;
  "x-request-custom"?: boolean;
  [key: string]: unknown;
}

function resolvePathQueryParams(resolvedParams: SpecParam[]): {
  pathParams: Array<{ name: string; tsType: string }>;
  queryParams: Array<{ name: string; baseName: string; tsType: string; required: boolean }>;
} {
  const pathParams = resolvedParams.filter((p) => p.in === "path").map((p) => ({
    name: p.name, tsType: p.schema?.type === "integer" ? "number" : "string",
  }));
  const queryParams = resolvedParams.filter((p) => p.in === "query").map((p) => {
    const isArray = p.name.endsWith("[]");
    const baseName = isArray ? p.name.slice(0, -2) : p.name;
    const itemType = p.schema?.type === "integer" ? "number" : "string";
    const tsType = isArray ? `${itemType}[]` : itemType;
    return { name: p.name, baseName, tsType, required: false };
  });
  return { pathParams, queryParams };
}

function resolveOpReturnType(op: SpecOp, opts: GenerateClientOptions, operationId: string) {
  const successCT = op.responses?.["200"]?.content?.["application/json"]
    ? `operations["${operationId}"]["responses"][200]["content"]["application/json"]`
    : op.responses?.["200"]?.content?.["text/plain"] ? `string` : `void`;
  const annotations = readAnnotations(op, opts.registry, operationId);
  const derived = deriveReturnType(successCT, annotations, operationId);
  return { annotations, derived, returnType: derived.type };
}

export async function generateClientModule(opts: GenerateClientOptions): Promise<string> {
  const raw = await fs.readFile(opts.specPath, "utf8");
  const doc = yaml.parse(raw) as SpecDoc;
  const fieldOverrides: FieldOverrides = opts.fieldOverridesPath
    ? await loadFieldOverrides(opts.fieldOverridesPath)
    : {};
  const methods: EmitMethodInput[] = [];
  const errorAliases: Array<{ operationId: string; errorStatuses: number[] }> = [];
  for (const [path, pathItem] of Object.entries(doc.paths ?? {})) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const op = pathItem[method]; if (!op) continue;
      const operationId = op.operationId; if (!operationId) continue;
      const { annotations, derived, returnType } = resolveOpReturnType(op, opts, operationId);
      if (annotations.custom.response || annotations.custom.request) continue;

      const resolvedParams = (op.parameters ?? []).map((p) => {
        if (p.$ref) {
          const refName = p.$ref.replace("#/components/parameters/", "");
          return (doc.components?.parameters?.[refName] ?? p);
        }
        return p;
      });
      const { pathParams, queryParams } = resolvePathQueryParams(resolvedParams);
      methods.push({
        operationId, methodName: stripOperationPrefix(operationId, opts.product),
        method: method.toUpperCase() as EmitMethodInput["method"], path,
        pathParams, queryParams, hasRequestBody: Boolean(op.requestBody),
        operationsKey: operationId, returnType, returnTypeAliases: derived.aliases,
        annotations, baseUrl: (op["x-base-url"] ?? opts.baseUrl) as "sdk" | "sdkCloud",
        summary: op.summary, description: op.description,
      });
      const errorStatuses = Object.keys(op.responses ?? {}).map(Number)
        .filter((s) => Number.isFinite(s) && s >= 400);
      errorAliases.push({ operationId, errorStatuses });
    }
  }
  return emitModule({ className: opts.className, typesImportPath: opts.typesImportPath, methods, errorAliases, fieldOverrides });
}
