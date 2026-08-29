# Independent product verification 9 — PASS

Date: 2026-08-29 UTC  
Work order: `backfill-timecards-verify-9`  
Candidate: `92b308ca74754ed17f51a74e5a3d36f5599d6f0c`  
Live URL: <https://backfill-timecards.sociobot.in/>  
Artifact: local-first offline PWA

## Verdict

**PASS — release candidate accepted.** No release-blocking defects were found. This is fresh evidence; it does not rely on the prior reported deployment-only failure.

The candidate delivers the brief's retrospective freelancer workflow: editable weekly work blocks, project-to-client recall, selective local calendar review/import, reusable patterns, local archive controls, invoice-ready CSV, and an offline PWA. Calendar descriptions are optional and billability is an explicit choice; no time is inferred automatically.

## Mandatory first checks

`npm ci` completed from the supplied clean candidate (68 packages; zero audit vulnerabilities). Every exact command in `.factory/claims.json` was then run separately through its `/demo` entry point before other repository checks.

| Claim | Result | Observable result asserted by its tagged test |
| --- | --- | --- |
| `demo-sandbox` | PASS | Isolated sample, reset, real-data separation, and tab-lifetime cleanup |
| `weekly-board` | PASS | Add, edit, copy, delete/undo, and client recall |
| `calendar-local` | PASS | Local selective recurrence/overnight import, description and billability choices |
| `csv-export` | PASS | Complete header and one CSV row per sample record |
| `local-archive` | PASS | Export, erase, and restore local JSON archive |
| `offline-reload` | PASS | Manifest metadata and controlled offline demo reload |
| `pattern-deck` | PASS | Saved pattern and previous-week copy with core tools free |
| `privacy-local` | PASS | Same-origin normal use, IndexedDB, no account/demo/license state |
| `billing-entitlement` | PASS | $18 checkout URL, verification gate, 24-hour cache boundary, and revocation |

Cold live-page first-read test: **PASS** at 1440px. It says it will **“Reconstruct your freelance workweek”**, names **freelancers logging work after the fact**, and makes **“Try it with sample data”** the immediate primary action. The adjacent sentence explains that the sample opens separately without changing real work. One click opens `/demo` with six realistic records and the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, and Start for real.

## Local candidate gates

| Check | Result |
| --- | --- |
| `npm test` | PASS — 11 Vitest tests; 47 Playwright tests passed across desktop and 390×844 mobile; 1 intentional mobile-only desktop skip |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` produced |
| `git diff --check` | PASS |
| Initial JS/CSS | PASS — 46,242 B / 14,078 B gzip JS; 18,406 B / 4,758 B gzip CSS |
| Lighthouse 13.4.1 local mobile report | PASS — Performance 92, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, CLS 0 |

Lighthouse emitted a post-collection Chromium tab-crash warning, but wrote a complete valid report with the scores and metrics above; it is a harness warning, not a page error.

## Independent product exercise

Fresh Playwright use of the deployed product confirmed a normal work block persists in the real `backfill-timecards` IndexedDB database. Equal start and end times produced the recoverable error **“End time must be later than start time.”** Correcting the end time saved the record. The demo contained six current-week tracks (`Plan the website sprint`, `Review launch copy`, etc.) in tab-scoped `demo:backfill-timecards` session storage.

The automated suite additionally covered malformed-backup recovery without data loss, bounded recurrence and overnight `.ics` events, default non-billable calendar imports, explicit billability, selective descriptions, CSV field/row correctness, JSON archive restore, patterns, license revoke/recovery, desktop and 390px behavior, and keyboard dialog focus return.

## Live privacy, accessibility, PWA, and delivery

- `verify-url.sh https://backfill-timecards.sociobot.in /tmp/backfill-live-verify`: PASS — HTTP 200, title, `lang=en`, one h1, main landmark, all images with alt attributes, labelled buttons, and zero console/page errors (1,015 ms navigation).
- Fresh Axe scans on `/`, `/demo`, `/privacy/`, and `/terms/`: **zero serious or critical violations**.
- Keyboard: Tab order began with the skip link and reached the sample action; each observed focus target had a visible 4px coral outline. Reduced-motion mode reduced transitions to `0.01ms`.
- On a 390px demo, six tracks and the demo banner rendered; offline reload after service-worker control retained the sample board and showed `Offline · saved here`.
- A fresh QA-only local service-worker update harness first served an older cache namespace, then the exact candidate worker. The live app displayed **“An updated timecard is ready.”** with a visible Refresh button and no console errors.
- Normal add/edit activity and demo navigation logged only `https://backfill-timecards.sociobot.in` requests: no analytics, ad, third-party font, third-party script, calendar-upload, or account requests. Browser response headers include HSTS, `nosniff`, DENY framing, strict-origin referrer policy, CSP response-header `frame-ancestors 'none'`, COOP, CORP, and a restrictive Permissions Policy.
- Documents use `no-cache`; hashed JS/CSS use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`. `/`, `/demo`, `/privacy/`, `/terms/`, manifest, worker, offline page, robots, sitemap, and 404 all returned their expected status (unknown route: 404).

## Candidate/live identity and server allowance

Fresh clean build bytes equal the live deployment:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `c87520b48cbc0d38cfbf382e8300f0b7f4a3f2d7f904f47113db8e62b5922543` |
| `assets/index-yP_b5WNC.js` | `bd136aeed23653986feb3b2b6446aac345469cde8ad09a664d395fb508f5ddaf` |
| `assets/index-tnjOD136.css` | `2c36da5c73499719b155ab5b4199ebe9637442bd44ffc896058d872ec1774b19` |
| `sw.js` | `d8590d3c5bd9796b5ecd85120243fd91df7ada1434209310a955a20364e27b38` |
| `manifest.webmanifest` | `a2d6cbbe52a1e3bb816aaf2ae4a76143f176b9fe6c9ac80153dc777444d11cfd` |

The static PWA has no product backend or sign-in. Its only server-side product call is Sociobot billing verification. A fresh sequential burst of invalid tokens to `GET /api/v1/products/backfill-timecards/verify` returned 200 for requests 1–30 and **429 with `Retry-After: 4`** for requests 31–40. Observed allowance: **30 requests per client window**.

## Defects by severity

None.

The pre-existing dirty `graphify-out/` analysis files were not changed, staged, or included in this verification.
