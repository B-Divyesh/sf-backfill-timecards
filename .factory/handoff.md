# Backfill Timecards — repair handoff

Date: 2026-08-29 UTC
Work order: backfill-timecards-repair-5
Base verification: `0fb5d67336d4fa0d8f98aef7e6cdd6cd36e7b342` for candidate `387132e12f514135ca2a924eab2e8f5e1e729fbe`
Artifact: local-first offline PWA, static deployment

## Result: ready to release

Every release blocker in `.factory/verification-7.md` was reproduced against the source and repaired without reducing the already-passing timecard, calendar, export, demo, PWA, or free-tier workflows.

### Repairs

- Demo writes now use tab-scoped `sessionStorage` under `demo:backfill-timecards`, not IndexedDB. Browser tab closure therefore discards the sample by construction rather than depending on an asynchronous `pagehide` transaction. The app also removes a stale legacy demo IndexedDB database when a demo starts.
- Returned and pasted license tokens now begin locked. A positive cached verdict is written only after a successful Sociobot verification. A network outage retains access only for a previously successful verdict; a new or forged token remains locked.
- The claim registry now has nine complete, uniquely tagged browser claims. It covers demo tab closure, local/no-account/no-third-party runtime behavior, install metadata/offline behavior, and the full billing entitlement boundary in addition to the existing workflows.
- Added the designed `404.html`, Static Web Apps 404 response override, canonical/Open Graph/Twitter/apple-touch metadata, versioned shared footers, and a reviewed 1200×630 social card derived from the product’s existing original artwork.
- Replaced the large inline production bundle with immutable hashed CSS/JS assets. The worker injects those assets into its precache and now matches its named shell cache directly, preserving external assets on offline app-route reloads.

## Verification evidence

Performed from a clean dependency install:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm test
```

- `npm ci`: 68 packages installed; 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/` contains the static artifact with `index.html` at its root.
- `npm test`: passed — 11 Vitest tests and 48 Playwright tests (desktop + 390 px mobile). This includes Playwright Axe scans with zero serious/critical findings on populated demo, Privacy, and Terms; keyboard skip-link/dialog focus restoration; touch-target checks; reduced-motion behavior; normal/demo privacy request logging; offline reload; and both desktop/mobile product flows.
- Every exact command declared in `.factory/claims.json` was run separately with Chromium: 9/9 passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174/ .factory/evidence/repair-5-local`: passed. It recorded `lang=en`, one h1, a main landmark, complete image alt coverage, labelled buttons, zero console/page errors, and 532 ms local navigation.
- The installed `@axe-core/cli` tried to pair a Chrome 152 driver with the preinstalled Chrome 145 binary, so it could not start. The repository’s Playwright Axe integration is the accepted alternative and passed in the full suite above.
- A two-revision local worker harness (QA update A → B) showed the exact “An updated timecard is ready.” toast, the **Refresh** action, activation of the new cache, and no console errors.

### Performance

Three final Lighthouse 13.4.1 mobile-profile runs against the final local production build all scored 100 Performance and 100 Accessibility (also 100 Best Practices and SEO). Results were:

| Run | Performance | TBT | LCP | CLS |
| --- | ---: | ---: | ---: | ---: |
| 1 | 100 | 0 ms | 1.354 s | 0 |
| 2 | 100 | 0 ms | 1.355 s | 0 |
| 3 | 100 | 0 ms | 1.360 s | 0 |

Median Performance is 100 (required ≥90). The final audit reports 70,615 B transfer. The generated shell is 8,706 B raw / 2,919 B gzip; initial JS is 46,236 B raw / 14,080 B gzip; initial CSS is 18,406 B raw / 4,760 B gzip.

Evidence is retained in `.factory/evidence/repair-5-local/` (`verify.json`, desktop/mobile screenshots, and Lighthouse JSON reports). Final local build hashes:

```text
index.html            c87520b48cbc0d38cfbf382e8300f0b7f4a3f2d7f904f47113db8e62b5922543
sw.js                 d8590d3c5bd9796b5ecd85120243fd91df7ada1434209310a955a20364e27b38
manifest.webmanifest  a2d6cbbe52a1e3bb816aaf2ae4a76143f176b9fe6c9ac80153dc777444d11cfd
```

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` as the static site root. `staticwebapp.config.json` is copied into `dist/` and supplies the SPA fallback, designed 404 response, cache policy, MIME types, and response headers.

## Known gaps

None in the product workflow or release contract. The standalone Axe CLI is not runnable in this worker image because its downloaded ChromeDriver is newer than the preinstalled Chromium; the project’s Playwright Axe checks pass and remain the automated accessibility gate.
