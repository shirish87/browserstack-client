import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm", "cjs"],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  platform: "node",
  noExternal: [
    "@dot-slash/browserstack-core",
    "@dot-slash/browserstack-local-testing-api",
    "@dot-slash/browserstack-openapi",
  ],
  external: [
    "fflate",
  ],
});
