---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "BrowserStack Client"
  text: "Unified SDK and CLI for BrowserStack APIs"
  tagline: "Type-safe, fast, and generated from OpenAPI"
  actions:
    - theme: brand
      text: Get Started
      link: "#installation"
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: Architecture
      link: /architecture

features:
  - title: Multi-Product Support
    details: Unified access to Automate, App Automate, Screenshots, Local Testing, Accessibility, Test Management, and Test Reporting.
  - title: Type Safe
    details: Full TypeScript support with types generated directly from the latest OpenAPI specifications.
  - title: Subpath Imports
    details: Import from the root or by product subpath — tree-shaking works out of the box with any bundler.
  - title: Native CLI
    details: Native Go CLI for Local Testing tunnel management and product interactions. No Node.js required.
---

## Installation {#installation}

```bash
npm install @dot-slash/browserstack-client
```

**Node.js 20 or higher** required. A BrowserStack account with the relevant product subscriptions is needed for each API.

## Authentication

Credentials are read from environment variables by default:

```bash
export BROWSERSTACK_USERNAME=<your-username>
export BROWSERSTACK_ACCESS_KEY=<your-access-key>
```

Or pass them explicitly to any client constructor:

```ts
const client = new AutomateClient({ username: "me", accessKey: "key" });
```

## Usage

Import from the root (all clients) or from a product subpath (tree-shakeable):

```ts
// All clients from one import
import { AutomateClient, ScreenshotsClient } from "@dot-slash/browserstack-client";

// Or by product subpath
import { AutomateClient } from "@dot-slash/browserstack-client/automate";
```

### Automate — browser automation

```ts
import { AutomateClient } from "@dot-slash/browserstack-client/automate";

const client   = new AutomateClient();
const plan     = await client.getPlan();
const builds   = await client.getBuilds();
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

```bash
npx @dot-slash/browserstack-cli local start
npx @dot-slash/browserstack-cli local run-with -- npm test
npx @dot-slash/browserstack-cli local stop
```

See [CLI docs](/cli) for the full command reference.

## Subpath reference

| Import | Client | Product |
|---|---|---|
| `.../automate` | `AutomateClient` | Browser automation |
| `.../app-automate` | `AppAutomateClient` | Mobile app automation |
| `.../local-testing` | `LocalTestingBinary`, `LocalTestingClient` | Local tunnel |
| `.../screenshots` | `ScreenshotsClient` | Screenshot automation |
| `.../accessibility` | `AccessibilityClient` | Accessibility testing |
| `.../test-management` | `TestManagementClient` | Test case management |
| `.../test-reporting` | `TestReportingClient` | Test analytics |
| `.../core` | `APIClient`, error types | Shared runtime |

## Individual packages

Only need one product? Install the focused package directly:

| Package | Product |
|---|---|
| `@dot-slash/browserstack-automate` | Browser automation |
| `@dot-slash/browserstack-app-automate` | Mobile app automation |
| `@dot-slash/browserstack-local-testing` | Local tunnel binary |
| `@dot-slash/browserstack-accessibility` | Accessibility testing |
| `@dot-slash/browserstack-test-management` | Test case management |
| `@dot-slash/browserstack-test-reporting` | Test analytics |
| `@dot-slash/browserstack-screenshots` | Screenshot automation |
