import { defineConfig } from "vitest/config";

export default defineConfig({
  define: { __PKG_VERSION__: '"4.0.0-test"' },
  test: {
    globals: true,
    name: "local-testing",
    environment: "node",
  },
});
