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


## App Automate npm Scripts for App Uploads

Similar to the above npm scripts for BrowserStack Local, you can upload and manage your app binaries (Android apk/aab, iOS ipa/zip packages) for various frameworks supported by BrowserStack. You can later refer to these in tests using the `bs://<app_id>` URIs.

> Note that this feature needs further testing, and the CLI commands and responses may change.


### Flutter

```
browserstack-app-automate flutter list ios
browserstack-app-automate flutter upload <local-file-path> ios
browserstack-app-automate flutter upload <public-url> <filename> ios
browserstack-app-automate flutter get <app-id> ios
browserstack-app-automate flutter delete <app-id> ios

browserstack-app-automate flutter list android
browserstack-app-automate flutter upload <local-file-path> android
browserstack-app-automate flutter upload <public-url> <filename> android
browserstack-app-automate flutter get <app-id> android
browserstack-app-automate flutter delete <app-id> android
```


### Appium

```
browserstack-app-automate appium list
browserstack-app-automate appium upload <local-file-path>
browserstack-app-automate appium upload <public-url> <filename>
browserstack-app-automate appium get <app-id>
browserstack-app-automate appium delete <app-id>
```


### Espresso

```
browserstack-app-automate espresso list
browserstack-app-automate espresso upload <local-file-path>
browserstack-app-automate espresso upload <public-url> <filename>
browserstack-app-automate espresso get <app-id>
browserstack-app-automate espresso delete <app-id>
```


### XCUITest

```
browserstack-app-automate xcuitest list
browserstack-app-automate xcuitest upload <local-file-path>
browserstack-app-automate xcuitest upload <public-url> <filename>
browserstack-app-automate xcuitest get <app-id>
browserstack-app-automate xcuitest delete <app-id>
```


### Detox Android

```
browserstack-app-automate detox upload <local-file-path> app
browserstack-app-automate detox upload <local-file-path> app-client
```


## JavaScript Testing Launch Helper

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


## Screenshots Launch Helper

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