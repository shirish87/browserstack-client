import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "browserstack-client",
      fileName: "browserstack-client",
    },
  },
  plugins: [],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
