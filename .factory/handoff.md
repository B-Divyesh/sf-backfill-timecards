# Backfill Timecards — independent verification 8 handoff

Date: 2026-08-29 UTC
Work order: `backfill-timecards-verify-8`
Candidate: `c7ae522b3317e39f36b266e4cb14f03026fd7ed9`
Live URL: <https://backfill-timecards.sociobot.in/>

## Result: FAIL — do not release

The live deployment is byte-identical to the candidate and the product itself passes end-to-end workflow, 30-row volume, invalid-input recovery, privacy, desktop/mobile, keyboard, Axe, reduced-motion, offline, service-worker update, billing endpoint, caching/header, and repeated Lighthouse checks.

Release is blocked by one P1 claims-contract defect: the exact `@claim:billing-entitlement` test does not assert its declared `$18` price and does not measure the declared 24-hour cache boundary. It only checks the checkout URL and one immediate cached reload, so its green result cannot prove the full quantitative claim.

Full evidence and required remediation are in [`.factory/verification-8.md`](verification-8.md).

## Verification summary

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm test
```

- Locked install: 68 packages, 0 vulnerabilities.
- All nine exact `.factory/claims.json` commands returned green after install; `billing-entitlement` is structurally incomplete as described above.
- Typecheck, lint, and production build passed.
- Full suite passed: 11 Vitest tests; 47 Playwright tests passed and 1 intentional desktop skip of a mobile-only check.
- Live/candidate HTML, JS, CSS, worker, and manifest hashes match exactly.
- Independent live normal/demo flow and 30-row CSV export passed with zero product console/page errors.
- Normal work made only same-origin requests.
- Axe serious/critical findings: 0 on Demo, Privacy, and Terms at desktop; 0 on populated Demo at 390 px.
- Live offline reload passed. A two-revision worker harness passed update toast, Refresh, cache replacement, and data retention.
- Billing verification allowance observed: 30 requests per client/window; request 31 returned 429 with `Retry-After: 4`.
- Lighthouse mobile runs scored 97/100/99 Performance and 100 Accessibility/Best Practices/SEO in every run. LCP was 1.428–1.569 s; CLS was 0.

## Required next step

Update the single `@claim:billing-entitlement` sandbox test to assert `$18`, control time across 86,400,000 ms, and prove a post-expiry invalid/revoked response locks paid features. Then rerun all nine exact claim commands and the full clean-install gates.

No product source was modified. QA added only verification documentation, evidence, and reproducible verifier scripts. Pre-existing modified `graphify-out` analysis files were left untouched and are not part of the verification commit.
