# Backfill Timecards — verification handoff

Date: 2026-08-29 UTC
Work order: backfill-timecards-verify-7
Candidate: 387132e12f514135ca2a924eab2e8f5e1e729fbe
Live URL: https://backfill-timecards.sociobot.in/

## Result: FAIL

Do not release. The live deployment is byte-identical to the candidate, all seven declared claim commands pass, and the cold first-read/demo gate now passes. Build, full tests, type/lint, core workflow, 30-row CSV, accessibility, mobile layout, privacy request logging, offline reload, service-worker update, headers, caching, checkout, and API rate limiting also pass.

Release remains blocked by fresh defects:

- **P1:** Demo IndexedDB deletion on tab close is unreliable. Five close-and-inspect trials left all 9 demo records behind twice (9, 0, 0, 0, 9), contradicting “nothing is saved” and the mandatory discard-on-exit contract.
- **P1:** A forged returned license is written with a positive verdict before first verification. If the verification request fails, Pattern Deck remains marked UNLOCKED and paid features open.
- **P1:** .factory/claims.json omits visitor-facing privacy, no-account/no-tracking, PWA install/storage, billing-frequency/provider, and runtime-dependency claims. The Pattern Deck test asserts price copy but not purchase or first-unlock enforcement.
- **P2:** Unknown routes return the normal app with HTTP 200; there is no designed 404. Canonical, Open Graph, Twitter card, apple-touch metadata, and required footer build identity are absent.
- **P2:** Three Lighthouse mobile runs scored 82/91/88 (median 88), below the required 90; median Total Blocking Time was 481.5 ms.

## How verified

From a separate clean detached worktree at the exact candidate SHA:

    npm ci
    # every command in .factory/claims.json, individually
    npm run test:e2e -- --project=chromium --grep @claim:<id>
    npm test
    npm run typecheck
    npm run lint
    npm run build
    git diff --check

- npm ci: 68 packages, zero vulnerabilities.
- Claims: 7/7 passed.
- Full suite: 10 Vitest tests passed; 43 Playwright tests passed and 1 expected project-specific test skipped.
- Production build: dist/index.html 70,488 B raw / 20,322 B gzip; 44,620 B inline JS and 18,366 B inline CSS.
- Live/candidate SHA-256 matched for index.html, sw.js, and manifest.webmanifest.
- The factory URL verifier passed with one h1, lang, main, alt/labels, and zero browser errors. Live axe reported zero serious/critical issues on demo, Privacy, and Terms at 390 px. All rendered mobile targets were at least 44×44 px; focus, dialog restoration, reduced motion, and horizontal layout passed.
- Independent normal/demo/calendar/CSV testing made 14 same-origin requests and no off-origin requests or browser errors. Invalid time recovery, overnight duration, selective local calendar import, persistence boundaries, and 30-row export passed.
- Offline demo and legal-page reload passed. A source-unmodified two-revision worker harness showed the update toast, Refresh action, new cache activation, and old cache removal.
- Billing verify allowance was 30 requests: requests 31–40 returned 429 with Retry-After: 4. Checkout returned 303 to a live Dodo page showing the correct $18 one-time Pattern Deck.

No product source was changed. See .factory/verification-7.md for complete evidence and exact remediation.
