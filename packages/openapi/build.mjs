import SwaggerParser from "@apidevtools/swagger-parser";
import fs from "node:fs/promises";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import { CodecRegistry, registerAllBuiltins } from "@browserstack-client/openapi-transforms";
import { generateClientModule } from "@browserstack-client/openapi-transforms/codegen/typescript";
import { generateGoModule } from "@browserstack-client/openapi-transforms/codegen/golang";
import { extractCLIMetadata, generateTSConstants, generateTSSchemas, generateGoConstants } from "@browserstack-client/openapi-transforms/codegen/cli";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const origSpecPath = path.join(__dirname, "../../openapi.yml");
const outDir = path.join(__dirname, "generated");

console.log("Bundling and validating OpenAPI spec...");

// 1. Bundle and validate the original spec
const api = await SwaggerParser.bundle(origSpecPath);
api.info.version = process.env.npm_package_version ?? api.info.version;
await SwaggerParser.validate(api);

// 2. Write bundled JSON
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  path.join(outDir, "openapi.json"),
  JSON.stringify(api, null, 2)
);

console.log("Generating TypeScript types...");

// 3. Generate comprehensive types from the spec
// For now, generate a single comprehensive type file
const specUrl = new URL("../../openapi.yml", import.meta.url);

const blobType = ts.factory.createTypeReferenceNode("Blob");
const blobOrNull = ts.factory.createUnionTypeNode([
  blobType,
  ts.factory.createLiteralTypeNode(ts.factory.createNull()),
]);

const ast = await openapiTS(specUrl, {
  transform(schemaObject) {
    if (schemaObject.format === "binary") {
      return schemaObject.nullable ? blobOrNull : blobType;
    }
  },
});

await fs.writeFile(
  path.join(outDir, "openapi.ts"),
  astToString(ast)
    .replace(/ \* @description /g, " * ")
    .replace(/\/\*\* @description /g, "/** ")
);

console.log("✓ Generated openapi.ts");

