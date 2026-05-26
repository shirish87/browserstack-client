# @dot-slash/browserstack-test-reporting

BrowserStack Test Reporting & Analytics API client — start builds, upload test results, and query build/session data.

## Install

```sh
npm install @dot-slash/browserstack-test-reporting
```

## Usage

```ts
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";

const client = new TestReportingClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// Projects and builds
const { data: projects } = await client.getProjects();
const build = await client.getBuild("build-id");
const latest = await client.getLatestBuild({ projectName: "my-project" });

// Start a new build
const newBuild = await client.startBuild({
  projectName: "my-project",
  buildName: "v1.2.3",
  framework: "playwright",
});

// Filtered project builds
const builds = await client.getProjectBuilds(projectId, undefined, "nightly");
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
