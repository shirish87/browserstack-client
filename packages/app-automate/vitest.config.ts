import { defineConfig } from "vitest/config";
import { getSharedAliases } from "../../vitest-shared-config";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sharedAliases = getSharedAliases(__dirname);

export default defineConfig({
  define: { __PKG_VERSION__: '"4.1.0-test"' },
  test: {
    globals: true,
    name: "app-automate",
    environment: "node",
  },
  resolve: {
    alias: [
      { find: "@dot-slash/browserstack-openapi/app-automate/client", replacement: path.resolve(__dirname, "../openapi/generated/app-automate.client.ts") },
      { find: "@dot-slash/browserstack-openapi/app-automate", replacement: path.resolve(__dirname, "../openapi/generated/app-automate.ts") },
      ...Object.entries(sharedAliases).map(([find, replacement]) => ({ find, replacement })),
    ],
  },
});
