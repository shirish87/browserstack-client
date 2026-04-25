import { vi } from "vitest";
import { AppAutomateClient, type BrowserStackOptions } from "../index";
import * as fixtures from "./fixtures";

export function createMockAppAutomateClient(
  options?: BrowserStackOptions
): AppAutomateClient & {
  getAppAutomatePlan: ReturnType<typeof vi.fn>;
  getAppAutomateDevices: ReturnType<typeof vi.fn>;
  getAppAutomateProjects: ReturnType<typeof vi.fn>;
  getAppAutomateProject: ReturnType<typeof vi.fn>;
  updateAppAutomateProject: ReturnType<typeof vi.fn>;
  deleteAppAutomateProject: ReturnType<typeof vi.fn>;
  getAppAutomateProjectBadgeKey: ReturnType<typeof vi.fn>;
  getAppAutomateBuilds: ReturnType<typeof vi.fn>;
  getAppAutomateBuild: ReturnType<typeof vi.fn>;
  updateAppAutomateBuild: ReturnType<typeof vi.fn>;
  deleteAppAutomateBuild: ReturnType<typeof vi.fn>;
  uploadAppAutomateBuildTerminalLogs: ReturnType<typeof vi.fn>;
  uploadAppAutomateSessionTerminalLogs: ReturnType<typeof vi.fn>;
  getAppAutomateSession: ReturnType<typeof vi.fn>;
  updateAppAutomateSession: ReturnType<typeof vi.fn>;
  deleteAppAutomateSession: ReturnType<typeof vi.fn>;
  getAppAutomateSessionLogs: ReturnType<typeof vi.fn>;
  getAppAutomateDeviceLogs: ReturnType<typeof vi.fn>;
  getAppAutomateAppiumLogs: ReturnType<typeof vi.fn>;
  getAppAutomateNetworkLogs: ReturnType<typeof vi.fn>;
  getAppAutomateAppProfilingDataV1: ReturnType<typeof vi.fn>;
  getAppAutomateAppProfilingDataV2: ReturnType<typeof vi.fn>;
  uploadAppAutomateMediaFile: ReturnType<typeof vi.fn>;
  getAppAutomateMediaFiles: ReturnType<typeof vi.fn>;
  getAppAutomateMediaFilesByCustomId: ReturnType<typeof vi.fn>;
  getAppAutomateGroupMediaFiles: ReturnType<typeof vi.fn>;
  deleteAppAutomateMediaFile: ReturnType<typeof vi.fn>;
  uploadAppAutomateApp: ReturnType<typeof vi.fn>;
  getAppAutomateApps: ReturnType<typeof vi.fn>;
  getAppAutomateAppsByCustomId: ReturnType<typeof vi.fn>;
  getAppAutomateGroupApps: ReturnType<typeof vi.fn>;
  deleteAppAutomateApp: ReturnType<typeof vi.fn>;
} {
  const client = new AppAutomateClient(options);

  return {
    ...client,
    getAppAutomatePlan: vi.fn().mockResolvedValue(fixtures.plan),
    getAppAutomateDevices: vi.fn().mockResolvedValue(fixtures.devices),
    getAppAutomateProjects: vi.fn().mockResolvedValue(fixtures.projects),
    getAppAutomateProject: vi.fn().mockResolvedValue(fixtures.project),
    updateAppAutomateProject: vi.fn().mockResolvedValue(fixtures.project),
    deleteAppAutomateProject: vi.fn().mockResolvedValue({}),
    getAppAutomateProjectBadgeKey: vi.fn().mockResolvedValue(fixtures.badgeKey),
    getAppAutomateBuilds: vi.fn().mockResolvedValue(fixtures.builds),
    getAppAutomateBuild: vi.fn().mockResolvedValue(fixtures.build),
    updateAppAutomateBuild: vi.fn().mockResolvedValue(fixtures.build),
    deleteAppAutomateBuild: vi.fn().mockResolvedValue({}),
    uploadAppAutomateBuildTerminalLogs: vi.fn().mockResolvedValue({}),
    uploadAppAutomateSessionTerminalLogs: vi.fn().mockResolvedValue({}),
    getAppAutomateSession: vi.fn().mockResolvedValue(fixtures.session),
    updateAppAutomateSession: vi.fn().mockResolvedValue(fixtures.session),
    deleteAppAutomateSession: vi.fn().mockResolvedValue({}),
    getAppAutomateSessionLogs: vi.fn().mockResolvedValue(fixtures.logs),
    getAppAutomateDeviceLogs: vi.fn().mockResolvedValue(fixtures.deviceLogs),
    getAppAutomateAppiumLogs: vi.fn().mockResolvedValue(fixtures.appiumLogs),
    getAppAutomateNetworkLogs: vi.fn().mockResolvedValue(fixtures.networkLogs),
    getAppAutomateAppProfilingDataV1: vi.fn().mockResolvedValue(fixtures.profilingDataV1),
    getAppAutomateAppProfilingDataV2: vi.fn().mockResolvedValue(fixtures.profilingDataV2),
    uploadAppAutomateMediaFile: vi.fn().mockResolvedValue(fixtures.mediaFile),
    getAppAutomateMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    getAppAutomateMediaFilesByCustomId: vi.fn().mockResolvedValue([fixtures.mediaFile]),
    getAppAutomateGroupMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    deleteAppAutomateMediaFile: vi.fn().mockResolvedValue({}),
    uploadAppAutomateApp: vi.fn().mockResolvedValue(fixtures.appiumApp),
    getAppAutomateApps: vi.fn().mockResolvedValue(fixtures.appiumApps),
    getAppAutomateAppsByCustomId: vi.fn().mockResolvedValue([fixtures.appiumApp]),
    getAppAutomateGroupApps: vi.fn().mockResolvedValue(fixtures.appiumApps),
    deleteAppAutomateApp: vi.fn().mockResolvedValue({}),
  } as ReturnType<typeof createMockAppAutomateClient>;
}

export { fixtures };
