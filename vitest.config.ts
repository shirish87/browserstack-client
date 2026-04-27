import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

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

const define = {
  __PKG_VERSION__: '"4.1.0-test"',
};

const testBase = {
  globals: true,
  environment: "node" as const,
};

export default defineConfig({
  test: {
    projects: [
      { define, test: { ...testBase, name: "automate", optimizeDeps: { include: ["openapi-fetch", "openapi-typescript-helpers"] } }, resolve: { alias: sharedAliases }, root: "./packages/automate" },
      { define, test: { ...testBase, name: "app-automate" }, resolve: { alias: sharedAliases }, root: "./packages/app-automate" },
      { define, test: { ...testBase, name: "local-testing" }, resolve: { alias: sharedAliases }, root: "./packages/local-testing" },
      { define, test: { ...testBase, name: "screenshots" }, resolve: { alias: sharedAliases }, root: "./packages/screenshots" },
      { define, test: { ...testBase, name: "local-testing-binary" }, resolve: { alias: sharedAliases }, root: "./packages/local-testing-binary" },
      { define, test: { ...testBase, name: "cli" }, resolve: { alias: sharedAliases }, root: "./packages/cli/typescript" },
      { define, test: { ...testBase, name: "openapi-transforms", include: ["src/**/*.test.ts"], exclude: ["dist/**", "node_modules/**"] }, resolve: { alias: sharedAliases }, root: "./packages/openapi-transforms" },
      { define, test: { ...testBase, name: "core" }, resolve: { alias: sharedAliases }, root: "./packages/core" },
      { define, test: { ...testBase, name: "test-management" }, resolve: { alias: sharedAliases }, root: "./packages/test-management" },
      { define, test: { ...testBase, name: "accessibility" }, resolve: { alias: sharedAliases }, root: "./packages/accessibility" },
      { define, test: { ...testBase, name: "test-reporting" }, resolve: { alias: sharedAliases }, root: "./packages/test-reporting" },
    ],
  },
});
