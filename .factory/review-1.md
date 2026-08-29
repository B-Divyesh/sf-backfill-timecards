# Adversarial first-read review 1 — Backfill Timecards

Date: 2026-08-29 UTC

Live URL: <https://backfill-timecards.sociobot.in>

Candidate: `ac1588c74dd5f8830b12332df4bbbc5bfeeba1c1`

## Verdict: FAIL

The cold landing screen explains the job, audience, and first action on phone and desktop. The product, sandbox isolation, offline behavior, accessibility baseline, and all nine registered claim tests work. The review still fails because the first screen after entering Demo does not show any sample work. There are also non-blocking copy, claim-registry, navigation, metadata, and consistency findings. A PASS requires zero findings.

## First read before scrolling

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Reconstruct a week of freelance work from memory and calendar information, then prepare it for invoicing. | Freelancers logging work after the fact. | **Try it with sample data**. | Clear from the first screen. |
| 1440×900 | Same answer. | Same audience. | **Try it with sample data**. | Clear from the first screen. The third required fact is effectively below the fold; see F-1-2. |

The exact text that supplied those answers was **“Reconstruct your freelance workweek”**, **“For freelancers logging work after the fact…”**, and **“Try it with sample data.”** This part is not blocking.

## Blocking finding

### F-1-1 — Demo opens above the sample product

- Location: live `/demo`, first 390×844 screen after one click.
- Exact text shown instead of the sample board: **“Reconstruct your freelance workweek”** and **“Six sample blocks and the paid Pattern Deck preview are ready to use.”**
- Evidence: the page contained six `.track` records, but zero intersected either first viewport. The workspace began at `1141.7px` on 390×844 and `1087.7px` on 1440×900.
- Impact: the visitor is told that sample data exists but does not see the product being used. This fails the mandatory one-click demo rule.
- Fix: make `/demo` lead with the persistent demo banner and the populated weekly board. Remove or collapse the marketing hero in demo mode. At least the week summary, primary tools, and realistic sample rows must be visible without scrolling at 390px and desktop widths. Add a test that asserts at least one `.track` intersects the initial viewport after the landing CTA is clicked.

## Non-blocking findings

### F-1-2 — The desktop first screen does not show all three required facts

- Location: `/` at 1440×900.
- Exact text below the effective fold: **“The core workspace is free. Pattern Deck costs $18 once.”** Its box starts at `897px` and is almost entirely clipped by the `900px` viewport.
- Impact: the mandatory privacy/offline/price fact set is incomplete before scrolling on a common desktop viewport.
- Fix: reduce the desktop hero type or vertical padding so all three facts are fully visible. Add a 1440×900 viewport assertion for each fact.

### F-1-3 — “Calendar clues” is metaphorical and inconsistent

- Locations: landing lead and How it works.
- Quotes: **“turn calendar clues and memory…”** and **“Gather calendar clues.”** Other copy calls the same material “calendar events” and a “calendar file.”
- Impact: “clues” does not say what the user reviews or imports.
- Fix: use **“turn reviewed calendar events and memory into…”** and **“Review calendar events.”**

### F-1-4 — The main work surface has four names

- Locations: landing and README.
- Quotes: **“separate timecard,” “core workspace,” “weekly board,”** and **“seven-day board.”**
- Impact: a first-time visitor cannot tell whether these are different parts or the same product surface.
- Fix: choose **“weekly timecard”** for the saved work and **“weekly board”** only for the visual view. Rewrite “core workspace” and “seven-day board” accordingly.

### F-1-5 — The first-screen price fact names an unexplained feature

- Location: landing hero.
- Quote: **“Pattern Deck costs $18 once.”**
- Impact: the visitor sees a price before learning what Pattern Deck does.
- Fix: **“Saved patterns and previous-week copying cost $18 once.”**

### F-1-6 — A toolbar button has no result-naming verb

