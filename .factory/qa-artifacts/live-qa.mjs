import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";

const LIVE = "https://backfill-timecards.sociobot.in";
const results = {};
const allErrors = [];

function watch(page, label) {
  const requests = [];
  const errors = [];
  page.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText || ""}`));
  allErrors.push({ label, errors });
  return { requests, errors };
}

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    serviceWorkers: "block",
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const observed = watch(page, "desktop-workflow");
  await page.goto(`${LIVE}/`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /Add work block/ }).first().click();
  await page.getByLabel("Start").fill("23:00");
  await page.getByLabel("End", { exact: true }).fill("23:00");
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("Boundary QA");
  await page.getByRole("textbox", { name: /^Client/ }).fill("Client <North>");
  await page.getByLabel("What did you do?").fill("Review <draft> & quote \"A\"");
  await page.getByRole("button", { name: "Add work block", exact: true }).last().click();
  await page.getByText("End time must be later than start time.").waitFor();
  assert.equal(await page.getByLabel("End", { exact: true }).evaluate((element) => element === document.activeElement), true);
  await page.getByLabel("End", { exact: true }).fill("01:00");
  await page.getByLabel("Ends the next day").check();
  await page.getByRole("button", { name: "Add work block", exact: true }).last().click();
  await page.getByText("Review <draft> & quote \"A\"", { exact: true }).waitFor();
  assert.equal(await page.locator("img[src*=draft]").count(), 0);
  assert.match(await page.locator(".track", { hasText: "Review <draft>" }).innerText(), /2h/);

  await page.getByRole("button", { name: /Add work block/ }).first().click();
  await page.getByRole("combobox", { name: "Project", exact: true }).fill("boundary qa");
  assert.equal(await page.getByRole("textbox", { name: /^Client/ }).inputValue(), "Client <North>");
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Review <draft> & quote \"A\"", { exact: true }).waitFor();

  await page.getByRole("button", { name: "Open data and license settings" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#restore-data").setInputFiles({
    name: "invalid-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1,"entries":[{"id":"bad"}],"mappings":[],"patterns":[]}'),
  });
  await page.getByText(/Backup work block 1 is incomplete or invalid\. Nothing was changed\./).waitFor();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Review <draft> & quote \"A\"", { exact: true }).waitFor();

  await page.getByRole("button", { name: "Try it with sample data" }).click();
  await page.waitForURL(`${LIVE}/demo`);
  assert.equal(await page.locator(".track").count(), 6);
  assert.equal(await page.getByText("Review <draft> & quote \"A\"").count(), 0);
  assert.equal(await page.getByText("Demo — sample data, nothing is saved", { exact: true }).count(), 1);

  await page.getByRole("button", { name: "Import calendar" }).click();
  const openEnded = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:open\r\nDTSTART:20260824T100000\r\nDTEND:20260824T103000\r\nRRULE:FREQ=DAILY\r\nSUMMARY:Unsafe recurrence\r\nEND:VEVENT\r\nEND:VCALENDAR";
  await page.locator("#calendar-file").setInputFiles({ name: "open.ics", mimeType: "text/calendar", buffer: Buffer.from(openEnded) });
  await page.getByText("This calendar has an open-ended recurring event. Export the week as individual events, then try again.").waitFor();
  const validIcs = "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:repeat\r\nDTSTART:20260824T100000\r\nDTEND:20260824T103000\r\nRRULE:FREQ=DAILY;COUNT=2\r\nSUMMARY:QA stand-up\r\nDESCRIPTION:Confidential alpha\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nUID:overnight\r\nDTSTART:20260826T230000\r\nDTEND:20260827T010000\r\nSUMMARY:QA overnight\r\nDESCRIPTION:Confidential beta\r\nEND:VEVENT\r\nEND:VCALENDAR";
  await page.locator("#calendar-file").setInputFiles({ name: "valid.ics", mimeType: "text/calendar", buffer: Buffer.from(validIcs) });
  await page.getByText("3 timed events found. Select only work you want to record.").waitFor();
  const checks = page.locator('.event-row input[name="event"]');
  for (let index = 0; index < 3; index += 1) await checks.nth(index).uncheck();
  await page.getByLabel("Project for selected events").fill("QA release");
  await page.getByRole("button", { name: "Add selected events" }).click();
  await page.getByText("Select at least one event to import.").waitFor();
  await checks.nth(0).check();
  await checks.nth(2).check();
  await page.getByRole("button", { name: "Add selected events" }).click();
  assert.equal(await page.locator(".track").count(), 8);
  assert.equal(await page.getByText(/Confidential alpha|Confidential beta/).count(), 0);
  assert.match(await page.locator(".track", { hasText: "QA overnight" }).textContent(), /2h/);
  assert.match(await page.locator(".track", { hasText: "QA overnight" }).textContent(), /Not billable/i);

  const csvEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const csvDownload = await csvEvent;
  const csvText = await (await import("node:fs/promises")).readFile(await csvDownload.path(), "utf8");
  assert.equal(csvText.trim().split(/\r?\n/).length, 9);
  assert.match(csvText, /"QA overnight","No","calendar"/);
  assert.doesNotMatch(csvText, /Confidential alpha|Confidential beta/);

  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  assert.equal(await page.locator(".track").count(), 6);
  await page.getByRole("link", { name: "Start for real" }).click();
  await page.waitForURL(`${LIVE}/`);
  await page.getByText("Review <draft> & quote \"A\"", { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => sessionStorage.getItem("demo:backfill-timecards")), null);

  const requestOrigins = [...new Set(observed.requests.map((url) => new URL(url).origin))];
  assert.deepEqual(requestOrigins, [LIVE]);
  assert.deepEqual(observed.errors, []);
  results.desktopWorkflow = {
    invalidTimeRecovery: "passed",
    overnightHours: 2,
    mappingRecall: "case-insensitive",
    malformedBackupPreservedRecord: true,
    demoSeedRows: 6,
    calendarRowsAfterSelection: 8,
    csvDataRows: 8,
    demoResetRows: 6,
    normalRequestOrigins: requestOrigins,
  };
  await context.close();

  const volumeContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: "block", reducedMotion: "reduce", acceptDownloads: true });
  const volumePage = await volumeContext.newPage();
  const volumeObserved = watch(volumePage, "30-entry-volume");
  await volumePage.goto(`${LIVE}/`, { waitUntil: "networkidle" });
  const started = Date.now();
  for (let index = 0; index < 30; index += 1) {
    await volumePage.getByRole("button", { name: /Add work block/ }).first().click();
    await volumePage.getByRole("combobox", { name: "Project", exact: true }).fill("Volume QA");
    await volumePage.getByLabel("What did you do?").fill(`Retrospective row ${String(index + 1).padStart(2, "0")}`);
    await volumePage.getByRole("button", { name: "Add work block", exact: true }).last().click();
    await volumePage.locator("#entry-dialog").waitFor({ state: "detached" });
  }
  assert.equal(await volumePage.locator(".track").count(), 30);
  const volumeDownloadEvent = volumePage.waitForEvent("download");
  await volumePage.getByRole("button", { name: "Export CSV" }).click();
  const volumeDownload = await volumeDownloadEvent;
  const volumeCsv = await (await import("node:fs/promises")).readFile(await volumeDownload.path(), "utf8");
  assert.equal(volumeCsv.trim().split(/\r?\n/).length, 31);
  assert.deepEqual(volumeObserved.errors, []);
  results.volume = { visibleRows: 30, exportedRows: 30, automatedEntryAndExportMs: Date.now() - started };
  await volumeContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  const mobilePage = await mobileContext.newPage();
  const mobileObserved = watch(mobilePage, "mobile");
  await mobilePage.goto(`${LIVE}/demo`, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: ".factory/qa-artifacts/live-demo-mobile.png", fullPage: false });
  const width = await mobilePage.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.equal(width.scrollWidth, width.innerWidth);
  const targetFailures = await mobilePage.locator("a:visible, button:visible").evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { name: (element.getAttribute("aria-label") || element.textContent || "").trim().replace(/\s+/g, " "), width: rect.width, height: rect.height };
  }).filter((target) => target.width < 44 || target.height < 44));
  assert.deepEqual(targetFailures, []);
  const mobileAxe = await new AxeBuilder({ page: mobilePage }).analyze();
  const mobileSerious = mobileAxe.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""));
  assert.deepEqual(mobileSerious, []);
  await mobilePage.getByRole("button", { name: "Add a work block" }).click();
  await mobilePage.getByRole("button", { name: "Cancel" }).click();
  assert.deepEqual(mobileObserved.errors, []);
  results.mobile = { ...width, minimumTargetFailures: targetFailures, axeSeriousCritical: mobileSerious.length };
  await mobileContext.close();

  const keyboardContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: "block", reducedMotion: "reduce" });
  const keyboardPage = await keyboardContext.newPage();
  const keyboardObserved = watch(keyboardPage, "keyboard-reduced-motion");
  await keyboardPage.goto(`${LIVE}/`, { waitUntil: "networkidle" });
  await keyboardPage.keyboard.press("Tab");
  assert.equal(await keyboardPage.evaluate(() => document.activeElement?.classList.contains("skip-link")), true);
  const focusStyle = await keyboardPage.locator(".skip-link").evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineWidth: style.outlineWidth, outlineStyle: style.outlineStyle, outlineColor: style.outlineColor };
  });
  await keyboardPage.keyboard.press("Enter");
  assert.equal(await keyboardPage.evaluate(() => document.activeElement?.id), "main");
  let reachedDemo = false;
  for (let index = 0; index < 20; index += 1) {
    await keyboardPage.keyboard.press("Tab");
    const name = await keyboardPage.evaluate(() => (document.activeElement?.textContent || "").trim().replace(/\s+/g, " "));
    if (name === "Try it with sample data") {
      reachedDemo = true;
      await keyboardPage.keyboard.press("Enter");
      break;
    }
  }
  assert.equal(reachedDemo, true);
  await keyboardPage.waitForURL(`${LIVE}/demo`);
  const add = keyboardPage.getByRole("button", { name: "Add a work block" });
  await add.focus();
  await keyboardPage.keyboard.press("Enter");
  assert.equal(await keyboardPage.locator("#entry-dialog").evaluate((dialog) => dialog.contains(document.activeElement)), true);
  for (let index = 0; index < 15; index += 1) {
    await keyboardPage.keyboard.press("Tab");
    assert.equal(await keyboardPage.locator("#entry-dialog").evaluate((dialog) => dialog.contains(document.activeElement)), true);
  }
  await keyboardPage.keyboard.press("Escape");
  assert.equal(await add.evaluate((element) => element === document.activeElement), true);
  const reducedMotion = await keyboardPage.locator(".primary-button").first().evaluate((element) => {
    const style = getComputedStyle(element);
    return { transitionDuration: style.transitionDuration, animationDuration: style.animationDuration };
  });
  assert.deepEqual(keyboardObserved.errors, []);
  results.keyboardAndMotion = { skipFocus: focusStyle, dialogTrapAndRestore: true, reducedMotion };

  for (const route of ["/demo", "/privacy/", "/terms/"]) {
    await keyboardPage.goto(`${LIVE}${route}`, { waitUntil: "networkidle" });
    const axe = await new AxeBuilder({ page: keyboardPage }).analyze();
    const serious = axe.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""));
    assert.deepEqual(serious, []);
  }
  results.axeDesktop = { routes: ["/demo", "/privacy/", "/terms/"], seriousCritical: 0 };
  await keyboardContext.close();

  const licenseContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: "block" });
  const licensePage = await licenseContext.newPage();
  const licenseObserved = watch(licensePage, "license-outage");
  let verificationRequests = 0;
  await licensePage.route("https://api.sociobot.in/**", async (route) => {
    verificationRequests += 1;
    await route.abort("failed");
  });
  await licensePage.goto(`${LIVE}/?license=forged-independent-qa`, { waitUntil: "networkidle" });
  await licensePage.getByRole("button", { name: /Pattern deck/ }).click();
  await licensePage.getByRole("heading", { name: "Make repeat weeks faster" }).waitFor();
  const licenseStorage = await licensePage.evaluate(() => ({
    token: localStorage.getItem("sb_license:backfill-timecards"),
    verdict: localStorage.getItem("sb_license:backfill-timecards:verdict"),
  }));
  assert.equal(licenseStorage.token, "forged-independent-qa");
  assert.equal(licenseStorage.verdict, null);
  assert.equal(await licensePage.getByRole("heading", { name: "Reuse, then correct" }).count(), 0);
  assert.equal(verificationRequests, 1);
  results.licenseOutage = { verificationRequests, storedToken: true, positiveVerdict: false, paidFeatureLocked: true, expectedFailedRequest: licenseObserved.errors.filter((item) => item.startsWith("requestfailed:")).length };
  await licenseContext.close();

  const offlineContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const offlinePage = await offlineContext.newPage();
  const offlineObserved = watch(offlinePage, "live-offline");
  await offlinePage.goto(`${LIVE}/demo`, { waitUntil: "networkidle" });
  await offlinePage.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await offlinePage.reload({ waitUntil: "networkidle" });
  assert.equal(await offlinePage.evaluate(() => Boolean(navigator.serviceWorker.controller)), true);
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: "domcontentloaded" });
  await offlinePage.getByText("Demo — sample data, nothing is saved", { exact: true }).waitFor();
  assert.equal(await offlinePage.locator(".track").count(), 6);
  await offlinePage.getByText(/Offline · saved here/).waitFor();
  const nonExpectedOfflineErrors = offlineObserved.errors.filter((item) => !item.includes("ERR_INTERNET_DISCONNECTED"));
  assert.deepEqual(nonExpectedOfflineErrors, []);
  results.offline = { controlled: true, demoRowsAfterReload: 6, offlineStatus: true };
  await offlineContext.close();

  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
