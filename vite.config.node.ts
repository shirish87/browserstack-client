import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    outDir: "dist/node",
    lib: {
      entry: resolve(__dirname, "src/index.node.ts"),
      name: "browserstack-client",
      fileName: "browserstack-client",
    },
    rollupOptions: {
      external: [/^node:/],
      output: {
        globals: {
          "node:child_process": "node:child_process",
          "node:fs/promises": "node:fs/promises",
          "node:path": "node:path",
          "node:crypto": "node:crypto",
        },
      },
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      exclude: ["**/__tests__/**", "src/index.ts", "**/**/openapi.json"],
      outDir: "dist/node/types",
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
