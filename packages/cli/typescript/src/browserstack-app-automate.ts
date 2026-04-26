#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists, formatError } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { AppAutomateClient, BrowserStackOptions } from "@browserstack-client/app-automate";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import process from "node:process";
import { randomBytes } from "node:crypto";
import { AppAutomate } from "./constants.generated.ts";
import { AppAutomateSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type ClientOptions = Partial<BrowserStackOptions>;

const USAGE = `Usage: app-automate <action> [args...]
Actions: ${Object.values(AppAutomate.Action).join(", ")}`;

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
    const client = new AppAutomateClient(opts);

    if (!actionInput || actionInput === "help") {
      logger.info(USAGE);
      return;
    }

    // Map input string to enum value
    const action = Object.values(AppAutomate.Action).find((a: string) => a.toLowerCase() === actionInput);
    if (!action) {
      throw new BrowserStackError(`Invalid action: ${actionInput}\n${USAGE}`);
    }

    const schemaConfig = AppAutomateSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest);
    
    // File upload handling
    if (actionInput.includes("upload")) {
        if (!rest[0]) throw new BrowserStackError("Missing <file-path>");
        const filePath = resolve(rest[0]);
        const filename = basename(filePath);
        parsed.body = {
            file: new Blob([await readFile(filePath)]),
            fileName: filename,
            customId: randomBytes(20).toString("hex"),
        };
    }

    const result = await schemaConfig.call(client, parsed);
    logger.info(JSON.stringify(result, null, 2));

  } catch (err) {
    logger.error(formatError(err));
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
