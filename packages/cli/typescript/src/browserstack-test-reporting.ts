#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists, formatError } from "./utils.ts";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import process from "node:process";
import { TestReporting } from "./constants.generated.ts";
import { TestReportingSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type TestReportingClientOptions = Partial<BrowserStackOptions & { uploadBaseUrl?: string }>;

const USAGE = `Usage: test-reporting <action> [args...]
Actions: ${Object.values(TestReporting.Action).join(", ")}`;

// ── top-level dispatch ────────────────────────────────────────────────────────

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
    const opts: TestReportingClientOptions = {};
    const client = new TestReportingClient(opts);

    if (!actionInput || actionInput === "help") {
      logger.info(USAGE);
      return;
    }

    // Map input string to enum value
    const action = Object.values(TestReporting.Action).find((a: string) => a.toLowerCase() === actionInput);
    if (!action) {
      throw new BrowserStackError(`Invalid action: ${actionInput}\n${USAGE}`);
    }

    const schemaConfig = TestReportingSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest, schemaConfig.argNames);

    // Special handling for upload
    if (action === TestReporting.Action.UploadReport) {
        if (!rest[0]) throw new BrowserStackError("Missing <file-path>");
        const filePath = resolve(rest[0]);
        const data = await readFile(filePath);
        const filename = basename(filePath);
        // Note: UploadReport schema might be empty positional, but we need these manually for now
        // since the API takes an object that isn't fully captured as a body in the spec sometimes
        await client.uploadReport({
          file: new Blob([new Uint8Array(data)]),
          fileName: filename,
          projectName: rest[1],
          buildName: rest[2],
          format: rest[3] as never,
        });
        logger.info(`Report ${filename} uploaded.`);
        return;
    }

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

if (typeof (globalThis as unknown as { __BUILD_TARGET__?: string }).__BUILD_TARGET__ === "undefined" && isMain && !process.argv[1].endsWith('browserstack-client.js')) {
  main();
}
