import { defineConfig } from "vite";
import { readFileSync, writeFileSync } from "node:fs";
import { viteSingleFile } from "vite-plugin-singlefile";

function injectServiceWorkerAssets() {
  return {
    name: "inject-service-worker-assets",
    closeBundle() {
      const html = readFileSync("dist/index.html", "utf8");
      const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+\.(?:js|css))"/g)].map((match) => match[1]);
      const path = "dist/sw.js";
      const worker = readFileSync(path, "utf8").replace("const EXTRA_PRECACHE = [];", `const EXTRA_PRECACHE = ${JSON.stringify(assets)};`);
      writeFileSync(path, worker);
    },
  };
}

export default defineConfig({
  plugins: [viteSingleFile(), injectServiceWorkerAssets()],
  build: {
    target: "es2022",
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
