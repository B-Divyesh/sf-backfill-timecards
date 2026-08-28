# Backfill Timecards — build handoff

Date: 2026-08-28

Work order: `backfill-timecards-build-1`

Deploy target: static `./dist`

## Shipped

- A responsive weekly reconstruction board with Monday–Sunday navigation, daily and weekly totals, billable totals, client counts, and focused empty states.
- Manual work blocks with date/start/end validation, invoice-language descriptions, billable choice, edit, copy, confirmed delete, and undo.
- Local `.ics` parsing and review. Users choose events, opt into descriptions, assign project/client, and see calendar provenance. Untimed/all-day events are deliberately ignored rather than becoming false 24-hour work.
- Remembered project→client mappings, applied visibly when a known project is entered.
- Source stamps (`manual`, `calendar`, `pattern`) so every row remains explainable; no billability or time is inferred.
- Invoice-ready weekly CSV and complete JSON backup/restore/delete controls. Records use IndexedDB; license state uses localStorage.
- $18 one-time Pattern Deck unlock using the Sociobot contract: hosted buy link, return-token capture, daily-cached verification, optimistic offline access after a valid cached verdict, and paste-to-restore. Free entry, calendar import, CSV/JSON export, deletion, privacy, and accessibility are not gated.
- Installable PWA with 192/512/maskable icons, versioned shell caches, cache-first local assets, offline fallback, update toast, and a production shell that inlines the small JS/CSS payload to avoid hashed-asset mismatch offline.
- Dedicated `/privacy/` and `/terms/` documents, robots/sitemap/LLM metadata, MIT license, and expanded README.
- Product-specific cassette-era zine system and original generated editorial art. Prompt and provenance are in `.factory/design.md` and `assets/src/`.

## Verification

From a clean checkout:

```sh
npm install
npm test
npm run build
```

- `npm test`: passed — 4 Vitest unit tests and 6 Playwright tests (Chromium desktop + Pixel 5 profile).
- Playwright covers add/persist/map/export, selective local calendar import, axe analysis, and an actual offline reload from a clean service-worker origin.
- Axe: no serious or critical violations in either tested viewport.
- `/opt/fleet/lib/verify-url.sh`: passed; title present, `lang="en"`, exactly one `h1`, main landmark present, zero missing image alts, zero unlabeled buttons, and zero browser console errors. Evidence is in `.factory/evidence/`.
- Final mobile Lighthouse: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; LCP 1.6s, TBT 50ms, CLS 0.
- Production payload: `dist/index.html` 49.83 KB raw / 14.99 KB gzip including inline app JS and CSS. Source build reports JS about 33 KB raw and CSS about 16 KB raw. Mobile hero AVIF is 16 KB (WebP fallback 31 KB), below all stated budgets.
- `npm run build`: passed and writes `dist/index.html` at the required root.
- Responsive visual review completed at 1440×1100 and 390×844; dialogs and touch actions were exercised through Playwright.

## Known gaps / release notes

- The Sociobot product must still be registered by the factory. The source uses `backfill-timecards` as the slug and accepts `VITE_PRODUCT_SLUG` and `VITE_BILLING_BASE`; no provider or product ID is embedded. Use the pilot API only for staging.
- Calendar recurrence rules are not expanded. Importers should export concrete occurrences for the week. Timed events are supported; all-day items are intentionally skipped.
- The stated under-15-minute / 90%-no-correction success measure requires a real freelancer pilot after deployment; it is not claimed from automated tests.
- Data is device-local by design. Clearing browser site data removes it unless the user first exports a JSON backup.

## Next steps

1. Register the one-time product in Sociobot billing and smoke-test checkout return plus revoke/refund behavior on staging.
2. Deploy `dist/` over HTTPS, then rerun the URL verifier and offline install test against the production hostname.
3. Run the brief’s pilot with at least three freelancers reconstructing 30-row weeks and record completion time plus CSV correction rate.
