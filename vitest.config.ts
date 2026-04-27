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

export default defineConfig({
  test: {
    projects: [
      { test: { name: "automate", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/automate", optimizeDeps: { include: ["openapi-fetch", "openapi-typescript-helpers"] } },
      { test: { name: "app-automate", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/app-automate" },
      { test: { name: "local-testing", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/local-testing" },
      { test: { name: "screenshots", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/screenshots" },
      { test: { name: "local-testing-binary", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/local-testing-binary" },
      { test: { name: "cli", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/cli/typescript" },
      { test: { name: "openapi-transforms", environment: "node", include: ["src/**/*.test.ts"], exclude: ["dist/**", "node_modules/**"] }, resolve: { alias: sharedAliases }, root: "./packages/openapi-transforms" },
      { test: { name: "core", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/core" },
      { test: { name: "test-management", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/test-management" },
      { test: { name: "accessibility", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/accessibility" },
      { test: { name: "test-reporting", environment: "node" }, resolve: { alias: sharedAliases }, root: "./packages/test-reporting" },
    ],
  },
});
