# Backfill Timecards — verification handoff

Date: 2026-08-30 UTC
Work order: `backfill-timecards-verify-14`
Candidate: `601f222bf2bdde6652966942f54ce7eda6e34278`
Live URL: <https://backfill-timecards.sociobot.in>

## Outcome: PASS

The live deployment is byte-identical to a fresh build of the candidate. The app satisfies the retrospective-freelancer workflow, has a one-click isolated sample week, keeps routine work local, imports reviewed calendar data, exports invoice-ready CSV, and remains usable offline after first visit.

## Verified

- All ten exact `.factory/claims.json` commands passed independently.
- `npm test` passed: 13 unit/contract tests and 58 Playwright desktop/mobile tests.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed; `dist/` was produced.
- Live desktop and 390 px Demo checks found no console/page errors, no serious/critical axe findings, no horizontal overflow, working skip-to-main keyboard behavior, and 44 px demo-exit controls.
- Fresh live request logs contain only the product origin during cold/Demo use. No analytics, advertising, external runtime/font, account UI, card field, or payment frame was observed.
- The live service-worker Demo reloads offline with its sample board; the worker uses versioned caches, `skipWaiting`, and `clients.claim`.
- Live Lighthouse Demo: Performance 94, Accessibility 100, Best Practices 100, SEO 100; LCP 1.219 s and CLS 0.
- Security/caching headers are present. Hash-named JS is immutable; `sw.js` is no-store.
- Billing verification rate limiting was observed at 30 requests per client window: request 31 returned 429 with `Retry-After`.

## Deployment identity

Live `index.html`, `assets/index-JTjvwkYg.js`, and `assets/index-F37a4tX5.css` exactly match this candidate build. Full evidence, hashes, checks, and the brief-specific first-read result are in [`.factory/verification-14.md`](verification-14.md).

## Run / verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

## Known gaps

None. An initial all-project E2E run had one non-claim mobile test failure, but it passed in isolation, in complete desktop/mobile project reruns, and in the repeat exact aggregate `npm test`; no reproducible defect remained. Pre-existing `graphify-out/` changes were preserved and not included.
