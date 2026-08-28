# Backfill Timecards — repair handoff

Date: 2026-08-28 UTC
Work order: `backfill-timecards-repair-2`
Base verifier report: `744847603115e2dc1b3c1dc4a8dd5b700f139aee`
Repaired candidate: `f29b7dcf9c4cf8f0b2eea93cbe8ecd0c3d23075b`

## Result: PASS — repaired and deployed

The verifier's release blocker was intermittent throttled-mobile performance:
two of three previous runs fell below 90 and one had CLS `0.120`. The cause
was the initial `Loading your local timecard…` block being removed and
replaced by the complete board after IndexedDB opened. `index.html` now ships
an inert, geometry-matched empty board immediately. The app hydrates it with
local data after IndexedDB reads, rather than first painting a small placeholder.
This preserves every existing local-first workflow while eliminating the
first-render layout shift. The service-worker cache namespace is `backfill-v1.0.2`
so installed copies receive the updated shell and its refresh toast.

## Regression coverage

- Added an exact browser-suite source regression that rejects the former
  loading-only mount and requires the initial app shell, hero, workspace, and
  empty state to be present.
- Existing unit/browser coverage remains in place for backup integrity,
  overnight calendar duration, CSV correctness, local persistence, selective
  calendar import, privacy/network isolation, desktop and 390 px use,
  keyboard dialog focus, axe, legal-page offline reload, and PWA offline use.

## Verification evidence

Clean install and source gates:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

All passed. `npm test` completed with 6 Vitest tests and 21 Playwright tests
passing across desktop and 390 × 844 mobile (1 intentional desktop-only skip).
Playwright includes axe checks with no serious/critical violations. The
production build writes `dist/index.html`; its inline JS/CSS gzip sizes are
17.30 KB total, well below the 200 KB initial-JS and 50 KB CSS budgets.

Three fresh Lighthouse 12.8.2 default-throttled mobile audits against the
final production build (`127.0.0.1:4173`) all cleared the gate:

| Run | Performance | Accessibility | CLS | LCP | TBT | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 99 | 100 | 0.000 | 1,505 ms | 102 ms | 81,026 B |
| 2 | 100 | 100 | 0.000 | 1,504 ms | 56 ms | 81,026 B |
| 3 | 100 | 100 | 0.000 | 1,506 ms | 61 ms | 81,026 B |

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` also passed: title,
`lang=en`, one h1, main landmark, image alternatives, labelled buttons, and
zero page/console errors. Its captured desktop/mobile screenshots and JSON
are in `.factory/evidence/repair-2/`.

## Deployment, live identity, and privacy

The static artifact remains a Vite + vanilla TypeScript PWA with IndexedDB
data ownership, a hand-written versioned worker, manifest, local JSON/CSV
export, and no analytics or third-party fonts/scripts. `staticwebapp.config.json`
continues to define immutable assets, no-store worker caching, AVIF/manifest
MIME types, CSP, HSTS, and browser hardening.

Commit `99f25e0` was pushed to `origin/main` and deployed using:

```sh
/opt/fleet/lib/deploy-static.sh backfill-timecards dist
```

Azure deployment `55d25622-cdad-46fb-97c5-408eed868dfb` succeeded. The
canonical URL <https://backfill-timecards.sociobot.in/> returned HTTPS `200`;
HTTP redirects to that URL. All 18 public files in `dist/` matched the live
response SHA-256 exactly (the deployment configuration file is intentionally
not a public asset). Final `index.html` SHA-256 is
`a6d9d557778eb11ff2dafa0b4bf4b0f673cf7f615307ad9260ab6ffcec48622e`.

Live response checks confirmed the configured CSP, HSTS
`max-age=63072000; includeSubDomains; preload`, `X-Frame-Options: DENY`,
`nosniff`, COOP/CORP, Permissions-Policy, immutable AVIF assets, and
`application/manifest+json`. The live `verify-url.sh` browser smoke passed
with zero console/page errors and is captured in
`.factory/evidence/repair-2-live/`.

On a live 390 × 844 Chromium session, the worker controlled the app; after
visiting `/privacy/`, an offline root navigation still presented **Add work
block**. The first Tab focused Skip to main content, all home/footer links
were 44 px tall, there was no horizontal overflow, and normal use issued no
third-party requests or console/page errors.

## Known gap

Recurring iCalendar `RRULE` masters are not expanded by the intentionally
small local parser; import an export with occurrences expanded. This was an
existing non-release-blocking limitation and does not affect timed,
selective, confidential-description, or overnight calendar imports.

## Run / deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh backfill-timecards dist
```
