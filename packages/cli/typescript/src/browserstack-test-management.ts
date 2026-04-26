#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { TestManagementClient, BrowserStackOptions } from "@browserstack-client/test-management";
import { resolve } from "node:path";
import process from "node:process";
import { TestManagement } from "./constants.generated.ts";
import { TestManagementSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type TestManagementClientOptions = Partial<BrowserStackOptions>;

const USAGE = `Usage: test-management <resource> <action> [args...]
Resources: ${Object.values(TestManagement.Resource).join(", ")}`;

const SCHEMA_MAPS: Record<string, Record<string, { schema: any, call: any }>> = {
  [TestManagement.Resource.Projects]: TestManagementSchemas.ProjectsActionSchemaMap,
  [TestManagement.Resource.Folders]: TestManagementSchemas.FoldersActionSchemaMap,
  [TestManagement.Resource.TestCases]: TestManagementSchemas.TestCasesActionSchemaMap,
  [TestManagement.Resource.Attachments]: TestManagementSchemas.AttachmentsActionSchemaMap,
  [TestManagement.Resource.TestResults]: TestManagementSchemas.TestResultsActionSchemaMap,
  [TestManagement.Resource.TestRuns]: TestManagementSchemas.TestRunsActionSchemaMap,
  [TestManagement.Resource.TestPlans]: TestManagementSchemas.TestPlansActionSchemaMap,
  [TestManagement.Resource.Configurations]: TestManagementSchemas.ConfigurationsActionSchemaMap,
  [TestManagement.Resource.CustomFields]: TestManagementSchemas.CustomFieldsActionSchemaMap,
};

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    ensureAccessKeyExists(undefined);
    ensureUsernameExists(undefined);

    const args = inputArgs.map((a) => a.trim());
    const resourceInput = args[0]?.toLowerCase();
    const actionInput = args[1]?.toLowerCase();
    const rest = args.slice(2);
    const opts: TestManagementClientOptions = {};
    const client = new TestManagementClient(opts);

    if (!resourceInput || resourceInput === "help") {
      logger.info(USAGE);
      return;
    }

    // Map input string to enum value
    const resource = Object.values(TestManagement.Resource).find((r: string) => r.toLowerCase() === resourceInput);
    if (!resource) {
      throw new BrowserStackError(`Invalid resource: ${resourceInput}\n${USAGE}`);
    }

    const schemaMap = SCHEMA_MAPS[resource];
    
    if (!actionInput || actionInput === "help") {
      logger.info(`Usage: test-management ${resourceInput} <action> [args...]`);
      logger.info(`Actions: ${Object.keys(schemaMap).join(", ")}`);
      return;
    }

    const schemaConfig = schemaMap[actionInput];
    if (!schemaConfig) {
        throw new BrowserStackError(`Invalid action: ${actionInput} for resource: ${resourceInput}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest);
    const result = await schemaConfig.call(client, parsed);

    logger.info(JSON.stringify(result, null, 2));

  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file://${resolve(process.argv[1])}`;

if (isMain) {
  main();
}
