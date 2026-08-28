# Backfill Timecards — repair handoff

Date: 2026-08-28 UTC

Work order: `backfill-timecards-repair-3`

Verifier report: `5f085b5862c46b01ed4a8dd5b700f139aee`

Repaired candidate: `bc3ba5974fd520f40969e716a39ae74efff14f74`

Repair commit deployed: `4ae887371bb228f37e6281baccfb75cb8686f78c`

Live URL: <https://backfill-timecards.sociobot.in/>

## Result

PASS. Every finding in `.factory/verification-3.md` was reproduced and repaired without changing the researched brief, offline-PWA artifact class, static deployment class, or previously passing behavior.

## Repairs

- Calendar review now has a separate **Mark selected events as billable** choice. It is unchecked by default, and its explicit value is persisted for every selected event. Live verification imported five personal appointments and confirmed five `Not billable` rows plus five CSV `"No"` values; confidential descriptions remained excluded.
- Bounded `DAILY` and `WEEKLY` RRULE masters are expanded into distinct review rows, including intervals, weekday filters, `COUNT`/`UNTIL`, and `EXDATE`. Open-ended, invalid, and unsupported recurrence is rejected before import with instructions to export one week as individual events. The verifier's exact daily `COUNT=5` case produced and imported five rows. A separate live 30-event review/import produced 30 rows.
- Fresh empty-state startup now hydrates the server-rendered shell in place instead of replacing the entire app after IndexedDB opens. Service-worker registration is scheduled during idle time. The duplicate hero preload and runtime image filter were removed, eliminating the second hero transfer and reducing startup render/decode work. A mutation-observer regression proves the initial workspace is not replaced.
- PWA cache namespace/start URL were bumped to v3; the preferred AVIF and WebP fallback are both available offline.

## Exact regression coverage

- `tests/core.test.ts`: five-occurrence daily recurrence expansion, unique occurrence IDs, and clear rejection of unbounded recurrence.
- `tests/e2e/app.e2e.ts`: default non-billable import plus exported CSV, explicit billable opt-in, five-row recurrence review/import, no duplicate hero preload, and in-place empty-shell hydration.
- Existing coverage remained green for manual entry/persistence/mapping/CSV, overnight events, non-destructive malformed-backup rejection, legal-page offline fallback, 44 px mobile targets, legal-page axe scans, keyboard dialog focus, same-origin privacy, and offline use.

## Clean verification

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

- Clean install: 68 packages, 0 vulnerabilities.
- Unit: 8/8 passed.
- Playwright 1.58.2: 27 passed across desktop and 390×844 mobile; 1 intentional desktop skip for the mobile-only target-size assertion.
- Typecheck/lint/build/diff check: passed. `dist/index.html` exists at the static root.
- Production budgets: inline JS 38,549 B; inline CSS 15,795 B; fonts 0 B; mobile AVIF 15,163 B; HTML 60,248 B raw / 18,175 B gzip.
- Package/consumer verification: not applicable to this static PWA.

## Browser, accessibility, privacy, and PWA evidence

- `/opt/fleet/lib/verify-url.sh` passed locally and live with one h1, `lang=en`, title/main/alt/button checks, and zero console errors. Screenshots and reports are in `.factory/evidence/repair-3-local/` and `.factory/evidence/repair-3-live/`.
- Live populated-board axe scan: 0 serious/critical violations. At 390 px: document width 390 px, 16 px body text, visible skip-link focus, Escape focus restoration, and reduced-motion transition duration `0.01ms`.
- Live normal/import/export use made no third-party requests and produced no console errors, page errors, or failed requests. Calendar content remained local; IndexedDB persistence survived reload.
- Live offline reload after visiting `/privacy/` returned the working board. A local two-revision update test changed v1.0.3 to v1.0.4, displayed **An updated timecard is ready.**, refreshed successfully, and activated the new shell/assets caches with zero console errors.

## Performance

Three fresh Lighthouse 12.8.2 default-throttled mobile runs against the deployed canonical URL all passed:

| Run | Performance | Accessibility | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 98 | 100 | 1,132 ms | 1,205 ms | 172 ms | 0 | 66,255 B |
| 2 | 96 | 100 | 1,071 ms | 1,206 ms | 232 ms | 0 | 66,246 B |
| 3 | 95 | 100 | 925 ms | 1,203 ms | 249 ms | 0 | 66,243 B |

Three local production-preview runs were 100/100/100 performance, 100 accessibility, 0 CLS, and 0–38 ms TBT.

## Deployment and identity

`/opt/fleet/lib/deploy-static.sh backfill-timecards /work/repo/dist` completed successfully (Azure deployment `d37be6c1-8c4a-4a69-a7a1-e1859d532c40`). All 18 public build files match live SHA-256; `dist/index.html` and live root hash to `87031c353f125c18cdc887c07e40ff8196fb28c053ad5a4d09ab471549cafa0e`.

HTTPS returns 200, HTTP redirects 301, and conditional ETag returns 304. Root/legal pages are no-cache, `sw.js` is no-store, and icons/assets are one-year immutable. AVIF and manifest MIME types are correct. CSP, HSTS, frame denial, nosniff, COOP/CORP, Permissions-Policy, and strict-origin referrer policy are present.

## Known limits / next steps

Monthly/yearly, malformed, and open-ended recurrence rules are deliberately rejected with actionable export guidance rather than guessed. No release-blocking gaps remain.
