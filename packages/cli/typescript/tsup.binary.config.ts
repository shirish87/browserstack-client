import { defineConfig } from "tsup";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const { version } = require("./package.json") as { version: string };

// yoga-layout-prebuilt's nbind.js uses `this` at module scope to register
// itself via a UMD wrapper. In pkg's snapshot environment (strict mode, no
// global `this`), that `this` is undefined and the registration silently
// fails, causing "_a is not defined" at runtime. We patch the file on load
// to replace `})(this, function` with `})(globalThis, function` so the UMD
// call always resolves to a real global object.
const patchYogaPlugin = {
  name: "patch-yoga-nbind",
  setup(build: any) {
    build.onLoad({ filter: /yoga-layout-prebuilt.*nbind\.js$/ }, async (args: any) => {
      let contents = await fs.promises.readFile(args.path, "utf8");
      contents = contents.replace("})(this, function", "})(globalThis, function");
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
  esbuildPlugins: [patchYogaPlugin],
});

