import { describe, expect, it } from "vitest";
import path from "node:path";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { generateClientModule } from "../../codegen/typescript/index";
import { CodecRegistry } from "../../registry";
import { registerAllBuiltins } from "../../codecs/index";

function makeRegistry() {
  const r = new CodecRegistry();
  registerAllBuiltins(r);
  return r;
}

const TINY_SPEC = path.resolve(__dirname, "../fixtures/tiny-spec.yml");

describe("generateClientModule", () => {
  it("generates a module that matches the golden snapshot", async () => {
    const src = await generateClientModule({
      specPath: TINY_SPEC,
      product: "tiny",
      className: "TinyClient",
      typesImportPath: "./tiny-types",
      registry: makeRegistry(),
      baseUrl: "sdk",
    });
    expect(src).toContain("export class TinyClient extends APIClient");
    expect(src).toContain("getProject(");
    expect(src).toContain("getLogs(");
  });

  it("strips the product prefix from method names", async () => {
    const src = await generateClientModule({
      specPath: TINY_SPEC,
      product: "tiny",
      className: "TinyClient",
      typesImportPath: "./tiny-types",
      registry: makeRegistry(),
      baseUrl: "sdk",
    });
    // operationId is "getProject", product is "tiny" — no prefix to strip
    expect(src).toContain("getProject(");
  });

  it("skips operations marked x-request-custom or x-response-custom", async () => {
    const src = await generateClientModule({
      specPath: TINY_SPEC,
      product: "tiny",
      className: "TinyClient",
      typesImportPath: "./tiny-types",
      registry: makeRegistry(),
      baseUrl: "sdk",
    });
    // uploadFile has x-request-custom + x-response-custom, should be omitted
    expect(src).not.toContain("uploadFile(");
  });

  it("emits @param tags from spec param descriptions", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "gen-client-"));
    const specPath = path.join(dir, "spec.yml");
    await writeFile(specPath, `
openapi: 3.0.3
info: { title: t, version: "1" }
paths:
  /items/{itemId}:
    get:
      operationId: getItem
      description: Fetches an item by ID.
      parameters:
        - name: itemId
          in: path
          required: true
          description: The unique item ID
          schema: { type: integer }
      responses:
        "200": { description: ok, content: { application/json: { schema: { type: object } } } }
`);
    try {
      const src = await generateClientModule({
        specPath,
        product: "t",
        className: "TestClient",
        typesImportPath: "./t-types",
        registry: makeRegistry(),
        baseUrl: "sdk",
      });
      expect(src).toContain("@param itemId - The unique item ID");
      expect(src).toContain("Fetches an item by ID.");
    } finally {
      await rm(dir, { recursive: true });
    }
  });

  it("resolves $ref parameters from components", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "gen-client-"));
    const specPath = path.join(dir, "spec.yml");
    await writeFile(specPath, `
openapi: 3.0.3
info: { title: t, version: "1" }
paths:
  /items/{itemId}:
    get:
      operationId: getItem
      parameters:
        - $ref: '#/components/parameters/ItemId'
      responses:
        "200": { description: ok, content: { application/json: { schema: { type: object } } } }
components:
  parameters:
    ItemId:
      name: itemId
      in: path
      required: true
      description: The unique item ID
      schema: { type: integer }
`);
    try {
      const src = await generateClientModule({
        specPath,
        product: "t",
        className: "TestClient",
        typesImportPath: "./t-types",
        registry: makeRegistry(),
        baseUrl: "sdk",
      });
      expect(src).toContain("itemId: number");
      expect(src).toContain("@param itemId - The unique item ID");
    } finally {
      await rm(dir, { recursive: true });
    }
  });

  it("uses sdkCloud baseUrl for operations with x-base-url: sdkCloud", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "gen-client-"));
    const specPath = path.join(dir, "spec.yml");
    await writeFile(specPath, `
openapi: 3.0.3
info: { title: t, version: "1" }
paths:
  /cloud-items:
    get:
      operationId: getCloudItems
      x-base-url: sdkCloud
      responses:
        "200": { description: ok, content: { application/json: { schema: { type: object } } } }
`);
    try {
      const src = await generateClientModule({
        specPath,
        product: "t",
        className: "TestClient",
        typesImportPath: "./t-types",
        registry: makeRegistry(),
        baseUrl: "sdk",
      });
      expect(src).toContain('baseUrl: "sdkCloud"');
    } finally {
      await rm(dir, { recursive: true });
    }
  });

  it("emits array query params with [] suffix as tsType[]", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "gen-client-"));
    const specPath = path.join(dir, "spec.yml");
    await writeFile(specPath, `
openapi: 3.0.3
info: { title: t, version: "1" }
paths:
  /items:
    get:
      operationId: getItems
      parameters:
        - name: "ids[]"
          in: query
          schema: { type: array, items: { type: string } }
      responses:
        "200": { description: ok, content: { application/json: { schema: { type: object } } } }
`);
    try {
      const src = await generateClientModule({
        specPath,
        product: "t",
        className: "TestClient",
        typesImportPath: "./t-types",
        registry: makeRegistry(),
        baseUrl: "sdk",
      });
      expect(src).toContain("ids?: string[]");
    } finally {
      await rm(dir, { recursive: true });
    }
  });
});
