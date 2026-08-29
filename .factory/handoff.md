# Backfill Timecards — adversarial review 1 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-review-1`

Candidate reviewed: `ac1588c74dd5f8830b12332df4bbbc5bfeeba1c1`

Result: **FAIL**

## What was done

- Reviewed the live product cold at 390×844 and 1440×900.
- Audited every landing-page and README string with word counts and rewrites.
- Exercised Demo reset, exit, real-data isolation, session storage, request privacy, and offline reload.
- Ran all nine exact `claims.json` commands independently from a clean clone.
- Checked route metadata, h1 count, 404 behavior, links, Back behavior, route focus, headers/footers, Axe, and visual identity.
- Read the brief, design, claims, demo documentation, existing copy audit, and prior handoff. No earlier review or polish files exist.
- Wrote the complete findings to `.factory/review-1.md` without changing product code.

## Verification

From clean clone `/tmp/backfill-review1-clean.HDArq8`:

```sh
npm ci
# Each exact command in .factory/claims.json
npm test
npm run build
```

Results:

- Registered claims: 9/9 passed independently.
- Full suite: 11 unit tests passed; 47 Playwright tests passed; 1 intentional desktop skip of a mobile-only assertion.
- Build: passed; `dist/index.html` produced, JS 46.24 kB raw/14.08 kB gzip.
- Live `verify-url.sh`: passed with one h1, `lang=en`, main landmark, complete alt/labels, and no root-page console errors.
- Live Axe: zero serious/critical findings on `/`, `/demo`, `/privacy/`, `/terms/`, and the designed 404.
- Live offline Demo: service-worker controlled, six rows retained, offline status visible.
- Live request log during normal/Demo exercise: same origin only.

## Known gaps and next steps

The blocking gap is F-1-1: Demo contains sample data but shows zero sample rows in its initial 390×844 viewport. Open Demo on the populated board and add an initial-viewport assertion. Then address the non-blocking copy, unlisted-claim, navigation-focus, shared header/footer, raw Demo metadata, 404 metadata/icon, and external-link findings in `.factory/review-1.md`.

The pre-existing modified `graphify-out/` files were not edited or staged. Only review documentation is intended for this commit.
