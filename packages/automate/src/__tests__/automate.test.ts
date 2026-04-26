import { components } from "@browserstack-client/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import { automateContext } from "./setup.ts";

describe("AutomateClient", () => {

  describe("Account", () => {

    test.skip("recycleKey", async () => {
      const { client } = automateContext;
      const data = await client.recycleKey();
      expect(data).toBeDefined();
      expect(data.old_key).toBeDefined();
      expect(data.new_key).toBeDefined();
      expect(data.new_key.length).toBeGreaterThan(0);
      expectTypeOf(data.new_key).toMatchTypeOf<string>();
    });

    test("getPlan", async () => {
      const { client } = automateContext;
      const data = await client.getPlan();
      expect(data).toBeDefined();
      expect(data.automate_plan).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomatePlan"]>();
    });
  });

  test("getBrowsers", async () => {
    const { client } = automateContext;
    const data = await client.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserList"]>();
  }, 10_000);

  describe("Project", () => {
    test("getProjects", async () => {
      const { client } = automateContext;
      const data = await client.getProjects();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"][]
      >();
    });

    test("getProject", async () => {
      const { client, randomProjectId } = automateContext;
      const projectId = await randomProjectId();
      const data = await client.getProject(projectId);
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"] & {
          builds: components["schemas"]["AutomateBuild"][];
        }
      >();
    });

    test("updateProject", async () => {
      const { client, randomProjectId } = automateContext;
      const projectId = await randomProjectId();
      const name = `pricing-project-${Date.now()}`;
      const data = await client.updateProject(projectId, { name });
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.name).toBe(name);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"]
      >();
    });

    test("getBadgeKey", async () => {
      const { client, randomProjectId } = automateContext;
      const projectId = await randomProjectId();
      const data = await client.getBadgeKey(projectId);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toBeString();
    });

    test.skip("deleteProject", async () => {
      const { client, randomProjectId } = automateContext;
      const projectId = await randomProjectId();
      const data = await client.deleteProject(projectId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("status");
      expect(data.status).toEqual("ok");
      expect(data).haveOwnProperty("message");
    });
  });

  describe("Build", () => {
    test("getBuilds", async () => {
      const { client } = automateContext;
      const data = await client.getBuilds();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"][]
      >();
    });

    test("getBuild", async () => {
      const { client, randomBuildId } = automateContext;
      const buildId = await randomBuildId();
      const data = await client.getBuild(buildId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expect(data.sessions).toBeDefined();
      expect(data.sessions).toBeInstanceOf(Array);
      expect(data.sessions.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"] & {
          sessions: components["schemas"]["AutomateSession"][];
        }
      >();
    });

    describe("updateBuild", () => {
      test("name", async () => {
        const { client, randomBuildId } = automateContext;
        const buildId = await randomBuildId();
        const name = `pricing-build-${Date.now()}`;
        const data = await client.updateBuild(buildId, { name });
        expect(data).toBeDefined();
        expect(data.name).toEqual(name);
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateBuild"]>();
      });

      test("build_tag", async () => {
        const { client, randomBuildId } = automateContext;
        const buildId = await randomBuildId();
        const tag = `pricing-build-${Date.now()}`;
        const data = await client.updateBuild(buildId, { build_tag: tag });
        expect(data).toBeDefined();
        expect(data.build_tag).toEqual(tag);
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateBuild"]>();
      });
    });

    test.skip("deleteBuild", async () => {
      const { client, randomBuildId } = automateContext;
      const buildId = await randomBuildId();
      const data = await client.deleteBuild(buildId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("status");
      expect(data.status).toEqual("ok");
      expect(data).haveOwnProperty("message");
    });

    test("uploadBuildTerminalLogs", async () => {
      const { client, randomBuildId } = automateContext;
      const buildId = await randomBuildId();
      const data = await client.uploadBuildTerminalLogs(buildId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.message).toBeDefined();
      expect(data.message.length).toBeGreaterThan(0);
      expectTypeOf(data.message).toMatchTypeOf<string>();
    }, 10_000);
  });

  describe("Session", () => {
    test("getSessions", async () => {
      const { client, randomBuildId } = automateContext;
      const buildId = await randomBuildId();
      const data = await client.getSessions(buildId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateSession"][]
      >();
    });

    test("getSession", async () => {
      const { client, randomSessionId } = automateContext;
      const sessionId = await randomSessionId();
      const data = await client.getSession(sessionId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateSession"]
      >();
    });

    describe("updateSession", () => {
      test("status/reason", async () => {
        const { client, randomSessionId } = automateContext;
        const sessionId = await randomSessionId();
        const data = await client.updateSession(sessionId, {
          status: "failed",
          reason: "Session failed",
        });

        expect(data).toBeDefined();
        expect(data).haveOwnProperty("status");
        expect(data.status).toEqual("failed");
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AutomateSession"]
        >();
      });

      test("name", async () => {
        const { client, randomSessionId } = automateContext;
        const sessionId = await randomSessionId();
        const data = await client.updateSession(sessionId, {
          name: "pricing-session",
        });

        expect(data).toBeDefined();
        expect(data).haveOwnProperty("name");
        expect(data.name).toEqual("pricing-session");
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AutomateSession"]
        >();
      });
    });

    test.skip("deleteSession", async () => {
      const { client, randomSessionId } = automateContext;
      const sessionId = await randomSessionId();
      const data = await client.deleteSession(sessionId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("status");
      expect(data.status).toEqual("ok");
      expect(data).haveOwnProperty("message");
    });

    test.skip("deleteSessions", async () => {
      const { client, randomSessionId } = automateContext;
      const sessionId = await randomSessionId();
      const data = await client.deleteSessions([sessionId]);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("message");
    });

    test("uploadSessionTerminalLogs", async () => {
      const { client, randomSessionId } = automateContext;
      const sessionId = await randomSessionId();
      const data = await client.uploadSessionTerminalLogs(sessionId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.message).toBeDefined();
      expect(data.message.length).toBeGreaterThan(0);
      expectTypeOf(data.message).toMatchTypeOf<string>();
    }, 10_000);
  });

  describe("Media Files", () => {
    test("uploadMediaFile", async () => {
      const { client } = automateContext;
      const data = await client.uploadMediaFile({
        file: new Blob(["test"], { type: "text/plain" }),
        filename: "test.txt",
      });
      expect(data).toBeDefined();
      expect(data.media_url).toBeDefined();
      expectTypeOf(data.media_url).toBeString();
    }, 10_000);

    test("getMediaFiles", async () => {
      const { client } = automateContext;
      const data = await client.getMediaFiles();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateMediaFile"][]
      >();
    });

    test("deleteMediaFile", async () => {
      const { client, randomMediaId } = automateContext;
      const mediaId = await randomMediaId();
      const data = await client.deleteMediaFile(mediaId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("success");
      expect(data.success).toEqual(true);
    });
  });
});
