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

const projectBase = {
  define: {
    __PKG_VERSION__: '"4.1.0-test"',
  },
  test: {
    globals: true,
    environment: "node",
  },
  resolve: { alias: sharedAliases },
};

export default defineConfig({
  test: {
    projects: [
      { ...projectBase, test: { ...projectBase.test, name: "automate", optimizeDeps: { include: ["openapi-fetch", "openapi-typescript-helpers"] } }, root: "./packages/automate" },
      { ...projectBase, test: { ...projectBase.test, name: "app-automate" }, root: "./packages/app-automate" },
      { ...projectBase, test: { ...projectBase.test, name: "local-testing" }, root: "./packages/local-testing" },
      { ...projectBase, test: { ...projectBase.test, name: "screenshots" }, root: "./packages/screenshots" },
      { ...projectBase, test: { ...projectBase.test, name: "local-testing-binary" }, root: "./packages/local-testing-binary" },
      { ...projectBase, test: { ...projectBase.test, name: "cli" }, root: "./packages/cli/typescript" },
      { ...projectBase, test: { ...projectBase.test, name: "openapi-transforms", include: ["src/**/*.test.ts"], exclude: ["dist/**", "node_modules/**"] }, root: "./packages/openapi-transforms" },
      { ...projectBase, test: { ...projectBase.test, name: "core" }, root: "./packages/core" },
      { ...projectBase, test: { ...projectBase.test, name: "test-management" }, root: "./packages/test-management" },
      { ...projectBase, test: { ...projectBase.test, name: "accessibility" }, root: "./packages/accessibility" },
      { ...projectBase, test: { ...projectBase.test, name: "test-reporting" }, root: "./packages/test-reporting" },
    ],
  },
});
