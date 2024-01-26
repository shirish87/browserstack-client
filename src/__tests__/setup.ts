import * as BrowserStack from "@/index";
import { assert, beforeEach } from "vitest";


export interface BrowserStackTestContext {
  automate: {
    client: BrowserStack.AutomateClient;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
  };
  screenshots: {
    client: BrowserStack.ScreenshotsClient;
  };
}

beforeEach<BrowserStackTestContext>((context) => {
  const options: BrowserStack.APIClientOptions = {
    username: process.env.VITE_BROWSERSTACK_USERNAME,
    key: process.env.VITE_BROWSERSTACK_KEY,
  };

  const automate = new BrowserStack.AutomateClient(options);
  const screenshots = new BrowserStack.ScreenshotsClient(options);

  const randomProjectId = async () => {
    const projects = await automate.getProjects();
    assert(projects.length > 0, "No projects found");

    const project = projects[Math.floor(Math.random() * projects.length)];
    return project.id;
  };

  const randomBuildId = async () => {
    const builds = await automate.getBuilds();
    assert(builds.length > 0, "No builds found");

    const build = builds[Math.floor(Math.random() * builds.length)];
    return build.hashed_id;
  };

  const randomSessionId = async () => {
    const buildId = await randomBuildId();
    const sessions = await automate.getSessions(buildId);
    assert(sessions.length > 0, "No sessions found");

    const session = sessions[Math.floor(Math.random() * sessions.length)];
    return session.hashed_id;
  };

  Object.assign(context, {
    automate: {
      client: automate,
      randomProjectId,
      randomBuildId,
      randomSessionId,
    },
    screenshots: {
      client: screenshots,
    },
  });
});