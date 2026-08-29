import { defineConfig } from "vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

function injectServiceWorkerAssets() {
  return {
    name: "inject-service-worker-assets",
    closeBundle() {
      const html = readFileSync("dist/index.html", "utf8");
      const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+\.(?:js|css))"/g)].map((match) => match[1]);
      const path = "dist/sw.js";
      const worker = readFileSync(path, "utf8").replace("const EXTRA_PRECACHE = [];", `const EXTRA_PRECACHE = ${JSON.stringify(assets)};`);
      writeFileSync(path, worker);
      // `/demo` is a real address, not a client-side catch-all. A physical
      // entry lets Static Web Apps return a genuine 404 for unknown routes.
      mkdirSync("dist/demo", { recursive: true });
      const demoTitle = "Demo — Backfill Timecards";
      const demoDescription = "Try a populated freelance timecard in a separate demo that saves nothing to your real work.";
      const demoHtml = html
        .replace("<title>Backfill Timecards — reconstruct your workweek</title>", `<title>${demoTitle}</title>`)
        .replace('content="Reconstruct a freelance workweek privately, then export an invoice-ready CSV."', `content="${demoDescription}"`)
        .replace('href="https://backfill-timecards.sociobot.in/"', 'href="https://backfill-timecards.sociobot.in/demo"')
        .replace('content="https://backfill-timecards.sociobot.in/"', 'content="https://backfill-timecards.sociobot.in/demo"')
        .replaceAll('content="Backfill Timecards — reconstruct your workweek"', `content="${demoTitle}"`)
        .replaceAll('content="Reconstruct a freelance workweek privately, then export an invoice-ready CSV."', `content="${demoDescription}"`);
      writeFileSync("dist/demo/index.html", demoHtml);
    },
  };
}

export default defineConfig({
  // Keep the first HTML response small. Vite emits immutable, hashed CSS and
  // JS which the service worker injects into its precache list below.
  plugins: [injectServiceWorkerAssets()],
  build: {
    target: "es2022",
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
