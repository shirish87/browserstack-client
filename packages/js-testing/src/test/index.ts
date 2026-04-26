import { vi } from "vitest";
import { JSTestingClient } from "../client.js";
import * as fixtures from "./fixtures.js";

/**
 * Creates a mock JSTestingClient for testing
 */
export function createMockJSTestingClient(
  options?: any
): JSTestingClient & {
  getAccountStatus: ReturnType<typeof vi.fn>;
  getBrowsers: ReturnType<typeof vi.fn>;
  createWorker: ReturnType<typeof vi.fn>;
  getWorkers: ReturnType<typeof vi.fn>;
  getWorker: ReturnType<typeof vi.fn>;
  deleteWorker: ReturnType<typeof vi.fn>;
  updateWorkerURL: ReturnType<typeof vi.fn>;
  getWorkerScreenshot: ReturnType<typeof vi.fn>;
  ensureWorkerRunning: ReturnType<typeof vi.fn>;
  launch: ReturnType<typeof vi.fn>;
} {
  const client = new JSTestingClient(options);

  return {
    ...client,
    getAccountStatus: vi.fn().mockResolvedValue(fixtures.status),
    getBrowsers: vi.fn().mockResolvedValue(fixtures.browsers),
    createWorker: vi.fn().mockResolvedValue(fixtures.worker),
    getWorkers: vi.fn().mockResolvedValue(fixtures.workers),
    getWorker: vi.fn().mockResolvedValue(fixtures.worker),
    deleteWorker: vi.fn().mockResolvedValue({}),
    updateWorkerURL: vi.fn().mockResolvedValue(fixtures.worker),
    getWorkerScreenshot: vi.fn().mockResolvedValue(fixtures.screenshot),
    ensureWorkerRunning: vi.fn().mockResolvedValue(fixtures.runningWorker),
    launch: vi.fn().mockResolvedValue(fixtures.launchedWorker),
  } as any;
}

export { fixtures };
