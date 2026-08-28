import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("adds, persists, maps, and exports work blocks", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Rebuild the week");
  await page.getByRole("button", { name: "Add work block" }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Acme launch");
  await page.getByRole("textbox", { name: /^Client/ }).fill("Acme Studio");
  await page.getByLabel("What did you do?").fill("API integration review");
  await page.getByRole("button", { name: "Add work block" }).last().click();
  await expect(page.getByText("API integration review")).toBeVisible();
  await page.reload();
  await expect(page.getByText("API integration review")).toBeVisible();

  await page.getByRole("button", { name: /Add work block on/ }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Acme launch");
  await expect(page.getByRole("textbox", { name: /^Client/ })).toHaveValue("Acme Studio");
  await page.getByRole("button", { name: "Cancel" }).click();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await download).suggestedFilename()).toMatch(/^timecard-.*\.csv$/);
  expect(errors).toEqual([]);
});

test("reviews a local calendar file and imports only selected details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Import calendar" }).first().click();
  const ics = `BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:one\r\nDTSTART:20260824T130000\r\nDTEND:20260824T140000\r\nSUMMARY:Design review\r\nDESCRIPTION:Confidential launch notes\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  await page.locator("#calendar-file").setInputFiles({ name: "week.ics", mimeType: "text/calendar", buffer: Buffer.from(ics) });
  await expect(page.getByText("Design review")).toBeVisible();
  await page.getByLabel("Project for selected events").fill("Launch");
  await page.getByLabel("Client", { exact: true }).fill("Private client");
  await page.getByRole("button", { name: "Add selected events" }).click();
  await expect(page.locator(".track-title", { hasText: "Design review" })).toBeVisible();
  await expect(page.getByText("Confidential launch notes")).toHaveCount(0);
  await expect(page.getByText("calendar", { exact: true })).toBeVisible();
});

test("has no serious accessibility violations and remains usable offline", async ({ page, context }) => {
  // A separate origin gives the install test a clean service-worker scope.
  await page.goto("http://127.0.0.1:4174/");
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Rebuild the week");
  await expect(page.getByText(/Offline · saved here/)).toBeVisible();
});
