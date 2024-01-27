import * as BrowserStack from "@/index";
import { assert, beforeEach } from "vitest";


export interface BrowserStackTestContext {
  automate: {
    client: BrowserStack.AutomateClient;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
  };
  screenshots: {
    client: BrowserStack.ScreenshotsClient;
  };
  appAutomate: {
    client: BrowserStack.AppAutomateClient;
    randomMediaId(): Promise<string>;
    randomAppId(): Promise<string>;
  };
}

beforeEach<BrowserStackTestContext>((context) => {
  const options: BrowserStack.APIClientOptions = {
    username: process.env.VITE_BROWSERSTACK_USERNAME,
    key: process.env.VITE_BROWSERSTACK_KEY,
  };

  const automate = new BrowserStack.AutomateClient(options);
  const screenshots = new BrowserStack.ScreenshotsClient(options);
  const appAutomate = new BrowserStack.AppAutomateClient(options);

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

  const randomMediaId = async () => {
    const files = await automate.getMediaFiles();
    assert(files.length > 0, "No media found");

    const mediaItem = files[Math.floor(Math.random() * files.length)];
    return mediaItem.media_id;
  };

  Object.assign(context, {
    automate: {
      client: automate,
      randomProjectId,
      randomBuildId,
      randomSessionId,
      randomMediaId,
    },
    screenshots: {
      client: screenshots,
    },
    appAutomate: {
      client: appAutomate,
      randomMediaId: async () => {
        const files = await appAutomate.getMediaFiles();
        assert(Array.isArray(files) && files.length > 0, "No media found");

        const mediaItem = files[Math.floor(Math.random() * files.length)];
        return mediaItem.media_id;
      },
      randomAppId: async () => {
        const apps = await appAutomate.getApps();
        assert(Array.isArray(apps) && apps.length > 0, "No apps found");

        const app = apps[Math.floor(Math.random() * apps.length)];
        return app.app_id;
      },
    },
  });
});
