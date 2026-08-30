# Backfill Timecards — polish round 4

Date: 2026-08-30 UTC

Work order: `backfill-timecards-polish-4`

Product repair commit: `22618bc8e9a54b96b588c282fdca9aef837952de`

Deployment: `c40d39eb-af09-4916-96e3-244ee809aba4`
Live URL: <https://backfill-timecards.sociobot.in>

All four reviews and all three earlier polish reports were read in full. Round 4 reopened only F-3-2, but every earlier item was checked again in the clean suite and on the cold live deployment.

## Finding map

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo opens on the populated weekly board, not the marketing hero. | `@claim:demo-sandbox`; [mobile Demo](evidence/polish-4-live/demo-first-screen-mobile.png); live `/demo` has six rows and the first begins at 751px. |
| F-1-2 | All three privacy, offline, and price facts fit in the first screen. | `keeps all first-screen facts visible at 1440 by 900`; [mobile root](evidence/polish-4-live/root/screenshot-mobile.png); live fact bottoms are 685px, 713px, and 762px. |
| F-1-3 | Product copy consistently says “calendar events.” | Static-shell contract; [live root](evidence/polish-4-live/root-cold-desktop.png); `/`. |
| F-1-4 | “Weekly timecard” names saved work and “weekly board” names its view. | `.factory/copy-audit.md`; `@claim:weekly-board`; live `/` and `/demo`. |
| F-1-5 | The first-screen price fact explains saved patterns and previous-week copying. | Static-shell contract; [mobile root](evidence/polish-4-live/root/screenshot-mobile.png); `/`. |
| F-1-6 | The toolbar action says “Reuse saved blocks — $18.” | `@claim:billing-entitlement`; [Demo](evidence/polish-4-live/demo/screenshot-desktop.png); `/demo`. |
| F-1-7 | The paid-section action says “Review reuse tools — $18.” | Static-shell contract; [root](evidence/polish-4-live/root/screenshot-desktop.png); `/`. |
| F-1-8 | README names Manual, Calendar, and Pattern work blocks. | `.factory/copy-audit.md`; `@claim:weekly-board`; repository README. |
| F-1-9 | README explains ending daily/weekly recurrence and overnight events plainly. | `@claim:calendar-local`; `.factory/copy-audit.md`; repository README. |
| F-1-10 | README explains remembered clients without implementation notation. | `@claim:weekly-board`; `.factory/copy-audit.md`; repository README. |
| F-1-11 | README says “web-app installation metadata,” not unexplained PWA jargon or an untested install outcome. | `@claim:offline-reload`; repository README. |
| F-1-12 | README explains temporary storage limited to the Demo tab; `.factory/demo.md` keeps the exact key. | `@claim:demo-sandbox`; live `?demo=1` storage in `cold-check.json`. |
| F-1-13 | README separates normal local data, Demo data, and license settings. | `@claim:privacy-local`; `@claim:demo-sandbox`; repository README. |
| F-1-14 | Long build jargon was removed; audited copy stays at 22 words or fewer. | `.factory/copy-audit.md`; factory contract; live `/`. |
| F-1-15 | README accurately separates seven Demo-starting claims from three normal-workspace claims. | All ten clean-clone claim commands passed; `.factory/claims.json`. |
| F-1-16 | Billing coverage proves there is no provider frame, card field, or third-party payment script. | `@claim:billing-entitlement`; [unlock dialog](evidence/polish-4-live/unlock-dialog-desktop.png); `/`. |
| F-1-17 | The unsupported universal claim-test meta-claim remains absent. | Factory claim-registry contract; `.factory/copy-audit.md`. |
| F-1-18 | The unverified Node-version promise remains absent. | README audit; clean `npm ci` and suite. |
| F-1-19 | The unregistered visitor-facing stack assertion remains absent. | README audit; factory contract. |
| F-1-20 | README uses the tested request-boundary statement instead of an architecture promise. | `@claim:privacy-local`; live request origins in `cold-check.json`. |
| F-1-21 | Visitor copy does not assert a Playwright version. | README audit; clean lockfile install and browser suite. |
| F-1-22 | README gives `npm test` as an instruction without a product claim. | Clean-clone `npm test`: 71 tests passed. |
| F-1-23 | README gives deploy instructions without an unsupported output promise. | Route-metadata browser test; built `dist/demo/index.html`; live `/demo` 200. |
| F-1-24 | README instructs serving `/sw.js` from root without asserting scope. | `@claim:offline-reload`; [offline Demo](evidence/polish-4-live/query-demo-offline.png). |
| F-1-25 | Unsupported deployment-header marketing remains absent. | Live header check; immutable hashed assets, no-cache HTML, and no-store service worker observed. |
| F-1-26 | Unsupported artwork-provider footer copy remains absent; provenance stays in design notes. | Footer contract; `.factory/design.md`; [root](evidence/polish-4-live/root/screenshot-desktop.png). |
| F-1-27 | History navigation updates title/state, focuses the h1, and announces the route. | `moves focus and announces app route changes through click, Back, and Forward`; live `backFocusesH1: true`. |
| F-1-28 | Root, Demo, legal pages, and 404 share the product header and complete footer. | Legal navigation/Axe test; [Privacy](evidence/polish-4-live/privacy-cold-desktop.png), [Terms](evidence/polish-4-live/terms-cold-desktop.png), [404](evidence/polish-4-live/not-found-cold-desktop.png). |
| F-1-29 | Physical Demo HTML has route-specific metadata before JavaScript. | `serves route-specific demo metadata before JavaScript`; live `/demo` title and canonical in `cold-check.json`. |
| F-1-30 | 404 has social metadata and a distinct 180px Apple touch icon. | Factory route contract; [live 404](evidence/polish-4-live/not-found-cold-desktop.png); `/missing-round-four` returned 404. |
| F-1-31 | External links identify themselves as external. | Footer target/navigation tests; live root, legal, and 404 screenshots. |
| F-1-32 | Privacy, Terms, and 404 h1s name their pages directly. | Live route/Axe scan; legal and 404 screenshots linked above. |
| F-1-33 | Copy audit covers landing controls, README, changed dialog copy, counts, and terminology. | Updated `.factory/copy-audit.md`; factory copy contract. |
| F-2-1 | Calendar claim proves weekly `UNTIL`, exact dates, deselection, overnight duration, explicit choices, and local handling. | `@claim:calendar-local`; clean-clone PASS; live Demo route check. |
| F-2-2 | JSON-backup claim checks all nine entries, both mappings, the pattern, erase/restore, client recall, and restored pattern use. | `@claim:local-archive`; clean-clone PASS; live `/demo`. |
| F-2-3 | Pattern Deck claim operates add, calendar import, CSV, JSON backup, and erase controls while locked. | `@claim:pattern-deck`; clean-clone PASS; [settings](evidence/polish-4-live/settings-no-account-desktop.png). |
| F-2-4 | README promises installation metadata rather than browser installation. | `@claim:offline-reload`; repository README. |
| F-2-5 | Unsupported “clear” marketing language remains absent. | `.factory/copy-audit.md`; live `/`. |
| F-2-6 | Browser records are “local data”; downloaded files are “JSON backups.” | `@claim:local-archive`; [settings](evidence/polish-4-live/settings-no-account-desktop.png). |
| F-2-7 | Week controls say Show previous/current/next week. | Interactive browser suite; [Demo](evidence/polish-4-live/demo/screenshot-mobile.png). |
| F-2-8 | Instructions, empty states, and dialogs consistently say “work block.” | Browser dialog/empty-state tests; [mobile root](evidence/polish-4-live/root/screenshot-mobile.png). |
| F-2-9 | Row action says “Save pattern” with a result-first accessible name. | `@claim:pattern-deck`; live `/demo`. |
| F-2-10 | Pattern dialog h2 says “Reuse saved work blocks.” | `@claim:local-archive`; live `/demo`. |
| F-2-11 | Settings action says “Review reuse tools — $18.” | `@claim:pattern-deck`; [settings](evidence/polish-4-live/settings-no-account-desktop.png). |
| F-2-12 | Saved-pattern action says “Add to this week.” | `@claim:local-archive`; live `/demo`. |
| F-3-1 | Paid copy says “Save reusable work patterns” without an unproved quantity. | `@claim:billing-entitlement`; [unlock dialog](evidence/polish-4-live/unlock-dialog-desktop.png). |
| F-3-2 | Replaced settings’ “There is no cloud account” with “You can use the app without an account.” The privacy claim and source contract now assert this exact location and reject the old wording. | `@claim:privacy-local`; factory contract; [settings](evidence/polish-4-live/settings-no-account-desktop.png); live `/`. |
| F-3-3 | Dialog, Privacy, and Terms use only the tested Sociobot checkout wording; merchant-role claims remain absent. | `@claim:billing-entitlement`; unlock/legal screenshots; live `/`, `/privacy/`, `/terms/`. |
| F-3-4 | Paid dialog h2 names “saved patterns and week copying.” | `@claim:billing-entitlement`; [unlock dialog](evidence/polish-4-live/unlock-dialog-desktop.png). |
| F-3-5 | README says requests go “only to this site,” without same-origin jargon. | `@claim:privacy-local`; `.factory/copy-audit.md`; repository README. |

