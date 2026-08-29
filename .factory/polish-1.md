# Backfill Timecards — polish round 1

Date: 2026-08-29 UTC

Work order: `backfill-timecards-polish-1`

Reviewed inputs: `.factory/review-1.md`, `.factory/brief.json`, `.factory/design.md`, `.factory/claims.json`, `.factory/demo.md`, and the prior handoff. The review confirms that no earlier `review-*.md` or `polish-*.md` files existed. All 33 findings below are resolved.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo now omits the marketing hero and opens on its banner, summary, tools, and six populated work blocks. | Test: `@claim:demo-sandbox` asserts the first `.track` intersects the viewport. Screenshot: `.factory/evidence/polish-1-live-demo/cold-mobile-viewport.png`. Live: `/demo` first track starts at 751 px in a 390×844 viewport. |
| F-1-2 | Reduced desktop hero scale and padding so privacy, offline, and price facts all fit before 900 px. | Test: `keeps all first-screen facts visible at 1440 by 900`. Screenshot: `.factory/evidence/polish-1-live/screenshot-desktop.png`. Live: fact bottoms are 704, 732, and 760 px in `cold-qa.json`. |
| F-1-3 | Replaced “calendar clues” with “reviewed calendar events” and “Review calendar events” in the page and import dialog. | Test: `ships the plain first-read message and one-click demo action in the static shell`. Screenshot: live root desktop. Live: `/` and `/demo` cold copy checked. |
| F-1-4 | Standardized saved work as “weekly timecard” and reserved “weekly board” for the visual view. | Test: factory copy contract and complete `.factory/copy-audit.md`. Screenshot: live root desktop. Live: `/` and `/demo` checked. |
| F-1-5 | First-screen price fact now explains the result: saved patterns and previous-week copying cost $18 once. | Test: static-shell factory contract. Screenshot: live root desktop. Live: `/` third fact checked at 738 px. |
| F-1-6 | Toolbar action now reads “Reuse saved blocks — $18.” | Test: `@claim:billing-entitlement`. Screenshot: live root desktop. Live: `/` toolbar checked. |
| F-1-7 | Paid action now reads “Review reuse tools — $18.” | Test: static-shell factory contract. Screenshot: live root desktop. Live: `/` paid section checked. |
| F-1-8 | README now explains Manual, Calendar, and Pattern work-block marks in plain words. | Test: complete README section in `.factory/copy-audit.md`. Screenshot: not applicable to repository documentation. Live: corresponding source marks checked in `/demo`. |
| F-1-9 | README now says repeating events must have an end date and includes overnight events. | Test: `@claim:calendar-local`. Screenshot: demo screenshot. Live: calendar claim path rechecked through deployed build identity. |
| F-1-10 | README now says the app remembers the client for each project. | Test: `@claim:weekly-board` recalls Redwood Studio. Screenshot: demo screenshot. Live: populated project/client rows checked. |
| F-1-11 | README uses “web app” instead of unexplained “PWA.” | Test: `@claim:offline-reload`. Screenshot: live mobile demo. Live: `?demo=1` offline reload retained six rows. |
| F-1-12 | README describes demo storage as temporary storage limited to the demo tab; the exact key remains in `.factory/demo.md`. | Test: `@claim:demo-sandbox`. Screenshot: live demo banner. Live: banner and reset checked. |
| F-1-13 | README separates normal local records, demo records, and license settings before the developer API note. | Tests: `@claim:demo-sandbox` and `@claim:privacy-local`. Screenshot: demo banner. Live: same-origin request log was empty of external requests. |
| F-1-14 | Removed the long build-implementation claim and split test instructions into plain imperatives. | Test: README copy audit has no sentence over 22 words. Screenshot: not applicable. Live: deployed output matches 24 built files byte for byte. |
| F-1-15 | README now states exactly which six claims start at `/demo` and which three start in clean normal workspaces. | Test: all nine exact claim commands passed independently. Screenshot: not applicable. Live: demo and normal entry points checked. |
| F-1-16 | Billing claim now includes no embedded payment provider; its test asserts no iframe, card field, or off-origin script. | Test: `@claim:billing-entitlement`. Screenshot: live paid action. Live: normal runtime had no external request or console error. |
| F-1-17 | Removed the false “every visitor-facing claim” meta-claim. | Test: `declares each claim once and maps it to exactly one tagged browser test`. Screenshot: not applicable. Live: visitor copy crawl found no replacement meta-claim. |
| F-1-18 | Removed the unverified Node 20 compatibility statement; run instructions now begin with `npm ci`. | Test: clean clone installed and passed under Node 22.23.2. Screenshot: not applicable. Live: not applicable to runtime. |
| F-1-19 | Removed the unregistered implementation-stack marketing sentence. | Test: README copy audit. Screenshot: not applicable. Live: no visitor-facing stack claim. |
| F-1-20 | Replaced “no product backend” with the tested statement that normal work makes only same-origin requests. | Test: `@claim:privacy-local`. Screenshot: live root. Live: `cold-qa.json` recorded zero external requests. |
| F-1-21 | Removed the visitor-facing Playwright version assertion. The required version remains pinned in package metadata. | Test: clean `npm ci` and full suite. Screenshot: not applicable. Live: not applicable to runtime. |
| F-1-22 | Rewrote preview-server behavior as the imperative “Run npm test.” | Test: clean-clone `npm test`. Screenshot: not applicable. Live: not applicable to runtime. |
| F-1-23 | Removed the build-output marketing claim and retained direct deployment instructions. The build still emits a physical demo document. | Test: `serves route-specific demo metadata before JavaScript`. Screenshot: live demo. Live: raw `/demo` returned 200 with demo metadata. |
| F-1-24 | Replaced the scope claim with the instruction to serve `/sw.js` from the root. | Test: `@claim:offline-reload`. Screenshot: live mobile demo. Live: `?demo=1` offline reload passed. |
| F-1-25 | Removed the unregistered header/MIME assertion from README. | Test: deployed header check in `polish-1-live/headers.txt`. Screenshot: not applicable. Live: AVIF and manifest MIME, immutable asset cache, and security headers checked. |
| F-1-26 | Removed the unsupported provider sentence from the footer; provenance remains in `.factory/design.md`. | Test: footer factory contract. Screenshot: live root desktop. Live: footer now contains only product copy, legal links, external label, and build id. |
| F-1-27 | Demo and home transitions now use History API, update metadata, focus the new h1, and announce the route. | Test: `moves focus and announces app route changes through click, Back, and Forward`. Screenshot: live demo. Live: all three focus states passed in `cold-qa.json`. |
| F-1-28 | App, privacy, terms, and 404 now share the wordmark plus Demo/Privacy header and complete Privacy/Terms footer. | Tests: legal accessibility/navigation test and factory route contract. Screenshots: live root and demo. Live: every route had both footer links. |
| F-1-29 | Build now emits a real `/demo/index.html` with demo title, description, canonical, OG URL/title, and Twitter title before JavaScript. | Test: `serves route-specific demo metadata before JavaScript`. Screenshot: live demo. Live: raw metadata passed in `cold-qa.json`. |
| F-1-30 | Added `og:url` to 404 and shipped a distinct 180×180 original Apple touch icon. | Test: factory contract checks 404 metadata and PNG dimensions. Screenshot: live 404 is covered by route QA. Live: unknown route returned 404; icon hash matched the build. |
| F-1-31 | External links now read “Param Factory (external)” and “Sociobot (external).” | Test: footer touch-target and legal navigation tests. Screenshot: live root footer. Live: every crawled external link label checked. |
| F-1-32 | Legal and missing-page h1s now name the pages directly; removed “LOST TRACK.” | Test: live route/Axe crawl. Screenshot: route evidence. Live: exact h1s are recorded in `cold-qa.json`. |
| F-1-33 | Rebuilt the copy audit with split sentences, all static controls and accessible names, the full README, word counts, and terminology. | Test: factory copy contract plus `.factory/copy-audit.md` manual audit. Screenshot: live root. Live: rendered copy was re-extracted after deployment. |

