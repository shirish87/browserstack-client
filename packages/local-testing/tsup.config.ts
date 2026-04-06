import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "schemas/index": "src/schemas/index.ts",
    "schemas/v5/index": "src/schemas/v5/index.ts",
    "test/index": "src/test/index.ts",
  },
  format: ["esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: [
    "@browserstack-client/core",
    "@browserstack-client/openapi",
    "fflate",
    "vitest",
    "zod",
  ],
});