## Clean-clone claim evidence

Clean clone: `/tmp/backfill-polish4-clean.aZfdhn/repo` at `22618bc8e9a54b96b588c282fdca9aef837952de`. Each exact command in `.factory/claims.json` passed separately.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `demo-exit-cleanup` | PASS |
| `weekly-board` | PASS |
| `calendar-local` | PASS |
| `csv-export` | PASS |
| `local-archive` | PASS |
| `offline-reload` | PASS |
| `pattern-deck` | PASS |
| `privacy-local` | PASS |
| `billing-entitlement` | PASS |

The same clone then passed `npm test` (13 unit/contract and 58 desktop/mobile browser tests), `npm run typecheck`, `npm run lint`, and `npm run build`. Its status was clean after verification.

## Cold live evidence

- `cold-check.json` covers fresh contexts for `/`, `/demo`, `/?demo=1`, `/privacy/`, `/terms/`, a real 404, settings, paid copy, history focus, request origins, Demo storage, and offline reload.
- Every scanned route has one h1, one main landmark, `lang=en`, route metadata, no horizontal overflow, no console/page errors, and zero serious or critical Axe findings.
- Local and live root, Demo, JavaScript, and CSS SHA-256 hashes match.
- Live Lighthouse: root desktop 100 performance/accessibility/best practices/SEO, LCP 0.3s and CLS 0; Demo mobile 100/100/100/100, LCP 1.2s and CLS 0.

No finding remains open.
