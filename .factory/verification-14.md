# Verification 14 — PASS

Date: 2026-08-30 UTC
Work order: `backfill-timecards-verify-14`
Candidate: `601f222bf2bdde6652966942f54ce7eda6e34278`
Live URL: <https://backfill-timecards.sociobot.in>

## Decision

**PASS.** Fresh independent evidence shows that the live PWA is the exact build from the candidate and meets the researched brief: a freelancer can reconstruct a retrospective week from memory or a reviewed local calendar, correct it, and export invoice-ready CSV without an account or ordinary network disclosure.

## Cold first read

The cold landing page says **“Reconstruct your freelance workweek.”** It says it is for **freelancers logging work after the fact** and turns reviewed calendar events and memory into an invoice-ready weekly timecard. The first primary action is the one-click **“Try it with sample data”** link, with the adjacent explanation that it opens a separate weekly timecard without changing real work. This passes the plain-words and demo-sandbox first-screen contract.

## Required claims — clean install and demo entry point

After `npm ci`, every exact command listed in `.factory/claims.json` was run separately with Chromium against the packaged demo. All passed (one test each):

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

There is a valid claims registry and no claim test failed.

## Local quality gates and functional coverage

- `npm test`: **PASS** — 13 Vitest unit/contract tests and 58 Playwright tests (29 desktop Chromium, 29 390 px mobile) passed.
- `npm run typecheck`, `npm run lint`, and `npm run build`: **PASS**. `dist/` was produced.
- The initial JS is 48,692 bytes raw / 14,489 bytes gzip; CSS is 19,647 bytes raw / 5,005 bytes gzip. Both are within budget.
- The suite exercised normal entry persistence and known-project client recall; edit/copy/delete/undo; CSV and JSON export/restore/erase; malformed-backup preservation; invalid time recovery; recurring-until and overnight `.ics` review/import; explicit billable choice; selective import; and locked/free Pattern Deck boundaries.
- The aggregate suite had one earlier non-claim mobile accessibility test failure during the first all-project invocation. It passed immediately in isolation, then both complete per-project runs (29/29 each) and a repeat exact `npm test` (58/58) passed. No reproducible product defect remained.

## Live, accessibility, privacy, and PWA evidence

- `/opt/fleet/lib/verify-url.sh` passed on the root: HTTP 200, title, `lang=en`, one h1, main landmark, no missing image alt text, no unlabeled buttons, and zero page/console errors (639 ms cold load).
- Fresh Playwright scans of live `/demo` at 1440×900 and 390×844 found **zero serious/critical axe violations**, no console/page errors, no horizontal overflow, and 44 px Reset-demo/Start-for-real controls. Keyboard Tab reaches the skip link and Enter moves focus to `#main`.
- Reduced-motion media was honored. Visual inspection confirms the supplied cassette/timecard art and readable product-specific board presentation at desktop; the mobile automated layout checks passed.
- Cold root and Demo request logs contained only `https://backfill-timecards.sociobot.in` for HTML, local JS/CSS/icon/art. No analytics, ads, third-party fonts/scripts, account system, card field, or payment iframe was observed. The normal-work privacy claim is also covered by its tagged request-log test.
- A fresh live service-worker context became controlled; after switching offline, `/demo` reloaded with its sample board and visible “Offline · saved here” status. The deployed worker has versioned caches, `skipWaiting()`, `clients.claim()`, and an update toast path. Current `registration.update()` has no newer deployment to activate.
- Manifest data is present (`standalone`, icons, versioned start URL). `sw.js` is no-store; hash-named app JS is immutable for one year.
- Live Lighthouse on `/demo`: Performance **94**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1.219 s, CLS 0, TBT 298.5 ms.

## Headers, rate limit, and deployment identity

- Live responses provide HSTS, `nosniff`, `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'`, strict referrer policy, restrictive permissions policy, and same-origin COOP/CORP. Root HTML is no-cache; static assets carry immutable caching; the designed missing route returns HTTP 404.
- This static PWA has no product-owned server endpoint or sign-in flow, so backend persistence/concurrency/health and Entra checks do not apply. The user-triggered Sociobot billing verification endpoint was independently rate-tested: invalid-token requests 1–30 returned 200; request 31 returned **429**. The resulting header included `Retry-After: 0`. Observed allowance: **30 verification requests per client window**.
- Fresh candidate-build artifacts match live exactly: `index.html` SHA-256 `dba6f60a33075cc2ee621e23eae3141e91ff51a4f6d8f6c3602036e9d40985b3`; `assets/index-JTjvwkYg.js` `465d8e1b48806373c7b6dd0f9f760e0ecfed36a0a49fe6dffccae8925ecc3427`; `assets/index-F37a4tX5.css` `95e27c26036740b9237fe3587a6084b9a8f6bb804c297035ad3e9ee3c7141a52`.

## Defects by severity

No release-blocking, high, medium, or low reproducible product defects found.

The pre-existing modified `graphify-out/` workspace files were preserved and excluded from this verification.
