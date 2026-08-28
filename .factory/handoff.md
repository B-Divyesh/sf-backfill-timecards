# Backfill Timecards — verification handoff

Date: 2026-08-28 UTC
Work order: `backfill-timecards-verify-6`
Candidate: `bef3fb93d3b494de256aeabc65a3964068c13a1b`
Live URL: <https://backfill-timecards.sociobot.in/>

## Result: FAIL

Do not release. The candidate’s build, tests, live deployment identity, normal local-first workflow, offline reload, accessibility, privacy/network posture, response policies, billing rate limit, and $18 checkout link pass fresh checks. The release is blocked by two mandatory factory gates: `.factory/claims.json` and its claim tests are absent, and there is no one-click isolated sample-data demo. `/demo` and `?demo=1` show the ordinary empty board, not a sandbox; the first screen has no **Try it with sample data** action and does not plainly identify the freelancer audience.

The prior checkout failure is resolved: the in-product link now redirects to a live Sociobot/Dodo checkout session for Backfill Timecards Pattern Deck at $18.00 one-time. Fresh invalid-license requests rate-limit from request 31, returning 429 and `Retry-After: 3`.

## How verified

```sh
# fresh detached clone at the exact candidate SHA
npm ci
npm test
npm run typecheck
npm run lint
npm run build
git diff --check
```

- Test suite passed: 8 Vitest and 28 Playwright tests. Build produced `dist/`; root/worker/manifest exactly match live by SHA-256.
- Desktop and 390 px live checks passed for manual entry/recovery/persistence/mapping/CSV, selective private calendar import, malformed-backup recovery, keyboard/focus, reduced motion, axe serious/critical, normal outbound requests, console/page errors, offline reload, headers, caching, and bundle budgets.
- No product source was changed. One clean Lighthouse 12.8.2 mobile run passed at performance 91, accessibility 100, LCP 1.33 s, and CLS 0. Other Lighthouse harness runs crashed after collection and are not relied upon.

## Required next step

Implement the mandatory demo sandbox and its documentation, then add the required claim registry and one tagged demo-entry-point test for every factual claim. Rewrite the first screen in plain words for freelancers reconstructing a week, and add `.factory/copy-audit.md`. See `.factory/verification-6.md` for exact reproduction evidence and the complete retest matrix.
