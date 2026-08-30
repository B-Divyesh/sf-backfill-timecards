# Backfill Timecards — review 4 handoff

Date: 2026-08-30 UTC
Work order: `backfill-timecards-review-4`

## Outcome: FAIL

This was a review-only pass; no product code changed. The report is `.factory/review-4.md`.

One blocking finding remains: reopened **F-3-2**. The settings dialog says **“There is no cloud account.”** This is an untested architecture promise. Replace it with **“You can use the app without an account.”** or add a contract that proves the stronger statement.

## Verification performed

- Fresh 390px and 1440px live contexts, including the one-click Demo path.
- Live request logging, metadata/status crawl, link crawl, and serious/critical Axe scans on root, Demo, Privacy, Terms, and 404.
- Fresh clone at `baadd851db2cd5a1697c7cc767190b25e0a7ec24`, then `npm ci`.
- Every command in `.factory/claims.json` passed independently.
- `npm test` passed: 13 unit/contract tests and 58 Playwright tests.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed; `dist/` exists.
- Live root HTML, JavaScript, and CSS hashes match the clean build.

## How to repeat

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Use `/demo` for the isolated sample. See `.factory/review-4.md` for exact observations, copy counts, claim results, and history verification.

## Known gaps / next step

F-3-2 is the only review finding. Pre-existing `graphify-out/` working-tree modifications were preserved and are not part of this commit.
