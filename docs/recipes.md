# Recipes

### Prerequisites
* Environment variables `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` set in your shell
* Node.js runtime

## BrowserStackLocal in npm scripts for testing local websites

> NOTE: BrowserStack's Local Testing features require the download and execution of a non-OSS-licensed, proprietary binary executable provided by BrowserStack on your machine from the BrowserStack website. https://www.browserstack.com/docs/local-testing/internals

Example below shows use of [npm `pre` and `post` scripts](https://docs.npmjs.com/cli/v10/using-npm/scripts#pre--post-scripts) in `package.json` to start and stop the `BrowserStackLocal` binary.

> npm install --save-dev @dot-slash/browserstack-cli

```json
{
  "name": "your-package",
  "version": "6.0.0",
  "main": "index.js",
  "scripts": {
    "prestart": "browserstack-cli local start",
    "start": "node index.js",
    "poststart": "browserstack-cli local stop"
  },
  "devDependencies": {
    "@dot-slash/browserstack-cli": "latest"
  }
}

```

However, if the npm `start` command exits with an error, the `poststart` script is never executed, and the BrowserStackLocal binary is left running on your system. You can clean up all binaries by running `browserstack-cli local stop`.

A better option is to use `browserstack-cli local run-with -- <your-command>`.

This will:
- Start the local binary
- Set `BROWSERSTACK_LOCAL_IDENTIFIER` environment variable for `<your-command>`
- Run `<your-command>` _synchronously_ as a child process inheriting `std*`
- Stop the local binary after `<your-command>` ends
- Exit with the exit code of `<your-command>`

```json
{
  "name": "your-package",
  "version": "6.0.0",
  "main": "index.js",
  "scripts": {
    // use %npm_package_name% to pass your package name as localIdentifier on Windows
    "test": "browserstack-cli local run-with $npm_package_name -- playwright test",
  },
  "devDependencies": {
    "@dot-slash/browserstack-cli": "latest"
  }
}
```

Optionally, you may supply a `localIdentifier` that distinguishes your current project from other local projects under testing on BrowserStack, else a random `localIdentifier` will be used.

`browserstack-cli local (start|stop|run-with) [local-identifier]`


```bash
# start with a random local-identifier
npx @dot-slash/browserstack-cli local start

# start with a local-identifier "local-1"
npx @dot-slash/browserstack-cli local start local-1

# list all known* local-identifiers
npx @dot-slash/browserstack-cli local list

# stop instance with local-identifier "local-1"
npx @dot-slash/browserstack-cli local stop local-1

# stop all instances with known* local-identifiers
npx @dot-slash/browserstack-cli local stop

* instances started with "browserstack-cli local start" (may not still be running)
```

TODO: Network proxy support for CLI. Use programmatic API if you require configuring a proxy.


## App Automate npm Scripts for App/Media Uploads

Similar to the above npm scripts for BrowserStack Local, you can upload and manage your app binaries (Android apk/aab, iOS ipa/zip packages) for various frameworks supported by BrowserStack and media files (images, videos, audio). You can later refer to these in tests using the `bs://<app-id>` or `media://<media-id>` URIs.

### Flutter
```bash
npx @dot-slash/browserstack-cli app-automate flutter list ios
npx @dot-slash/browserstack-cli app-automate flutter upload <local-file-path> ios
npx @dot-slash/browserstack-cli app-automate flutter upload <public-url> <filename> ios
npx @dot-slash/browserstack-cli app-automate flutter get <app-id> ios
npx @dot-slash/browserstack-cli app-automate flutter delete <app-id> ios

npx @dot-slash/browserstack-cli app-automate flutter list android
npx @dot-slash/browserstack-cli app-automate flutter upload <local-file-path> android
npx @dot-slash/browserstack-cli app-automate flutter upload <public-url> <filename> android
npx @dot-slash/browserstack-cli app-automate flutter get <app-id> android
npx @dot-slash/browserstack-cli app-automate flutter delete <app-id> android
```

### Appium
```bash
npx @dot-slash/browserstack-cli app-automate appium list
npx @dot-slash/browserstack-cli app-automate appium upload <local-file-path>
npx @dot-slash/browserstack-cli app-automate appium upload <public-url> <filename>
npx @dot-slash/browserstack-cli app-automate appium get <app-id>
npx @dot-slash/browserstack-cli app-automate appium delete <app-id>
```

### Espresso
```bash
npx @dot-slash/browserstack-cli app-automate espresso list
npx @dot-slash/browserstack-cli app-automate espresso upload <local-file-path>
npx @dot-slash/browserstack-cli app-automate espresso upload <public-url> <filename>
npx @dot-slash/browserstack-cli app-automate espresso get <app-id>
npx @dot-slash/browserstack-cli app-automate espresso delete <app-id>
```

### XCUITest
```bash
npx @dot-slash/browserstack-cli app-automate xcuitest list
npx @dot-slash/browserstack-cli app-automate xcuitest upload <local-file-path>
npx @dot-slash/browserstack-cli app-automate xcuitest upload <public-url> <filename>
npx @dot-slash/browserstack-cli app-automate xcuitest get <app-id>
npx @dot-slash/browserstack-cli app-automate xcuitest delete <app-id>
```

### Detox Android
```bash
npx @dot-slash/browserstack-cli app-automate detox upload <local-file-path> app
npx @dot-slash/browserstack-cli app-automate detox upload <local-file-path> app-client
```

### Media Files
```bash
npx @dot-slash/browserstack-cli app-automate media list
npx @dot-slash/browserstack-cli app-automate media upload <local-file-path>
npx @dot-slash/browserstack-cli app-automate media get <media-id>
npx @dot-slash/browserstack-cli app-automate media delete <media-id>
```


## JavaScript Testing Launch Helper

```ts
import { JSTestingClient } from "@dot-slash/browserstack-js-testing";

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
import { ScreenshotsClient } from "@dot-slash/browserstack-screenshots";

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
