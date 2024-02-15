#!/usr/bin/env node

import { env } from "@/env";
import { BrowserStackError } from "@/error";
import { ensureDirExists } from "@/fs-utils";
import { BrowserStack } from "@/index.node";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import writeFileAtomic from "write-file-atomic";

const require = createRequire(import.meta.url);

enum BrowserStackLocalAction {
  start = "start",
  stop = "stop",
  list = "list",
}

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

/**
 * Starts the BrowserStack local testing binary with the provided key and configuration.
 *
 * @param key - The BrowserStack access key.
 * @param binHome - The path to the BrowserStack local testing binary.
 * @param statusPath - The path to the status file.
 * @param logger - The logger object for logging messages (optional, defaults to global console).
 * @returns A Promise that resolves when the local testing binary has started successfully.
 */
async function start(
  key: string,
  binHome: string,
  statusPath: string,
  logger: Logger = globalThis.console
) {
  const { localIdentifiers = [], ...entries } = await readOrCreateStatusFile(
    statusPath
  );

  const localTestingBinary = new BrowserStack.LocalTestingBinary({
    key,
    binHome,
  });

  const localIdentifier = localTestingBinary.localIdentifier;
  let status: string | undefined;

  try {
    status = await localTestingBinary.start();
  } catch (err) {
    if (err instanceof BrowserStackError && err.code === "ETIMEDOUT") {
      logger.error(
        `${localIdentifier}: Failed to complete command within ${localTestingBinary.commandTimeoutMs}ms timeout`
      );
    } else if (err instanceof Error) {
      logger.error(`${localIdentifier}: ${err.message}`);
    } else {
      throw err;
    }
  }

  if (status) {
    localIdentifiers.push(localIdentifier);
    await writeStatusFile(statusPath, localIdentifiers, entries);
    logger.info(`${localIdentifier}: ${status}`);
  }
}

/**
 * Stops all local testing instances tracked by this CLI.
 *
 * @param key - The key used to authenticate with BrowserStack.
 * @param binHome - The path to the BrowserStack binary home directory.
 * @param statusPath - The path to the status file.
 * @param logger - The logger object used for logging messages. Defaults to `console`.
 * @returns A promise that resolves when all local testing instances are stopped.
 */
async function stop(
  key: string,
  binHome: string,
  statusPath: string,
  logger: Logger = globalThis.console
) {
  const { localIdentifiers = [], ...entries } = await readOrCreateStatusFile(
    statusPath
  );

  while (localIdentifiers.length) {
    const localIdentifier = localIdentifiers.shift();
    if (!localIdentifier) {
      break;
    }

    const localTestingBinary = new BrowserStack.LocalTestingBinary({
      key,
      binHome,
      localIdentifier,
    });

    let status: string | undefined;

    try {
      status = await localTestingBinary.stop();
      logger.info(`${localIdentifier}: ${status}`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.match(/process instance not found/i)) {
          // local instance is not running, update our status file
          status = err.message;
        }

        logger.error(`${localIdentifier}: ${err.message}`);
      } else {
        logger.error(`${localIdentifier}: Failed to stop instance`);
      }
    }

    if (status) {
      await writeStatusFile(statusPath, localIdentifiers, entries);
    }
  }
}

/**
 * Lists the local identifiers stored in the status file.
 *
 * @param statusPath - The path to the status file.
 * @param logger - The logger object to use for logging.
 * @returns A promise that resolves with the list of local identifiers.
 */
async function list(statusPath: string, logger: Logger = globalThis.console) {
  const { localIdentifiers = [] } = await readOrCreateStatusFile(statusPath);

  for (const localIdentifier of localIdentifiers) {
    logger.info(localIdentifier);
  }
}

/**
 * Returns the default home directory for the BrowserStack binary.
 * If the user's home directory is available, it will be used.
 * Otherwise, the system's temporary directory will be used.
 * @returns The default home directory path.
 *
 * @internal
 */
function defaultBinHome(): string {
  return join(homedir() ?? tmpdir(), ".browserstack");
}

/**
 * Ensures that the directory for saving files exists.
 * If the binPath is not provided, it falls back to the value of env.BROWSERSTACK_LOCAL_BINARY_PATH.
 * If the binPath is still not provided, it uses the default bin home directory.
 * @param binPath The path to the bin home directory. Defaults to the default bin home directory.
 * @returns A Promise that resolves to the path of the bin home directory.
 * @throws {BrowserStackError} If the binPath is not a string or is empty.
 *
 * @internal
 */
