import fs from "node:fs/promises";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import yaml from "yaml";
import { CodecRegistry, registerAllBuiltins } from "@dot-slash/browserstack-openapi-transforms";
import { generateClientModule } from "@dot-slash/browserstack-openapi-transforms/codegen/typescript";
import { generateGoModule } from "@dot-slash/browserstack-openapi-transforms/codegen/golang";
import { extractCLIMetadata, generateTSConstants, generateTSSchemas, generateGoConstants, generateGoDispatch, generateTUIManifestTS, generateTUIManifestGo } from "@dot-slash/browserstack-openapi-transforms/codegen/cli";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const outDir = path.join(__dirname, "generated");

await fs.mkdir(outDir, { recursive: true });

const blobType = ts.factory.createTypeReferenceNode("Blob");
const blobOrNull = ts.factory.createUnionTypeNode([
  blobType,
  ts.factory.createLiteralTypeNode(ts.factory.createNull()),
]);

// All products — each has its own spec in specs/<product>.yml
const allProducts = [
  "automate",
  "app-automate",
  "screenshots",
  "local-testing",
  "local-testing-binary",
  "test-management",
  "test-reporting",
  "accessibility",
  "website-scanner",
];

console.log("Generating TypeScript types...");

async function generateTSTypes(product) {
  const specPath = path.join(__dirname, "specs", `${product}.yml`);
  const mergedDoc = await loadSpecWithShared(specPath);
  const ast = await openapiTS(mergedDoc, {
    transform(schemaObject) {
      if (schemaObject.format === "binary") {
        return schemaObject.nullable ? blobOrNull : blobType;
      }
    },
  });
  await fs.writeFile(
    path.join(outDir, `${product}.ts`),
    astToString(ast)
      .replace(/ \* @description /g, " * ")
      .replace(/\/\*\* @description /g, "/** ")
  );
  console.log(`  ✓ ${product}.ts`);
}

for (const product of allProducts) {
  await generateTSTypes(product);
}

// Generate index.ts re-exporting all products
const indexContent = `/**
 * Generated OpenAPI types for all BrowserStack products
 * @internal - This is generated code. Do not modify.
 */
${allProducts.map((p) => `export * as ${p.replace(/-/g, "_")} from "./${p}.js";`).join("\n")}
`;

await fs.writeFile(path.join(outDir, "index.ts"), indexContent);

console.log("  ✓ index.ts");
console.log("✓ OpenAPI code generation complete");

console.log("Generating transform-based client modules...");
const registry = new CodecRegistry();
registerAllBuiltins(registry);

const productSpecs = [
  { product: "automate", baseUrl: "sdk" },
  { product: "app-automate", baseUrl: "sdk" },
  { product: "local-testing", baseUrl: "sdk" },
  { product: "accessibility", baseUrl: "sdk" },
  { product: "test-management", baseUrl: "sdk" },
  { product: "test-reporting", baseUrl: "sdk" },
  { product: "screenshots", baseUrl: "sdk" },
  { product: "website-scanner", baseUrl: "sdk" },
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

async function loadSpecWithShared(specPath) {
  const sharedPath = path.join(__dirname, "specs/shared.yml");
  const raw = await fs.readFile(specPath, "utf8");
  const doc = yaml.parse(raw);
  const sharedRaw = await fs.readFile(sharedPath, "utf8");
  const shared = yaml.parse(sharedRaw);
  doc.components = doc.components ?? {};
  // shared schemas are the base; product schemas override on collision
  doc.components.schemas = { ...(shared.components?.schemas ?? {}), ...doc.components.schemas };
  return doc;
}

console.log("Generating Go client modules...");

// Maps product name → Map<actionSlug, { responseType, fieldName }>
const goActionResponseTypes = new Map();

async function generateGoModules() {
  const goOutBase = path.join(__dirname, "../cli/golang/generated");
  for (const { product } of productSpecs) {
    const specFile = path.join(__dirname, "specs", `${product}.yml`);
    try {
      const mergedDoc = await loadSpecWithShared(specFile);
      const { typesGo, clientGo, dispatchResultGo, actionResponseTypes } = await generateGoModule({
        specPath: specFile,
        specDoc: mergedDoc,
        product,
        modulePath: "github.com/browserstack/browserstack-client",
      });
      const outDir = path.join(goOutBase, product);
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, "types.go"), typesGo);
      await fs.writeFile(path.join(outDir, "client.go"), clientGo);
      await fs.writeFile(path.join(outDir, "dispatch_result.generated.go"), dispatchResultGo);
      goActionResponseTypes.set(product, actionResponseTypes);
      console.log(`  ✓ ${product}/ (Go)`);
    } catch (e) {
      console.error(`  ✗ ${product}:`, e.message);
      process.exitCode = 1;
    }
  }
}

