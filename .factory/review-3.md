# Adversarial first-read review 3 — Backfill Timecards

Date: 2026-08-29 UTC

Live URL: <https://backfill-timecards.sociobot.in>

Reviewed candidate: `009c88fb2ee3857065bf5a992a415f94e25b0545`

## Verdict: FAIL

The cold first screen is clear, the one-click demo is populated and isolated, every registered claim command passes, and the live deployment matches the reviewed build. The review still has five findings: three unlisted claims and two plain-words defects. None is a blocking first-read, demo, test, or routing failure, but a PASS requires zero findings.

## First read before scrolling

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Reconstructs a past freelance workweek from reviewed calendar events and memory, ready for invoicing. | Freelancers logging work after the fact. | **Try it with sample data**. | PASS |
| 1440×900 | The same. | The same. | **Try it with sample data**. | PASS |

The exact text providing those answers is **“Reconstruct your freelance workweek”**, **“For freelancers logging work after the fact…”**, and **“Try it with sample data.”** All three short facts are also fully visible: their final bottoms are 762.30 CSS px on the 844 px phone and 759.98 CSS px on the 900 px desktop.

## Findings

### F-3-1 — “Unlimited” is an unlisted paid-feature claim

- Severity: non-blocking claim finding.
- Location: live normal workspace → **Reuse saved blocks — $18** → unlock dialog.
- Exact quote: **“Save unlimited reusable work patterns.”**
- Evidence: neither `pattern-deck` nor `billing-entitlement` in `.factory/claims.json` promises or tests an unlimited quantity. The tagged test saves one pattern.
- Impact: a buyer can rely on the absence of a limit, but the sandbox does not prove that promise.
- Fix: change the line to **“Save reusable work patterns.”** Alternatively, add the exact unlimited claim and a tagged boundary test that proves no product limit exists.

### F-3-2 — The privacy policy makes an unlisted architecture claim

- Severity: non-blocking claim finding.
- Location: live `/privacy/`, opening paragraph.
- Exact quote: **“We do not operate an account database for the app.”**
- Evidence: `privacy-local` proves that normal work needs no account controls, uses local IndexedDB, and makes only same-origin requests. It cannot prove the absence of an undisclosed server-side database.
- Impact: this is stronger than the observable no-account behavior a visitor can verify.
- Fix: replace it with the tested sentence **“You can use the app without an account.”** Do not make a backend-architecture promise unless a repository and deployment contract can prove it.

### F-3-3 — The named merchant-of-record assertion is not in the claim registry

- Severity: non-blocking claim finding.
- Locations: unlock dialog, `/privacy/`, and `/terms/`.
- Exact quotes: **“Dodo is merchant of record,” “its merchant-of-record provider, Dodo,”** and **“Dodo acts as merchant of record.”**
- Evidence: `billing-entitlement` registers Sociobot checkout, the $18 one-time price, verification, cache behavior, and no embedded provider. It does not register Dodo’s legal role. A no-spend GET currently redirects to `checkout.dodopayments.com`, but a redirect host does not prove merchant-of-record status and is not part of the clean sandbox test.
- Impact: payment processor identity and legal responsibility are facts a buyer can rely on.
- Fix: either add a verifiable billing-contract claim for the merchant identity, or use only the tested wording: **“Checkout is hosted by Sociobot. Send payment and refund questions there.”** Apply the same wording consistently in the dialog, Privacy, and Terms.

### F-3-4 — The paid-dialog heading does not name its section

- Severity: minor copy finding.
- Location: unlock dialog h2.
- Exact quote: **“Make repeat weeks faster.”**
- Impact: in a screen-reader heading list, this generic benefit line does not identify the paid feature or what is being unlocked.
- Fix: **“Unlock saved patterns and week copying.”**

### F-3-5 — “Same-origin” is unexplained README jargon

- Severity: minor copy finding.
- Location: README privacy paragraph.
- Exact quote: **“Normal timecard work makes only same-origin requests.”** (7 words)
- Impact: a non-web developer cannot tell which site receives data.
- Fix: **“Normal timecard work sends requests only to this site.”** Keep the same `privacy-local` request-origin assertion.

