import yaml from "yaml";
import fs from "node:fs/promises";
import { emitGoFile } from "./emit-file";
import { emitGoMethod, type GoMethodInput } from "./emit-method";
import { emitGoTypes } from "./emit-types";
import { toPascalCase } from "./case";

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

interface SpecOp {
  operationId?: string;
  parameters?: Array<SpecParam>;
  requestBody?: unknown;
  responses?: Record<string, { content?: Record<string, unknown> }>;
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

function responseType(op: SpecOp, operationId: string): string {
  const responseCodec = resolveResponseCodec(op);
  if (responseCodec === "text") return "string";
  const content200 = op.responses?.["200"]?.content;
  if (content200?.["application/json"]) {
    return toPascalCase(operationId) + "Response";
  }
  return "map[string]any";
}

export async function generateGoModule(
  opts: GenerateGoModuleOptions
): Promise<{ typesGo: string; clientGo: string }> {
  const modulePath =
    opts.modulePath ?? "github.com/browserstack/browserstack-client";
  const raw = await fs.readFile(opts.specPath, "utf8");
  const doc = yaml.parse(raw) as SpecDoc;

  const className = toPascalCase(opts.product) + "Client";
  const schemas = (doc.components?.schemas ?? {}) as Record<
    string,
    { type?: string; properties?: Record<string, { type?: string; $ref?: string; items?: { type?: string } }>; required?: string[] }
  >;

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
          goType: p.schema?.type === "integer" ? "int" : "string",
        }));

      const queryParams = resolvedParams
        .filter((p) => p.in === "query")
        .map((p) => ({
          name: p.name,
          goType: p.schema?.type === "integer" ? "int" : "string",
        }));

      const requestCodec = resolveRequestCodec(op);
      const respType = responseType(op, op.operationId);
      const requestBodyType = op.requestBody
        ? toPascalCase(op.operationId) + "Request"
        : undefined;

      const input: GoMethodInput = {
        operationId: op.operationId,
        method: method.toUpperCase() as GoMethodInput["method"],
        path,
        pathParams,
        queryParams,
        hasRequestBody: Boolean(op.requestBody),
        requestCodec,
        responseType: respType,
        className,
        requestBodyType,
      };

      methods.push(emitGoMethod(input));
    }
  }

  const fileHeader = emitGoFile(opts.product, className, modulePath);
  const clientGo = fileHeader + "\n" + methods.join("\n\n") + "\n";
  const typesGo = emitGoTypes(opts.product, schemas);

  return { typesGo, clientGo };
}
