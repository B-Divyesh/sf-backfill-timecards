# Adversarial first-read review 4 — Backfill Timecards

Date: 2026-08-30 UTC
Live URL: <https://backfill-timecards.sociobot.in>  
Reviewed commit: `baadd851db2cd5a1697c7cc767190b25e0a7ec24`

## Verdict: FAIL

The first read is clear, the one-click demo is populated and isolated, all ten claim commands pass, and the deployed root, JavaScript, and CSS match the clean build. This review fails because an earlier unsupported architecture claim has been reintroduced in settings. A PASS requires zero findings.

## First read before scrolling

| Viewport | What it does | For whom | First action | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Reconstructs a past freelance workweek from reviewed calendar events and memory, then exports it for invoicing. | Freelancers logging work after the fact. | **Try it with sample data**. | Clear. |
| 1440×900 | Same. | Same. | **Try it with sample data**. | Clear. |

The exact first-screen copy is **“Reconstruct your freelance workweek”**, **“For freelancers logging work after the fact, turn reviewed calendar events and memory into a weekly timecard ready for invoicing.”**, and **“Try it with sample data.”** The three facts end at 762px on the 844px phone and 760px on the 900px desktop.

## Blocking finding

### F-3-2 — Reopened: settings makes an untestable cloud-account architecture claim

- Severity: BLOCKING; this reopens F-3-2.
- Location: normal workspace → **Open data and license settings** → **Your local data**.
- Exact quote: **“There is no cloud account.”**
- Evidence: live output and `src/app.ts:644` render this sentence. `privacy-local` proves observable browser storage, no account controls, and request behaviour; it cannot prove the absence of a cloud-account or undisclosed account system.
- Impact: a visitor can rely on this as an architecture/data-location promise. It repeats the issue repaired in the Privacy policy when **“We do not operate an account database”** became **“You can use the app without an account.”**
- Fix: replace it with **“You can use the app without an account.”** Keep `privacy-local`, or add a deployment contract that proves the stronger promise.

## Copy audit

Word counts treat hyphenated words as one word. No landing or README item exceeds 22 words, uses banned marketing language, has inconsistent terminology, or is a vague action button. The committed `.factory/copy-audit.md` also lists static labels and accessible names; the tables here list every sentence, heading, list item, and link label requested for this review.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| Backfill Timecards home | 3 |
| Demo | 1 |
| Privacy | 1 |
| Local · saved here | 3 |
| Open data and license settings | 5 |
| Private weekly timecards | 3 |
| Reconstruct your freelance workweek | 4 |
| For freelancers logging work after the fact, turn reviewed calendar events and memory into a weekly timecard ready for invoicing. | 20 |
| Try it with sample data | 5 |
| Add your own work | 4 |
| The sample opens a separate weekly timecard without changing your work. | 11 |
| Weekly timecards stay on this device. | 6 |
| Works offline after the first visit. | 6 |
| Saved patterns and previous-week copying cost $18 once. | 8 |
| You choose every work block. | 5 |
| Weekly board | 2 |
| Show previous week | 3 |
| Show current week | 3 |
| Show next week | 3 |
| Total recorded | 2 |
| Billable | 1 |
| Entries | 1 |
| Clients | 1 |
| Add work block | 3 |
| Import calendar | 2 |
| Reuse saved blocks — $18 | 5 |
| Export CSV | 2 |
| Empty week | 2 |
| No work blocks yet | 4 |
| Start from one thing you remember, or bring in a calendar file and choose only the events you want. | 19 |
| Add the first block | 4 |
| Review a calendar file | 4 |
| How it works | 3 |
| Review your week in three steps | 6 |
| Review calendar events. | 3 |
| Import an .ics file and choose only useful events. | 9 |
| Record and correct work. | 4 |
| Add details, clients, and billable choices yourself. | 7 |
| Export the week. | 3 |
| Download an invoice-ready CSV when every row looks right. | 9 |
| Local data | 2 |
| Your week stays in this browser. | 6 |
| Calendar files are read here, not uploaded. | 7 |
| No account is required. | 4 |
| Export a JSON backup, restore one, or erase your local data. | 12 |
| Manage local data | 3 |
| Optional one-time purchase | 3 |
| Reuse common work with Pattern Deck | 6 |
| Pattern Deck costs $18 once. | 5 |
| It saves reusable blocks and copies a previous week into matching days. | 11 |
| The weekly board, calendar import, CSV export, backups, and privacy controls remain free. | 13 |
| Review reuse tools — $18 | 5 |
| Private weekly timecards for freelancers. | 5 |
| Terms | 1 |
| Param Factory (external) | 3 |

### README

