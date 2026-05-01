import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { AutomateClient } from "../index.ts";

// Fixture data (wire-format snake_case)
const PLAN = { automate_plan: "Automate Mobile", terminal_access: "Public", parallel_sessions_running: 0, team_parallel_sessions_max_allowed: 5, parallel_sessions_max_allowed: 5, queued_sessions: 0, queued_sessions_max_allowed: 5 };
const BROWSERS = [{ os: "Windows", os_version: "XP", browser: "opera", device: null, browser_version: "12.15", real_mobile: null }, { os: "Windows", os_version: "11", browser: "chrome", device: null, browser_version: "147.0", real_mobile: null }];
const PROJECTS = [{ id: 17053335, name: "mock-project", group_id: 2259240, user_id: 23803, created_at: "2026-04-19T05:16:49.000Z", updated_at: "2026-04-26T15:58:35.000Z", sub_group_id: 0 }];
const PROJECT_WIRE = { project: { id: 17053335, name: "mock-project", group_id: 2259240, user_id: 23803, created_at: "2026-04-19T05:16:49.000Z", updated_at: "2026-04-26T15:58:35.000Z", sub_group_id: 0, builds: [] } };
const UPDATE_PROJECT = { id: 17053335, name: "updated-project", group_id: 2259240, user_id: 23803, created_at: "2026-04-19T05:16:49.000Z", updated_at: "2026-05-01T08:50:41.000Z", sub_group_id: 0 };
const DELETE_PROJECT = { status: "ok", message: "Project 17053335 was deleted successfully." };
const BADGE_KEY = "c1p0WFAvMkYvRDE5RVVzL1huNGNoMWVwWU0xazVSUTI2Vk5MTVdXNWVsZz0tLTRzS1oreitibWdCYm5lcmZOMTIxaXc9PQ==";
// builds wire format: json-unwrap $[*].automation_build
const BUILDS_WIRE = [{ automation_build: { name: "mock-build", hashed_id: "abc123build", duration: 37, status: "failed", build_tag: "mock-tag", public_url: "https://automate.browserstack.com/dashboard/v2/public-build/mock" } }, { automation_build: { name: "mock-build-2", hashed_id: "def456build", duration: null, status: "running", build_tag: null, public_url: null } }];
// build wire format: json-compose base=$.build.automation_build merge={sessions: $.build.sessions[*].automation_session}
const BUILD_WIRE = { build: { automation_build: { name: "mock-build", duration: 37, status: "failed", hashed_id: "abc123build", build_tag: "mock-tag" }, sessions: [{ automation_session: { name: "mock-session", duration: 63, os: "Windows", os_version: "10", browser_version: "147.0", browser: "chrome", device: null, status: "failed", hashed_id: "abc123session", reason: "Session failed", build_name: "mock-build", project_name: "mock-project", build_hashed_id: "abc123build", test_priority: null } }] } };
const UPDATE_BUILD = { automation_build: { name: "updated-build", duration: 37, status: "failed", hashed_id: "abc123build", build_tag: "mock-tag" } };
const DELETE_BUILD = { status: "ok", message: "Build with id abc123 has been queued for deletion." };
const DELETE_BUILDS = { status: "ok", message: "Builds with ids [abc123] have been queued for deletion." };
// sessions wire format: json-unwrap $[*].automation_session
const SESSIONS_WIRE = [{ automation_session: { name: "mock-session", duration: 63, os: "Windows", os_version: "10", browser_version: "147.0", browser: "chrome", device: null, status: "failed", hashed_id: "abc123session", reason: "Session failed", build_name: "mock-build", project_name: "mock-project", build_hashed_id: "abc123build", test_priority: null } }];
// session wire format: json-unwrap $.automation_session
const SESSION_WIRE = { automation_session: { name: "mock-session", duration: 63, os: "Windows", os_version: "10", browser_version: "147.0", browser: "chrome", device: null, status: "failed", hashed_id: "abc123session", reason: "Session failed", build_name: "mock-build", project_name: "mock-project", build_hashed_id: "abc123build", test_priority: null, logs: "https://automate.browserstack.com/builds/abc123build/sessions/abc123session/logs", browserstack_status: "timeout", created_at: "2026-04-20T19:18:45.000Z", browser_url: "https://automate.browserstack.com/builds/abc123build/sessions/abc123session", public_url: "https://automate.browserstack.com/builds/abc123build/sessions/abc123session?auth_token=mock" } };
const UPDATE_SESSION_WIRE = { automation_session: { name: "updated-session", duration: 63, os: "Windows", os_version: "10", browser_version: "147.0", browser: "chrome", device: null, status: "failed", hashed_id: "abc123session", reason: "Session failed", build_name: "mock-build", project_name: "mock-project", build_hashed_id: "abc123build", test_priority: null } };
const DELETE_SESSION = { status: "ok", message: "Session with id abc123 has been queued for deletion." };
const DELETE_SESSIONS = { status: "ok", message: "Sessions with ids [abc123session] have been queued for deletion." };
const SESSION_LOGS = "2026-04-20 19:18:46:0 REQUEST [2026-04-20 19:18:46:0] POST /session/abc123session/url {\"url\":\"https://www.google.com\"}\n2026-04-20 19:18:46:0 RESPONSE {\"state\":\"success\",\"sessionId\":\"abc123session\"}\n";
const TERMINAL_LOGS_RESPONSE = "Terminal logs uploaded successfully.";
const MEDIA_FILES = [{ media_name: "test.txt", media_url: "media://abc123media", media_id: "abc123media", uploaded_at: "2026-04-24 19:04:52 UTC" }, { media_name: "sample.txt", media_url: "media://def456media", media_id: "def456media", uploaded_at: "2026-04-24 18:05:58 UTC" }];
const UPLOAD_MEDIA = { media_url: "media://abc123media", media_id: "abc123media" };
const DELETE_MEDIA = { success: true, message: "Media with id abc123media has been deleted." };

