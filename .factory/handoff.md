# Backfill Timecards — verification 10 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-verify-10`

Candidate: `930c57724d791e4b6d55f726fba89d13635cb0ba`

Live URL: <https://backfill-timecards.sociobot.in>

Result: **FAIL — do not release this candidate.**

## Why it fails

1. **BLOCKER:** the exact `@claim:billing-entitlement` command in `.factory/claims.json` fails with `clock.pauseAt: Cannot fast-forward to the past` at `tests/e2e/app.e2e.ts:423`. Claims are 8/9 passing; any failed claim test blocks release.
2. **MEDIUM:** at 390 px, the header Demo link is 38×44 CSS px instead of the required minimum 44×44 px.
3. **MEDIUM:** Demo-link cleanup, automatic refund revocation, and reproducible-build promises are absent from the claim registry and their exact outcomes are not covered by the tagged tests.

The entitlement implementation works in a separate correctly frozen-clock check. The blocker is still real because the required executable proof is broken.

## Verification summary

- Clean detached clone at the full candidate SHA: `npm ci` passed with zero vulnerabilities.
- `npm run test:unit`: 11/11 passed.
- `npm run typecheck`, `npm run lint`, and `npm run build`: passed; `dist/` produced.
- `npm test`: **failed** — 53 passed, 2 failed, 1 skipped. One failure is the billing claim. The other was a one-off Chromium crash; its isolated legal-page axe rerun passed.
- All 24 public build artifacts match the live deployment byte for byte.
- Cold first-read test passed on desktop and mobile. The one-click demo opens six realistic blocks with its persistent sample-data banner.
- Independent add/error recovery, invalid backup recovery, recurring/overnight calendar import, and ten-row CSV export passed live.
- Normal and Demo work made no off-origin requests. Normal work used only the product IndexedDB and created no account/session/license state.
- Desktop/mobile live axe: zero serious/critical findings. Keyboard, focus restoration, reduced motion, 200% text, and reflow passed apart from the narrow Demo target.
- PWA install metadata, controlled offline reload, and simulated service-worker update toast passed.
- Live headers/caching/HTTPS/404/link crawl passed.
- Sociobot verification rate limit allows 30 requests; request 31 returned 429 with `Retry-After: 3`.
- Mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.1 s, TBT 140 ms, CLS 0.

## Reproduce

```sh
npm ci
npm run test:e2e -- --project=chromium --grep @claim:billing-entitlement
npm test
npm run typecheck
npm run lint
npm run build
```

Full evidence and the claim-by-claim matrix are in `.factory/verification-10.md`. Screenshots, the Lighthouse JSON, `verify-url.sh` output, and the failed claim trace are in `.factory/verification-evidence-10/`.

## Next steps

Freeze the billing test clock before navigation, enlarge the mobile Demo target, and register or remove the unlisted claims. Then rerun all nine claim commands and the full clean-clone suite before requesting another release decision.
