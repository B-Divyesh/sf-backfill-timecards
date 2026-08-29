import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = new URL("../../dist/", import.meta.url).pathname;
let revision = "qa-a";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || "/", "http://127.0.0.1:4176").pathname;
  if (pathname === "/__flip") {
    revision = "qa-b";
    response.writeHead(200, { "content-type": "text/plain", "cache-control": "no-store" });
    response.end(revision);
    return;
  }
  let relative = pathname === "/" ? "index.html" : pathname.slice(1);
  let file = normalize(join(root, relative));
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    let body = await readFile(file);
    if (pathname === "/sw.js") {
      body = Buffer.from(body.toString().replace('const VERSION = "backfill-v1.0.6";', `const VERSION = "backfill-v1.0.6-${revision}";`));
    }
    response.writeHead(200, {
      "content-type": types[extname(file)] || "application/octet-stream",
      "cache-control": pathname === "/sw.js" ? "no-store" : "no-cache",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("not found");
  }
});

await new Promise((resolve) => server.listen(4176, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4176/demo", { waitUntil: "networkidle" });
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), true);
  await page.waitForTimeout(1600);
  await fetch("http://127.0.0.1:4176/__flip");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  });
  await page.getByText("An updated timecard is ready.", { exact: true }).waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Refresh" }).click();
  await page.waitForLoadState("networkidle");
  const cacheKeys = await page.evaluate(() => caches.keys());
  assert.equal(cacheKeys.some((key) => key.includes("qa-b-shell")), true);
  assert.equal(cacheKeys.some((key) => key.includes("qa-a")), false);
  assert.equal(await page.locator(".track").count(), 6);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ updateToast: true, refreshAction: true, cacheKeys, demoRowsAfterUpdate: 6, errors }, null, 2));
  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
