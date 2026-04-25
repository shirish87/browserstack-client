import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "local-testing",
    environment: "node",
  },
});
