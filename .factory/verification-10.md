# Backfill Timecards — independent verification 10

Date: 2026-08-29 UTC

Work order: `backfill-timecards-verify-10`

Candidate: `930c57724d791e4b6d55f726fba89d13635cb0ba`

Live URL: <https://backfill-timecards.sociobot.in>

Result: **FAIL — a mandatory claim test fails, so this candidate is not releasable.**

## Release findings

### BLOCKER V10-1 — the declared billing claim test fails

The exact command from `.factory/claims.json` fails in both the supplied checkout and a fresh detached clone:

```text
npm run test:e2e -- --project=chromium --grep @claim:billing-entitlement
Error: clock.pauseAt: Error: Cannot fast-forward to the past
tests/e2e/app.e2e.ts:423:20
```

The test installs a clock at `verifiedAt - 1,000 ms`, performs navigation and several UI assertions, then calls `pauseAt(verifiedAt)`. Those operations take more than one second, so the requested time is already in the past. The failure reproduced three times, including twice before the broader test matrix. Under the claims acceptance contract, any failing claim test blocks release even when the underlying product behavior works.

A separate frozen-clock live check moved the pause before navigation and verified the product behavior itself: two requests before the one-day boundary (forged token plus successful restore), no recheck at `86,399,999 ms`, then one recheck and a locked Pattern Deck at `86,400,000 ms`. This narrows the defect to the required proof, not the entitlement implementation.

Evidence: `.factory/verification-evidence-10/claim-billing-failure/`.

### MEDIUM V10-2 — one mobile touch target is narrower than 44 px

At 390×844, the visible header **Demo** link measures **38×44 CSS px**. The product and accessibility contracts require targets of at least 44×44 px. Every other visible `a`, `button`, and `input` on the populated mobile demo met the check.

### MEDIUM V10-3 — visitor-facing claims are absent from the claim registry

The following observable promises are not stated in any `.factory/claims.json` claim and are not exercised by the tagged test named there:

- `.factory/demo.md`: leaving Demo through Privacy, Terms, home, or Param Factory clears demo records. The demo test covers Reset, Start for real, and tab close, but not those four navigation paths.
- `/terms` and the unlock dialog: a refund automatically revokes the license. The billing test mocks a revoked verification response; it does not prove that a merchant refund causes that response.
- `README.md`: `npm run build` produces “reproducible static output.” The repository builds once in its tests but does not compare two clean builds.

The claims contract says an unlisted claim is a failing finding until the copy is removed or a tagged sandbox test is registered.

## Mandatory claim gate

`.factory/claims.json` exists. Each id occurs in exactly one tagged test. Every listed command was run separately through the product preview from a clean detached clone at the candidate SHA.

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | Isolated sample, Reset, Start for real, and tab expiry passed. |
| `weekly-board` | PASS | Add, edit, copy, delete, undo, and client recall passed. |
| `calendar-local` | PASS | Local recurrence, overnight duration, privacy defaults, and request log passed. |
| `csv-export` | PASS | Filename, complete header, sample fields, and one row per block passed. |
| `local-archive` | PASS | Export, erase, and restore passed. |
| `offline-reload` | PASS | Install metadata and controlled offline demo reload passed. |
| `pattern-deck` | PASS | Saved pattern, previous-week clone, and free core tools passed. |
| `privacy-local` | PASS | Same-origin-only normal work and storage boundaries passed. |
| `billing-entitlement` | **FAIL** | Deterministic Playwright clock failure at line 423. |

Result: **8/9 claim commands pass; the mandatory gate fails.**

## Cold first-read test

**PASS** at 1440×900 and 390×844.

- What it does: reconstructs remembered and reviewed calendar work into a weekly timecard ready for invoicing.
- Who it is for: freelancers logging work after the fact.
- What to click first: **Try it with sample data**.

All three answers and the privacy, offline, and price facts are visible in the first 844 px on mobile. One click opens `/demo` with six realistic blocks and the persistent **Demo — sample data, nothing is saved** banner, Reset demo, and Start for real.

Evidence: `live-cold-desktop.png` and `live-cold-mobile-390.png` in `.factory/verification-evidence-10/`.

## Clean checkout and repository gates

Authoritative clean clone: `/tmp/backfill-timecards-qa-930c577-xNehWi`, detached at the full candidate SHA. `npm ci` installed 68 packages with zero audit vulnerabilities.

| Check | Result |
| --- | --- |
| `npm run test:unit` | PASS — 11/11 tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — exact production build emitted `dist/` |
| `npm test` | **FAIL** — 53 passed, 2 failed, 1 skipped after unit tests |

The two full-suite failures were the billing claim above and one Chromium headless process crash during the legal-page axe test. The legal-page test passed immediately when rerun alone, and independent live axe scans also passed, so the crash is recorded as runner instability rather than a product finding.

