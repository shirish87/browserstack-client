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
import { actionHelp } from "./action-help.ts";

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
    ensureAccessKeyExists();
    ensureUsernameExists();

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

    if (rest.length > 0 && rest[rest.length - 1].toLowerCase() === "help") {
      const h = actionHelp("test-reporting", action);
      if (h) { logger.info(h); return; }
    }

    const schemaConfig = TestReportingSchemas.ActionSchemaMap[action];
    if (!schemaConfig) {
        throw new BrowserStackError(`No schema found for action: ${action}`);
    }

    const parsed = parseArgs(schemaConfig.schema, rest, schemaConfig.argNames);

    // upload-report: file path as first positional, everything else as --flags
    if (action === TestReporting.Action.UploadReport) {
      const uploadUsage =
        "Usage: test-reporting upload-report <file.xml|file.zip> " +
        "--project-name <name> --build-name <name> " +
        "[--format junit|allure] [--build-identifier <id>] " +
        "[--tags <tags>] [--ci <url>] [--framework-version <ver>]";

      // Parse flags from rest, first non-flag token is the file path
      const flags: Record<string, string> = {};
      let filePath: string | undefined;
      for (let i = 0; i < rest.length; i++) {
        const arg = rest[i];
        if (arg.startsWith("--")) {
          const key = arg.slice(2);
          const val = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : "true";
          flags[key] = val;
        } else if (!filePath) {
          filePath = arg;
        }
      }

      if (!filePath) throw new BrowserStackError(`Missing <file-path>\n${uploadUsage}`);
      if (!flags["project-name"]) throw new BrowserStackError(`--project-name is required\n${uploadUsage}`);
      if (!flags["build-name"]) throw new BrowserStackError(`--build-name is required\n${uploadUsage}`);

      const absPath = resolve(filePath);
      const data = await readFile(absPath);
      const filename = basename(absPath);

      const result = await client.uploadReport({
        file: new Blob([new Uint8Array(data)]),
        fileName: filename,
        projectName: flags["project-name"],
        buildName: flags["build-name"],
        ...(flags["format"] && { format: flags["format"] as "junit" | "allure" }),
        ...(flags["build-identifier"] && { buildIdentifier: flags["build-identifier"] }),
        ...(flags["tags"] && { tags: flags["tags"] }),
        ...(flags["ci"] && { ci: flags["ci"] }),
        ...(flags["framework-version"] && { frameworkVersion: flags["framework-version"] }),
      });
      logger.info(JSON.stringify(result, null, 2));
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
