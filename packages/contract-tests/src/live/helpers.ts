import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { AutomateClient } from "@dot-slash/browserstack-automate";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { retryingFetch } from "../retrying-fetch";

export interface LiveContext {
  testReporting: TestReportingClient;
  automate: AutomateClient;
  appAutomate: AppAutomateClient;
  /** TRA project that the generators in generators/ report into. */
  projectName: string;
}

export function credentials(): { username: string; accessKey: string } {
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY;
  if (!username || !accessKey) {
    throw new Error("Live contract tests need BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY (or BROWSERSTACK_KEY).");
  }
  return { username, accessKey };
}

export function liveContext(): LiveContext {
  const options = { ...credentials(), fetchFn: retryingFetch(fetch) };
  const automate = new AutomateClient(options);
  const appAutomate = new AppAutomateClient(options);
  const testReporting = new TestReportingClient({ ...options, automate, appAutomate });
  return {
    testReporting,
    automate,
    appAutomate,
    projectName: process.env.BROWSERSTACK_CONTRACT_PROJECT ?? "browserstack-client-contract",
  };
}

/** `$.a[3].b` → `$.a[].b`, so the same drift in a list reports once. */
export const dedupePath = (p: string): string => p.replace(/\[\d+\]/g, "[]");

export const unique = <T>(items: T[]): T[] => [...new Set(items)];
