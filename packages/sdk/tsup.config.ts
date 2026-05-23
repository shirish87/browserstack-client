import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "automate/index": "src/automate/index.ts",
    "app-automate/index": "src/app-automate/index.ts",
    "local-testing/index": "src/local-testing/index.ts",
    "accessibility/index": "src/accessibility/index.ts",
    "test-management/index": "src/test-management/index.ts",
    "test-reporting/index": "src/test-reporting/index.ts",
    "screenshots/index": "src/screenshots/index.ts",
    "core/index": "src/core/index.ts",
  },
  format: ["esm", "cjs"],
  platform: "node",
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: [
    "@dot-slash/browserstack-automate",
    "@dot-slash/browserstack-app-automate",
    "@dot-slash/browserstack-local-testing-api",
    "@dot-slash/browserstack-local-testing",
    "@dot-slash/browserstack-accessibility",
    "@dot-slash/browserstack-test-management",
    "@dot-slash/browserstack-test-reporting",
    "@dot-slash/browserstack-screenshots",
    "@dot-slash/browserstack-core",
  ],
});
