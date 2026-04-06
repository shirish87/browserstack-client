import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "adapters/index": "src/adapters/index.ts",
  },
  format: ["esm"],
  dts: false, // DTS generation handled separately
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ["openapi-fetch", "openapi-typescript-helpers"],
});
