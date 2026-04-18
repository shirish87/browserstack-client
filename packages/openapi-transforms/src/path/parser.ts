import type { PathAst, PathNode } from "./types.js";

export function parsePath(input: string): PathAst {
  if (!input.startsWith("$")) throw new Error(`path must start with $, got: ${input}`);
  const out: PathNode[] = [{ kind: "root" }];
  let i = 1;
  while (i < input.length) {
    const c = input[i];
    if (c === ".") {
      if (input[i + 1] === ".") throw new Error(`unsupported path syntax (recursive descent): ${input}`);
      i++;
      let name = "";
      while (i < input.length && /[A-Za-z0-9_]/.test(input[i]!)) { name += input[i]!; i++; }
      if (!name) throw new Error(`expected field name after . at offset ${i}`);
      out.push({ kind: "field", name });
    } else if (c === "[") {
      const close = input.indexOf("]", i);
      if (close === -1) throw new Error(`unclosed bracket in path: ${input}`);
      const inner = input.slice(i + 1, close);
      if (inner === "*") out.push({ kind: "wildcard" });
      else if (/^\d+$/.test(inner)) out.push({ kind: "index", index: Number(inner) });
      else throw new Error(`unsupported path syntax: [${inner}]`);
      i = close + 1;
    } else {
      throw new Error(`unexpected character '${c}' at offset ${i} in ${input}`);
    }
  }
  return out;
}
