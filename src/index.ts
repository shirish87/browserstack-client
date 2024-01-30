import { AppAutomateClient } from "@/app-automate";
import { AutomateClient } from "@/automate";
import { Client } from "@/client";
import { BrowserStackError } from "@/error";
import { ScreenshotsClient } from "@/screenshots";

export type { AppAutomateClient } from "@/app-automate";
export type { AutomateClient } from "@/automate";
export type { Client } from "@/client";
export type { ScreenshotsClient } from "@/screenshots";
export type { BrowserStackOptions, APIFetchOptions } from "@/api-client";
export type { BrowserStackError, ErrorContext } from "@/error";
import type { components } from "@/generated/openapi";

export type schemas = components["schemas"];

export const BrowserStack = {
  AutomateClient: AutomateClient,
  ScreenshotsClient: ScreenshotsClient,
  AppAutomateClient: AppAutomateClient,
  Client: Client,
  BrowserStackError,
};