await generateGoModules();

console.log("Generating CLI constants...");
const PRODUCT_CATEGORIES = {
  "automate":          "Test Automation",
  "app-automate":      "Test Automation",
  "screenshots":       "Test Automation",
  "local-testing":     "Test Automation",
  "accessibility":     "Web Testing",
  "test-management":   "Management & Optimization",
  "test-reporting":    "Management & Optimization",
  "website-scanner":   "Automation without Coding",
};
const PRODUCT_DESCRIPTIONS = {
  "automate":          "Browser automation cloud",
  "app-automate":      "Mobile app automation cloud",
  "screenshots":       "Automated screenshot testing",
  "local-testing":     "Test on internal & staging environments",
  "accessibility":     "Automate web compliance",
  "test-management":   "Plan, track, and manage tests",
  "test-reporting":    "Monitor & optimize tests",
  "website-scanner":   "All-in-one website checker",
};
const cliMetadata = [];
const specInfoMap = {};
const specDocMap = {};
for (const { product } of productSpecs) {
  const specPath = path.join(__dirname, "specs", `${product}.yml`);
  cliMetadata.push(await extractCLIMetadata(specPath, product));
  const raw = await fs.readFile(specPath, "utf8");
  const doc = yaml.parse(raw);
  specInfoMap[product] = {
    title: doc.info?.title ?? product,
    description: PRODUCT_DESCRIPTIONS[product] ?? "",
    category: PRODUCT_CATEGORIES[product] ?? "",
  };
  specDocMap[product] = doc;
}

const tsConstants = generateTSConstants(cliMetadata);
await fs.writeFile(path.join(__dirname, "../cli/typescript/src/constants.generated.ts"), tsConstants);
console.log("  ✓ constants.generated.ts (TS)");

const tsSchemas = generateTSSchemas(cliMetadata);
await fs.writeFile(path.join(__dirname, "../cli/typescript/src/schemas.generated.ts"), tsSchemas);
console.log("  ✓ schemas.generated.ts (TS)");

const tuiManifestTS = generateTUIManifestTS(cliMetadata, specInfoMap, specDocMap);
await fs.writeFile(
  path.join(__dirname, "../cli/typescript/src/tui-manifest.generated.ts"),
  tuiManifestTS
);
console.log("  ✓ tui-manifest.generated.ts (TS)");

const tuiManifestGo = generateTUIManifestGo(cliMetadata, specInfoMap, specDocMap);

// Regression check: every action with a non-trivial requestBody must produce at least
// one body field in the TUI manifest. "Non-trivial" means the resolved body schema has
// at least one property somewhere in its tree (allOf/oneOf/anyOf/$ref). An empty
// `{ type: object }` body is legitimate (e.g. recycle-key) and is allowed to have no fields.
function hasSchemaProps(schema, doc, seen = new Set(), depth = 0) {
  if (!schema || depth > 8) return false;
  if (typeof schema === "object" && schema.$ref && typeof schema.$ref === "string") {
    if (seen.has(schema.$ref)) return false;
    seen.add(schema.$ref);
    const parts = schema.$ref.slice(2).split("/");
    let cur = doc;
    for (const p of parts) {
      cur = cur && typeof cur === "object" ? cur[p] : undefined;
      if (!cur) return false;
    }
    return hasSchemaProps(cur, doc, seen, depth + 1);
  }
  const props = schema.properties;
  if (props && typeof props === "object" && Object.keys(props).length > 0) return true;
  for (const key of ["allOf", "oneOf", "anyOf"]) {
    const arr = schema[key];
    if (Array.isArray(arr)) {
      for (const sub of arr) {
        if (hasSchemaProps(sub, doc, seen, depth + 1)) return true;
      }
    }
  }
  return false;
}

