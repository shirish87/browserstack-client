import { defineConfig } from "tsup";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("./package.json") as { version: string };

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
  outDir: "dist-binary",
  noExternal: [/.*/],
  define: {
    "globalThis.__BUILD_TARGET__": '"binary"',
    "globalThis.__CLI_VERSION__": JSON.stringify(version),
    "__PKG_VERSION__": JSON.stringify(version),
  },
});
