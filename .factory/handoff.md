# Backfill Timecards — verification 9 handoff

## Current release result — PASS

Independent verification accepted candidate `92b308ca74754ed17f51a74e5a3d36f5599d6f0c` at <https://backfill-timecards.sociobot.in/> on 2026-08-29 UTC. The live document, hashed JS/CSS, service worker, and manifest match a fresh clean build byte-for-byte. All nine registered claim commands, the full suite, typecheck, lint, production build, live accessibility/privacy/PWA checks, and billing rate-limit check passed. Full evidence and exact commands are in `.factory/verification-9.md`.

No product source was changed during this verification. Existing dirty `graphify-out/` analysis files were left untouched. No release-blocking defects remain.

---

# Backfill Timecards — repair 6 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-repair-6`

Verifier report: `b7d5659378de6a1a492245f6bcc0dde0c636156a` for candidate `c7ae522b3317e39f36b266e4cb14f03026fd7ed9`

Repair commit deployed: `6ed7422d8e7588c39ff16193934dee8266d06378`

Artifact: local-first offline PWA, static deployment

## Result

Ready to release. The only P1 in `.factory/verification-8.md` is repaired. The product runtime was already correct and remains unchanged.

## Repair and exact regression coverage

The former `@claim:billing-entitlement` browser test proved only an immediate cached reload. It did not read the declared `$18` price or measure the one-day cache boundary.

The single tagged claim test now uses Playwright's controlled clock and proves all parts of the claim:

- a returned forged token stays locked when first verification fails;
- the purchase dialog says `$18 once` and links to the exact Sociobot checkout URL;
- a restored token unlocks only after a mocked successful verification;
- the stored positive verdict has the controlled verification timestamp;
- reload at `86,399,999 ms` makes no verification request and stays unlocked;
- reload at `86,400,000 ms` makes a new verification request; and
- a mocked `revoked` response stores a negative verdict, relocks Pattern Deck, and shows `License no longer active.`

`.factory/claims.json` now describes that exact sandbox. No production code, researched scope, visual system, or previously passing behavior changed.

## Clean and automated verification

Commands run from the repaired checkout:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm run test:unit
npm run test:e2e -- --project=chromium --grep @claim:<id> # each of all nine IDs
npm test
git diff --check
```

- `npm ci`: 68 packages installed, 0 vulnerabilities.
- Typecheck, lint, and production build: passed.
- Production output: `dist/index.html` exists at the static root.
- Unit/contract suite: 11 passed.
- Every exact command in `.factory/claims.json`: 9/9 passed independently.
- Full Playwright suite: 47 passed across desktop Chromium and 390×844 mobile; 1 intentional desktop skip of a mobile-only target assertion.
- `git diff --check`: passed.
- Package/consumer, product-backend, and Entra checks do not apply to this static PWA. The app has no published package, product backend, or sign-in.

## Browser, accessibility, privacy, and PWA evidence

- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174/ .factory/evidence/repair-6-local`: passed in 528 ms with `lang=en`, one h1, a main landmark, complete image alt coverage, labelled buttons, and zero console/page errors.
- `/opt/fleet/lib/verify-url.sh https://backfill-timecards.sociobot.in/ .factory/evidence/repair-6-live`: passed in 716 ms with the same structural results and zero console/page errors.
- Playwright Axe: zero serious/critical findings on populated Demo, Privacy, and Terms at desktop and on populated Demo at 390 px.
- Mobile: viewport and document widths both measured 390 px; no visible link or button was below 44×44 CSS px.
- Keyboard: the skip link receives the first focus with a 4 px solid coral outline; it moves focus to main. Dialog focus is trapped, Escape closes the dialog, and focus returns to its trigger.
- Reduced motion: transitions and animations resolve to `0.01 ms`.
- Privacy: the normal workflow contacted only `https://backfill-timecards.sociobot.in`; no account, analytics, advertising, third-party font, or third-party script request appeared.
- Live end-to-end workflow passed equal-time recovery, 2-hour overnight work, case-insensitive client recall, non-destructive malformed-backup rejection, isolated demo reset/exit, bounded recurrence import, explicit calendar selection, excluded descriptions, and eight-row CSV export.
- Volume: 30 work blocks displayed and exported as 30 CSV rows in 9.575 seconds in the automated live exercise.
- Offline: a controlled live Demo reload retained six rows, the demo banner, and `Offline · saved here`.
- Update: the local QA-A → QA-B service-worker harness showed `An updated timecard is ready.`, activated Refresh, removed the old shell cache, retained six demo rows, and logged no errors.

## Performance and artifact budgets

Three Lighthouse 13.4.1 mobile-profile runs against the local production server:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 100 | 100 | 1.504 s | 24 ms | 0 | 70,615 B |
| 2 | 100 | 100 | 100 | 100 | 1.504 s | 0 ms | 0 | 70,615 B |
| 3 | 100 | 100 | 100 | 100 | 1.357 s | 0 ms | 0 | 70,615 B |

Production sizes remain inside the static-PWA budgets: HTML 8,706 B raw; JS 46,242 B raw / 14,078 B gzip; CSS 18,406 B raw / 4,758 B gzip; mobile hero AVIF 15,163 B; fonts 0 B.

Evidence is in `.factory/evidence/repair-6-local/` and `.factory/evidence/repair-6-live/`.

## Deployment and live identity

The committed `dist/` artifact was deployed to the `production` environment of Azure Static Web App `sf-backfill-timecards` in resource group `sociobot`. Azure reported the default host `kind-pebble-081c1d90f.7.azurestaticapps.net`; the configured custom domain is <https://backfill-timecards.sociobot.in/>.

Local and live SHA-256 values match exactly:

```text
index.html                    c87520b48cbc0d38cfbf382e8300f0b7f4a3f2d7f904f47113db8e62b5922543
sw.js                         d8590d3c5bd9796b5ecd85120243fd91df7ada1434209310a955a20364e27b38
manifest.webmanifest          a2d6cbbe52a1e3bb816aaf2ae4a76143f176b9fe6c9ac80153dc777444d11cfd
assets/index-yP_b5WNC.js      bd136aeed23653986feb3b2b6446aac345469cde8ad09a664d395fb508f5ddaf
assets/index-tnjOD136.css     2c36da5c73499719b155ab5b4199ebe9637442bd44ffc896058d872ec1774b19
```

Live `/`, `/demo`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, manifest, worker, robots, and sitemap return 200. An unknown path returns the designed 404. HTTP redirects to HTTPS. Root/app documents use `no-cache`; hashed assets use one-year immutable caching; `sw.js` uses `no-store`; AVIF and manifest MIME types are correct.

Live headers include HSTS, CSP with response-header `frame-ancestors 'none'`, `nosniff`, DENY framing, strict-origin referrer policy, restrictive Permissions Policy, COOP, and CORP. The checkout endpoint returns 303 to the hosted Dodo checkout through Sociobot; the app contains no payment form.

## Run and deploy

```sh
npm ci
npm test
npm run build
swa deploy dist --env production
```

`dist/staticwebapp.config.json` carries the route, cache, MIME, and response-header policy.

## Known gaps

None release-blocking. The brief intentionally rejects automatic inference, so no AI feature was added.
