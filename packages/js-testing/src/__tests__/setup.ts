import {
  JSTestingClient,
  BrowserStackOptions,
} from "@browserstack-client/js-testing";
import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";
import { assert } from "vitest";

export interface BrowserStackTestContext {
  jsTesting: {
    client: JSTestingClient;
    randomWorkerId(): Promise<number>;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const jsTesting = new JSTestingClient(getOptions());

export const jsTestingContext: BrowserStackTestContext["jsTesting"] = {
  client: jsTesting,
  randomWorkerId: async () => {
    const workers = await jsTesting.getWorkers();
    assert(workers.length > 0, "No workers found");

    const worker = workers[Math.floor(Math.random() * workers.length)];
    assert(worker.id > 0, "Invalid worker");
    return worker.id;
  },
};
