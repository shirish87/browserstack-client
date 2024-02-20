#!/usr/bin/env node

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    const args = inputArgs.map((arg) => arg.trim());

    if (args.length === 0) {
      logger.error("No arguments provided");
      process.exit(1);
    }


  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error(`An unexpected error occurred: ${err}`);
    }

    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
