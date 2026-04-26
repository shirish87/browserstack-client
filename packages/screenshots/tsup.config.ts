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
  noExternal: [
    "@browserstack-client/core",
    "@browserstack-client/openapi",
    "@browserstack-client/openapi-transforms",
  ],
  external: [
    "vitest",
    "zod",
  ],
});
