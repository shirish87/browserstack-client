import { JSONParser } from "@streamparser/json";
import type { PathAst } from "../path/types.js";
import { isArrayPath } from "../path/matcher.js";

function astToSelector(ast: PathAst): string[] {
  const parts: string[] = [];
  for (const node of ast) {
    if (node.kind === "root") continue;
    if (node.kind === "field") parts.push(node.name);
    else if (node.kind === "wildcard") parts.push("*");
    else if (node.kind === "index") parts.push(String(node.index));
  }
  return parts;
}

export async function streamExtract(
  body: ReadableStream<Uint8Array>,
  ast: PathAst,
): Promise<unknown> {
  const selector = astToSelector(ast);
  const isArray = isArrayPath(ast);
  const collected: unknown[] = [];
  let whole: unknown;
  let matched = false;

  const parser = new JSONParser({
    paths: selector.length === 0 ? ["$"] : ["$." + selector.join(".")],
    keepStack: false,
  });

  parser.onValue = ({ value }) => {
    matched = true;
    if (selector.length === 0) whole = value;
    else if (isArray) collected.push(value);
    else whole = value;
  };

  const reader = body.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      parser.write(value);
    }
    if (!parser.isEnded) {
      parser.end();
    }
  } catch (cause) {
    throw cause instanceof Error ? cause : new Error(String(cause));
  }

  if (!matched && !isArray) {
    throw new Error(`path did not match any value: ${selector.join(".") || "$"}`);
  }
  return isArray ? collected : whole;
}
