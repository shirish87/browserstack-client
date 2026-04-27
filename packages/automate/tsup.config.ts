import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  define: { __PKG_VERSION__: JSON.stringify(pkg.version) },
  entry: {
    index: "src/index.ts",
    "schemas/index": "src/schemas/index.ts",
    "schemas/v5/index": "src/schemas/v5/index.ts",
    "test/index": "src/test/index.ts",
  },
  format: ["esm", "cjs"],
  platform: "browser",
  dts: false, // DTS generation handled separately
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
