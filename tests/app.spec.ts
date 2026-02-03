import { test, expect } from "@playwright/test";

test.describe("Authentication Tests", () => {
  test("should access protected page after authentication", async ({
    page
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/DFApp|首页/);
  });

  test("should display user information", async ({ page }) => {
    await page.goto("/");

    const userInfo = await page.evaluate(() => {
      const userKey = "user-info";
      const item = localStorage.getItem(userKey);
      return item ? JSON.parse(item) : null;
    });

    expect(userInfo).not.toBeNull();
    expect(userInfo.username).toBe("test");
  });

  test("should navigate to lottery page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const lotteryLink = page.getByRole("link", { name: /彩票/ });
    if (await lotteryLink.isVisible()) {
      await lotteryLink.click();
      await expect(page).toHaveURL(/.*lottery.*/);
    }
  });
});
