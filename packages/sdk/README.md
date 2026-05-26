# @dot-slash/browserstack-client

All BrowserStack API clients in one package — Automate, App Automate, Local Testing, Accessibility, Test Management, Test Reporting, Screenshots, and Website Scanner.

## Install

```sh
npm install @dot-slash/browserstack-client
```

## Usage

Each product is available as a named subpath export:

```ts
import { AutomateClient } from "@dot-slash/browserstack-client/automate";
import { AppAutomateClient } from "@dot-slash/browserstack-client/app-automate";
import { LocalTestingClient } from "@dot-slash/browserstack-client/local-testing";
import { AccessibilityClient } from "@dot-slash/browserstack-client/accessibility";
import { TestManagementClient } from "@dot-slash/browserstack-client/test-management";
import { TestReportingClient } from "@dot-slash/browserstack-client/test-reporting";
import { ScreenshotsClient } from "@dot-slash/browserstack-client/screenshots";
import { WebsiteScannerClient } from "@dot-slash/browserstack-client/website-scanner";
```

Credentials are read from `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables, or passed directly:

```ts
const client = new AutomateClient({
  username: "your-username",
  accessKey: "your-access-key",
});
```

## Individual packages

Prefer only one product? Install the focused package instead:

| Package | npm |
|---------|-----|
| Automate | `@dot-slash/browserstack-automate` |
| App Automate | `@dot-slash/browserstack-app-automate` |
| Local Testing (API) | `@dot-slash/browserstack-local-testing-api` |
| Local Testing (binary) | `@dot-slash/browserstack-local-testing` |
| Accessibility | `@dot-slash/browserstack-accessibility` |
| Test Management | `@dot-slash/browserstack-test-management` |
| Test Reporting | `@dot-slash/browserstack-test-reporting` |
| Screenshots | `@dot-slash/browserstack-screenshots` |
| Website Scanner | `@dot-slash/browserstack-website-scanner` |

## Requirements

Node.js >= 22

## License

MIT
