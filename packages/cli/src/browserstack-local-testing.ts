#!/usr/bin/env node

import { ensureAccessKeyExists } from "./utils.ts";
import { BrowserStackError } from "@browserstack-client/core";
import { LocalTestingClient } from "@browserstack-client/local-testing";
import process from "node:process";

interface Logger {
  info(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

export async function main(
  inputArgs: string[] = process.argv.slice(2),
  logger: Logger = globalThis.console
) {
  try {
    const accessKey = ensureAccessKeyExists(undefined);
    const client = new LocalTestingClient({ accessKey });

    const args = inputArgs.map((a) => a.trim());
    const resource = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const rest = args.slice(2);

    if (resource !== "instances") {
      throw new BrowserStackError(
        `Invalid resource: ${resource} (valid: instances)`
      );
    }

    switch (action) {
      case "list": {
        const instances = await client.getBinaryInstances();
        const list = Array.isArray(instances) ? instances : [];
        list.forEach((inst) =>
          logger.info(inst.id ?? "", inst.localIdentifier ?? "", inst.startTime ?? "")
        );
        break;
      }
      case "get": {
        if (!rest[0]) throw new BrowserStackError("Missing <instanceId>");
        const inst = await client.getBinaryInstance(rest[0]);
        logger.info(JSON.stringify(inst, null, 2));
        break;
      }
      case "disconnect": {
        if (!rest[0]) throw new BrowserStackError("Missing <instanceId>");
        const message = await client.disconnectBinaryInstance(rest[0]);
        logger.info(message);
        break;
      }
      default:
        throw new BrowserStackError(
          `Invalid instances action: ${action} (valid: list, get, disconnect)`
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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}
