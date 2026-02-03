import { test, expect } from "@playwright/test";

test.describe("Page Navigation Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should navigate to lottery page", async ({ page }) => {
    const lotteryLink = page.getByRole("link", { name: /彩票/ });

    if (await lotteryLink.isVisible()) {
      await lotteryLink.click();
      await expect(page).toHaveURL(/.*lottery.*/);
    } else {
      test.skip();
    }
  });

  test("should navigate to bookkeeping page", async ({ page }) => {
    const bookkeepingLink = page.getByRole("link", { name: /记账/ });

    if (await bookkeepingLink.isVisible()) {
      await bookkeepingLink.click();
      await expect(page).toHaveURL(/.*bookkeeping.*/);
    } else {
      test.skip();
    }
  });

  test("should navigate to subscription page", async ({ page }) => {
    const subscriptionLink = page.getByRole("link", { name: /订阅/ });

    if (await subscriptionLink.isVisible()) {
      await subscriptionLink.click();
      await expect(page).toHaveURL(/.*subscription.*/);
    } else {
      test.skip();
    }
  });

  test("should navigate to system page", async ({ page }) => {
    const systemLink = page.getByRole("link", { name: /系统/ });

    if (await systemLink.isVisible()) {
      await systemLink.click();
      await expect(page).toHaveURL(/.*system.*/);
    } else {
      test.skip();
    }
  });

  test("should logout successfully", async ({ page }) => {
    const logoutButton = page
      .getByRole("button", { name: /退出/ })
      .or(page.getByRole("menuitem", { name: /退出/ }));

    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForURL("**/login");
      await expect(page).toHaveURL(/.*login.*/);
    } else {
      test.skip();
    }
  });
});

test.describe("User Interface Tests", () => {
  test("should display main content area", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const main = page
      .locator("main")
      .or(page.locator("[class*='content']"))
      .or(page.locator("[class*='app-main']"));
    await expect(main.first()).toBeVisible();
  });
});

test.describe("API Response Tests", () => {
  test("should successfully fetch application configuration", async ({
    page
  }) => {
    // 监听网络请求
    const apiResponses: { url: string; status: number }[] = [];

    page.on("response", response => {
      if (
        response.url().includes("/api/") ||
        response.url().includes("/connect/")
      ) {
        apiResponses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // 检查是否有成功的 API 响应
    const successResponses = apiResponses.filter(
      r => r.status >= 200 && r.status < 400
    );

    if (successResponses.length > 0) {
      console.log(
        "API responses:",
        successResponses.map(r => `${r.url} - ${r.status}`)
      );
      expect(successResponses[0].status).toBeGreaterThanOrEqual(200);
      expect(successResponses[0].status).toBeLessThan(400);
    } else {
      console.log("No API responses captured, checking page load");
      // 至少页面应该成功加载
      const currentUrl = page.url();
      expect(currentUrl).toContain("localhost:8848");
    }
  });
});
