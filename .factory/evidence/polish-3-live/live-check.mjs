import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const origin = "https://backfill-timecards.sociobot.in";
const evidence = ".factory/evidence/polish-3-live";
const browser = await chromium.launch();
const report = { origin, routes: {}, findings: {}, errors: [] };

async function open(path, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const response = await page.goto(`${origin}${path}`, { waitUntil: "networkidle", timeout: 60_000 });
  return { context, page, response, errors };
}

async function audit(path, expectedTitle, expectedH1) {
  const { context, page, response, errors } = await open(path);
  const axe = await new AxeBuilder({ page }).analyze();
  const a11y = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    h1: document.querySelectorAll("h1").length,
    main: Boolean(document.querySelector("main")),
  }));
  a11y.seriousOrCritical = axe.violations
    .filter((item) => ["serious", "critical"].includes(item.impact || ""))
    .map((item) => item.id);
  assert.equal(response?.status(), path.includes("missing") ? 404 : 200);
  assert.equal(a11y.title, expectedTitle);
  assert.equal(a11y.h1, 1);
  assert.equal(a11y.main, true);
  assert.deepEqual(a11y.seriousOrCritical, []);
  assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), expectedH1);
  const productErrors = path.includes("missing")
    ? errors.filter((error) => !/Failed to load resource: the server responded with a status of 404/.test(error))
    : errors;
  assert.deepEqual(productErrors, []);
  const key = path === "/" ? "root" : path.replace(/^\//, "").replace(/\W+/g, "-").replace(/-$/, "");
  await page.screenshot({ path: `${evidence}/${key}-cold-desktop.png`, fullPage: true });
  report.routes[key] = { status: response?.status(), ...a11y, errors: productErrors };
  await context.close();
}

await audit("/", "Backfill Timecards — reconstruct your workweek", "Reconstruct your freelance workweek");
await audit("/privacy/", "Privacy — Backfill Timecards", "How Backfill Timecards stores your data");
await audit("/terms/", "Terms — Backfill Timecards", "Terms for using Backfill Timecards");
await audit("/missing-round-three", "Page not found — Backfill Timecards", "Page not found");

{
  const { context, page, errors } = await open("/", { width: 390, height: 844 });
  for (const fact of ["privacy", "offline", "price"]) {
    const box = await page.locator(`[data-fact="${fact}"]`).boundingBox();
    assert.ok(box && box.y + box.height <= 844, `${fact} fact is not in the first screen`);
  }
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await page.waitForURL(`${origin}/demo`);
  await page.waitForFunction(() => document.title === "Demo — Backfill Timecards");
  assert.equal(await page.title(), "Demo — Backfill Timecards");
  await page.getByText("Demo — sample data, nothing is saved", { exact: true }).waitFor();
  assert.equal(await page.locator(".track").count(), 6);
  const firstTrack = await page.locator(".track").first().boundingBox();
  assert.ok(firstTrack && firstTrack.y < 844, "sample work is not in the initial demo viewport");
  await page.screenshot({ path: `${evidence}/demo-cold-mobile.png`, fullPage: false });
  assert.equal(await page.getByRole("button", { name: "Reset demo" }).isVisible(), true);
  assert.equal(await page.getByRole("link", { name: "Start for real" }).isVisible(), true);
  await page.goBack();
  await page.waitForURL(`${origin}/`);
  assert.equal(await page.getByRole("heading", { level: 1 }).evaluate((node) => document.activeElement === node), true);
  assert.deepEqual(errors, []);
  report.findings.demo = { factsInFirstViewport: true, visibleSampleRows: 6, firstTrackY: firstTrack?.y, banner: true, reset: true, startForReal: true, backFocusesH1: true };
  await context.close();
}

{
  const { context, page, errors } = await open("/?demo=1", { width: 390, height: 844 });
  await page.waitForFunction(() => document.title === "Demo — Backfill Timecards");
  assert.equal(await page.title(), "Demo — Backfill Timecards");
  assert.equal(await page.locator(".track").count(), 6);
  assert.equal(await page.getByText("Demo — sample data, nothing is saved", { exact: true }).isVisible(), true);
  await page.screenshot({ path: `${evidence}/query-demo-cold-mobile.png`, fullPage: false });
  assert.deepEqual(errors, []);
  report.findings.queryDemo = { title: await page.title(), sampleRows: 6, banner: true };
  await context.close();
}

{
  const { context, page, errors } = await open("/");
  await page.getByRole("button", { name: /Reuse saved blocks/ }).click();
  assert.equal(await page.getByRole("heading", { name: "Unlock saved patterns and week copying" }).isVisible(), true);
  const dialogText = await page.locator("#unlock-dialog").innerText();
  assert.match(dialogText, /Save reusable work patterns/);
  assert.doesNotMatch(dialogText, /unlimited/i);
  assert.match(dialogText, /Checkout is hosted by Sociobot\. Send payment and refund questions there\./);
  for (const path of ["/privacy/", "/terms/"]) {
    const html = await (await page.request.get(`${origin}${path}`)).text();
    assert.match(html, /Checkout is hosted by Sociobot\. Send payment and refund questions there\./);
    assert.doesNotMatch(html, /merchant[- ]of[- ]record|Dodo/i);
  }
  const privacyHtml = await (await page.request.get(`${origin}/privacy/`)).text();
  assert.match(privacyHtml, /You can use the app without an account\./);
  assert.doesNotMatch(privacyHtml, /account database/i);
  await page.screenshot({ path: `${evidence}/unlock-dialog-desktop.png`, fullPage: false });
  assert.deepEqual(errors, []);
  report.findings.copy = { descriptiveUnlockHeading: true, noUnlimitedPromise: true, noMerchantRolePromise: true, noAccountDatabasePromise: true };
  await context.close();
}

{
  const { context, page, errors } = await open("/?demo=1");
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload({ waitUntil: "networkidle" });
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator(".track").count(), 6);
  assert.equal(await page.getByText(/Offline · saved here/).isVisible(), true);
  await page.screenshot({ path: `${evidence}/query-demo-offline.png`, fullPage: false });
  await context.setOffline(false);
  assert.deepEqual(errors, []);
  report.findings.offline = { sampleRows: 6, offlineStatus: true };
  await context.close();
}

await browser.close();
await writeFile(`${evidence}/live-check.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
