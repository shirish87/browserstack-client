# @dot-slash/browserstack-screenshots

BrowserStack Screenshots API client — trigger cross-browser screenshot jobs and retrieve results.

## Install

```sh
npm install @dot-slash/browserstack-screenshots
```

## Usage

```ts
import { ScreenshotsClient } from "@dot-slash/browserstack-screenshots";

const client = new ScreenshotsClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// Available browsers
const browsers = await client.getBrowsers();

// Create a screenshot job
const job = await client.createJob({
  url: "https://example.com",
  browsers: [{ os: "Windows", osVersion: "11", browser: "chrome", browserVersion: "latest" }],
});

// Poll for results
const result = await client.getJob(job.jobId);
console.log(result.screenshots); // array with screenshot URLs
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
