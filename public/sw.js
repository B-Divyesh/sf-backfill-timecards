// Bump the cache namespace with the layout-stable app shell so a previously
// installed board receives the update toast and never retains its old shell.
const VERSION = "backfill-v1.0.4";
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const EXTRA_PRECACHE = [];
const PRECACHE = ["/", "/index.html", "/manifest.webmanifest", "/offline.html", "/privacy/", "/terms/", "/legal.css", "/icons/icon.svg", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png", "/assets/hero-cassette-640.avif", "/assets/hero-cassette-640.webp", ...EXTRA_PRECACHE];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![SHELL, ASSETS].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => {
      // Only the app routes may fall back to the app shell. In particular,
      // never let a privacy or terms response overwrite that shell.
      if (["/", "/index.html", "/demo", "/demo/"].includes(url.pathname)) {
        return (await caches.match("/index.html")) || caches.match("/offline.html");
      }
      return (await caches.match(request)) || caches.match("/offline.html");
    }));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(ASSETS).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
