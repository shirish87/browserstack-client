import { vi } from "vitest";
import { ScreenshotsClient } from "../client.js";
import * as fixtures from "./fixtures.js";

/**
 * Creates a mock ScreenshotsClient for testing
 */
export function createMockScreenshotsClient(
  options?: any
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
  } as any;
}

export { fixtures };
