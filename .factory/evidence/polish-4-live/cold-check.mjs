import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const [origin, evidence, deployment = "live"] = process.argv.slice(2);
if (!origin || !evidence) throw new Error("Usage: node cold-check.mjs <origin> <evidence-dir> [live|local]");

await mkdir(evidence, { recursive: true });
const browser = await chromium.launch();
const report = { origin, deployment, routes: {}, findings: {}, errors: [] };

async function open(path, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => requests.push(request.url()));
  const response = await page.goto(`${origin}${path}`, { waitUntil: "networkidle", timeout: 60_000 });
  return { context, page, response, errors, requests };
}

function unexpectedErrors(errors, missing) {
  if (!missing) return errors;
  return errors.filter((error) => !/Failed to load resource: the server responded with a status of 404/.test(error));
}

async function audit(path, expectedTitle, expectedH1, key, missing = false) {
  const { context, page, response, errors } = await open(path);
  const axe = await new AxeBuilder({ page }).analyze();
  const details = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    h1: document.querySelectorAll("h1").length,
    main: Boolean(document.querySelector("main")),
    missingAlt: [...document.querySelectorAll("img")].filter((image) => !image.hasAttribute("alt")).length,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  const seriousOrCritical = axe.violations
    .filter((item) => ["serious", "critical"].includes(item.impact || ""))
    .map((item) => item.id);
  const expectedStatus = missing && deployment === "live" ? 404 : 200;
  assert.equal(response?.status(), expectedStatus);
  assert.equal(details.title, expectedTitle);
  assert.equal(details.lang, "en");
  assert.equal(details.h1, 1);
  assert.equal(details.main, true);
  assert.equal(details.missingAlt, 0);
  assert.equal(details.horizontalOverflow, false);
  assert.deepEqual(seriousOrCritical, []);
  const heading = (await page.getByRole("heading", { level: 1 }).textContent())?.replace(/\s+/g, " ").trim() || "";
  if (expectedH1 instanceof RegExp) assert.match(heading, expectedH1);
  else assert.equal(heading, expectedH1);
  const productErrors = unexpectedErrors(errors, missing && deployment === "live");
  assert.deepEqual(productErrors, []);
  await page.screenshot({ path: `${evidence}/${key}-cold-desktop.png`, fullPage: true });
  report.routes[key] = { status: response?.status(), ...details, seriousOrCritical, errors: productErrors };
  await context.close();
}

await audit("/", "Backfill Timecards — reconstruct your workweek", "Reconstruct your freelance workweek", "root");
await audit("/demo", "Demo — Backfill Timecards", /^Sample weekly timecard · /, "demo");
await audit("/privacy/", "Privacy — Backfill Timecards", "How Backfill Timecards stores your data", "privacy");
await audit("/terms/", "Terms — Backfill Timecards", "Terms for using Backfill Timecards", "terms");
await audit(deployment === "live" ? "/missing-round-four" : "/404.html", "Page not found — Backfill Timecards", "Page not found", "not-found", true);

{
  const { context, page, errors, requests } = await open("/", { width: 390, height: 844 });
  const factBottoms = {};
  for (const fact of ["privacy", "offline", "price"]) {
    const box = await page.locator(`[data-fact="${fact}"]`).boundingBox();
    assert.ok(box && box.y + box.height <= 844, `${fact} fact is not in the first screen`);
    factBottoms[fact] = box.y + box.height;
  }
  assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), "Reconstruct your freelance workweek");
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await page.waitForURL(`${origin}/demo`);
  assert.equal(await page.title(), "Demo — Backfill Timecards");
  assert.equal(await page.locator(".track").count(), 6);
  const firstTrack = await page.locator(".track").first().boundingBox();
  assert.ok(firstTrack && firstTrack.y < 844, "sample work is not in the first demo screen");
  assert.equal(await page.getByText("Demo — sample data, nothing is saved", { exact: true }).isVisible(), true);
  assert.equal(await page.getByRole("button", { name: "Reset demo" }).isVisible(), true);
  assert.equal(await page.getByRole("link", { name: "Start for real" }).isVisible(), true);
  await page.screenshot({ path: `${evidence}/demo-first-screen-mobile.png`, fullPage: false });
  await page.goBack();
  await page.waitForURL(`${origin}/`);
  assert.equal(await page.getByRole("heading", { level: 1 }).evaluate((node) => document.activeElement === node), true);
  assert.deepEqual(errors, []);
  assert.deepEqual([...new Set(requests.map((url) => new URL(url).origin))], [origin]);
  report.findings.firstScreenAndDemo = { factBottoms, firstTrackY: firstTrack.y, sampleRows: 6, banner: true, reset: true, startForReal: true, backFocusesH1: true, requestOrigins: [origin] };
  await context.close();
}

{
  const { context, page, errors, requests } = await open("/?demo=1", { width: 390, height: 844 });
  assert.equal(await page.title(), "Demo — Backfill Timecards");
  assert.equal(await page.locator(".track").count(), 6);
  assert.equal(await page.getByText("Demo — sample data, nothing is saved", { exact: true }).isVisible(), true);
  const storage = await page.evaluate(async () => ({
    demo: Boolean(sessionStorage.getItem("demo:backfill-timecards")),
    demoActive: sessionStorage.getItem("backfill-timecards:demo-active"),
    databases: (await indexedDB.databases()).map((database) => database.name),
  }));
  assert.deepEqual(storage, { demo: true, demoActive: "1", databases: [] });
  assert.deepEqual([...new Set(requests.map((url) => new URL(url).origin))], [origin]);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: `${evidence}/query-demo-cold-mobile.png`, fullPage: false });
  report.findings.queryDemo = { title: await page.title(), sampleRows: 6, storage, requestOrigins: [origin] };
  await context.close();
}

{
  const { context, page, errors } = await open("/");
  await page.getByRole("button", { name: "Open data and license settings" }).click();
  const settingsText = await page.locator("#settings-dialog").innerText();
  assert.match(settingsText, /You can use the app without an account\./);
  assert.doesNotMatch(settingsText, /There is no cloud account|account database/i);
  await page.screenshot({ path: `${evidence}/settings-no-account-desktop.png`, fullPage: false });
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: /Reuse saved blocks/ }).click();
  const unlockText = await page.locator("#unlock-dialog").innerText();
  assert.match(unlockText, /Unlock saved patterns and week copying/);
  assert.match(unlockText, /Save reusable work patterns/);
  assert.doesNotMatch(unlockText, /unlimited|merchant[- ]of[- ]record|Dodo/i);
  assert.match(unlockText, /Checkout is hosted by Sociobot\. Send payment and refund questions there\./);
  await page.screenshot({ path: `${evidence}/unlock-dialog-desktop.png`, fullPage: false });
  assert.deepEqual(errors, []);
  report.findings.copy = { settingsNoAccount: true, rejectedArchitectureClaimAbsent: true, paidCopy: true };
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
await writeFile(`${evidence}/cold-check.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
