#!/usr/bin/env node

import { ensureAccessKeyExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { LocalTestingClient } from "@browserstack-client/local-testing";
import process from "node:process";
import { LocalTesting } from "./constants.generated.ts";
import { LocalTestingSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

const USAGE = `Usage: local-testing <action> [args...]
Actions: ${Object.values(LocalTesting.Action).join(", ")}`;

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    const accessKey = ensureAccessKeyExists(undefined);
    const client = new LocalTestingClient({ accessKey });

    const args = inputArgs.map((a) => a.trim());
    const actionInput = args[0]?.toLowerCase();
    const rest = args.slice(1);

    if (!actionInput || actionInput === "help") {
      logger.info(USAGE);
      return;
    }

    // Map input string to enum value
    const action = Object.values(LocalTesting.Action).find((a: string) => a.toLowerCase() === actionInput);
    if (!action) {
      throw new BrowserStackError(`Invalid action: ${actionInput}\n${USAGE}`);
    }

    const schemaConfig = LocalTestingSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest);
    const result = await schemaConfig.call(client, parsed);

    logger.info(JSON.stringify(result, null, 2));

  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error(`An unexpected error occurred: ${err}`);
    }

    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