Production output:

- Initial JS: 48,666 bytes raw / 14.62 kB gzip.
- Initial CSS: 19,609 bytes raw / 4.99 kB gzip.
- No shipped fonts.
- Mobile Lighthouse total transfer: 65 KiB.

These are within the 200 kB JS, 50 kB CSS, and 120 kB font budgets.

## Independent end-to-end product exercise

The live demo was exercised independently, not only through repository tests:

- Opened the six-row sample in one click.
- Entered an invalid `23:00–23:00` block, received **End time must be later than start time**, corrected it to `23:00–23:59`, and saved it.
- Tried a structurally invalid JSON backup. The app reported **Backup work block 1 is incomplete or invalid. Nothing was changed.** The valid block remained.
- Tried an invalid calendar file and received a useful recovery message.
- Imported two daily occurrences plus one overnight `23:00–01:00` event. Descriptions stayed excluded and the overnight row remained two hours.
- Exported ten visible blocks and received ten CSV rows with the complete quoted header and the overnight `2.00` hours value.
- Normal workspace add/persist created only the `backfill-timecards` IndexedDB database. It created no localStorage/sessionStorage keys, account controls, or off-origin requests.

No console errors, page errors, failed requests, or off-origin requests occurred during the complete demo flow. Evidence: `live-demo-desktop.png`.

## Accessibility, mobile, and interaction

- `/`, `/demo`, `/privacy/`, `/terms/`, and the real 404 were scanned at desktop and 390 px: zero serious/critical axe findings.
- `verify-url.sh` passed `/` and `/demo`: HTTP 200, `lang=en`, one h1, main landmark, complete image alternatives and button names, and zero console/page errors.
- First Tab focuses **Skip to main content** with a 4 px coral outline; Enter moves focus to `main`.
- Opening Add work block by keyboard focuses the dialog close button; Escape closes it and restores focus to the originating button.
- Reduced motion computes transitions to `0.01 ms`.
- Text enlarged to 200% at 390 px had no horizontal overflow or clipped element.
- Token contrast checks met the applicable thresholds. The focus coral is 4.09:1 against paper; body/muted combinations range from 5.97:1 to 17.61:1.
- Mobile document width stayed 390 px. V10-2 is the sole observed target-size failure.

The cassette-era reconstruction-zine design is product-specific, legible, and consistent with `.factory/design.md`. The generated hero asset and authored icon provenance are documented.

## PWA, privacy, headers, caching, and performance

- Manifest: correct name/short name, `standalone`, versioned `/?v=6` start URL, 192/512 icons, and a maskable icon.
- Live service worker controlled `/demo`; an offline reload retained all six sample blocks and showed **Offline · saved here**.
- A clean two-revision local worker simulation changed only `backfill-v1.0.7` to `backfill-v1.0.8`. The app displayed **An updated timecard is ready** with a visible Refresh action and no errors.
- Cold and complete normal/demo request logs were same-origin only. There are no analytics, third-party fonts/scripts, or sign-in controls.
- Root HTML returns `Cache-Control: no-cache, must-revalidate`; hashed JS/CSS and hero assets return one-year immutable caching; `sw.js` returns `no-cache, no-store, must-revalidate`; a conditional root request returned 304.
- Security headers include HSTS, CSP, `frame-ancestors 'none'`, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy, COOP, and CORP.
- HTTP redirects 301 to HTTPS. The designed unknown route returns 404. All rendered internal/external links returned 200; the purchase endpoint returned 303 to hosted Dodo checkout.
- Fresh rate-limit check: verification requests 1–30 returned 200; request 31 returned **429** with **`Retry-After: 3`**. Observed allowance: 30 requests per client window.
- Live mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 140 ms, CLS 0.

No product sign-in or product-owned backend exists, so identity-provider, concurrency, persistence-boundary, and health-identity backend checks do not apply. The Sociobot billing endpoint rate limit was checked as required.

## Deployment identity

The previous deployment-only concern is not present. All **24** public files in the fresh candidate build match the live bytes by SHA-256, including root and Demo HTML, JS/CSS, service worker, manifest, legal/404 pages, metadata files, icons, and responsive art. `staticwebapp.config.json` is deployment configuration and is not served as a public asset.

## Required release action

1. Make `@claim:billing-entitlement` freeze the clock before time-consuming navigation/assertions, then rerun every exact claim command and `npm test` from a clean clone.
2. Give the mobile Demo navigation link a 44×44 px hit area and retest all visible targets at 390 px.
3. Remove the unlisted promises or add one exact tagged sandbox test per claim and register it in `.factory/claims.json`.

Do not release candidate `930c57724d791e4b6d55f726fba89d13635cb0ba` until the claim gate and full suite pass.
