# Backfill Timecards — repair handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-repair-4`

Verifier report: `036bf3afaf17c58043dddc5d70d21b61241bad47` / `.factory/verification-6.md`

Rejected candidate: `bef3fb93d3b494de256aeabc65a3964068c13a1b`

Deployed repair commit: `387132eeff23f73508aee679d663d80154ea5a5e`

Azure deployment: `fe62cf51-8a42-409f-b9a3-994ff8c33bb7`

Live URL: <https://backfill-timecards.sociobot.in/>

Demo URL: <https://backfill-timecards.sociobot.in/demo>

## Result: PASS

Every release blocker in verification 6 is repaired. The researched brief, local-first PWA artifact, static deployment class, paid-product contract, and previously passing timecard behavior are unchanged.

## Repairs

- Added a visible first-screen **Try it with sample data** action and a direct `/demo` route.
- Added a persistent **Demo — sample data, nothing is saved** banner with **Reset demo** and **Start for real**.
- Isolated demo records in IndexedDB `demo:backfill-timecards`; normal records remain in `backfill-timecards`. Demo mode never reads or verifies a real license. Reload restores the original sample, leaving clears demo records, and real work remains intact.
- Seeded six current-week blocks, three prior-week blocks, two project/client mappings, and one pattern. The paid Pattern Deck is available as a no-purchase demo preview.
- Added `.factory/claims.json` with seven claims. Each claim has exactly one matching `@claim:<id>` Playwright test that starts from a clean demo context.
- Rewrote the first screen as **Reconstruct your freelance workweek**, names the freelancer audience, explains the sample result, and presents tested privacy, offline, and price facts.
- Added the standard three-step explanation and an explicit paid/free boundary. Removed metaphor-led instructional copy while retaining the cassette-era visual identity.
- Added `.factory/demo.md`, `.factory/copy-audit.md`, and a unit-level factory contract test that prevents the registry, unique tags, static demo action, and plain first-read copy from disappearing.
- Extended the service-worker app-route fallback to `/demo` and bumped the cache/start revisions to v4.

## Exact regression coverage

The seven claim tests cover:

1. real/demo data isolation, deterministic reset, exit cleanup, and preservation of real work;
2. add, edit, copy, delete, Undo, and project-to-client recall;
3. local calendar review with bounded recurrence, overnight duration, private-description exclusion, default non-billable behavior, demo-only IndexedDB, and no off-origin requests;
4. CSV filename, full invoice header, visible-row count, and sample row values;
5. JSON archive export, confirmed erase, and restore;
6. controlled offline `/demo` reload with the populated week;
7. pattern saving, previous-week cloning, the $18 one-time price, and the free-tool boundary.

Existing tests still cover malformed-backup non-destruction, recurring and overnight calendar correctness, legal-page offline fallback, keyboard dialogs, 44 px targets, mobile layout, privacy, and legal-page accessibility.

## Clean verification

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
git diff --check
```

- `npm ci`: 68 packages, 0 vulnerabilities.
- Unit/contract: 10/10 passed.
- Playwright 1.58.2: 43 passed across desktop Chromium and 390×844 mobile; one intentional desktop skip for the mobile-only target-size assertion.
- All seven `@claim:` tests passed together from fresh Chromium contexts; `tests/factory-contract.test.ts` proves each registry id appears exactly once.
- Typecheck, lint, build, and whitespace validation passed. `dist/index.html` is at the required static root.
- Package/consumer testing is not applicable to this static PWA.

## Browser, accessibility, privacy, and PWA evidence

- `/opt/fleet/lib/verify-url.sh` passed locally and live on `/demo`: title `Demo — Backfill Timecards`, `lang=en`, one `h1`, `main`, complete image alternatives, labelled buttons, and zero console errors.
- Desktop and 390 px live runs showed the banner and sample, had no horizontal overflow, no off-origin requests, zero console/page errors, working first-tab skip navigation, and zero serious/critical axe violations.
- Keyboard dialog Escape/focus restoration, reduced motion, and 44 px mobile targets pass in the repository suite.
- Fresh live service-worker contexts loaded `/demo` offline with the sample board and `Offline · saved here`. A two-revision local worker check surfaced **An updated timecard is ready.** with no console errors.
- A live smoke flow proved demo reload removes a temporary demo change; **Start for real** leaves zero demo entries and preserves a real work block.
- Evidence is under `.factory/evidence/repair-4-local/` and `.factory/evidence/repair-4-live/`.

## Performance and budgets

Final production output:

| Asset | Result | Budget |
| --- | ---: | ---: |
| Inline JavaScript | 44,620 B raw / 13,638 B gzip | ≤ 200 KB |
| Inline CSS | 18,366 B raw / 4,741 B gzip | ≤ 50 KB |
| Fonts | 0 B | ≤ 120 KB |
| Mobile hero AVIF | 15,163 B | ≤ 300 KB |
| Complete `dist/` | 284,021 B | — |

Lighthouse 12.8.2 on the final live `/demo` build: Performance 100, Accessibility 100, Best Practices 100, SEO 100, FCP 1.01 s, LCP 1.21 s, TBT 42 ms, CLS 0, transfer 68,404 B.

## Deployment, response policy, and live identity

- `/opt/fleet/lib/deploy-static.sh backfill-timecards /work/repo/dist` completed successfully.
- All 18 served files match the final local build byte-for-byte. Root SHA-256: `adfd326ee23c9f127ce77eab2d84e217a7a4687315b8dda1c50ec05c9d34cdf1`; worker SHA-256: `d8a71d892175bfc575ced90c8a9346024ed9ea4de9ca6234923996c704ce9ca4`.
- Root, `/demo`, Privacy, Terms, manifest, worker, hero, and icon return 200. HTTP redirects to HTTPS with 301; ETag revalidation returns 304.
- Root is no-cache, `sw.js` is no-store, and assets are one-year immutable. AVIF and manifest MIME types are correct.
- Live headers include HSTS, CSP with `frame-ancestors 'none'`, X-Frame-Options, nosniff, COOP/CORP, Permissions-Policy, and strict-origin referrer policy.
- The in-product checkout URL returns 303 to hosted Dodo checkout. A fresh browser confirmed **Backfill Timecards Pattern Deck**, **$18.00**, one-time. Invalid license verification returns the expected structured `valid: false` response; the verifier's passing rate-limit evidence remains unchanged.

## Known limits

Monthly/yearly, malformed, and open-ended recurrence rules remain deliberately rejected with export guidance rather than guessed. No release-blocking product gaps remain.

The three modified `graphify-out/` files were already present on entry and were intentionally not staged or changed by this repair.
