# Backfill Timecards — polish round 2

Date: 2026-08-29 UTC
Work order: `backfill-timecards-polish-2`

This repair read `.factory/review-1.md`, `.factory/polish-1.md`, and `.factory/review-2.md` in full. All findings are acceptance work. The evidence named below is from the committed build and the post-deploy check recorded in the handoff.

For visitor UI findings, the live check is `https://backfill-timecards.sociobot.in/` or `https://backfill-timecards.sociobot.in/demo`, with screenshots at `.factory/evidence/polish-2-live/root/screenshot-desktop.png`, `.factory/evidence/polish-2-live/root/screenshot-mobile.png`, `.factory/evidence/polish-2-live/demo/screenshot-desktop.png`, and `.factory/evidence/polish-2-live/demo/screenshot-mobile.png`. Legal and 404 checks use the live route crawl summarized in `.factory/evidence/polish-2-live/summary.json`. Repository-document rows correctly have no screenshot; their evidence is the named source contract or claim test.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo opens directly on its populated weekly board. | `@claim:demo-sandbox`; `/demo` mobile screenshot. |
| F-1-2 | Three first-screen facts fit at 1440×900. | `keeps all first-screen facts visible at 1440 by 900`; root screenshot. |
| F-1-3 | Calendar wording uses “calendar events.” | static-shell contract; root copy audit. |
| F-1-4 | Saved work is a weekly timecard; the view is a weekly board. | copy audit; root check. |
| F-1-5 | Price fact explains saved patterns and previous-week copying. | static-shell contract; root check. |
| F-1-6 | Toolbar says “Reuse saved blocks — $18.” | `@claim:billing-entitlement`; `/demo`. |
| F-1-7 | Paid action says “Review reuse tools — $18.” | static-shell contract; root check. |
| F-1-8 | README names Manual, Calendar, and Pattern work blocks. | README audit; `@claim:weekly-board`. |
| F-1-9 | README explains bounded daily/weekly recurrence and overnight events. | `@claim:calendar-local`. |
| F-1-10 | README explains remembered clients in plain words. | `@claim:weekly-board`. |
| F-1-11 | README says web app, not unexplained PWA. | `@claim:offline-reload`. |
| F-1-12 | README explains tab-limited demo storage plainly. | `@claim:demo-sandbox`; `.factory/demo.md`. |
| F-1-13 | README distinguishes real local data, demo data, and license settings. | `@claim:privacy-local`; `@claim:demo-sandbox`. |
| F-1-14 | README build wording is short and removes unsupported implementation promises. | copy audit. |
| F-1-15 | README accurately distinguishes demo and normal claim entry points. | all 10 registered claim commands. |
| F-1-16 | Billing claim checks no embedded provider frames, fields, or scripts. | `@claim:billing-entitlement`. |
| F-1-17 | Unsupported meta-claim was removed. | factory claim contract; copy audit. |
| F-1-18 | Unverified Node-version promise was removed. | README audit; clean `npm ci`. |
| F-1-19 | Unregistered stack marketing statement was removed. | README audit. |
| F-1-20 | README uses the tested same-origin normal-work claim. | `@claim:privacy-local`. |
| F-1-21 | Visitor-facing Playwright-version claim was removed. | package lock and clean suite. |
| F-1-22 | Preview-server statement is an instruction, not a promise. | clean `npm test`. |
| F-1-23 | README gives deployment instructions without a build-output promise. | route-metadata browser test; built `dist/demo/index.html`. |
| F-1-24 | README gives root service-worker deployment instruction. | `@claim:offline-reload`. |
| F-1-25 | Unsupported deployment-header marketing was removed. | static config inspection; live headers check. |
| F-1-26 | Unsupported artwork-provider footer claim was removed. | footer contract; design provenance record. |
| F-1-27 | App navigation updates title, focus, and route announcement. | Back/Forward browser test. |
| F-1-28 | App, legal, and 404 routes share header/footer links. | legal navigation/Axe test; live route crawl. |
| F-1-29 | Physical demo HTML has demo metadata before JavaScript. | route-metadata browser test; `/demo` raw response. |
| F-1-30 | 404 has social URL and an original 180px touch icon. | factory route contract; `/missing` check. |
| F-1-31 | External links are labeled external. | footer touch-target/navigation test. |
| F-1-32 | Legal and 404 h1s name their pages. | route Axe crawl. |
| F-1-33 | Copy audit covers page controls, README, counts, and terminology. | `.factory/copy-audit.md`. |
| F-2-1 | The calendar claim now imports a weekly `UNTIL` recurrence, deselects one occurrence, verifies dates, keeps an overnight block, and confirms local-only handling. | `@claim:calendar-local` on Chromium desktop and mobile. |
| F-2-2 | The backup claim now inspects all nine sample entries, both client mappings, and the saved pattern; after restore it proves client recall and opens the restored pattern. | `@claim:local-archive` on Chromium desktop and mobile. |
| F-2-3 | The Pattern Deck claim now uses add, calendar import, CSV export, JSON backup, and erase controls in a locked normal workspace. | `@claim:pattern-deck` on Chromium desktop and mobile. |
| F-2-4 | README now promises tested installation metadata, not browser installation. | README audit; `@claim:offline-reload`. |
| F-2-5 | Removed unsupported “clear” from README. | README audit. |
| F-2-6 | Browser records are “local data”; downloaded files are “JSON backups.” | root and settings browser checks. |
| F-2-7 | Week navigation now says Show previous/current/next week. | initial-shell and interactive browser checks. |
| F-2-8 | Visible instructions and empty days now say work blocks; dialogs use WORK BLOCK DETAILS. | `/demo`, add/edit dialog checks. |
| F-2-9 | Row action now says Save pattern with a result-first accessible name. | `@claim:pattern-deck`. |
| F-2-10 | Pattern dialog h2 is “Reuse saved work blocks.” | `@claim:local-archive`; `/demo`. |
| F-2-11 | Settings action now says “Review reuse tools — $18.” | `@claim:pattern-deck`. |
| F-2-12 | Saved pattern action now says “Add to this week.” | `@claim:local-archive`; `/demo`. |

## Verification

- Clean clone: every command in `.factory/claims.json` was run separately, plus `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Browser suite: 57 passed and 1 desktop-only viewport assertion was intentionally skipped in the mobile project.
- Build: `dist/` exists; initial JavaScript is 14.61 kB gzip and CSS is 5.00 kB gzip.
- Live evidence and cold recheck are recorded in `.factory/handoff.md`.
