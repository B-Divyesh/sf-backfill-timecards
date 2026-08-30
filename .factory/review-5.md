# Adversarial first-read review 5 — Backfill Timecards

Date: 2026-08-30 UTC
Live URL: <https://backfill-timecards.sociobot.in>
Reviewed candidate: `fd7e75d4afc3c62a2d5c46597912619b10f13499`

## Verdict: PASS

Zero findings remain. The cold first screen is clear on phone and desktop, the one-click Demo is populated and isolated, every registered claim test passes independently, no claim-like landing or README sentence is unlisted, and every earlier finding is fixed in both the deployed product and current source.

## First read before scrolling

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Reconstructs a past freelance workweek from reviewed calendar events and memory, then prepares it for invoicing. | Freelancers logging work after the fact. | **Try it with sample data**. | Clear. |
| 1440×900 | The same. | The same. | **Try it with sample data**. | Clear. |

The exact first-screen text is **“Reconstruct your freelance workweek”**, **“For freelancers logging work after the fact, turn reviewed calendar events and memory into a weekly timecard ready for invoicing.”**, and **“Try it with sample data.”** The action result, **“The sample opens a separate weekly timecard without changing your work,”** is adjacent to the buttons.

On the phone, the headline, audience sentence, primary action, and three facts end at 310, 443, 513, and 762 CSS pixels in an 844-pixel viewport. On desktop, they end at 397, 520, 590, and 760 pixels in a 900-pixel viewport. There is no horizontal overflow.

## Findings

None. No `F-5-k` identifier is issued because there is no blocking or minor defect.

## Copy audit

Counts treat hyphenated terms as one word. Repeated identical labels are listed once. The audit includes headings, sentences, actions, labels, links, and accessible names so vague controls cannot hide outside prose. No line exceeds 22 words, contains banned marketing language, uses an unexplained metaphor, or needs a rewrite.

### Landing page

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
| Build r8 · 2026-08-30 | 3 | — |

### README

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
| Normal timecard work sends requests only to this site. | 9 | — |
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

The terminology remains consistent: **weekly timecard** is saved work, **weekly board** is its view, **calendar events** are imported records, **calendar file** is the container, **work block** is a recorded span, **CSV** is the invoice export, **JSON backup** is the portable copy, and **Pattern Deck** is the explained paid reuse feature. All actionable controls use result-naming verbs; navigation links name destinations.

## Demo and sandbox

- One click from `/` reaches `/demo` in fresh phone and desktop contexts.
- The first Demo screen shows **“Demo — sample data, nothing is saved,”** **Reset demo**, **Start for real**, the summary, all four tools, and realistic sample work. The first phone row begins at 751px, inside the 844px viewport.
- The sample contains six work blocks for Redwood Studio, Northstar Press, and admin work, with Manual, Calendar, and Pattern sources.
- Copying a live sample row changes the count from six to seven. **Reset demo** restores six.
- A direct, fresh `/demo` context has only the two `demo:` session keys, no localStorage keys, and no IndexedDB database. The exact `demo-sandbox` test additionally creates real work first, confirms Demo cannot read it, and confirms the real work returns unchanged.
- Leaving Demo removes both session keys. The clean test covers home, Privacy, Terms, external navigation, and abrupt tab close.
- Live root and Demo request logs contain only `https://backfill-timecards.sociobot.in` during ordinary use. A controlled offline reload retains all six sample rows and shows **“Offline · saved here.”**

## Claims audit

Clean clone: `/tmp/backfill-review5-clean.1mXikE/repo` at `fd7e75d4afc3c62a2d5c46597912619b10f13499`. Each exact `.factory/claims.json` command was run independently after `npm ci`.

