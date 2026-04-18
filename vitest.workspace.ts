import { defineWorkspace } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSharedAliases(packageDir: string) {
  return {
    "@browserstack-client/core": path.resolve(__dirname, "packages/core/src/index.ts"),
    "@browserstack-client/openapi/automate/client": path.resolve(__dirname, "packages/openapi/generated/automate.client.ts"),
    "@browserstack-client/openapi/automate": path.resolve(__dirname, "packages/openapi/generated/automate.ts"),
    "@browserstack-client/openapi": path.resolve(__dirname, "packages/openapi/generated/index.ts"),
    "@browserstack-client/app-automate": path.resolve(__dirname, "packages/app-automate/src/index.ts"),
    "@browserstack-client/automate": path.resolve(__dirname, "packages/automate/src/index.ts"),
    "@browserstack-client/screenshots": path.resolve(__dirname, "packages/screenshots/src/index.ts"),
    "@browserstack-client/js-testing": path.resolve(__dirname, "packages/js-testing/src/index.ts"),
    "@browserstack-client/local-testing": path.resolve(__dirname, "packages/local-testing/src/index.ts"),
    "@browserstack-client/local-testing-binary": path.resolve(__dirname, "packages/local-testing-binary/src/index.ts"),
    "@browserstack-client/cli": path.resolve(__dirname, "packages/cli/src/index.ts"),
    "@browserstack-client/openapi-transforms": path.resolve(__dirname, "packages/openapi-transforms/src/index.ts"),
  };
}

export default defineWorkspace([
  {
    test: {
      name: "automate",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("automate") },
    root: "./packages/automate",
    optimizeDeps: {
      include: ["openapi-fetch", "openapi-typescript-helpers"],
    },
  },
  {
    test: {
      name: "app-automate",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("app-automate") },
    root: "./packages/app-automate",
  },
  {
    test: {
      name: "local-testing",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("local-testing") },
    root: "./packages/local-testing",
  },
  {
    test: {
      name: "screenshots",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("screenshots") },
    root: "./packages/screenshots",
  },
  {
    test: {
      name: "js-testing",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("js-testing") },
    root: "./packages/js-testing",
  },
  {
    test: {
      name: "local-testing-binary",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("local-testing-binary") },
    root: "./packages/local-testing-binary",
  },
  {
    test: {
      name: "cli",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("cli") },
    root: "./packages/cli",
  },
  {
    test: {
      name: "openapi-transforms",
      environment: "node",
    },
    resolve: { alias: getSharedAliases("openapi-transforms") },
    root: "./packages/openapi-transforms",
  },
]);
