import { vi } from "vitest";
import { AutomateClient, type BrowserStackOptions } from "../index";
import * as fixtures from "./fixtures";

export function createMockAutomateClient(
  options?: BrowserStackOptions
): AutomateClient & {
  recycleAutomateKey: ReturnType<typeof vi.fn>;
  getPlan: ReturnType<typeof vi.fn>;
  getBrowsers: ReturnType<typeof vi.fn>;
  getProjects: ReturnType<typeof vi.fn>;
  getProject: ReturnType<typeof vi.fn>;
  updateProject: ReturnType<typeof vi.fn>;
  deleteProject: ReturnType<typeof vi.fn>;
  getProjectBadgeKey: ReturnType<typeof vi.fn>;
  getBuilds: ReturnType<typeof vi.fn>;
  getBuild: ReturnType<typeof vi.fn>;
  updateBuild: ReturnType<typeof vi.fn>;
  deleteBuild: ReturnType<typeof vi.fn>;
  deleteBuilds: ReturnType<typeof vi.fn>;
  getSessions: ReturnType<typeof vi.fn>;
  getSession: ReturnType<typeof vi.fn>;
  updateSession: ReturnType<typeof vi.fn>;
  deleteSession: ReturnType<typeof vi.fn>;
  deleteSessions: ReturnType<typeof vi.fn>;
  uploadBuildTerminalLogs: ReturnType<typeof vi.fn>;
  uploadSessionTerminalLogs: ReturnType<typeof vi.fn>;
  getSessionLogs: ReturnType<typeof vi.fn>;
  getSessionNetworkLogs: ReturnType<typeof vi.fn>;
  getSessionConsoleLogs: ReturnType<typeof vi.fn>;
  getSessionSeleniumLogs: ReturnType<typeof vi.fn>;
  getSessionAppiumLogs: ReturnType<typeof vi.fn>;
  getSessionTelemetryLogs: ReturnType<typeof vi.fn>;
  uploadMediaFile: ReturnType<typeof vi.fn>;
  getMediaFiles: ReturnType<typeof vi.fn>;
  deleteMediaFile: ReturnType<typeof vi.fn>;
} {
  const client = new AutomateClient(options);

  return {
    ...client,
    recycleAutomateKey: vi.fn().mockResolvedValue(fixtures.recycleKeyResponse),
    getPlan: vi.fn().mockResolvedValue(fixtures.plan),
    getBrowsers: vi.fn().mockResolvedValue(fixtures.browsers),
    getProjects: vi.fn().mockResolvedValue(fixtures.projects),
    getProject: vi.fn().mockResolvedValue(fixtures.project),
    updateProject: vi.fn().mockResolvedValue(fixtures.project),
    deleteProject: vi.fn().mockResolvedValue({}),
    getProjectBadgeKey: vi.fn().mockResolvedValue(fixtures.badgeKey),
    getBuilds: vi.fn().mockResolvedValue(fixtures.builds),
    getBuild: vi.fn().mockResolvedValue(fixtures.build),
    updateBuild: vi.fn().mockResolvedValue(fixtures.build),
    deleteBuild: vi.fn().mockResolvedValue({}),
    deleteBuilds: vi.fn().mockResolvedValue({}),
    getSessions: vi.fn().mockResolvedValue(fixtures.sessions),
    getSession: vi.fn().mockResolvedValue(fixtures.session),
    updateSession: vi.fn().mockResolvedValue(fixtures.session),
    deleteSession: vi.fn().mockResolvedValue({}),
    deleteSessions: vi.fn().mockResolvedValue({}),
    uploadBuildTerminalLogs: vi.fn().mockResolvedValue({}),
    uploadSessionTerminalLogs: vi.fn().mockResolvedValue({}),
    getSessionLogs: vi.fn().mockResolvedValue(fixtures.logs),
    getSessionNetworkLogs: vi.fn().mockResolvedValue(fixtures.networkLogs),
    getSessionConsoleLogs: vi.fn().mockResolvedValue(fixtures.consoleLogs),
    getSessionSeleniumLogs: vi.fn().mockResolvedValue(fixtures.seleniumLogs),
    getSessionAppiumLogs: vi.fn().mockResolvedValue(fixtures.appiumLogs),
    getSessionTelemetryLogs: vi.fn().mockResolvedValue(fixtures.telemetryLogs),
    uploadMediaFile: vi.fn().mockResolvedValue(fixtures.mediaFile),
    getMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    deleteMediaFile: vi.fn().mockResolvedValue({}),
  } as ReturnType<typeof createMockAutomateClient>;
}

export { fixtures };
