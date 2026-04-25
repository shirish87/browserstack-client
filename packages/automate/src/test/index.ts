import { vi } from "vitest";
import { AutomateClient, type BrowserStackOptions } from "../index";
import * as fixtures from "./fixtures";

export function createMockAutomateClient(
  options?: BrowserStackOptions
): AutomateClient & {
  recycleAutomateKey: ReturnType<typeof vi.fn>;
  getAutomatePlan: ReturnType<typeof vi.fn>;
  getAutomateBrowsers: ReturnType<typeof vi.fn>;
  getAutomateProjects: ReturnType<typeof vi.fn>;
  getAutomateProject: ReturnType<typeof vi.fn>;
  updateAutomateProject: ReturnType<typeof vi.fn>;
  deleteAutomateProject: ReturnType<typeof vi.fn>;
  getAutomateProjectBadgeKey: ReturnType<typeof vi.fn>;
  getAutomateBuilds: ReturnType<typeof vi.fn>;
  getAutomateBuild: ReturnType<typeof vi.fn>;
  updateAutomateBuild: ReturnType<typeof vi.fn>;
  deleteAutomateBuild: ReturnType<typeof vi.fn>;
  deleteBuilds: ReturnType<typeof vi.fn>;
  getAutomateSessions: ReturnType<typeof vi.fn>;
  getAutomateSession: ReturnType<typeof vi.fn>;
  updateAutomateSession: ReturnType<typeof vi.fn>;
  deleteAutomateSession: ReturnType<typeof vi.fn>;
  deleteSessions: ReturnType<typeof vi.fn>;
  uploadBuildTerminalLogs: ReturnType<typeof vi.fn>;
  uploadSessionTerminalLogs: ReturnType<typeof vi.fn>;
  getAutomateSessionLogs: ReturnType<typeof vi.fn>;
  getAutomateSessionNetworkLogs: ReturnType<typeof vi.fn>;
  getAutomateSessionConsoleLogs: ReturnType<typeof vi.fn>;
  getAutomateSessionSeleniumLogs: ReturnType<typeof vi.fn>;
  getAutomateSessionAppiumLogs: ReturnType<typeof vi.fn>;
  getAutomateSessionTelemetryLogs: ReturnType<typeof vi.fn>;
  uploadMediaFile: ReturnType<typeof vi.fn>;
  getAutomateMediaFiles: ReturnType<typeof vi.fn>;
  deleteAutomateMediaFile: ReturnType<typeof vi.fn>;
} {
  const client = new AutomateClient(options);

  return {
    ...client,
    recycleAutomateKey: vi.fn().mockResolvedValue(fixtures.recycleKeyResponse),
    getAutomatePlan: vi.fn().mockResolvedValue(fixtures.plan),
    getAutomateBrowsers: vi.fn().mockResolvedValue(fixtures.browsers),
    getAutomateProjects: vi.fn().mockResolvedValue(fixtures.projects),
    getAutomateProject: vi.fn().mockResolvedValue(fixtures.project),
    updateAutomateProject: vi.fn().mockResolvedValue(fixtures.project),
    deleteAutomateProject: vi.fn().mockResolvedValue({}),
    getAutomateProjectBadgeKey: vi.fn().mockResolvedValue(fixtures.badgeKey),
    getAutomateBuilds: vi.fn().mockResolvedValue(fixtures.builds),
    getAutomateBuild: vi.fn().mockResolvedValue(fixtures.build),
    updateAutomateBuild: vi.fn().mockResolvedValue(fixtures.build),
    deleteAutomateBuild: vi.fn().mockResolvedValue({}),
    deleteBuilds: vi.fn().mockResolvedValue({}),
    getAutomateSessions: vi.fn().mockResolvedValue(fixtures.sessions),
    getAutomateSession: vi.fn().mockResolvedValue(fixtures.session),
    updateAutomateSession: vi.fn().mockResolvedValue(fixtures.session),
    deleteAutomateSession: vi.fn().mockResolvedValue({}),
    deleteSessions: vi.fn().mockResolvedValue({}),
    uploadBuildTerminalLogs: vi.fn().mockResolvedValue({}),
    uploadSessionTerminalLogs: vi.fn().mockResolvedValue({}),
    getAutomateSessionLogs: vi.fn().mockResolvedValue(fixtures.logs),
    getAutomateSessionNetworkLogs: vi.fn().mockResolvedValue(fixtures.networkLogs),
    getAutomateSessionConsoleLogs: vi.fn().mockResolvedValue(fixtures.consoleLogs),
    getAutomateSessionSeleniumLogs: vi.fn().mockResolvedValue(fixtures.seleniumLogs),
    getAutomateSessionAppiumLogs: vi.fn().mockResolvedValue(fixtures.appiumLogs),
    getAutomateSessionTelemetryLogs: vi.fn().mockResolvedValue(fixtures.telemetryLogs),
    uploadMediaFile: vi.fn().mockResolvedValue(fixtures.mediaFile),
    getAutomateMediaFiles: vi.fn().mockResolvedValue(fixtures.mediaFiles),
    deleteAutomateMediaFile: vi.fn().mockResolvedValue({}),
  } as ReturnType<typeof createMockAutomateClient>;
}

export { fixtures };
