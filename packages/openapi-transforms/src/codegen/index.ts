import yaml from "yaml";
import fs from "node:fs/promises";
import type { CodecRegistry } from "../registry";
import { readAnnotations } from "./annotations";
import { emitModule } from "./emit-module";
import type { EmitMethodInput } from "./emit-method";
import { deriveReturnType } from "./derive-return-type";
import { loadFieldOverrides, type FieldOverrides } from "./field-overrides";

export interface GenerateClientOptions {
  specPath: string;
  className: string;
  typesImportPath: string;
  registry: CodecRegistry;
  baseUrl: "sdk" | "sdkCloud";
  fieldOverridesPath?: string;
}

interface SpecDoc {
  paths?: Record<string, Record<string, SpecOp | undefined>>;
}
interface SpecOp {
  operationId?: string;
  parameters?: Array<{ name: string; in: string; schema?: { type?: string } }>;
  requestBody?: unknown;
  responses?: Record<string, { content?: Record<string, unknown> }>;
  "x-response-transform"?: { codec: string; config?: unknown };
  "x-request-transform"?: { codec: string; config?: unknown };
  "x-response-custom"?: boolean;
  "x-request-custom"?: boolean;
  [key: string]: unknown;
}

export async function generateClientModule(opts: GenerateClientOptions): Promise<string> {
  const raw = await fs.readFile(opts.specPath, "utf8");
  const doc = yaml.parse(raw) as SpecDoc;
  const fieldOverrides: FieldOverrides = opts.fieldOverridesPath
    ? await loadFieldOverrides(opts.fieldOverridesPath)
    : {};
  // fieldOverrides is wired into emitModule in Task 4 when EmitModuleInput gains the field
  void fieldOverrides;
  const methods: EmitMethodInput[] = [];
  const errorAliases: Array<{ operationId: string; errorStatuses: number[] }> = [];
  for (const [path, pathItem] of Object.entries(doc.paths ?? {})) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const op = pathItem[method]; if (!op) continue;
      const operationId = op.operationId; if (!operationId) continue;
      const annotations = readAnnotations(op, opts.registry, operationId);
      if (annotations.custom.response || annotations.custom.request) continue;

      const successCT = op.responses?.["200"]?.content?.["application/json"]
        ? `operations["${operationId}"]["responses"][200]["content"]["application/json"]`
        : op.responses?.["200"]?.content?.["text/plain"] ? `string` : `unknown`;
      const returnType = deriveReturnType(successCT, annotations);
      const pathParams = (op.parameters ?? []).filter((p) => p.in === "path").map((p) => ({
        name: p.name, tsType: p.schema?.type === "integer" ? "number" : "string",
      }));
      methods.push({
        operationId, method: method.toUpperCase() as EmitMethodInput["method"], path,
        pathParams, queryParams: [], hasRequestBody: Boolean(op.requestBody),
        operationsKey: operationId, returnType, annotations, baseUrl: opts.baseUrl,
      });
      const errorStatuses = Object.keys(op.responses ?? {}).map(Number)
        .filter((s) => Number.isFinite(s) && s >= 400);
      errorAliases.push({ operationId, errorStatuses });
    }
  }
  return emitModule({ className: opts.className, typesImportPath: opts.typesImportPath, methods, errorAliases });
}
