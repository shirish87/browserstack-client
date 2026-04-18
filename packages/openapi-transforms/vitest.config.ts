import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "openapi-transforms",
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test-d.ts"],
    typecheck: { enabled: true, include: ["src/**/*.test-d.ts"] },
  },
});
