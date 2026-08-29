# Backfill Timecards — independent verification 11

Date: 2026-08-29 UTC

Work order: `backfill-timecards-verify-11`  
Candidate: `8698917929078829a1ddaf0e513a46137dc9387d`  
Live URL: <https://backfill-timecards.sociobot.in>

## Result: PASS

The candidate is releasable. The fresh live deployment matches the candidate's production output byte-for-byte for every 24 publicly served build artifact (the deployment-only `staticwebapp.config.json` correctly returns 404). The earlier deployment-only concern does not reproduce.

## Mandatory first-read and demo gate

**PASS.** A cold, 390×844 fresh-browser visit answered all three required questions in plain words:

- **What it does:** “Reconstruct your freelance workweek” into a timecard ready for invoicing.
- **For whom:** “For freelancers logging work after the fact.”
- **First action:** the visible primary **Try it with sample data** link, with the adjacent explanation that it opens a separate weekly timecard without changing real work.

The same first screen showed the three required facts: records stay on the device, it works offline after the first visit, and Pattern Deck costs $18 once. One click reached `/demo`, which immediately showed six realistic work blocks and the persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real**.

## Claim gate — required before other QA

`.factory/claims.json` exists and contains ten uniquely tagged claims. In a fresh detached worktree at the candidate SHA, after `npm ci`, every exact command was run separately against the packaged preview/demo entry point. All passed.

| Claim | Exact result |
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

This is 10/10, including the previously failing deterministic billing-clock claim. The claim test now freezes the clock before navigation and assertions, so it no longer attempts to pause in the past.

## Clean-checkout and build gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS in the fresh detached worktree — 68 packages, zero audit vulnerabilities |
| `npm run test:unit` | PASS — 12 tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 12 unit/contract tests and 58 Playwright desktop/mobile tests; Playwright recorded no failed tests |
| `npm run build` | PASS — production `dist/` created |

Production output is within the static/PWA budgets: initial JavaScript is 48,647 bytes raw / 14,510 bytes gzip; CSS is 19,647 bytes raw / 4,982 bytes gzip; no web fonts ship. The production `dist/` contains 25 files including the deployment configuration.

## Fresh live product QA

- Normal work: added a real-workspace block; it persisted in the `backfill-timecards` IndexedDB database. No demo storage, license setting, account control, console error, page error, or off-origin request appeared.
- Validation and recovery: the automated suite separately exercised invalid equal start/end times, correction, malformed-backup preservation, delete/undo, edit/copy, and project-to-client recall. Fresh live calendar import also added a 23:00–01:00 overnight event as two hours, left it **NOT BILLABLE** by default, and omitted its private description.
- Export: a fresh live demo CSV download was named `timecard-2026-08-24.csv`, had the complete quoted invoice header, seven lines (header plus six visible sample rows), and included the shipped sample data.
- Privacy: cold and normal-use Playwright request logs contained only `https://backfill-timecards.sociobot.in`. No analytics, advertising, third-party font/script, payment frame, or account UI was observed. The optional entitlement flow is explicitly user-triggered and the tagged entitlement test verifies Sociobot-hosted checkout, forged-token lock, one-day cached verdict, and revocation lock.
- PWA: live `/demo` became service-worker controlled; after the context was set offline, reload retained all six demo rows and displayed **Offline · saved here**. The two-revision update simulation passed: update toast and Refresh action appeared, the `backfill-v1.0.8-qa-b-shell` cache replaced the old cache, and the sample remained intact.
- Accessibility and interaction: axe on `/`, `/demo`, `/privacy/`, `/terms/`, and the real 404 at desktop/390px had zero serious or critical violations. At 390px, `scrollWidth` equalled 390 and no visible link, button, or input measured under 44px in either dimension. Keyboard first Tab reached the skip link; Enter moved focus to `main`. Reduced-motion transition and animation durations were `0.01ms`. Repository interaction tests also passed dialog focus trapping, Escape, and focus restoration.
- Performance: fresh mobile Lighthouse scored Performance 95, Accessibility 100, Best Practices 100, SEO 100; FCP 1.8s, LCP 1.8s, TBT 200ms, CLS 0, total transfer 70 KiB.

## Live deployment, headers, and server boundary

- SHA-256 comparison found no mismatch between the local candidate build and every public live artifact. Root and Demo HTML, hashed JS/CSS, worker, manifest, legal/404 pages, icons, and art all match.
- Root is `200` with `Cache-Control: no-cache, must-revalidate`; the hashed JS is one-year immutable; `sw.js` is `no-cache, no-store, must-revalidate`; a conditional root request returned `304`. HTTP redirects to HTTPS. Unknown routes return the designed `404`.
- Live headers include HSTS, CSP with `frame-ancestors 'none'`, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy, COOP, CORP, and `X-Frame-Options: DENY`. The manifest is served as `application/manifest+json`.
- The product has no product-owned server endpoint or sign-in system, so backend concurrency/health/build identity and Entra tenant checks do not apply. The external Sociobot billing verification endpoint was tested as required: requests 1–30 from this client returned 200; request 31 returned `429` with `Retry-After: 3`. Observed allowance: 30 requests per client window.

## Defects by severity

- **Blocker:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.

## Verification commands

```sh
npm ci
npm run test:e2e -- --project=chromium --grep @claim:demo-sandbox
npm run test:e2e -- --project=chromium --grep @claim:demo-exit-cleanup
npm run test:e2e -- --project=chromium --grep @claim:weekly-board
npm run test:e2e -- --project=chromium --grep @claim:calendar-local
npm run test:e2e -- --project=chromium --grep @claim:csv-export
npm run test:e2e -- --project=chromium --grep @claim:local-archive
npm run test:e2e -- --project=chromium --grep @claim:offline-reload
npm run test:e2e -- --project=chromium --grep @claim:pattern-deck
npm run test:e2e -- --project=chromium --grep @claim:privacy-local
npm run test:e2e -- --project=chromium --grep @claim:billing-entitlement
npm run test:unit
npm run typecheck
npm run lint
npm test
npm run build
```
