import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

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

test("preserves an overnight calendar event in the board and CSV", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Import calendar" }).first().click();
  const ics = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:overnight\r\nDTSTART:20260824T230000\r\nDTEND:20260825T010000\r\nSUMMARY:Overnight maintenance\r\nEND:VEVENT\r\nEND:VCALENDAR";
  await page.locator("#calendar-file").setInputFiles({ name: "overnight.ics", mimeType: "text/calendar", buffer: Buffer.from(ics) });
  await expect(page.getByText("2026-08-24 · 23:00–01:00 (next day)")).toBeVisible();
  await page.getByLabel("Project for selected events").fill("Operations");
  await page.getByRole("button", { name: "Add selected events" }).click();
  await expect(page.locator(".track-time")).toContainText("2h");
  await expect(page.getByText("2h", { exact: true }).first()).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const csv = await readFile(await (await download).path(), "utf8");
  expect(csv).toContain('"2026-08-24","23:00","01:00","2.00"');
});

test("rejects a malformed backup without replacing existing local work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add work block" }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Recovery project");
  await page.getByLabel("What did you do?").fill("Valid local work");
  await page.getByRole("button", { name: "Add work block" }).last().click();
  await expect(page.getByText("Valid local work")).toBeVisible();
  await page.getByRole("button", { name: "Open data and license settings" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#restore-data").setInputFiles({ name: "bad-backup.json", mimeType: "application/json", buffer: Buffer.from('{"version":1,"entries":[{"id":"bad","date":"2026-08-24"}],"mappings":[],"patterns":[]}') });
  await expect(page.getByText(/Backup work block 1 is incomplete or invalid\. Nothing was changed\./)).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.reload();
  await expect(page.getByText("Valid local work")).toBeVisible();
});

test("keeps the offline timecard shell after visiting a legal page", async ({ page, context }) => {
  const origin = "http://127.0.0.1:4174";
  await page.goto(`${origin}/`);
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload();
  await page.goto(`${origin}/privacy/`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your work stays yours");
  await context.setOffline(true);
  await page.goto(`${origin}/?offline-check=1`);
  await expect(page.getByRole("button", { name: "Add work block" }).first()).toBeVisible();
});

test("keeps footer and home targets at least 44px tall on a 390px viewport", async ({ page }) => {
  await page.goto("/");
  if (page.viewportSize()?.width !== 390) test.skip();
  for (const link of [
    page.getByRole("link", { name: "Backfill Timecards home" }),
    page.getByRole("link", { name: "Privacy" }),
    page.getByRole("link", { name: "Terms" }),
    page.getByRole("link", { name: "Param Factory" }),
  ]) {
    expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
});

test("keeps the privacy and terms pages free of serious accessibility violations", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  }
});

test("supports keyboard dialog controls and restores focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  const add = page.getByRole("button", { name: "Add work block" }).first();
  await add.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Add work block" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(add).toBeFocused();
});

test("keeps normal local timecard use on this origin", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") externalRequests.push(request.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Add work block" }).first().click();
  await page.getByRole("button", { name: "Cancel" }).click();
  expect(externalRequests).toEqual([]);
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
