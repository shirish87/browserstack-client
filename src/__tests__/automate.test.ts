import { components } from "@/generated/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";

describe("AutomateClient", () => {
  test<BrowserStackTestContext>("getPlan", async ({ automate: { client } }) => {
    const data = await client.getPlan();
    expect(data).toBeDefined();
    expect(data.automate_plan).toBeDefined();
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomatePlan"]>();
  });

  test<BrowserStackTestContext>("getBrowsers", async ({
    automate: { client },
  }) => {
    const data = await client.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserList"]>();
  }, 10_000);

  describe("Project", () => {
    test<BrowserStackTestContext>("getProjects", async ({
      automate: { client },
    }) => {
      const data = await client.getProjects();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"][]
      >();
    });

    test<BrowserStackTestContext>("getProject", async ({
      automate: { client, randomProjectId },
    }) => {
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

    test<BrowserStackTestContext>("updateProject", async ({
      automate: { client, randomProjectId },
    }) => {
      const projectId = await randomProjectId();
      const name = "pricing-project";
      const data = await client.updateProject(projectId, { name });
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.name).toBe(name);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"]
      >();
    });

    test<BrowserStackTestContext>("getBadgeKey", async ({
      automate: { client, randomProjectId },
    }) => {
      const projectId = await randomProjectId();
      const data = await client.getBadgeKey(projectId);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toBeString();
    });

    test.skip<BrowserStackTestContext>("deleteProject", async ({
      automate: { client, randomProjectId },
    }) => {
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
    test<BrowserStackTestContext>("getBuilds", async ({
      automate: { client },
    }) => {
      const data = await client.getBuilds();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"][]
      >();
    });

    test<BrowserStackTestContext>("getBuild", async ({
      automate: { client, randomBuildId },
    }) => {
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
      test<BrowserStackTestContext>("name", async ({
        automate: { client, randomBuildId },
      }) => {
        const buildId = await randomBuildId();
        const name = `pricing-build-${Date.now()}`;
        const data = await client.updateBuild(buildId, { name });
        expect(data).toBeDefined();

        if ("name" in data) {
          expect(data.name).toEqual(name);
        } else {
          expect(data.error).toBeUndefined();
        }
      });

      test<BrowserStackTestContext>("build_tag", async ({
        automate: { client, randomBuildId },
      }) => {
        const buildId = await randomBuildId();
        const tag = `pricing-build-${Date.now()}`;
        const data = await client.updateBuild(buildId, { build_tag: tag });
        expect(data).toBeDefined();

        if ("build_tag" in data) {
          expect(data.build_tag).toEqual(tag);
        } else {
          expect(data.error).toBeUndefined();
        }
      });
    });

    test.skip<BrowserStackTestContext>("deleteBuild", async ({
      automate: { client, randomBuildId },
    }) => {
      const buildId = await randomBuildId();
      const data = await client.deleteBuild(buildId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("status");
      expect(data.status).toEqual("ok");
      expect(data).haveOwnProperty("message");
    });

    test<BrowserStackTestContext>("uploadBuildTerminalLogs", async ({
      automate: { client, randomBuildId },
    }) => {
      const buildId = await randomBuildId();
      const data = await client.uploadBuildTerminalLogs(buildId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.message).toBeDefined();
      expect(data.message.length).toBeGreaterThan(0);
      expectTypeOf(data.message).toMatchTypeOf<string>();
    });
  });

  describe("Session", () => {
    test<BrowserStackTestContext>("getSessions", async ({
      automate: { client, randomBuildId },
    }) => {
      const buildId = await randomBuildId();
      const data = await client.getSessions(buildId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateSession"][]
      >();
    });

    test<BrowserStackTestContext>("getSession", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.getSession(sessionId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateSession"]
      >();
    });

    describe("updateSession", () => {
      test<BrowserStackTestContext>("status/reason", async ({
        automate: { client, randomSessionId },
      }) => {
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

      test<BrowserStackTestContext>("name", async ({
        automate: { client, randomSessionId },
      }) => {
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

    test.skip<BrowserStackTestContext>("deleteSession", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.deleteSession(sessionId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("status");
      expect(data.status).toEqual("ok");
      expect(data).haveOwnProperty("message");
    });

    test.skip<BrowserStackTestContext>("deleteSessions", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.deleteSessions([sessionId]);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("message");
    });

    test<BrowserStackTestContext>("uploadSessionTerminalLogs", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.uploadSessionTerminalLogs(sessionId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.message).toBeDefined();
      expect(data.message.length).toBeGreaterThan(0);
      expectTypeOf(data.message).toMatchTypeOf<string>();
    });

    test<BrowserStackTestContext>("getSessionLogs", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.getSessionLogs(sessionId);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    });

    test.only<BrowserStackTestContext>("getSessionNetworkLogs", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.getSessionNetworkLogs(sessionId);
      expect(data).toBeDefined();
    });

    test<BrowserStackTestContext>("getSessionConsoleLogs", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.getSessionConsoleLogs(sessionId);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    });

    test.skip<BrowserStackTestContext>("getSessionAppiumLogs", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.getSessionAppiumLogs(sessionId);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    });

    test.skip<BrowserStackTestContext>("getSessionTelemetryLogs", async ({
      automate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.getSessionTelemetryLogs(sessionId);
      expect(data).toBeDefined();
    });
  });
});
