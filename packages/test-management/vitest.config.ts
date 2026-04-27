import { defineConfig } from "vitest/config";
import { getSharedAliases } from "../../vitest-shared-config";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  define: { __PKG_VERSION__: '"4.1.0-test"' },
  test: {
    globals: true,
    name: "test-management",
    environment: "node",
  },
  resolve: {
    alias: getSharedAliases(__dirname),
  },
});
