import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

test("adds, persists, maps, and exports work blocks", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Reconstruct your freelance workweek");
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

test("ships a layout-stable empty board instead of a loading-only app mount", async () => {
  const source = await readFile(new URL("../../index.html", import.meta.url), "utf8");
  expect(source).not.toContain("Loading your local timecard");
  expect(source).toContain('id="app" aria-busy="true"');
  expect(source).toContain('class="hero"');
  expect(source).toContain('class="workspace"');
  expect(source).toContain('class="empty-state"');
  expect(source).not.toContain('rel="preload" as="image"');
});

test("hydrates the empty shell without replacing its rendered workspace", async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { __appShellReplaced: false });
    new MutationObserver((records) => {
      if (records.some((record) => (record.target as Element).id === "app" && record.removedNodes.length > 0)) {
        Object.assign(window, { __appShellReplaced: true });
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("/");
  const workspace = await page.locator(".workspace").elementHandle();
  await expect(page.locator("#app")).not.toHaveAttribute("aria-busy");
  expect(await workspace?.evaluate((element) => element.isConnected)).toBe(true);
  expect(await page.evaluate(() => Reflect.get(window, "__appShellReplaced"))).toBe(false);
  await expect(page.locator("#week-heading")).not.toHaveText("This week");
});

test("imports calendar events as non-billable by default and exports that decision", async ({ page }) => {
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
  await expect(page.getByText("Not billable", { exact: true })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const csv = await readFile(await (await download).path(), "utf8");
  expect(csv).toContain('"Design review","No","calendar"');
});

test("marks calendar events billable only after an explicit import choice", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Import calendar" }).first().click();
  const ics = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:billable\r\nDTSTART:20260824T130000\r\nDTEND:20260824T140000\r\nSUMMARY:Client workshop\r\nEND:VEVENT\r\nEND:VCALENDAR";
  await page.locator("#calendar-file").setInputFiles({ name: "billable.ics", mimeType: "text/calendar", buffer: Buffer.from(ics) });
  await page.getByLabel("Project for selected events").fill("Launch");
  await page.getByLabel("Mark selected events as billable").check();
  await page.getByRole("button", { name: "Add selected events" }).click();
  await expect(page.getByText("✓ Billable", { exact: true })).toBeVisible();
});

test("expands recurring calendar masters before review and import", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Import calendar" }).first().click();
  const ics = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:daily\r\nDTSTART:20260824T100000\r\nDTEND:20260824T110000\r\nRRULE:FREQ=DAILY;COUNT=5\r\nSUMMARY:Daily review\r\nEND:VEVENT\r\nEND:VCALENDAR";
  await page.locator("#calendar-file").setInputFiles({ name: "recurring.ics", mimeType: "text/calendar", buffer: Buffer.from(ics) });
  await expect(page.getByText("5 timed events found. Select only work you want to record.")).toBeVisible();
  await page.getByLabel("Project for selected events").fill("Client review");
  await page.getByRole("button", { name: "Add selected events" }).click();
  await expect(page.locator(".track-title", { hasText: "Daily review" })).toHaveCount(5);
  await expect(page.getByText("5", { exact: true })).toBeVisible();
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
  await expect(page.getByRole("heading", { level: 1 })).toContainText("How Backfill Timecards stores your data");
  await context.setOffline(true);
  await page.goto(`${origin}/?offline-check=1`);
  await expect(page.getByRole("button", { name: "Add work block" }).first()).toBeVisible();
});

test("keeps header and footer targets at least 44px square on a 390px viewport", async ({ page }) => {
  await page.goto("/");
  if (page.viewportSize()?.width !== 390) test.skip();
  for (const link of [
    page.getByRole("link", { name: "Backfill Timecards home" }),
    page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Demo" }),
    page.getByRole("navigation", { name: "Legal and product links" }).getByRole("link", { name: "Privacy" }),
    page.getByRole("navigation", { name: "Legal and product links" }).getByRole("link", { name: "Terms" }),
    page.getByRole("link", { name: "Param Factory (external)" }),
  ]) {
    const bounds = await link.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }
});

test("keeps the privacy and terms pages free of serious accessibility violations", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Demo" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Legal and product links" }).getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Legal and product links" }).getByRole("link", { name: "Terms" })).toBeVisible();
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  }
});

