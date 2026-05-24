import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

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

const readPkgVersion = (pkgPath: string) =>
  JSON.stringify(JSON.parse(readFileSync(path.resolve(__dirname, pkgPath), "utf-8")).version);

function project(name: string, root: string, pkgPath: string) {
  return {
    root,
    resolve: { alias: sharedAliases },
    define: { __PKG_VERSION__: readPkgVersion(pkgPath) },
    test: {
      name,
      globals: true,
      environment: "node",
    },
  };
}

export default defineConfig({
  test: {
    projects: [
      project("automate", "./packages/automate", "packages/automate/package.json"),
      project("app-automate", "./packages/app-automate", "packages/app-automate/package.json"),
      project("local-testing", "./packages/local-testing", "packages/local-testing/package.json"),
      project("screenshots", "./packages/screenshots", "packages/screenshots/package.json"),
      project("local-testing-binary", "./packages/local-testing-binary", "packages/local-testing-binary/package.json"),
      project("cli", "./packages/cli/typescript", "packages/cli/typescript/package.json"),
      {
        root: "./packages/openapi-transforms",
        resolve: { alias: sharedAliases },
        define: { __PKG_VERSION__: readPkgVersion("packages/openapi-transforms/package.json") },
        test: {
          name: "openapi-transforms",
          globals: true,
          environment: "node",
          execArgv: ["--expose-gc"],
        },
      },
      project("core", "./packages/core", "packages/core/package.json"),
      project("test-management", "./packages/test-management", "packages/test-management/package.json"),
      project("accessibility", "./packages/accessibility", "packages/accessibility/package.json"),
      project("test-reporting", "./packages/test-reporting", "packages/test-reporting/package.json"),
      project("sdk", "./packages/sdk", "packages/sdk/package.json"),
    ],
  },
});
