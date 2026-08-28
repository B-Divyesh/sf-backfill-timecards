# Independent product verification — FAIL

Date: 2026-08-28 UTC
Work order: `backfill-timecards-verify-2`
Candidate: `f29b7dcf9c4cf8f0b2eea93cbe8ecd0c3d23075b`
Live URL: <https://backfill-timecards.sociobot.in/>
Artifact: offline-first PWA

## Verdict

**FAIL — do not promote until the mobile performance/CLS gate is made reliable.**

The previous deployment-only concern is not present. A clean build of the candidate matches the live deployment byte-for-byte for all 18 publicly served product files. The weekly reconstruction flow, selective local calendar import, project/client recall, persistence, CSV/JSON ownership tools, PWA offline reload/update, privacy posture, and accessibility checks passed.

The release does not satisfy the supplied Lighthouse-class performance acceptance gate consistently. Three fresh throttled-mobile Lighthouse runs gave performance scores of **85, 100, and 87**. Two runs are below the required 90; the 85 run had CLS **0.120** (over the 0.1 budget). This is a reproducible reliability failure, even though the fastest run passes. No product code was changed during verification.

## Defects

### P2 — Mobile performance and CLS do not reliably meet the stated budget

Fresh live Lighthouse runs using Chromium 1208, a new profile each time, and the default throttled mobile audit:

| Run | Performance | Accessibility | LCP | Total blocking time | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 85 | 100 | 1,279 ms | 432 ms | 0.120 | 80,089 B |
| 2 | 100 | 100 | 1,208 ms | 46 ms | 0 | 76,257 B |
| 3 | 87 | 100 | 1,380 ms | 495 ms | 0 | 80,101 B |

Acceptance requires Lighthouse mobile performance >= 90 and CLS < 0.1. Investigate the long main-thread tasks and the first-paint/app-shell layout shift, then rerun multiple clean mobile audits rather than accepting the best individual result.

No P1 functional, data-integrity, privacy, accessibility, or deployment mismatch was found.

## Clean-checkout gates

Verification used a detached clean worktree at the exact candidate SHA; unrelated `graphify-out/` changes in the shared worktree were excluded.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 68 packages installed; audit reported 0 vulnerabilities |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (`tsc --noEmit`) |
| `npm test` | PASS — 6 Vitest tests; Playwright suite passed in both desktop and 390 x 844 projects (19 passed, 1 intentional desktop-only skip) |
| `npm run build` | PASS — Vite 6.4.3; `dist/` produced |
| `git diff --check` | PASS |
| Candidate worktree after checks | Clean |

Build budget inspection: inline JavaScript 35,874 B raw / 11,238 B gzip (<= 200 KB); inline CSS 15,831 B raw / 4,260 B gzip (<= 50 KB); no font payload; 640 px AVIF hero 15,163 B (<= 300 KB). `dist/index.html` is 52,808 B raw / 15,763 B gzip.

## End-to-end evidence

Fresh Chromium checks against the live URL passed:

- Empty state, required fields, equal start/end validation and focus recovery; correcting 09:00–09:00 to 09:00–10:30 saved a 1.50-hour manual entry.
- Entry persisted through reload, and its downloaded CSV contained the description and `1.50` hours.
- A 30-event ICS file was reviewed and imported locally. Calendar descriptions marked confidential were absent until the explicit opt-in checkbox; all 30 selected events were added.
- Invalid JSON backup with an incomplete work block showed `Nothing was changed`; the valid pre-existing work block remained after reload.
- An overnight `20260824T230000`–`20260825T010000` ICS event displayed as next-day work and CSV exported `"2026-08-24","23:00","01:00","2.00"`.
- Existing unit/browser coverage additionally passed selective import, no-selection and malformed-file recovery, project-to-client mapping, duplicate/delete/undo, JSON export/restore/erase, CSV quote/order handling, and the 30-entry path.

## PWA, privacy, accessibility, and responsive evidence

- Live manifest has standalone display, versioned start URL, 192/512 and maskable icons. The worker installed, activated, controlled the page, and the live root reloaded offline after an online visit to `/privacy/`.
- A local two-revision worker test served `v1.0.1` then `v1.0.2`: the controlled app surfaced **“An updated timecard is ready.”** with Refresh and activated `backfill-v1.0.2-shell`/`assets` caches.
- Normal live use made requests only to `https://backfill-timecards.sociobot.in`; no analytics, fonts, third-party scripts, beacons, or calendar uploads were observed. Local work is in IndexedDB; localStorage was unused without a license. Source review found the only allowed external runtime path is the disclosed Sociobot license verification endpoint.
- Playwright axe found zero serious/critical violations on the populated live board. The repository suite also found none on app, Privacy, and Terms.
- Keyboard-only: first Tab reaches Skip to main content; Enter opens the add dialog; Escape closes it and restores focus. At 390 x 844 there was no horizontal overflow; home and all footer links measured 44 px high. Focus was a visible 4 px solid coral outline. Reduced-motion transition duration was `1e-05s` (0.01 ms).
- Normal desktop/mobile flows had zero page errors, console errors, failed requests, and outbound third-party requests.

## Deployment identity and response policies

- Live HTTPS root is `200`; HTTP redirects with `301`; ETag revalidation returned `304`.
- All 18 publicly served build files matched their live response SHA-256. The remaining build file, `staticwebapp.config.json`, correctly returned 404 because it is deployment configuration, not a public asset.
- `index.html` SHA-256: `52f0a75a7b572a41b39ff04ec5e35e23e52cfdf1e799e88765fd36b41b34e4f2`.
- Live root carries HSTS `max-age=63072000; includeSubDomains; preload`, CSP restricted to self plus disclosed Sociobot billing origins, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, COOP/CORP, Permissions-Policy, and strict-origin referrer policy.
- AVIF is `image/avif`; manifest is `application/manifest+json`; image/icon assets are immutable for one year; `sw.js` is no-store/no-cache.

## Required remediation and retest

1. Profile and remove the intermittent long main-thread work; ensure the app-shell-to-rendered-app transition does not cause measurable layout shift.
2. Run at least three clean, throttled mobile Lighthouse audits. Promotion requires every run to meet performance >= 90 and CLS < 0.1.
3. Then rerun the complete clean-checkout, live identity, PWA offline/update, 390 px, keyboard, axe, privacy, and recovery matrix above.
