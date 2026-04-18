import yaml from "yaml";
import fs from "node:fs/promises";
import type { CodecRegistry } from "../registry.js";
import { readAnnotations } from "./annotations.js";
import { emitModule } from "./emit-module.js";
import { deriveReturnType } from "./derive-return-type.js";

export interface GenerateClientOptions {
  specPath: string;
  className: string;
  typesImportPath: string;
  registry: CodecRegistry;
  baseUrl: "sdk" | "sdkCloud";
}

export async function generateClientModule(opts: GenerateClientOptions): Promise<string> {
  const raw = await fs.readFile(opts.specPath, "utf8");
  const doc: any = yaml.parse(raw);
  const methods: any[] = [];
  const errorAliases: any[] = [];
  for (const [path, pathItem] of Object.entries(doc.paths ?? {}) as any) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const op = pathItem[method]; if (!op) continue;
      const operationId = op.operationId; if (!operationId) continue;
      const annotations = readAnnotations(op, opts.registry, operationId);
      if (annotations.custom.response || annotations.custom.request) continue;

      const successCT = op.responses?.["200"]?.content?.["application/json"]
        ? `operations["${operationId}"]["responses"][200]["content"]["application/json"]`
        : op.responses?.["200"]?.content?.["text/plain"] ? `string` : `unknown`;
      const returnType = deriveReturnType(successCT, annotations);
      const pathParams = (op.parameters ?? []).filter((p: any) => p.in === "path").map((p: any) => ({
        name: p.name, tsType: p.schema?.type === "integer" ? "number" : "string",
      }));
      methods.push({
        operationId, method: method.toUpperCase(), path,
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
