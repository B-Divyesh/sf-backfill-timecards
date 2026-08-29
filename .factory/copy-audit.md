# Product copy audit

Audited: 2026-08-29 UTC. Word counts treat hyphenated terms as one word. Sentences are split into separate rows. Code blocks are excluded. No line exceeds 22 words, and no line contains a banned marketing word.

## Rendered landing page

This table includes headings, visible labels, buttons, links, values, and accessible labels in the empty normal workspace.

| Copy | Words | Type |
| --- | ---: | --- |
| Skip to main content | 4 | Link |
| Backfill Timecards home | 3 | Accessible link name |
| Demo | 1 | Navigation link |
| Privacy | 1 | Navigation link |
| Local · saved here | 3 | Status |
| Open data and license settings | 5 | Accessible button name |
| Private weekly timecards | 3 | Section label |
| Reconstruct your freelance workweek | 4 | H1 |
| For freelancers logging work after the fact, turn reviewed calendar events and memory into a weekly timecard ready for invoicing. | 20 | Lead |
| Try it with sample data | 5 | Primary link |
| Add your own work | 4 | Button |
| The sample opens a separate weekly timecard without changing your work. | 11 | Action result |
| Weekly timecards stay on this device. | 6 | Privacy fact |
| Works offline after the first visit. | 6 | Offline fact |
| Saved patterns and previous-week copying cost $18 once. | 8 | Price fact |
| You choose every work block. | 5 | Image caption |
| Weekly board | 2 | Section label |
| Aug 24–30, 2026 | 3 | Week heading example |
| Show previous week | 3 | Accessible button name |
| Show current week | 3 | Button |
| Show next week | 3 | Accessible button name |
| Total recorded | 2 | Summary label |
| 0m | 1 | Summary value |
| Billable | 1 | Summary label |
| Entries | 1 | Summary label |
| Clients | 1 | Summary label |
| Add work block | 3 | Toolbar button |
| Import calendar | 2 | Toolbar button |
| Reuse saved blocks — $18 | 5 | Toolbar button |
| Export CSV | 2 | Toolbar button |
| Empty week | 2 | State label |
| No work blocks yet | 4 | H3 |
| Start from one thing you remember, or bring in a calendar file and choose only the events you want. | 19 | Empty-state guidance |
| Add the first block | 4 | Button |
| Review a calendar file | 4 | Button |
| How it works | 3 | Section label |
| Review your week in three steps | 6 | H2 |
| Review calendar events. | 3 | Step heading |
| Import an .ics file and choose only useful events. | 9 | Step detail |
| Record and correct work. | 4 | Step heading |
| Add details, clients, and billable choices yourself. | 7 | Step detail |
| Export the week. | 3 | Step heading |
| Download an invoice-ready CSV when every row looks right. | 9 | Step detail |
| Local data | 2 | Section label |
| Your week stays in this browser. | 6 | H2 |
| Calendar files are read here, not uploaded. | 7 | Privacy detail |
| No account is required. | 4 | Privacy detail |
| Export a JSON backup, restore one, or erase your local data. | 12 | Ownership detail |
| Manage local data | 3 | Button |
| Optional one-time purchase | 3 | Section label |
| Reuse common work with Pattern Deck | 6 | H2 |
| Pattern Deck costs $18 once. | 5 | Price detail |
| It saves reusable blocks and copies a previous week into matching days. | 11 | Paid result |
| The weekly board, calendar import, CSV export, backups, and privacy controls remain free. | 13 | Free-tier detail |
| Review reuse tools — $18 | 5 | Button |
| Private weekly timecards for freelancers. | 5 | Footer description |
| Terms | 1 | Footer link |
| Param Factory (external) | 3 | External link |
| Build r7 · 2026-08-29 | 3 | Build label |

## README

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

## Paid and legal copy reviewed in round 3

The changed dialog and legal wording remains under 22 words per sentence, uses the same billing name everywhere, and makes no untested quantity, merchant-role, or backend-architecture promise.

| Copy | Words | Location |
| --- | ---: | --- |
| Unlock saved patterns and week copying | 6 | Pattern Deck dialog heading |
| Clone a previous week into matching days | 7 | Pattern Deck dialog feature |
| Save reusable work patterns | 4 | Pattern Deck dialog feature |
| Checkout is hosted by Sociobot. | 5 | Pattern Deck dialog, Privacy, Terms |
| Send payment and refund questions there. | 6 | Pattern Deck dialog, Privacy, Terms |
| You can use the app without an account. | 8 | Privacy policy |

## Terminology

| Concept | Required word |
| --- | --- |
| Saved week of work | weekly timecard |
| Visual seven-day view | weekly board |
| Calendar records | calendar events |
| Imported calendar container | calendar file |
| Recorded span | work block |
| Spreadsheet export | CSV |
| Complete portable data copy | JSON backup |
| Paid reuse feature | Pattern Deck, after its reuse result is explained |
| Isolated sample environment | demo |