## Landing-page copy audit

Counts treat hyphenated terms as one word. Repeated strings have the same count and are listed once. No landing sentence exceeds 22 words, contains a banned marketing word, or needs a finding.

| Exact copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Backfill Timecards home | 3 | — |
| Demo | 1 | — |
| Privacy | 1 | — |
| Local · saved here | 3 | — |
| Open data and license settings | 5 | — |
| Private weekly timecards | 3 | — |
| Reconstruct your freelance workweek | 4 | — |
| For freelancers logging work after the fact, turn reviewed calendar events and memory into a weekly timecard ready for invoicing. | 20 | — |
| Try it with sample data | 5 | — |
| Add your own work | 4 | — |
| The sample opens a separate weekly timecard without changing your work. | 11 | — |
| Weekly timecards stay on this device. | 6 | — |
| Works offline after the first visit. | 6 | — |
| Saved patterns and previous-week copying cost $18 once. | 8 | — |
| You choose every work block. | 5 | — |
| Weekly board | 2 | — |
| Aug 24–30, 2026 | 3 | — |
| Show previous week | 3 | — |
| Show current week | 3 | — |
| Show next week | 3 | — |
| Total recorded | 2 | — |
| 0m | 1 | — |
| Billable | 1 | — |
| Entries | 1 | — |
| Clients | 1 | — |
| Add work block | 3 | — |
| Import calendar | 2 | — |
| Reuse saved blocks — $18 | 5 | — |
| Export CSV | 2 | — |
| Empty week | 2 | — |
| No work blocks yet | 4 | — |
| Start from one thing you remember, or bring in a calendar file and choose only the events you want. | 19 | — |
| Add the first block | 4 | — |
| Review a calendar file | 4 | — |
| How it works | 3 | — |
| Review your week in three steps | 6 | — |
| Review calendar events. | 3 | — |
| Import an .ics file and choose only useful events. | 9 | — |
| Record and correct work. | 4 | — |
| Add details, clients, and billable choices yourself. | 7 | — |
| Export the week. | 3 | — |
| Download an invoice-ready CSV when every row looks right. | 9 | — |
| Local data | 2 | — |
| Your week stays in this browser. | 6 | — |
| Calendar files are read here, not uploaded. | 7 | — |
| No account is required. | 4 | — |
| Export a JSON backup, restore one, or erase your local data. | 12 | — |
| Manage local data | 3 | — |
| Optional one-time purchase | 3 | — |
| Reuse common work with Pattern Deck | 6 | — |
| Pattern Deck costs $18 once. | 5 | — |
| It saves reusable blocks and copies a previous week into matching days. | 11 | — |
| The weekly board, calendar import, CSV export, backups, and privacy controls remain free. | 13 | — |
| Review reuse tools — $18 | 5 | — |
| Private weekly timecards for freelancers. | 5 | — |
| Terms | 1 | — |
| Param Factory (external) | 3 | — |
| Build r7 · 2026-08-29 | 3 | — |

Every actionable landing control starts with or contains a result-naming verb. Navigation links name their destinations.

## README copy audit

Code blocks are excluded. Headings, prose sentences, list items, and link labels are included. No sentence exceeds 22 words or contains a banned marketing word. F-3-5 is the only flag.

