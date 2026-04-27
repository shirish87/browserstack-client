import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/codegen/typescript/index.ts",
    "src/codegen/golang/index.ts",
    "src/codegen/cli/index.ts",
  ],
  format: ["esm", "cjs"],
  bundle: true,
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
  platform: "node",
  external: ["yaml"],
});
