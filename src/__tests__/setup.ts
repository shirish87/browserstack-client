import {
  BrowserStackOptions,
  AppAutomateClient,
  AutomateClient,
  BrowserStack,
  ScreenshotsClient,
  JSTestingClient,
} from "@/index";
import { assert, beforeEach } from "vitest";

export interface BrowserStackTestContext {
  automate: {
    client: AutomateClient;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
  };
  screenshots: {
    client: ScreenshotsClient;
  };
  appAutomate: {
    client: AppAutomateClient;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
    randomAppiumAppId(): Promise<string>;
    randomFlutterAppId(): Promise<string>;
    randomEspressoAppId(): Promise<string>;
    randomXCUITestAppId(): Promise<string>;
  };
  jsTesting: {
    client: JSTestingClient;
    randomWorkerId(): Promise<number>;
  };
}

beforeEach<BrowserStackTestContext>((context) => {
  const options: BrowserStackOptions = {
    username: process.env.VITE_BROWSERSTACK_USERNAME,
    key: process.env.VITE_BROWSERSTACK_KEY,
  };

  const automate = new BrowserStack.AutomateClient(options);
  const screenshots = new BrowserStack.ScreenshotsClient(options);
  const appAutomate = new BrowserStack.AppAutomateClient(options);
  const jsTesting = new BrowserStack.Client(options);

  const randomAutomateBuildId = async () => {
    const builds = await automate.getBuilds();
    assert(builds.length > 0, "No builds found");

    const build = builds[Math.floor(Math.random() * builds.length)];
    return build.hashed_id;
  };

  const randomAppAutomateBuildId = async () => {
    const builds = await appAutomate.getBuilds();
    assert(builds.length > 0, "No builds found");

    const build = builds[Math.floor(Math.random() * builds.length)];
    return build.hashed_id;
  };

  Object.assign(context, {
    automate: {
      client: automate,
      randomBuildId: randomAutomateBuildId,
      randomProjectId: async () => {
        const projects = await automate.getProjects();
        assert(projects.length > 0, "No projects found");

        const project = projects[Math.floor(Math.random() * projects.length)];
        return project.id;
      },
      randomSessionId: async () => {
        const buildId = await randomAutomateBuildId();
        const sessions = await automate.getSessions(buildId);
        assert(sessions.length > 0, "No sessions found");

        const session = sessions[Math.floor(Math.random() * sessions.length)];
        return session.hashed_id;
      },
      randomMediaId: async () => {
        const files = await automate.getMediaFiles();
        assert(files.length > 0, "No media found");

        const mediaItem = files[Math.floor(Math.random() * files.length)];
        return mediaItem.media_id;
      },
    },
    screenshots: {
      client: screenshots,
    },
    appAutomate: {
      client: appAutomate,
      randomBuildId: randomAppAutomateBuildId,
      randomProjectId: async () => {
        const projects = await appAutomate.getProjects();
        assert(projects.length > 0, "No projects found");

        const project = projects[Math.floor(Math.random() * projects.length)];
        return project.id;
      },
      randomSessionId: async () => {
        const buildId = await randomAppAutomateBuildId();
        const { sessions } = await appAutomate.getBuild(buildId);
        assert(sessions.length > 0, "No sessions found");

        const session = sessions[Math.floor(Math.random() * sessions.length)];
        return session.hashed_id;
      },
      randomMediaId: async () => {
        const files = await appAutomate.getMediaFiles();
        assert(Array.isArray(files) && files.length > 0, "No media found");

        const mediaItem = files[Math.floor(Math.random() * files.length)];
        return mediaItem.media_id;
      },
      randomAppiumAppId: async () => {
        const apps = await appAutomate.getAppiumApps();
        assert(Array.isArray(apps) && apps.length > 0, "No apps found");

        const app = apps[Math.floor(Math.random() * apps.length)];
        return app.app_id;
      },
      randomFlutterAppId: async () => {
        const apps = await appAutomate.getFlutterApps();
        assert(Array.isArray(apps) && apps.length > 0, "No apps found");

        const app = apps[Math.floor(Math.random() * apps.length)];
        return app.app_id;
      },
      randomEspressoAppId: async () => {
        const apps = await appAutomate.getEspressoApps();
        assert(Array.isArray(apps) && apps.length > 0, "No apps found");

        const app = apps[Math.floor(Math.random() * apps.length)];
        return app.app_id;
      },
      randomXCUITestAppId: async () => {
        const apps = await appAutomate.getXCUITestApps();
        assert(Array.isArray(apps) && apps.length > 0, "No apps found");

        const app = apps[Math.floor(Math.random() * apps.length)];
        return app.app_id;
      },
    },
    jsTesting: {
      client: jsTesting,
      randomWorkerId: async () => {
        const workers = await jsTesting.getWorkers();
        assert(workers.length > 0, "No workers found");

        const worker = workers[Math.floor(Math.random() * workers.length)];
        assert(worker.id > 0, "Invalid worker");
        return worker.id;
      },
    },
  });
});
