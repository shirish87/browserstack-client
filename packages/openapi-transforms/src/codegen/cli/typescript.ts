import { CLIMetadata } from "./index";
import { toPascalCase } from "../golang/case";

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
                const pathParamNames = (actionMeta.path.match(/\{([^}]+)\}/g) || []).map((s: string) => s.slice(1, -1));
                const pathParams = pathParamNames.map((name: string) => {
                    const p = actionMeta.parameters.find((p: any) => p.name === name && p.in === "path");
                    return { name, schema: p?.schema || { type: "string" }, required: true };
                });

                // Get query params — all params are positional for CLI consistency with Go
                const queryParams = actionMeta.parameters.filter((p: any) => p.in === "query");

                // Get body schema
                const bodySchema = actionMeta.requestBody?.content?.["application/json"]?.schema;

                out += `  export const ${resourceName}${actionPascal}Args = z.object({\n`;
                out += `    positional: z.tuple([\n`;
                for (const p of pathParams) {
                    out += `      ${openApiToZod(p.schema, true)},\n`;
                }
                for (const p of queryParams) {
                    out += `      ${openApiToZod(p.schema, false)},\n`;
                }
                out += `    ]),\n`;

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
                // 1. Path params (positional)
                const pathParamNames2 = (actionMeta.path.match(/\{([^}]+)\}/g) || []).map((s: string) => s.slice(1, -1));
                for (let i = 0; i < pathParamNames2.length; i++) {
                    callArgs.push(`data.positional[${i}]`);
                }
                // 2. Request body
                if (actionMeta.requestBody) {
                    callArgs.push(`data.body`);
                }
                // 3. Query params (positional, continuing index after path params)
                const queryParams2 = actionMeta.parameters.filter((p: any) => p.in === "query");
                for (let i = 0; i < queryParams2.length; i++) {
                    callArgs.push(`data.positional[${pathParamNames2.length + i}]`);
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