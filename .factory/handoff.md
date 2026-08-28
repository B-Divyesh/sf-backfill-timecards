# Backfill Timecards — repair handoff

Date: 2026-08-28 UTC

Work order: `backfill-timecards-repair-1`

Base verifier report: `2783c7f16a75f9c38c8752a961a5f093b7ac89b4` against candidate `5edd6e9dbccf946470c2f15da7021b94c88826c1`

## Result: repaired, deployed, and live-verified

All three release-blocking P1 findings from the independent verification report have regression coverage.

1. The worker now precaches the actual app shell and legal pages separately. Navigation responses are never written to `/index.html`; an offline root navigation after online `/privacy/` therefore returns the weekly board.
2. JSON backup records are fully validated before IndexedDB is changed. A replacement uses one read/write transaction across all three stores. Invalid legacy records are ignored when loading/exporting so Settings remains available for recovery.
3. Timed ICS events that end the following day retain `endsNextDay`. Calendar review labels the boundary, weekly totals use the true duration, and CSV exports the correct decimal hours. The entry editor also exposes an `Ends the next day` control.

The repair additionally brings the previously noted root/footer mobile links to 44 px targets, adds explicit Static Web Apps cache/MIME/security policy, and restores focus to the invoking control after dialogs close.

## Exact verification evidence

Clean install and static checks:

```sh
npm ci                 # 68 packages; npm reported 0 vulnerabilities
npm run typecheck      # PASS
npm run lint           # PASS
npm test               # PASS: 6 Vitest tests; 20 Playwright runs (desktop + 390×844 mobile)
npm run build          # PASS; ./dist/index.html at the output root
git diff --check       # PASS
```

Browser coverage runs each end-to-end scenario in Chromium desktop and a 390 × 844 mobile viewport. It covers normal add/edit/persistence/CSV, selective calendar import, the exact `20260824T230000` → `20260825T010000` import and `2.00` CSV row, malformed backup preservation after reload, legal-page-then-offline root recovery, keyboard dialog Escape/focus return, local-only normal-use requests, offline reload, and 44 px target measurements.

`@axe-core/playwright` reported no serious or critical violations on the app, Privacy, and Terms pages in both browser projects. The PWA root offline test passes after a service worker controls the page. The production shell is 52.8 KB raw (well within the 200 KB initial-JS budget; the app CSS and JS are inlined by design for offline shell integrity).

## Deployment and live evidence

Repair commit `6c07193ff92e99371d65331caf86f7ef59289236` was pushed to `main` and deployed as Azure Static Web Apps deployment `09564102-7f5e-4f12-8184-4de97f694040` to <https://backfill-timecards.sociobot.in/>.

- `/opt/fleet/lib/verify-url.sh` returned HTTP 200 in 737 ms with no browser console/page errors, a title, `lang=en`, one h1, a main landmark, and no images missing `alt`.
- Live `index.html` SHA-256 exactly matched the clean `dist/index.html`: `52f0a75a7b572a41b39ff04ec5e35e23e52cfdf1e799e88765fd36b41b34e4f2`.
- A clean 390 px live Chromium profile installed the worker, visited `/privacy/`, went offline, and loaded `/?offline-repair-check=1`; the `Add work block` control was present.
- Live response checks confirmed immutable asset caching; `image/avif` for AVIF; `application/manifest+json` for the manifest; and `no-cache, no-store, must-revalidate` for `/sw.js`. Root responses include CSP with `frame-ancestors 'none'`, HSTS `max-age=63072000`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, and `Referrer-Policy`.
- Lighthouse mobile rerun: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1,207 ms, TBT 238 ms, CLS 0.

Deployment policy is tracked in `public/staticwebapp.config.json`. The only allowed cross-origin connection in its CSP is the disclosed Sociobot billing API (plus its staging endpoint).

## Known gaps

- Recurring ICS rules are still not expanded. Import pre-expanded timed occurrences, or add recurring work blocks manually. Multi-day events beyond one overnight boundary are omitted from review rather than converted into an inaccurate single work block.
- Azure Static Web Apps did not emit the configured COOP/CORP isolation headers in the live response. This is a non-blocking response-hardening limitation; CSP/frame denial, HSTS, MIME, and caching policy are live.

## Run / deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh backfill-timecards dist
```

Deploy `dist/` as a Static Web App. Do not alter the researched brief, the local-first storage model, or the `/privacy` and `/terms` routes.
