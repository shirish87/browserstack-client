# BrowserStack Client

This monorepo contains TypeScript clients for all REST APIs offered by [BrowserStack](https://www.browserstack.com).

![Build Status](https://github.com/shirish87/browserstack-client/actions/workflows/main.yml/badge.svg)

## Installation

Install the specific product client you need:

```bash
# Automate
$ npm i @browserstack-client/automate

# App Automate
$ npm i @browserstack-client/app-automate

# Accessibility
$ npm i @browserstack-client/accessibility

# Test Management
$ npm i @browserstack-client/test-management

# Local Testing (API & Binary)
$ npm i @browserstack-client/local-testing @browserstack-client/local-testing-binary
```

## Requirements

Please ensure that your BrowserStack account contains the required subscription(s) for using the APIs provided by these modules.

Add your BrowserStack username and API key to the following environment variables for your shell:

```bash
BROWSERSTACK_USERNAME=<your-username>
BROWSERSTACK_ACCESS_KEY=<your-access-key>
```

You may also supply these credentials in code when creating an instance of an API client.

## Basic Usage

Each client is exported from its own package:

```ts
import { AutomateClient } from "@browserstack-client/automate";
import { AccessibilityClient } from "@browserstack-client/accessibility";
import { AppAutomateClient } from "@browserstack-client/app-automate";
import { TestManagementClient } from "@browserstack-client/test-management";

// BrowserStack Automate API
const automateClient = new AutomateClient();
const plan = await automateClient.getAutomatePlan();
console.log(plan);

// BrowserStack Accessibility API
const accessibilityClient = new AccessibilityClient();
const reports = await accessibilityClient.getAccessibilityWorkflowAnalyzerReports();
console.log(reports);

// BrowserStack Test Management API
const tmClient = new TestManagementClient();
const projects = await tmClient.getTestManagementProjects();
console.log(projects);
```

## CLI Usage

The monorepo also provides a unified CLI:

```bash
$ npx @browserstack-client/cli accessibility workflow-analyzer list
$ npx @browserstack-client/cli automate list-projects
```

## Additional Features (Node.js only)

Running the [BrowserStackLocal](https://www.browserstack.com/docs/local-testing/releases-and-downloads) binary requires the `@browserstack-client/local-testing-binary` package.

```ts
import { LocalTestingBinary } from "@browserstack-client/local-testing-binary";

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
