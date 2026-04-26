#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { AccessibilityClient } from "@browserstack-client/accessibility";
import { BrowserStackOptions } from "@browserstack-client/core";
import process from "node:process";
import { Accessibility } from "./constants.generated.ts";
import { AccessibilitySchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type ClientOptions = Partial<BrowserStackOptions>;

const USAGE = `Usage: accessibility <action> [args...]
Actions: ${Object.values(Accessibility.Action).join(", ")}`;

export async function main(args: string[]): Promise<void> {
  const logger: Logger = {
    info: (msg, ...params) => console.log(msg, ...params),
    error: (msg, ...params) => console.error(msg, ...params),
  };

  try {
    const username = ensureUsernameExists(undefined);
    const accessKey = ensureAccessKeyExists(undefined);
    const opts: ClientOptions = { username, accessKey };

    const actionInput = args[0]?.toLowerCase();
    const rest = args.slice(1);
    const client = new AccessibilityClient(opts);

    if (!actionInput || actionInput === "help") {
      logger.info(USAGE);
      return;
    }

    // Map input string to enum value
    const action = Object.values(Accessibility.Action).find((a: string) => a.toLowerCase() === actionInput);
    if (!action) {
      throw new BrowserStackError(`Invalid action: ${actionInput}\n${USAGE}`);
    }

    const schemaConfig = AccessibilitySchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest);
    const result = await schemaConfig.call(client, parsed);

    logger.info(JSON.stringify(result, null, 2));

  } catch (error) {
    if (error instanceof BrowserStackError) {
      logger.error(error.message);
    } else {
      logger.error("An unexpected error occurred:", error);
    }
    process.exit(1);
  }
}