async function ensureBinHomeExists(
  binPath: string | undefined = env.BROWSERSTACK_LOCAL_BINARY_PATH
): Promise<string> {
  const binHome = binPath ?? defaultBinHome();
  if (typeof binHome !== "string" || !binHome.trim().length) {
    throw new BrowserStackError("Missing binHome");
  }

  return await ensureDirExists(binHome.trim());
}

/**
 * Ensures that a key exists and returns it.
 * If the key is undefined, it falls back to the value of env.BROWSERSTACK_KEY.
 * Throws a BrowserStackError if the key is missing or empty.
 * @param key - The key to ensure.
 * @returns The ensured key.
 * @throws {BrowserStackError} If the key is missing or empty.
 *
 * @internal
 */
function ensureKeyExists(key: string | undefined): string {
  const accessToken = key ?? env.BROWSERSTACK_KEY;
  if (typeof accessToken !== "string" || !accessToken.trim().length) {
    throw new BrowserStackError("Missing key");
  }

  return accessToken.trim();
}

/**
 * Ensures that the provided action is valid.
 *
 * @param inputAction - The action to validate.
 * @param validActions - An array of valid actions. Defaults to all values of BrowserStackLocalAction.
 * @returns The validated action.
 * @throws {BrowserStackError} If the action is invalid.
 *
 * @internal
 */
function ensureValidAction(
  inputAction: string | undefined,
  validActions = Object.values(BrowserStackLocalAction)
): BrowserStackLocalAction {
  const action = inputAction?.toLowerCase?.()?.trim?.();
  if (action && validActions.includes(action as BrowserStackLocalAction)) {
    return action as BrowserStackLocalAction;
  }

  throw new BrowserStackError(`Invalid action: ${action}`);
}

/**
 * Reads the contents of a status file or creates a new one if it doesn't exist.
 * @param statusPath The path to the status file.
 * @param fileEncoding The encoding of the status file. Default is "utf-8".
 * @returns A promise that resolves to an object containing the localIdentifiers and other data from the status file.
 * @throws {BrowserStackError} If the status file format is invalid or if there is an error reading or creating the file.
 *
 * @internal
 */
async function readOrCreateStatusFile(
  statusPath: string,
  fileEncoding: BufferEncoding = "utf-8"
): Promise<{ localIdentifiers: string[] } & Record<string, unknown>> {
  try {
    const contents = await readFile(statusPath, fileEncoding).then((data) =>
      data.trim()
    );

    if (contents.length) {
      const data: unknown = JSON.parse(contents);
      const localIdentifiers = [];

      if (data && typeof data === "object") {
        if (
          "localIdentifiers" in data &&
          Array.isArray(data.localIdentifiers)
        ) {
          // read existing tracked localIdentifiers
          localIdentifiers.push(
            ...data.localIdentifiers
              .filter((o: unknown) => typeof o === "string")
              .map((o) => o.trim())
              .filter((o) => o.length)
          );
        }

        return { localIdentifiers, ...data };
      }
    }

    throw new BrowserStackError(`Invalid status file format: ${statusPath}`);
  } catch (err) {
    if (err instanceof BrowserStackError) {
      throw err;
    }

    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      // create new status file
      const result = { localIdentifiers: [] };

      await writeStatusFile(
        statusPath,
        result.localIdentifiers,
        {},
        fileEncoding
      );

      return result;
    }

    /* fall through to generic error */
    throw new BrowserStackError(`Invalid status file: ${statusPath}`);
  }
}

/**
 * Writes the status file with the given local identifiers and attributes.
 * @param statusPath - The path to the status file.
 * @param localIdentifiers - The local identifiers.
 * @param attributes - Additional attributes to include in the status file.
 * @param fileEncoding - The encoding of the status file.
 * @returns A promise that resolves when the status file is written.
 *
 * @internal
 */
async function writeStatusFile(
  statusPath: string,
  localIdentifiers: string[],
  attributes: Record<string, unknown> = {},
  fileEncoding: BufferEncoding = "utf-8"
): Promise<void> {
  await writeFileAtomic(
    statusPath,
    JSON.stringify({ ...attributes, localIdentifiers }, null, 2),
    fileEncoding
  );
}

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  const args = inputArgs.map((arg) => arg.trim());
  const action = ensureValidAction(args[0]);
  const key = ensureKeyExists(args[1]);
  const binHome = await ensureBinHomeExists();
  const statusPath = join(binHome, "status.json");

  switch (action) {
    case BrowserStackLocalAction.start: {
      await start(key, binHome, statusPath, logger);
      break;
    }
    case BrowserStackLocalAction.stop: {
      await stop(key, binHome, statusPath, logger).catch(console.error);
      break;
    }
    case BrowserStackLocalAction.list: {
      await list(statusPath, logger);
      break;
    }
    default:
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}