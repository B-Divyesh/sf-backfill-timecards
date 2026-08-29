# Backfill Timecards — polish round 3 handoff

Date: 2026-08-29 UTC
Work order: `backfill-timecards-polish-3`
Product repair: `c9726f0` — `fix: clear review three claims and copy`
Deployment: `8daf8183-2f04-493a-bb47-8177f2e7d3e7`
Live URL: <https://backfill-timecards.sociobot.in>

## Outcome

PASS. All five round-3 findings and every finding from review rounds 1–2 are resolved, re-tested, deployed, and cold-checked on the live site. The product remains a Vite/TypeScript local-first PWA with IndexedDB normal storage, tab-scoped Demo storage, a service worker, and the cassette-era reconstruction visual system.

## What changed

- Removed the unsupported unlimited-pattern promise.
- Replaced the unverifiable account-database sentence with the observable no-account statement.
- Removed Dodo and merchant-of-record assertions from the unlock dialog, Privacy, and Terms. The three locations now consistently say: “Checkout is hosted by Sociobot. Send payment and refund questions there.”
- Renamed the paid-dialog heading to “Unlock saved patterns and week copying.”
- Replaced README’s technical “same-origin” wording with “Normal timecard work sends requests only to this site.”
- Strengthened the existing tagged privacy and billing browser claims to assert the legal-page wording, the descriptive paid heading, no unlimited claim, and the absence of merchant-role language.
- Kept the reviewed Demo URL (`/demo`) and query entry (`?demo=1`) isolated, resettable, bannered, offline-capable, and visibly populated in the first screen.
- Updated `.factory/claims.json`, `.factory/copy-audit.md`, `.factory/catalog-description.txt`, and the complete finding map in `.factory/polish-3.md`.

## How to run

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
```

The demo is available at `/demo` or `/?demo=1`. It uses the tab-scoped `demo:backfill-timecards` session-storage namespace and never reads or writes the normal `backfill-timecards` IndexedDB archive.

## Exact verification evidence

Clean clone: `/tmp/backfill-polish3-clean.14p56r/repo` at `c9726f0`.

- `npm ci`: passed.
- Every exact `.factory/claims.json` command was run separately and passed: `demo-sandbox`, `demo-exit-cleanup`, `weekly-board`, `calendar-local`, `csv-export`, `local-archive`, `offline-reload`, `pattern-deck`, `privacy-local`, and `billing-entitlement`.
- `npm test`: passed — 13 unit/contract tests and 58 Chromium desktop/mobile browser tests, no skips or failures.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/` contains root `index.html`, real `demo/index.html`, legal routes, 404, manifest, and service worker. The initial JavaScript is 14.59 kB gzip; CSS is 5.00 kB gzip.
- `/opt/fleet/lib/verify-url.sh` passed with no console/page errors for `/`, `/demo`, `?demo=1`, `/privacy/`, and `/terms/`. See `.factory/evidence/polish-3-live/{root,demo,query-demo,privacy,terms}/verify.json`.
- `.factory/evidence/polish-3-live/live-check.mjs` cold-checked root, Demo, query Demo, Privacy, Terms, 404, paid-dialog copy, Back focus, and controlled offline Demo reload. It found zero Axe serious/critical violations and wrote `.factory/evidence/polish-3-live/live-check.json` plus screenshots.
- Live root, Demo HTML, JavaScript, and CSS SHA-256 values match the deployed `dist/` output.
- The custom-domain deployment completed as Azure Static Web Apps deployment `8daf8183-2f04-493a-bb47-8177f2e7d3e7`.

## Known gaps and next steps

No product gaps remain. The only dirty paths left outside this repair are the pre-existing, unrelated `graphify-out/` analysis artifacts; they were preserved and not committed. Future content changes should update `.factory/claims.json`, the corresponding tagged observable test, and `.factory/copy-audit.md` in the same change.
