# @dot-slash/browserstack-local-testing-api

BrowserStack Local Testing API client — list and disconnect active Local binary instances.

> For starting and stopping the Local binary itself, see [`@dot-slash/browserstack-local-testing`](https://www.npmjs.com/package/@dot-slash/browserstack-local-testing).

## Install

```sh
npm install @dot-slash/browserstack-local-testing-api
```

## Usage

```ts
import { LocalTestingClient } from "@dot-slash/browserstack-local-testing-api";

const client = new LocalTestingClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// List active tunnel instances
const instances = await client.getInstances();

// Get a specific instance
const instance = await client.getInstance("instance-id");

// Disconnect an instance
await client.disconnectInstance("instance-id");
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