| Copy | Words |
| --- | ---: |
| Backfill Timecards | 2 |
| Backfill Timecards is a private weekly timecard for freelancers who reconstruct work after the fact. | 15 |
| It turns memory and reviewed calendar events into work blocks and an invoice-ready CSV. | 14 |
| Live product: backfill-timecards.sociobot.in | 3 |
| Try the isolated sample week: backfill-timecards.sociobot.in/demo | 7 |
| What it does | 3 |
| Adds, edits, copies, and deletes work blocks marked Manual, Calendar, or Pattern. | 12 |
| Imports .ics calendar files locally, with event selection, optional descriptions, and an explicit billable choice that defaults off. | 18 |
| Reviews daily or weekly repeating events that have an end date, plus overnight events. | 14 |
| Remembers the client for each project when you add more work. | 11 |
| Exports the selected week as invoice-ready CSV. | 7 |
| Exports, restores, and erases a complete local JSON backup. | 9 |
| Includes web-app installation metadata and works offline after the first visit. | 10 |
| Offers an optional $18 one-time Pattern Deck unlock for saved patterns and previous-week cloning. | 14 |
| Checkout and license verification use Sociobot billing; no payment provider is embedded. | 12 |
| Seven claim tests start at /demo. | 6 |
| The demo-isolation, normal-privacy, and billing tests start in clean normal workspaces as described in .factory/claims.json. | 16 |
| Demo records use temporary browser storage limited to that demo tab. | 11 |
| Reset demo restores the sample. | 5 |
| Start for real clears it before opening your weekly timecard. | 10 |
| See .factory/demo.md. | 3 |
| Outside demo mode, work blocks, client mappings, and patterns stay in this browser’s local database. | 15 |
| A purchased license token stays in this browser’s settings storage. | 10 |
| Normal timecard work sends requests only to this site. | 9 |
| See /privacy and /terms. | 4 |
| Developer note: the normal database uses IndexedDB. | 7 |
| Demo records use sessionStorage, and license settings use localStorage. | 9 |
| Develop | 1 |
| Test and build | 3 |
| Run npm test; the Playwright configuration starts its preview servers. | 10 |
| Optional build-time variables | 3 |
| Use pilot-api.sociobot.in as VITE_BILLING_BASE for registered staging products. | 8 |
| Never commit license tokens or billing credentials. | 7 |
| Deploy | 1 |
| Deploy the contents of dist as a static site, with index.html at its root. | 14 |
| Serve /sw.js from the site root. | 6 |
| Keep /demo, /privacy, /terms, and /404.html as physical routes. | 9 |
| Product notes | 2 |
| Scope and research: .factory/brief.json | 5 |
| Visual system and generated-art provenance: .factory/design.md | 7 |
| Build verification and known gaps: .factory/handoff.md | 7 |
| Claim registry: .factory/claims.json | 4 |
| Demo sandbox: .factory/demo.md | 4 |
| License | 1 |
| MIT — see LICENSE. | 3 |

Terminology remains consistent: **weekly timecard** is saved work, **weekly board** is the view, **calendar events** are records, **calendar file** is the imported container, **work block** is a recorded span, and **JSON backup** is the portable copy.

## Demo and sandbox verification

- One explicit CTA click reached `/demo` in fresh phone and desktop contexts.
- The first Demo screen had the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, **Start for real**, a summary, tools, and six realistic sample records. The first phone row began at 744px in an 844px viewport.
- The live request log contained only `https://backfill-timecards.sociobot.in` and no page errors. Demo used `demo:backfill-timecards` session storage; no real session entry existed.
- `demo-sandbox` separately proved real/demo isolation, Reset, and tab-close expiry. `offline-reload` and `privacy-local` separately proved controlled offline reload and the normal request boundary.

## Claims and quality gates

Fresh clone: `/tmp/backfill-review4-clean.DqnX5E/repo`, installed with `npm ci`.

| Claim | Result |
| --- | --- |
| demo-sandbox | PASS |
| demo-exit-cleanup | PASS |
| weekly-board | PASS |
| calendar-local | PASS |
| csv-export | PASS |
| local-archive | PASS |
| offline-reload | PASS |
| pattern-deck | PASS |
| privacy-local | PASS |
| billing-entitlement | PASS |

Each exact `test` command from `.factory/claims.json` was run separately with `--project=chromium --grep @claim:<id>`. `npm test` passed (13 unit/contract + 58 browser tests), as did `npm run typecheck`, `npm run lint`, and `npm run build`; `dist/` was produced. The production JavaScript is 14.59kB gzip and CSS 5.00kB gzip.

Every landing and README claim is covered by the registry. F-3-2 is the remaining stronger unlisted claim.

## Earlier-finding verification

Every earlier review, polish report, and handoff was read. The live root HTML, app JS, and CSS SHA-256 values match the clean build. Each prior finding was checked against source and live output:

