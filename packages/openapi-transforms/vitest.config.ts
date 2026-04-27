import { defineConfig } from "vitest/config";

export default defineConfig({
  define: { __PKG_VERSION__: '"4.1.0-test"' },
  test: {
    globals: true,
    name: "openapi-transforms",
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test-d.ts"],
    exclude: ["dist/**", "node_modules/**"],
    typecheck: { enabled: true, include: ["src/**/*.test-d.ts"] },
  },
});
