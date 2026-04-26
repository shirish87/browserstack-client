#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists, formatError } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { ScreenshotsClient } from "@browserstack-client/screenshots";
import { BrowserStackOptions } from "@browserstack-client/core";
import { resolve } from "node:path";
import process from "node:process";
import { Screenshots } from "./constants.generated.ts";
import { ScreenshotsSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type ClientOptions = Partial<BrowserStackOptions>;

const USAGE = `Usage: screenshots <action> [args...]
Actions: ${Object.values(Screenshots.Action).join(", ")}`;

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    ensureAccessKeyExists(undefined);
    ensureUsernameExists(undefined);

    const args = inputArgs.map((a) => a.trim());
    const actionInput = args[0]?.toLowerCase();
    const rest = args.slice(1);
    const opts: ClientOptions = {};
    const client = new ScreenshotsClient(opts);

    if (!actionInput || actionInput === "help") {
      logger.info(USAGE);
      return;
    }

    const action = Object.values(Screenshots.Action).find((a: string) => a.toLowerCase() === actionInput);
    if (!action) {
      throw new BrowserStackError(`Invalid action: ${actionInput}\n${USAGE}`);
    }

    const schemaConfig = ScreenshotsSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
      throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest);
    const result = await schemaConfig.call(client, parsed);

    logger.info(JSON.stringify(result, null, 2));
  } catch (err) {
    logger.error(formatError(err));
    process.exit(1);
  }
}

const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file://${resolve(process.argv[1])}`;

if (isMain) {
  main();
}
