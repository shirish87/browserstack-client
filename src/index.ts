import { AppAutomateClient } from "@/app-automate.ts";
import { AutomateClient } from "@/automate.ts";
import { JSTestingClient } from "@/js-testing.ts";
import { LocalTestingClient } from "@/local-testing.ts";
import { ScreenshotsClient } from "@/screenshots.ts";

export type { APIFetchOptions, BrowserStackOptions } from "@/api-client.ts";
export { AppAutomateClient, FlutterPlatform } from "@/app-automate.ts";
export { AutomateClient } from "@/automate.ts";
export type { BrowserStackError, ErrorContext } from "@/error.ts";
export { JSTestingClient } from "@/js-testing.ts";
export { LocalTestingClient } from "@/local-testing.ts";
export type { LocalTestingOptions } from "@/local-testing.ts";
export { ScreenshotsClient } from "@/screenshots.ts";

/**
 * Represents the BrowserStack API namespace.
 * @namespace
 * @public
 */
export const BrowserStack = {
  AutomateClient: AutomateClient,
  ScreenshotsClient: ScreenshotsClient,
  AppAutomateClient: AppAutomateClient,
  JSTestingClient: JSTestingClient,
  /**
   * Backwards compatibility alias for {@link JSTestingClient}.
   */
  Client: JSTestingClient,
  LocalTestingClient: LocalTestingClient,
};