test("serves route-specific demo metadata before JavaScript", async ({ request }) => {
  const response = await request.get("/demo/");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("<title>Demo — Backfill Timecards</title>");
  expect(html).toContain('rel="canonical" href="https://backfill-timecards.sociobot.in/demo"');
  expect(html).toContain('property="og:url" content="https://backfill-timecards.sociobot.in/demo"');
  expect(html).toContain('property="og:title" content="Demo — Backfill Timecards"');
  expect(html).toContain('name="twitter:title" content="Demo — Backfill Timecards"');
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

test("@claim:demo-sandbox keeps sample work separate, resets it, and expires it with its tab", async ({ page, browser }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add work block" }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Private project");
  await page.getByLabel("What did you do?").fill("Real private record");
  await page.getByRole("button", { name: "Add work block" }).last().click();

  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle("Demo — Backfill Timecards");
  await expect(page.getByText("Demo — sample data, nothing is saved", { exact: true })).toBeVisible();
  await expect(page.getByText("Plan the website sprint", { exact: true })).toBeVisible();
  await expect(page.getByText("Real private record")).toHaveCount(0);
  const firstTrack = await page.locator(".track").first().boundingBox();
  expect(firstTrack).not.toBeNull();
  expect(firstTrack!.y).toBeLessThan(page.viewportSize()!.height);
  await expect(page.locator(".summary-strip")).toBeInViewport();
  await expect(page.locator(".toolbelt")).toBeInViewport();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Plan the website sprint" }).click();
  await expect(page.getByText("Plan the website sprint", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(page.getByText("Plan the website sprint", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("Real private record", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("demo:backfill-timecards"))).toBeNull();

  // Session storage is owned by a top-level browsing context, so this models
  // an abrupt tab close without relying on asynchronous pagehide cleanup.
  const closingContext = await browser.newContext();
  const closingPage = await closingContext.newPage();
  await closingPage.goto("http://127.0.0.1:4173/demo");
  await closingPage.locator('.toolbelt [data-action="add"]').click();
  await closingPage.getByRole("combobox", { name: "Project", exact: true }).fill("Closing tab");
  await closingPage.getByLabel("What did you do?").fill("This sample must vanish");
  await closingPage.getByRole("button", { name: "Add work block" }).last().click();
  await expect(closingPage.getByText("This sample must vanish")).toBeVisible();
  await closingPage.close();
  const inspectPage = await closingContext.newPage();
  await inspectPage.goto("http://127.0.0.1:4173/");
  const postCloseStorage = await inspectPage.evaluate(async () => ({
    session: sessionStorage.getItem("demo:backfill-timecards"),
    databases: (await indexedDB.databases()).map((database) => database.name),
  }));
  expect(postCloseStorage.session).toBeNull();
  expect(postCloseStorage.databases).not.toContain("demo:backfill-timecards");
  await closingContext.close();
});

test("@claim:demo-exit-cleanup clears sample data before every documented demo exit", async ({ page }) => {
  let demoClearCalls = 0;
  await page.exposeBinding("recordDemoClear", () => { demoClearCalls += 1; });
  await page.route("https://sociobot.in/**", (route) => route.fulfill({ contentType: "text/html", body: "<title>Param Factory</title>" }));

  const exits = [
    { name: "Backfill Timecards home", destination: /http:\/\/127\.0\.0\.1:4173\/$/, navigation: "home" },
    { name: "Privacy", destination: /http:\/\/127\.0\.0\.1:4173\/privacy\/$/, navigation: "primary" },
    { name: "Terms", destination: /http:\/\/127\.0\.0\.1:4173\/terms\/$/, navigation: "footer" },
    { name: "Param Factory (external)", destination: /https:\/\/sociobot\.in\/$/, navigation: "external" },
  ] as const;

  for (const exit of exits) {
    await page.goto("/demo");
    await expect(page.locator(".track")).toHaveCount(6);
    await page.evaluate(() => {
      const removeItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = function(key: string): void {
        if (this === sessionStorage && key === "demo:backfill-timecards") void Reflect.get(window, "recordDemoClear")();
        removeItem.call(this, key);
      };
    });
    const link = exit.navigation === "primary"
      ? page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: exit.name })
      : exit.navigation === "footer"
        ? page.getByRole("navigation", { name: "Legal and product links" }).getByRole("link", { name: exit.name })
        : page.getByRole("link", { name: exit.name });
    await Promise.all([page.waitForURL(exit.destination), link.click()]);
    await expect.poll(() => demoClearCalls).toBeGreaterThanOrEqual(exits.indexOf(exit) + 1);
    if (exit.navigation !== "external") {
      expect(await page.evaluate(() => sessionStorage.getItem("demo:backfill-timecards"))).toBeNull();
    }
  }
});

test("opens the query-string demo in the same isolated sample sandbox", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page).toHaveTitle("Demo — Backfill Timecards");
  await expect(page.getByText("Demo — sample data, nothing is saved", { exact: true })).toBeVisible();
  await expect(page.locator(".track")).toHaveCount(6);
  expect(await page.evaluate(async () => ({
    session: sessionStorage.getItem("demo:backfill-timecards"),
    databases: (await indexedDB.databases()).map((database) => database.name),
  }))).toEqual({ session: expect.any(String), databases: [] });
});

