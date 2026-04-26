import { vi } from "vitest";
import { LocalTestingClient } from "../client.js";
import * as fixtures from "./fixtures.js";

/**
 * Creates a mock LocalTestingClient for testing
 */
export function createMockLocalTestingClient(
  options?: any
): LocalTestingClient & {
  getBinaryInstances: ReturnType<typeof vi.fn>;
  getBinaryInstance: ReturnType<typeof vi.fn>;
  disconnectBinaryInstance: ReturnType<typeof vi.fn>;
  downloadBinary: ReturnType<typeof vi.fn>;
} {
  const client = new LocalTestingClient(options);

  return {
    ...client,
    getBinaryInstances: vi.fn().mockResolvedValue(fixtures.instances),
    getBinaryInstance: vi.fn().mockResolvedValue(fixtures.instance),
    disconnectBinaryInstance: vi.fn().mockResolvedValue("Disconnected"),
    downloadBinary: vi.fn().mockResolvedValue(fixtures.download),
  } as any;
}

export { fixtures };
