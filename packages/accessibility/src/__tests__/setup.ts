import { BrowserStackOptions, resolveAccessKey, resolveUsername } from "@browserstack-client/core";
import { AccessibilityClient } from "../index";

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
