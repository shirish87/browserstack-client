import { describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { generateClientModule } from "../../codegen/index";
import { CodecRegistry } from "../../registry";
import { registerAllBuiltins } from "../../codecs/index";

describe("codegen snapshot", () => {
  it("matches the golden file for tiny-spec", async () => {
    const r = new CodecRegistry();
    registerAllBuiltins(r);
    const actual = await generateClientModule({
      specPath: path.resolve(__dirname, "../fixtures/tiny-spec.yml"),
      className: "TinyClient",
      typesImportPath: "./tiny-types",
      registry: r,
      baseUrl: "sdk",
    });
    const expected = await fs.readFile(path.resolve(__dirname, "../fixtures/tiny-spec.expected.ts"), "utf8");
    expect(actual).toBe(expected);
  });
});