| Exact copy | Words | Flag |
| --- | ---: | --- |
| Backfill Timecards | 2 | — |
| Backfill Timecards is a private weekly timecard for freelancers who reconstruct work after the fact. | 15 | — |
| It turns memory and reviewed calendar events into work blocks and an invoice-ready CSV. | 14 | — |
| Live product: backfill-timecards.sociobot.in | 3 | — |
| Try the isolated sample week: backfill-timecards.sociobot.in/demo | 7 | — |
| What it does | 3 | — |
| Adds, edits, copies, and deletes work blocks marked Manual, Calendar, or Pattern. | 12 | — |
| Imports .ics calendar files locally, with event selection, optional descriptions, and an explicit billable choice that defaults off. | 18 | — |
| Reviews daily or weekly repeating events that have an end date, plus overnight events. | 14 | — |
| Remembers the client for each project when you add more work. | 11 | — |
| Exports the selected week as invoice-ready CSV. | 7 | — |
| Exports, restores, and erases a complete local JSON backup. | 9 | — |
| Includes web-app installation metadata and works offline after the first visit. | 10 | — |
| Offers an optional $18 one-time Pattern Deck unlock for saved patterns and previous-week cloning. | 14 | — |
| Checkout and license verification use Sociobot billing; no payment provider is embedded. | 12 | — |
| Seven claim tests start at /demo. | 6 | — |
| The demo-isolation, normal-privacy, and billing tests start in clean normal workspaces as described in .factory/claims.json. | 16 | — |
| Demo records use temporary browser storage limited to that demo tab. | 11 | — |
| Reset demo restores the sample. | 5 | — |
| Start for real clears it before opening your weekly timecard. | 10 | — |
| See .factory/demo.md. | 3 | — |
| Outside demo mode, work blocks, client mappings, and patterns stay in this browser’s local database. | 15 | — |
| A purchased license token stays in this browser’s settings storage. | 10 | — |
| Normal timecard work makes only same-origin requests. | 7 | F-3-5 |
| See /privacy and /terms. | 4 | — |
| Developer note: the normal database uses IndexedDB. | 7 | — |
| Demo records use sessionStorage, and license settings use localStorage. | 9 | — |
| Develop | 1 | — |
| Test and build | 3 | — |
| Run npm test; the Playwright configuration starts its preview servers. | 10 | — |
| Optional build-time variables | 3 | — |
| Use pilot-api.sociobot.in as VITE_BILLING_BASE for registered staging products. | 8 | — |
| Never commit license tokens or billing credentials. | 7 | — |
| Deploy | 1 | — |
| Deploy the contents of dist as a static site, with index.html at its root. | 14 | — |
| Serve /sw.js from the site root. | 6 | — |
| Keep /demo, /privacy, /terms, and /404.html as physical routes. | 9 | — |
| Product notes | 2 | — |
| Scope and research: .factory/brief.json | 5 | — |
| Visual system and generated-art provenance: .factory/design.md | 7 | — |
| Build verification and known gaps: .factory/handoff.md | 7 | — |
| Claim registry: .factory/claims.json | 4 | — |
| Demo sandbox: .factory/demo.md | 4 | — |
| License | 1 | — |
| MIT — see LICENSE. | 3 | — |

Terminology is otherwise consistent: **weekly timecard** is saved work, **weekly board** is the view, **calendar events** are records, **calendar file** is the imported container, **work block** is a recorded span, **CSV** is the invoice export, **JSON backup** is the portable copy, and **Pattern Deck** is the explained paid reuse feature.

## Demo and sandbox verification

- One click from `/` reached `/demo` in both fresh viewports.
- The first Demo screen had the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, **Start for real**, the week summary, all four tools, and six realistic rows.
- The first sample row began at 751.22 px on the 844 px phone and 457.48 px on the 900 px desktop, so sample work was already visible.
- The first row was **“Plan the website sprint”** for **Redwood Studio / Website refresh**, marked Manual and billable.
- Deleting it reduced the board to five rows. **Reset demo** restored six.
- A normal **“Private real record”** created before Demo was absent from Demo and returned unchanged after **Start for real**.
- Demo changes used `demo:backfill-timecards` and the demo-active session key. Both were removed on exit. The real `backfill-timecards` IndexedDB remained present and untouched.
- Normal and Demo request logs contained only `https://backfill-timecards.sociobot.in`.
- A controlled live offline reload retained all six rows and showed **“Offline · saved here.”**

Demo presentation and isolation pass.

## Claims verification

Clean clone: `/tmp/backfill-review3-clean.UXtJ3E/repo` at `009c88fb2ee3857065bf5a992a415f94e25b0545`. Every exact command in `.factory/claims.json` was run separately after `npm ci`.

