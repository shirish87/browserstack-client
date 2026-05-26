#!/usr/bin/env node

import { ensureAccessKeyExists, formatError } from "./utils.ts";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import { LocalTestingClient } from "@dot-slash/browserstack-local-testing-api";
import process from "node:process";
import { LocalTesting } from "./constants.generated.ts";
import { LocalTestingSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";
import { actionHelp } from "./action-help.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

const USAGE = `Usage: local <action> [args...]
Actions: ${Object.values(LocalTesting.Action).join(", ")}`;

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    const accessKey = ensureAccessKeyExists();
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

    if (rest.length > 0 && rest[rest.length - 1].toLowerCase() === "help") {
      const h = actionHelp("local-testing", action);
      if (h) { logger.info(h); return; }
    }

    const schemaConfig = LocalTestingSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest, schemaConfig.argNames);
    const result = await schemaConfig.call(client, parsed);

    switch (action) {
      case LocalTesting.Action.ListInstances: {
        interface LocalInstance {
          id: string;
          localIdentifier?: string;
          startTime: string;
        }
        const instances = (result as { instances: LocalInstance[] }).instances ?? [];
        instances.forEach((inst) =>
          logger.info(`${inst.id} ${inst.localIdentifier ?? ""} ${inst.startTime}`)
        );
        logger.info(JSON.stringify(result, null, 2));
        break;
      }
      default:
        logger.info(JSON.stringify(result, null, 2));
    }

  } catch (err) {
    logger.error(formatError(err));
    process.exit(1);
  }
}