- Location: weekly-board toolbar.
- Quote: **“Pattern deck $18.”**
- Impact: it names a feature and price, not the result of pressing it.
- Fix: **“Reuse saved blocks — $18.”**

### F-1-7 — The paid-section action is vague

- Location: paid section.
- Quote: **“See the $18 Pattern Deck.”**
- Impact: “See” does not say whether the visitor will buy, preview, or reuse work.
- Fix: **“Review reuse tools — $18.”**

### F-1-8 — “Source-labelled” is README jargon

- Location: README, What it does.
- Quote: **“source-labelled work blocks.”**
- Impact: the label values and benefit are hidden.
- Fix: **“Adds, edits, copies, and deletes work blocks marked Manual, Calendar, or Pattern.”**

### F-1-9 — “Bounded” is README jargon

- Location: README, What it does.
- Quote: **“Reviews bounded daily or weekly recurring events…”**
- Impact: “bounded” is parser terminology rather than user language.
- Fix: **“Reviews daily or weekly repeating events that have an end date, plus overnight events.”**

### F-1-10 — “Project→client mappings” is README jargon

- Location: README, What it does.
- Quote: **“Remembers project→client mappings to speed up repeat entry.”**
- Impact: the arrow notation describes implementation rather than the result.
- Fix: **“Remembers the client for each project when you add more work.”**

### F-1-11 — “PWA” is unexplained README jargon

- Location: README, What it does.
- Quote: **“Installs as a PWA…”**
- Impact: a non-developer does not need the acronym.
- Fix: **“Installs as a web app and works offline after the first visit.”**

### F-1-12 — The demo-storage explanation is needlessly technical

- Location: README.
- Quote: **“tab-scoped `demo:backfill-timecards` session storage.”**
- Impact: this obscures the useful fact that demo records disappear with the tab.
- Fix: **“temporary browser storage limited to that demo tab.”** Keep the exact key in `.factory/demo.md`.

### F-1-13 — The README uses storage API names before stating their scope precisely

- Location: README.
- Quotes: **“All timecard data lives in IndexedDB on the current device.”** and **“A purchased license token is kept in localStorage.”**
- Impact: “All” incorrectly includes demo data, which uses session storage, and both API names are unexplained.
- Fix: **“Outside demo mode, work blocks, client mappings, and patterns stay in this browser’s local database. A purchased license token stays in this browser’s settings storage.”** Put `IndexedDB` and `localStorage` in a developer note.

### F-1-14 — A README sentence exceeds 22 words and contains build jargon

- Location: README, Test and build.
- Quote (23 words): **“The production build uses hashed CSS and JavaScript assets, and the service worker precaches the matching app shell and assets for offline reloads.”**
- Impact: “hashed,” “precaches,” and “app shell” make a long sentence harder to scan. The implementation assertion is also absent from `claims.json`.
- Fix: **“The build gives CSS and JavaScript versioned file names. The service worker saves those files for offline reloads.”** Register and test the offline asset claim, or remove it.

### F-1-15 — The README misstates where claim tests begin

- Location: README.
- Quote: **“All claim tests start at `/demo`…”**
- Evidence: `demo-sandbox` begins at `/`; `privacy-local` begins at `/`; `billing-entitlement` begins at `/?license=…`. Six of nine tests begin directly at `/demo`.
- Impact: a verifier following the README gets the wrong sandbox model.
- Fix: **“Six claim tests start at `/demo`. The demo-isolation, normal-privacy, and billing tests start in clean normal workspaces as described in `claims.json`.”**

### F-1-16 — “No payment provider is embedded” is an unlisted claim

- Location: README.
- Quote: **“no payment provider is embedded.”**
- Impact: `billing-entitlement` checks the Sociobot checkout URL but does not assert the absence of provider scripts, frames, or payment fields after opening the unlock dialog.
- Fix: add this wording to the billing claim and assert no provider origin, iframe, or card field is loaded, or delete the sentence.

### F-1-17 — “Every visitor-facing claim has a browser test” is unlisted and false in this round

