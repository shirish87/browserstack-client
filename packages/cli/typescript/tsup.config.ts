import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "browserstack-client": "src/browserstack-client.ts",
    "browserstack-local": "src/browserstack-local.ts",
    "browserstack-app-automate": "src/browserstack-app-automate.ts",
    "browserstack-automate": "src/browserstack-automate.ts",
    "browserstack-local-testing": "src/browserstack-local-testing.ts",
    "browserstack-test-management": "src/browserstack-test-management.ts",
    "browserstack-accessibility": "src/browserstack-accessibility.ts",
    "browserstack-test-reporting": "src/browserstack-test-reporting.ts",
  },
  format: ["esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  platform: "node",
  external: [
    "@browserstack-client/core",
    "@browserstack-client/local-testing-binary",
    "@browserstack-client/app-automate",
    "@browserstack-client/automate",
    "@browserstack-client/local-testing",
    "@browserstack-client/test-management",
    "@browserstack-client/accessibility",
    "@browserstack-client/test-reporting",
    "signal-exit",
  ],
});
