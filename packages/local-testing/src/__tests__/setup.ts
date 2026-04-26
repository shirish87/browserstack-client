import { LocalTestingClient } from "@browserstack-client/local-testing";
import type { BrowserStackOptions } from "@browserstack-client/core";
import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";
import { assert } from "vitest";

export interface BrowserStackTestContext {
  localTesting: {
    client: LocalTestingClient;
    randomBinaryInstanceId(): Promise<string>;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const localTesting = new LocalTestingClient(getOptions());

export const localTestingContext: BrowserStackTestContext["localTesting"] = {
  client: localTesting,
  randomBinaryInstanceId: async () => {
    const instances = await localTesting.getBinaryInstances();
    assert(instances.length > 0, "No local binary instances found");

    const instance =
      instances[Math.floor(Math.random() * instances.length)];
    assert(instance.id, "Invalid local binary instance");
    return instance.id;
  },
};