- Location: README.
- Quote: **“Every visitor-facing claim has a browser test in `.factory/claims.json`.”**
- Impact: the sentence is itself unlisted, and F-1-16 plus F-1-18–F-1-26 identify claims not represented in the registry.
- Fix: delete the meta-claim until an automated copy-to-registry check proves it.

### F-1-18 — The Node.js compatibility statement is unlisted and untested

- Location: README.
- Quote: **“Requirements: Node.js 20+ and npm.”**
- Evidence: this review ran under Node `22.23.2`; `package.json` has no `engines` declaration or Node 20 test.
- Fix: add and test an `engines.node` contract under Node 20, or state the version actually verified.

### F-1-19 — The implementation-stack statement is unlisted

- Location: README.
- Quote: **“The app uses Vite and vanilla TypeScript.”**
- Fix: either register a source/build contract for this assertion or move it to an explicitly non-claim architecture note generated from `package.json`.

### F-1-20 — “No product backend” is not covered by the privacy claim

- Location: README.
- Quote: **“It has no product backend…”**
- Evidence: `privacy-local` proves no off-origin request in its normal workflow; it does not prove the architectural absence of a backend. The rest of the sentence about external font/script requests is covered.
- Fix: replace it with the tested wording **“Normal timecard work makes only same-origin requests,”** or add a build/deployment contract.

### F-1-21 — The Playwright version assertion is unlisted

- Location: README.
- Quote: **“Playwright is pinned to 1.58.2.”**
- Fix: register a package-contract test or change this to an instruction generated from `package.json`.

### F-1-22 — Automatic preview-server behavior is unlisted

- Location: README.
- Quote: **“The test suite starts production preview servers automatically.”**
- Fix: register and tag a configuration contract, or rewrite as the imperative **“Run `npm test`; the Playwright configuration starts its preview servers.”**

### F-1-23 — The physical demo/404 build assertion is unlisted

- Location: README, Deploy.
- Quote: **“The build also emits a physical `/demo/index.html`, so Static Web Apps can return the designed 404 for unknown routes.”**
- Evidence: an untagged unit contract checks the Vite source string, but there is no `claims.json` entry that builds and inspects the output.
- Fix: add a tagged build-output claim that asserts `dist/demo/index.html` and the unknown-route 404, or remove the assertion from README.

### F-1-24 — The service-worker scope assertion is unlisted

- Location: README, Deploy.
- Quote: **“The service worker is scoped to `/`…”**
- Fix: add the scope assertion to `offline-reload`, or rewrite the sentence solely as a deployment instruction: **“Serve `/sw.js` from the site root.”**

### F-1-25 — The deployment-header assertion is unlisted

- Location: README, Deploy.
- Quote: **“`staticwebapp.config.json` carries the immutable asset caching, correct AVIF/manifest MIME types, and browser response headers…”**
- Fix: add a tagged deployed-header/MIME claim or replace this with exact configuration instructions without claiming verification.

### F-1-26 — The artwork provenance sentence is unlisted

- Location: live footer.
- Quote: **“Editorial artwork generated for this product with Azure AI Foundry.”**
- Evidence: provenance is documented in `.factory/design.md`, but no `claims.json` test connects the shipped asset to that record.
- Fix: add a repository provenance contract that checks the prompt metadata and shipped asset hash, or link the footer disclosure to the provenance record and remove the unsupported provider assertion.

### F-1-27 — Route changes do not move focus or use the required navigation model

- Location: `/` → `/demo` and browser Back.
- Evidence: `src/app.ts` uses `location.assign("/demo")`; after navigation and after Back, `document.activeElement` was `BODY`, not the new `h1`. There is no route-change live announcement.
- Impact: keyboard and screen-reader users receive no route-change focus cue.
- Fix: use real route links or History API navigation, set each route title, focus a `tabindex="-1"` h1 after navigation, and announce it in an `aria-live="polite"` region. Add click, Back, and Forward tests.

### F-1-28 — Header and footer navigation is inconsistent across routes

