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
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
});
