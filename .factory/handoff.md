# Backfill Timecards — polish round 2 retry handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-polish-2-retry1`
Repair commit: `c98a7b1e2aa362efc096e3aec865fa2c82c0de21` (`test: isolate offline browser contexts`)
Deployment: application repair pushed to `origin/main` at `c98a7b1e2aa362efc096e3aec865fa2c82c0de21`; live-evidence revision `273f176` was also pushed. The static live site was cold-checked at <https://backfill-timecards.sociobot.in>.

## Done

- Resolved every F-1-1 through F-1-33 and F-2-1 through F-2-12. The complete finding-to-change map is in `.factory/polish-2.md`.
- Strengthened the three incomplete claim tests: weekly `UNTIL` recurrence and event selection; complete JSON backup contents and restoration; locked free-tier use of manual entry, import, CSV export, and local-data controls.
- Rewrote the remaining product and README copy: result-naming week navigation/actions, work-block terminology, local-data/JSON-backup terminology, and the tested web-app metadata statement.
- Updated the verb-first 84-character catalog description.
- Made browser reliability explicit for the 2 CPU / 4 GiB worker: each offline or service-worker test creates its own browser context, restores online state, clears cookies, and closes in `finally`. The demo tab-close context has the same guaranteed cleanup. Playwright now owns both preview servers and tears them down after each run.

## Exact verification

Fresh clone: `/tmp/backfill-timecards-clean.m69KFv` at `c98a7b1e2aa362efc096e3aec865fa2c82c0de21`.

- `npm ci` passed with 0 vulnerabilities.
- Each registered command in `.factory/claims.json` passed independently from that clone: `demo-sandbox`, `demo-exit-cleanup`, `weekly-board`, `calendar-local`, `csv-export`, `local-archive`, `offline-reload`, `pattern-deck`, `privacy-local`, and `billing-entitlement`.
- Full clean-clone gates passed: `npm test` (12 unit tests and 58 Playwright tests), `npm run typecheck`, `npm run lint`, and `npm run build`. `test-results/.last-run.json` reports `{"status":"passed","failedTests":[]}`.
- Build output is `dist/`; initial JS is 14.61 kB gzip and CSS is 5.00 kB gzip.
- After the full browser run, process inspection found no remaining Playwright, Chromium, or Vite preview process.
- Cold live check passed after the push. Fresh 390×844 contexts verified `/`, `/demo`, `/privacy/`, `/terms/`, an HTTP 404, and `/?demo=1`; every normal route had the required title, `lang="en"`, exactly one main landmark, expected h1, no console/page errors, and no serious/critical Axe issue. The 404 had the expected browser HTTP-404 console entry only. `/demo` and `?demo=1` each showed the isolated banner, reset/start actions, and six sample rows. Evidence: `.factory/evidence/polish-2-retry-live/summary.json` and the matching route screenshots.
- Live `verify-url.sh` passed for root and Demo: valid title/lang, one h1, main landmark, image alt text, labelled controls, and no console/page errors. Evidence: `.factory/evidence/polish-2-live/root/` and `.factory/evidence/polish-2-live/demo/`.
- Cold live Playwright/Axe crawl passed on `/`, `/demo`, `/privacy/`, `/terms/`, and a real 404. Root, Demo, Privacy, and Terms had no console/page errors and no serious or critical Axe violations; the 404 intentionally reports its HTTP 404 in the browser console and had no Axe violation.
- Cold `?demo=1` check passed: title `Demo — Backfill Timecards`, banner, Reset demo, Start for real, six rows, first mobile row at 751.22px in a 390×844 viewport.
- Live Demo first-row and copy checks passed: result-naming Save pattern and Show next week controls are present.
- Live deployment identity passed: `dist/assets/index-BDwaH195.js` and the fetched production asset have SHA-256 `d51e7e755bf4755fe7973b71d9a0c987c629b242b71f03baf529e6141381f8c0`. Raw `/demo` has its Demo title, canonical URL, and Open Graph title before JavaScript.
- Lighthouse (live): root 100 performance / 100 accessibility / 100 best practices / 100 SEO; Demo 99 / 100 / 100 / 100. JSON reports are in `.factory/evidence/polish-2-live/`.

## Known gaps / next steps

None. The remaining dirty `graphify-out/` files were pre-existing unrelated work and were deliberately not changed or committed.