- Locations: `/`, `/demo`, `/privacy/`, `/terms/`.
- Evidence: the app header is **“Backfill Timecards / Local · saved here / menu”** with no Demo or Privacy navigation. Legal headers become **“← Backfill Timecards / LOCAL-FIRST”** or **“PLAIN TERMS.”** The Privacy footer omits Privacy; the Terms footer omits Terms.
- Fix: use one shared header pattern with the wordmark plus Demo and Privacy links. Include both Privacy and Terms in every footer, including their own routes.

### F-1-29 — `/demo` serves homepage metadata before JavaScript

- Location: raw response for live `/demo`.
- Quotes: `<title>Backfill Timecards — reconstruct your workweek</title>` and canonical/`og:url` pointing to `/`.
- Evidence: hydration changes the browser title, canonical, and `og:url`, but leaves `og:title` and `twitter:title` as the homepage title. Link unfurlers commonly read only the response HTML.
- Fix: emit a real demo document with **“Demo — Backfill Timecards”**, a demo description, `/demo` canonical/OG URL, and matching OG/Twitter titles before JavaScript runs.

### F-1-30 — 404 social metadata and the Apple touch icon are incomplete

- Locations: live unknown route and all document heads.
- Evidence: the designed 404 has no `og:url`. `apple-touch-icon` points to a 192×192 PNG, while the site contract requires a 180px icon.
- Fix: add the 404 OG URL and ship/reference an original 180×180 Apple touch icon.

### F-1-31 — External links are not identified as external

- Locations: all **“Built by Param Factory”** and **“Sociobot”** links.
- Impact: the labels do not warn that navigation leaves the product, as required by the route/link contract.
- Fix: label them **“Param Factory (external)”** and **“Sociobot (external)”**, with equivalent accessible text if the visual treatment uses an icon.

### F-1-32 — Legal and 404 h1s use mood or metaphor instead of naming the page

- Locations and quotes: Privacy **“Your work stays yours.”**; Terms **“Use hindsight honestly.”**; 404 **“This page is not on the timecard.”** with **“LOST TRACK.”**
- Impact: these headings do not identify their sections when heard out of context.
- Fix: **“How Backfill Timecards stores your data,” “Terms for using Backfill Timecards,”** and **“Page not found.”** Remove “LOST TRACK.”

### F-1-33 — The committed copy audit is not complete

- Location: `.factory/copy-audit.md`.
- Quote: **“Headings, buttons, labels, and complete sentences on the landing page are included.”**
- Evidence: it omits the accessible settings label, week controls, summary labels, toolbar buttons, empty-state buttons, and the entire README. It also combines multiple sentences into one row.
- Fix: regenerate the audit from rendered copy and README, split sentences individually, and include the flag/rewrite references below.

## Landing-page copy audit

Counts treat hyphenated terms as one word and exclude decorative symbols. No landing sentence exceeds 22 words and no banned marketing word appears. “Flag” points to the finding and rewrite above.

| # | Copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Skip to main content | 4 | — |
| 2 | Backfill Timecards home | 3 | — |
| 3 | Open data and license settings | 5 | — |
| 4 | Local · saved here | 3 | — |
| 5 | Private weekly timecards | 3 | — |
| 6 | Reconstruct your freelance workweek | 4 | — |
| 7 | For freelancers logging work after the fact, turn calendar clues and memory into a timecard ready for invoicing. | 18 | F-1-3, F-1-4 |
| 8 | Try it with sample data | 5 | — |
| 9 | Add your own work | 4 | — |
| 10 | The sample opens a separate timecard without changing your work. | 10 | F-1-4 |
| 11 | Timecards stay on this device. | 5 | — |
| 12 | Works offline after the first visit. | 6 | — |
| 13 | The core workspace is free. | 5 | F-1-4 |
| 14 | Pattern Deck costs $18 once. | 5 | F-1-5 |
| 15 | You choose every work block. | 5 | — |
| 16 | Weekly board | 2 | F-1-4 |
| 17 | Aug 24–30, 2026 | 3 | — |
| 18 | Previous week | 2 | — |
| 19 | This week | 2 | — |
| 20 | Next week | 2 | — |
| 21 | Total recorded | 2 | — |
| 22 | 0m | 1 | — |
| 23 | Billable | 1 | — |
| 24 | 0m | 1 | — |
| 25 | Entries | 1 | — |
| 26 | 0 | 1 | — |
| 27 | Clients | 1 | — |
| 28 | 0 | 1 | — |
| 29 | Add work block | 3 | — |
| 30 | Import calendar | 2 | — |
| 31 | Pattern deck $18 | 3 | F-1-6 |
| 32 | Export CSV | 2 | — |
| 33 | Empty week | 2 | — |
| 34 | No work blocks yet | 4 | — |
| 35 | Start from one thing you remember, or bring in a calendar file and choose only the events you want. | 19 | — |
| 36 | Add the first block | 4 | — |
| 37 | Review a calendar file | 4 | — |
| 38 | How it works | 3 | — |
| 39 | Review your week in three steps | 6 | — |
| 40 | Gather calendar clues. | 3 | F-1-3 |
| 41 | Import an .ics file and choose only useful events. | 9 | — |
| 42 | Record and correct work. | 4 | — |
| 43 | Add details, clients, and billable choices yourself. | 7 | — |
| 44 | Export the week. | 3 | — |
| 45 | Download an invoice-ready CSV when every row looks right. | 9 | — |
| 46 | Local data | 2 | — |
| 47 | Your week stays in this browser. | 6 | — |
| 48 | Calendar files are read here, not uploaded. | 7 | — |
| 49 | No account is required. | 4 | — |
| 50 | Export, restore, or erase your archive whenever you want. | 9 | — |
| 51 | Manage local data | 3 | — |
| 52 | Optional one-time purchase | 3 | — |
| 53 | Reuse common work with Pattern Deck | 6 | — |
| 54 | Pattern Deck costs $18 once. | 5 | — |
| 55 | It saves reusable blocks and copies a previous week into matching days. | 12 | — |
| 56 | The weekly board, calendar import, CSV export, backups, and privacy controls remain free. | 13 | F-1-4 |
| 57 | See the $18 Pattern Deck | 5 | F-1-7 |
| 58 | Private weekly timecards for freelancers. | 5 | — |
| 59 | Privacy | 1 | — |
| 60 | Terms | 1 | — |
| 61 | Built by Param Factory | 4 | F-1-31 |
| 62 | Editorial artwork generated for this product with Azure AI Foundry. | 10 | F-1-26 |
| 63 | Build r5 · 2026-08-29 | 3 | — |

## README copy audit

Code blocks are excluded; headings, link labels, prose sentences, and list items are included.

