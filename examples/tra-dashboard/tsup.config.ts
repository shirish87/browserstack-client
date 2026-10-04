import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "server/index.ts" },
  outDir: "dist-server",
  format: "esm",
  platform: "node",
  target: "node22",
  clean: true,
  sourcemap: true,
});
