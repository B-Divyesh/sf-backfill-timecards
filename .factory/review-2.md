# Adversarial first-read review 2 — Backfill Timecards

Date: 2026-08-29 UTC

Live URL: <https://backfill-timecards.sociobot.in>

Reviewed candidate: `b9c9991e86ad13bcf6591d0d239cd5be089236b1`

## Verdict: FAIL

The first read, one-click demo, sandbox isolation, live structure, accessibility baseline, and all 10 registered test commands work. This round still has 12 findings. Three are blocking claim-test defects: green tests do not assert the full calendar, complete-backup, or free-tier promises they are registered to prove. Nine copy findings remain in the README and interactive product. A PASS requires zero findings and no untested part of a claim.

## First read before scrolling

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Reconstructs a week of past freelance work from reviewed calendar events and memory, ready for invoicing. | Freelancers recording work after the fact. | **Try it with sample data**. | PASS |
| 1440×900 | The same. | The same. | **Try it with sample data**. | PASS |

The exact first-screen text was **“Reconstruct your freelance workweek”**, **“For freelancers logging work after the fact…”**, and **“Try it with sample data.”** All three facts were also visible without scrolling. On desktop their bottoms were 704, 732, and 760 CSS pixels in a 900-pixel viewport. On mobile they ended at 685, 713, and 762 pixels in an 844-pixel viewport.

## Blocking findings

### F-2-1 — The calendar claim test omits weekly end-date recurrence and selective import

- Exact claim: `.factory/claims.json` says **“including repeating events with an end date”**; README says **“Reviews daily or weekly repeating events that have an end date, plus overnight events.”**
- Test location: `tests/e2e/app.e2e.ts`, `@claim:calendar-local`.
- Evidence: the only recurrence in the tagged test is `RRULE:FREQ=DAILY;COUNT=2`. It does not use `FREQ=WEEKLY` or `UNTIL`. The other recurrence tests also use `FREQ=DAILY;COUNT=5`. No tagged test deselects an event and confirms it stays out of the board.
- Impact: the exact command passes, but it cannot prove weekly recurrence, end-date handling, or the README’s **“event selection”** promise. This leaves part of a registered visitor claim untested.
- Fix: use a fixture with `RRULE:FREQ=WEEKLY;UNTIL=...`, assert the exact dates and count in the review UI, deselect one event, import, and assert only selected work appears. Keep the overnight, description, billability, storage, and request assertions.

### F-2-2 — The “complete” JSON backup claim is only checked for one work block

- Exact claim: **“Exports, erases, and restores the complete local JSON backup.”**
- Test location: `tests/e2e/app.e2e.ts`, `@claim:local-archive`.
- Evidence: the tagged test exports, erases, restores, and then checks only that **“Plan the website sprint”** is visible. It does not inspect the exported mappings or patterns, nor prove either survives restoration.
- Impact: the command passes even if project-to-client mappings or saved patterns are missing from the backup. “Complete” is therefore not established.
- Fix: assert the downloaded JSON contains all sample entries, both mappings, and the saved pattern. After restore, assert client recall and open Pattern Deck to verify the restored pattern.

### F-2-3 — The free-tier part of the Pattern Deck claim is copy-tested, not behavior-tested

- Exact claim: **“The optional Pattern Deck saves reusable blocks and copies the previous week; core timecard tools stay free.”** The landing page says **“The weekly board, calendar import, CSV export, backups, and privacy controls remain free.”**
- Test location: `tests/e2e/app.e2e.ts`, `@claim:pattern-deck`.
- Evidence: after leaving Demo, the tagged test only asserts that the paid-section paragraph contains the free-tier sentence. It does not use those tools while Pattern Deck is locked.
- Impact: this violates the claim rule that the promised outcome must happen in the test; finding the promise in the DOM is not proof.
- Fix: in a clean, locked normal workspace, add a block, import a calendar event, export CSV and JSON, and open the erase control. Assert no license verification or entitlement gate is required for those actions.

## Other findings

### F-2-4 — “Installs as a web app” is not the claim that is registered

- Exact quote: README, **“Installs as a web app and works offline after the first visit.”**
- Evidence: `offline-reload` registers and tests offline reload plus install metadata. It asserts the manifest name, display mode, icons, and link; it does not install the app.
- Impact: the installation outcome is claim-like but has no matching observable test.
- Fix: add an installability test that exercises the browser’s install criteria and installed launch, or rewrite the sentence to the exact tested outcome: **“Includes web-app installation metadata and works offline after the first visit.”**

