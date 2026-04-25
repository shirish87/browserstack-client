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
  const builds = await appAutomate.getAppAutomateBuilds();
  assert(builds.length > 0, "No builds found");
  return pickRandom(builds).hashedId;
};

export const appAutomateContext: BrowserStackTestContext["appAutomate"] = {
  client: appAutomate,
  randomBuildId: randomAppAutomateBuildId,
  randomProjectId: async () => {
    const projects = await appAutomate.getAppAutomateProjects();
    assert(projects.length > 0, "No projects found");
    return pickRandom(projects).id!;
  },
  randomSessionId: async () => {
    const buildId = await randomAppAutomateBuildId();
    const build = await appAutomate.getAppAutomateBuild(buildId);
    const sessions = build.sessions ?? [];
    assert(sessions.length > 0, "No sessions found");
    const session = pickRandom(sessions);
    return session.automationSession!.hashedId;
  },
  randomMediaId: async () => {
    const files = await appAutomate.getAppAutomateMediaFiles();
    const arr = Array.isArray(files) ? files : [];
    assert(arr.length > 0, "No media found");
    return pickRandom(arr).mediaId;
  },
  randomAppiumAppId: async () => {
    const apps = await appAutomate.getAppAutomateApps();
    const arr = Array.isArray(apps) ? apps : [];
    assert(arr.length > 0, "No apps found");
    return pickRandom(arr).appId!;
  },
  randomFlutterAndroidAppId: async () => {
    const apps = await appAutomate.getAppAutomateFlutterAndroidApps();
    const arr = Array.isArray(apps) ? apps : [];
    assert(arr.length > 0, "No Flutter Android apps found");
    const match = arr.find((a) => a.customId === "example-app");
    return (match ?? pickRandom(arr)).appId!;
  },
  randomFlutteriOSTestPackageId: async () => {
    const pkgs = await appAutomate.getAppAutomateFlutteriOSApps();
    const arr = Array.isArray(pkgs) ? pkgs : [];
    assert(arr.length > 0, "No Flutter iOS test packages found");
    const match = arr.find((a) => a.customId === "example-app");
    return (match ?? pickRandom(arr)).testPackageId!;
  },
  randomEspressoAppId: async () => {
    const apps = await appAutomate.getAppAutomateEspressoApps();
    const arr = Array.isArray(apps) ? apps : [];
    assert(arr.length > 0, "No Espresso apps found");
    const match = arr.find((a) => a.customId === "example-app");
    return (match ?? pickRandom(arr)).appId!;
  },
  randomXCUITestAppId: async () => {
    const apps = await appAutomate.getAppAutomateXCUITestApps();
    const arr = Array.isArray(apps) ? apps : [];
    assert(arr.length > 0, "No XCUITest apps found");
    const match = arr.find((a) => a.customId === "example-app");
    return (match ?? pickRandom(arr)).appId!;
  },
};
