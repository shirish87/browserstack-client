import { BrowserStack } from "@/index.ts";
import { load } from "https://deno.land/std@0.213.0/dotenv/mod.ts";

const env = await load();

const options = {
  username: env.VITE_BROWSERSTACK_USERNAME,
  key: env.VITE_BROWSERSTACK_KEY,
};

// BrowserStack JavaScript Testing API
const jsTestingClient = new BrowserStack.Client(options);

// BrowserStack Automate API
const automateClient = new BrowserStack.AutomateClient(options);

// BrowserStack App Automate API
const appAutomateClient = new BrowserStack.AppAutomateClient(options);

// BrowserStack Screenshots API
const screenshotsClient = new BrowserStack.ScreenshotsClient(options);

// BrowserStack Local Testing API
const localTestingClient = new BrowserStack.LocalTestingClient(options);

console.log("jsTestingClient.getBrowsers()", await jsTestingClient.getBrowsers());
console.log("automateClient.getBrowsers()", await automateClient.getBrowsers());
console.log("appAutomateClient.getDevices()", await appAutomateClient.getDevices());
console.log("screenshotsClient.getBrowsers()", await screenshotsClient.getBrowsers());
console.log("localTestingClient.getBinaryInstances()", await localTestingClient.getBinaryInstances());