| Claim id | Exact command result | Coverage result |
| --- | --- | --- |
| `demo-sandbox` | PASS — 1 passed | PASS — real/demo isolation, reset, first-viewport sample, and tab expiry |
| `demo-exit-cleanup` | PASS — 1 passed | PASS — home, Privacy, Terms, and external exit cleanup |
| `weekly-board` | PASS — 1 passed | PASS — add, edit, copy, delete, undo, and client recall |
| `calendar-local` | PASS — 1 passed | PASS — weekly `UNTIL`, deselection, dates, overnight event, choices, storage, and requests |
| `csv-export` | PASS — 1 passed | PASS — filename, header, row count, and sample fields |
| `local-archive` | PASS — 1 passed | PASS — nine entries, two mappings, pattern, erase, restore, client recall, and restored pattern |
| `offline-reload` | PASS — 1 passed | PASS — manifest metadata, service-worker control, offline reload, and sample board |
| `pattern-deck` | PASS — 1 passed | PASS — save, previous-week copy, and locked-workspace free tools; F-3-1 is an extra unlisted quantity claim |
| `privacy-local` | PASS — 1 passed | PASS for local normal work and request boundary; F-3-2 is a stronger architecture claim |
| `billing-entitlement` | PASS — 1 passed | PASS for price, Sociobot URL, embed absence, verification gate, one-day cache, and revoke; F-3-3 is extra |

No registered claim test failed or remains partially tested. The three unlisted claims are F-3-1 through F-3-3.

## Earlier-finding verification

Every prior review, polish report, and handoff was read. The live root, Demo, Privacy, Terms, 404, JavaScript, and CSS byte-match the candidate build. Each earlier finding was checked again in live output and source.

| Earlier id | Status | Current confirmation |
| --- | --- | --- |
| F-1-1 | FIXED | `/demo` opens on the populated board; the first mobile row intersects the initial viewport. |
| F-1-2 | FIXED | All three facts end above 760 px at 1440×900. |
| F-1-3 | FIXED | Landing and steps use “calendar events”; “calendar clues” is absent. |
| F-1-4 | FIXED | “Weekly timecard” names saved work and “weekly board” names the view. |
| F-1-5 | FIXED | The first-screen price fact explains saved patterns and previous-week copying. |
| F-1-6 | FIXED | Toolbar says “Reuse saved blocks — $18.” |
| F-1-7 | FIXED | Paid action says “Review reuse tools — $18.” |
| F-1-8 | FIXED | README names Manual, Calendar, and Pattern marks. |
| F-1-9 | FIXED | README states repeating events need an end date and includes overnight events. |
| F-1-10 | FIXED | README explains remembered clients in plain words. |
| F-1-11 | FIXED | Visitor copy uses “web app,” not “PWA.” |
| F-1-12 | FIXED | README explains tab-limited temporary Demo storage. |
| F-1-13 | FIXED | README separates normal, Demo, and license storage. |
| F-1-14 | FIXED | No landing or README sentence exceeds 22 words. |
| F-1-15 | FIXED | README accurately says seven claims start at `/demo` and identifies the other three. |
| F-1-16 | FIXED | Billing claim and test cover no embedded provider frames, fields, or scripts. |
| F-1-17 | FIXED | The unsupported “every claim” meta-claim remains absent. |
| F-1-18 | FIXED | The unverified Node 20 requirement remains absent. |
| F-1-19 | FIXED | The unregistered implementation-stack sentence remains absent. |
| F-1-20 | FIXED | README no longer claims “no product backend”; F-3-2 concerns a distinct live Privacy assertion. |
| F-1-21 | FIXED | Visitor copy does not assert a Playwright version; package metadata pins 1.58.2. |
| F-1-22 | FIXED | Preview behavior is an instruction following `npm test`. |
| F-1-23 | FIXED | README gives deployment instructions without the old build-output promise. |
| F-1-24 | FIXED | README instructs serving `/sw.js` from root without the old scope claim. |
| F-1-25 | FIXED | The unregistered header/MIME marketing sentence remains absent. |
| F-1-26 | FIXED | The unsupported Azure provider sentence remains absent from the footer. |
| F-1-27 | FIXED | Live click, Back, and Forward update title/state, focus the h1, and announce the route. |
| F-1-28 | FIXED | Root, Demo, legal pages, and 404 share the wordmark/nav and complete footer links. |
| F-1-29 | FIXED | Raw `/demo` has Demo title, description, canonical, and matching OG/Twitter metadata before JavaScript. |
| F-1-30 | FIXED | 404 has `og:url`; the Apple touch icon is 180×180. |
| F-1-31 | FIXED | Param Factory and Sociobot links identify themselves as external. |
| F-1-32 | FIXED | Privacy, Terms, and 404 h1s name their pages directly. |
| F-1-33 | FIXED | The committed audit covers the rendered landing page and README with split counts and terminology. |
| F-2-1 | FIXED | `calendar-local` now asserts weekly `UNTIL`, exact dates, deselection, and overnight import. |
| F-2-2 | FIXED | `local-archive` checks every sample entry, both mappings, the pattern, and post-restore behavior. |
| F-2-3 | FIXED | `pattern-deck` operates add/import/CSV/JSON/erase controls in a locked normal workspace. |
| F-2-4 | FIXED | README promises installation metadata, not installation. |
| F-2-5 | FIXED | Unsupported “clear” is absent. |
| F-2-6 | FIXED | Browser records are “local data”; downloaded files are “JSON backups.” |
| F-2-7 | FIXED | Week navigation names Show previous/current/next week. |
| F-2-8 | FIXED | Instructions, empty days, and dialogs use “work block,” not “track.” |
| F-2-9 | FIXED | Row action says “Save pattern” with a result-first accessible name. |
| F-2-10 | FIXED | Pattern dialog h2 is “Reuse saved work blocks.” |
| F-2-11 | FIXED | Settings action says “Review reuse tools — $18.” |
| F-2-12 | FIXED | Saved-pattern action says “Add to this week.” |

