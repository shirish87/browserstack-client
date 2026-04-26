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

function goType(prop: SchemaProperty, required: boolean, knownTypes: Set<string>): string {
  const ptr = required ? "" : "*";
  if (prop.$ref) {
    const name = toPascalCase(prop.$ref.replace(/^.*\//, ""));
    if (knownTypes.has(name)) {
      return `${ptr}${name}`;
    }
    return "map[string]any";
  }
  switch (prop.type) {
    case "string":  return `${ptr}string`;
    case "integer": return `${ptr}int`;
    case "number":  return `${ptr}float64`;
    case "boolean": return `${ptr}bool`;
    case "array": {
      const itemType = prop.items?.type ?? "any";
      let goItem = "any";
      if (prop.items?.$ref) {
        const name = toPascalCase(prop.items.$ref.replace(/^.*\//, ""));
        goItem = knownTypes.has(name) ? name : "map[string]any";
      } else {
        goItem = itemType === "string" ? "string"
          : itemType === "integer" ? "int"
          : itemType === "number" ? "float64"
          : itemType === "boolean" ? "bool"
          : "any";
      }
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

function emitStruct(name: string, rawSchema: SchemaObject, knownTypes: Set<string>): string {
  const schema = mergeAllOf(rawSchema);
  const required = new Set(schema.required ?? []);
  const fields = Object.entries(schema.properties ?? {}).map(([fieldName, prop]) => {
    const goName = toPascalCase(fieldName).replace(/[^a-zA-Z0-9_]/g, "");
    const isRequired = required.has(fieldName);
    const typ = goType(prop, isRequired, knownTypes);
    return `\t${goName} ${typ} \`json:"${fieldName}"\``;
  });
  return `type ${toPascalCase(name)} struct {\n${fields.join("\n")}\n}`;
}

function emitArrayAlias(name: string, schema: SchemaObject, knownTypes: Set<string>): string {
  const itemSchema = schema.items;
  let elemType = "any";
  if (itemSchema?.$ref) {
    const refName = toPascalCase(itemSchema.$ref.replace(/^.*\//, ""));
    elemType = knownTypes.has(refName) ? refName : "map[string]any";
  } else if (itemSchema?.type || (itemSchema as any)?.properties) {
    if (itemSchema?.type === "object" || (itemSchema as any)?.properties) {
      const itemName = toPascalCase(itemSchema?.title ?? (name + "Item"));
      elemType = knownTypes.has(itemName) ? itemName : "map[string]any";
    } else {
      elemType = itemSchema?.type === "string" ? "string"
        : itemSchema?.type === "integer" ? "int"
        : itemSchema?.type === "number" ? "float64"
        : itemSchema?.type === "boolean" ? "bool"
        : "any";
    }
  }
  return `type ${toPascalCase(name)} []${elemType}`;
}

export function emitGoTypes(product: string, schemas: Schemas): string {
  const pkg = toGoPackageName(product);
  const seenDecls = new Set<string>();
  const knownTypes = new Set(Object.keys(schemas).map(toPascalCase));
  
  const decls = Object.entries(schemas)
    .filter(([, s]) => s.type === "object" || s.properties !== undefined || s.allOf !== undefined || s.type === "array")
    .map(([name, schema]) => {
      const goName = toPascalCase(name);
      if (seenDecls.has(goName)) {
        return "";
      }
      seenDecls.add(goName);
      if (schema.type === "array") return emitArrayAlias(name, schema, knownTypes);
      return emitStruct(name, schema, knownTypes);
    })
    .filter(decl => decl !== "")
    .join("\n\n");
  return `package ${pkg}\n\n${decls}\n`;
}