| # | Copy | Words | Flag |
| ---: | --- | ---: | --- |
| 1 | Backfill Timecards | 2 | — |
| 2 | Backfill Timecards is a private weekly board for freelancers who reconstruct work after the fact. | 15 | F-1-4 |
| 3 | It turns memory and reviewed calendar events into clear work blocks and an invoice-ready CSV. | 15 | — |
| 4 | Live product: https://backfill-timecards.sociobot.in | 3 | — |
| 5 | Try the isolated sample week: https://backfill-timecards.sociobot.in/demo | 6 | — |
| 6 | What it does | 3 | — |
| 7 | Adds, edits, copies, and deletes source-labelled work blocks across a seven-day board. | 12 | F-1-4, F-1-8 |
| 8 | Imports .ics calendar files locally, with event selection, optional descriptions, and an explicit billable choice that defaults off. | 18 | — |
| 9 | Reviews bounded daily or weekly recurring events and overnight events before import. | 12 | F-1-9 |
| 10 | Remembers project→client mappings to speed up repeat entry. | 8 | F-1-10 |
| 11 | Exports the selected week as invoice-ready CSV. | 7 | — |
| 12 | Exports, restores, and erases a complete local JSON archive. | 9 | — |
| 13 | Installs as a PWA and works offline after the first visit. | 11 | F-1-11 |
| 14 | Offers an optional $18 one-time Pattern Deck unlock for saved patterns and previous-week cloning. | 14 | — |
| 15 | Checkout and license verification use Sociobot billing; no payment provider is embedded. | 12 | F-1-16 |
| 16 | Every visitor-facing claim has a browser test in .factory/claims.json. | 9 | F-1-17 |
| 17 | All claim tests start at /demo, where realistic sample records use tab-scoped demo:backfill-timecards session storage. | 15 | F-1-12, F-1-15 |
| 18 | Reset demo restores the sample, Start for real clears it before opening the normal workspace, and closing the demo tab discards it. | 22 | F-1-4 |
| 19 | See .factory/demo.md. | 2 | — |
| 20 | All timecard data lives in IndexedDB on the current device. | 10 | F-1-13 |
| 21 | A purchased license token is kept in localStorage. | 8 | F-1-13 |
| 22 | See /privacy and /terms. | 4 | — |
| 23 | Develop | 1 | — |
| 24 | Requirements: Node.js 20+ and npm. | 5 | F-1-18 |
| 25 | The app uses Vite and vanilla TypeScript. | 7 | F-1-19 |
| 26 | It has no product backend, external fonts, or third-party runtime UI dependencies. | 12 | F-1-20 |
| 27 | Test and build | 3 | — |
| 28 | Playwright is pinned to 1.58.2. | 5 | F-1-21 |
| 29 | The test suite starts production preview servers automatically. | 8 | F-1-22 |
| 30 | The production build uses hashed CSS and JavaScript assets, and the service worker precaches the matching app shell and assets for offline reloads. | 23 | F-1-14 |
| 31 | Optional build-time variables: | 3 | — |
| 32 | Use https://pilot-api.sociobot.in as VITE_BILLING_BASE for registered staging products. | 8 | — |
| 33 | Never commit license tokens or billing credentials. | 7 | — |
| 34 | Deploy | 1 | — |
| 35 | Deploy the contents of dist/ as a static site, with index.html at its root. | 14 | — |
| 36 | The build also emits a physical /demo/index.html, so Static Web Apps can return the designed 404 for unknown routes. | 19 | F-1-23 |
| 37 | The service worker is scoped to /; serve over HTTPS and avoid rewriting /sw.js, /manifest.webmanifest, /privacy/, or /terms/ to another asset. | 20 | F-1-24 |
| 38 | staticwebapp.config.json carries the immutable asset caching, correct AVIF/manifest MIME types, and browser response headers for the Static Web Apps deployment. | 20 | F-1-25 |
| 39 | Product notes | 2 | — |
| 40 | Scope and research: .factory/brief.json | 4 | — |
| 41 | Visual system and generated-art provenance: .factory/design.md | 6 | — |
| 42 | Build verification and known gaps: .factory/handoff.md | 6 | — |
| 43 | Claim registry: .factory/claims.json | 3 | — |
| 44 | Demo sandbox: .factory/demo.md | 3 | — |
| 45 | License | 1 | — |
| 46 | MIT — see LICENSE. | 3 | — |

## Terminology check

| Concept | Current terms | Required consistent wording |
| --- | --- | --- |
| Saved week of work | timecard, workspace, weekly board, seven-day board | **weekly timecard**; reserve **weekly board** for the visual view |
| Calendar input | calendar clues, calendar events, calendar file | **calendar events** for records; **calendar file** for the imported file |
| Recorded span | work block | Keep **work block** |
| Spreadsheet export | CSV, invoice-ready CSV | Keep **CSV**; explain the columns once |
| Complete backup | JSON archive, JSON backup | Use **JSON backup** |
| Paid reuse feature | Pattern Deck, saved patterns, previous-week cloning | Explain the outcome before using **Pattern Deck** |