| Claim id | Result | Observable coverage confirmed |
| --- | --- | --- |
| `demo-sandbox` | PASS — 1 passed | Real/Demo isolation, populated first viewport, reset, exit cleanup, and tab expiry. |
| `demo-exit-cleanup` | PASS — 1 passed | Sample storage clears before home, Privacy, Terms, and external exits. |
| `weekly-board` | PASS — 1 passed | Add, edit, copy, delete, undo, and remembered client. |
| `calendar-local` | PASS — 1 passed | Weekly `UNTIL`, deselection, exact dates, overnight duration, explicit description/billability choices, and no off-origin request. |
| `csv-export` | PASS — 1 passed | Filename, full header, one row per visible block, and sample values. |
| `local-archive` | PASS — 1 passed | Every sample entry, both mappings, saved pattern, erase, restore, client recall, and restored-pattern use. |
| `offline-reload` | PASS — 1 passed | Manifest metadata, service-worker control, offline reload, sample board, and offline status. |
| `pattern-deck` | PASS — 1 passed | Save pattern, copy prior week, and operate every free core tool without a license. |
| `privacy-local` | PASS — 1 passed | Normal IndexedDB storage, no Demo/license data, no account controls, and same-site-only requests. |
| `billing-entitlement` | PASS — 1 passed | $18 once, Sociobot checkout, no embedded provider, verification gate, one-day cache boundary, and revocation. |

The registry contains each `@claim:<id>` exactly once. Cross-checking the live landing page, settings and purchase dialogs, legal pages, and README found no unlisted claim-like sentence and no untested part of a listed claim. The live checkout link returns a 303 to a working hosted checkout page and then 200.

## Earlier-finding verification

All four earlier reviews, all four polish reports, and the prior handoff were read. The deployed root HTML, application JavaScript, and CSS hashes exactly match the clean build, so the source checks below apply to the live artifact as well.

