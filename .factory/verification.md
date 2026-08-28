# Independent product verification — FAIL

Date: 2026-08-28 UTC

Work order: `backfill-timecards-verify-1`

Candidate: `5edd6e9dbccf946470c2f15da7021b94c88826c1`

Live URL: <https://backfill-timecards.sociobot.in/>

Artifact: offline-first PWA

## Verdict

**FAIL — do not promote this candidate.**

The previous deployment concern is resolved: the live site is reachable and every one of the 18 files in a fresh candidate build is byte-for-byte identical to the corresponding live URL. The release is blocked by three independently reproduced product defects: legal-page navigation can replace the cached offline app shell, malformed backup data can replace valid data and leave the app unrecoverable through its UI, and a calendar event crossing midnight silently exports zero hours.

No product code was changed during verification.

## Release-blocking defects

### P1 — Visiting a legal page can replace the offline app with that legal page

The service worker stores every successful navigation response under the fixed `/index.html` cache key. This includes `/privacy/` and `/terms/`, not only the application shell.

Reproduction on the live deployment:

1. Open `/`, wait for `navigator.serviceWorker.ready`, and confirm the page is controlled.
2. Navigate to `/privacy/` while online.
3. Inspect `backfill-v1.0.0-shell`: its `/index.html` entry now has response URL `/privacy/` and title `Privacy — Backfill Timecards`.
4. Disable the browser HTTP cache, go offline, and navigate to `/?offline-check=1`.

Actual result: the root URL renders `Privacy — Backfill Timecards`, heading `Your work stays yours.`, and has no `Add work block` control. Expected result: the cached weekly board loads. This violates the defining offline-PWA requirement and can prevent access to locally stored timecards when offline.

### P1 — A malformed backup replaces valid data and can leave the app stuck on its fatal screen

Reproduction on the live deployment:

1. Add a valid work block named `Valid local work`.
2. Import and confirm a syntactically valid JSON object with `version: 1`, array properties, and one incomplete entry: `{"id":"bad","date":"2026-08-24"}`.
3. Inspect IndexedDB, then reload.

Actual result: the import clears the existing data before validating entry fields and persists the malformed record. Reload logs `TypeError: Cannot read properties of undefined (reading 'split')` and renders only `Your timecard could not be opened`. The fatal screen offers reload, which repeats the failure; the in-app erase/restore controls are unavailable. Expected result: reject the invalid backup without altering current data and report a recoverable error.

This is a local-data-loss and recovery defect in a product whose contract explicitly requires user-owned export/import/deletion.

### P1 — A calendar event crossing midnight silently exports `0.00` hours

Imported event exercised:

```text
DTSTART:20260824T230000
DTEND:20260825T010000
SUMMARY:Overnight maintenance
```

Actual result: the row shows `23:00 / 0m`, the weekly and billable totals remain `0m`, and CSV contains:

```csv
"2026-08-24","23:00","01:00","0.00","","Operations","Overnight maintenance","Yes","calendar"
```

Expected result: preserve the two-hour duration across the date boundary or reject the event with a clear review error. Silently producing an invoice-ready zero-hour row is a core correctness failure.

## Other defects and observations

### P2 — Recurring calendar events are not expanded

A weekly event with `DTSTART:20260803T100000` and `RRULE:FREQ=WEEKLY;COUNT=5` produced only the August 3 master event. Import moved the board to August 3–9 and did not offer the August 24 occurrence. Many calendar exports represent recurring meetings this way, so users must first export expanded occurrences or recreate them manually. This limitation was disclosed in the builder handoff but remains a gap against general calendar import.

### P2 — Some mobile interactive targets are below the required 44 × 44 CSS px

At exactly 390 px, computed sizes were:

- Brand/home link: 137 × 40 px
- Privacy link: 54.6 × 19.5 px
- Terms link: 39 × 19.5 px
- Param Factory link: 101.4 × 19.5 px

Primary timecard controls passed; populated-row Edit/Copy/Pattern/Delete controls were each 62.5 × 44 px.

### P2 — Deployment caching and MIME policy do not meet the supplied production guidance

- Every tested response, including images and icons, uses `cache-control: public, must-revalidate, max-age=30`; no static asset has long-lived immutable caching.
- `.avif` files and `manifest.webmanifest` are served as `application/octet-stream` rather than image/AVIF and manifest JSON media types.
- Chromium still loaded the AVIF and reported no manifest parsing errors, so this did not independently block use.

### P3 — Browser response hardening is incomplete

HTTPS redirects correctly and live responses include HSTS, `nosniff`, and `strict-origin-when-cross-origin`. They do not include Content-Security-Policy (including `frame-ancestors`), X-Frame-Options, Permissions-Policy, or cross-origin isolation headers. The HSTS value is `max-age=10886400; includeSubDomains; preload`, shorter than the usual preload eligibility duration.

## Evidence

### Clean source gates

An isolated detached worktree was created at the candidate commit; the pre-existing untracked `graphify-out/` directory in the main workspace was not included.

| Check | Result |
| --- | --- |
| Node / npm | `v22.23.2` / `10.9.8` |
| `npm ci` | PASS; 68 packages, 0 vulnerabilities |
| `npm test` | PASS; 4/4 Vitest and 6/6 Playwright tests |
| Type check | PASS through `tsc --noEmit` in the build |
| Lint | No lint script exists in `package.json` |
| `npm run build` | PASS; Vite 6.4.3, 10 modules, `dist/` produced |
| Cleanliness | Candidate worktree remained clean after tests/build |

