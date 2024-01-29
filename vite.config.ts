import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "browserstack-client",
      fileName: "browserstack-client",
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      exclude: [
        "**/__tests__/**",
        "**/**/openapi.json",
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
