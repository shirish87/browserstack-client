import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    outDir: "dist/node",
    lib: {
      entry: [
        resolve(__dirname, "src/index.node.ts"),
        resolve(__dirname, "src/cli/browserstack-local.ts"),
      ],
      fileName: (format, name) => {
        const extn = (format === "es") ? "js" : "cjs";
        if (name.match(/browserstack-local/)) {
          return `browserstack-local.${extn}`;
        }

        return `browserstack-client.${extn}`;
      },
    },
    rollupOptions: {
      external: [/^node:/, "fs", "path", "util", "worker_threads"],
      output: {
        globals: {
          "node:child_process": "node:child_process",
          "node:fs/promises": "node:fs/promises",
          "node:path": "node:path",
          "node:crypto": "node:crypto",
          "fs": "node:fs",
          "path": "node:path",
          "util": "node:util",
          "worker_threads": "node:worker_threads"
        },
      },
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      exclude: ["**/__tests__/**", "**/**/openapi.json"],
      outDir: "dist/types",
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
