import { vi } from "vitest";
import { type BrowserStackOptions } from "@dot-slash/browserstack-core";
import { ScreenshotsClient } from "../index";
import * as fixtures from "./fixtures";

export function createMockScreenshotsClient(
  options?: BrowserStackOptions
): ScreenshotsClient & {
  getBrowsers: ReturnType<typeof vi.fn>;
  createJob: ReturnType<typeof vi.fn>;
  getJob: ReturnType<typeof vi.fn>;
  trackJob: ReturnType<typeof vi.fn>;
  launch: ReturnType<typeof vi.fn>;
} {
  const client = new ScreenshotsClient(options);

  return {
    ...client,
    getBrowsers: vi.fn().mockResolvedValue(fixtures.browsers),
    createJob: vi.fn().mockResolvedValue(fixtures.job),
    getJob: vi.fn().mockResolvedValue(fixtures.job),
    trackJob: vi.fn().mockResolvedValue(fixtures.screenshots),
    launch: vi.fn().mockResolvedValue(fixtures.screenshots),
  } as ReturnType<typeof createMockScreenshotsClient>;
}

export { fixtures };
