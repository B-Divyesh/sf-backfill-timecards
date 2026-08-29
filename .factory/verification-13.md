# Verification 13 — PASS

Date: 2026-08-29 UTC
Work order: `backfill-timecards-verify-13`
Candidate commit: `59bad5d5ba62c4ecd0ae185b516f8a010c9058f2`
Live URL: <https://backfill-timecards.sociobot.in>

## Decision

**PASS.** The candidate satisfies the researched brief and the factory acceptance contract. The live site is an exact artifact match for the candidate build; the previously reported deployment-only failure is not reproducible.

## Cold first read

On a cold desktop visit, the first screen says **“Reconstruct your freelance workweek.”** It says this is **for freelancers logging work after the fact** and that reviewed calendar events and memory become an invoice-ready weekly timecard. The obvious first action is **“Try it with sample data”**, immediately accompanied by “The sample opens a separate weekly timecard without changing your work.” The action opens `/demo` in one click. This meets the plain-words and demo-sandbox requirements.

## Required claim tests — clean install

`npm ci` completed successfully (0 vulnerabilities reported). Every command in `.factory/claims.json` was run separately from this checkout, against the product’s demo entry point. All passed.

| Claim id | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `demo-exit-cleanup` | PASS |
| `weekly-board` | PASS |
| `calendar-local` | PASS |
| `csv-export` | PASS |
| `local-archive` | PASS |
| `offline-reload` | PASS |
| `pattern-deck` | PASS |
| `privacy-local` | PASS |
| `billing-entitlement` | PASS |

Each command reported one passing Chromium test. No claims file was missing and no claim failed.

## Repository quality gates

- `npm test`: **PASS** — 13 unit/contract tests and 58 Chromium desktop/mobile end-to-end tests passed; no skips or failures.
- `npm run typecheck`: **PASS**.
- `npm run lint`: **PASS**.
- `npm run build`: **PASS**; `dist/` produced. Vite reported 48.68 kB raw / 14.59 kB gzip initial JS and 19.65 kB raw / 5.00 kB gzip CSS, within the PWA budgets.
- The build contains physical Demo, Privacy, Terms, 404, manifest, icon, and service-worker artifacts.

## Independent live evidence

- `/opt/fleet/lib/verify-url.sh https://backfill-timecards.sociobot.in .factory/evidence-verify-13` passed: HTTP 200, title, `lang=en`, one `h1`, main landmark, zero images missing `alt`, zero unlabeled buttons, and no page/console errors. Its HTML snapshot, screenshots, and JSON are in `.factory/evidence-verify-13/`.
- The root page loaded in 667 ms in that check. It has the required first-screen sample action, normal/empty state, real `header`, `nav`, `main`, and footer.
- Live Playwright + `@axe-core/playwright` scans found **zero serious or critical violations** on root, Demo, Privacy, Terms, and a 390×844 Demo viewport. The standalone `npx @axe-core/cli` launch could not locate a Chrome binary in this container; the mandated equivalent Playwright axe integration was used instead.
- At 390 px the document scroll width was exactly 390 px. Demo Reset and Start-for-real controls were both 178×44 px. Keyboard Tab focused the skip link; Enter moved focus to `#main`. Dialog keyboard behavior and focus restoration also passed in the full Chromium suite.
- In a fresh normal context, adding a block, exporting CSV, reloading, and adding a second block recalled the known project’s client. The exported CSV contained the added record. A live `.ics` import expanded weekly occurrences through its end date, allowed deselection, kept descriptions hidden until explicitly chosen, and preserved a 23:00–01:00 overnight block as 2 h. Reset restored the six-record sample.
- The full normal-work request log contained only `https://backfill-timecards.sociobot.in`; the Demo flow made no off-origin request. No console/page errors occurred. This corroborates the local-first/no-account privacy promise.
- A fresh live PWA context became service-worker controlled. `registration.update()` completed with active `/sw.js` and no waiting worker (there was no newer deploy). After switching the context offline, reloading `/demo` retained the banner, sample board, and “Offline · saved here” status. The worker uses versioned caches, `skipWaiting`, `clients.claim`, and an update toast path.
- Response headers on root and assets include HSTS, `nosniff`, `DENY` / `frame-ancestors 'none'`, strict referrer policy, restrictive permissions policy, same-origin COOP/CORP, and a CSP that permits only the site plus the documented Sociobot billing endpoints. Root HTML is `no-cache`; hashed app JS is `public, max-age=31536000, immutable`; service worker is `no-cache, no-store, must-revalidate`.
- Billing verification boundary: one client received 200 invalid-token responses for requests 1–30, then **429** on request 31 with `Retry-After: 3`. Observed allowance: **30 verification requests per client/window**. No card fields or payment iframe are shipped; checkout is a Sociobot URL.

## Candidate/deployment identity

After building the candidate, the live files had byte-identical SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `7a10f1a78d02d87437e6cd00f40b6305a3ed35c0129086753f4a47e170b956c6` |
| `assets/index-BuG8UySq.js` | `91e28fe85b3511814e4f28c1ac4c4c013e28a1ed95410ed8d524177df37a8cc6` |
| `assets/index-F37a4tX5.css` | `95e27c26036740b9237fe3587a6084b9a8f6bb804c297035ad3e9ee3c7141a52` |
| `sw.js` | `36f503ab06511a73c870269b56f680c59d54fe575b4d350c71212ef8efed9a09` |

This is fresh evidence that the deployed site is this candidate, not a stale or failed deployment.

## Defects

No release-blocking, high, medium, or low product defects found. The pre-existing modified `graphify-out/` files were unrelated workspace artifacts and were not changed by this verification.
