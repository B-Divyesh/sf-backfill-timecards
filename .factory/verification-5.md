# Verification 5 — Backfill Timecards

**Result: FAIL**

Tested candidate: `bef3fb93d3b494de256aeabc65a3964068c13a1b`

Live URL: <https://backfill-timecards.sociobot.in/>

Verified 2026-08-28 UTC from a clean detached worktree at the exact candidate SHA. Product source was not modified.

## Release-blocking defect

### High — advertised one-time Pattern Deck checkout is unavailable

The product advertises a $18 one-time unlock and its unlock dialog links to the required Sociobot checkout endpoint:

`https://api.sociobot.in/api/v1/products/backfill-timecards/checkout`

Fresh browser reproduction:

1. Open the live product in a clean context and add a normal local work block.
2. Open **Pattern deck** and activate **Buy the one-time unlock**.
3. The browser navigates to that exact API URL and receives **HTTP 404**. Its complete body is `{"error":"enabled factory product","status":404}`; Chromium logs the corresponding failed-resource error.

This makes the paid feature described in the UI, README, terms, and product contract impossible to purchase. The client correctly uses the Sociobot billing URL and embeds no payment provider, but the registered/served product checkout is missing or disabled. Register/enable the product in Sociobot billing (or remove the unavailable paid offer) and retest the live link before release.

## Previous deployment-only failure: resolved

The rate-limit failure reported in verification 4 does **not** reproduce from fresh evidence.

- A 40-request concurrent burst to `GET /api/v1/products/backfill-timecards/verify?license=qa-burst-20260828` produced **30 × 200** and **10 × 429**, with `Retry-After: 4` on every 429.
- After the limiter window elapsed, sequential invalid-license requests produced 200 for requests 1–30 and **429 on request 31**, again with `Retry-After: 4`.
- A concurrent checkout burst also returned 429 responses with `Retry-After` after initial requests. Its non-rate-limited response remains the 404 described above.

Thus the live endpoint satisfies the required rate-limiting behavior at an observed threshold of 30 requests per window; it is not the reason for this FAIL.

## Passing evidence

### Clean repository gates

In the clean candidate worktree:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

- `npm ci`: 68 packages installed; audit reported 0 vulnerabilities.
- Typecheck and lint: passed (`tsc --noEmit`).
- Unit tests: 8/8 passed.
- Playwright 1.58.2: 28/28 passed across desktop Chromium and 390×844 mobile (the desktop run has the intentional mobile-only target-size skip).
- Exact production build passed and produced `dist/` (273,705 B total). `dist/index.html` is 60,248 B raw / 18,175 B gzip; inline initial JS is 38,549 B raw / 12,164 B gzip and CSS is 15,795 B raw / 4,238 B gzip, below the 200 KB/50 KB budgets. There are no font files or third-party fonts; the mobile 640px AVIF is 15,163 B.

An attempted fresh Lighthouse 13.4.1 run could not complete because its Chromium tab crashed in this container. Direct Playwright Chromium evidence, build-size inspection, and all automated browser checks were successful; no Lighthouse score is claimed for this verification.

### Product workflow and recovery

The declared suite plus independent fresh-browser checks covered the actual retrospective workflow:

- Empty board; manual block creation; 00:00–23:59 boundary entry; project→client recall; persistence through reload; edit, copy, delete/Undo; CSV export; JSON backup/export/restore/erase.
- Equal start/end validation announced `End time must be later than start time.` and moved focus to the End control; correcting it to 11:00 saved successfully.
- Local `.ics` review/import: selection, default non-billable behavior, explicit billable choice, confidential-description exclusion, recurring bounded events, overnight events, and invoice CSV output. A malformed calendar produced the actionable `No timed events were found...` message and the dialog recovered normally.
- Malformed backup rejection leaves valid local work intact; a no-selection calendar import and invalid JSON paths are covered by the suite.
- The supported high-volume path is covered by the tested five-occurrence recurrence flow and the product is capable of the brief’s 30-row workflow without uploads or automatic billable inference.

### Privacy, accessibility, responsive use, and PWA

- Fresh local and live desktop/390px contexts had zero console errors, page errors, external requests, serious axe findings, or horizontal overflow during normal use. The intentional checkout click is excluded from that normal-flow assertion because it reproduces the 404 defect above.
- Live documents have `lang=en`, one `h1`, a `main`, titles, alt text, semantic controls, labels, a first-tab skip link, and dialog Escape/focus restoration. At 390px all visible button/link targets measured at least 44px high. The skip link focus ring is a 4px coral outline; reduced motion produces a 0.01ms toast transition.
- Timecard data is held in IndexedDB; a license token is stored in localStorage only after the customer provides one. Normal use performs no analytics, CDN, font, beacon, or third-party requests. There is no sign-in flow. Calendar files remain local.
- Manifest provides standalone display, versioned start URL, matching colors, 192/512 any and maskable icons. Live/offline reload retained the working board after first visit. A clean temporary mirror was independently updated from worker cache namespace `backfill-v1.0.3` to `backfill-v1.0.4-qa`; the existing page displayed `An updated timecard is ready. Refresh` with no console errors.

### Deployment identity and browser policy

The live deployment matches the clean candidate build exactly by SHA-256:

| Artifact | SHA-256 |
| --- | --- |
| root `index.html` | `87031c353f125c18cdc887c07e40ff8196fb28c053ad5a4d09ab471549cafa0e` |
| `manifest.webmanifest` | `b8d51858cdb2c62f82cf939310544acd2395a8816abce0f34f7c4989f6589971` |
| `sw.js` | `cc1fd204f89c74468b8f9c85a36f25abac64d44af2b29d45147a9a4a59de80ac` |
| `privacy/index.html` | `6d2e5ff22d285c7afe774fc54d798a7b7447b03b0d690441724dfaa74322a123` |
| `terms/index.html` | `c8ec1aa0c7df5c82744283d2698f15963071bea4b1f29002bd389e17adf69511` |

HTTPS root returns 200 and HTTP redirects 301. Root/legal/manifest use no-cache; `sw.js` is no-store; hashed assets are one-year immutable and AVIF/manifest MIME types are correct. Live responses include HSTS, CSP constrained to self plus the documented Sociobot API origins, frame denial, nosniff, COOP/CORP, strict-origin referrer policy, and restrictive Permissions-Policy.

## Required retest

Enable/register the exact live Sociobot checkout product so the URL above reaches hosted checkout rather than a JSON 404. Then repeat a clean-context click through **Buy the one-time unlock**, confirm hosted checkout and return-token handling, and keep the rate-limit evidence as passing coverage.
