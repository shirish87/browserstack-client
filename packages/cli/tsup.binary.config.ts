import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "browserstack-client": "src/browserstack-client.ts",
  },
  format: ["cjs"],
  dts: false,
  sourcemap: false,
  clean: true,
  splitting: false,
  platform: "node",
  outDir: "dist-binary",
  noExternal: [/.*/],
});