### F-2-5 — “Clear” is an unsupported marketing adjective

- Exact quote: README, **“It turns memory and reviewed calendar events into clear work blocks and an invoice-ready CSV.”**
- Impact: “clear” has no concrete meaning or test and adds no usable information.
- Fix: **“It turns memory and reviewed calendar events into work blocks and an invoice-ready CSV.”**

### F-2-6 — The same local-data concept is called an “archive” and a “JSON backup”

- Exact locations: landing page, **“Export, restore, or erase your archive whenever you want.”**; settings heading, **“Your local archive”**; README and toolbar, **“JSON backup.”**
- Impact: “archive” can mean the current browser data or the downloaded file, while “JSON backup” clearly names the file.
- Fix: use **“local data”** for records in the browser and **“JSON backup”** for the downloaded file. Rewrite the landing sentence as **“Export a JSON backup, restore one, or erase your local data.”** Rename the settings heading **“Your local data.”**

### F-2-7 — Week-navigation buttons do not name an action

- Exact accessible button names: **“Previous week”**, **“This week”**, and **“Next week.”**
- Impact: these are destinations or states, not result-naming verbs. The arrow-only visual controls depend on these names.
- Fix: use **“Show previous week”**, **“Show current week”**, and **“Show next week.”**

### F-2-8 — Cassette “track” language remains in instructions and empty states

- Exact live copy: empty demo days say **“No tracks”**; the add/edit dialog labels say **“NEW TRACK”** and **“CORRECT TRACK.”**
- Impact: the product otherwise uses “work block.” “Track” is a visual metaphor and an inconsistent term for the user’s record.
- Fix: use **“No work blocks”** and remove the decorative dialog labels, or replace them with **“WORK BLOCK DETAILS.”** Keep cassette language in the visual design only.

### F-2-9 — The visible “Pattern” row action does not name its result

- Exact location: every populated Demo work block, button **“Pattern.”**
- Impact: a first-time visitor cannot tell whether it applies, edits, or saves a pattern. Its accessible name, **“Pattern: save …”**, is also backwards.
- Fix: label it **“Save pattern”** and use an accessible name such as **“Save Plan the website sprint as a pattern.”**

### F-2-10 — The Pattern Deck dialog heading lacks its object

- Exact quote: **“Reuse, then correct.”**
- Impact: heard in a heading list, it does not identify what the section contains.
- Fix: **“Reuse saved work blocks.”**

### F-2-11 — The settings Pattern Deck button is vague

- Exact location: settings button **“See $18 Pattern Deck.”**
- Impact: “See” does not say whether the next step previews or buys.
- Fix: **“Review reuse tools — $18.”**

### F-2-12 — The saved-pattern button does not name its destination

- Exact location: Pattern Deck saved-pattern button **“Add.”**
- Impact: “Add” does not say what is added or where it goes.
- Fix: **“Add to this week.”**

## Landing-page copy audit

Counts treat hyphenated terms as one word. This includes headings, labels, actions, values, and accessible control names in the empty landing workspace. No sentence exceeds 22 words and no banned word appears. Flags identify findings above.

