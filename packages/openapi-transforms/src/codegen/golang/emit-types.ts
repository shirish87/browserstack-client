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

function emitStruct(name: string, schema: SchemaObject): string {
  const required = new Set(schema.required ?? []);
  const fields = Object.entries(schema.properties ?? {}).map(([fieldName, prop]) => {
    const goName = toPascalCase(fieldName);
    const isRequired = required.has(fieldName);
    const typ = goType(prop, isRequired);
    return `\t${goName} ${typ} \`json:"${fieldName}"\``;
  });
  return `type ${toPascalCase(name)} struct {\n${fields.join("\n")}\n}`;
}

export function emitGoTypes(product: string, schemas: Schemas): string {
  const pkg = toGoPackageName(product);
  const structs = Object.entries(schemas)
    .filter(([, s]) => s.type === "object" || s.properties !== undefined)
    .map(([name, schema]) => emitStruct(name, schema))
    .join("\n\n");
  return `package ${pkg}\n\n${structs}\n`;
}
