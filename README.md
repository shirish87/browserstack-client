
# BrowserStack Client

This module interfaces all REST APIs offered by [BrowserStack](https://www.browserstack.com).

***This module is a work-in-progress and may see breaking changes.***


## Installation
```
$ npm i --save browserstack-client
```

## Requirements

Please ensure that your BrowserStack account contains the required subscription(s) for using the APIs provided by this module.

Add your BrowserStack username and API key to the following environment variables for your shell.

You may also supply these credentials in code when creating an instance of an API client. See `options.username` and `options.key`.
```
BROWSERSTACK_USERNAME=<your-username>
BROWSERSTACK_KEY=<your-access-key>
```

Basic features require [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) support in your JavaScript runtime (`globalThis.fetch`).

Additional features (running [BrowserStackLocal](https://www.browserstack.com/docs/local-testing/releases-and-downloads) binary) require node.js runtime.


## Basic Usage

```ts
// index.mjs
import { BrowserStack } from "browserstack-client";

// set environment variables BROWSERSTACK_USERNAME and BROWSERSTACK_KEY

// BrowserStack JavaScript Testing API
const jsTestingClient = new BrowserStack.Client();
/* ...or
const jsTestingClient = new BrowserStack.Client({
  username: "<browserstack-username>",
  key: "<browserstack-access-key>",
});
*/

console.log(await jsTestingClient.getAccountStatus());

// BrowserStack Automate API
const automateClient = new BrowserStack.AutomateClient();
console.log(await automateClient.getPlan());

// BrowserStack App Automate API
const appAutomateClient = new BrowserStack.AppAutomateClient();
console.log(await appAutomateClient.getPlan());

// BrowserStack Screenshots API
const screenshotsClient = new BrowserStack.ScreenshotsClient();
console.log(await screenshotsClient.getBrowsers());

// BrowserStack Local Testing API
const localTestingClient = new BrowserStack.LocalTestingClient();
console.log(await localTestingClient.getBinaryInstances());
```

## Additional Features

Some features leverage node.js built-in modules (`node:*`) that may not be available in other JavaScript runtimes (such as [Deno](https://deno.com)).

These are bundled separately along with all basic features from above.

```js
// index.mjs
import { BrowserStack } from "browserstack-client/node";

const localTestingBinary = new BrowserStack.LocalTestingBinary({
  key: "<browserstack-access-key>", // or set environment variable BROWSERSTACK_KEY
  binHome: "<path-to-store-BrowserStackLocal-binary>", // or set environment variable BROWSERSTACK_LOCAL_BINARY_PATH
});

console.log(await localTestingBinary.start());
console.log(await localTestingBinary.stop());
```

## Deno Sample
```ts
/**
 * @run --allow-read --allow-net --allow-env index.ts
 */

import { load } from "https://deno.land/std@0.214.0/dotenv/mod.ts";
import { BrowserStack } from "https://esm.sh/browserstack-client@latest";

const env = await load();

const options = {
  username: env.BROWSERSTACK_USERNAME,
  key: env.BROWSERSTACK_KEY,
};

// BrowserStack JavaScript Testing API
const jsTestingClient = new BrowserStack.Client(options);
console.log(await jsTestingClient.getAccountStatus());
```

## Documentation

Please refer to the [documentation](https://shirish87.github.io/browserstack-client/api/variables/BrowserStack.html) for methods available for each of these clients.


## Proxy Support
```
npm install node-fetch
npm install proxy-agent // or proxy specific https-proxy-agent (see docs)
```
* Docs for [node-fetch](https://www.npmjs.com/package/node-fetch#custom-agent)
* Docs for [proxy-agent](https://github.com/TooTallNate/proxy-agents/tree/main/packages/proxy-agent)

```js
// index.mjs
import { Client } from "browserstack-client";
import fetch from "node-fetch";
import { ProxyAgent } from "proxy-agent";

// Docs:
// https://www.npmjs.com/package/node-fetch#custom-agent
// https://github.com/TooTallNate/proxy-agents/tree/main/packages/proxy-agent

const agent = new ProxyAgent();

// BrowserStack JavaScript Testing API
const jsTestingClient = new Client({
  username: "<browserstack-username>",
  key: "<browserstack-access-key>",
  // provide your own Fetch API implementation
  fetch: (url, init) => fetch(url, { ...init, agent }),
});

console.log(await jsTestingClient.getAccountStatus());

```
