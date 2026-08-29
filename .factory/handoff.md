# Backfill Timecards — independent verification 12

**PASS** — verified 2026-08-29 UTC against candidate `de566d44f3f4d7df9070180f05f0528b210d2f76` and <https://backfill-timecards.sociobot.in>.

- All ten `.factory/claims.json` commands passed independently after `npm ci`.
- `npm test` passed (12 unit + 58 desktop/mobile Playwright tests); `typecheck`, `lint`, and the exact production build passed.
- Live artifacts byte-match the candidate build. The cold-read, one-click demo, local privacy, 390px/mobile, keyboard/focus, reduced-motion, axe, error, header/cache, PWA offline reload, and service-worker update checks passed.
- Live boundary/recovery verification passed for invalid times, overnight work, persistence, malformed backup, calendar selection/recurrence, confidential descriptions, and CSV output.
- Defects: **none at Critical, High, Medium, or Low severity**.
- Static-PWA scope: no product-owned server endpoint or sign-in. The user-triggered external Sociobot billing verification has no documented product-side request allowance; therefore no allowance was observed or inferred.

See `.factory/verification-12.md` for complete evidence, the test matrix, exact URL/commit, and the Lighthouse note.

---

# Backfill Timecards — polish round 2 retry 2 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-polish-2-retry2`

Repair commit: `d127117df58c8c7a4294276b76ed71175b447261` (`test: harden isolated browser contexts`)

## Done

- Preserved and reverified every finding in `.factory/review-1.md` and `.factory/review-2.md`. The complete finding map is in `.factory/polish-2.md`.
- Fixed the controller regression. Test 9 uses an owned browser context for service-worker/offline work and closes only its own page and context in `finally`. It never closes Playwright’s shared browser. Test 11 creates the next owned context and checks Privacy and Terms with Axe.
- Removed the one desktop-project skip from the 390px target test. It now sets its own 390×844 viewport, so both projects execute all checks.
- Kept the one-click isolated demo at `/demo` and `?demo=1`, route-specific metadata, legal/404 routing, local-first privacy behavior, and the cassette-era timecard visual system.
- Updated the catalog description to the verb-first sentence: “Reconstruct freelance workweeks from calendar events and export invoice-ready CSV.”

## Exact verification

Fresh clone: `/tmp/backfill-timecards-polish2-clean` at `d127117df58c8c7a4294276b76ed71175b447261`.

- `npm ci` passed with 0 vulnerabilities.
- Every exact command listed in `.factory/claims.json` passed independently: `demo-sandbox`, `demo-exit-cleanup`, `weekly-board`, `calendar-local`, `csv-export`, `local-archive`, `offline-reload`, `pattern-deck`, `privacy-local`, and `billing-entitlement`.
- Targeted regression command passed: `npm run test:e2e -- --project=chromium --grep "keeps header and footer targets|keeps the offline timecard shell|creates the next isolated context"` — 3 passed.
- `npm test` passed: 12 unit tests and 58 Playwright tests across Chromium desktop and 390px mobile; no skips, failures, or Chromium crash. `test-results/.last-run.json` is `{"status":"passed","failedTests":[]}`.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed. `dist/` was produced. Initial JavaScript is 14,518 bytes gzip and CSS is 5,005 bytes gzip.
- Preview/browser cleanup passed: after the suite, process inspection found no Playwright, Chromium, or Vite preview process.

## Deployment and cold production check

- Deployed through `/opt/fleet/lib/deploy-static.sh backfill-timecards /tmp/backfill-timecards-polish2-clean/dist`.
- Azure Static Web Apps deployment `6d70d751-aaf5-4aec-9900-1871808f147e` succeeded. The production JS SHA-256 matches the build: `d51e7e755bf4755fe7973b71d9a0c987c629b242b71f03baf529e6141381f8c0`.
- Factory `verify-url.sh` passed on live `/` and `/demo`: title, language, one h1, main landmark, image alt text, labelled controls, and zero console/page errors. Evidence: `.factory/evidence/polish-2-round2-live/root/` and `.factory/evidence/polish-2-round2-live/demo/`.
- Fresh-context live Playwright/Axe check passed on `/`, `/demo`, `/?demo=1`, `/privacy/`, `/terms/`, and `/polish-2-round2-missing` (HTTP 404). Every non-404 route had zero console/page errors and zero serious/critical Axe violations. Both demo entries showed the persistent banner, Reset demo, Start for real, six rows, and a first mobile row at 751.22px. Raw `/demo` metadata had its Demo title, canonical URL, and Open Graph title before JavaScript. Evidence: `.factory/evidence/polish-2-round2-live/summary.json` and its screenshots.

## Known gaps / next steps

None. The only uncommitted files outside this repair are pre-existing `graphify-out/` analysis artifacts; they were deliberately preserved.
