import { defineConfig } from "tsup";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const { version } = require("./package.json") as { version: string };

const patchInkPlugin = {
  name: "patch-ink",
  setup(build: any) {
    build.onLoad({ filter: /reconciler\.js$/ }, async (args: any) => {
      let contents = await fs.promises.readFile(args.path, "utf8");
      // Remove the dev-only process.env['DEV'] blocks that contain top-level await and unresolved React DevTools
      contents = contents.replace(/if\s*\(process\.env\['DEV'\]\s*===\s*'true'\)\s*\{[\s\S]*?\n\}/g, "");
      return { contents, loader: "js" };
    });
  },
};

export default defineConfig({
  entry: {
    "browserstack-client": "src/browserstack-client.ts",
    "browserstack-test-reporting": "src/browserstack-test-reporting.ts",
  },
  format: ["cjs"],
  dts: false,
  sourcemap: false,
  clean: true,
  splitting: false,
  platform: "node",
  shims: true,
  outDir: "dist-binary",
  noExternal: [/.*/],
  define: {
    "globalThis.__BUILD_TARGET__": '"binary"',
    "globalThis.__CLI_VERSION__": JSON.stringify(version),
    "__PKG_VERSION__": JSON.stringify(version),
  },
  esbuildPlugins: [patchInkPlugin],
  esbuildOptions(options) {
    options.alias = {
      "yoga-layout": require.resolve("yoga-layout/sync"),
    };
  },
});