// 4. Generate per-product type aliases/re-exports
const products = {
  automate: {
    pathPatterns: [/^\/automate\//],
    description: "Automate product types",
  },
  "app-automate": {
    pathPatterns: [/^\/app-automate\//],
    description: "App Automate product types",
  },
  screenshots: {
    pathPatterns: [/^\/screenshots/],
    description: "Screenshots product types",
  },
  "local-testing": {
    pathPatterns: [/^\/local\//],
    description: "Local Testing product types",
  },
  "local-testing-binary": {
    pathPatterns: [/^\/browserstack-local/],
    description: "Local Testing Binary product types",
  },
};

// Standalone specs that have their own server base URL and are not part of openapi.yml
const standaloneSpecs = [
  { product: "test-management", description: "Test Management product types" },
  { product: "test-reporting", description: "Test Reporting & Analytics product types" },
  { product: "accessibility", description: "Accessibility product types" },
];

// Generate per-product type files by filtering paths
const paths = Object.keys(api.paths || {});

for (const [productName, productConfig] of Object.entries(products)) {
  const productPaths = paths.filter((path) =>
    productConfig.pathPatterns.some((pattern) => pattern.test(path))
  );

  // Generate a type file for this product
  // For now, just re-export from openapi.ts and filter at the paths level
  const productTypeContent = `/**
 * Types for BrowserStack ${productConfig.description}
 * @internal - This is generated code. Do not modify.
 */
export type * from "./openapi.js";

// Re-export the paths type for this product
import type { paths as allPaths } from "./openapi.js";
export type paths = Pick<allPaths, ${productPaths.map((p) => `"${p}"`).join(" | ")}>;
`;

  await fs.writeFile(
    path.join(outDir, `${productName}.ts`),
    productTypeContent
  );
  console.log(`✓ Generated ${productName}.ts (${productPaths.length} operations)`);
}

// 5. Generate types for standalone specs (separate server, not in openapi.yml)
for (const { product, description } of standaloneSpecs) {
  const specPath = path.join(__dirname, "specs", `${product}.yml`);
  const specUrl = new URL(`specs/${product}.yml`, import.meta.url);
  const standaloneAst = await openapiTS(specUrl, {
    transform(schemaObject) {
      if (schemaObject.format === "binary") {
        return schemaObject.nullable ? blobOrNull : blobType;
      }
    },
  });
  await fs.writeFile(
    path.join(outDir, `${product}.ts`),
    astToString(standaloneAst)
  );
  console.log(`✓ Generated ${product}.ts (standalone spec)`);
}

// 6. Generate index.ts re-exporting all
const products_list = [
  ...Object.keys(products),
  ...standaloneSpecs.map((s) => s.product),
];
const indexContent = `/**
 * Generated OpenAPI types for all BrowserStack products
 * @internal - This is generated code. Do not modify.
 */
export type * from "./openapi.js";

// Product-specific re-exports
${products_list.map((p) => `export * as ${p.replace(/-/g, "_")} from "./${p}.js";`).join("\n")}
`;

await fs.writeFile(path.join(outDir, "index.ts"), indexContent);

console.log("✓ Generated index.ts");
console.log("✓ OpenAPI code generation complete");

console.log("Generating transform-based client modules...");
const registry = new CodecRegistry();
registerAllBuiltins(registry);

const productSpecs = [
  { product: "automate", baseUrl: "sdk" },
  { product: "app-automate", baseUrl: "sdk" },
  { product: "screenshots", baseUrl: "sdk" },
  { product: "local-testing", baseUrl: "sdk" },
  { product: "test-management", baseUrl: "sdk" },
  { product: "accessibility", baseUrl: "sdk" },
  { product: "test-reporting", baseUrl: "sdk" },
];

const fieldOverridesPath = path.join(__dirname, "field-overrides.yaml");

for (const { product, baseUrl } of productSpecs) {
  const specPath = path.join(__dirname, "specs", `${product}.yml`);
  try {
    const src = await generateClientModule({
      specPath,
      product,
      className: `Generated${toPascal(product)}Client`,
      typesImportPath: `./${product}`,
      registry,
      baseUrl,
      fieldOverridesPath,
    });
    await fs.writeFile(path.join(outDir, `${product}.client.ts`), src);
    console.log(`  ✓ ${product}.client.ts`);
  } catch (e) {
    console.error(`  ✗ ${product}:`, e.message);
    process.exitCode = 1;
  }
}

function toPascal(s) { return s.split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1)).join(""); }

console.log("Generating Go client modules...");

async function generateGoModules() {
  const goOutBase = path.join(__dirname, "../cli/golang/generated");
  for (const { product } of productSpecs) {
    const specFile = path.join(__dirname, "specs", `${product}.yml`);
    try {
      const { typesGo, clientGo } = await generateGoModule({
        specPath: specFile,
        product,
        modulePath: "github.com/browserstack/browserstack-client",
      });
      const outDir = path.join(goOutBase, product);
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, "types.go"), typesGo);
      await fs.writeFile(path.join(outDir, "client.go"), clientGo);
      console.log(`  ✓ ${product}/ (Go)`);
    } catch (e) {
      console.error(`  ✗ ${product}:`, e.message);
      process.exitCode = 1;
    }
  }
}

await generateGoModules();

console.log("Generating CLI constants...");
const cliMetadata = [];
for (const { product } of productSpecs) {
  const specPath = path.join(__dirname, "specs", `${product}.yml`);
  cliMetadata.push(await extractCLIMetadata(specPath, product));
}

const tsConstants = generateTSConstants(cliMetadata);
await fs.writeFile(path.join(__dirname, "../cli/typescript/src/constants.generated.ts"), tsConstants);
console.log("  ✓ constants.generated.ts (TS)");

const tsSchemas = generateTSSchemas(cliMetadata);
await fs.writeFile(path.join(__dirname, "../cli/typescript/src/schemas.generated.ts"), tsSchemas);
console.log("  ✓ schemas.generated.ts (TS)");

console.log("Generating Go CLI constants...");
for (const m of cliMetadata) {
  const goConstants = generateGoConstants(m);
  const outPath = path.join(__dirname, `../cli/golang/generated/${m.product}/constants.generated.go`);
  await fs.writeFile(outPath, goConstants);
  console.log(`  ✓ ${m.product}/constants.generated.go (Go)`);
}
