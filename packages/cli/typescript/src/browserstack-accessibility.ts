#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { AccessibilityClient, BrowserStackOptions } from "@browserstack-client/accessibility";
import process from "node:process";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type ClientOptions = Partial<BrowserStackOptions>;

// ── workflow-analyzer ────────────────────────────────────────────────────────

async function handleWorkflowAnalyzer(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AccessibilityClient(opts);

  switch (action) {
    case "list": {
      const result = await client.getWorkflowAnalyzerReports();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <report_id>");
      const result = await client.getWorkflowAnalyzerReportSummary(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "issues": {
      const result = await client.getWorkflowAnalyzerReportIssues();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid workflow-analyzer action: ${action} (valid: list, get, issues)`
      );
  }
}

// ── assisted-test ────────────────────────────────────────────────────────────

async function handleAssistedTest(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AccessibilityClient(opts);

  switch (action) {
    case "list": {
      const result = await client.getAssistedTestReports();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <report_id>");
      const result = await client.getAssistedTestReportSummary(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "issues": {
      const result = await client.getAssistedTestReportIssues();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid assisted-test action: ${action} (valid: list, get, issues)`
      );
  }
}

// ── website-scanner ──────────────────────────────────────────────────────────

async function handleWebsiteScanner(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AccessibilityClient(opts);

  switch (action) {
    case "list-configs": {
      const result = await client.getWebsiteScannerAuthConfigs();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-scans": {
      const result = await client.getWebsiteScannerScans();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-scan": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      const result = await client.getWebsiteScannerScanOverview(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-runs": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      const result = await client.getWebsiteScannerScanRuns(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-run": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      if (!args[1]) throw new BrowserStackError("Missing <scan_run_id>");
      const result = await client.getWebsiteScannerScanRunSummary(Number(args[0]), Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "status": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      if (!args[1]) throw new BrowserStackError("Missing <scan_run_id>");
      const result = await client.getWebsiteScannerScanRunStatus(Number(args[0]), Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "issues": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      const result = await client.getWebsiteScannerScanRunIssues(Number(args[0]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "logs": {
      if (!args[0]) throw new BrowserStackError("Missing <scan_id>");
      if (!args[1]) throw new BrowserStackError("Missing <scan_run_id>");
      const result = await client.getWebsiteScannerScanRunLogs(Number(args[0]), Number(args[1]));
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid website-scanner action: ${action} (valid: list-configs, list-scans, get-scan, list-runs, get-run, status, issues, logs)`
      );
  }
}

// ── automated-tests ──────────────────────────────────────────────────────────

async function handleAutomatedTests(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AccessibilityClient(opts);

  switch (action) {
    case "list-projects": {
      const result = await client.getAutomatedTestProjects();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-builds": {
      const result = await client.getAutomatedTestBuilds();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "list-test-cases": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      const result = await client.getAutomatedTestBuildTestCases(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-build": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      const result = await client.getAutomatedTestBuildSummary(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "build-issues": {
      const result = await client.getAutomatedTestBuildIssues();
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "get-test-case": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      if (!args[1]) throw new BrowserStackError("Missing <testCaseId>");
      const result = await client.getAutomatedTestBuildTestCaseSummary(args[0], args[1]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "test-case-issues": {
      if (!args[0]) throw new BrowserStackError("Missing <thBuildId>");
      const result = await client.getAutomatedTestBuildTestCaseIssues(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid automated-tests action: ${action} (valid: list-projects, list-builds, list-test-cases, get-build, build-issues, get-test-case, test-case-issues)`
      );
  }
}

export async function main(args: string[]): Promise<void> {
  const logger: Logger = {
    info: (msg, ...params) => console.log(msg, ...params),
    error: (msg, ...params) => console.error(msg, ...params),
  };

  try {
    const username = ensureUsernameExists(undefined);
    const accessKey = ensureAccessKeyExists(undefined);
    const opts: ClientOptions = { username, accessKey };

    const area = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const remainingArgs = args.slice(2);

    if (!area) {
      throw new BrowserStackError(
        "Missing product area (workflow-analyzer, assisted-test, website-scanner, automated-tests)"
      );
    }

    if (!action) {
      throw new BrowserStackError("Missing action");
    }

    switch (area) {
      case "workflow-analyzer":
        await handleWorkflowAnalyzer(action, remainingArgs, opts, logger);
        break;
      case "assisted-test":
        await handleAssistedTest(action, remainingArgs, opts, logger);
        break;
      case "website-scanner":
        await handleWebsiteScanner(action, remainingArgs, opts, logger);
        break;
      case "automated-tests":
        await handleAutomatedTests(action, remainingArgs, opts, logger);
        break;
      default:
        throw new BrowserStackError(
          `Invalid product area: ${area} (valid: workflow-analyzer, assisted-test, website-scanner, automated-tests)`
        );
    }
  } catch (error) {
    if (error instanceof BrowserStackError) {
      logger.error(error.message);
    } else {
      logger.error("An unexpected error occurred:", error);
    }
    process.exit(1);
  }
}
