# @dot-slash/browserstack-app-automate

BrowserStack App Automate API client — manage builds, sessions, and app uploads for mobile app automation testing.

## Install

```sh
npm install @dot-slash/browserstack-app-automate
```

## Usage

```ts
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";

const client = new AppAutomateClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// Builds
const build = await client.getBuild("abc123");
await client.updateBuild("abc123", { name: "my-build" });
await client.deleteBuild("abc123");

// Sessions
const session = await client.getSession("sess456");
const logs = await client.getSessionLogs("abc123", "sess456");

// Devices
const devices = await client.getDevices();

// Media files (custom IDs)
const files = await client.getMediaFilesByCustomId("my-custom-id");
```

Flutter platform constants are available on the class:

```ts
AppAutomateClient.FlutterPlatform.android; // "android"
AppAutomateClient.FlutterPlatform.ios;     // "ios"
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
