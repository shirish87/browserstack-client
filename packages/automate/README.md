# @dot-slash/browserstack-automate

BrowserStack Automate API client — manage builds, sessions, projects, and media files for browser automation testing.

## Install

```sh
npm install @dot-slash/browserstack-automate
```

## Usage

```ts
import { AutomateClient } from "@dot-slash/browserstack-automate";

const client = new AutomateClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// Plan and available browsers
const plan = await client.getPlan();
const browsers = await client.getBrowsers();

// Builds
const builds = await client.getBuilds();
const build = await client.getBuild("abc123");
await client.updateBuild("abc123", { name: "my-build" });
await client.deleteBuild("abc123");

// Sessions
const sessions = await client.getSessions("abc123");
const session = await client.getSession("sess456");
await client.updateSession("sess456", { status: "passed" });

// Logs
const appiumLogs = await client.getSessionAppiumLogs("sess456");
const networkLogs = await client.getSessionNetworkLogs("sess456");

// Media files
const media = await client.getMediaFiles();
await client.deleteMediaFile("media789");
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
