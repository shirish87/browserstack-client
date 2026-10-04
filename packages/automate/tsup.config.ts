import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  define: { __PKG_VERSION__: JSON.stringify(pkg.version) },
  entry: {
    index: "src/index.ts",
    models: "src/models.ts",
    "schemas/index": "src/schemas/index.ts",
    "schemas/v5/index": "src/schemas/v5/index.ts",
    "test/index": "src/test/index.ts",
  },
  format: ["esm", "cjs"],
  platform: "browser",
  dts: {
    resolve: true,
    // Inline the build-time-only packages (core, the generated OpenAPI types): they are not published, so a
    // declaration that imported them by name could not be resolved by consumers.
    compilerOptions: { baseUrl: ".", paths: {"@dot-slash/browserstack-core": ["../core/src/index.ts"], "@dot-slash/browserstack-openapi-transforms": ["../openapi-transforms/src/index.ts"], "@dot-slash/browserstack-openapi/automate/client": ["../openapi/generated/automate.client.ts"], "@dot-slash/browserstack-openapi/automate/models": ["../openapi/generated/automate.models.ts"], "@dot-slash/browserstack-openapi/automate": ["../openapi/generated/automate.ts"]} },
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  noExternal: [
    "@dot-slash/browserstack-core",
    "@dot-slash/browserstack-openapi",
    "@dot-slash/browserstack-openapi-transforms",
  ],
  external: [
    "vitest",
    "zod",
  ],
});