| # | Exact copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Skip to main content | 4 | — |
| 2 | Backfill Timecards home | 3 | — |
| 3 | Demo | 1 | — |
| 4 | Privacy | 1 | — |
| 5 | Local · saved here | 3 | — |
| 6 | Open data and license settings | 5 | — |
| 7 | Private weekly timecards | 3 | — |
| 8 | Reconstruct your freelance workweek | 4 | — |
| 9 | For freelancers logging work after the fact, turn reviewed calendar events and memory into a weekly timecard ready for invoicing. | 20 | — |
| 10 | Try it with sample data | 5 | — |
| 11 | Add your own work | 4 | — |
| 12 | The sample opens a separate weekly timecard without changing your work. | 11 | — |
| 13 | Weekly timecards stay on this device. | 6 | — |
| 14 | Works offline after the first visit. | 6 | — |
| 15 | Saved patterns and previous-week copying cost $18 once. | 8 | — |
| 16 | You choose every work block. | 5 | F-2-1 test must cover selective import |
| 17 | Weekly board | 2 | — |
| 18 | Aug 24–30, 2026 | 3 | — |
| 19 | Previous week | 2 | F-2-7 |
| 20 | This week | 2 | F-2-7 |
| 21 | Next week | 2 | F-2-7 |
| 22 | Total recorded | 2 | — |
| 23 | 0m | 1 | — |
| 24 | Billable | 1 | — |
| 25 | Entries | 1 | — |
| 26 | Clients | 1 | — |
| 27 | Add work block | 3 | — |
| 28 | Import calendar | 2 | — |
| 29 | Reuse saved blocks — $18 | 5 | — |
| 30 | Export CSV | 2 | — |
| 31 | Empty week | 2 | — |
| 32 | No work blocks yet | 4 | — |
| 33 | Start from one thing you remember, or bring in a calendar file and choose only the events you want. | 19 | — |
| 34 | Add the first block | 4 | — |
| 35 | Review a calendar file | 4 | — |
| 36 | How it works | 3 | — |
| 37 | Review your week in three steps | 6 | — |
| 38 | Review calendar events. | 3 | — |
| 39 | Import an .ics file and choose only useful events. | 9 | — |
| 40 | Record and correct work. | 4 | — |
| 41 | Add details, clients, and billable choices yourself. | 7 | — |
| 42 | Export the week. | 3 | — |
| 43 | Download an invoice-ready CSV when every row looks right. | 9 | — |
| 44 | Local data | 2 | — |
| 45 | Your week stays in this browser. | 6 | — |
| 46 | Calendar files are read here, not uploaded. | 7 | — |
| 47 | No account is required. | 4 | — |
| 48 | Export, restore, or erase your archive whenever you want. | 9 | F-2-6 |
| 49 | Manage local data | 3 | — |
| 50 | Optional one-time purchase | 3 | — |
| 51 | Reuse common work with Pattern Deck | 6 | — |
| 52 | Pattern Deck costs $18 once. | 5 | — |
| 53 | It saves reusable blocks and copies a previous week into matching days. | 11 | — |
| 54 | The weekly board, calendar import, CSV export, backups, and privacy controls remain free. | 13 | F-2-3 |
| 55 | Review reuse tools — $18 | 5 | — |
| 56 | Private weekly timecards for freelancers. | 5 | — |
| 57 | Terms | 1 | — |
| 58 | Param Factory (external) | 3 | — |
| 59 | Build r7 · 2026-08-29 | 3 | — |

Repeated `0m` and `Privacy` occurrences have the same counts shown above.

## README copy audit

Code blocks are excluded. Headings, prose sentences, list items, and link labels are included.

| # | Exact copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Backfill Timecards | 2 | — |
| 2 | Backfill Timecards is a private weekly timecard for freelancers who reconstruct work after the fact. | 15 | — |
| 3 | It turns memory and reviewed calendar events into clear work blocks and an invoice-ready CSV. | 15 | F-2-5 |
| 4 | Live product: backfill-timecards.sociobot.in | 3 | — |
| 5 | Try the isolated sample week: backfill-timecards.sociobot.in/demo | 7 | — |
| 6 | What it does | 3 | — |
| 7 | Adds, edits, copies, and deletes work blocks marked Manual, Calendar, or Pattern. | 12 | — |
| 8 | Imports .ics calendar files locally, with event selection, optional descriptions, and an explicit billable choice that defaults off. | 18 | F-2-1 test must cover selection |
| 9 | Reviews daily or weekly repeating events that have an end date, plus overnight events. | 14 | F-2-1 |
| 10 | Remembers the client for each project when you add more work. | 11 | — |
| 11 | Exports the selected week as invoice-ready CSV. | 7 | — |
| 12 | Exports, restores, and erases a complete local JSON backup. | 9 | F-2-2 |
| 13 | Installs as a web app and works offline after the first visit. | 12 | F-2-4 |
| 14 | Offers an optional $18 one-time Pattern Deck unlock for saved patterns and previous-week cloning. | 14 | — |
| 15 | Checkout and license verification use Sociobot billing; no payment provider is embedded. | 12 | — |
| 16 | Seven claim tests start at /demo. | 6 | — |
| 17 | The demo-isolation, normal-privacy, and billing tests start in clean normal workspaces as described in .factory/claims.json. | 16 | — |
| 18 | Demo records use temporary browser storage limited to that demo tab. | 11 | — |
| 19 | Reset demo restores the sample. | 5 | — |
| 20 | Start for real clears it before opening your weekly timecard. | 10 | — |
| 21 | See .factory/demo.md. | 3 | — |
| 22 | Outside demo mode, work blocks, client mappings, and patterns stay in this browser’s local database. | 15 | — |
| 23 | A purchased license token stays in this browser’s settings storage. | 10 | — |
| 24 | Normal timecard work makes only same-origin requests. | 7 | — |
| 25 | See /privacy and /terms. | 4 | — |
| 26 | Developer note: the normal database uses IndexedDB. | 7 | — |
| 27 | Demo records use sessionStorage, and license settings use localStorage. | 9 | — |
| 28 | Develop | 1 | — |
| 29 | Test and build | 3 | — |
| 30 | Run npm test; the Playwright configuration starts its preview servers. | 10 | — |
| 31 | Optional build-time variables | 3 | — |
| 32 | Use pilot-api.sociobot.in as VITE_BILLING_BASE for registered staging products. | 8 | — |
| 33 | Never commit license tokens or billing credentials. | 7 | — |
| 34 | Deploy | 1 | — |
| 35 | Deploy the contents of dist as a static site, with index.html at its root. | 14 | — |
| 36 | Serve /sw.js from the site root. | 6 | — |
| 37 | Keep /demo, /privacy, /terms, and /404.html as physical routes. | 9 | — |
| 38 | Product notes | 2 | — |
| 39 | Scope and research: .factory/brief.json | 5 | — |
| 40 | Visual system and generated-art provenance: .factory/design.md | 7 | — |
| 41 | Build verification and known gaps: .factory/handoff.md | 7 | — |
| 42 | Claim registry: .factory/claims.json | 4 | — |
| 43 | Demo sandbox: .factory/demo.md | 4 | — |
| 44 | License | 1 | — |
| 45 | MIT — see LICENSE. | 3 | — |

