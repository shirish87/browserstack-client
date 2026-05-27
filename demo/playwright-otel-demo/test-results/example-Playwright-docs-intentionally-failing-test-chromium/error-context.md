# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.ts >> Playwright docs >> intentionally failing test
- Location: tests/example.spec.ts:21:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /This title does not exist/
Received string:  "Fast and reliable end-to-end testing for modern web apps | Playwright"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value "Fast and reliable end-to-end testing for modern web apps | Playwright"

```

```yaml
- region "Skip to main content":
  - link "Skip to main content":
    - /url: "#__docusaurus_skipToContent_fallback"
- navigation "Main":
  - link "Playwright logo Playwright":
    - /url: /
    - img "Playwright logo"
    - text: Playwright
  - link "Docs":
    - /url: /docs/intro
  - link "MCP":
    - /url: /mcp/introduction
  - link "CLI":
    - /url: /agent-cli/introduction
  - link "API":
    - /url: /docs/api/class-playwright
  - button "Node.js"
  - link "GitHub repository":
    - /url: https://github.com/microsoft/playwright
  - link "Discord server":
    - /url: https://aka.ms/playwright/discord
  - button "Switch between dark and light mode (currently system mode)"
  - button "Search (Ctrl+K)":
    - text: Search
    - img
    - text: K
- banner:
  - heading "Playwright enables reliable web automation for testing, scripting, and AI agents." [level=1]
  - paragraph:
    - text: One API to drive Chromium, Firefox, and WebKit — in your tests, your scripts, and your agent workflows. Available for
    - link "TypeScript":
      - /url: https://playwright.dev/docs/intro
    - text: ","
    - link "Python":
      - /url: https://playwright.dev/python/docs/intro
    - text: ","
    - link ".NET":
      - /url: https://playwright.dev/dotnet/docs/intro
    - text: ", and"
    - link "Java":
      - /url: https://playwright.dev/java/docs/intro
    - text: .
  - link "Get started":
    - /url: /docs/intro
  - link "Star microsoft/playwright on GitHub":
    - /url: https://github.com/microsoft/playwright
    - text: Star
  - link "89k+ stargazers on GitHub":
    - /url: https://github.com/microsoft/playwright/stargazers
    - text: 89k+
- main:
  - heading "Playwright Test" [level=3]
  - paragraph: Full-featured test runner with auto-waiting, assertions, tracing, and parallelism across Chromium, Firefox, and WebKit.
  - code: npm init playwright@latest
  - link "Testing documentation":
    - /url: /docs/intro
  - heading "Playwright CLI" [level=3]
  - paragraph: Token-efficient browser automation for coding agents like Claude Code and GitHub Copilot. Skill-based workflows without large context overhead.
  - code: npm i -g @playwright/cli@latest
  - link "CLI documentation":
    - /url: /docs/getting-started-cli
  - heading "Playwright MCP" [level=3]
  - paragraph: Model Context Protocol server that gives AI agents full browser control through structured accessibility snapshots.
  - code: npx @playwright/mcp@latest
  - link "MCP documentation":
    - /url: /docs/getting-started-mcp
  - heading "Built for testing" [level=2]
  - heading "Auto-wait and web-first assertions" [level=4]
  - paragraph: Playwright waits for elements to be actionable before performing actions. Assertions automatically retry until conditions are met. No artificial timeouts, no flaky tests.
  - heading "Test isolation" [level=4]
  - paragraph: Each test gets a fresh browser context — equivalent to a brand new browser profile. Full isolation with near-zero overhead. Save authentication state once and reuse it across tests.
  - heading "Resilient locators" [level=4]
  - paragraph:
    - text: "Find elements with selectors that mirror how users see the page:"
    - code: getByRole
    - text: ","
    - code: getByLabel
    - text: ","
    - code: getByPlaceholder
    - text: ","
    - code: getByTestId
    - text: . No brittle CSS paths.
  - heading "Parallelism and sharding" [level=4]
  - paragraph: Tests run in parallel by default across all configured browsers. Shard across multiple machines for faster CI. Full cross-browser coverage on every commit.
  - heading "Built for AI agents" [level=2]
  - heading "Accessibility snapshots, not screenshots" [level=4]
  - paragraph: Agents interact with pages through structured accessibility trees — element roles, names, and refs. Deterministic and unambiguous, no vision models required.
  - heading "MCP server" [level=4]
  - paragraph:
    - text: Drop-in
    - link "Model Context Protocol":
      - /url: https://modelcontextprotocol.io
    - text: server for VS Code, Cursor, Claude Desktop, Windsurf, and any MCP client. Full browser control through standard tool calls.
  - heading "CLI for coding agents" [level=4]
  - paragraph: Token-efficient command-line interface with installable skills. Purpose-built for Claude Code, GitHub Copilot, and similar coding agents that need to balance browser automation with large codebases.
  - heading "Session monitoring" [level=4]
  - paragraph: Visual dashboard with live screencast previews of all running browser sessions. Click any session to zoom in and take control.
  - heading "Powerful tooling" [level=2]
  - heading "Test generator" [level=4]:
    - link "Test generator":
      - /url: docs/codegen
  - paragraph: Record your actions in the browser and Playwright writes the test code. Generate assertions from the recording toolbar. Pick locators by clicking on elements.
  - heading "Trace Viewer" [level=4]:
    - link "Trace Viewer":
      - /url: docs/trace-viewer-intro
  - paragraph: Full timeline of test execution with DOM snapshots, network requests, console logs, and screenshots at every step. Investigate failures without re-running.
  - heading "VS Code extension" [level=4]:
    - link "VS Code extension":
      - /url: docs/getting-started-vscode
  - paragraph: Run, debug, and generate tests directly in the editor. Set breakpoints, live-inspect locators in the browser, and view full execution traces in the sidebar.
  - img "Chromium, Firefox, WebKit"
  - paragraph:
    - text: Any browser. Any platform. Chromium, Firefox, and WebKit on Linux, macOS, and Windows. Headless and headed. Also available for
    - link "Python":
      - /url: https://playwright.dev/python/docs/intro
    - text: ","
    - link ".NET":
      - /url: https://playwright.dev/dotnet/docs/intro
    - text: ", and"
    - link "Java":
      - /url: https://playwright.dev/java/docs/intro
    - text: .
  - heading "Chosen by companies and open source projects" [level=2]
  - list:
    - listitem:
      - link "VS Code":
        - /url: https://code.visualstudio.com
        - img "VS Code"
    - listitem:
      - link "Bing":
        - /url: https://bing.com
        - img "Bing"
    - listitem:
      - link "Outlook":
        - /url: https://outlook.com
        - img "Outlook"
    - listitem:
      - link "Disney+ Hotstar":
        - /url: https://www.hotstar.com/
        - img "Disney+ Hotstar"
    - listitem:
      - link "Material UI":
        - /url: https://github.com/mui-org/material-ui
        - img "Material UI"
    - listitem:
      - link "ING":
        - /url: https://github.com/ing-bank/lion
        - img "ING"
    - listitem:
      - link "Adobe":
        - /url: https://github.com/adobe/spectrum-web-components
        - img "Adobe"
    - listitem:
      - link "React Navigation":
        - /url: https://github.com/react-navigation/react-navigation
        - img "React Navigation"
    - listitem:
      - link "Accessibility Insights":
        - /url: https://accessibilityinsights.io/
        - img "Accessibility Insights"
