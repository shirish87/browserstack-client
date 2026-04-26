import { vi } from "vitest";
import { AppAutomateClient } from "../client.js";
import * as fixtures from "./fixtures.js";

/**
 * Creates a mock AppAutomateClient for testing
 */
export function createMockAppAutomateClient(
  options?: any
): AppAutomateClient & {
  getPlan: ReturnType<typeof vi.fn>;
  getDevices: ReturnType<typeof vi.fn>;
  getProjects: ReturnType<typeof vi.fn>;
  getProject: ReturnType<typeof vi.fn>;
  updateProject: ReturnType<typeof vi.fn>;
  deleteProject: ReturnType<typeof vi.fn>;
  getBadgeKey: ReturnType<typeof vi.fn>;
  getBuilds: ReturnType<typeof vi.fn>;
  getBuild: ReturnType<typeof vi.fn>;
  updateBuild: ReturnType<typeof vi.fn>;
  deleteBuild: ReturnType<typeof vi.fn>;
  uploadBuildTerminalLogs: ReturnType<typeof vi.fn>;
  uploadSessionTerminalLogs: ReturnType<typeof vi.fn>;
  getSession: ReturnType<typeof vi.fn>;
  updateSessionStatus: ReturnType<typeof vi.fn>;
  deleteSession: ReturnType<typeof vi.fn>;
  getSessionLogs: ReturnType<typeof vi.fn>;
  getSessionDeviceLogs: ReturnType<typeof vi.fn>;
  getSessionAppiumLogs: ReturnType<typeof vi.fn>;
  getSessionNetworkLogs: ReturnType<typeof vi.fn>;
  getSessionAppProfilingDataV1: ReturnType<typeof vi.fn>;
  getSessionAppProfilingDataV2: ReturnType<typeof vi.fn>;
  uploadMediaFile: ReturnType<typeof vi.fn>;
  getMediaFiles: ReturnType<typeof vi.fn>;
  getMediaFilesByCustomId: ReturnType<typeof vi.fn>;
  getGroupMediaFiles: ReturnType<typeof vi.fn>;
  deleteMediaFile: ReturnType<typeof vi.fn>;
  uploadAppiumApp: ReturnType<typeof vi.fn>;
  getAppiumApps: ReturnType<typeof vi.fn>;
  getAppiumAppsByCustomId: ReturnType<typeof vi.fn>;
  getGroupAppiumApps: ReturnType<typeof vi.fn>;
  deleteAppiumApp: ReturnType<typeof vi.fn>;
  getSessions: ReturnType<typeof vi.fn>;
} {
  const client = new AppAutomateClient(options);

  return {
    ...client,
    getPlan: vi.fn().mockResolvedValue(fixtures.plan),
    getDevices: vi.fn().mockResolvedValue(fixtures.devices),
    getProjects: vi.fn().mockResolvedValue(fixtures.projects),
    getProject: vi.fn().mockResolvedValue(fixtures.project),
    updateProject: vi.fn().mockResolvedValue(fixtures.project),
    deleteProject: vi.fn().mockResolvedValue({}),
    getBadgeKey: vi.fn().mockResolvedValue(fixtures.badgeKey),
    getBuilds: vi.fn().mockResolvedValue(fixtures.builds),
    getBuild: vi.fn().mockResolvedValue(fixtures.build),
    updateBuild: vi.fn().mockResolvedValue(fixtures.build),
    deleteBuild: vi.fn().mockResolvedValue({}),
    uploadBuildTerminalLogs: vi.fn().mockResolvedValue({}),
    uploadSessionTerminalLogs: vi.fn().mockResolvedValue({}),
    getSession: vi.fn().mockResolvedValue(fixtures.session),
    updateSessionStatus: vi.fn().mockResolvedValue(fixtures.session),
    deleteSession: vi.fn().mockResolvedValue({}),
    getSessionLogs: vi.fn().mockResolvedValue(fixtures.logs),
    getSessionDeviceLogs: vi.fn().mockResolvedValue(fixtures.deviceLogs),
    getSessionAppiumLogs: vi.fn().mockResolvedValue(fixtures.appiumLogs),
    getSessionNetworkLogs: vi.fn().mockResolvedValue(fixtures.networkLogs),
    getSessionAppProfilingDataV1: vi.fn().mockResolvedValue(fixtures.profilingDataV1),
    getSessionAppProfilingDataV2: vi.fn().mockResolvedValue(fixtures.profilingDataV2),
    uploadMediaFile: vi.fn().mockResolvedValue(fixtures.mediaFile),
    getMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    getMediaFilesByCustomId: vi.fn().mockResolvedValue([fixtures.mediaFile]),
    getGroupMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    deleteMediaFile: vi.fn().mockResolvedValue({}),
    uploadAppiumApp: vi.fn().mockResolvedValue(fixtures.appiumApp),
    getAppiumApps: vi.fn().mockResolvedValue(fixtures.appiumApps),
    getAppiumAppsByCustomId: vi.fn().mockResolvedValue([fixtures.appiumApp]),
    getGroupAppiumApps: vi.fn().mockResolvedValue(fixtures.appiumApps),
    deleteAppiumApp: vi.fn().mockResolvedValue({}),
    getSessions: vi.fn().mockResolvedValue(fixtures.sessions),
  } as any;
}

export { fixtures };