## Demo and sandbox verification

- One click from `/` reached `/demo` in both fresh viewports.
- The first Demo screen showed the banner, week summary, all four tools, and realistic sample work. The first mobile row began at 751 CSS pixels in an 844-pixel viewport; desktop showed four rows at least partly in 900 pixels.
- The persistent banner said **“Demo — sample data, nothing is saved”** and included **Reset demo** and **Start for real**.
- Demo contained six current-week blocks for Redwood Studio, Northstar Press, and admin work, plus prior-week data, mappings, and a pattern.
- Deleting a sample produced five rows. **Reset demo** restored six.
- A real record created before Demo was absent in Demo and returned unchanged after **Start for real**.
- Demo data used `demo:backfill-timecards` in sessionStorage; normal data used the `backfill-timecards` IndexedDB database. Leaving Demo cleared the session keys.
- The live request log for the normal and Demo flows contained only `https://backfill-timecards.sociobot.in`.
- The clean `@claim:offline-reload` test confirmed a controlled offline reload with the sample board.

Demo presentation and isolation pass.

## Claims audit

Clean clone: `/tmp/backfill-review2-clean.9VeoE2/repo` at `b9c9991e86ad13bcf6591d0d239cd5be089236b1`. Every exact `test` command in `.factory/claims.json` was run separately.

| Claim id | Command result | Coverage result |
| --- | --- | --- |
| `demo-sandbox` | PASS | PASS — real/demo isolation, reset, and tab-scoped storage checked |
| `demo-exit-cleanup` | PASS | PASS — four documented exits checked |
| `weekly-board` | PASS | PASS — add, edit, copy, delete, undo, and client recall checked |
| `calendar-local` | PASS | **INCOMPLETE — F-2-1** |
| `csv-export` | PASS | PASS — filename, header, row count, and sample fields checked |
| `local-archive` | PASS | **INCOMPLETE — F-2-2** |
| `offline-reload` | PASS | PASS for offline reload and manifest metadata; README install wording is F-2-4 |
| `pattern-deck` | PASS | **INCOMPLETE — F-2-3** |
| `privacy-local` | PASS | PASS — normal IndexedDB and same-origin request boundary checked |
| `billing-entitlement` | PASS | PASS — price copy, checkout URL, provider embed absence, verification gate, and one-day cache boundary checked |

The command suite is green, but the three incomplete assertions mean the associated claim tests do not meet the claim contract. The README installation outcome is an unlisted extension of the narrower metadata claim.

## Earlier-finding verification

`.factory/review-1.md`, `.factory/polish-1.md`, and the prior `.factory/handoff.md` were read in full. The live HTML, JS, CSS, legal pages, and 404 byte-match the clean candidate build. No earlier finding ID is reopened; new findings above concern additional copy locations and claim-test depth.

