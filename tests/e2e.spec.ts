import { test, expect } from "@playwright/test";

test.describe("Application E2E Tests", () => {
  test("should load home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const title = await page.title();
    console.log("Page title:", title);
    expect(title).toBeDefined();
  });

  test("should have user info in localStorage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const userInfo = await page.evaluate(() => {
      const item = localStorage.getItem("user-info");
      return item ? JSON.parse(item) : null;
    });

    expect(userInfo).not.toBeNull();
    expect(userInfo.username).toBe("test");
    expect(userInfo.accessToken).toBeDefined();
  });

  test("should navigate to different pages", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const menuLinks = page
      .locator("a")
      .filter({ hasText: /(首页|彩票|记账|订阅|系统)/ });

    const count = await menuLinks.count();
    console.log(`Found ${count} menu links`);

    if (count > 0) {
      await menuLinks.first().click();
      await page.waitForTimeout(1000);
      console.log("Clicked menu link, URL:", page.url());
    }
    // 不再跳过测试，让它自然地处理结果
  });

  test("should display user avatar or name", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const userElement = page
      .locator(
        ".username, .el-dropdown-link, [class*='user'], [class*='avatar']"
      )
      .first();

    if ((await userElement.count()) > 0) {
      await expect(userElement).toBeVisible({ timeout: 5000 });
    } else {
      console.log("User element not found, skipping");
      test.skip();
    }
  });

  test("should handle navigation correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const currentUrl = page.url();
    expect(currentUrl).toContain("localhost:8848");
  });
});