| Earlier id | Status | Fresh live and source confirmation |
| --- | --- | --- |
| F-1-1 | FIXED | Demo omits the marketing hero; six rows load and the first intersects the phone viewport. |
| F-1-2 | FIXED | All three facts end at 760px or earlier on 1440×900. |
| F-1-3 | FIXED | “Calendar clues” is absent; landing, dialogs, and README use “calendar events.” |
| F-1-4 | FIXED | “Weekly timecard” names saved work and “weekly board” names the view. |
| F-1-5 | FIXED | The price fact explains saved patterns and previous-week copying. |
| F-1-6 | FIXED | Toolbar says “Reuse saved blocks — $18.” |
| F-1-7 | FIXED | Paid action says “Review reuse tools — $18.” |
| F-1-8 | FIXED | README names Manual, Calendar, and Pattern marks. |
| F-1-9 | FIXED | README plainly describes ending daily/weekly recurrence and overnight events. |
| F-1-10 | FIXED | README says the client is remembered for each project. |
| F-1-11 | FIXED | Visitor copy says “web-app installation metadata,” not “PWA.” |
| F-1-12 | FIXED | README describes temporary storage limited to the Demo tab. |
| F-1-13 | FIXED | README separates normal local data, Demo data, and license settings. |
| F-1-14 | FIXED | No audited landing or README line exceeds 22 words. |
| F-1-15 | FIXED | README correctly identifies seven Demo-starting tests and three normal-workspace tests. |
| F-1-16 | FIXED | Billing claim and test assert no provider frame, card field, or third-party script. |
| F-1-17 | FIXED | The unsupported universal claim-test meta-claim remains absent. |
| F-1-18 | FIXED | The unverified Node-version promise remains absent. |
| F-1-19 | FIXED | The unregistered stack-marketing sentence remains absent. |
| F-1-20 | FIXED | README uses the observable request boundary, not a backend-architecture promise. |
| F-1-21 | FIXED | Playwright version is package metadata, not visitor-facing copy. |
| F-1-22 | FIXED | Preview-server behavior is an instruction following `npm test`. |
| F-1-23 | FIXED | README gives deploy instructions without an unsupported output claim; `/demo` is a real built document. |
| F-1-24 | FIXED | README gives the root service-worker instruction without an unsupported scope claim. |
| F-1-25 | FIXED | Unsupported deployment-header marketing remains absent. |
| F-1-26 | FIXED | Provider provenance remains in the design record, not as an unregistered footer claim. |
| F-1-27 | FIXED | Click, Back, and Forward update title/state, focus the h1, and populate the polite announcement. |
| F-1-28 | FIXED | Root, Demo, legal pages, and 404 share the wordmark/nav and complete footer. |
| F-1-29 | FIXED | Raw `/demo` has Demo-specific title, description, canonical, OG, and Twitter metadata. |
| F-1-30 | FIXED | 404 has `og:url`; the Apple touch icon is 180×180. |
| F-1-31 | FIXED | Param Factory and Sociobot links identify themselves as external. |
| F-1-32 | FIXED | Privacy, Terms, and 404 h1s directly name their pages. |
| F-1-33 | FIXED | The committed audit covers landing controls, README copy, counts, and terminology. |
| F-2-1 | FIXED | `calendar-local` asserts weekly `UNTIL`, selected-only import, exact dates, and an overnight event. |
| F-2-2 | FIXED | `local-archive` checks all entries, mappings, the pattern, and post-restore behavior. |
| F-2-3 | FIXED | `pattern-deck` operates every free core tool in a locked normal workspace. |
| F-2-4 | FIXED | README promises installation metadata rather than browser installation. |
| F-2-5 | FIXED | Unsupported “clear” marketing language remains absent. |
| F-2-6 | FIXED | Browser records are “local data”; downloaded files are “JSON backups.” |
| F-2-7 | FIXED | Week controls say Show previous/current/next week. |
| F-2-8 | FIXED | Instructions, empty days, and dialogs use “work block,” not “track.” |
| F-2-9 | FIXED | Row action says “Save pattern” with a result-first accessible name. |
| F-2-10 | FIXED | Pattern dialog h2 says “Reuse saved work blocks.” |
| F-2-11 | FIXED | Settings action says “Review reuse tools — $18.” |
| F-2-12 | FIXED | Saved-pattern action says “Add to this week.” |
| F-3-1 | FIXED | Paid copy says “Save reusable work patterns”; “unlimited” is absent. |
| F-3-2 | FIXED | Live Privacy and settings say “You can use the app without an account”; the cloud/database architecture claims are absent. |
| F-3-3 | FIXED | Dialog, Privacy, and Terms use tested Sociobot checkout wording; Dodo/merchant-role assertions are absent. |
| F-3-4 | FIXED | Paid dialog h2 is “Unlock saved patterns and week copying.” |
| F-3-5 | FIXED | README says requests go “only to this site,” without “same-origin” jargon. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. A fresh unknown route returns the designed 404 with **“Page not found”** and a route home.
- Every route has `lang=en`, one h1, one main landmark, a route-specific title, description, canonical, matching OG/Twitter metadata, SVG favicon, and 180px Apple touch icon. The social card is 1200×630.
- The sitemap lists all four real routes. Every discovered first-party, Param Factory, and hosted-checkout link resolves successfully.
- Browser Back and Forward focus the new h1 and announce the route. The skip link, dialog focus trap/restore, 44px targets, reduced-motion behavior, keyboard controls, and responsive width pass the clean suite.
- Playwright Axe scans found zero serious or critical issues on root, Demo, Privacy, Terms, and 404. The factory URL verifier found one h1, `lang`, main, image alt text, labeled buttons, and zero console errors on root and Demo.
- The warm-paper palette, cassette/timecard collage, ruled work rows, label typography, blue tape accents, coral corrections, and offset physical shadows match `.factory/design.md`. It is visually distinct from the centered-gradient/feature-card SaaS pattern.
- The live root HTML, `index-JTjvwkYg.js`, and `index-F37a4tX5.css` match the clean build byte for byte. Initial JavaScript is 48.69kB raw and 14.49kB gzip; CSS is 19.65kB raw and 5.01kB gzip.

## Missed leverage

No finding. The brief’s obvious extensions—selective calendar import, remembered client assignments, prior-week and pattern reuse, CSV export, and portable backup—are already present. AI would send confidential work text across the network and would not improve this explicit-review workflow. Sync would materially change the local-first privacy contract rather than complete an omitted expected step.

## Quality gates

- All ten exact claim commands: PASS independently.
- `npm test`: PASS — 13 unit/contract tests and 58 desktop/mobile browser tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced.
- Live first-read, Demo reset/isolation, offline reload, route crawl, metadata, history focus, request log, and Axe checks: PASS.

## What would make this perfect

Nothing remains to correct in this review. Preserve the current claim coverage, one-click isolated Demo, plain terminology, route behavior, and live/build identity in future changes.