## Claim results from a clean clone

Clean clone: `/tmp/backfill-polish1-clean.xQI6kL` at product commit `af42859`.

| Claim | Exact registered test | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --project=chromium --grep @claim:demo-sandbox` | PASS |
| `weekly-board` | `npm run test:e2e -- --project=chromium --grep @claim:weekly-board` | PASS |
| `calendar-local` | `npm run test:e2e -- --project=chromium --grep @claim:calendar-local` | PASS |
| `csv-export` | `npm run test:e2e -- --project=chromium --grep @claim:csv-export` | PASS |
| `local-archive` | `npm run test:e2e -- --project=chromium --grep @claim:local-archive` | PASS |
| `offline-reload` | `npm run test:e2e -- --project=chromium --grep @claim:offline-reload` | PASS |
| `pattern-deck` | `npm run test:e2e -- --project=chromium --grep @claim:pattern-deck` | PASS |
| `privacy-local` | `npm run test:e2e -- --project=chromium --grep @claim:privacy-local` | PASS |
| `billing-entitlement` | `npm run test:e2e -- --project=chromium --grep @claim:billing-entitlement` | PASS |

## Final live evidence

- Canonical deployment: <https://backfill-timecards.sociobot.in>
- Demo: <https://backfill-timecards.sociobot.in/demo>
- Live cold QA: `.factory/evidence/polish-1-live/cold-qa.json`
- Live initial mobile demo: `.factory/evidence/polish-1-live-demo/cold-mobile-viewport.png`
- Live route screenshots and verifier output: `.factory/evidence/polish-1-live/` and `.factory/evidence/polish-1-live-demo/`
- Deployment identity: `.factory/evidence/polish-1-live/deployment-hashes.txt` records 24/24 public files matching `dist/`.
- Live Lighthouse: 100 performance, accessibility, best practices, and SEO on desktop root and mobile Demo.

No finding remains open.