test("keeps all first-screen facts visible at 1440 by 900", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const fact of ["privacy", "offline", "price"]) {
    await expect(page.locator(`[data-fact="${fact}"]`)).toBeInViewport();
  }
});

test("moves focus and announces app route changes through click, Back, and Forward", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.locator("#route-status")).toContainText("Sample weekly timecard");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.locator("#route-status")).toContainText("Reconstruct your freelance workweek");
  await page.goForward();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});

test("@claim:weekly-board edits, copies, restores, and recalls client work", async ({ page }) => {
  await page.goto("/demo");
  await page.locator('.toolbelt [data-action="add"]').click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Website refresh");
  await expect(page.getByRole("textbox", { name: /^Client/ })).toHaveValue("Redwood Studio");
  await page.getByLabel("What did you do?").fill("Sample client analysis");
  await page.getByRole("button", { name: "Add work block" }).last().click();
  await page.getByRole("button", { name: "Edit Sample client analysis" }).click();
  await page.getByLabel("What did you do?").fill("Sample client analysis revised");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("button", { name: "Copy Sample client analysis revised" }).click();
  await expect(page.locator(".track-title", { hasText: "Sample client analysis revised" })).toHaveCount(2);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Sample client analysis revised" }).first().click();
  await expect(page.locator(".track-title", { hasText: "Sample client analysis revised" })).toHaveCount(1);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator(".track-title", { hasText: "Sample client analysis revised" })).toHaveCount(2);
});

