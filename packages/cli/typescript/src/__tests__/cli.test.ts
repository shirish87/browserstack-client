import { runLocalCli } from "@dot-slash/browserstack-cli";
import { env } from "@dot-slash/browserstack-core";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { cliContext } from "./setup.ts";

const LONG_TIMEOUT = 30_000;

describe("LocalCLI", () => {
  beforeAll(() => {
    env.BROWSERSTACK_LOCAL_BINARY_PATH = `${env.HOME}/.browserstack`;
  });

  beforeEach(
    async () => {
      const { accessKey } = cliContext;
      env.BROWSERSTACK_ACCESS_KEY = accessKey;

      await runLocalCli(["stop"], {
        info() {},
        error() {},
      });
    }
  );

  describe("Test instance run-with", () => {
    test("run-with", async () => {
      await runLocalCli(
        [
          "run-with",
          "--",
          "node",
          "-e",
          "'assert(process.env.BROWSERSTACK_LOCAL_IDENTIFIER);'",
        ],
        {
          info(message) {
            expect(message).toMatch(
              /[0-9a-z]+: (Connected|BrowserStackLocal stopped successfully)/
            );
          },
          error(message) {
            expect(message).toBeFalsy();
          },
        }
      );
    });
  });

  describe("Test instance start-list-stop", () => {
    let localIdentifier: string | undefined;

    test("start", async () => {
      await runLocalCli(["start"], {
        info(message) {
          expect(message).toMatch(/[0-9a-z]+: Connected/);
          localIdentifier = message.split(":")[0];
        },
        error(message) {
          expect(message).toBeFalsy();
        },
      });
    });

    test("list", async () => {
      await runLocalCli(["list"], {
        info(message) {
          expect(message).toContain(localIdentifier);
        },
        error(message) {
          expect(message).toBeFalsy();
        },
      });
    });

    test("stop", async () => {
      await runLocalCli(["stop"], {
        info(message) {
          expect(message).toMatch(
            /[0-9a-z]+: BrowserStackLocal stopped successfully/
          );
          expect(message).toContain(localIdentifier);
        },
        error(message) {
          expect(message).toMatch(
            /[0-9a-z]+: BrowserStackLocal process instance not found/
          );
        },
      });
    });
  });
}, LONG_TIMEOUT);
