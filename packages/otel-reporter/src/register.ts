// Entry point loaded via NODE_OPTIONS=--require
// Boots OTEL SDK, activates all framework adapters, registers flush backstop.
import { readConfig } from "./config.js";
import { initSDK } from "./sdk.js";
import { flush } from "./flush.js";
import { PlaywrightAdapter } from "./adapters/playwright.js";
import { activateMocha } from "./adapters/mocha.js";
import { activateJest } from "./adapters/jest.js";
import { activateVitest } from "./adapters/vitest.js";

const cfg = readConfig();
initSDK(cfg);

// Playwright: export the adapter class so that PLAYWRIGHT_REPORTER=<this file>
// invokes it via the official reporter interface.
// module.exports assignment works because esbuild compiles this to CJS.
(module as NodeModule & { exports: unknown }).exports = PlaywrightAdapter;

// Activate non-Playwright framework adapters (each is a no-op if framework absent).
activateMocha();
activateJest();
activateVitest();

// Last-resort backstop: flush on process exit if framework teardown didn't trigger it.
process.on("beforeExit", () => {
  flush().catch(() => {});
});
