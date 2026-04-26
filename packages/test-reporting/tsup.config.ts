import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  define: { __PKG_VERSION__: JSON.stringify(pkg.version) },
  entry: ["src/index.ts"],
  noExternal: [
    "@browserstack-client/core",
    "@browserstack-client/openapi",
    "@browserstack-client/openapi-transforms",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
});
