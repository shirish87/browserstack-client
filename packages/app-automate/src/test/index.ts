import { vi } from "vitest";
import { type BrowserStackOptions } from "@dot-slash/browserstack-core";
import { AppAutomateClient } from "../index";
import * as fixtures from "./fixtures";

export function createMockAppAutomateClient(
  options?: BrowserStackOptions
): AppAutomateClient & {
  getPlan: ReturnType<typeof vi.fn>;
  getDevices: ReturnType<typeof vi.fn>;
  getProjects: ReturnType<typeof vi.fn>;
  getProject: ReturnType<typeof vi.fn>;
  updateProject: ReturnType<typeof vi.fn>;
  deleteProject: ReturnType<typeof vi.fn>;
  getProjectBadgeKey: ReturnType<typeof vi.fn>;
  getBuilds: ReturnType<typeof vi.fn>;
  getBuild: ReturnType<typeof vi.fn>;
  updateBuild: ReturnType<typeof vi.fn>;
  deleteBuild: ReturnType<typeof vi.fn>;
  uploadBuildTerminalLogs: ReturnType<typeof vi.fn>;
  uploadSessionTerminalLogs: ReturnType<typeof vi.fn>;
  getSession: ReturnType<typeof vi.fn>;
  updateSession: ReturnType<typeof vi.fn>;
  deleteSession: ReturnType<typeof vi.fn>;
  getSessionLogs: ReturnType<typeof vi.fn>;
  getDeviceLogs: ReturnType<typeof vi.fn>;
  getAppiumLogs: ReturnType<typeof vi.fn>;
  getNetworkLogs: ReturnType<typeof vi.fn>;
  getAppProfilingDataV1: ReturnType<typeof vi.fn>;
  getAppProfilingDataV2: ReturnType<typeof vi.fn>;
  uploadMediaFile: ReturnType<typeof vi.fn>;
  getMediaFiles: ReturnType<typeof vi.fn>;
  getMediaFilesByCustomId: ReturnType<typeof vi.fn>;
  getGroupMediaFiles: ReturnType<typeof vi.fn>;
  deleteMediaFile: ReturnType<typeof vi.fn>;
  uploadApp: ReturnType<typeof vi.fn>;
  getApps: ReturnType<typeof vi.fn>;
  getAppsByCustomId: ReturnType<typeof vi.fn>;
  getGroupApps: ReturnType<typeof vi.fn>;
  deleteApp: ReturnType<typeof vi.fn>;
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
    getProjectBadgeKey: vi.fn().mockResolvedValue(fixtures.badgeKey),
    getBuilds: vi.fn().mockResolvedValue(fixtures.builds),
    getBuild: vi.fn().mockResolvedValue(fixtures.build),
    updateBuild: vi.fn().mockResolvedValue(fixtures.build),
    deleteBuild: vi.fn().mockResolvedValue({}),
    uploadBuildTerminalLogs: vi.fn().mockResolvedValue({}),
    uploadSessionTerminalLogs: vi.fn().mockResolvedValue({}),
    getSession: vi.fn().mockResolvedValue(fixtures.session),
    updateSession: vi.fn().mockResolvedValue(fixtures.session),
    deleteSession: vi.fn().mockResolvedValue({}),
    getSessionLogs: vi.fn().mockResolvedValue(fixtures.logs),
    getDeviceLogs: vi.fn().mockResolvedValue(fixtures.deviceLogs),
    getAppiumLogs: vi.fn().mockResolvedValue(fixtures.appiumLogs),
    getNetworkLogs: vi.fn().mockResolvedValue(fixtures.networkLogs),
    getAppProfilingDataV1: vi.fn().mockResolvedValue(fixtures.profilingDataV1),
    getAppProfilingDataV2: vi.fn().mockResolvedValue(fixtures.profilingDataV2),
    uploadMediaFile: vi.fn().mockResolvedValue(fixtures.mediaFile),
    getMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    getMediaFilesByCustomId: vi.fn().mockResolvedValue([fixtures.mediaFile]),
    getGroupMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    deleteMediaFile: vi.fn().mockResolvedValue({}),
    uploadApp: vi.fn().mockResolvedValue(fixtures.appiumApp),
    getApps: vi.fn().mockResolvedValue(fixtures.appiumApps),
    getAppsByCustomId: vi.fn().mockResolvedValue([fixtures.appiumApp]),
    getGroupApps: vi.fn().mockResolvedValue(fixtures.appiumApps),
    deleteApp: vi.fn().mockResolvedValue({}),
  } as ReturnType<typeof createMockAppAutomateClient>;
}

export { fixtures };
