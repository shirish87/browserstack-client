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

type ClientOptions = Partial<BrowserStackOptions & { uploadBaseUrl?: string }>;

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
      const resp = await client.getTestReportingProjects();
      const list = (resp as { projects?: Array<{ id: unknown; name: unknown }> })?.projects ?? (resp as Array<{ id: unknown; name: unknown }>);
      (Array.isArray(list) ? list : []).forEach((p) => logger.info(String(p.id ?? ""), String(p.name ?? "")));
      break;
    }
    default:
      throw new BrowserStackError(`Invalid projects action: ${action} (valid: list)`);
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
      const resp = await client.getTestReportingProjectBuilds(Number(args[0]));
      const list = (resp as { builds?: unknown[] })?.builds ?? resp;
      logger.info(JSON.stringify(list, null, 2));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const build = await client.getTestReportingBuild(args[0]);
      logger.info(JSON.stringify(build, null, 2));
      break;
    }
    case "latest": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      const build = await client.getTestReportingLatestBuild({ projectName: args[0], buildName: args[1] } as any);
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
    case "self-healing-report": {
      if (!args[0]) throw new BrowserStackError("Missing <buildUuid>");
      const report = await client.getTestReportingSelfHealingReport(args[0]);
      logger.info(JSON.stringify(report, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid builds action: ${action} (valid: list, get, latest, update, test-runs, self-healing-report)`
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
    case "junit":
    case "allure": {
      if (!args[0]) throw new BrowserStackError("Missing <file-path>");
      if (!args[1]) throw new BrowserStackError("Missing <projectName>");
      if (!args[2]) throw new BrowserStackError("Missing <buildName>");
      const filePath = resolve(args[0]);
      const data = await readFile(filePath);
      const filename = basename(filePath);
      await client.uploadTestReportingReport({
        file: new Blob([data]),
        fileName: filename,
        projectName: args[1],
        buildName: args[2],
        format: action,
      });
      logger.info(`Report ${filename} uploaded.`);
      break;
    }
    default:
      throw new BrowserStackError(`Invalid upload action: ${action} (valid: junit, allure)`);
  }
}

// ── ingestion ─────────────────────────────────────────────────────────────────

async function handleIngestion(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestReportingClient(opts);

  switch (action) {
    case "start-build": {
      if (!args[0]) throw new BrowserStackError("Missing <json-body>");
      const body = JSON.parse(args[0]);
      const result = await client.startTestReportingBuild(body);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "finish-build": {
      if (!args[0]) throw new BrowserStackError("Missing <buildHashedId>");
      const result = await client.finishTestReportingBuild(args[0], { finishedAt: new Date().toISOString() });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "start-test-run": {
      if (!args[0]) throw new BrowserStackError("Missing <buildHashedId>");
      if (!args[1]) throw new BrowserStackError("Missing <json-body>");
      const result = await client.startTestReportingTestRun(args[0], JSON.parse(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "finish-test-run": {
      if (!args[0]) throw new BrowserStackError("Missing <buildHashedId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunUuid>");
      if (!args[2]) throw new BrowserStackError("Missing <json-body>");
      const result = await client.finishTestReportingTestRun(args[0], args[1], JSON.parse(args[2]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "start-hook": {
      if (!args[0]) throw new BrowserStackError("Missing <buildHashedId>");
      if (!args[1]) throw new BrowserStackError("Missing <json-body>");
      const result = await client.startTestReportingHookRun(args[0], JSON.parse(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "finish-hook": {
      if (!args[0]) throw new BrowserStackError("Missing <buildHashedId>");
      if (!args[1]) throw new BrowserStackError("Missing <hookRunUuid>");
      if (!args[2]) throw new BrowserStackError("Missing <json-body>");
      const result = await client.finishTestReportingHookRun(args[0], args[1], JSON.parse(args[2]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "add-logs": {
      if (!args[0]) throw new BrowserStackError("Missing <buildHashedId>");
      if (!args[1]) throw new BrowserStackError("Missing <json-logs-array>");
      const result = await client.addTestReportingBuildLogs(args[0], { logs: JSON.parse(args[1]) });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid ingestion action: ${action} (valid: start-build, finish-build, start-test-run, finish-test-run, start-hook, finish-hook, add-logs)`
      );
  }
}

// ── quality-gates ─────────────────────────────────────────────────────────────

async function handleQualityGates(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestReportingClient(opts);

  switch (action) {
    case "status": {
      if (!args[0]) throw new BrowserStackError("Missing <buildUuid>");
      const result = await client.getTestReportingQualityGateStatus(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "settings": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      const result = await client.getTestReportingQualityGateSettings(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update-settings": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      if (!args[1]) throw new BrowserStackError("Missing <enabled> (true/false)");
      const result = await client.updateTestReportingQualityGateSettings(args[0], { enabled: args[1] === "true" });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-profile": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      if (!args[1]) throw new BrowserStackError("Missing <profileUuid>");
      const result = await client.getTestReportingQualityGateProfile(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "create-profile": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      if (!args[1]) throw new BrowserStackError("Missing <json-body>");
      const result = await client.createTestReportingQualityGateProfile(args[0], JSON.parse(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update-profile": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      if (!args[1]) throw new BrowserStackError("Missing <profileUuid>");
      if (!args[2]) throw new BrowserStackError("Missing <json-body>");
      const result = await client.updateTestReportingQualityGateProfile(args[0], args[1], JSON.parse(args[2]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "toggle-profile": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      if (!args[1]) throw new BrowserStackError("Missing <profileUuid>");
      if (!args[2]) throw new BrowserStackError("Missing <enabled> (true/false)");
      const result = await client.toggleTestReportingQualityGateProfile(args[0], args[1], { enabled: args[2] === "true" });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete-profile": {
      if (!args[0]) throw new BrowserStackError("Missing <projectName>");
      if (!args[1]) throw new BrowserStackError("Missing <profileUuid>");
      const result = await client.deleteTestReportingQualityGateProfile(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid quality-gates action: ${action} (valid: status, settings, update-settings, get-profile, create-profile, update-profile, toggle-profile, delete-profile)`
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
      case "ingestion":
        if (!action) throw new BrowserStackError("Missing action for ingestion");
        await handleIngestion(action, rest, opts, logger);
        break;
      case "quality-gates":
        if (!action) throw new BrowserStackError("Missing action for quality-gates");
        await handleQualityGates(action, rest, opts, logger);
        break;
      default:
        process.stderr.write(
          `Invalid or missing resource: ${resource ?? "(none)"} (valid: projects, builds, upload, ingestion, quality-gates)\n`
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