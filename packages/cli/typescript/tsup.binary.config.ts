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
    for (const name of ["browserstack-client.cjs", "browserstack-test-reporting.cjs"]) {
      const p = `dist-binary/${name}`;
      let src = await fs.promises.readFile(p, "utf8");

      // 1. UMD modules use `})(this, function` at module scope. In pkg's snapshot
      //    (strict mode), `this` is undefined. Replace with globalThis.
      src = src.replaceAll("})(this,", "})(globalThis,");

      // 2. esbuild drops the bare `var _a;` declaration from yoga-layout-prebuilt/nbind.js
      //    (it sees it as dead code) but the assignment `_a = _typeModule(...)` remains,
      //    causing "ReferenceError: _a is not defined". Re-insert the declaration just
      //    before the assignment site.
      src = src.replace(
        "_a = _typeModule(_typeModule),",
        "var _a; _a = _typeModule(_typeModule),"
      );

      await fs.promises.writeFile(p, src);
    }
  },
});