- contentinfo:
  - text: Learn
  - list:
    - listitem:
      - link "Getting started":
        - /url: /docs/intro
    - listitem:
      - link "Playwright Training":
        - /url: https://learn.microsoft.com/en-us/training/modules/build-with-playwright/
    - listitem:
      - link "Learn Videos":
        - /url: /community/learn-videos
    - listitem:
      - link "Feature Videos":
        - /url: /community/feature-videos
  - text: Community
  - list:
    - listitem:
      - link "Stack Overflow":
        - /url: https://stackoverflow.com/questions/tagged/playwright
    - listitem:
      - link "Discord":
        - /url: https://aka.ms/playwright/discord
    - listitem:
      - link "Twitter":
        - /url: https://twitter.com/playwrightweb
    - listitem:
      - link "LinkedIn":
        - /url: https://www.linkedin.com/company/playwrightweb
  - text: More
  - list:
    - listitem:
      - link "GitHub":
        - /url: https://github.com/microsoft/playwright
    - listitem:
      - link "YouTube":
        - /url: https://www.youtube.com/channel/UC46Zj8pDH5tDosqm1gd7WTg
    - listitem:
      - link "Blog":
        - /url: https://dev.to/playwright
    - listitem:
      - link "Ambassadors":
        - /url: /community/ambassadors
    - listitem:
      - link "Microsoft Privacy Statement":
        - /url: https://go.microsoft.com/fwlink/?LinkId=521839
  - text: Copyright © 2026 Microsoft
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Playwright docs", () => {
  4  |   test("homepage has correct title", async ({ page }) => {
  5  |     await page.goto("https://playwright.dev/");
  6  |     await expect(page).toHaveTitle(/Playwright/);
  7  |   });
  8  | 
  9  |   test("get started link navigates to intro", async ({ page }) => {
  10 |     await page.goto("https://playwright.dev/");
  11 |     await page.getByRole("link", { name: "Get started" }).click();
  12 |     await expect(page).toHaveURL(/.*intro/);
  13 |   });
  14 | 
  15 |   test("docs page has search", async ({ page }) => {
  16 |     await page.goto("https://playwright.dev/docs/intro");
  17 |     const searchButton = page.getByRole("button", { name: /search/i });
  18 |     await expect(searchButton).toBeVisible();
  19 |   });
  20 | 
  21 |   test("intentionally failing test", async ({ page }) => {
  22 |     await page.goto("https://playwright.dev/");
  23 |     // This will fail — to demonstrate error span attributes
> 24 |     await expect(page).toHaveTitle(/This title does not exist/);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  25 |   });
  26 | });
  27 | 
```