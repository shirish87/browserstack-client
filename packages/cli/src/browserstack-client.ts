#!/usr/bin/env node

import process from "node:process";

import { main as runLocal } from "./browserstack-local.ts";
import { main as runAppAutomate } from "./browserstack-app-automate.ts";
import { main as runAutomate } from "./browserstack-automate.ts";
import { main as runLocalTesting } from "./browserstack-local-testing.ts";
import { main as runTestManagement } from "./browserstack-test-management.ts";

const products: Record<string, (args: string[]) => Promise<void>> = {
  local: runLocal,
  "app-automate": runAppAutomate,
  automate: runAutomate,
  "local-testing": runLocalTesting,
  "test-management": runTestManagement,
};

export async function main(inputArgs: string[] = process.argv.slice(2)) {
  const product = inputArgs[0]?.toLowerCase().trim();

  if (!product || !products[product]) {
    const valid = Object.keys(products).join(", ");
    process.stderr.write(
      `Invalid or missing product: ${product ?? "(none)"} (valid: ${valid})\n`
    );
    process.exit(1);
  }

  await products[product](inputArgs.slice(1));
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
