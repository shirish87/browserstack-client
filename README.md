# BrowserStack Client

[![npm](https://img.shields.io/npm/v/@dot-slash/browserstack-client)](https://www.npmjs.com/package/@dot-slash/browserstack-client)
[![Build Status](https://github.com/shirish87/browserstack-client/actions/workflows/main.yml/badge.svg)](https://github.com/shirish87/browserstack-client/actions)

TypeScript SDK for all [BrowserStack](https://www.browserstack.com) REST APIs. One package, every product, full type safety.

## Installation

```bash
npm install @dot-slash/browserstack-client
```

## Requirements

- **Node.js** 20 or higher
- A BrowserStack account with the relevant product subscriptions

## Authentication

Set credentials in your environment — no constructor arguments needed:

```bash
export BROWSERSTACK_USERNAME=<your-username>
export BROWSERSTACK_ACCESS_KEY=<your-access-key>
```

Or pass them explicitly to any client constructor.

## Usage

Import from the root or from a product subpath — only the code you use is bundled:

```ts
// Root (all clients)
import { AutomateClient, ScreenshotsClient } from "@dot-slash/browserstack-client";

// Subpath (tree-shakeable)
import { AutomateClient } from "@dot-slash/browserstack-client/automate";
```

### Automate — browser automation

```ts
import { AutomateClient } from "@dot-slash/browserstack-client/automate";

const client  = new AutomateClient();
const plan    = await client.getPlan();
const builds  = await client.getBuilds();
const sessions = await client.getSessions(builds[0].automation_build.hashed_id);
```

### App Automate — mobile app automation

```ts
import { AppAutomateClient } from "@dot-slash/browserstack-client/app-automate";

const client   = new AppAutomateClient();
const projects = await client.getProjects();
const builds   = await client.getBuilds(projects[0].id);
```

### Local Testing — tunnel management

```ts
import { LocalTestingBinary } from "@dot-slash/browserstack-client/local-testing";

const tunnel = new LocalTestingBinary({ accessKey: process.env.BROWSERSTACK_ACCESS_KEY });

await tunnel.start();
// ... run tests against localhost ...
await tunnel.stop();
```

### Screenshots — cross-browser screenshots

```ts
import { ScreenshotsClient } from "@dot-slash/browserstack-client/screenshots";

const client = new ScreenshotsClient();

await client.launch(
  {
    url: "https://example.com",
    browsers: [{ browser: "chrome", browser_version: "latest", os: "Windows", os_version: "11" }],
  },
  (screenshot) => console.log("captured:", screenshot.imageUrl)
);
```

### Accessibility

```ts
import { AccessibilityClient } from "@dot-slash/browserstack-client/accessibility";

const client  = new AccessibilityClient();
const reports = await client.getWorkflowAnalyzerReports();
```

### Test Management

```ts
import { TestManagementClient } from "@dot-slash/browserstack-client/test-management";

const client   = new TestManagementClient();
const projects = await client.getProjects();
```

### Test Reporting & Analytics

```ts
import { TestReportingClient } from "@dot-slash/browserstack-client/test-reporting";

const client = new TestReportingClient();

const build = await client.startBuild({
  projectName: "my-project",
  buildName:   "my-build",
  framework:   "playwright",
});

// ... run tests ...

await client.finishBuild(build.buildHashedId, { status: "passed" });
```

## CLI

A unified CLI is also available for local testing and product interactions:

```bash
npx @dot-slash/browserstack-cli local start
npx @dot-slash/browserstack-cli local run-with -- npm test
npx @dot-slash/browserstack-cli local stop
```

## Individual packages

Only need one product? Install its focused package directly:

| Package | Product |
|---|---|
| `@dot-slash/browserstack-automate` | Browser automation |
| `@dot-slash/browserstack-app-automate` | Mobile app automation |
| `@dot-slash/browserstack-local-testing` | Local tunnel binary |
| `@dot-slash/browserstack-accessibility` | Accessibility testing |
| `@dot-slash/browserstack-test-management` | Test case management |
| `@dot-slash/browserstack-test-reporting` | Test analytics |
| `@dot-slash/browserstack-screenshots` | Screenshot automation |

## Documentation

[shirish87.github.io/browserstack-client](https://shirish87.github.io/browserstack-client/)

## Thanks

Sponsored access to [BrowserStack](https://www.browserstack.com/), courtesy BrowserStack.
