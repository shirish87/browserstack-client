import { vi } from "vitest";
import { LocalTestingClient, type LocalTestingOptions } from "../index";
import * as fixtures from "./fixtures";

export function createMockLocalTestingClient(
  options?: LocalTestingOptions
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
  } as ReturnType<typeof createMockLocalTestingClient>;
}

export { fixtures };
