# Backfill Timecards — polish round 3

Date: 2026-08-29 UTC
Work order: `backfill-timecards-polish-3`
Product repair commit: `c9726f0` (`fix: clear review three claims and copy`)
Deployment: `8daf8183-2f04-493a-bb47-8177f2e7d3e7` to <https://backfill-timecards.sociobot.in>

This round read `.factory/review-1.md`, `.factory/review-2.md`, `.factory/review-3.md`, `.factory/polish-1.md`, and `.factory/polish-2.md` in full. Every listed finding was rechecked. The current source and live site leave no finding open.

## Finding map

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo bypasses the marketing hero and opens with its banner, summary, tools, and six sample work blocks. | `@claim:demo-sandbox`; [Demo mobile](evidence/polish-3-live/demo-cold-mobile.png); live `/demo` first row at 751.22 px. |
| F-1-2 | All privacy, offline, and price facts remain in the first 1440×900 screen. | `keeps all first-screen facts visible at 1440 by 900`; [root](evidence/polish-3-live/root-cold-desktop.png); live `/`. |
| F-1-3 | Uses “calendar events,” not “calendar clues.” | static-shell contract and copy audit; live `/`. |
| F-1-4 | Uses “weekly timecard” for saved work and “weekly board” for the view. | copy audit and `@claim:weekly-board`; live `/` and `/demo`. |
| F-1-5 | Price fact explains saved patterns and previous-week copying before naming the price. | static-shell contract; [root](evidence/polish-3-live/root-cold-desktop.png); live `/`. |
| F-1-6 | Toolbar action remains “Reuse saved blocks — $18.” | `@claim:billing-entitlement`; live `/demo`. |
| F-1-7 | Paid action remains “Review reuse tools — $18.” | static-shell contract; live `/`. |
| F-1-8 | README names Manual, Calendar, and Pattern marks. | copy audit and `@claim:weekly-board`; repository documentation. |
| F-1-9 | README explains ending recurrence and overnight events plainly. | `@claim:calendar-local`; repository documentation. |
| F-1-10 | README says the client is remembered for a project. | `@claim:weekly-board`; repository documentation. |
| F-1-11 | README promises tested web-app metadata, not unexplained PWA behavior. | `@claim:offline-reload`; repository documentation. |
| F-1-12 | README explains temporary demo-tab storage; `.factory/demo.md` records the precise key. | `@claim:demo-sandbox`; live `/demo`. |
| F-1-13 | README distinguishes normal local data, demo data, and license settings. | `@claim:privacy-local` and `@claim:demo-sandbox`; repository documentation. |
| F-1-14 | README build wording is short and removes unsupported implementation promises. | copy audit; repository documentation. |
| F-1-15 | README accurately separates seven Demo-starting claims from three normal-workspace claims. | all ten clean-clone claim commands; repository documentation. |
| F-1-16 | Billing claim test checks for no embedded payment frame, card field, or third-party script. | `@claim:billing-entitlement`; [unlock dialog](evidence/polish-3-live/unlock-dialog-desktop.png); live `/`. |
| F-1-17 | The unsupported universal claim-test meta-claim remains absent. | factory claim contract and copy audit; repository documentation. |
| F-1-18 | The unverified Node-version promise remains absent. | clean `npm ci`; repository documentation. |
| F-1-19 | The unregistered stack marketing sentence remains absent. | README audit; repository documentation. |
| F-1-20 | README now uses the plain, testable request-boundary wording. | `@claim:privacy-local`; repository documentation. |
| F-1-21 | Visitor-facing Playwright-version claim remains absent. | clean `npm ci` and full suite; repository documentation. |
| F-1-22 | Preview-server text is an instruction, not a product promise. | clean `npm test`; repository documentation. |
| F-1-23 | README gives deploy instructions without an unsupported physical-route claim. | route-metadata test; `dist/demo/index.html`. |
| F-1-24 | README gives the root service-worker instruction without asserting scope. | `@claim:offline-reload`; live `?demo=1` offline evidence. |
| F-1-25 | Unsupported header/MIME marketing remains absent. | live response headers; live `/`. |
| F-1-26 | Unsupported artwork-provider footer claim remains absent; provenance stays in design notes. | footer contract and `.factory/design.md`; live `/`. |
| F-1-27 | App route transitions update URL/title, focus the h1, and announce the route. | route-history browser test; `live-check.json`; live `/` → `/demo` → Back. |
| F-1-28 | App, legal, and 404 pages share the header/footer link structure. | legal Axe/navigation test; [Privacy](evidence/polish-3-live/privacy-cold-desktop.png), [Terms](evidence/polish-3-live/terms-cold-desktop.png), and live 404. |
| F-1-29 | Physical Demo HTML has Demo metadata before JavaScript. | `serves route-specific demo metadata before JavaScript`; live `/demo` raw response. |
| F-1-30 | 404 has social metadata and the original 180 px Apple icon. | factory route contract; [404](evidence/polish-3-live/missing-round-three-cold-desktop.png); live `/missing-round-three`. |
| F-1-31 | External links remain visibly labeled external. | footer touch-target/navigation test; live root/legal routes. |
| F-1-32 | Privacy, Terms, and 404 h1s name their pages directly. | route Axe check; live `/privacy/`, `/terms/`, and `/missing-round-three`. |
| F-1-33 | Copy audit covers landing controls, README sentences, word counts, and terminology. | `.factory/copy-audit.md`; repository documentation. |
| F-2-1 | Calendar claim verifies weekly `UNTIL`, selected-only import, exact dates, overnight duration, choices, and local handling. | `@claim:calendar-local`; clean clone PASS. |
| F-2-2 | JSON-backup claim checks all entries, mappings, pattern, erase/restore, client recall, and restored pattern. | `@claim:local-archive`; clean clone PASS. |
| F-2-3 | Pattern Deck claim operates every free core tool in a locked normal workspace. | `@claim:pattern-deck`; clean clone PASS. |
| F-2-4 | README says installation metadata rather than claiming installation. | `@claim:offline-reload`; repository documentation. |
| F-2-5 | Unsupported “clear” adjective remains removed. | README audit; repository documentation. |
| F-2-6 | Browser records are “local data”; downloaded files are “JSON backups.” | settings browser checks and copy audit; live `/`. |
| F-2-7 | Week controls name the result: Show previous/current/next week. | interactive browser checks; live `/demo`. |
| F-2-8 | Instructions, empty states, and dialogs use “work block,” not cassette metaphors. | dialog/empty-state browser checks; live `/demo`. |
| F-2-9 | Row action says “Save pattern” with result-first accessible text. | `@claim:pattern-deck`; live `/demo`. |
| F-2-10 | Pattern dialog heading says “Reuse saved work blocks.” | `@claim:local-archive`; live `/demo`. |
| F-2-11 | Settings action says “Review reuse tools — $18.” | `@claim:pattern-deck`; live `/`. |
| F-2-12 | Saved-pattern action says “Add to this week.” | `@claim:local-archive`; live `/demo`. |
| F-3-1 | Replaced the unprovable unlimited promise with “Save reusable work patterns.” | `@claim:billing-entitlement`; [unlock dialog](evidence/polish-3-live/unlock-dialog-desktop.png); live `/`. |
| F-3-2 | Replaced the unverifiable account-database statement with “You can use the app without an account.” | `@claim:privacy-local`; [Privacy](evidence/polish-3-live/privacy-cold-desktop.png); live `/privacy/`. |
| F-3-3 | Removed Dodo/merchant-of-record assertions. Dialog, Privacy, and Terms now consistently say that checkout is hosted by Sociobot and send payment/refund questions there. | `@claim:billing-entitlement`; [unlock dialog](evidence/polish-3-live/unlock-dialog-desktop.png), [Privacy](evidence/polish-3-live/privacy-cold-desktop.png), [Terms](evidence/polish-3-live/terms-cold-desktop.png); live `/`, `/privacy/`, `/terms/`. |
| F-3-4 | Renamed the paid dialog h2 to “Unlock saved patterns and week copying.” | `@claim:billing-entitlement`; [unlock dialog](evidence/polish-3-live/unlock-dialog-desktop.png); live `/`. |
| F-3-5 | Replaced README’s unexplained “same-origin” wording with “Normal timecard work sends requests only to this site.” | factory contract and `@claim:privacy-local`; repository documentation. |

