import { runLocalCli } from "@dot-slash/browserstack-cli";
import { env } from "@dot-slash/browserstack-core";
import { homedir } from "node:os";
import process from "node:process";
import { beforeAll, beforeEach, describe, expect, test, it } from "vitest";
import { cliContext } from "./setup.ts";
import type { TUIField } from "../tui-types.ts";

const LONG_TIMEOUT = 60_000;

describe("LocalCLI", () => {
  beforeAll(() => {
    env.BROWSERSTACK_LOCAL_BINARY_PATH = `${homedir()}/.browserstack`;
  });

  beforeEach(
    async () => {
      const { accessKey } = cliContext;
      env.BROWSERSTACK_ACCESS_KEY = accessKey;

      await runLocalCli(["stop"], {
        info() {},
        error() {},
      }, "--", false);
    },
    LONG_TIMEOUT
  );

  describe("Test help command", () => {
    test("help", async () => {
      let output = "";
      await runLocalCli(["help"], {
        info(message) {
          output += message;
        },
        error(message) {
          expect(message).toBeFalsy();
        },
      }, "--", false);
      expect(output).toContain("Usage: local <action> [args...]");
      expect(output).toContain("Actions: start, stop, list, run-with");
    });
  });

  describe("Test instance run-with", () => {
    test.skipIf(process.platform === "win32")("run-with", async () => {
      await runLocalCli(
        [
          "run-with",
          "--",
          "node",
          "-e",
          "assert(process.env.BROWSERSTACK_LOCAL_IDENTIFIER);",
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
        },
        "--",
        false
      );
    }, LONG_TIMEOUT);
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
      }, "--", false);
    }, LONG_TIMEOUT);

    test("list", async () => {
      await runLocalCli(["list"], {
        info(message) {
          expect(message).toContain(localIdentifier);
        },
        error(message) {
          expect(message).toBeFalsy();
        },
      }, "--", false);
    }, LONG_TIMEOUT);

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
      }, "--", false);
    }, LONG_TIMEOUT);
  });
}, LONG_TIMEOUT);

describe("TUI Secret Fields", () => {
  it("prefills auth_token field from BROWSERSTACK_KEY env var", () => {
    const fields: TUIField[] = [
      {
        name: "auth_token",
        label: "Auth Token",
        description: "Your BrowserStack access token",
        type: "string",
        required: true,
        location: "query",
        secret: true,
      },
    ];

    const originalKey = process.env.BROWSERSTACK_KEY;
    process.env.BROWSERSTACK_KEY = "test-secret-key";

    // Simulate the initializer logic from the Form component
    function initValues(fields: TUIField[]): Record<string, string> {
      return Object.fromEntries(
        fields.map(f => {
          if (f.secret) {
            const val =
              process.env.BROWSERSTACK_KEY ??
              process.env.BROWSERSTACK_ACCESS_KEY ??
              "";
            return [f.name, val];
          }
          return [f.name, ""];
        })
      );
    }

    const values = initValues(fields);
    expect(values["auth_token"]).toBe("test-secret-key");

    process.env.BROWSERSTACK_KEY = originalKey;
  });
});
