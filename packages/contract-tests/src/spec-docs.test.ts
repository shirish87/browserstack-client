import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const specsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../openapi/specs");

// Spec descriptions flow into JSDoc, then typedoc markdown, then VitePress, which compiles the
// markdown as Vue templates. A raw `<tag>` or `{{ }}` outside a code span breaks `pnpm docs:build`.
describe("spec descriptions are safe for the generated docs", () => {
  for (const file of readdirSync(specsDir).filter((f) => f.endsWith(".yml"))) {
    it(`${file} has no raw HTML-like text or template braces in descriptions`, () => {
      const offenders = readFileSync(path.join(specsDir, file), "utf-8")
        .split("\n")
        .filter((line) => /^\s*description:/.test(line))
        .map((line) => line.replace(/`[^`]*`/g, ""))
        .filter((line) => /<[A-Za-z/]|\{\{/.test(line));
      expect(offenders).toEqual([]);
    });
  }
});
