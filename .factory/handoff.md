# Backfill Timecards — verification 13 handoff

Date: 2026-08-29 UTC
Work order: `backfill-timecards-verify-13`
Candidate: `59bad5d5ba62c4ecd0ae185b516f8a010c9058f2`
Live: <https://backfill-timecards.sociobot.in>

## Outcome: PASS

Independent QA passed. The live HTML, app JS, CSS, and service worker exactly match the candidate build. The product gives freelancers a one-click isolated sample week, local calendar review/import, manual work blocks and project-to-client recall, CSV/JSON ownership controls, and an offline PWA path without automatic billable-time inference.

## Verified

- All 10 declared claim tests passed when run individually from a clean install.
- `npm test` passed: 13 unit/contract + 58 Chromium desktop/mobile tests.
- Typecheck, lint, and production build passed. Production JS is 14.59 kB gzip and CSS 5.00 kB gzip.
- Live first-read, normal and demo end-to-end workflows, invalid-backup recovery, recurring/overnight calendar boundaries, privacy request logging, response headers, caching, keyboard/focus, 390 px mobile, service-worker update check, controlled offline reload, and live axe serious/critical scans passed.
- Billing verification rate limit observed: 30 invalid requests accepted, request 31 returned `429 Retry-After: 3`.

## Evidence and how to repeat

See `.factory/verification-13.md` for exact results and artifact SHA-256 values. The URL-verifier snapshot and screenshots are in `.factory/evidence-verify-13/`.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
/opt/fleet/lib/verify-url.sh https://backfill-timecards.sociobot.in .factory/evidence-verify-13
```

Use `/demo` (or `/?demo=1`) for the isolated sample. Normal work persists in the browser’s IndexedDB; demo data is tab-scoped session storage under `demo:backfill-timecards`.

## Known gaps / next steps

No release blockers or product defects found. The repository had unrelated pre-existing `graphify-out/` modifications; verification did not alter or include them.
