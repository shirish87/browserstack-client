import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "browserstack-local": "src/browserstack-local.ts",
    "browserstack-app-automate": "src/browserstack-app-automate.ts",
  },
  format: ["esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  platform: "node",
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: [
    "@browserstack-client/core",
    "@browserstack-client/local-testing-binary",
    "@browserstack-client/app-automate",
    "signal-exit",
  ],
});
