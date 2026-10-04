import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  define: { __PKG_VERSION__: JSON.stringify(pkg.version) },
  entry: {
    index: "src/index.ts",
    models: "src/models.ts",
  },
  external: ["zod"],
  noExternal: [
    "@dot-slash/browserstack-core",
    "@dot-slash/browserstack-openapi",
    "@dot-slash/browserstack-openapi-transforms",
  ],
  format: ["esm", "cjs"],
  platform: "browser",
  dts: {
    resolve: true,
    // Inline the build-time-only packages (core, the generated OpenAPI types): they are not published, so a
    // declaration that imported them by name could not be resolved by consumers.
    compilerOptions: { baseUrl: ".", paths: {"@dot-slash/browserstack-core": ["../core/src/index.ts"], "@dot-slash/browserstack-openapi-transforms": ["../openapi-transforms/src/index.ts"], "@dot-slash/browserstack-openapi/test-reporting/client": ["../openapi/generated/test-reporting.client.ts"], "@dot-slash/browserstack-openapi/test-reporting/models": ["../openapi/generated/test-reporting.models.ts"], "@dot-slash/browserstack-openapi/test-reporting": ["../openapi/generated/test-reporting.ts"]} },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
});
