import yaml from "yaml";
import fs from "node:fs/promises";
import { stripOperationPrefix } from "../shared/operation";
import { toPascalCase } from "../golang/case";

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
      const resourceNorm = rawResource.replace(/-/g, "").replace(/\s/g, "").toLowerCase();
      
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

      metadata.resources[resKey].actions[action] = {
        operationId: op.operationId,
        methodName: stripOperationPrefix(op.operationId, product),
        path,
        method: _method,
        parameters: (op.parameters || []).map(p => ({
            ...p,
            required: p.name === "auth_token" ? false : !!p.required
        })),
        requestBody: op.requestBody,
      };
    }
  }

  return metadata;
}

function openApiToZod(schema: any, required: boolean): string {
    if (!schema) return "z.unknown()";
    
    let zod = "";
    if (schema.$ref) {
        return "z.any()";
    }

    const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;

    switch (type) {
        case "string":
            zod = "z.string()";
            break;
        case "number":
        case "integer":
            zod = "z.coerce.number()";
            break;
        case "boolean":
            zod = "z.coerce.boolean()";
            break;
        case "array":
            zod = `z.array(${openApiToZod(schema.items || {}, true)})`;
            break;
        case "object":
            const props = Object.entries(schema.properties || {})
                .map(([k, v]) => {
                    const name = k.includes("-") || k.includes("[") ? `"${k}"` : k;
                    // For object properties, we assume required unless specified in required array
                    const isPropRequired = Array.isArray(schema.required) && schema.required.includes(k);
                    return `${name}: ${openApiToZod(v, isPropRequired)}`;
                })
                .join(", ");
            zod = `z.object({ ${props} })`;
            break;
        default:
            if (schema.oneOf || schema.anyOf || schema.allOf) {
                return "z.any()";
            }
            zod = "z.any()";
    }

    if (!required) {
        zod += ".optional()";
    }
    return zod;
}

export function generateTSConstants(metadata: CLIMetadata[]): string {
  let out = "/**\n * Generated CLI constants. Do not modify.\n */\n\n";

  out += "export enum Product {\n";
  for (const m of metadata) {
    out += `  ${toPascalCase(m.product)} = "${m.product}",\n`;
  }
  out += "}\n\n";

  for (const m of metadata) {
    const productPascal = toPascalCase(m.product);
    out += `export namespace ${productPascal} {\n`;
    
    // Resources
    const resourceKeys = Object.keys(m.resources).filter(k => k !== "default");
    if (resourceKeys.length > 0) {
        out += `  export enum Resource {\n`;
        for (const resource of resourceKeys) {
            out += `    ${toPascalCase(resource)} = "${resource}",\n`;
        }
        out += "  }\n\n";
    }

    // Actions
    for (const [resource, resMeta] of Object.entries(m.resources)) {
        const enumName = resource === "default" ? "Action" : `${toPascalCase(resource)}Action`;
        out += `  export enum ${enumName} {\n`;
        for (const action of Object.keys(resMeta.actions)) {
            out += `    ${toPascalCase(action)} = "${action}",\n`;
        }
        out += "  }\n";
    }
    out += "}\n\n";
  }

  return out;
}

