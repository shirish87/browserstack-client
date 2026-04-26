import {
  ScreenshotsClient,
  BrowserStackOptions,
} from "@browserstack-client/screenshots";
import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";

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
