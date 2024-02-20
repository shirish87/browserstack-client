# Recipes

### Prerequisites
Please ensure you've set environment variables `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` in your shell.

## BrowserStackLocal in npm scripts for testing local websites

> NOTE: BrowserStack's Local Testing features require the download and execution of a non-OSS-licensed, proprietary binary executable provided by BrowserStack on your machine from the BrowserStack website. https://www.browserstack.com/docs/local-testing/internals

Example below shows use of npm `pre` and `post` scripts in `package.json` to start and stop the `BrowserStackLocal` binary. CLI script assumes a node.js runtime environment.

`npm i -D browserstack-client`

```json
{
  "name": "your-package",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "prestart": "browserstack-local start",
    "start": "node index.js",
    "poststart": "browserstack-local stop"
  },
  "devDependencies": {
    "browserstack-client": "latest"
  }
}

```

Optionally, you may supply a `localIdentifier` that distinguishes your current project from other local projects being tested on BrowserStack.

`browserstack-local (start|stop) [local-identifier]`

> Calling `browserstack-local stop` without a local-identifier will terminate all locally running instances of the binary that have previously been started by `browserstack-local start`.

You can also retrieve a list of active (not necessarily still running) local-identifiers spawned by `browserstack-local start [...]` using `browserstack-local list`.

TODO: Network proxy support for CLI. Use programmatic API if you require configuring a proxy.


## JavaScript Testing Helper

```ts
import { JSTestingClient } from "browserstack-client";

const jsTestingClient = new JSTestingClient();

const browser = await jsTestingClient.launch({
  os: "Windows",
  os_version: "11",
  browser: "Chrome",
  browser_version: "latest",
  url: "https://www.google.com",
});

await browser.updateURL("https://www.bing.com");
const pngArrayBuffer = await browser.getScreenshot();
await browser.terminate();
```


## Screenshots Helper

```ts
import { ScreenshotsClient } from "browserstack-client";

const screenshotsClient = new ScreenshotsClient();

const screenshots = await screenshotsClient.launch({
  url: "https://www.google.com",
  browsers: [
    {
      os: "Windows",
      os_version: "11",
      browser: "chrome",
      browser_version: "71.0",
    },
  ],
});
```