test("@claim:calendar-local imports selected weekly recurring and overnight events without uploading them", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") externalRequests.push(request.url());
  });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Import calendar" }).click();
  const ics = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:review\r\nDTSTART:20260824T100000\r\nDTEND:20260824T110000\r\nRRULE:FREQ=WEEKLY;UNTIL=20260907T100000\r\nSUMMARY:Client review\r\nDESCRIPTION:Private planning notes\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nUID:overnight-claim\r\nDTSTART:20260826T230000\r\nDTEND:20260827T010000\r\nSUMMARY:Overnight release\r\nEND:VEVENT\r\nEND:VCALENDAR";
  await page.locator("#calendar-file").setInputFiles({ name: "claim-week.ics", mimeType: "text/calendar", buffer: Buffer.from(ics) });
  await expect(page.getByText("4 timed events found. Select only work you want to record.")).toBeVisible();
  await expect(page.getByText("2026-08-24 · 10:00–11:00")).toBeVisible();
  await expect(page.getByText("2026-08-31 · 10:00–11:00")).toBeVisible();
  await expect(page.getByText("2026-09-07 · 10:00–11:00")).toBeVisible();
  await expect(page.getByText(/23:00–01:00 \(next day\)/)).toBeVisible();
  await page.getByRole("checkbox", { name: /Client review.*2026-08-31/ }).uncheck();
  await page.getByLabel("Project for selected events").fill("Release support");
  await page.getByRole("button", { name: "Add selected events" }).click();
  await expect(page.locator(".track-title", { hasText: "Client review" })).toHaveCount(1);
  await expect(page.locator(".track", { hasText: "Overnight release" }).locator(".track-time")).toContainText("2h");
  await expect(page.getByText("Private planning notes")).toHaveCount(0);
  await page.getByRole("button", { name: "Show next week" }).click();
  await expect(page.locator(".track-title", { hasText: "Client review" })).toHaveCount(0);
  await page.getByRole("button", { name: "Show next week" }).click();
  await expect(page.locator(".track-title", { hasText: "Client review" })).toHaveCount(1);
  expect(externalRequests).toEqual([]);
  expect(await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name))).toEqual([]);
  expect(await page.evaluate(() => sessionStorage.getItem("demo:backfill-timecards"))).not.toBeNull();
});

test("@claim:csv-export downloads one invoice row per visible sample block", async ({ page }) => {
  await page.goto("/demo");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const result = await download;
  const csv = await readFile(await result.path(), "utf8");
  expect(result.suggestedFilename()).toMatch(/^timecard-\d{4}-\d{2}-\d{2}\.csv$/);
  expect(csv.trim().split(/\r?\n/)).toHaveLength(7);
  expect(csv).toContain('"Date","Start","End","Hours","Client","Project","Description","Billable","Source"');
  expect(csv).toContain('"Redwood Studio","Website refresh","Plan the website sprint"');
});

