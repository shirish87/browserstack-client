import { AccessibilityClient, BrowserStackOptions } from "../index";
import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";

export interface AccessibilityTestContext {
  accessibility: {
    client: AccessibilityClient;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const client = new AccessibilityClient(getOptions());

export const accessibilityContext: AccessibilityTestContext["accessibility"] = {
  client,
};
