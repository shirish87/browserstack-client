import { toPascalCase, toGoPackageName } from "./case";

interface SchemaProperty {
  type?: string;
  items?: { type?: string };
  $ref?: string;
}

interface SchemaObject {
  type?: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  allOf?: Array<{ $ref?: string; type?: string; properties?: Record<string, SchemaProperty>; required?: string[] }>;
  items?: { type?: string; $ref?: string };
}

type Schemas = Record<string, SchemaObject>;

function goType(prop: SchemaProperty, required: boolean): string {
  const ptr = required ? "" : "*";
  if (prop.$ref) {
    const name = prop.$ref.replace(/^.*\//, "");
    return `${ptr}${toPascalCase(name)}`;
  }
  switch (prop.type) {
    case "string":  return `${ptr}string`;
    case "integer": return `${ptr}int`;
    case "number":  return `${ptr}float64`;
    case "boolean": return `${ptr}bool`;
    case "array": {
      const itemType = prop.items?.type ?? "any";
      const goItem = itemType === "string" ? "string"
        : itemType === "integer" ? "int"
        : itemType === "number" ? "float64"
        : itemType === "boolean" ? "bool"
        : "any";
      return `[]${goItem}`;
    }
    case "object":  return "map[string]any";
    default:        return "any";
  }
}

function mergeAllOf(schema: SchemaObject): SchemaObject {
  if (!schema.allOf) return schema;
  const merged: SchemaObject = { type: "object", properties: {}, required: [] };
  for (const part of schema.allOf) {
    if (part.properties) {
      Object.assign(merged.properties!, part.properties);
    }
    if (part.required) {
      merged.required!.push(...part.required);
    }
  }
  if (schema.properties) Object.assign(merged.properties!, schema.properties);
  if (schema.required) merged.required!.push(...schema.required);
  return merged;
}

function emitStruct(name: string, rawSchema: SchemaObject): string {
  const schema = mergeAllOf(rawSchema);
  const required = new Set(schema.required ?? []);
  const fields = Object.entries(schema.properties ?? {}).map(([fieldName, prop]) => {
    const goName = toPascalCase(fieldName);
    const isRequired = required.has(fieldName);
    const typ = goType(prop, isRequired);
    return `\t${goName} ${typ} \`json:"${fieldName}"\``;
  });
  return `type ${toPascalCase(name)} struct {\n${fields.join("\n")}\n}`;
}

function emitArrayAlias(name: string, schema: SchemaObject): string {
  const itemSchema = schema.items;
  let elemType = "any";
  if (itemSchema?.$ref) {
    elemType = toPascalCase(itemSchema.$ref.replace(/^.*\//, ""));
  } else if (itemSchema?.type) {
    elemType = itemSchema.type === "string" ? "string"
      : itemSchema.type === "integer" ? "int"
      : itemSchema.type === "number" ? "float64"
      : itemSchema.type === "boolean" ? "bool"
      : "any";
  }
  return `type ${toPascalCase(name)} []${elemType}`;
}

export function emitGoTypes(product: string, schemas: Schemas): string {
  const pkg = toGoPackageName(product);
  const decls = Object.entries(schemas)
    .filter(([, s]) => s.type === "object" || s.properties !== undefined || s.allOf !== undefined || s.type === "array")
    .map(([name, schema]) => {
      if (schema.type === "array") return emitArrayAlias(name, schema);
      return emitStruct(name, schema);
    })
    .join("\n\n");
  return `package ${pkg}\n\n${decls}\n`;
}
