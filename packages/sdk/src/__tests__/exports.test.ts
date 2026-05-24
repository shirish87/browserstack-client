import { describe, it, expect } from "vitest";

// Verify every named export and constructor shown in the README works.
// These are the contracts README code snippets make — if a symbol is
// renamed, dropped, or its constructor signature changes, this fails.

import {
  AutomateClient,
  AppAutomateClient,
  LocalTestingBinary,
  AccessibilityClient,
  TestManagementClient,
  TestReportingClient,
  ScreenshotsClient,
} from "../index.ts";

const CREDS = { username: "u", accessKey: "k" };

describe("@dot-slash/browserstack-client exports (README contract)", () => {
  it("AutomateClient is constructible", () => {
    expect(() => new AutomateClient(CREDS)).not.toThrow();
  });

  it("AppAutomateClient is constructible", () => {
    expect(() => new AppAutomateClient(CREDS)).not.toThrow();
  });

  it("LocalTestingBinary is constructible", () => {
    expect(() => new LocalTestingBinary(CREDS)).not.toThrow();
  });

  it("AccessibilityClient is constructible", () => {
    expect(() => new AccessibilityClient(CREDS)).not.toThrow();
  });

  it("TestManagementClient is constructible", () => {
    expect(() => new TestManagementClient(CREDS)).not.toThrow();
  });

  it("TestReportingClient is constructible", () => {
    expect(() => new TestReportingClient(CREDS)).not.toThrow();
  });

  it("ScreenshotsClient is constructible", () => {
    expect(() => new ScreenshotsClient(CREDS)).not.toThrow();
  });
});
