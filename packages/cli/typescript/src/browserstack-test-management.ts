#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists, formatError } from "./utils.ts";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import { TestManagementClient } from "@dot-slash/browserstack-test-management";
import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import process from "node:process";
import { TestManagementSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";
import { actionHelp } from "./action-help.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type TestManagementClientOptions = Partial<BrowserStackOptions>;

const ACTION_SCHEMA_MAP = {
  ...TestManagementSchemas.ProjectsActionSchemaMap,
  ...TestManagementSchemas.FoldersActionSchemaMap,
  ...TestManagementSchemas.TestCasesActionSchemaMap,
  ...TestManagementSchemas.AttachmentsActionSchemaMap,
  ...TestManagementSchemas.TestResultsActionSchemaMap,
  ...TestManagementSchemas.TestRunsActionSchemaMap,
  ...TestManagementSchemas.TestPlansActionSchemaMap,
  ...TestManagementSchemas.ConfigurationsActionSchemaMap,
  ...TestManagementSchemas.CustomFieldsActionSchemaMap,
};

const USAGE = `Usage: test-management <action> [args...]
Actions: ${Object.keys(ACTION_SCHEMA_MAP).join(", ")}`;

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    ensureAccessKeyExists();
    ensureUsernameExists();

    const args = inputArgs.map((a) => a.trim());
    const actionInput = args[0]?.toLowerCase();
    const rest = args.slice(1);
    const opts: TestManagementClientOptions = {};
    const client = new TestManagementClient(opts);

    if (!actionInput || actionInput === "help") {
      logger.info(USAGE);
      return;
    }

    const schemaConfig = ACTION_SCHEMA_MAP[actionInput];
    if (!schemaConfig) {
      throw new BrowserStackError(`Invalid action: ${actionInput}\n${USAGE}`);
    }

    if (rest.length > 0 && rest[rest.length - 1].toLowerCase() === "help") {
      const h = actionHelp("test-management", actionInput);
      if (h) { logger.info(h); return; }
    }

    const parsed = parseArgs(schemaConfig.schema, rest, schemaConfig.argNames);
    const result = await schemaConfig.call(client, parsed);

    logger.info(JSON.stringify(result, null, 2));

  } catch (err) {
    logger.error(formatError(err));
    process.exit(1);
  }
}
