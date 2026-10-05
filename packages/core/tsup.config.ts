import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "adapters/index": "src/adapters/index.ts",
  },
  format: ["esm", "cjs"],
  platform: "browser",
  dts: false, // DTS generation handled separately
  sourcemap: true,
  clean: true,
  splitting: false,
  // openapi-transforms is private (never published), so it must be inlined rather than imported.
  noExternal: ["@dot-slash/browserstack-openapi-transforms"],
  external: [],
});
