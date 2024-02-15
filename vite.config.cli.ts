import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/cli",
    lib: {
      entry: resolve(__dirname, "cli/browserstack-local.ts"),
      name: "browserstack-local",
      fileName: "browserstack-local",
      formats: ["cjs"],
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
      entryRoot: "cli",
      outDir: "dist/cli/types",
    }),
  ],
  resolve: {
    alias: {
      "@browserstack-local": resolve(__dirname, "./dist/node/browserstack-client.cjs"),
    },
  },
  // test: {
  //   setupFiles: ["./src/__tests__/setup.ts"],
  // },
});
