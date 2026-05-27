import { readConfig } from "./config.js";
import { initSDK } from "./sdk.js";
import { flush } from "./flush.js";
import { PlaywrightAdapter } from "./adapters/playwright.js";

const cfg = readConfig();
initSDK(cfg);

(module as NodeModule & { exports: unknown }).exports = PlaywrightAdapter;

process.on("beforeExit", () => {
  flush().catch(() => {});
});
