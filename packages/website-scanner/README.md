# @dot-slash/browserstack-website-scanner

BrowserStack Website Scanner API client — create and manage accessibility/compliance scans for websites.

## Install

```sh
npm install @dot-slash/browserstack-website-scanner
```

## Usage

```ts
import { WebsiteScannerClient } from "@dot-slash/browserstack-website-scanner";

const client = new WebsiteScannerClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// Scans
const scans = await client.listWebsiteScannerScans();
const scan = await client.getWebsiteScannerScan(projId);
const newScan = await client.createWebsiteScannerScan({
  url: "https://example.com",
});

// Auth configs (for scanning authenticated pages)
const configs = await client.listWebsiteScannerAuthConfigs();
await client.createWebsiteScannerAuthConfig({ /* ... */ });
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
