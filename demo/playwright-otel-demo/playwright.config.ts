import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: "list",
  use: {
    headless: true,
    baseURL: "https://playwright.dev",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
