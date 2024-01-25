import AutomateClient from "@/automate";
import { beforeEach, describe, expect, test, assert } from "vitest";


interface AutomateTestContext {
  sdk: AutomateClient;
  randomProjectId(): Promise<number>;
  randomBuildId(): Promise<string>;
  randomSessionId(): Promise<string>;
}

beforeEach<AutomateTestContext>((context) => {
  context.sdk = new AutomateClient({
    username: process.env.VITE_BROWSERSTACK_USERNAME,
    key: process.env.VITE_BROWSERSTACK_KEY,
  });

  context.randomProjectId = async () => {
    const projects = await context.sdk.getProjects();
    assert(projects.length > 0, "No projects found");

    const project = projects[Math.floor(Math.random() * projects.length)];
    return project.id;
  };

  context.randomBuildId = async () => {
    const builds = await context.sdk.getBuilds();
    assert(builds.length > 0, "No builds found");

    const build = builds[Math.floor(Math.random() * builds.length)];
    return build.hashed_id;
  };

  context.randomSessionId = async () => {
    const buildId = await context.randomBuildId();
    const sessions = await context.sdk.getSessions(buildId);
    assert(sessions.length > 0, "No sessions found");

    const session = sessions[Math.floor(Math.random() * sessions.length)];
    return session.hashed_id;
  };
});

describe("AutomateClient", () => {

  test<AutomateTestContext>("getPlan", async ({ sdk }) => {
    const plan = await sdk.getPlan();
    expect(plan).toBeDefined();
    expect(plan.automate_plan).toBeDefined();
  });

  test<AutomateTestContext>("getBrowsers", async ({ sdk }) => {
    const data = await sdk.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<AutomateTestContext>("getProjects", async ({ sdk }) => {
    const data = await sdk.getProjects();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<AutomateTestContext>("getProject", async ({ sdk, randomProjectId }) => {
    const projectId = await randomProjectId();
    const data = await sdk.getProject(projectId);
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
  });

  test<AutomateTestContext>("getBuilds", async ({ sdk }) => {
    const data = await sdk.getBuilds();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<AutomateTestContext>("getBuild", async ({ sdk, randomBuildId }) => {
    const buildId = await randomBuildId();
    const data = await sdk.getBuild(buildId);
    expect(data).toBeDefined();
    expect(data).haveOwnProperty("status");
    expect(data.sessions).toBeDefined();
    expect(data.sessions).toBeInstanceOf(Array);
    expect(data.sessions.length).toBeGreaterThan(0);
  });

  test<AutomateTestContext>("getSessions", async ({ sdk, randomBuildId }) => {
    const buildId = await randomBuildId();
    const data = await sdk.getSessions(buildId);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

  test<AutomateTestContext>("getSession", async ({ sdk, randomSessionId }) => {
    const sessionId = await randomSessionId();
    const data = await sdk.getSession(sessionId);
    expect(data).toBeDefined();
    expect(data).haveOwnProperty("status");
  });

});
