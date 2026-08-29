# Backfill Timecards — polish round 1 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-polish-1`

Result: **PASS — all F-1-1 through F-1-33 findings are resolved and verified live.**

## What changed

- Demo now opens directly on a populated weekly timecard at `/demo` and `?demo=1`. The persistent banner, reset, real-work exit, and tab-scoped storage remain isolated from normal data.
- Landing copy now uses consistent weekly-timecard and calendar-event terms. All three privacy/offline/price facts fit a 1440×900 first screen.
- Toolbar and paid actions name their result. README jargon, unsupported claims, and long build copy were removed or rewritten.
- App route transitions use History API, set route metadata, focus the h1, and announce navigation. Back and Forward restore both route and focus.
- `/demo` ships route-specific metadata in its raw HTML response. Legal pages and the real 404 have descriptive h1s, complete metadata, shared navigation, and complete legal footers.
- Added a 180×180 Apple touch icon, external-link labels, and sequential demo heading levels.
- Billing coverage now proves the app contains no embedded provider frame, card field, or third-party script.
- Rebuilt `.factory/copy-audit.md`, updated `.factory/claims.json` and `.factory/demo.md`, added the verb-first catalog description, and mapped every review finding in `.factory/polish-1.md`.

The cassette-era reconstruction-zine visual identity, static PWA class, local-first storage, optional Sociobot billing flow, generated editorial art, and original app icons remain intact.

## Verification

Product commit: `af42859` (`fix: clear adversarial polish findings`)

Clean clone: `/tmp/backfill-polish1-clean.xQI6kL`

```sh
npm ci
# each of the nine exact test commands in .factory/claims.json, run separately
npm test
npm run build
```

Results:

- Claims: 9/9 passed independently.
- Unit/contract: 11 passed.
- Browser integration: 55 passed across Chromium desktop and 390×844 mobile; one intended desktop skip of the mobile-only touch-target branch.
- Build: passed; `dist/index.html` exists.
- Initial JavaScript: 48.67 kB raw, 14.62 kB gzip.
- Initial CSS: 19.61 kB raw, 4.99 kB gzip.
- Local Lighthouse desktop root: 100 performance, accessibility, best practices, and SEO; LCP 0.3 s, CLS 0, TBT 0 ms.
- Local Lighthouse mobile Demo: 100 across the same four categories; LCP 1.4 s, CLS 0, TBT 0 ms.

## Deployment and cold live checks

Deployed with:

```sh
/opt/fleet/lib/deploy-static.sh backfill-timecards /work/repo/dist
```

Azure deployment id: `567d70d5-ef13-44c0-a3f4-7433462b8da6`

Canonical URL: <https://backfill-timecards.sociobot.in>

Cold live results:

- `verify-url.sh` passed `/` and `/demo`: one h1, `lang=en`, main landmark, complete image alt text and button names, zero console errors.
- The 390×844 Demo first viewport contains 93 px of the first realistic sample row. Summary and all four tools are fully above it.
- Root, Demo, Privacy, Terms, and unknown-route pages each have one descriptive h1 and zero Axe violations. The unknown route returns HTTP 404.
- Click, Back, and Forward each focus the new h1 and update the polite route announcement.
- Raw `/demo` HTML contains `Demo — Backfill Timecards` title and matching canonical, OG, and Twitter metadata before JavaScript.
- `?demo=1` retained all six sample rows on a controlled offline reload and showed `Offline · saved here`.
- Normal/Demo cold flows made zero off-origin requests and logged zero console errors.
- All 24 public build files match the live responses byte for byte by SHA-256.
- Live headers have the configured CSP, HSTS, referrer policy, permissions policy, MIME types, and immutable asset caching.
- Live Lighthouse desktop root: 100 performance, accessibility, best practices, and SEO; LCP 0.3 s, CLS 0, TBT 0 ms.
- Live Lighthouse mobile Demo: 100 across the same four categories; LCP 1.2 s, CLS 0, TBT 10 ms.

Evidence:

- `.factory/polish-1.md`
- `.factory/evidence/polish-1-local/`
- `.factory/evidence/polish-1-local-demo/`
- `.factory/evidence/polish-1-live/`
- `.factory/evidence/polish-1-live-demo/`

## Known gaps and next steps

None. No review finding, claim failure, functional gap, accessibility violation, privacy failure, offline failure, metadata defect, deployment mismatch, or live regression remains.
