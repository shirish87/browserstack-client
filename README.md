# BrowserStack Client

This monorepo contains TypeScript clients for all REST APIs offered by [BrowserStack](https://www.browserstack.com).

![Build Status](https://github.com/shirish87/browserstack-client/actions/workflows/main.yml/badge.svg)

## Installation

Install all BrowserStack clients at once:

```bash
$ npm i @dot-slash/browserstack-client
```

Or install only the client(s) you need:

```bash
# Automate
$ npm i @dot-slash/browserstack-automate

# App Automate
$ npm i @dot-slash/browserstack-app-automate

# Local Testing (API & Binary)
$ npm i @dot-slash/browserstack-local-testing-api @dot-slash/browserstack-local-testing

# Accessibility
$ npm i @dot-slash/browserstack-accessibility

# Test Management
$ npm i @dot-slash/browserstack-test-management

# Test Reporting & Analytics
$ npm i @dot-slash/browserstack-test-reporting

# Screenshots
$ npm i @dot-slash/browserstack-screenshots
```

## Requirements

- **Node.js**: 20.0.0 or higher.
- **BrowserStack Account**: Please ensure that your BrowserStack account contains the required subscription(s) for using the APIs provided by these modules.

Add your BrowserStack username and API key to the following environment variables for your shell:

```bash
BROWSERSTACK_USERNAME=<your-username>
BROWSERSTACK_ACCESS_KEY=<your-access-key>
```

You may also supply these credentials in code when creating an instance of an API client.

## Basic Usage

Each client is exported from its own package:

```ts
import { AutomateClient } from "@dot-slash/browserstack-automate";
import { AccessibilityClient } from "@dot-slash/browserstack-accessibility";
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { TestManagementClient } from "@dot-slash/browserstack-test-management";

// BrowserStack Automate API
const automateClient = new AutomateClient();
const plan = await automateClient.getPlan();
console.log(plan);

// BrowserStack Accessibility API
const accessibilityClient = new AccessibilityClient();
const reports = await accessibilityClient.getWorkflowAnalyzerReports();
console.log(reports);

// BrowserStack Test Management API
const tmClient = new TestManagementClient();
const projects = await tmClient.getProjects();
console.log(projects);
```

## More Clients

### App Automate

```ts
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";

const appAutomateClient = new AppAutomateClient();
const projects = await appAutomateClient.getProjects();
const builds = await appAutomateClient.getBuilds(projects[0].id);
console.log(builds);
```

### Test Reporting

```ts
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";

const trClient = new TestReportingClient();

const build = await trClient.startBuild({
  projectName: "my-project",
  buildName: "my-build",
  framework: "playwright",
});

// ... run tests, report results ...

await trClient.finishBuild(build.buildHashedId, { status: "passed" });
```

### Screenshots

```ts
import { ScreenshotsClient } from "@dot-slash/browserstack-screenshots";

const screenshotsClient = new ScreenshotsClient();

const screenshots = await screenshotsClient.launch(
  {
    url: "https://example.com",
    browsers: [{ browser: "chrome", browser_version: "latest", os: "Windows", os_version: "11" }],
  },
  (screenshot) => console.log("captured:", screenshot.imageUrl)
);
```

## CLI Usage

The monorepo also provides a unified CLI for interacting with various BrowserStack products and managing Local Testing:

```bash
# List projects in Automate
$ npx @dot-slash/browserstack-cli automate list-projects

# List Accessibility workflow analyzer reports
$ npx @dot-slash/browserstack-cli accessibility workflow-analyzer list

# Local Testing
$ npx @dot-slash/browserstack-cli local start
$ npx @dot-slash/browserstack-cli local stop
$ npx @dot-slash/browserstack-cli local list

# Run a command with Local Testing automatically managed
$ npx @dot-slash/browserstack-cli local run-with -- npm test
```

## Additional Features (Node.js only)

Running the [BrowserStackLocal](https://www.browserstack.com/docs/local-testing/releases-and-downloads) binary requires the `@dot-slash/browserstack-local-testing` package.

```ts
import { LocalTestingBinary } from "@dot-slash/browserstack-local-testing";

const localTestingBinary = new LocalTestingBinary({
  accessKey: "<your-access-key>",
});

await localTestingBinary.start();
// ... run tests ...
await localTestingBinary.stop();
```

## Documentation

Please refer to the [documentation](https://shirish87.github.io/browserstack-client/) for methods available for each of these clients.

## Thanks

Sponsored access to [BrowserStack](https://www.browserstack.com/), courtesy BrowserStack.
