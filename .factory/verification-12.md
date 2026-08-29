# Independent verification 12 — PASS

Date: 2026-08-29 UTC  
Verifier work order: `backfill-timecards-verify-12`  
Candidate commit: `de566d44f3f4d7df9070180f05f0528b210d2f76`  
Live URL: <https://backfill-timecards.sociobot.in>

## Verdict

**PASS.** The deployed PWA matches the candidate and meets the researched brief's retrospective, local-first weekly-timecard workflow.

## Required cold read and demo

Cold-opening the live home page at 1440×900 states: **“Reconstruct your freelance workweek.”** It says it is for freelancers logging work after the fact and says that reviewed calendar events and memory become an invoice-ready timecard. The first primary action is **“Try it with sample data”**, immediately explained as opening a separate timecard without changing real work.

The action opens `/demo` in one click. It showed the persistent “Demo — sample data, nothing is saved” banner, Reset demo, Start for real, and six realistic sample records. This passes the plain-words and demo-sandbox gates.

## Clean-checkout quality gates

After `npm ci` (68 packages, 0 vulnerabilities), every exact command in `.factory/claims.json` was run separately using Chromium and the documented demo entry point:

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

Additional repository checks:

- `npm test`: PASS — 12 Vitest tests and 58 Playwright tests across Chromium desktop and 390px mobile. `test-results/.last-run.json` records `status: passed` with no failures.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; produced `dist/`.
- Built initial JS: 48,693 bytes / 14,610 bytes gzip; CSS: 19,647 bytes / 5,000 bytes gzip. Both are within the static-PWA budget.
- Local service-worker update simulation: PASS — update toast, Refresh action, replacement versioned cache, and six demo rows after update.

## Independent live evidence

- Deployment identity: local and live SHA-256 values matched for `index.html`, the hashed JS and CSS, `sw.js`, `manifest.webmanifest`, and `hero-cassette-640.avif`.
- Privacy: Playwright recorded only `https://backfill-timecards.sociobot.in` during normal and demo work; no analytics, advertising, third-party fonts, scripts, or other off-origin runtime request appeared. Normal work never triggered billing.
- PWA: live `/demo` obtained a controlling service worker; after offline mode was enabled, reload retained the demo banner and six rows without console/page errors.
- Headers: HTTPS, HSTS, `nosniff`, DENY framing, strict referrer policy, restrictive CSP, COOP/CORP, and permissions policy are present. Hashed `/assets/*` and `/icons/*` responses use `public, max-age=31536000, immutable`; `sw.js` is no-store.
- Accessibility: live root had `lang`, title, one h1, main landmark, skip link, visible focus, no horizontal overflow at 390px, and no serious/critical Axe violations. Keyboard testing reached the skip link, entered the demo, operated dialogs, and restored focus. Reduced-motion CSS is present and was exercised.
- Errors: no console errors or page errors during cold load, demo, normal-work flow, mobile, or offline reload.
- Live workflow: invalid equal start/end times kept focus on End with an actionable error; correction to a 23:00–01:00 overnight record produced 2h, persisted across reload, and survived a malformed-backup restore attempt. Calendar import rejected an open-ended recurrence, required a selected event, imported selected daily/overnight events as non-billable by default, omitted confidential descriptions, and exported a 9-line CSV with the overnight calendar row. Demo remained isolated with six seed rows.
- Lighthouse mobile simulated result: Performance 94, Accessibility 100; FCP 1.20s, LCP 1.23s, CLS 0. The runner emitted a post-collection target-crash warning while taking its full-page screenshot, but produced scores; independent Playwright load, Axe, and error checks remained clean.

## Scope notes

This is a static PWA with no product-owned server endpoint or sign-in flow, so concurrency/persistence-server and Entra checks do not apply. The optional user-triggered license verification is an external Sociobot billing endpoint; normal work made no such request. No product-side documented request allowance exists to test, so no rate-limit allowance was observed or inferred.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