describe("AutomateClient", () => {
  describe("Credentials", () => {
    it("accepts valid username and accessKey", () => {
      expect(() => new AutomateClient({ username: "user", accessKey: "key" })).not.toThrow();
    });

    it("makeClient helper creates a client with mock fetch", () => {
      const client = makeClient();
      expect(client).toBeInstanceOf(AutomateClient);
    });

    it("throws BrowserStackError when no credentials available", () => {
      const savedUser = env.BROWSERSTACK_USERNAME;
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_USERNAME;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new AutomateClient({ username: "", accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_USERNAME = savedUser;
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("getPlan", () => {
    it("returns camelCase plan data", async () => {
      const client = makeClient(PLAN);
      const data = await client.getPlan();
      expect(data).toBeDefined();
      expect(data.automatePlan).toBe("Automate Mobile");
      expect(data.parallelSessionsMaxAllowed).toBe(5);
      expect(data.parallelSessionsRunning).toBe(0);
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getPlan()).rejects.toThrow(HttpError);
    });
  });

  describe("getBrowsers", () => {
    it("returns array of browser objects", async () => {
      const client = makeClient(BROWSERS);
      const data = await client.getBrowsers();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      expect(data[0].os).toBe("Windows");
      expect(data[0].browser).toBe("opera");
      expect(data[1].browser).toBe("chrome");
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getBrowsers()).rejects.toThrow(HttpError);
    });
  });

  describe("Projects", () => {
    it("getProjects returns array of projects", async () => {
      const client = makeClient(PROJECTS);
      const data = await client.getProjects();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(17053335);
      expect(data[0].name).toBe("mock-project");
    });

    it("getProject returns camelCase project with builds", async () => {
      const client = makeClient(PROJECT_WIRE);
      const data = await client.getProject("17053335");
      expect(data).toBeDefined();
      expect(data.id).toBe(17053335);
      expect(data.name).toBe("mock-project");
      expect(data.groupId).toBe(2259240);
    });

    it("updateProject returns updated project", async () => {
      const client = makeClient(UPDATE_PROJECT);
      const data = await client.updateProject("17053335", { name: "updated-project" });
      expect(data).toBeDefined();
      expect(data.name).toBe("updated-project");
      expect(data.id).toBe(17053335);
    });

    it("deleteProject returns status ok", async () => {
      const client = makeClient(DELETE_PROJECT);
      const data = await client.deleteProject("17053335");
      expect(data).toBeDefined();
      expect(data.status).toBe("ok");
    });

    it("getProjectBadgeKey returns badge key string", async () => {
      const client = makeClient(BADGE_KEY);
      const data = await client.getProjectBadgeKey("17053335");
      expect(typeof data).toBe("string");
      expect(data.length).toBeGreaterThan(0);
      expect(data).toBe(BADGE_KEY);
    });

    it("getProject throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Project not found"));
      await expect(client.getProject("99999")).rejects.toThrow(HttpError);
    });
  });

  describe("Builds", () => {
    it("getBuilds returns unwrapped array of builds", async () => {
      const client = makeClient(BUILDS_WIRE);
      const data = await client.getBuilds();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe("mock-build");
      expect(data[0].hashedId).toBe("abc123build");
      expect(data[0].status).toBe("failed");
      expect(data[0].buildTag).toBe("mock-tag");
      expect(data[1].name).toBe("mock-build-2");
      expect(data[1].status).toBe("running");
    });

    it("getBuild returns composed build with sessions", async () => {
      const client = makeClient(BUILD_WIRE);
      const data = await client.getBuild("abc123build");
      expect(data).toBeDefined();
      expect(data.name).toBe("mock-build");
      expect(data.hashedId).toBe("abc123build");
      expect(data.status).toBe("failed");
      expect(data.sessions).toBeInstanceOf(Array);
      expect(data.sessions).toHaveLength(1);
      expect(data.sessions[0].hashedId).toBe("abc123session");
    });

    it("returns updated build wrapped in automationBuild", async () => {
      const data = await makeClient(UPDATE_BUILD).updateBuild("abc123build", { name: "updated-build" });
      expect(data).toHaveProperty("automationBuild");
      const build = (data as { automationBuild: { name: string } }).automationBuild;
      expect(build.name).toBe("updated-build");
    });

    it("deleteBuild returns status ok", async () => {
      const client = makeClient(DELETE_BUILD);
      const data = await client.deleteBuild("abc123");
      expect(data).toBeDefined();
      expect(data.status).toBe("ok");
    });

    it("deleteBuilds returns status ok", async () => {
      const client = makeClient(DELETE_BUILDS);
      const data = await client.deleteBuilds(["abc123"]);
      expect(data).toBeDefined();
      expect(data.status).toBe("ok");
    });

    it("getBuilds throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getBuilds()).rejects.toThrow(HttpError);
    });

    it("getBuild throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Build not found"));
      await expect(client.getBuild("notexist")).rejects.toThrow(HttpError);
    });
  });

  describe("Sessions", () => {
    it("getSessions returns unwrapped array of sessions", async () => {
      const client = makeClient(SESSIONS_WIRE);
      const data = await client.getSessions("abc123build");
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(1);
      expect(data[0].hashedId).toBe("abc123session");
      expect(data[0].status).toBe("failed");
      expect(data[0].browser).toBe("chrome");
    });

    it("getSession returns unwrapped session", async () => {
      const client = makeClient(SESSION_WIRE);
      const data = await client.getSession("abc123session");
      expect(data).toBeDefined();
      expect(data.hashedId).toBe("abc123session");
      expect(data.status).toBe("failed");
      expect(data.browserstackStatus).toBe("timeout");
      expect(data.publicUrl).toBeDefined();
    });

    it("updateSession returns updated session data", async () => {
      const client = makeClient(UPDATE_SESSION_WIRE);
      const data = await client.updateSession("abc123session", { status: "failed", reason: "Session failed" });
      expect(data).toBeDefined();
      expect(data.name).toBe("updated-session");
      expect(data.hashedId).toBe("abc123session");
    });

    it("deleteSession returns status ok", async () => {
      const client = makeClient(DELETE_SESSION);
      const data = await client.deleteSession("abc123session");
      expect(data).toBeDefined();
      expect(data.status).toBe("ok");
    });

    it("deleteSessions returns status ok", async () => {
      const client = makeClient(DELETE_SESSIONS);
      const data = await client.deleteSessions(["abc123session"]);
      expect(data).toBeDefined();
      expect(data.status).toBe("ok");
    });

    it("getSession throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Session not found"));
      await expect(client.getSession("notexist")).rejects.toThrow(HttpError);
    });

    it("throws HttpError 401 on bad credentials", async () => {
      await expect(makeClient(makeErrorResponse(401, "HTTP Basic: Access denied.")).getSession("abc"))
        .rejects.toMatchObject({ status: 401 });
    });
  });

  describe("Session logs", () => {
    it("getSessionLogs returns text log string", async () => {
      const client = makeClient(SESSION_LOGS);
      const data = await client.getSessionLogs("abc123session");
      expect(typeof data).toBe("string");
      expect(data).toContain("REQUEST");
      expect(data).toContain("RESPONSE");
    });

    it("getSessionConsoleLogs returns text string", async () => {
      const client = makeClient("console log line 1\nconsole log line 2\n");
      const data = await client.getSessionConsoleLogs("abc123session");
      expect(typeof data).toBe("string");
      expect(data).toContain("console log");
    });

    it("getSessionSeleniumLogs returns text string", async () => {
      const client = makeClient("selenium log line 1\n");
      const data = await client.getSessionSeleniumLogs("abc123session");
      expect(typeof data).toBe("string");
      expect(data).toContain("selenium log");
    });

    it("getSessionAppiumLogs returns text string", async () => {
      const client = makeClient("appium log line 1\n");
      const data = await client.getSessionAppiumLogs("abc123session");
      expect(typeof data).toBe("string");
      expect(data).toContain("appium log");
    });

    it("getSessionLogs throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Session not found"));
      await expect(client.getSessionLogs("notexist")).rejects.toThrow(HttpError);
    });
  });

  describe("Terminal log uploads", () => {
    it("uploadSessionTerminalLogs returns text response", async () => {
      const client = makeClient(TERMINAL_LOGS_RESPONSE);
      const data = await client.uploadSessionTerminalLogs("abc123session", {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });
      expect(typeof data).toBe("string");
      expect(data.length).toBeGreaterThan(0);
    });

    it("uploadBuildTerminalLogs returns text response", async () => {
      const client = makeClient(TERMINAL_LOGS_RESPONSE);
      const data = await client.uploadBuildTerminalLogs("abc123build", {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });
      expect(typeof data).toBe("string");
      expect(data.length).toBeGreaterThan(0);
    });

    it("uploadSessionTerminalLogs throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(
        client.uploadSessionTerminalLogs("abc123session", {
          file: new Blob(["Logs"], { type: "text/plain" }),
          fileName: "terminal.txt",
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("Media files", () => {
    it("getMediaFiles returns array of media files", async () => {
      const client = makeClient(MEDIA_FILES);
      const data = await client.getMediaFiles();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      expect(data[0].mediaId).toBe("abc123media");
      expect(data[0].mediaUrl).toBe("media://abc123media");
      expect(data[0].mediaName).toBe("test.txt");
    });

    it("uploadMediaFile returns media url and id", async () => {
      const client = makeClient(UPLOAD_MEDIA);
      const data = await client.uploadMediaFile({
        file: new Blob(["test"], { type: "text/plain" }),
        fileName: "test.txt",
      });
      expect(data).toBeDefined();
      expect(data.mediaUrl).toBe("media://abc123media");
      expect(data.mediaId).toBe("abc123media");
    });

    it("deleteMediaFile returns success true", async () => {
      const client = makeClient(DELETE_MEDIA);
      const data = await client.deleteMediaFile("abc123media");
      expect(data).toBeDefined();
      expect(data.success).toBe(true);
      expect(data.message).toContain("abc123media");
    });

    it("getMediaFiles throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getMediaFiles()).rejects.toThrow(HttpError);
    });

    it("deleteMediaFile throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Media not found"));
      await expect(client.deleteMediaFile("notexist")).rejects.toThrow(HttpError);
    });
  });
});
