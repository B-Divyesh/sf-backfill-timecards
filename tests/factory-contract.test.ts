import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface ClaimRecord {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
}

const claims = JSON.parse(readFileSync(new URL("../.factory/claims.json", import.meta.url), "utf8")) as ClaimRecord[];
const browserTests = readFileSync(new URL("./e2e/app.e2e.ts", import.meta.url), "utf8");
const staticShell = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const privacy = readFileSync(new URL("../public/privacy/index.html", import.meta.url), "utf8");
const terms = readFileSync(new URL("../public/terms/index.html", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../src/app.ts", import.meta.url), "utf8");
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const notFound = readFileSync(new URL("../public/404.html", import.meta.url), "utf8");
const staticConfig = readFileSync(new URL("../public/staticwebapp.config.json", import.meta.url), "utf8");
const viteConfig = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
const appleTouchIcon = readFileSync(new URL("../public/icons/apple-touch-icon.png", import.meta.url));

describe("factory release contracts", () => {
  it("declares each claim once and maps it to exactly one tagged browser test", () => {
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(browserTests.split(tag)).toHaveLength(2);
      expect(claim.test).toContain(`--grep ${tag}`);
      expect(claim.claim.trim()).not.toBe("");
      expect(claim.where.trim()).not.toBe("");
      expect(claim.sandbox.trim()).not.toBe("");
    }
  });

  it("ships the plain first-read message and one-click demo action in the static shell", () => {
    expect(staticShell).toContain("Reconstruct your <span>freelance workweek</span>");
    expect(staticShell).toContain("For freelancers logging work after the fact");
    expect(staticShell).toContain('href="/demo" data-action="try-demo">Try it with sample data</a>');
    expect(staticShell).toContain("Weekly timecards stay on this device.");
    expect(staticShell).toContain("Works offline after the first visit.");
    expect(staticShell).toContain("Saved patterns and previous-week copying cost $18 once.");
    expect(staticShell).not.toContain("Rebuild the week");
  });

  it("does not make unsupported merchant-refund or reproducible-build promises", () => {
    expect(terms).not.toMatch(/refunds?.{0,80}(automatically )?revoke/i);
    expect(appSource).not.toMatch(/refunds?.{0,80}revoke/i);
    expect(readme).not.toContain("reproducible static output");
  });

  it("keeps paid, privacy, and README promises observable and in plain words", () => {
    expect(appSource).toContain("Unlock saved patterns and week copying");
    expect(appSource).toContain("Save reusable work patterns");
    expect(appSource).not.toContain("Save unlimited reusable work patterns");
    expect(appSource).toContain("Checkout is hosted by Sociobot. Send payment and refund questions there.");
    expect(privacy).toContain("You can use the app without an account.");
    expect(privacy).not.toContain("account database");
    expect(appSource).toContain("You can use the app without an account.");
    expect(appSource).not.toContain("There is no cloud account.");
    for (const document of [privacy, terms]) {
      expect(document).toContain("Checkout is hosted by Sociobot. Send payment and refund questions there.");
      expect(document).not.toMatch(/merchant[- ]of[- ]record|Dodo/i);
    }
    expect(readme).toContain("Normal timecard work sends requests only to this site.");
    expect(readme).not.toContain("same-origin requests");
  });

  it("ships the required canonical, social, footer identity, and 404 deployment contract", () => {
    for (const document of [staticShell, privacy, terms]) {
      expect(document).toContain('rel="canonical"');
      expect(document).toContain('rel="apple-touch-icon"');
      expect(document).toContain('property="og:title"');
      expect(document).toContain('name="twitter:card"');
      expect(document).toContain("Private weekly timecards for freelancers.");
      expect(document).toContain("Param Factory (external)");
      expect(document).toContain("Build r8 · 2026-08-30");
      expect(document).toContain('href="/icons/apple-touch-icon.png"');
    }
    expect(notFound).toContain("<h1>Page not found</h1>");
    expect(notFound).toContain('property="og:url"');
    expect(notFound).toContain("Open Backfill Timecards");
    expect(notFound).toContain("Build r8 · 2026-08-30");
    expect(appleTouchIcon.readUInt32BE(16)).toBe(180);
    expect(appleTouchIcon.readUInt32BE(20)).toBe(180);
    expect(staticConfig).toContain('"responseOverrides"');
    expect(staticConfig).toContain('"404"');
    expect(staticConfig).toContain('"rewrite": "/404.html"');
    expect(staticConfig).not.toContain('"navigationFallback"');
    expect(viteConfig).toContain('writeFileSync("dist/demo/index.html", demoHtml)');
    expect(viteConfig).toContain("Demo — Backfill Timecards");
  });
});
