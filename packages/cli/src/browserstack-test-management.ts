#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { TestManagementClient, BrowserStackOptions } from "@browserstack-client/test-management";
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
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "list": {
      const projects = await client.getTestManagementProjects();
      const list = Array.isArray(projects) ? projects : [];
      list.forEach((p) => logger.info(p.identifier ?? "", p.name ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const project = await client.getTestManagementProject(args[0]);
      logger.info(JSON.stringify(project, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementProject({ project: { name: args[0], description: args[1] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.updateTestManagementProject(args[0], { project: { name: args[1] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const result = await client.deleteTestManagementProject(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid projects action: ${action} (valid: list, get, create, update, delete)`
      );
  }
}

// ── folders ──────────────────────────────────────────────────────────────────

async function handleFolders(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const folders = await client.getTestManagementFolders(args[0]);
      const list = Array.isArray(folders) ? folders : [];
      list.forEach((f) => logger.info(String(f.id ?? ""), f.name ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      const folder = await client.getTestManagementFolder(args[0], Number(args[1]));
      logger.info(JSON.stringify(folder, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementFolder(args[0], { folder: { name: args[1], description: args[2] ?? "" } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      const result = await client.deleteTestManagementFolder(args[0], Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.updateTestManagementFolder(args[0], Number(args[1]), { folder: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "move": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      const result = await client.moveTestManagementFolder(args[0], Number(args[1]), { parentId: args[2] ? Number(args[2]) : undefined });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid folders action: ${action} (valid: list, get, create, update, delete, move)`
      );
  }
}

// ── test-cases ───────────────────────────────────────────────────────────────

async function handleTestCases(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const cases = await client.getTestManagementTestCases(args[0]);
      const list = Array.isArray(cases) ? cases : [];
      list.forEach((tc) => logger.info(tc.identifier ?? "", tc.name ?? "", tc.status ?? ""));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <folderId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementTestCase(args[0], Number(args[1]), { testCase: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.updateTestManagementTestCase(args[0], args[1], { testCase: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.deleteTestManagementTestCase(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "archive": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.archiveTestManagementTestCase(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "unarchive": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.unarchiveTestManagementTestCase(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "move": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[2]) throw new BrowserStackError("Missing <destinationFolderId>");
      const result = await client.moveTestManagementTestCase(args[0], args[1], { destinationFolderId: Number(args[2]) });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "attachments": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const attachments = await client.getTestManagementTestCaseAttachments(args[0], args[1]);
      logger.info(JSON.stringify(attachments, null, 2));
      break;
    }
    case "attach": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[2]) throw new BrowserStackError("Missing <file-path>");
      const filePath = resolve(args[2]);
      const filename = basename(filePath);
      const result = await client.addTestManagementTestCaseAttachment(args[0], args[1], {
        file: new Blob([await readFile(filePath)]),
        fileName: filename,
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "results": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const results = await client.getTestManagementTestCaseResults(args[0], args[1]);
      logger.info(JSON.stringify(results, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid test-cases action: ${action} (valid: list, create, update, delete, archive, unarchive, move, attachments, attach, results)`
      );
  }
}

// ── test-runs ─────────────────────────────────────────────────────────────────

async function handleTestRuns(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const runs = await client.getTestManagementTestRuns(args[0]);
      const list = Array.isArray(runs) ? runs : [];
      list.forEach((r) => logger.info(r.identifier ?? "", r.name ?? "", r.runState ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const run = await client.getTestManagementTestRun(args[0], args[1]);
      logger.info(JSON.stringify(run, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementTestRun(args[0], { testRun: { name: args[1], includeAll: true } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "close": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const result = await client.closeTestManagementTestRun(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const result = await client.deleteTestManagementTestRun(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "results": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const results = await client.getTestManagementTestRunResults(args[0], args[1]);
      logger.info(JSON.stringify(results, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.updateTestManagementTestRun(args[0], args[1], { testRun: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "patch": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.patchTestManagementTestRun(args[0], args[1], { testRun: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "test-cases": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      const cases = await client.getTestManagementTestRunTestCases(args[0], args[1]);
      logger.info(JSON.stringify(cases, null, 2));
      break;
    }
    case "assign": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      if (!args[2]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[3]) throw new BrowserStackError("Missing <assignee>");
      const result = await client.assignTestManagementTestRunTestCases(args[0], args[1], {
        assignTo: [{ testCaseId: args[2], assignee: args[3] }],
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "add-result": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      if (!args[2]) throw new BrowserStackError("Missing <testCaseId>");
      if (!args[3]) throw new BrowserStackError("Missing <status> (passed|failed|skipped)");
      const result = await client.addTestManagementTestRunResults(args[0], args[1], {
        testResult: { status: args[3] as never },
        testCaseId: args[2],
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "test-case-results": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testRunId>");
      if (!args[2]) throw new BrowserStackError("Missing <testCaseId>");
      const results = await client.getTestManagementTestRunTestCaseResults(args[0], args[1], args[2]);
      logger.info(JSON.stringify(results, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid test-runs action: ${action} (valid: list, get, create, update, patch, close, delete, results, add-result, test-cases, assign, test-case-results)`
      );
  }
}

// ── test-plans ────────────────────────────────────────────────────────────────

async function handleTestPlans(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const plans = await client.getTestManagementTestPlans(args[0]);
      const list = Array.isArray(plans) ? plans : [];
      list.forEach((p) => logger.info(p.identifier ?? "", p.name ?? "", p.planStatus ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testPlanId>");
      const plan = await client.getTestManagementTestPlan(args[0], args[1]);
      logger.info(JSON.stringify(plan, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementTestPlan(args[0], { testPlan: { name: args[1] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testPlanId>");
      if (!args[2]) throw new BrowserStackError("Missing <name>");
      const result = await client.updateTestManagementTestPlan(args[0], args[1], { testPlan: { name: args[2] } });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "test-runs": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testPlanId>");
      const runs = await client.getTestManagementTestPlanTestRuns(args[0], args[1]);
      logger.info(JSON.stringify(runs, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid test-plans action: ${action} (valid: list, get, create, update, test-runs)`
      );
  }
}

// ── configurations ────────────────────────────────────────────────────────────

async function handleConfigurations(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "list": {
      const configs = await client.getTestManagementConfigurations();
      const list = Array.isArray(configs) ? configs : [];
      list.forEach((c) => logger.info(String(c.id ?? ""), c.name ?? ""));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <configurationId>");
      const config = await client.getTestManagementConfiguration(args[0]);
      logger.info(JSON.stringify(config, null, 2));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <name>");
      const result = await client.createTestManagementConfiguration({ name: args[0] });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid configurations action: ${action} (valid: list, get, create)`
      );
  }
}

// ── custom-fields ─────────────────────────────────────────────────────────────

async function handleCustomFields(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "list": {
      const fields = await client.getTestManagementCustomFields();
      const list = Array.isArray(fields) ? fields : [];
      list.forEach((f) => logger.info(f.id ?? "", f.fieldName ?? "", f.fieldType ?? ""));
      break;
    }
    case "create": {
      if (!args[0]) throw new BrowserStackError("Missing <fieldName>");
      if (!args[1]) throw new BrowserStackError("Missing <fieldType>");
      if (!args[2]) throw new BrowserStackError("Missing <fieldEntityType>");
      const result = await client.createTestManagementCustomField({
        fieldName: args[0],
        fieldType: args[1] as never,
        fieldEntityType: args[2] as never,
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <customFieldId>");
      if (!args[1]) throw new BrowserStackError("Missing <fieldName>");
      const result = await client.updateTestManagementCustomField(args[0], { fieldName: args[1] });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <customFieldId>");
      const result = await client.deleteTestManagementCustomField(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid custom-fields action: ${action} (valid: list, create, update, delete)`
      );
  }
}

// ── test-results ──────────────────────────────────────────────────────────────

async function handleTestResults(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new TestManagementClient(opts);

  switch (action) {
    case "attachments": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testResultId>");
      const attachments = await client.getTestManagementTestResultAttachments(args[0], Number(args[1]));
      logger.info(JSON.stringify(attachments, null, 2));
      break;
    }
    case "attach": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testResultId>");
      if (!args[2]) throw new BrowserStackError("Missing <file-path>");
      const filePath = resolve(args[2]);
      const filename = basename(filePath);
      const result = await client.addTestManagementTestResultAttachment(args[0], Number(args[1]), {
        file: new Blob([await readFile(filePath)]),
        fileName: filename,
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete-attachment": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      if (!args[1]) throw new BrowserStackError("Missing <testResultId>");
      if (!args[2]) throw new BrowserStackError("Missing <attachmentId>");
      const result = await client.deleteTestManagementTestResultAttachment(args[0], Number(args[1]), Number(args[2]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid test-results action: ${action} (valid: attachments, attach, delete-attachment)`
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
      case "folders":
        if (!action) throw new BrowserStackError("Missing action for folders");
        await handleFolders(action, rest, opts, logger);
        break;
      case "test-cases":
        if (!action) throw new BrowserStackError("Missing action for test-cases");
        await handleTestCases(action, rest, opts, logger);
        break;
      case "test-runs":
        if (!action) throw new BrowserStackError("Missing action for test-runs");
        await handleTestRuns(action, rest, opts, logger);
        break;
      case "test-plans":
        if (!action) throw new BrowserStackError("Missing action for test-plans");
        await handleTestPlans(action, rest, opts, logger);
        break;
      case "test-results":
        if (!action) throw new BrowserStackError("Missing action for test-results");
        await handleTestResults(action, rest, opts, logger);
        break;
      case "configurations":
        if (!action) throw new BrowserStackError("Missing action for configurations");
        await handleConfigurations(action, rest, opts, logger);
        break;
      case "custom-fields":
        if (!action) throw new BrowserStackError("Missing action for custom-fields");
        await handleCustomFields(action, rest, opts, logger);
        break;
      default:
        process.stderr.write(
          `Invalid or missing resource: ${resource ?? "(none)"} (valid: projects, folders, test-cases, test-runs, test-plans, test-results, configurations, custom-fields)\n`
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
