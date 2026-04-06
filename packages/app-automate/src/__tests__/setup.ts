import { FlutterPlatform } from "@browserstack-client/app-automate";
import {
  AppAutomateClient,
  BrowserStackOptions,
} from "@browserstack-client/app-automate";
import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";
import { assert } from "vitest";

export interface BrowserStackTestContext {
  appAutomate: {
    client: AppAutomateClient;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
    randomAppiumAppId(): Promise<string>;
    randomFlutterAndroidAppId(): Promise<string>;
    randomFlutteriOSTestPackageId(): Promise<string>;
    randomEspressoAppId(): Promise<string>;
    randomXCUITestAppId(): Promise<string>;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const appAutomate = new AppAutomateClient(getOptions());

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const randomAppAutomateBuildId = async () => {
  const builds = await appAutomate.getBuilds();
  assert(builds.length > 0, "No builds found");
  return pickRandom(builds).hashed_id;
};

export const appAutomateContext: BrowserStackTestContext["appAutomate"] = {
  client: appAutomate,
  randomBuildId: randomAppAutomateBuildId,
  randomProjectId: async () => {
    const projects = await appAutomate.getProjects();
    assert(projects.length > 0, "No projects found");
    return pickRandom(projects).id;
  },
  randomSessionId: async () => {
    const buildId = await randomAppAutomateBuildId();
    const { sessions } = await appAutomate.getBuild(buildId);
    assert(sessions.length > 0, "No sessions found");
    return pickRandom(sessions).hashed_id;
  },
  randomMediaId: async () => {
    const files = await appAutomate.getMediaFiles();
    assert(Array.isArray(files) && files.length > 0, "No media found");
    return pickRandom(files).media_id;
  },
  randomAppiumAppId: async () => {
    const apps = await appAutomate.getAppiumApps();
    assert(Array.isArray(apps) && apps.length > 0, "No apps found");
    return pickRandom(apps).app_id;
  },
  randomFlutterAndroidAppId: async () => {
    const apps = await appAutomate.getFlutterApps(FlutterPlatform.android);
    assert(Array.isArray(apps) && apps.length > 0, "No apps found");

    const match = apps.find((a) => a.custom_id === "example-app");
    return (match ?? pickRandom(apps)).app_id;
  },
  randomFlutteriOSTestPackageId: async () => {
    const apps = await appAutomate.getFlutterApps(FlutterPlatform.ios);
    assert(Array.isArray(apps) && apps.length > 0, "No apps found");

    const match = apps.find((a) => a.custom_id === "example-app");
    return (match ?? pickRandom(apps)).test_package_id;
  },
  randomEspressoAppId: async () => {
    const apps = await appAutomate.getEspressoApps();
    assert(Array.isArray(apps) && apps.length > 0, "No apps found");

    const match = apps.find((a) => a.custom_id === "example-app");
    return (match ?? pickRandom(apps)).app_id;
  },
  randomXCUITestAppId: async () => {
    const apps = await appAutomate.getXCUITestApps();
    assert(Array.isArray(apps) && apps.length > 0, "No apps found");

    const match = apps.find((a) => a.custom_id === "example-app");
    return (match ?? pickRandom(apps)).app_id;
  },
};