export function generateTSSchemas(metadata: CLIMetadata[]): string {
    let out = "/**\n * Generated CLI schemas. Do not modify.\n */\n\n";
    out += "import { z } from \"zod\";\n";
    out += "import * as Constants from \"./constants.generated\";\n\n";

    for (const m of metadata) {
        const productPascal = toPascalCase(m.product);
        out += `export namespace ${productPascal}Schemas {\n`;

        for (const [resource, resMeta] of Object.entries(m.resources)) {
            const resourceName = resource === "default" ? "" : toPascalCase(resource);
            for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
                const actionPascal = toPascalCase(action);
                
                // Get path params in order
                const pathParamNames = (actionMeta.path.match(/\{([^}]+)\}/g) || []).map(s => s.slice(1, -1));
                const pathParams = pathParamNames.map(name => {
                    const p = actionMeta.parameters.find(p => p.name === name && p.in === "path");
                    return { name, schema: p?.schema || { type: "string" }, required: true };
                });

                // Get query params
                const queryParams = actionMeta.parameters.filter(p => p.in === "query");

                // Get body schema
                const bodySchema = actionMeta.requestBody?.content?.["application/json"]?.schema;

                out += `  export const ${resourceName}${actionPascal}Args = z.object({\n`;
                out += `    positional: z.tuple([\n`;
                for (const p of pathParams) {
                    out += `      ${openApiToZod(p.schema, true)},\n`;
                }
                out += `    ]),\n`;
                
                if (queryParams.length > 0) {
                    out += `    options: z.object({\n`;
                    for (const p of queryParams) {
                        const name = p.name.includes("-") || p.name.includes("[") ? `"${p.name}"` : p.name;
                        out += `      ${name}: ${openApiToZod(p.schema, p.required)},\n`;
                    }
                    out += `    }).optional(),\n`;
                }

                if (bodySchema) {
                    out += `    body: ${openApiToZod(bodySchema, !!actionMeta.requestBody.required)},\n`;
                }

                out += `  });\n`;
            }

            // Generate ActionSchemaMap
            const enumName = resource === "default" ? `Constants.${productPascal}.Action` : `Constants.${productPascal}.${resourceName}Action`;
            const mapName = `${resourceName}ActionSchemaMap`;
            out += `  export const ${mapName}: Record<string, { schema: z.ZodObject<any>, call: (client: any, data: any) => Promise<any> }> = {\n`;
            for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
                const actionPascal = toPascalCase(action);
                const schemaName = `${resourceName}${actionPascal}Args`;
                
                // Construct call arguments
                const callArgs = [];
                // 1. Path params
                const pathParamNames = (actionMeta.path.match(/\{([^}]+)\}/g) || []).map(s => s.slice(1, -1));
                for (let i = 0; i < pathParamNames.length; i++) {
                    callArgs.push(`data.positional[${i}]`);
                }
                // 2. Request body
                if (actionMeta.requestBody) {
                    callArgs.push(`data.body`);
                }
                // 3. Query params
                const queryParams = actionMeta.parameters.filter(p => p.in === "query");
                for (const p of queryParams) {
                    callArgs.push(`data.options?.["${p.name}"]`);
                }

                const clientDataArg = callArgs.length > 0 ? "data" : "_data";

                out += `    [${enumName}.${actionPascal}]: {\n`;
                out += `      schema: ${schemaName},\n`;
                out += `      call: (client, ${clientDataArg}) => client.${actionMeta.methodName}(${callArgs.join(", ")})\n`;
                out += `    },\n`;
            }
            out += `  };\n`;
        }
        out += "}\n\n";
    }

    return out;
}

export function generateGoConstants(m: CLIMetadata): string {
  let pkgName = m.product.replace(/-/g, "");
  if (m.product === "test-management") pkgName = "management";
  if (m.product === "test-reporting") pkgName = "reporting";
  if (m.product === "app-automate") pkgName = "appautomate";
  
  let out = `package ${pkgName}\n\n`;
  out += "// Generated CLI constants. Do not modify.\n\n";

  const productPascal = toPascalCase(m.product);
  out += `const Product${productPascal} = "${m.product}"\n\n`;

  // Resources
  const resourceKeys = Object.keys(m.resources).filter(k => k !== "default");
  if (resourceKeys.length > 0) {
    out += "const (\n";
    for (const resource of resourceKeys) {
        out += `\tResource${toPascalCase(resource)} = "${resource}"\n`;
    }
    out += ")\n\n";
  }

  // Actions
  for (const [resource, resMeta] of Object.entries(m.resources)) {
    const prefix = resource === "default" ? "Action" : `${toPascalCase(resource)}Action`;
    out += `// ${resource || "default"} actions\nconst (\n`;
    for (const action of Object.keys(resMeta.actions)) {
        out += `\t${prefix}${toPascalCase(action)} = "${action}"\n`;
    }
    out += ")\n\n";
  }

  return out;
}
