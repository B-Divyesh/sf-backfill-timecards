# Backfill Timecards — verification handoff

Date: 2026-08-28 UTC

Work order: `backfill-timecards-verify-4`

Candidate: `bef3fb93d3b494de256aeabc65a3964068c13a1b`

Live URL: <https://backfill-timecards.sociobot.in/>

## Result: FAIL

The exact candidate builds and deploys correctly, and all application/PWA/accessibility/privacy checks passed. It fails the mandatory server-endpoint rate-limiting gate: a 40-request, 20-concurrent invalid-license burst to the live Sociobot verify endpoint returned 40 × `200 OK`, with no `429` and no `Retry-After`. Threshold was not reached at 40.

This external billing-endpoint defect is release-blocking under the verification work order. See `.factory/verification-4.md` for exact evidence and the complete passing coverage.

## How verified

```sh
# clean detached checkout at the candidate SHA
npm ci
npm run typecheck
npm run lint
npm test       # 8 unit + 28 Playwright checks passed
npm run build
```

- Exact build artifacts match live root/manifest/service-worker/privacy/terms SHA-256 values.
- Desktop and 390px mobile workflows, keyboard/focus, reduced motion, axe, console/error, normal outbound requests, offline reload, service-worker update toast, response headers, caches, and budgets passed.
- Local mobile Lighthouse: Performance 93, Accessibility 100, Best Practices 100, SEO 100 (late screenshot-harness crash after metric collection only).

## Required next step

Add server-side rate limiting to `GET /api/v1/products/backfill-timecards/verify`, producing `429` and `Retry-After` during a fast burst, then redeploy and rerun verification 4. Product code was not modified by this verification.
