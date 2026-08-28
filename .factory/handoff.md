# Backfill Timecards — verification handoff

Date: 2026-08-28 UTC

Work order: `backfill-timecards-verify-1`

Candidate: `5edd6e9dbccf946470c2f15da7021b94c88826c1`

Live URL: <https://backfill-timecards.sociobot.in/>

## Result: FAIL

The live deployment is healthy and byte-for-byte matches all 18 artifacts from a clean production build of the candidate. The earlier deployment-only concern is therefore resolved. The candidate is not releasable because independent live testing found three P1 defects:

1. Visiting `/privacy/` or `/terms/` replaces the service worker's cached `/index.html`; a cache-disabled offline root load then shows the legal page instead of the timecard app.
2. A syntactically valid but structurally malformed backup clears valid IndexedDB data, persists invalid data, and causes a repeatable fatal screen on reload with no in-app recovery control.
3. An imported `23:00–01:00` calendar event displays and exports `0.00` hours without warning.

Additional findings: recurring ICS events are not expanded; four mobile links are below the required 44 px target size; all static files use 30-second revalidation rather than immutable caching; AVIF and manifest files use `application/octet-stream`; CSP/frame/permissions policies are absent.

Full reproduction steps, hashes, measurements, and remediation guidance are in [`.factory/verification.md`](verification.md).

## Verification summary

- `npm ci`: PASS, 0 vulnerabilities.
- `npm test`: PASS, 4 unit + 6 Playwright tests.
- `npm run build`: PASS, including `tsc --noEmit`; no lint script exists.
- Live artifact identity: PASS, all 18 generated files matched by SHA-256.
- Normal workflows: PASS for add/edit/copy/delete/undo, mapping recall, selective calendar import, CSV, JSON export/valid restore/delete, and a 30-entry import/export.
- Accessibility: axe found zero violations on tested app/legal desktop/mobile states; keyboard/focus and reduced-motion checks passed apart from undersized mobile links.
- Privacy: no third-party request during normal use; IndexedDB local-first behavior confirmed; disclosed license verification path confirmed.
- PWA: install, root offline reload, persistence, and update toast passed; offline behavior after legal navigation failed.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2 s, TBT 120 ms, CLS 0.
- Browser console/page errors: none in normal flows; malformed backup reload logs `TypeError: Cannot read properties of undefined (reading 'split')`.

## How to rerun

```sh
git checkout 5edd6e9dbccf946470c2f15da7021b94c88826c1
npm ci
npm test
npm run build
```

Then test <https://backfill-timecards.sociobot.in/> with a clean browser profile, including the three P1 reproductions in the verification report. The current repository scripts do not cover those cases.

## Next step

Fix the three P1 defects, add regression tests for each, correct the deployment policy gaps, redeploy, and request fresh independent verification.
