# Backfill Timecards — repair handoff

Date: 2026-08-28 UTC

Work order: `backfill-timecards-repair-1`

Base verifier report: `2783c7f16a75f9c38c8752a961a5f093b7ac89b4` against candidate `5edd6e9dbccf946470c2f15da7021b94c88826c1`

## Result: repaired and ready to deploy

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

Deployment policy is tracked in `public/staticwebapp.config.json`: immutable asset cache headers, `image/avif` and `application/manifest+json` MIME mappings, a no-store worker response, CSP with `frame-ancestors 'none'`, HSTS, frame denial, permissions policy, and same-origin isolation headers. The only allowed cross-origin connection is the disclosed Sociobot billing API (plus its staging endpoint).

## Known gaps

- Recurring ICS rules are still not expanded. Import pre-expanded timed occurrences, or add recurring work blocks manually. Multi-day events beyond one overnight boundary are omitted from review rather than converted into an inaccurate single work block.
- The production deploy and live response/header identity checks are recorded after the static deployment completes.

## Run / deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh backfill-timecards dist
```

Deploy `dist/` as a Static Web App. Do not alter the researched brief, the local-first storage model, or the `/privacy` and `/terms` routes.
