import { describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateGoModule } from "../../../codegen/golang/index";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("generateGoModule snapshot", () => {
  it("matches golden types.go for tiny-spec", async () => {
    const { typesGo } = await generateGoModule({
      specPath: path.resolve(__dirname, "../../fixtures/tiny-spec.yml"),
      product: "automate",
    });
    const expected = await fs.readFile(
      path.resolve(__dirname, "../../fixtures/tiny-spec-go.expected/types.go"),
      "utf8"
    );
    expect(typesGo.replace(/\r\n/g, "\n")).toBe(expected.replace(/\r\n/g, "\n"));
  });

  it("matches golden client.go for tiny-spec", async () => {
    const { clientGo } = await generateGoModule({
      specPath: path.resolve(__dirname, "../../fixtures/tiny-spec.yml"),
      product: "automate",
      modulePath: "github.com/browserstack/browserstack-client",
    });
    const expected = await fs.readFile(
      path.resolve(__dirname, "../../fixtures/tiny-spec-go.expected/client.go"),
      "utf8"
    );
    expect(clientGo.replace(/\r\n/g, "\n")).toBe(expected.replace(/\r\n/g, "\n"));
  });
});