No earlier finding is reopened.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and a real unknown URL returned the intended 200/404 status, route-specific title, one h1, one main landmark, `lang=en`, description, canonical, OG/Twitter metadata, SVG favicon, and 180 px Apple icon.
- Titles follow the required product/route pattern and are under 60 characters. The social image is 1200×630.
- The unknown URL returned the designed cassette-paper 404 with **“Page not found”** and a way home.
- The sitemap lists all four real routes. Root, Demo, Privacy, Terms, Param Factory, and the Sociobot checkout destination all returned 200 after redirects.
- Live click, Back, and Forward focused the corresponding h1 and populated the polite route announcement.
- Root, Demo, Privacy, and Terms produced no console or page errors. The expected top-level 404 network status produced the browser’s standard 404 resource message, not a product script error.
- Axe found zero serious or critical violations on all five routes. Neither viewport had horizontal overflow. The clean suite also covers keyboard dialogs, focus restore, 44 px targets, and reduced motion.
- The warm paper, tape blue/coral palette, cassette-insert art, mono data type, ruled rows, restrained corners, and offset shadows are distinct and match `.factory/design.md`; this is not a generic SaaS layout.
- The clean production build is 14.61 kB gzip JavaScript and 5.00 kB gzip CSS. Live JS/CSS and every route document hash match the clean build.

Structure and accessibility pass.

## Quality-gate results

- `npm test`: PASS — 12 unit tests and 58 desktop/mobile Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced.
- All ten registered claim commands: PASS independently.

## Missed leverage

No finding. The brief’s obvious leverage is calendar import, selective review, client recall, prior-week/pattern reuse, CSV export, and portable backup; all are present. Runtime AI would conflict with confidential calendar text and the requirement never to infer billable time. Sync would weaken the current local-first contract unless introduced as a separate, explicit product choice.

## What would make this perfect

Remove “unlimited” or prove it, replace the unprovable account-database sentence with observable no-account wording, register or remove the named merchant assertion, rename the paid-dialog heading, and replace “same-origin” with plain language. Then rerun the complete cold mobile/desktop, Demo, claim, route, copy, and history checks. A perfect result has zero findings.
