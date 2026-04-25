import type { PathAst, PathNode } from "./types";

export function isArrayPath(ast: PathAst): boolean {
  return ast.some((n) => n.kind === "wildcard");
}

export function extract(ast: PathAst, root: unknown): unknown {
  return step(ast.slice(1), root);
}

function step(nodes: readonly PathNode[], value: unknown): unknown {
  if (nodes.length === 0) return value;
  const [head, ...rest] = nodes;
  if (head.kind === "field") {
    if (value == null || typeof value !== "object") throw new Error(`expected object, got ${typeof value}`);
    return step(rest, (value as Record<string, unknown>)[head.name]);
  }
  if (head.kind === "wildcard") {
    if (!Array.isArray(value)) throw new Error(`expected array at [*], got ${typeof value}`);
    return value.map((v) => step(rest, v));
  }
  if (head.kind === "index") {
    if (!Array.isArray(value)) throw new Error(`expected array at [${head.index}], got ${typeof value}`);
    return step(rest, value[head.index]);
  }
  if (head.kind === "root") {
    return step(rest, value);
  }
  const never: never = head;
  throw new Error(`unreachable node: ${JSON.stringify(never)}`);
}
