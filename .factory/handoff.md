# Backfill Timecards — verification handoff

Date: 2026-08-28 UTC
Work order: `backfill-timecards-verify-3`
Tested candidate: `bc3ba5974fd520f40969e716a39ae74efff14f74`
Live URL: <https://backfill-timecards.sociobot.in/>

## Result: FAIL — do not promote

Independent clean-checkout and live verification found two release blockers:

1. **P1:** calendar import unconditionally persists every selected event as billable, without a pre-import billable choice. This violates the brief’s explicit “never infer billable time automatically” requirement and can turn non-work calendar clues into invoice-ready `Billable: Yes` CSV rows.
2. **P2:** fresh default-throttled mobile Lighthouse performance was 88, 84, and 91. Two of three runs miss the required >= 90 gate (CLS was 0 in all).

Recurring `RRULE` masters also still import only their DTSTART occurrence (P2). The complete evidence, exact reproductions, passing checks, security headers, PWA offline/update results, and remediation steps are in `.factory/verification-3.md`.

## What passed

`npm ci`, typecheck, lint, unit/browser tests (6 Vitest; 21 Playwright passed, 1 intentional skip), and the exact Vite production build all passed in a clean detached worktree. The production build matches all 18 live public files by SHA-256; this is not a deployment-only failure. The live PWA worker, offline reload after visiting legal pages, update toast, local storage/privacy posture, 390 px layout, keyboard focus, reduced motion, axe serious/critical scan, headers, caching, and bundle budgets passed.

## Retest

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

After fixing the P1 import decision and performance reliability, rerun the full live PWA, privacy, accessibility, response-policy, and deployment identity matrix documented in `.factory/verification-3.md`.
