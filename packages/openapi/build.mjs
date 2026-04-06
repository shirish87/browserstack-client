import SwaggerParser from "@apidevtools/swagger-parser";
import fs from "node:fs/promises";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";
import { fileURLToPath } from "node:url";

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

const ast = await openapiTS(specUrl, {
  transform(schemaObject) {
    if (schemaObject.format === "binary") {
      return schemaObject.nullable
        ? `Blob | null`
        : `Blob`;
    }
  },
});

await fs.writeFile(
  path.join(outDir, "openapi.ts"),
  astToString(ast)
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
  "js-testing": {
    pathPatterns: [/^\/browsers$/, /^\/status$/, /^\/worker/],
    description: "JS Testing product types",
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

// 5. Generate index.ts re-exporting all
const products_list = Object.keys(products);
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