| Earlier id | Status | Independent live and code confirmation |
| --- | --- | --- |
| F-1-1 | FIXED | Demo omits the hero; first sample row begins at 751px on 390×844. |
| F-1-2 | FIXED | All three desktop facts end by 760px in a 900px viewport. |
| F-1-3 | FIXED | “Calendar clues” is absent; “calendar events” is used. |
| F-1-4 | FIXED | Landing and README distinguish weekly timecard from weekly board. |
| F-1-5 | FIXED | The first-screen price fact explains saved patterns and previous-week copying. |
| F-1-6 | FIXED | Toolbar reads “Reuse saved blocks — $18.” |
| F-1-7 | FIXED | Paid-section action reads “Review reuse tools — $18.” F-2-11 is a separate settings location. |
| F-1-8 | FIXED | README names Manual, Calendar, and Pattern marks. |
| F-1-9 | FIXED | README uses plain recurrence wording. Test depth is separately F-2-1. |
| F-1-10 | FIXED | README says the client is remembered for each project. |
| F-1-11 | FIXED | “PWA” is absent from visitor copy. |
| F-1-12 | FIXED | README explains tab-limited temporary demo storage. |
| F-1-13 | FIXED | README separates normal, demo, and license storage before the developer note. |
| F-1-14 | FIXED | No audited landing or README sentence exceeds 22 words. |
| F-1-15 | FIXED | README correctly says seven tests start at `/demo`; the remaining three start elsewhere. |
| F-1-16 | FIXED | Billing claim and test check the absence of payment frames, card fields, and off-origin scripts. |
| F-1-17 | FIXED | The false “every visitor-facing claim” sentence is absent. |
| F-1-18 | FIXED | The unverified Node 20 requirement is absent. |
| F-1-19 | FIXED | The visitor-facing stack assertion is absent. |
| F-1-20 | FIXED | README uses the tested same-origin request wording. |
| F-1-21 | FIXED | The visitor-facing Playwright version assertion is absent; package metadata pins 1.58.2. |
| F-1-22 | FIXED | Preview behavior is written as a run instruction. |
| F-1-23 | FIXED | README keeps deployment instructions without the unregistered build-output claim. |
| F-1-24 | FIXED | README gives the `/sw.js` deployment instruction without the old scope assertion. |
| F-1-25 | FIXED | The unregistered deployment-header assertion is absent. |
| F-1-26 | FIXED | The unsupported Azure provenance footer sentence is absent. |
| F-1-27 | FIXED | Click, Back, and Forward focus the h1 and update the polite route announcement. |
| F-1-28 | FIXED | Root, Demo, Privacy, Terms, and 404 share wordmark/nav and complete legal footer links. |
| F-1-29 | FIXED | Raw `/demo/` HTML has Demo title, description, canonical, and matching OG/Twitter metadata. |
| F-1-30 | FIXED | 404 has `og:url`; Apple icon is 180×180. |
| F-1-31 | FIXED | External product links identify themselves as external. |
| F-1-32 | FIXED | Privacy, Terms, and 404 h1s name their pages. |
| F-1-33 | FIXED | The committed audit covers landing and README copy with split sentences and control labels. |

## Structure, accessibility, links, and visual identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and an unknown route have route-specific titles, one h1, one main, `lang=en`, descriptions, canonicals, OG/Twitter metadata, SVG favicon, and 180px Apple icon.
- The unknown route returned HTTP 404 with the designed paper/cassette identity and a way home.
- The sitemap lists all four real routes. All five discovered navigation destinations returned 200, including the labelled external Param Factory link.
- Click, Back, and Forward restored the correct route, focused its h1, and populated the polite route announcement.
- `verify-url.sh` passed live root and Demo with no console or page errors. Axe reported zero serious or critical violations on all five checked routes. The 390px pages had no horizontal overflow.
- The clean full suite passed 57 Playwright tests with one expected project skip, plus 12 unit/contract tests. Typecheck, lint, and build passed. Initial JS is 48.65 kB raw and 14.61 kB gzip.
- The warm paper, cassette insert, blue ink, coral correction, monospace data, offset shadows, and original still-life art form a distinct product identity rather than a generic SaaS template.

No structure, routing, accessibility, dead-link, or visual-identity finding remains.

## Missed leverage

No finding. The brief implies calendar import, pattern reuse, client recall, backup, and CSV export; all are present. Runtime AI would add confidentiality and network costs without improving the explicit-review job. Cross-device sync would conflict with the current local-first privacy contract unless introduced as a separate, explicit feature.

## What would make this perfect

Strengthen the three tagged claim tests so they prove every word of their registered claims. Remove or test the installation outcome. Then clear the nine copy flags: delete the marketing adjective, standardize local-data terms, replace track metaphors, and give every control and heading an explicit object or result. Rerun this entire review from fresh mobile and desktop contexts. A perfect result has zero findings, not merely green commands.
