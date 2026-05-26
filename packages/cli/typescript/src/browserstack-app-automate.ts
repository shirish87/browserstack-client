#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists, formatError } from "./utils.ts";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import process from "node:process";
import { AppAutomate } from "./constants.generated.ts";
import { AppAutomateSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";
import { actionHelp } from "./action-help.ts";
import { randomBytes } from "node:crypto";

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
    ensureAccessKeyExists();
    ensureUsernameExists();

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

    if (rest.length > 0 && rest[rest.length - 1].toLowerCase() === "help") {
      const h = actionHelp("app-automate", action);
      if (h) { logger.info(h); return; }
    }

    const schemaConfig = AppAutomateSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest, schemaConfig.argNames);

    // Some actions need manual file reading or special handling before call
    if (
      action === AppAutomate.Action.UploadApp ||
      action === AppAutomate.Action.UploadEspressoApp ||
      action === AppAutomate.Action.UploadXcuiTestApp ||
      action === AppAutomate.Action.UploadMediaFile ||
      action === AppAutomate.Action.UploadFlutterAndroidApp ||
      action === AppAutomate.Action.UploadFlutterIosApp ||
      action === AppAutomate.Action.UploadDetoxAndroidApp ||
      action === AppAutomate.Action.UploadDetoxAndroidAppClient
    ) {
        if (!rest[0]) throw new BrowserStackError("Missing <file-path>");
        const filePath = resolve(rest[0]);
        const filename = basename(filePath);
        parsed.body = {
            file: new Blob([new Uint8Array(await readFile(filePath))]),
            fileName: filename,
            customId: randomBytes(20).toString("hex"),
        };
    }

    if (action === AppAutomate.Action.UploadBuildTerminalLogs || action === AppAutomate.Action.UploadSessionTerminalLogs) {
        if (!rest[1]) throw new BrowserStackError("Missing <file-path>");
        const filePath = resolve(rest[1]);
        const filename = basename(filePath);
        parsed.body = {
            file: new Blob([new Uint8Array(await readFile(filePath))]),
            fileName: filename,
        };
    }

    const result = await schemaConfig.call(client, parsed);
    logger.info(JSON.stringify(result, null, 2));
  } catch (err) {
    logger.error(formatError(err));
    process.exit(1);
  }
}
