# Backfill Timecards — polish round 2 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-polish-2`
Repair commit: `e32f6295fea5ee7aac3bbf397bada81b2ccb66df` (`Polish claims and timecard copy`)
Deployment: `3fd893ba-c1ab-451e-8b45-e719f7fd7459` to <https://backfill-timecards.sociobot.in>

## Done

- Resolved every F-1-1 through F-1-33 and F-2-1 through F-2-12. The complete finding-to-change map is in `.factory/polish-2.md`.
- Strengthened the three incomplete claim tests: weekly `UNTIL` recurrence and event selection; complete JSON backup contents and restoration; locked free-tier use of manual entry, import, CSV export, and local-data controls.
- Rewrote the remaining product and README copy: result-naming week navigation/actions, work-block terminology, local-data/JSON-backup terminology, and the tested web-app metadata statement.
- Updated the verb-first 84-character catalog description.

## Exact verification

Fresh clone: `/tmp/backfill-polish2-clean.sAFGHv` at `e32f6295fea5ee7aac3bbf397bada81b2ccb66df`.

- `npm ci` passed with 0 vulnerabilities.
- Each registered command in `.factory/claims.json` passed independently: `demo-sandbox`, `demo-exit-cleanup`, `weekly-board`, `calendar-local`, `csv-export`, `local-archive`, `offline-reload`, `pattern-deck`, `privacy-local`, and `billing-entitlement`.
- Full source-suite gates passed: `npm test` (57 passed, 1 intentional mobile skip), `npm run typecheck`, `npm run lint`, and `npm run build`.
- Build output is `dist/`; initial JS is 14.61 kB gzip and CSS is 5.00 kB gzip.
- Live `verify-url.sh` passed for root and Demo: valid title/lang, one h1, main landmark, image alt text, labelled controls, and no console/page errors. Evidence: `.factory/evidence/polish-2-live/root/` and `.factory/evidence/polish-2-live/demo/`.
- Cold live Playwright/Axe crawl passed on `/`, `/demo`, `/privacy/`, `/terms/`, and a real 404. Root, Demo, Privacy, and Terms had no console/page errors and no serious or critical Axe violations; the 404 intentionally reports its HTTP 404 in the browser console and had no Axe violation.
- Cold `?demo=1` check passed: title `Demo — Backfill Timecards`, banner, Reset demo, Start for real, six rows, first mobile row at 751.22px in a 390×844 viewport.
- Live Demo first-row and copy checks passed: result-naming Save pattern and Show next week controls are present.
- Live deployment identity passed: `dist/assets/index-BDwaH195.js` and the fetched production asset have SHA-256 `d51e7e755bf4755fe7973b71d9a0c987c629b242b71f03baf529e6141381f8c0`. Raw `/demo` has its Demo title, canonical URL, and Open Graph title before JavaScript.
- Lighthouse (live): root 100 performance / 100 accessibility / 100 best practices / 100 SEO; Demo 99 / 100 / 100 / 100. JSON reports are in `.factory/evidence/polish-2-live/`.

## Known gaps / next steps

None. The remaining dirty `graphify-out/` files were pre-existing unrelated work and were deliberately not changed or committed.
