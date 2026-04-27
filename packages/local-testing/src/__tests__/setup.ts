import { LocalTestingClient } from "@dot-slash/browserstack-local-testing-api";
import type { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { resolveAccessKey, resolveUsername } from "@dot-slash/browserstack-core";
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
