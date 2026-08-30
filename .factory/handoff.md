# Backfill Timecards — polish 4 handoff

Date: 2026-08-30 UTC

Work order: `backfill-timecards-polish-4`
Outcome: PASS — no review finding remains open

## Shipped

- Replaced the settings claim “There is no cloud account” with the observable, tested sentence “You can use the app without an account.”
- Extended `privacy-local` and the source contract to cover the settings dialog and reject the old wording.
- Rechecked every F-1, F-2, and F-3 finding; the full mapping is `.factory/polish-4.md`.
- Updated the catalog line, copy audit, release label, manifest start version, and service-worker cache namespace.
- Preserved the cassette-era timecard design and the static offline PWA architecture.

Product repair commit: `22618bc8e9a54b96b588c282fdca9aef837952de`

Deployment ID: `c40d39eb-af09-4916-96e3-244ee809aba4`

Live product: <https://backfill-timecards.sociobot.in>
Live Demo: <https://backfill-timecards.sociobot.in/?demo=1>

## Verification

Clean clone: `/tmp/backfill-polish4-clean.aZfdhn/repo` at the product repair commit.

- Each of the ten exact commands in `.factory/claims.json`: PASS independently.
- `npm test`: PASS — 13 unit/contract tests and 58 Playwright tests across desktop Chromium and 390px mobile, with no skips.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` contains root, Demo, Privacy, Terms, 404, manifest, and service worker files.
- Initial JavaScript: 48,692 bytes raw, 14.58 kB gzip. CSS: 19,647 bytes raw, 5.00 kB gzip. Mobile hero AVIF: 15,163 bytes.
- Playwright Axe scans: zero serious or critical findings on root, Demo, Privacy, Terms, and 404.
- Keyboard/focus suite: skip link, dialog close/focus restore, route click/Back/Forward focus, and route announcement all pass.
- Privacy suite: normal requests stay on-site; Demo uses `demo:backfill-timecards` session storage and creates no IndexedDB database.
- Offline suite: six Demo rows survive a controlled offline reload in an isolated browser context.
- Live Lighthouse root desktop: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 0.3s, CLS 0.
- Live Lighthouse Demo mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2s, CLS 0, TBT 60ms.

## Live checks after deployment

- `/`, `/demo`, `/?demo=1`, `/privacy/`, `/terms/`, manifest, robots, and sitemap returned 200. `/missing-round-four` returned the designed 404.
- Root, Demo, JavaScript, and CSS hashes match the deployed `dist/` files.
- HTML is `no-cache`; hashed JavaScript is immutable for one year; `/sw.js` is `no-cache, no-store`.
- CSP, HSTS, `nosniff`, frame denial, referrer policy, permissions policy, COOP, and CORP headers are present.
- Fresh-context checks found no console or page errors and no off-origin Demo requests.
- The first mobile Demo row begins at 751px in an 844px viewport. The banner, Reset demo, and Start for real are visible.
- Settings visibly contains the repaired no-account wording and not the rejected architecture claim.

Evidence:

- `.factory/evidence/polish-4-live/cold-check.json`
- `.factory/evidence/polish-4-live/settings-no-account-desktop.png`
- `.factory/evidence/polish-4-live/demo-first-screen-mobile.png`
- `.factory/evidence/polish-4-live/query-demo-offline.png`
- `.factory/evidence/polish-4-live/not-found-cold-desktop.png`
- `.factory/evidence/polish-4-live/lighthouse-desktop.json`
- `.factory/evidence/polish-4-live/lighthouse-demo-mobile.json`

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

## Known gaps and next steps

None. The unrelated pre-existing `graphify-out/` working-tree changes were preserved and excluded from both repair commits.
