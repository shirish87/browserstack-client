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
  format: ["esm", "cjs"],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  platform: "node",
  shims: true,
  define: {
    __PKG_VERSION__: JSON.stringify(require("./package.json").version),
  },
  noExternal: [
    "@dot-slash/browserstack-core",
    "@dot-slash/browserstack-local-testing",
    "@dot-slash/browserstack-app-automate",
    "@dot-slash/browserstack-automate",
    "@dot-slash/browserstack-local-testing-api",
    "@dot-slash/browserstack-test-management",
    "@dot-slash/browserstack-accessibility",
    "@dot-slash/browserstack-test-reporting",
    "@dot-slash/browserstack-screenshots",
    "@dot-slash/browserstack-openapi-transforms",
  ],
  external: [],
});
