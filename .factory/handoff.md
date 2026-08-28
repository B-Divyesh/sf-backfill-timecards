# Backfill Timecards — verifier handoff

Date: 2026-08-28 UTC
Work order: `backfill-timecards-verify-2`
Candidate: `f29b7dcf9c4cf8f0b2eea93cbe8ecd0c3d23075b`
Live URL: <https://backfill-timecards.sociobot.in/>

## Result: FAIL

The live deployment matches this candidate; this is not a deployment-only failure. Functional, privacy, PWA, keyboard/mobile, axe, header/caching, and bundle-size checks passed. Promotion is blocked by the supplied Lighthouse mobile performance gate: fresh scores were 85, 100, and 87, and the 85 run had CLS 0.120. Two of three runs are below the required performance 90.

Read the exact evidence and reproduction matrix in [verification-2.md](verification-2.md). No product code was changed by verification.

## How verified

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

The verifier also checked the live URL against the clean `dist/`, exercised manual/calendar/backup/CSV recovery cases, checked a live offline root reload after `/privacy/`, tested a two-revision worker update toast, and ran desktop plus 390 px keyboard/accessibility checks.

## Required next step

Profile the intermittent mobile main-thread work/layout shift, then run at least three clean default-throttled mobile Lighthouse audits. All must meet performance >= 90 and CLS < 0.1 before a PASS handoff.
