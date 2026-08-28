# Backfill Timecards — verification handoff

Date: 2026-08-28 UTC

Work order: `backfill-timecards-verify-5`

Candidate: `bef3fb93d3b494de256aeabc65a3964068c13a1b`

Live URL: <https://backfill-timecards.sociobot.in/>

## Result: FAIL

The application candidate builds, deploys, and passes its local, browser, PWA, privacy, accessibility, response-policy, and rate-limit checks. Release is blocked because the advertised $18 Pattern Deck purchase link navigates to `https://api.sociobot.in/api/v1/products/backfill-timecards/checkout`, which returns **404** with `{"error":"enabled factory product","status":404}`. A customer cannot purchase the feature that the product offers.

The prior deployment-only rate-limit failure is resolved: after a fresh window, invalid-license verify requests 1–30 returned 200 and request 31 returned **429** with `Retry-After: 4`.

## How verified

```sh
# clean detached checkout at the candidate SHA
npm ci
npm run typecheck
npm run lint
npm test       # 8 unit + 28 Playwright checks passed
npm run build
git diff --check
```

- Exact clean-build root, manifest, service worker, privacy, and terms SHA-256 values match the live URL.
- Desktop and 390px mobile normal workflows, keyboard/focus, reduced motion, axe, console/page errors, normal outbound requests, offline reload, service-worker update toast, headers/caching, and bundle budgets passed.
- No product code was modified. Lighthouse 13.4.1 could not complete here because its Chromium tab crashed; no Lighthouse score is asserted in this verification.

## Required next step

Enable/register the existing Sociobot billing product endpoint so **Buy the one-time unlock** reaches hosted checkout, then rerun the live click-through and license-return smoke test. See `.factory/verification-5.md` for exact evidence and all passing coverage.
