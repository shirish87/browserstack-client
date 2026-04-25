import type { OperationAnnotations } from "./annotations";
import { parsePath } from "../../path/parser";

function configAs(cfg: unknown, key: string): unknown {
  if (cfg !== null && typeof cfg === "object" && key in cfg) {
    return (cfg as Record<string, unknown>)[key];
  }
  return undefined;
}

export function deriveReturnType(baseType: string, ann: OperationAnnotations): string {
  switch (ann.responseCodec) {
    case "json": return baseType;
    case "text": return "string";
    case "binary": {
      const as = configAs(ann.responseCodecConfig, "as");
      return as === "blob" ? "Blob" : "ArrayBuffer";
    }
    case "json-unwrap": {
      const path = configAs(ann.responseCodecConfig, "path");
      if (typeof path !== "string") throw new Error("json-unwrap config.path missing or not a string");
      return applyPath(baseType, path);
    }
    case "json-compose": {
      return "unknown";
    }
    default:
      return "unknown";
  }
}

function applyPath(base: string, path: string): string {
  const ast = parsePath(path);
  let acc = base;
  let isArray = false;
  for (const node of ast.slice(1)) {
    if (node.kind === "field") {
      if (isArray) acc = `Array<(${acc}[number] & Record<"${node.name}", unknown>)["${node.name}"]>`;
      else acc = `(${acc} & Record<"${node.name}", unknown>)["${node.name}"]`;
    } else if (node.kind === "wildcard") {
      isArray = true;
    } else if (node.kind === "index") {
      acc = `${acc}[number]`;
    }
  }
  if (isArray && !acc.startsWith("Array<")) acc = `Array<${acc}[number]>`;
  return acc;
}
