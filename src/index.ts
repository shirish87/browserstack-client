import { AppAutomateClient } from "@/app-automate";
import { AutomateClient } from "@/automate";
import { BrowserStackError } from "@/error";
import type { components } from "@/generated/openapi";
import { JSTestingClient } from "@/js-testing";
import { ScreenshotsClient } from "@/screenshots";
import { LocalTestingClient } from "@/local-testing";

export type { APIFetchOptions, BrowserStackOptions } from "@/api-client";
export type { AppAutomateClient } from "@/app-automate";
export type { AutomateClient } from "@/automate";
export type { BrowserStackError, ErrorContext } from "@/error";
export type { JSTestingClient } from "@/js-testing";
export type { ScreenshotsClient } from "@/screenshots";
export type { LocalTestingClient } from "@/local-testing";

export type schemas = components["schemas"];

/**
 * Represents the BrowserStack API module.
 * @module
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
  BrowserStackError,
};
