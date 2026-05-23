import { CLIMetadata, CLIActionMetadata } from "./index";
import { toPascalCase } from "../golang/case";

function openApiToZod(schema: unknown, required: boolean): string {
    if (!schema || typeof schema !== "object") return "z.unknown()";

    const s = schema as Record<string, unknown>;
    let zod = "";
    if (s.$ref) {
        return "z.any()";
    }

    const type = Array.isArray(s.type) ? s.type[0] : s.type;

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
            zod = `z.array(${openApiToZod(s.items || {}, true)})`;
            break;
        case "object":
            const properties = (s.properties || {}) as Record<string, unknown>;
            const requiredProps = (Array.isArray(s.required) ? s.required : []) as string[];
            const props = Object.entries(properties)
                .map(([k, v]) => {
                    const name = k.includes("-") || k.includes("[") ? `"${k}"` : k;
                    const isPropRequired = requiredProps.includes(k);
                    return `${name}: ${openApiToZod(v, isPropRequired)}`;
                })
                .join(", ");
            zod = `z.object({ ${props} })`;
            break;
        default:
            if (s.oneOf || s.anyOf || s.allOf) {
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

function buildArgsSchema(
  resourceName: string,
  action: string,
  actionMeta: CLIActionMetadata,
  pathParams: Array<{ name: string; schema: unknown }>,
  queryParams: Array<{ name: string; schema: unknown }>,
  bodySchema: unknown
): string {
  let out = `  export const ${resourceName}${toPascalCase(action)}Args = z.object({\n`;
  out += `    positional: z.tuple([\n`;
  for (const p of pathParams) {
    out += `      ${openApiToZod(p.schema, true)}.describe(${JSON.stringify(p.name)}),\n`;
  }
  for (const p of queryParams) {
    out += `      ${openApiToZod(p.schema, false)}.describe(${JSON.stringify(p.name)}),\n`;
  }
  out += `    ]),\n`;
  if (bodySchema) {
    out += `    body: ${openApiToZod(bodySchema, !!actionMeta.requestBody?.required)},\n`;
  }
  out += `  });\n`;
  return out;
}

function buildActionMapEntry(
  action: string,
  actionMeta: CLIActionMetadata,
  resourceName: string,
  enumName: string,
  pathParamNames: string[],
  queryParams: CLIActionMetadata["parameters"]
): string {
  const actionPascal = toPascalCase(action);
  const schemaName = `${resourceName}${actionPascal}Args`;
  const callArgs: string[] = [];
  const argNames: string[] = [];

  for (let i = 0; i < pathParamNames.length; i++) {
    callArgs.push(`data.positional[${i}]`);
    argNames.push(pathParamNames[i]);
  }
  if (actionMeta.requestBody) {
    callArgs.push(`data.body`);
  }
  for (let i = 0; i < queryParams.length; i++) {
    callArgs.push(`data.positional[${pathParamNames.length + i}]`);
    argNames.push(queryParams[i].name);
  }

  const argsArray = callArgs.length > 0 ? `[${callArgs.join(", ")}]` : "[]";
  const clientDataArg = callArgs.length > 0 ? "data" : "_data";
  let out = `    [${enumName}.${actionPascal}]: {\n`;
  out += `      schema: ${schemaName},\n`;
  out += `      argNames: ${JSON.stringify(argNames)},\n`;
  out += `      call: (client, ${clientDataArg}) => callMethod(client, "${actionMeta.methodName}", ${argsArray})\n`;
  out += `    },\n`;
  return out;
}

export function generateTSSchemas(metadata: CLIMetadata[]): string {
    let out = "/**\n * Generated CLI schemas. Do not modify.\n */\n\n";
    out += "import { z } from \"zod\";\n";
    out += "import * as Constants from \"./constants.generated\";\n\n";

    out += `export interface ParsedArgs {\n`;
    out += `  positional: unknown[];\n`;
    out += `  body?: unknown;\n`;
    out += `  options?: Record<string, unknown>;\n`;
    out += `}\n\n`;
    out += `export function isApiMethod(client: object, method: string): client is Record<string, (...args: unknown[]) => Promise<unknown>> {\n`;
    out += `  return method in client && typeof (client as Record<string, unknown>)[method] === "function";\n`;
    out += `}\n\n`;
    out += `export function callMethod(client: object, method: string, args: unknown[]): Promise<unknown> {\n`;
    out += `  if (!isApiMethod(client, method)) throw new Error(\`Client does not implement method: \${method}\`);\n`;
    out += `  return client[method](...args);\n`;
    out += `}\n\n`;
    out += `export interface ZodActionConfig {\n`;
    out += `  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;\n`;
    out += `  argNames: string[];\n`;
    out += `  call: (client: object, data: ParsedArgs) => Promise<unknown>;\n`;
    out += `}\n\n`;

    for (const m of metadata) {
        const productPascal = toPascalCase(m.product);
        out += `export namespace ${productPascal}Schemas {\n`;

        for (const [resource, resMeta] of Object.entries(m.resources)) {
            const resourceName = resource === "default" ? "" : toPascalCase(resource);

            for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
                const pathParamNames = (actionMeta.path.match(/\{([^}]+)\}/g) || []).map((s: string) => s.slice(1, -1));
                const pathParams = pathParamNames.map((name: string) => {
                    const p = actionMeta.parameters.find((p) => p.name === name && p.in === "path");
                    return { name, schema: (p?.schema as unknown) || { type: "string" }, required: true };
                });
                const queryParams = actionMeta.parameters.filter((p) => p.in === "query").map(p => ({
                    name: p.name,
                    schema: (p.schema as unknown) || { type: "string" },
                    required: p.required
                }));
                const bodySchema = actionMeta.requestBody?.content?.["application/json"]?.schema;
                out += buildArgsSchema(resourceName, action, actionMeta, pathParams, queryParams, bodySchema);
            }

            const enumName = resource === "default" ? `Constants.${productPascal}.Action` : `Constants.${productPascal}.${resourceName}Action`;
            const mapName = `${resourceName}ActionSchemaMap`;
            out += `  export const ${mapName}: Record<string, ZodActionConfig> = {\n`;
            for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
                const pathParamNames = (actionMeta.path.match(/\{([^}]+)\}/g) || []).map((s: string) => s.slice(1, -1));
                const queryParams = actionMeta.parameters.filter((p) => p.in === "query");
                out += buildActionMapEntry(action, actionMeta, resourceName, enumName, pathParamNames, queryParams);
            }
            out += `  };\n`;
        }
        out += "}\n\n";
    }

    return out;
}
