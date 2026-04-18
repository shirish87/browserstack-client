import type { OperationAnnotations } from "./annotations.js";
import { parsePath } from "../path/parser.js";

export function deriveReturnType(baseType: string, ann: OperationAnnotations): string {
  switch (ann.responseCodec) {
    case "json": return baseType;
    case "text": return "string";
    case "binary": {
      const as = (ann.responseCodecConfig as any)?.as;
      return as === "blob" ? "Blob" : "ArrayBuffer";
    }
    case "json-unwrap": {
      const path = (ann.responseCodecConfig as any).path as string;
      return applyPath(baseType, path);
    }
    case "json-compose": {
      return baseType;
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
      if (isArray) acc = `Array<${acc}[number]["${node.name}"]>`;
      else acc = `${acc}["${node.name}"]`;
    } else if (node.kind === "wildcard") {
      isArray = true;
    } else if (node.kind === "index") {
      acc = `${acc}[number]`;
    }
  }
  if (isArray && !acc.startsWith("Array<")) acc = `Array<${acc}[number]>`;
  return acc;
}
