import yaml from "yaml";
import fs from "node:fs/promises";
import { stripOperationPrefix, toCLIAction } from "../shared/operation";

export * from "./typescript";
export * from "./golang";

interface SpecOp {
  operationId?: string;
  parameters?: any[];
  requestBody?: any;
  responses?: Record<string, {
    content?: Record<string, {
      schema?: any;
    }>;
  }>;
  "x-cli-action"?: string;
  "x-cli-resource"?: string;
}

interface SpecDoc {
  paths?: Record<string, Record<string, SpecOp | undefined>>;
}

export interface CLIActionMetadata {
  operationId: string;
  methodName: string;
  path: string;
  method: string;
  parameters: any[];
  requestBody?: any;
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
  const xCliAction = op["x-cli-action"] as string;
  if (xCliAction) return xCliAction;
  const rawAction = stripOperationPrefix(op.operationId!, product);
  return toCLIAction(rawAction, op.responses?.["200"]?.content?.["application/json"]?.schema);
}

function resolveParams(pathItem: any, op: SpecOp, doc: any): any[] {
  const allParamsRaw = [...(pathItem.parameters || []), ...(op.parameters || [])];
  return allParamsRaw.map(p => {
    if (p.$ref) {
      const refName = p.$ref.replace("#/components/parameters/", "");
      return doc.components?.parameters?.[refName] ?? p;
    }
    return p;
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

      const rawResource = op["x-cli-resource"] as string || (op as any).tags?.[0] || "";
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
        parameters: allParams.map(p => ({
            ...p,
            required: p.name === "auth_token" ? false : !!p.required
        })),
        requestBody: op.requestBody,
      };
    }
  }

  return metadata;
}
