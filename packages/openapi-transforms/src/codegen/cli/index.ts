import yaml from "yaml";
import fs from "node:fs/promises";
import { stripOperationPrefix } from "../shared/operation";

export * from "./typescript";
export * from "./golang";

interface SpecOp {
  operationId?: string;
  parameters?: any[];
  requestBody?: any;
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
      
      const rawAction = op["x-cli-action"] as string || stripOperationPrefix(op.operationId, product);
      let action = rawAction
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase();

      // CLI-friendly mapping: get-*s -> list-*
      if (action.startsWith("get-") && action.endsWith("s")) {
        action = action.replace(/^get-/, "list-");
      }

      const resKey = resource || "default";
      if (!metadata.resources[resKey]) {
        metadata.resources[resKey] = { actions: {} };
      }

      const allParamsRaw = [...((pathItem as any).parameters || []), ...(op.parameters || [])];
      const allParams = allParamsRaw.map(p => {
        if (p.$ref) {
          const refName = p.$ref.replace("#/components/parameters/", "");
          return (doc as any).components?.parameters?.[refName] ?? p;
        }
        return p;
      });

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