import { test, expect } from "@playwright/test";

test.describe("Playwright docs", () => {
  test("homepage has correct title", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("get started link navigates to intro", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    await page.getByRole("link", { name: "Get started" }).click();
    await expect(page).toHaveURL(/.*intro/);
  });

  test("docs page has search", async ({ page }) => {
    await page.goto("https://playwright.dev/docs/intro");
    const searchButton = page.getByRole("button", { name: /search/i });
    await expect(searchButton).toBeVisible();
  });

  test("intentionally failing test", async ({ page }) => {
    await page.goto("https://playwright.dev/");
    // This will fail — to demonstrate error span attributes
    await expect(page).toHaveTitle(/This title does not exist/);
  });
});
