import { AppAutomateClient } from "@/app-automate.ts"
import { AutomateClient } from "@/automate.ts"
import type { components } from "@/generated/openapi.ts"
import { JSTestingClient } from "@/js-testing.ts"
import { LocalTestingClient } from "@/local-testing.ts"
import { LocalTestingBinary } from "@/local-testing-binary.ts"
import { ScreenshotsClient } from "@/screenshots.ts"

export type { APIFetchOptions, BrowserStackOptions } from "@/api-client.ts"
export type { AppAutomateClient } from "@/app-automate.ts"
export type { AutomateClient } from "@/automate.ts"
export type { BrowserStackError, ErrorContext } from "@/error.ts"
export type { JSTestingClient } from "@/js-testing.ts"
export type { LocalTestingClient } from "@/local-testing.ts"
export type { LocalTestingBinary } from "@/local-testing-binary.ts"
export type { ScreenshotsClient } from "@/screenshots.ts"

export type schemas = components["schemas"];

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
  LocalTestingBinary: LocalTestingBinary,
};