## Clean-clone verification

Clean clone: `/tmp/backfill-polish3-clean.14p56r/repo` at `c9726f0`, installed with `npm ci`.

Every exact command registered in `.factory/claims.json` passed independently:

- `demo-sandbox`
- `demo-exit-cleanup`
- `weekly-board`
- `calendar-local`
- `csv-export`
- `local-archive`
- `offline-reload`
- `pattern-deck`
- `privacy-local`
- `billing-entitlement`

The complete clean-clone suite also passed:

- `npm test` — 13 unit/contract tests and 58 Chromium desktop/mobile browser tests; no skips or failures.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed and created `dist/`.
- Production assets: JavaScript 14.59 kB gzip; CSS 5.00 kB gzip.

## Cold live recheck

`/opt/fleet/lib/verify-url.sh` passed with zero console/page errors on `/`, `/demo`, `?demo=1`, `/privacy/`, and `/terms/`; its route reports and screenshots are in `.factory/evidence/polish-3-live/`.

`live-check.mjs` then opened fresh contexts for root, Demo, query Demo, Privacy, Terms, a real 404, the paid dialog, and a controlled offline Demo reload. It records all assertions in [live-check.json](evidence/polish-3-live/live-check.json): zero serious/critical Axe findings, valid title/lang/main/h1 checks, visible first-screen facts, six isolated sample rows, banner/reset/real-start controls, h1 focus after Back, round-3 wording, and offline sample reload.

The deployed root, Demo document, JavaScript, and CSS SHA-256 values match the current `dist/` output. No product finding remains open.