## Demo and sandbox evidence

- One click from `/` reached `/demo`.
- The banner **“Demo — sample data, nothing is saved”**, **Reset demo**, and **Start for real** remained present.
- Six realistic records for Redwood Studio, Northstar Press, and admin work were loaded.
- Deleting a sample reduced the board to five rows; Reset restored six.
- A normal record created before Demo was absent from Demo and returned unchanged after **Start for real**.
- Demo records used `demo:backfill-timecards` session storage. The normal `backfill-timecards` IndexedDB database remained intact.
- The live request log contained only `https://backfill-timecards.sociobot.in`.
- After service-worker control, a live offline reload retained six rows and showed **“Offline · saved here”** with no unexpected request or console failure.

Sandbox behavior passes. Initial demo presentation fails under F-1-1.

## Claims audit

Clean clone: `/tmp/backfill-review1-clean.HDArq8` from candidate `ac1588c`. Every exact `test` command in `.factory/claims.json` was run separately before the full suite.

| Claim id | Result | Evidence checked |
| --- | --- | --- |
| `demo-sandbox` | PASS | Real/demo isolation, reset, tab cleanup |
| `weekly-board` | PASS | Add, edit, copy, delete/undo, client recall |
| `calendar-local` | PASS | Local recurrence/overnight import, explicit choices, no off-origin request |
| `csv-export` | PASS | Filename, full header, six sample rows and fields |
| `local-archive` | PASS | Export, erase, restore |
| `offline-reload` | PASS | Manifest/install data and controlled offline sample reload |
| `pattern-deck` | PASS | Save pattern, copy previous week, core free copy |
| `privacy-local` | PASS | Normal IndexedDB data and same-origin-only requests |
| `billing-entitlement` | PASS | $18 URL, verification gate, exact one-day cache boundary, revoke |

Each id appears in exactly one tagged test. No registered claim test failed. Unlisted claims are F-1-14 and F-1-16–F-1-26.

## Structure, accessibility, links, and visual identity

- Final browser titles, one h1, descriptions, canonicals, OG/Twitter data, `lang=en`, and main landmarks were checked on `/`, `/demo`, `/privacy/`, `/terms/`, and an unknown route. Exceptions are F-1-29 and F-1-30.
- The unknown route returned HTTP 404 and a designed product-specific page with a way home.
- All discovered product links returned 200; `https://sociobot.in/` returned 200. Link wording has F-1-31.
- Back returned to `/`, but route focus remained on `BODY`; see F-1-27.
- `verify-url.sh` passed the live root with zero console/page errors.
- Axe found zero serious or critical violations on all checked routes. The demo at 390px had no horizontal overflow; the full suite covers 44px demo targets, keyboard dialogs, and reduced motion.
- The cassette-era paper/timecard identity is distinct from a generic SaaS template and matches `.factory/design.md`. The generated hero art is original in presentation; provenance test coverage is F-1-26.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist, so there are no prior finding ids to re-open. The prior `.factory/handoff.md` claimed no release-blocking gaps after verification 9. Its functional evidence was reproduced: all registered claims, the full suite, the build, live privacy/offline behavior, and accessibility checks pass. F-1-1 is a stricter first-screen demo failure not recorded in that handoff; the remaining findings likewise were not listed as earlier fixes.

## Missed leverage

No finding. The brief calls for calendar import, repeated-work reuse, client recall, archive export/restore, and CSV export; all are present. Adding AI would conflict with the brief’s explicit-choice and confidentiality constraints and would not improve the core job. Cross-device sync is not implied strongly enough to override the local-first privacy model.

## What would make this perfect

Fix F-1-1 first by opening Demo directly on visible sample work. Then clear every copy/claim and structure finding, regenerate the copy audit, and rerun this review from fresh 390px and desktop contexts. A perfect result has zero findings, all live and README claims registered, accurate raw route metadata, consistent navigation, and route focus that works with Back and Forward.