| Earlier ids | Status | Confirmation |
| --- | --- | --- |
| F-1-1 | FIXED | Demo opens on populated sample work. |
| F-1-2 | FIXED | Three facts fit on desktop first screen. |
| F-1-3, F-1-4, F-1-5 | FIXED | Plain calendar wording, stable timecard/board terms, explained price. |
| F-1-6, F-1-7 | FIXED | Reuse actions name results. |
| F-1-8 through F-1-15 | FIXED | README wording, storage scope, copy length, and claim entry wording are correct. |
| F-1-16 through F-1-26 | FIXED | Billing, unsupported claims, build/deploy wording, and provenance copy are corrected. |
| F-1-27 through F-1-32 | FIXED | Focus/history, common navigation, metadata, external labels, and legal/404 headings work. |
| F-1-33 | FIXED | Copy audit covers landing controls and README. |
| F-2-1, F-2-2, F-2-3 | FIXED | Claim tests now prove recurrence/selection, full backup, and free core tools. |
| F-2-4 through F-2-12 | FIXED | Installation wording, terminology, navigation, work-block wording, and pattern actions are corrected. |
| F-3-1 | FIXED | Unlimited feature promise is absent. |
| F-3-2 | REOPENED | Settings says “There is no cloud account.” |
| F-3-3, F-3-4, F-3-5 | FIXED | Billing wording, paid-dialog heading, and plain request wording are correct. |

Per-ID confirmation, to avoid treating a repair note as evidence:

| ID | Live/source check |
| --- | --- |
| F-1-1 | Six demo rows are present on entry. |
| F-1-2 | Desktop facts remain above 900px. |
| F-1-3 | “Calendar clues” is absent. |
| F-1-4 | Timecard and board terms are distinct. |
| F-1-5 | Price describes the paid result. |
| F-1-6 | Toolbar says “Reuse saved blocks — $18.” |
| F-1-7 | Paid button says “Review reuse tools — $18.” |
| F-1-8 | README names Manual, Calendar, Pattern. |
| F-1-9 | Recurrence wording and test are present. |
| F-1-10 | README explains client recall. |
| F-1-11 | No unexplained PWA visitor wording. |
| F-1-12 | README says temporary demo-tab storage. |
| F-1-13 | README separates storage scopes. |
| F-1-14 | Audited sentences are no longer over 22 words. |
| F-1-15 | README names seven demo-starting tests. |
| F-1-16 | Billing test asserts no provider embeds. |
| F-1-17 | Unsupported meta-claim is absent. |
| F-1-18 | Unsupported Node promise is absent. |
| F-1-19 | Stack marketing claim is absent. |
| F-1-20 | README uses tested request-boundary wording. |
| F-1-21 | Playwright version is not visitor copy. |
| F-1-22 | Preview behavior is an instruction. |
| F-1-23 | README makes no output claim. |
| F-1-24 | README gives only service-worker instruction. |
| F-1-25 | Header/MIME marketing is absent. |
| F-1-26 | Artwork-provider footer claim is absent. |
| F-1-27 | Route/back test covers h1 focus and announcement. |
| F-1-28 | Shared header/footer links are present. |
| F-1-29 | Raw Demo metadata is route-specific. |
| F-1-30 | 404 has OG URL and 180px touch icon. |
| F-1-31 | External links are marked external. |
| F-1-32 | Legal/404 h1s name their pages. |
| F-1-33 | Copy audit covers controls and README. |
| F-2-1 | Calendar test includes weekly UNTIL and selection. |
| F-2-2 | Backup test covers records, mappings, pattern. |
| F-2-3 | Locked test exercises all free core tools. |
| F-2-4 | README says installation metadata. |
| F-2-5 | “Clear” marketing adjective is absent. |
| F-2-6 | Local data/JSON backup terminology is stable. |
| F-2-7 | Week controls have result verbs. |
| F-2-8 | Instructions say work block, not track. |
| F-2-9 | Row action says Save pattern. |
| F-2-10 | Pattern h2 names saved work blocks. |
| F-2-11 | Settings button names reuse tools. |
| F-2-12 | Pattern button says Add to this week. |
| F-3-1 | Unlimited wording is absent. |
| F-3-2 | REOPENED: settings says “There is no cloud account.” |
| F-3-3 | Dodo/merchant wording is absent. |
| F-3-4 | Paid dialog h2 has an explicit object. |
| F-3-5 | README says requests go only to this site. |

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy/`, `/terms/`, and a real unknown route returned the intended 200/404 status with route-specific title, one h1, main landmark, `lang=en`, description, canonical, OG/Twitter metadata, favicon, and Apple touch icon.
- The sitemap lists all product routes. All discovered product and external destinations returned 200; the unknown route’s skip target is the expected 404.
- A live Axe scan at 390px found zero serious or critical violations on root, Demo, Privacy, Terms, and 404.
- The cassette-paper art, warm paper, tape-blue/coral palette, mono data treatment, and ruled rows match the documented visual thesis and are distinct from a generic SaaS template.

## Missed leverage

No finding. The brief’s implied value—selective calendar review/import, client recall, reuse, CSV export, and portable backup—is present. AI would add network handling for confidential calendar text without improving the explicit-review workflow; sync would change the local-first contract.

## What would make this perfect

Replace the reopened settings sentence with **“You can use the app without an account.”** Then rerun the live copy/claim scan and `privacy-local`. With that unsupported architecture promise removed, this review would have zero findings.
