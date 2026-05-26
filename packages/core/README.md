# @dot-slash/browserstack-core

Shared runtime for all BrowserStack client packages — `APIClient` base class, auth resolution, typed error classes, and HTTP adapter interfaces.

This package is primarily used internally by the other `@dot-slash/browserstack-*` packages. Use it directly if you're building a custom BrowserStack API client.

## Install

```sh
npm install @dot-slash/browserstack-core
```

## Error handling

All clients throw typed errors you can narrow with the provided guards:

```ts
import {
  BrowserStackError,
  isHttpError,
  isNetworkError,
} from "@dot-slash/browserstack-core";

try {
  await client.getSession("sess456");
} catch (err) {
  if (isHttpError(err)) {
    console.error(err.status, err.message);
  } else if (isNetworkError(err)) {
    console.error("Network failure", err.message);
  }
}
```

## Auth resolution

```ts
import { resolveUsername, resolveAccessKey } from "@dot-slash/browserstack-core";

const username = resolveUsername({ username: "explicit" });
// Falls back to BROWSERSTACK_USERNAME env var if omitted
```

## Requirements

Node.js >= 22

## License

MIT
