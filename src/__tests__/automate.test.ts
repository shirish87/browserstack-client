import { describe, expect, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";


describe("AutomateClient", () => {

  test<BrowserStackTestContext>("getPlan", async ({ automate: { client } }) => {
    const plan = await client.getPlan();
    expect(plan).toBeDefined();
    expect(plan.automate_plan).toBeDefined();
  });

  test<BrowserStackTestContext>("getBrowsers", async ({ automate: { client } }) => {
    const data = await client.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<BrowserStackTestContext>("getProjects", async ({ automate: { client } }) => {
    const data = await client.getProjects();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<BrowserStackTestContext>("getProject", async ({ automate: { client, randomProjectId } }) => {
    const projectId = await randomProjectId();
    const data = await client.getProject(projectId);
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
  });

  test<BrowserStackTestContext>("getBuilds", async ({ automate: { client } }) => {
    const data = await client.getBuilds();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<BrowserStackTestContext>("getBuild", async ({ automate: { client, randomBuildId } }) => {
    const buildId = await randomBuildId();
    const data = await client.getBuild(buildId);
    expect(data).toBeDefined();
    expect(data).haveOwnProperty("status");
    expect(data.sessions).toBeDefined();
    expect(data.sessions).toBeInstanceOf(Array);
    expect(data.sessions.length).toBeGreaterThan(0);
  });

  test<BrowserStackTestContext>("getSessions", async ({ automate: { client, randomBuildId } }) => {
    const buildId = await randomBuildId();
    const data = await client.getSessions(buildId);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<BrowserStackTestContext>("getSession", async ({ automate: { client, randomSessionId } }) => {
    const sessionId = await randomSessionId();
    const data = await client.getSession(sessionId);
    expect(data).toBeDefined();
    expect(data).haveOwnProperty("status");
  });

});