The exact production build produced `dist/index.html` at 49,826 bytes raw / 14,987 bytes gzip. Its SHA-256 is `59509d8f3b42059a40b0f57f50731140eadf82f78d54924e19259860a93eabf1`.

### Deployment identity and transport

- HTTPS root: HTTP/2 `200`; HTTP redirects to HTTPS with `301`.
- TLS verification result: `0`; no redirect from the HTTPS canonical URL.
- All 18 generated files—HTML, service worker, manifest, legal pages, metadata, icons, and image variants—matched the live responses byte-for-byte by SHA-256.
- Live `index.html`, `sw.js`, `manifest.webmanifest`, privacy, and terms hashes exactly matched their clean-build counterparts.
- ETag revalidation returned `304`.
- The deployment therefore matches candidate `5edd6e9…`; there is no current deployment-only mismatch.

### Core end-to-end behavior that passed

- Empty state and disabled empty CSV export.
- Native required-field validation and the custom equal start/end error; the error reads `End time must be later than start time.` and moves focus to End.
- Manual non-billable entry at the within-day boundary `00:00–23:59`, edit, IndexedDB persistence across reload, project-to-client recall, copy, cancel-delete, confirmed delete, and Undo.
- CSV filename, ordering, quoting, 1.50-hour conversion, and two restored rows.
- JSON export, invalid JSON parse error, erase cancellation, confirmed erase, and valid backup restore.
- Calendar invalid-file recovery, all-day omission, no-selection error, selective event import, optional confidential description exclusion, and calendar provenance.
- High-volume path: one local ICS with 30 events reviewed and imported all 30 rows, producing a 30-row CSV and a correct `30h` total; descriptions remained excluded by default.
- Paid contract without making a purchase: checkout URL is the Sociobot endpoint; a mocked successful live-page verification stored the returned token, stripped it from the address bar, unlocked Pattern Deck, cached the verdict so reload made no second request, and allowed an explicit recheck.

### Privacy and network behavior

- A fresh normal workflow issued requests only to `https://backfill-timecards.sociobot.in`; no third-party analytics, font, script, beacon, or API request occurred.
- Data was present only in IndexedDB database `backfill-timecards`; localStorage was empty without a license.
- Calendar contents remained local during import. The only code path for an external runtime request is license verification to `https://api.sociobot.in`, as disclosed.
- `/privacy/` and `/terms/` exist, match the candidate, and each passed axe with no violations.

### Accessibility, responsive behavior, and errors

- `/opt/fleet/lib/verify-url.sh`: PASS; title, `lang=en`, one h1, main landmark, image alt coverage, labelled buttons, and zero normal-load console errors.
- Playwright axe on a populated desktop board, empty 390 px mobile board, privacy, and terms: zero violations, including zero serious/critical findings.
- Keyboard: skip link is first, has a 4 px coral visible outline, activates to `#main`, all primary controls are reachable, the add dialog opens with focus inside, focus remains trapped, Escape closes it, and focus returns to the invoking Add control.
- Reduced motion: media query matched; scroll behavior became `auto` and transitions reduced to `0.01ms`.
- 390 × 844 mobile: no horizontal overflow; 16 px body text; add/edit dialog stayed within the viewport; populated entry actions remained 44 px high; no console/page errors.
- Normal desktop and mobile flows had zero console errors, page errors, or failed requests. The malformed-backup reproduction produced the specific console error described above.

### PWA behavior

- Manifest parsed with no Chromium errors and includes standalone display, versioned start URL, 192/512 icons, and a maskable icon.
- Live worker installed, activated, controlled the page, and preserved entries through a clean root offline reload.
- A controlled local two-revision service-worker test showed the `An updated timecard is ready.` toast and working Refresh action.
- The legal-navigation cache replacement described under P1 fails the broader offline reload requirement.

### Performance and budgets

Lighthouse 12.8.2, default throttled mobile profile, live URL:

| Metric | Result | Contract |
| --- | ---: | ---: |
| Performance | 99 | ≥ 90 |
| Accessibility | 100 | ≥ 95 |
| Best Practices | 100 | — |
| SEO | 100 | — |
| FCP | 1.0 s | — |
| LCP | 1.2 s | < 2.5 s |
| TBT | 120 ms | — |
| CLS | 0 | < 0.1 |
| Total transfer | 78,196 bytes | — |

Bundle inspection:

- Inline JavaScript: 32,986 bytes raw / 10,471 bytes gzip (budget ≤ 200 KB).
- Inline CSS: 15,737 bytes raw / 4,251 bytes gzip (budget ≤ 50 KB).
- Fonts: 0 bytes / no third-party font requests (budget ≤ 120 KB).
- 640 px hero AVIF: 15,163 bytes (budget ≤ 300 KB).

Lighthouse observed both 640 and 1024 AVIF requests and suggested about 25 KiB of responsive-image savings, but all stated load and payload budgets still passed.

## Required remediation and retest

1. Cache only the actual application shell as `/index.html`; do not overwrite it with arbitrary navigation responses. Retest root, privacy, terms, and deep navigation followed by cache-disabled offline reload.
2. Fully validate backup schema and entry fields before clearing any store. Make rejection non-destructive and provide a recovery path if stored data cannot be decoded.
3. Preserve end dates/durations for calendar events crossing midnight, or reject them visibly before import. Add unit and end-to-end coverage for the exact case above.
4. Expand recurring events in the selected week or state and enforce the required pre-expanded import format before accepting a file.
5. Increase all mobile targets to at least 44 × 44 px.
6. Correct manifest/AVIF media types and define intentional immutable asset caching and browser security policies at deployment.

After fixes, rerun the complete clean-checkout and live matrix; do not rely only on the existing happy-path offline test.
