import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";

const origin = "https://backfill-timecards.sociobot.in";
const evidence = new URL(".", import.meta.url).pathname;
const severe = new Set(["serious", "critical"]);
const report = { checkedAt: new Date().toISOString(), origin, routes: [], raw: {} };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch();
try {
  for (const route of [
    { path: "/", title: "Backfill Timecards — reconstruct your workweek", h1: "Reconstruct your freelance workweek", viewport: { width: 1440, height: 900 }, shot: "root-cold.png" },
    { path: "/demo", title: "Demo — Backfill Timecards", h1: "Sample weekly timecard", viewport: { width: 390, height: 844 }, shot: "demo-cold-mobile.png", demo: true },
    { path: "/?demo=1", title: "Demo — Backfill Timecards", h1: "Sample weekly timecard", viewport: { width: 390, height: 844 }, shot: "query-demo-cold-mobile.png", demo: true },
    { path: "/privacy/", title: "Privacy — Backfill Timecards", h1: "How Backfill Timecards stores your data", viewport: { width: 390, height: 844 }, shot: "privacy-cold-mobile.png", legal: true },
    { path: "/terms/", title: "Terms — Backfill Timecards", h1: "Terms for using Backfill Timecards", viewport: { width: 390, height: 844 }, shot: "terms-cold-mobile.png", legal: true },
    { path: "/polish-2-round2-missing", title: "Page not found — Backfill Timecards", h1: "Page not found", viewport: { width: 390, height: 844 }, shot: "not-found-cold-mobile.png", notFound: true },
  ]) {
    const context = await browser.newContext({ viewport: route.viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error" && !(route.notFound && /Failed to load resource/.test(message.text()))) errors.push(message.text());
    });
    const response = await page.goto(`${origin}${route.path}`, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(500);
    const basics = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1s: [...document.querySelectorAll("h1")].map(element => element.textContent?.trim()),
      main: document.querySelectorAll("main").length,
      missingAlt: [...document.images].filter(image => !image.hasAttribute("alt")).length,
      tracks: document.querySelectorAll(".track").length,
      banner: document.querySelector(".demo-banner")?.textContent?.replace(/\s+/g, " ").trim() || null,
      firstTrackTop: document.querySelector(".track")?.getBoundingClientRect().top ?? null,
    }));
    assert(response?.status() === (route.notFound ? 404 : 200), `${route.path} returned ${response?.status()}`);
    assert(basics.title === route.title, `${route.path} title mismatch`);
    assert(basics.lang === "en" && basics.main === 1 && basics.h1s.length === 1, `${route.path} document landmarks mismatch`);
    assert(basics.h1s[0]?.includes(route.h1), `${route.path} h1 mismatch`);
    assert(basics.missingAlt === 0, `${route.path} has an image without alt text`);
    if (route.demo) {
      assert(basics.banner?.includes("Demo — sample data, nothing is saved"), `${route.path} has no demo banner`);
      assert(basics.tracks === 6 && basics.firstTrackTop !== null && basics.firstTrackTop < route.viewport.height, `${route.path} does not open on sample work`);
      assert(await page.getByRole("button", { name: "Reset demo" }).isVisible(), `${route.path} has no reset control`);
      assert(await page.getByRole("link", { name: "Start for real" }).isVisible(), `${route.path} has no real-work exit`);
    }
    if (route.path === "/") {
      for (const fact of ["privacy", "offline", "price"]) {
        const box = await page.locator(`[data-fact="${fact}"]`).boundingBox();
        assert(box && box.y + box.height <= route.viewport.height, `${fact} fact is below the first screen`);
      }
      assert(await page.getByRole("link", { name: "Try it with sample data" }).isVisible(), "root is missing the sample entry action");
    }
    if (route.legal) {
      assert(await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Demo" }).isVisible(), `${route.path} has no Demo navigation`);
      assert(await page.getByRole("navigation", { name: "Legal and product links" }).getByRole("link", { name: "Privacy" }).isVisible(), `${route.path} footer lacks Privacy`);
      assert(await page.getByRole("navigation", { name: "Legal and product links" }).getByRole("link", { name: "Terms" }).isVisible(), `${route.path} footer lacks Terms`);
    }
    const axe = await new AxeBuilder({ page }).analyze();
    const violations = axe.violations.filter(violation => severe.has(violation.impact || ""));
    assert(violations.length === 0, `${route.path} has serious Axe violations`);
    await page.screenshot({ path: `${evidence}/${route.shot}`, fullPage: true });
    report.routes.push({ path: route.path, status: response?.status(), basics, errors, seriousAxeViolations: violations.length });
    assert(errors.length === 0, `${route.path} console or page error: ${errors.join("; ")}`);
    await context.close();
  }

  const demoRaw = await (await fetch(`${origin}/demo`)).text();
  assert(demoRaw.includes("<title>Demo — Backfill Timecards</title>"), "raw /demo title mismatch");
  assert(demoRaw.includes('rel="canonical" href="https://backfill-timecards.sociobot.in/demo"'), "raw /demo canonical mismatch");
  assert(demoRaw.includes('property="og:title" content="Demo — Backfill Timecards"'), "raw /demo Open Graph title mismatch");
  report.raw.demoMetadata = "passed";
  await writeFile(`${evidence}/summary.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
