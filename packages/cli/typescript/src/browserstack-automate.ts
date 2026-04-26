#!/usr/bin/env node

import { ensureAccessKeyExists, ensureUsernameExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { AutomateClient, BrowserStackOptions } from "@browserstack-client/automate";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import process from "node:process";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

type ClientOptions = Partial<BrowserStackOptions>;

function parseKvArgs(args: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of args) {
    const eq = arg.indexOf("=");
    if (eq > 0) {
      out[arg.slice(0, eq)] = arg.slice(eq + 1);
    }
  }
  return out;
}

// ── builds ───────────────────────────────────────────────────────────────────

async function handleBuilds(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AutomateClient(opts);

  switch (action) {
    case "list": {
      const builds = await client.getBuilds();
      const list = Array.isArray(builds) ? builds : [];
      list.forEach((b) => logger.info(b.hashedId ?? "", b.name, b.status));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const build = await client.getBuild(args[0]);
      logger.info(JSON.stringify(build, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const kv = parseKvArgs(args.slice(1));
      const result = await client.updateBuild(args[0], kv as never);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const result = await client.deleteBuild(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete-many": {
      if (!args.length) throw new BrowserStackError("Missing build IDs");
      const result = await client.deleteBuilds(args);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid builds action: ${action} (valid: list, get, update, delete, delete-many)`
      );
  }
}

// ── sessions ─────────────────────────────────────────────────────────────────

const LOG_TYPES = ["selenium", "appium", "console", "network", "telemetry"] as const;
type LogType = typeof LOG_TYPES[number];

function parseLogType(args: string[]): LogType {
  const flag = args.find((a) => a.startsWith("--type="));
  if (!flag) return "selenium";
  const t = flag.replace("--type=", "").toLowerCase() as LogType;
  if (!LOG_TYPES.includes(t)) {
    throw new BrowserStackError(
      `Invalid log type: ${t} (valid: ${LOG_TYPES.join(", ")})`
    );
  }
  return t;
}

async function handleSessions(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AutomateClient(opts);

  switch (action) {
    case "list": {
      if (!args[0]) throw new BrowserStackError("Missing <buildId>");
      const sessions = await client.getSessions(args[0]);
      const list = Array.isArray(sessions) ? sessions : [];
      list.forEach((s) => logger.info(s.hashedId ?? "", s.name, s.status));
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const session = await client.getSession(args[0]);
      logger.info(JSON.stringify(session, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const kv = parseKvArgs(args.slice(1));
      const result = await client.updateSession(args[0], kv as never);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const result = await client.deleteSession(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete-many": {
      if (!args.length) throw new BrowserStackError("Missing session IDs");
      const result = await client.deleteSessions(args);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "logs": {
      if (!args[0]) throw new BrowserStackError("Missing <sessionId>");
      const sessionId = args[0];
      const logType = parseLogType(args.slice(1));

      switch (logType) {
        case "selenium":
          process.stdout.write(await client.getSessionLogs(sessionId) as string);
          break;
        case "appium":
          process.stdout.write(await client.getSessionAppiumLogs(sessionId) as string);
          break;
        case "console":
          process.stdout.write(await client.getSessionConsoleLogs(sessionId) as string);
          break;
        case "network":
          logger.info(JSON.stringify(await client.getSessionNetworkLogs(sessionId), null, 2));
          break;
        case "telemetry": {
          const buf = await client.getSessionTelemetryLogs(sessionId);
          process.stdout.write(Buffer.from(buf as ArrayBuffer));
          break;
        }
      }
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid sessions action: ${action} (valid: list, get, update, delete, delete-many, logs)`
      );
  }
}

// ── projects ──────────────────────────────────────────────────────────────────

async function handleProjects(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AutomateClient(opts);

  switch (action) {
    case "list": {
      const projects = await client.getProjects();
      const list = Array.isArray(projects) ? projects : [];
      list.forEach((p) => {
        const proj = (p as { project?: typeof p }).project ?? p;
        logger.info(String((proj as { id?: unknown }).id ?? ""), (proj as { name?: unknown }).name as string);
      });
      break;
    }
    case "get": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const project = await client.getProject(args[0]);
      logger.info(JSON.stringify(project, null, 2));
      break;
    }
    case "update": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const kv = parseKvArgs(args.slice(1));
      const result = await client.updateProject(args[0], kv as never);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const result = await client.deleteProject(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "badge-key": {
      if (!args[0]) throw new BrowserStackError("Missing <projectId>");
      const key = await client.getProjectBadgeKey(args[0]);
      logger.info(key as string);
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid projects action: ${action} (valid: list, get, update, delete, badge-key)`
      );
  }
}

// ── media ─────────────────────────────────────────────────────────────────────

async function handleMedia(
  action: string,
  args: string[],
  opts: ClientOptions,
  logger: Logger
) {
  const client = new AutomateClient(opts);

  switch (action) {
    case "list": {
      const files = await client.getMediaFiles();
      const list = Array.isArray(files) ? files : [];
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
    case "upload": {
      if (!args[0]) throw new BrowserStackError("Missing <file-path>");
      const filePath = resolve(args[0]);
      const filename = basename(filePath);
      const result = await client.uploadMediaFile({
        file: new Blob([await readFile(filePath)]),
        fileName: filename,
      });
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    case "delete": {
      if (!args[0]) throw new BrowserStackError("Missing <mediaId>");
      const result = await client.deleteMediaFile(args[0]);
      logger.info(JSON.stringify(result, null, 2));
      break;
    }
    default:
      throw new BrowserStackError(
        `Invalid media action: ${action} (valid: list, upload, delete)`
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
      case "builds":
        if (!action) throw new BrowserStackError("Missing action for builds");
        await handleBuilds(action, rest, opts, logger);
        break;
      case "sessions":
        if (!action) throw new BrowserStackError("Missing action for sessions");
        await handleSessions(action, rest, opts, logger);
        break;
      case "projects":
        if (!action) throw new BrowserStackError("Missing action for projects");
        await handleProjects(action, rest, opts, logger);
        break;
      case "media":
        if (!action) throw new BrowserStackError("Missing action for media");
        await handleMedia(action, rest, opts, logger);
        break;
      case "plan": {
        const client = new AutomateClient(opts);
        const plan = await client.getPlan();
        logger.info(JSON.stringify(plan, null, 2));
        break;
      }
      case "browsers": {
        const client = new AutomateClient(opts);
        const browsers = await client.getBrowsers();
        logger.info(JSON.stringify(browsers, null, 2));
        break;
      }
      default:
        throw new BrowserStackError(
          `Invalid resource: ${resource} (valid: builds, sessions, projects, media, plan, browsers)`
        );
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error(`An unexpected error occurred: ${err}`);
    }

    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
