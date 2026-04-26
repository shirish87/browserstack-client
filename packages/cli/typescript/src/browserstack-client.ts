#!/usr/bin/env node

import process from "node:process";
import { resolve } from "node:path";

import { main as runLocal } from "./browserstack-local.ts";
import { main as runAppAutomate } from "./browserstack-app-automate.ts";
import { main as runAutomate } from "./browserstack-automate.ts";
import { main as runLocalTesting } from "./browserstack-local-testing.ts";
import { main as runTestManagement } from "./browserstack-test-management.ts";
import { main as runAccessibility } from "./browserstack-accessibility.ts";
import { main as runTestReporting } from "./browserstack-test-reporting.ts";
import { main as runScreenshots } from "./browserstack-screenshots.ts";

import { Product } from "./constants.generated.ts";

const products: Record<string, (args: string[]) => Promise<void>> = {
  local: runLocal,
  [Product.AppAutomate]: runAppAutomate,
  [Product.Automate]: runAutomate,
  [Product.LocalTesting]: runLocalTesting,
  [Product.TestManagement]: runTestManagement,
  [Product.Accessibility]: runAccessibility,
  [Product.TestReporting]: runTestReporting,
  [Product.Screenshots]: runScreenshots,
};

export async function main(inputArgs: string[] = process.argv.slice(2)) {
  const productInput = inputArgs[0]?.toLowerCase().trim();

  if (productInput === "version") {
    const ver = (globalThis as Record<string, unknown>)["__CLI_VERSION__"] as string | undefined
      ?? (await import("../package.json", { with: { type: "json" } })).default.version;
    process.stdout.write(`browserstack-client ${ver}\n`);
    return;
  }

  if (productInput === "help") {
    const valid = ["local", ...Object.values(Product)].join(", ");
    process.stdout.write(`Usage: browserstack-client <product> <action> [args...]\n`);
    process.stdout.write(`Products: ${valid}\n`);
    return;
  }

  if (!productInput || !products[productInput]) {
    const valid = ["local", ...Object.values(Product)].join(", ");
    process.stderr.write(
      `Invalid or missing product: ${productInput ?? "(none)"} (valid: ${valid})\n`
    );
    process.exit(1);
  }

  await products[productInput](inputArgs.slice(1));
}

const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file://${resolve(process.argv[1])}` ||
  (globalThis as Record<string, unknown>)["__BUILD_TARGET__"] === "binary";

if (isMain) {
  main();
}
