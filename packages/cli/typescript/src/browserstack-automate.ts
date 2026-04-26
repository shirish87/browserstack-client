#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists, formatError } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { AutomateClient, BrowserStackOptions } from "@browserstack-client/automate";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import process from "node:process";
import { Automate } from "./constants.generated.ts";
import { AutomateSchemas } from "./schemas.generated.ts";
import { parseArgs } from "./parser.ts";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type ClientOptions = Partial<BrowserStackOptions>;

const USAGE = `Usage: automate <action> [args...]
Actions: ${Object.values(Automate.Action).join(", ")}`;

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
    const client = new AutomateClient(opts);

    if (!actionInput || actionInput === "help") {
      logger.info(USAGE);
      return;
    }

    // Map input string to enum value
    const action = Object.values(Automate.Action).find((a: string) => a.toLowerCase() === actionInput);
    if (!action) {
      throw new BrowserStackError(`Invalid action: ${actionInput}\n${USAGE}`);
    }

    const schemaConfig = AutomateSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest);
    
    // Some actions need manual file reading or special handling before call
    if (action === Automate.Action.UploadMediaFile) {
        if (!rest[0]) throw new BrowserStackError("Missing <file-path>");
        const filePath = resolve(rest[0]);
        const filename = basename(filePath);
        parsed.body = {
            file: new Blob([await readFile(filePath)]),
            fileName: filename,
        };
    }

    const result = await schemaConfig.call(client, parsed);

    switch (action) {
      case Automate.Action.ListBuilds: {
        const list = Array.isArray(result) ? result : [];
        list.forEach((b) => logger.info(b.hashedId ?? "", b.name, b.status));
        break;
      }
      case Automate.Action.ListSessions: {
        const list = Array.isArray(result) ? result : [];
        list.forEach((s) => logger.info(s.hashedId ?? "", s.name, s.status));
        break;
      }
      case Automate.Action.ListSessionLogs:
      case Automate.Action.ListSessionAppiumLogs:
      case Automate.Action.ListSessionSeleniumLogs:
      case Automate.Action.ListSessionConsoleLogs:
        process.stdout.write(result as string);
        break;
      case Automate.Action.ListSessionTelemetryLogs: {
        process.stdout.write(Buffer.from(result as ArrayBuffer));
        break;
      }
      case Automate.Action.ListProjects: {
        const list = Array.isArray(result) ? result : [];
        list.forEach((p) => {
          const proj = (p as { project?: typeof p }).project ?? p;
          logger.info(
            String((proj as { id?: unknown }).id ?? ""),
            (proj as { name?: unknown }).name as string
          );
        });
        break;
      }
      case Automate.Action.GetProjectBadgeKey: {
        logger.info(result as string);
        break;
      }
      case Automate.Action.ListMediaFiles: {
        const list = Array.isArray(result) ? result : [];
        list.forEach((f) =>
          logger.info(
            (f as { mediaUrl?: string }).mediaUrl ?? "",
            (f as { uploadedAt?: string }).uploadedAt
              ? new Date((f as { uploadedAt: string }).uploadedAt).toISOString()
              : "",
            (f as { mediaName?: string }).mediaName
          )
        );
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
