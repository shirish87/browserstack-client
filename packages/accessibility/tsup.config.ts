import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  define: { __PKG_VERSION__: JSON.stringify(pkg.version) },
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
