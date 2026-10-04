import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts", cli: "src/cli.ts" },
  format: ["esm"],
  platform: "node",
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
