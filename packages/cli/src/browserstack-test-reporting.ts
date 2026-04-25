#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { TestReportingClient, BrowserStackOptions } from "@browserstack-client/test-reporting";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import process from "node:process";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type ClientOptions = Partial<BrowserStackOptions>;

// ── projects ─────────────────────────────────────────────────────────────────

async function handleProjects(
  action: string,
  _args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestReportingClient(opts);

  switch (action) {
    case "list": {
      const projects = await client.getTestReportingProjects();
      const list = Array.isArray(projects) ? projects : [];
      list.forEach((p) => logger.info(p.id ?? "", p.name ?? ""));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid projects action: ${action} (valid: list)`
      );
  }
}

// ── builds ───────────────────────────────────────────────────────────────────

async function handleBuilds(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestReportingClient(opts);

  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const result = await client.getTestReportingProjectBuilds(Number(args[0]));
      const list = Array.isArray((result as any)?.builds) ? (result as any).builds : [];
      list.forEach((b: any) => logger.info(b.buildId ?? "", b.name ?? "", b.status ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const build = await client.getTestReportingBuild(args[0]);
      logger.info(JSON.stringify(build, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      if (!args[1]) throw new BrowserStackError("Missing <tags> (comma separated)");
      const tags = args[1].split(",").map((t) => t.trim());
      await client.updateTestReportingBuild(args[0], { buildTags: tags });
      logger.info(`Build ${args[0]} updated.`);
      break;
    }
    case "test-runs": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const runs = await client.getTestReportingTestRuns(args[0]);
      logger.info(JSON.stringify(runs, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid builds action: ${action} (valid: list, get, update, test-runs)`
      );
  }
}

// ── upload ───────────────────────────────────────────────────────────────────

async function handleUpload(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestReportingClient(opts);

  switch (action) {
    case "junit": {
      if (!args[0]) throw new BrowserStackError("Missing <file-path>");
      const filePath = resolve(args[0]);
      const data = await readFile(filePath);
      const filename = basename(filePath);
      await client.uploadTestReportingReport({
        file: new Blob([data]),
        fileName: filename,
      });
      logger.info(`Report ${filename} uploaded.`);
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid upload action: ${action} (valid: junit)`
      );
  }
}

// ── top-level dispatch ────────────────────────────────────────────────────────

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    ensureAccessKeyExists(undefined);
    ensureUsernameExists(undefined);

    const args = inputArgs.map((a) => a.trim());
    const resource = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const rest = args.slice(2);
    const opts: ClientOptions = {};

    switch (resource) {
      case "projects":
        if (!action) throw new BrowserStackError("Missing action for projects");
        await handleProjects(action, rest, opts, logger);
        break;
      case "builds":
        if (!action) throw new BrowserStackError("Missing action for builds");
        await handleBuilds(action, rest, opts, logger);
        break;
      case "upload":
        if (!action) throw new BrowserStackError("Missing action for upload");
        await handleUpload(action, rest, opts, logger);
        break;
      default:
        process.stderr.write(
          `Invalid or missing resource: ${resource ?? "(none)"} (valid: projects, builds, upload)\n`
        );
        process.exit(1);
    }
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

const isMain =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file://${resolve(process.argv[1])}` ||
  (globalThis as any).__BUILD_TARGET__ === "binary";

if (isMain) {
  main();
}
