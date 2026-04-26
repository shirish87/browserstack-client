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
  external: [
    "@browserstack-client/local-testing",
    "fflate",
    "signal-exit",
  ],
});