test("@claim:local-archive exports, erases, and restores every work block, mapping, and pattern", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Open data and license settings" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON backup" }).click();
  const backup = await readFile(await (await download).path());
  const parsed = JSON.parse(backup.toString()) as { entries: unknown[]; mappings: Array<{ project: string; client: string }>; patterns: Array<{ title: string }> };
  expect(parsed.entries).toHaveLength(9);
  expect(parsed.mappings).toEqual(expect.arrayContaining([
    { project: "Website refresh", client: "Redwood Studio", updatedAt: expect.any(Number) },
    { project: "Book launch", client: "Northstar Press", updatedAt: expect.any(Number) },
  ]));
  expect(parsed.patterns).toEqual([expect.objectContaining({ title: "Weekly planning", project: "Website refresh", client: "Redwood Studio" })]);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Erase all local data" }).click();
  await expect(page.getByRole("heading", { name: "No work blocks yet" })).toBeVisible();
  await page.getByRole("button", { name: "Open data and license settings" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#restore-data").setInputFiles({ name: "demo-backup.json", mimeType: "application/json", buffer: backup });
  await expect(page.locator(".track-title", { hasText: "Plan the website sprint" })).toBeVisible();
  await page.getByRole("button", { name: "Add work block" }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Website refresh");
  await expect(page.getByRole("textbox", { name: /^Client/ })).toHaveValue("Redwood Studio");
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: /Reuse saved blocks/ }).click();
  await expect(page.getByRole("heading", { name: "Reuse saved work blocks" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to this week" })).toBeVisible();
});

test("@claim:offline-reload keeps the sample week usable without a network and exposes install metadata", async ({ page, context }) => {
  await page.goto("http://127.0.0.1:4174/demo");
  expect(await page.evaluate(async () => {
    const manifest = await (await fetch("/manifest.webmanifest")).json() as { name: string; display: string; icons: unknown[] };
    return { name: manifest.name, display: manifest.display, icons: manifest.icons.length, linked: Boolean(document.querySelector('link[rel="manifest"]')) };
  })).toEqual({ name: "Backfill Timecards", display: "standalone", icons: 3, linked: true });
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("Demo — sample data, nothing is saved", { exact: true })).toBeVisible();
  await expect(page.locator(".track-title", { hasText: "Plan the website sprint" })).toBeVisible();
  await expect(page.getByText(/Offline · saved here/)).toBeVisible();
});

test("@claim:privacy-local keeps normal work local with no account or third-party runtime requests", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") externalRequests.push(request.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Add work block" }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Local archive");
  await page.getByLabel("What did you do?").fill("Keep this record local");
  await page.getByRole("button", { name: "Add work block" }).last().click();
  expect(externalRequests).toEqual([]);
  expect(await page.evaluate(async () => ({
    databases: (await indexedDB.databases()).map((database) => database.name),
    demoSession: sessionStorage.getItem("demo:backfill-timecards"),
    license: localStorage.getItem("sb_license:backfill-timecards"),
    accountControls: document.querySelectorAll('input[type="email"], input[autocomplete="username"], input[autocomplete="current-password"], [data-account]').length,
  }))).toEqual({ databases: ["backfill-timecards"], demoSession: null, license: null, accountControls: 0 });
});

test("@claim:billing-entitlement proves the $18 checkout, verification gate, one-day cache, and revocation", async ({ page }) => {
  const dayInMilliseconds = 86_400_000;
  const verifiedAt = new Date("2030-01-15T12:00:00.000Z").getTime();
  let verifyRequests = 0;
  let restoredTokenRequests = 0;
  // Freeze the deterministic clock before navigation and any assertions. A
  // later pause can race the real test work and request a time in the past.
  await page.clock.install({ time: verifiedAt });
  await page.clock.pauseAt(verifiedAt);
  await page.route("https://api.sociobot.in/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== "/api/v1/products/backfill-timecards/verify") return route.abort();
    verifyRequests += 1;
    if (url.searchParams.get("license") === "forged-qa7") return route.abort();
    expect(url.searchParams.get("license")).toBe("verified-qa7");
    restoredTokenRequests += 1;
    const valid = restoredTokenRequests === 1;
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ valid, reason: valid ? "ok" : "revoked" }),
    });
  });
  await page.goto("/?license=forged-qa7");
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => ({
    token: localStorage.getItem("sb_license:backfill-timecards"),
    verdict: localStorage.getItem("sb_license:backfill-timecards:verdict"),
  }))).toEqual({ token: "forged-qa7", verdict: null });
  await expect(page.locator(".toolbelt")).toContainText("$18");
  await expect(page.locator(".toolbelt")).not.toContainText("UNLOCKED");
  await page.getByRole("button", { name: /Reuse saved blocks/ }).click();
  await expect(page.getByRole("heading", { name: "Make repeat weeks faster" })).toBeVisible();
  await expect(page.locator("#unlock-dialog .price")).toHaveText("$18 once");
  await expect(page.getByRole("link", { name: "Buy the one-time unlock" })).toHaveAttribute("href", "https://api.sociobot.in/api/v1/products/backfill-timecards/checkout");
  await expect(page.locator("#unlock-dialog .fine-print")).toContainText("Checkout is hosted by Sociobot");
  await expect(page.locator("#unlock-dialog iframe")).toHaveCount(0);
  await expect(page.locator('#unlock-dialog input[autocomplete="cc-number"], #unlock-dialog input[name*="card" i]')).toHaveCount(0);
  expect(await page.locator("script[src]").evaluateAll((scripts) => scripts.every((script) => new URL((script as HTMLScriptElement).src).origin === location.origin))).toBe(true);
  await page.getByRole("textbox", { name: "Have a license? Paste it here" }).fill("verified-qa7");
  await page.getByRole("button", { name: "Verify and restore" }).click();
  await expect(page.locator(".toolbelt")).toContainText("UNLOCKED");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sb_license:backfill-timecards:verdict") || "{}"))).toEqual({ valid: true, checkedAt: verifiedAt });

  await page.clock.setSystemTime(verifiedAt + dayInMilliseconds - 1);
  await page.reload();
  await expect(page.locator(".toolbelt")).toContainText("UNLOCKED");
  expect(verifyRequests).toBe(2);
  expect(restoredTokenRequests).toBe(1);

  await page.clock.setSystemTime(verifiedAt + dayInMilliseconds);
  await page.reload();
  await expect(page.locator(".toolbelt")).toContainText("$18");
  await expect(page.locator(".toolbelt")).not.toContainText("UNLOCKED");
  expect(verifyRequests).toBe(3);
  expect(restoredTokenRequests).toBe(2);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("sb_license:backfill-timecards:verdict") || "{}"))).toEqual({ valid: false, checkedAt: verifiedAt + dayInMilliseconds });
  await page.getByRole("button", { name: /Reuse saved blocks/ }).click();
  await expect(page.locator("#unlock-dialog .inline-error")).toHaveText("License no longer active.");
});

