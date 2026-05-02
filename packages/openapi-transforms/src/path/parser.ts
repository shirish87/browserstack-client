import type { PathAst, PathNode } from "./types";

function consumeField(input: string, i: number): { name: string; i: number } {
  let name = "";
  let pos = i;
  while (pos < input.length && /[A-Za-z0-9_]/.test(input[pos]!)) { name += input[pos]!; pos++; }
  if (!name) throw new Error(`expected field name after . at offset ${pos}`);
  return { name, i: pos };
}

function consumeBracket(input: string, i: number): { node: PathNode; i: number } {
  const close = input.indexOf("]", i);
  if (close === -1) throw new Error(`unclosed bracket in path: ${input}`);
  const inner = input.slice(i + 1, close);
  let node: PathNode;
  if (inner === "*") node = { kind: "wildcard" };
  else if (/^\d+$/.test(inner)) node = { kind: "index", index: Number(inner) };
  else throw new Error(`unsupported path syntax: [${inner}]`);
  return { node, i: close + 1 };
}

export function parsePath(input: string): PathAst {
  if (!input.startsWith("$")) throw new Error(`path must start with $, got: ${input}`);
  const out: PathNode[] = [{ kind: "root" }];
  let i = 1;
  while (i < input.length) {
    const c = input[i];
    if (c === ".") {
      if (input[i + 1] === ".") throw new Error(`unsupported path syntax (recursive descent): ${input}`);
      i++;
      const { name, i: next } = consumeField(input, i);
      out.push({ kind: "field", name });
      i = next;
    } else if (c === "[") {
      const { node, i: next } = consumeBracket(input, i);
      out.push(node);
      i = next;
    } else {
      throw new Error(`unexpected character '${c}' at offset ${i} in ${input}`);
    }
  }
  return out;
}
