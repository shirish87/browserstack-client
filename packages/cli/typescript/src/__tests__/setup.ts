import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";

export interface BrowserStackTestContext {
  env: {
    username: string | undefined;
    accessKey: string | undefined;
  };
}

export const cliContext: BrowserStackTestContext["env"] = {
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
};
