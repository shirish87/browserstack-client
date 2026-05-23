import yaml from "yaml";
import fs from "node:fs/promises";
import { stripOperationPrefix, toCLIAction } from "../shared/operation";

export * from "./typescript";
export * from "./golang";
export * from "./tui";

interface SpecOp {
  operationId?: string;
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    schema?: Record<string, unknown>;
    $ref?: string;
  }>;
  requestBody?: {
    content?: Record<string, {
      schema?: Record<string, unknown>;
    }>;
    required?: boolean;
  };
  responses?: Record<string, {
    content?: Record<string, {
      schema?: Record<string, unknown>;
    }>;
  }>;
  tags?: string[];
  summary?: string;
  description?: string;
  "x-cli-action"?: string;
  "x-cli-resource"?: string;
}

interface SpecDoc {
  paths?: Record<string, Record<string, SpecOp | undefined>>;
  components?: {
    parameters?: Record<string, SpecOp["parameters"] extends Array<infer T> ? T : never>;
  };
}

export interface CLIActionMetadata {
  operationId: string;
  methodName: string;
  path: string;
  method: string;
  parameters: Array<{
    name: string;
    in: string;
    required: boolean;
    schema?: Record<string, unknown>;
  }>;
  requestBody?: SpecOp["requestBody"];
  summary?: string;
  description?: string;
  /** Go response type for this action, e.g. "AutomatePlan", "string", "[]byte". Populated by build.mjs after Go codegen. */
  responseGoType?: string;
  /** Field name in DispatchResult for this action, e.g. "GetPlan". Populated by build.mjs after Go codegen. */
  resultFieldName?: string;
}

export interface CLIMetadata {
  product: string;
  resources: Record<string, {
    actions: Record<string, CLIActionMetadata>;
  }>;
}

function resolveAction(op: SpecOp, product: string): string {
  const xCliAction = op["x-cli-action"];
  if (xCliAction) return xCliAction;
  const rawAction = stripOperationPrefix(op.operationId!, product);
  return toCLIAction(rawAction, op.responses?.["200"]?.content?.["application/json"]?.schema);
}

function resolveParams(
  pathItem: Record<string, SpecOp | undefined>,
  op: SpecOp,
  doc: SpecDoc
): CLIActionMetadata["parameters"] {
  const pathParams = (pathItem.parameters as SpecOp["parameters"]) || [];
  const opParams = op.parameters || [];
  const allParamsRaw = [...pathParams, ...opParams];

  return allParamsRaw.map(p => {
    let resolved = p;
    if (p.$ref) {
      const refName = p.$ref.replace("#/components/parameters/", "");
      resolved = doc.components?.parameters?.[refName] ?? p;
    }
    return {
      name: resolved.name,
      in: resolved.in,
      required: resolved.name === "auth_token" ? false : !!resolved.required,
      schema: resolved.schema,
    };
  });
}

export async function extractCLIMetadata(specPath: string, product: string): Promise<CLIMetadata> {
  const raw = await fs.readFile(specPath, "utf8");
  const doc = yaml.parse(raw) as SpecDoc;

  const metadata: CLIMetadata = {
    product,
    resources: {},
  };

  for (const [path, pathItem] of Object.entries(doc.paths ?? {})) {
    for (const [_method, op] of Object.entries(pathItem)) {
      if (!op?.operationId) continue;

      const rawResource = op["x-cli-resource"] || op.tags?.[0] || "";
      const productNorm = product.replace(/-/g, "").toLowerCase();
      const resourceNorm = rawResource.replace(/-/g, "").replace(/\\s/g, "").toLowerCase();

      const resource = (resourceNorm === productNorm) ? "" : rawResource;
      const action = resolveAction(op, product);

      const resKey = resource || "default";
      if (!metadata.resources[resKey]) {
        metadata.resources[resKey] = { actions: {} };
      }

      const allParams = resolveParams(pathItem, op, doc);

      metadata.resources[resKey].actions[action] = {
        operationId: op.operationId,
        methodName: stripOperationPrefix(op.operationId, product),
        path,
        method: _method,
        parameters: allParams,
        requestBody: op.requestBody,
        summary: op.summary,
        description: op.description,
      };
    }
  }

  return metadata;
}
