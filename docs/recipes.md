# Recipes

### Prerequisites
* Environment variables `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` set in your shell
* Node.js runtime

## BrowserStackLocal in npm scripts for testing local websites

> NOTE: BrowserStack's Local Testing features require the download and execution of a non-OSS-licensed, proprietary binary executable provided by BrowserStack on your machine from the BrowserStack website. https://www.browserstack.com/docs/local-testing/internals

Example below shows use of [npm `pre` and `post` scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts#pre--post-scripts) in `package.json` to start and stop the `BrowserStackLocal` binary.

> npm install --save-dev browserstack-client

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

However, if the npm `start` command exits with an error, the `poststart` script is never executed, and the BrowserStackLocal binary is left running on your system. You can clean up all binaries by running `browserstack-local stop`.

A better option is to use `browserstack-local run-with -- <your-command>`.

This will:
- Start the local binary
- Set `BROWSERSTACK_LOCAL_IDENTIFIER` environment variable for `<your-command>`
- Run `<your-command>` _synchronously_ as a child process inheriting `std*`
- Stop the local binary after `<your-command>` ends
- Exit with the exit code of `<your-command>`

```json
{
  "name": "your-package",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    // use %npm_package_name% to pass your package name as localIdentifier on Windows
    "test": "browserstack-local run-with $npm_package_name -- playwright test",
  },
  "devDependencies": {
    "browserstack-client": "latest"
  }
}
```

Optionally, you may supply a `localIdentifier` that distinguishes your current project from other local projects under testing on BrowserStack, else a random `localIdentifier` will be used.

`browserstack-local (start|stop|run-with) [local-identifier]`


```
# start with a random local-identifier
browserstack-local start

# start with a local-identifier "local-1"
browserstack-local start local-1

# list all known* local-identifiers
browserstack-local list

# stop instance with local-identifier "local-1"
browserstack-local stop local-1

# stop all instances with known* local-identifiers
browserstack-local stop

* instances started with "browserstack-local start" (may not still be running)
```

TODO: Network proxy support for CLI. Use programmatic API if you require configuring a proxy.


## App Automate npm Scripts for App/Media Uploads

Similar to the above npm scripts for BrowserStack Local, you can upload and manage your app binaries (Android apk/aab, iOS ipa/zip packages) for various frameworks supported by BrowserStack and media files (images, videos, audio). You can later refer to these in tests using the `bs://<app-id>` or `media://<media-id>` URIs.

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

### Media Files
```
browserstack-app-automate media list
browserstack-app-automate media upload <local-file-path>
browserstack-app-automate media get <media-id>
browserstack-app-automate media delete <media-id>
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