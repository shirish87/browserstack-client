import { defineConfig } from "tsup";
import { createRequire } from "node:module";
import fs from "node:fs";

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
  shims: true,
  outDir: "dist-binary",
  noExternal: [/.*/],
  define: {
    "globalThis.__BUILD_TARGET__": '"binary"',
    "globalThis.__CLI_VERSION__": JSON.stringify(version),
    "__PKG_VERSION__": JSON.stringify(version),
  },
  async onSuccess() {
    // Several bundled UMD modules use `})(this, function` at module scope to
    // self-register. In pkg's snapshot (strict mode), `this` is undefined so
    // they silently fail, causing "_a is not defined" at runtime. Patch every
    // occurrence in the output bundles.
    for (const name of ["browserstack-client.cjs", "browserstack-test-reporting.cjs"]) {
      const p = `dist-binary/${name}`;
      const src = await fs.promises.readFile(p, "utf8");
      const patched = src.replaceAll("})(this,", "})(globalThis,");
      if (patched !== src) await fs.promises.writeFile(p, patched);
    }
  },
});