{
  const issues = [];
  for (const m of cliMetadata) {
    const doc = specDocMap[m.product];
    for (const [resKey, resMeta] of Object.entries(m.resources)) {
      for (const [actionId, actionMeta] of Object.entries(resMeta.actions)) {
        if (!actionMeta.requestBody) continue;
        const content = actionMeta.requestBody.content || {};
        const bodySchema = content["application/json"]?.schema
          ?? content["multipart/form-data"]?.schema
          ?? content["application/octet-stream"]?.schema;
        if (!bodySchema) continue;
        if (!hasSchemaProps(bodySchema, doc)) continue; // legitimately empty body
        const slice = tuiManifestTS.slice(tuiManifestTS.indexOf(`"id": "${m.product}"`));
        const actionChunk = slice.split(`"id": "`).find(c => c.startsWith(`${actionId}"`));
        if (!actionChunk?.includes(`"location": "body"`)) {
          issues.push(`${m.product}/${resKey}/${actionId}`);
        }
      }
    }
  }
  if (issues.length > 0) {
    console.error("\n✗ TUI manifest gap: the following actions have a requestBody with properties but no body fields in the manifest:");
    for (const i of issues) console.error("    " + i);
    console.error("This usually means an unresolved $ref or an unsupported schema construct.");
    console.error("Fix: ensure $ref targets resolve, or extend buildFields() in tui.ts.\n");
    process.exit(1);
  }
}

// Picker guard: every x-cli-picker.source must reference a real action.
{
  const pickerIssues = [];
  const allActionIds = new Set();
  for (const m of cliMetadata) {
    for (const resMeta of Object.values(m.resources)) {
      for (const actionId of Object.keys(resMeta.actions)) {
        allActionIds.add(`${m.product}.${actionId}`);
      }
    }
  }
  for (const m of cliMetadata) {
    for (const [resKey, resMeta] of Object.entries(m.resources)) {
      for (const [actionId, actionMeta] of Object.entries(resMeta.actions)) {
        for (const p of actionMeta.parameters || []) {
          if (p.picker?.source && !allActionIds.has(p.picker.source)) {
            pickerIssues.push(`${m.product}/${resKey}/${actionId}: param "${p.name}" → unknown picker source "${p.picker.source}"`);
          }
        }
      }
    }
  }
  if (pickerIssues.length > 0) {
    console.error("\n✗ x-cli-picker source references action that does not exist:");
    for (const i of pickerIssues) console.error("    " + i);
    console.error("Fix: correct the picker.source to an existing 'product.action-id', or annotate the source action.\n");
    process.exit(1);
  }
}

await fs.mkdir(path.join(__dirname, "../cli/golang/internal/tui"), { recursive: true });
await fs.writeFile(
  path.join(__dirname, "../cli/golang/internal/tui/manifest.generated.go"),
  tuiManifestGo
);
console.log("  ✓ manifest.generated.go (TUI)");

console.log("Generating Go CLI constants and dispatcher...");
for (const m of cliMetadata) {
  const goConstants = generateGoConstants(m);
  const constantsOutPath = path.join(__dirname, `../cli/golang/generated/${m.product}/constants.generated.go`);
  await fs.writeFile(constantsOutPath, goConstants);
  console.log(`  ✓ ${m.product}/constants.generated.go (Go)`);

  // Enrich CLI metadata actions with response type info from Go codegen
  const actionTypes = goActionResponseTypes.get(m.product);
  if (actionTypes) {
    for (const resMeta of Object.values(m.resources)) {
      for (const [action, actionMeta] of Object.entries(resMeta.actions)) {
        const info = actionTypes.get(action);
        if (info) {
          actionMeta.responseGoType = info.responseType;
          actionMeta.resultFieldName = info.fieldName;
        }
      }
    }
  }

  const goDispatch = generateGoDispatch(m);
  const dispatchOutPath = path.join(__dirname, `../cli/golang/generated/${m.product}/cli_dispatch.generated.go`);
  await fs.writeFile(dispatchOutPath, goDispatch);
  console.log(`  ✓ ${m.product}/cli_dispatch.generated.go (Go)`);
}
