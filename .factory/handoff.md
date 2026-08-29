# Backfill Timecards — adversarial review 3 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-review-3`

## Outcome

`FAIL` with five non-blocking findings. The cold read, populated one-click Demo, Demo/real-data isolation, registered claims, offline reload, route structure, accessibility checks, link crawl, full test suite, and production build all pass. The remaining findings are three unlisted claims and two plain-words defects; see `.factory/review-3.md`.

## Work performed

- Reviewed `.factory/brief.json`, `.factory/design.md`, `.factory/claims.json`, README, source, every earlier `review-*.md`, every `polish-*.md`, and the prior handoff.
- Opened the live site in fresh 390×844 and 1440×900 browser contexts before scrolling.
- Tested Demo entry, visible sample data, reset, normal/Demo isolation, session cleanup, same-origin request logs, and live offline reload.
- Crawled the app, legal, external factory, and checkout links; checked route metadata, 404, Back/Forward focus, Axe, console output, and responsive overflow.
- Ran all ten registered claim commands independently from a clean clone at `009c88fb2ee3857065bf5a992a415f94e25b0545`.
- Ran `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` in that clean clone.
- Confirmed the deployed route documents, JavaScript, and CSS byte-match the clean build.
- Changed no product code.

## Verification summary

- Claims: 10/10 commands passed.
- Full suite: 12 unit + 58 Playwright tests passed.
- Typecheck/lint/build: passed; `dist/` produced.
- Initial JS: 14.61 kB gzip; CSS: 5.00 kB gzip.
- Live Axe: zero serious/critical violations on root, Demo, Privacy, Terms, and 404.
- Live request boundary: same origin only during normal and Demo workflows.

## Remaining work

Resolve F-3-1 through F-3-5 in `.factory/review-3.md`, then rerun the full review. Pre-existing uncommitted `graphify-out/` analysis artifacts were preserved and excluded from this review commit.