test("@claim:pattern-deck previews saved patterns and previous-week copying while core tools stay free", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: "Save Plan the website sprint as a pattern" }).click();
  await expect(page.getByText("Saved “Plan the website sprint” to the pattern deck.")).toBeVisible();
  await page.locator(".toolbelt [data-action='patterns']").click();
  await expect(page.getByText("3 blocks from")).toBeVisible();
  await expect(page.locator("#patterns-dialog").getByText("Plan the website sprint", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clone into this week" }).click();
  await expect(page.locator(".summary-strip div", { hasText: "Entries" }).locator("dd")).toHaveText("9");
  await page.getByRole("link", { name: "Start for real" }).click();
  await page.getByRole("button", { name: "Add work block" }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Free project");
  await page.getByLabel("What did you do?").fill("Free manual work");
  await page.getByRole("button", { name: "Add work block" }).last().click();
  await page.getByRole("button", { name: "Import calendar" }).click();
  const freeIcs = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:free-calendar\r\nDTSTART:20260824T130000\r\nDTEND:20260824T140000\r\nSUMMARY:Free calendar work\r\nEND:VEVENT\r\nEND:VCALENDAR";
  await page.locator("#calendar-file").setInputFiles({ name: "free.ics", mimeType: "text/calendar", buffer: Buffer.from(freeIcs) });
  await page.getByLabel("Project for selected events").fill("Free project");
  await page.getByRole("button", { name: "Add selected events" }).click();
  await expect(page.locator(".track-title", { hasText: "Free calendar work" })).toBeVisible();
  const csvDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  await expect(csvDownload).resolves.toBeTruthy();
  await page.getByRole("button", { name: "Open data and license settings" }).click();
  await expect(page.getByRole("button", { name: "Export JSON backup" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Erase all local data" })).toBeVisible();
  await expect(page.locator("#manage-license")).toHaveText("Review reuse tools — $18");
});

test("keeps the populated demo accessible and responsive", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/demo");
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()?.width);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  if (page.viewportSize()?.width === 390) {
    for (const target of [page.getByRole("button", { name: "Reset demo", exact: true }), page.getByRole("link", { name: "Start for real" })]) {
      expect((await target.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
  }
  expect(errors).toEqual([]);
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
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Reconstruct your freelance workweek");
  await expect(page.getByText(/Offline · saved here/)).toBeVisible();
});
