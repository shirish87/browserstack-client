import { main } from "@/cli/browserstack-local.ts";
import { env } from "@/env.ts";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { BrowserStackTestContext } from "./setup";

describe("LocalCLI", () => {
  beforeAll(() => {
    env.BROWSERSTACK_LOCAL_BINARY_PATH = `${env.HOME}/.browserstack`;
  });

  beforeEach<BrowserStackTestContext>(
    async ({ localTestingBinary: { options } }) => {
      env.BROWSERSTACK_KEY = options.key;

      await main(["stop"]);
    }
  );

  describe("Test instance start-list-stop", () => {
    let localIdentifier: string | undefined;

    test("start", async () => {
      await main(["start"], {
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
      await main(["list"], {
        info(message) {
          expect(message).toContain(localIdentifier);
        },
        error(message) {
          expect(message).toBeFalsy();
        },
      });
    });

    test("stop", async () => {
      await main(["stop"], {
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
}, 30_000);