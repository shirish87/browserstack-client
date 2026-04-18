import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/codegen/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
  platform: "node",
  external: ["yaml"],
});
