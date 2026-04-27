import { resolveAccessKey, resolveUsername } from "@dot-slash/browserstack-core";

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
