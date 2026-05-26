# @dot-slash/browserstack-accessibility

BrowserStack Accessibility API client — retrieve workflow analyzer reports and assisted test reports.

## Install

```sh
npm install @dot-slash/browserstack-accessibility
```

## Usage

```ts
import { AccessibilityClient } from "@dot-slash/browserstack-accessibility";

const client = new AccessibilityClient({
  username: process.env.BROWSERSTACK_USERNAME,
  accessKey: process.env.BROWSERSTACK_KEY,
});

// Workflow Analyzer
const reports = await client.getWorkflowAnalyzerReports();
const summary = await client.getWorkflowAnalyzerReportSummary(reportId);
const issues = await client.getWorkflowAnalyzerReportIssues(reportId);

// Assisted Test Reports
const testReports = await client.getAssistedTestReports();
const testSummary = await client.getAssistedTestReportSummary(reportId);
```

Credentials fall back to `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables if not passed in the constructor.

## Requirements

Node.js >= 22

## License

MIT
