import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
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
    "vitest",
  ],
});
