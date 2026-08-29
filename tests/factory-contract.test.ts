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
    expect(staticShell).toContain('data-action="try-demo">Try it with sample data</button>');
    expect(staticShell).toContain("Timecards stay on this device.");
    expect(staticShell).toContain("Works offline after the first visit.");
    expect(staticShell).not.toContain("Rebuild the week");
  });
});
