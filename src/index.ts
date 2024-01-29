import { AppAutomateClient as AAS } from "@/app-automate";
import { AutomateClient as AS } from "@/automate";
import { BrowserStackError } from "@/error";
import { ScreenshotsClient as SC } from "@/screenshots";
export type { APIClientOptions as BrowserStackOptions } from "@/api";

export type AutomateClient = AS;
export type ScreenshotsClient = SC;
export type AppAutomateClient = AAS;

export const BrowserStack = {
  AutomateClient: AS,
  ScreenshotsClient: SC,
  AppAutomateClient: AAS,
  BrowserStackError,
};
