# Backfill Timecards — adversarial review 2 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-review-2`

Reviewed candidate: `b9c9991e86ad13bcf6591d0d239cd5be089236b1`

## Result: FAIL

The complete report is in `.factory/review-2.md`. The live first-read, one-click Demo, sandbox isolation, routing, metadata, link crawl, visual identity, and accessibility baseline pass. All 10 registered claim commands also exit successfully. The review remains a FAIL because three claim tests do not assert their full promises and nine copy defects remain.

## Verification performed

- Fresh 390×844 and 1440×900 live browser contexts for the first screen and Demo.
- Live normal record → Demo isolation → delete → Reset demo → Start for real flow.
- Same-origin request logging and storage namespace inspection.
- Every exact command in `.factory/claims.json`, separately, from `/tmp/backfill-review2-clean.9VeoE2/repo`.
- Clean `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Live route crawl for root, Demo, Privacy, Terms, and a 404; metadata, h1/main, header/footer, overflow, console, and link status checks.
- Axe serious/critical checks on all five routes and `verify-url.sh` on live root and Demo.
- Click, Back, and Forward focus/announcement checks.
- Byte comparison between the clean production build and deployed root, Demo, JS, CSS, Privacy, Terms, and 404 files.
- Full review of `.factory/review-1.md`, `.factory/polish-1.md`, and the prior handoff; all F-1-1 through F-1-33 fixes were independently confirmed.

## Required next steps

1. Repair F-2-1 through F-2-3 by adding observable assertions for weekly `UNTIL` recurrence, complete backup contents/restoration, and locked free-tier behavior.
2. Resolve F-2-4 by testing installation or narrowing the README wording.
3. Resolve F-2-5 through F-2-12 with the exact rewrites in the review.
4. Regenerate `.factory/copy-audit.md`, rerun every claim command and the full suite, deploy, then repeat the cold live review.

No product code was modified during this review. Existing unrelated `graphify-out/` changes were left untouched.
