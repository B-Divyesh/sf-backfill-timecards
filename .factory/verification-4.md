# Verification 4 — Backfill Timecards

**Result: FAIL**

Tested candidate: `bef3fb93d3b494de256aeabc65a3964068c13a1b` (`main`)

Live URL: <https://backfill-timecards.sociobot.in/>

Verified 2026-08-28 UTC from a fresh detached clone at the candidate SHA. This is an independent QA report; product source was not modified.

## Release-blocking defect

### High — license API has no observed rate limiting

The product calls `GET https://api.sociobot.in/api/v1/products/backfill-timecards/verify?license=…` after a license is restored or rechecked. The acceptance contract requires any such endpoint to return `429` with `Retry-After` under a rapid burst.

- A single invalid-token request returned `200 OK` with `{"expires_at":null,"reason":"invalid","valid":false}`.
- A burst of **40 requests**, sent with 20-way concurrency, returned **40 × `200`**. No response returned `429`; no `Retry-After` header was present.
- Observed threshold: **not reached at 40 requests**.

This is outside the static PWA source, but it is an invoked production product endpoint and fails the explicit release acceptance condition. Add server-side per-client/IP/token rate limiting with a `429` response and `Retry-After`, then redeploy and retest.

## What passed

### Clean build and repository checks

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

- `npm ci`: 68 packages installed; audit reported 0 vulnerabilities.
- Typecheck and lint (both `tsc --noEmit`): passed.
- Unit tests: 8/8 passed.
- Playwright 1.58.2: 28/28 passed across desktop Chromium and 390×844 mobile (one desktop skip is the intentional mobile-only target-size assertion).
- Production build passed and produced `dist/`. The app is a single 60,248 B HTML shell, 18,175 B gzip; inline initial JS is 38,549 B and CSS 15,795 B, both below the 200 KB/50 KB budgets. No fonts are shipped. The 640px AVIF hero is 15,163 B.

### Product workflow and recovery

Fresh browser checks and the repository E2E suite exercised:

- Manual work-block creation, persistence across reload, project→client recall, CSV export, edit/copy/delete, and source labels.
- An invalid equal-time block: `End time must be later than start time.` was announced and focus moved to End; a 23:00–01:00 next-day block saved as 2h.
- Local `.ics` import, event selection, recurrence expansion, overnight events, explicit opt-in billability (default is non-billable), description exclusion by default, and CSV output.
- Malformed calendar (`No timed events were found…`) and malformed backup recovery without replacing valid existing work; no-selected-events recovery (`Select at least one event to import.`).
- JSON backup export/import and confirmed local-data erasure controls.

### Privacy, browser safety, accessibility, and PWA

- Normal work from a clean local or live page made no outbound requests and caused no browser console/page errors. Timecards use IndexedDB; license data is only in localStorage when a buyer supplies a token. No sign-in is present.
- Live desktop and 390px mobile axe scans: **0 serious/critical findings**. The document has `lang=en`, one `h1`, a `main`, title, image alt text, labels, a keyboard skip link, visible coral focus outline, dialog Escape/focus restoration, and no undersized visible mobile buttons/links. With reduced motion, toast transition duration is 0.01ms.
- PWA manifest has any/maskable 192/512 icons, standalone display, matching splash colors, and versioned start URL. Fresh service-worker offline reload passed after first visit; the board remained available after visiting `/privacy/`. A two-version local worker test (v1.0.3 → v1.0.4) displayed **“An updated timecard is ready. Refresh”**.
- Live response headers included CSP limited to self plus the documented Sociobot billing hosts, HSTS, `X-Frame-Options: DENY`, `nosniff`, COOP/CORP, strict-origin referrer policy, and a restrictive Permissions-Policy. Root/legal are no-cache; `sw.js` is no-store; asset cache policy is configured one-year immutable. No third-party scripts/fonts/CDNs were found.

### Deployment identity and performance

The live root, manifest, service worker, privacy page, and terms page exactly matched locally built artifacts by SHA-256:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` / live `/` | `87031c353f125c18cdc887c07e40ff8196fb28c053ad5a4d09ab471549cafa0e` |
| `manifest.webmanifest` | `b8d51858cdb2c62f82cf939310544acd2395a8816abce0f34f7c4989f6589971` |
| `sw.js` | `cc1fd204f89c74468b8f9c85a36f25abac64d44af2b29d45147a9a4a59de80ac` |

One local mobile Lighthouse 13.4.1 simulated-throttle run scored Performance 93, Accessibility 100, Best Practices 100, and SEO 100 (FCP 0.8s, LCP 1.4s, TTI 1.4s, CLS 0). Lighthouse reported a late full-page-screenshot `TARGET_CRASHED` harness error after collecting these metrics; direct Playwright runs were error-free, so this was not counted as a product defect.

## Retest instruction

After adding rate limiting to the live billing verify endpoint, repeat a concurrent invalid-token burst and record the first `429` and its `Retry-After` value. Then the candidate can be reconsidered; no application-code defect was found in this verification.
