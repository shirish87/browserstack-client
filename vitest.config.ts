import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharedAliases = {
  "@dot-slash/browserstack-core": path.resolve(__dirname, "packages/core/src/index.ts"),
  "@dot-slash/browserstack-openapi/automate/client": path.resolve(__dirname, "packages/openapi/generated/automate.client.ts"),
  "@dot-slash/browserstack-openapi/automate": path.resolve(__dirname, "packages/openapi/generated/automate.ts"),
  "@dot-slash/browserstack-openapi/app-automate/client": path.resolve(__dirname, "packages/openapi/generated/app-automate.client.ts"),
  "@dot-slash/browserstack-openapi/app-automate": path.resolve(__dirname, "packages/openapi/generated/app-automate.ts"),
  "@dot-slash/browserstack-openapi/local-testing/client": path.resolve(__dirname, "packages/openapi/generated/local-testing.client.ts"),
  "@dot-slash/browserstack-openapi/local-testing": path.resolve(__dirname, "packages/openapi/generated/local-testing.ts"),
  "@dot-slash/browserstack-openapi/screenshots/client": path.resolve(__dirname, "packages/openapi/generated/screenshots.client.ts"),
  "@dot-slash/browserstack-openapi/screenshots": path.resolve(__dirname, "packages/openapi/generated/screenshots.ts"),
  "@dot-slash/browserstack-openapi/test-management/client": path.resolve(__dirname, "packages/openapi/generated/test-management.client.ts"),
  "@dot-slash/browserstack-openapi/test-management": path.resolve(__dirname, "packages/openapi/generated/test-management.ts"),
  "@dot-slash/browserstack-openapi/accessibility/client": path.resolve(__dirname, "packages/openapi/generated/accessibility.client.ts"),
  "@dot-slash/browserstack-openapi/accessibility": path.resolve(__dirname, "packages/openapi/generated/accessibility.ts"),
  "@dot-slash/browserstack-openapi/test-reporting/client": path.resolve(__dirname, "packages/openapi/generated/test-reporting.client.ts"),
  "@dot-slash/browserstack-openapi/test-reporting": path.resolve(__dirname, "packages/openapi/generated/test-reporting.ts"),
  "@dot-slash/browserstack-openapi": path.resolve(__dirname, "packages/openapi/generated/index.ts"),
  "@dot-slash/browserstack-app-automate": path.resolve(__dirname, "packages/app-automate/src/index.ts"),
  "@dot-slash/browserstack-automate": path.resolve(__dirname, "packages/automate/src/index.ts"),
  "@dot-slash/browserstack-screenshots": path.resolve(__dirname, "packages/screenshots/src/index.ts"),
  "@dot-slash/browserstack-local-testing-api": path.resolve(__dirname, "packages/local-testing/src/index.ts"),
  "@dot-slash/browserstack-local-testing": path.resolve(__dirname, "packages/local-testing-binary/src/index.ts"),
  "@dot-slash/browserstack-test-management": path.resolve(__dirname, "packages/test-management/src/index.ts"),
  "@dot-slash/browserstack-accessibility": path.resolve(__dirname, "packages/accessibility/src/index.ts"),
  "@dot-slash/browserstack-test-reporting": path.resolve(__dirname, "packages/test-reporting/src/index.ts"),
  "@dot-slash/browserstack-cli": path.resolve(__dirname, "packages/cli/typescript/src/index.ts"),
  "@dot-slash/browserstack-openapi-transforms": path.resolve(__dirname, "packages/openapi-transforms/src/index.ts"),
};

const projectBase = {
  test: {
    globals: true,
    environment: "node",
  },
  resolve: { alias: sharedAliases },
};

const readPkgVersion = (pkgPath: string) =>
  JSON.stringify(JSON.parse(readFileSync(path.resolve(__dirname, pkgPath), "utf-8")).version);

export default defineConfig({
  test: {
    projects: [
      { ...projectBase, name: "automate", root: "./packages/automate", define: { __PKG_VERSION__: readPkgVersion("packages/automate/package.json") } },
      { ...projectBase, name: "app-automate", root: "./packages/app-automate", define: { __PKG_VERSION__: readPkgVersion("packages/app-automate/package.json") } },
      { ...projectBase, name: "local-testing", root: "./packages/local-testing", define: { __PKG_VERSION__: readPkgVersion("packages/local-testing/package.json") } },
      { ...projectBase, name: "screenshots", root: "./packages/screenshots", define: { __PKG_VERSION__: readPkgVersion("packages/screenshots/package.json") } },
      { ...projectBase, name: "local-testing-binary", root: "./packages/local-testing-binary", define: { __PKG_VERSION__: readPkgVersion("packages/local-testing-binary/package.json") } },
      { ...projectBase, name: "cli", root: "./packages/cli/typescript", define: { __PKG_VERSION__: readPkgVersion("packages/cli/typescript/package.json") } },
      { ...projectBase, name: "openapi-transforms", root: "./packages/openapi-transforms", define: { __PKG_VERSION__: readPkgVersion("packages/openapi-transforms/package.json") } },
      { ...projectBase, name: "core", root: "./packages/core", define: { __PKG_VERSION__: readPkgVersion("packages/core/package.json") } },
      { ...projectBase, name: "test-management", root: "./packages/test-management", define: { __PKG_VERSION__: readPkgVersion("packages/test-management/package.json") } },
      { ...projectBase, name: "accessibility", root: "./packages/accessibility", define: { __PKG_VERSION__: readPkgVersion("packages/accessibility/package.json") } },
      { ...projectBase, name: "test-reporting", root: "./packages/test-reporting", define: { __PKG_VERSION__: readPkgVersion("packages/test-reporting/package.json") } },
    ],
  },
});
