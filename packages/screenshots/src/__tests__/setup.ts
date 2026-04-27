import {
  ScreenshotsClient,
} from "@dot-slash/browserstack-screenshots";
import { BrowserStackOptions, resolveAccessKey, resolveUsername } from "@dot-slash/browserstack-core";

export interface BrowserStackTestContext {
  screenshots: {
    client: ScreenshotsClient;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const screenshots = new ScreenshotsClient(getOptions());

export const screenshotsContext: BrowserStackTestContext["screenshots"] = {
  client: screenshots,
};
