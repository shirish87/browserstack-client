
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


## Usage

```
import { BrowserStack } from 'browserstack-client';

// BrowserStack JavaScript Testing API
const jsTestingClient = new BrowserStack.Client();

// BrowserStack Automate API
const automateClient = new BrowserStack.AutomateClient();

// BrowserStack App Automate API
const appAutomateClient = new BrowserStack.AppAutomateClient();

// BrowserStack Screenshots API
const screenshotsClient = new BrowserStack.ScreenshotsClient();

// BrowserStack Local Testing API
const localTestingClient = new BrowserStack.LocalTestingClient();
```



Please refer to the [documentation](https://shirish87.github.io/browserstack-client/api/variables/BrowserStack.html) for methods available for each of these clients.
