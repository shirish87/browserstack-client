# @dot-slash/browserstack-test-management

BrowserStack Test Management API client — manage projects, test cases, and test runs.

## Install

```sh
npm install @dot-slash/browserstack-test-management
```

## Usage

```ts
import { TestManagementClient } from "@dot-slash/browserstack-test-management";

const client = new TestManagementClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// Projects
const { projects } = await client.getProjects();
const project = await client.getProject("proj-id");
const created = await client.createProject({ name: "My Project" });
await client.updateProject("proj-id", { name: "Renamed" });
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
