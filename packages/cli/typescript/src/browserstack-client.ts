#!/usr/bin/env node

import process from "node:process";
import { resolve } from "node:path";
import { realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { main as runLocal } from "./browserstack-local.ts";
import { main as runAppAutomate } from "./browserstack-app-automate.ts";
import { main as runAutomate } from "./browserstack-automate.ts";
import { main as runLocalTesting } from "./browserstack-local-testing.ts";
import { main as runTestManagement } from "./browserstack-test-management.ts";
import { main as runAccessibility } from "./browserstack-accessibility.ts";
import { main as runTestReporting } from "./browserstack-test-reporting.ts";
import { main as runScreenshots } from "./browserstack-screenshots.ts";

import { Product, LocalTesting } from "./constants.generated.ts";
import { formatError } from "./utils.ts";

async function runLocalCombined(args: string[]) {
  const actionInput = args[0]?.toLowerCase().trim();
  const localTestingActions = Object.values(LocalTesting.Action) as string[];

  if (actionInput && localTestingActions.includes(actionInput)) {
    return await runLocalTesting(args);
  }

  return await runLocal(args);
}

const products: Record<string, (args: string[]) => Promise<void>> = {
  local: runLocalCombined,
  [Product.Automate]: runAutomate,
  [Product.AppAutomate]: runAppAutomate,
  [Product.Accessibility]: runAccessibility,
  [Product.TestManagement]: runTestManagement,
  [Product.TestReporting]: runTestReporting,
  [Product.Screenshots]: runScreenshots,
};

export async function main(inputArgs: string[] = process.argv.slice(2)) {
  try {
    if (inputArgs.length === 0 && process.stdout.isTTY) {
      const ver = (globalThis as Record<string, unknown>)["__CLI_VERSION__"] as string | undefined
        ?? (await import("../package.json", { assert: { type: "json" } })).default.version;
      const { render } = await import("ink");
      const React = (await import("react")).default;
      const { App } = await import("./tui/index.tsx");
      // Enter alternate screen buffer so Ink renders on a clean canvas
      // with no stale content from previous output, and the user's terminal
      // is fully restored on exit.
      process.stdout.write("\x1b[?1049h\x1b[H");
      process.on("exit", () => process.stdout.write("\x1b[?1049l"));
      const { waitUntilExit } = render(React.createElement(App, { version: ver }));
      await waitUntilExit();
      process.stdout.write("\x1b[?1049l");
      return;
    }

    const productInput = inputArgs[0]?.toLowerCase().trim();

    if (productInput === "version") {
      const ver = (globalThis as Record<string, unknown>)["__CLI_VERSION__"] as string | undefined
        ?? (await import("../package.json", { assert: { type: "json" } })).default.version;
      process.stdout.write(`browserstack-client ${ver}\n`);
      return;
    }

    const validProducts = ["local", ...Object.values(Product).filter(p => p !== Product.LocalTesting)];

    if (productInput === "help") {
      const valid = validProducts.join(", ");
      process.stdout.write(`Usage: browserstack-client <product> <action> [args...]\n`);
      process.stdout.write(`Products: ${valid}\n`);
      return;
    }

    if (!productInput || !products[productInput]) {
      const valid = validProducts.join(", ");
      process.stderr.write(
        `Invalid or missing product: ${productInput ?? "(none)"} (valid: ${valid})\n`
      );
      process.exit(1);
    }

    await products[productInput](inputArgs.slice(1));
  } catch (err) {
    process.stderr.write(`${formatError(err)}\n`);
    process.exit(1);
  }
}

const isMain =
  import.meta.url === pathToFileURL(process.argv[1]).href ||
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href ||
  (() => {
    try {
      return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
    } catch {
      return false;
    }
  })() ||
  (globalThis as Record<string, unknown>)["__BUILD_TARGET__"] === "binary";

if (isMain) {
  main();
}
