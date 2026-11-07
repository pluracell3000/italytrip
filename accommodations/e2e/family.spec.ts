import { test, expect, type Page } from "@playwright/test";
async function login(page: Page, password = "test-family-password-only") {
  await page.goto("/");
  await page.getByLabel("סיסמת המשפחה או המנהל").fill(password);
  await page.getByRole("button", { name: "כניסה למסע" }).click();
  await expect(
    page.getByRole("heading", { name: /שלושה מקומות/ }),
  ).toBeVisible();
}
test("Hebrew mobile layout, unknown prices, comparison and shared family persistence", async ({
  page,
  browser,
}) => {
  await login(page);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/mobile-overview.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "מקומות לינה", exact: true }).click();
  await expect(
    page.getByText("עדיין אין הצעה מאומתת לתאריכים שלנו.", { exact: false }),
  ).toBeVisible();
  const card = page.locator(".unit-card").first();
  await expect(card.getByText("מחיר כולל טרם אומת")).toBeVisible();
  await card.getByRole("button", { name: "שמירה למועדפים" }).click();
  await expect(
    card.getByRole("button", { name: "הסרה מהמועדפים" }),
  ).toBeVisible();
  await card.getByRole("button", { name: "לבחור לשהייה" }).click();
  await expect(
    card.getByRole("button", { name: "נבחר על ידינו" }),
  ).toBeVisible();
  await card.getByRole("button", { name: "להשוואה", exact: true }).click();
  await page.getByRole("button", { name: /להשוואת 1 מקומות/ }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "לא ידוע — יש לברר עמלות ומסים" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const other = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const p2 = await other.newPage();
  await login(p2);
  await p2.getByRole("button", { name: "הבחירות שלנו", exact: true }).click();
  await expect(p2.getByText("נבחר על ידינו · לא הוזמן")).toBeVisible();
  await expect(p2.locator(".unit-card")).toHaveCount(1);
  await p2
    .getByPlaceholder("מה חשוב לנו לברר?")
    .first()
    .fill("בדיקת שיתוף בין שני דפדפנים");
  await p2.getByRole("button", { name: "שמירת הערה" }).first().click();
  await page.reload();
  await page.getByRole("button", { name: "הבחירות שלנו", exact: true }).click();
  await expect(page.getByText("בדיקת שיתוף בין שני דפדפנים")).toBeVisible();
  await page.screenshot({
    path: "test-results/mobile-family.png",
    fullPage: true,
  });
  await other.close();
});
test("anonymous and family users cannot mutate administration or invoke scans", async ({
  page,
  request,
}) => {
  expect((await request.get("/api/state")).status()).toBe(401);
  expect((await request.get("/api/cron")).status()).toBe(401);
  expect(
    (
      await request.post("/api/scan", {
        headers: {
          Origin: "http://127.0.0.1:3000",
          "Idempotency-Key": "unauthorized-test-key",
        },
      })
    ).status(),
  ).toBe(401);
  await login(page);
  const result = await page.evaluate(async () => {
    const s = await (await fetch("/api/state")).json();
    return (
      await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "config",
          version: s.version,
          config: s.config,
        }),
      })
    ).status;
  });
  expect(result).toBe(401);
  const cross = await page.request.post("/api/action", {
    headers: { Origin: "https://evil.example" },
    data: { type: "favorite", unitId: "x", value: true },
  });
  expect(cross.status()).toBe(403);
});
test("admin date confirmation persists and historical uncertainties remain visible", async ({
  page,
}) => {
  await login(page, "test-admin-password-only");
  await page.getByRole("button", { name: "ניהול", exact: true }).click();
  await page.getByLabel("שנת הנסיעה והתאריכים מאושרים").check();
  await page.getByRole("button", { name: "שמירת הגדרות", exact: true }).click();
  await expect(page.getByText("התאריכים ממתינים לאישור")).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "מקומות לינה", exact: true }).click();
  await expect(
    page
      .getByText("הקומה אינה ידועה; במחקר דווח על מידע סותר לגבי מעלית.")
      .first(),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/mobile-shortlist.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
