import { defineConfig } from "vitest/config";
import { getSharedAliases } from "../../vitest-shared-config";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    name: "automate",
    environment: "node",
  },
});
