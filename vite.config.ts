import { defineConfig } from "vite";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

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
      copyFileSync("dist/index.html", "dist/demo/index.html");
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
