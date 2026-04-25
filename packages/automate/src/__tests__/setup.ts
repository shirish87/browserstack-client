import { AutomateClient, BrowserStackOptions } from "../index";
import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";
import { assert } from "vitest";

export interface BrowserStackTestContext {
  automate: {
    client: AutomateClient;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const automate = new AutomateClient(getOptions());

const randomAutomateBuildId = async () => {
  const builds = await automate.getAutomateBuilds();
  assert(builds.length > 0, "No builds found");
  const build = builds[Math.floor(Math.random() * builds.length)];
  return build.hashedId;
};

export const automateContext: BrowserStackTestContext["automate"] = {
  client: automate,
  randomBuildId: randomAutomateBuildId,
  randomProjectId: async () => {
    const projects = await automate.getAutomateProjects();
    assert(projects.length > 0, "No projects found");
    const project = projects[Math.floor(Math.random() * projects.length)];
    return project.id;
  },
  randomSessionId: async () => {
    const buildId = await randomAutomateBuildId();
    const sessions = await automate.getAutomateSessions(buildId);
    assert(sessions.length > 0, "No sessions found");
    const session = sessions[Math.floor(Math.random() * sessions.length)];
    return session.hashedId;
  },
  randomMediaId: async () => {
    const files = await automate.getAutomateMediaFiles();
    assert(files.length > 0, "No media found");
    const mediaItem = files[Math.floor(Math.random() * files.length)];
    return mediaItem.mediaId;
  },
};
