# @dot-slash/browserstack-local-testing

Downloads, starts, and stops the BrowserStackLocal binary for Node.js — enables Local Testing tunnels in automation pipelines.

## Install

```sh
npm install @dot-slash/browserstack-local-testing
```

## Usage

```ts
import { LocalTestingBinary } from "@dot-slash/browserstack-local-testing";

const tunnel = new LocalTestingBinary({
  key: process.env.BROWSERSTACK_KEY,
  // optional binary location — defaults to ~/.browserstack
  binaryPath: "/tmp/bs-local",
});

// Download (if needed) and start the tunnel
const message = await tunnel.start(); // "Connected"

console.log(tunnel.state); // "started"
console.log(tunnel.pid);   // process id

// Stop the tunnel
await tunnel.stop();
```

The binary is downloaded automatically on first use. You can also call `tunnel.version()` to check the installed binary version without starting a tunnel.

## Folder/server testing flags

```ts
const tunnel = new LocalTestingBinary({
  key: process.env.BROWSERSTACK_KEY,
  localIdentifier: "my-tunnel",
  forceLocal: true,
  only: [{ host: "localhost", port: 3000, ssl: false }],
});
```

Credentials fall back to `BROWSERSTACK_KEY` / `BROWSERSTACK_ACCESS_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
