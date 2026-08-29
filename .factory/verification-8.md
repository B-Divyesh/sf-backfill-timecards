# Independent product verification 8 — FAIL

Date: 2026-08-29 UTC
Work order: `backfill-timecards-verify-8`
Candidate: `c7ae522b3317e39f36b266e4cb14f03026fd7ed9`
Live URL: <https://backfill-timecards.sociobot.in/>
Artifact: local-first offline PWA

## Verdict

**FAIL — do not release this candidate.**

The live product is byte-identical to the candidate and works end to end. All nine declared claim commands return green after the locked clean install. The first-read gate passes on desktop and 390 px mobile. Independent normal, boundary, recovery, 30-row, privacy, accessibility, billing, performance, offline, and service-worker-update checks also pass.

One P1 release blocker remains in the claims contract: the exact tagged test for the quantitative billing claim does not prove the price or one-day cache boundary it declares. A green command can therefore coexist with a false declared claim. The supplied claims rules require the tagged sandbox test itself to assert every observable and quantitative part of its claim.

No product source was changed during verification.

## Release-blocking defect

### P1 — `billing-entitlement` test does not prove its full declared claim

`.factory/claims.json` declares:

> Pattern Deck costs $18 once through Sociobot billing; a new or restored token stays locked until verification succeeds, then a successful verdict is cached for one day.

Its exact command passes:

```sh
npm run test:e2e -- --project=chromium --grep @claim:billing-entitlement
```

However, the one matching tagged test in `tests/e2e/app.e2e.ts`:

- does not assert `$18` anywhere;
- does not advance time to just before and after 86,400,000 ms;
- only proves that one immediate reload reuses a cached success; and
- would still pass if the displayed/hosted price changed or the cache lifetime were only a few seconds.

This fails the attached claims requirement that each claim have exactly one tagged sandbox test which asserts the observable outcome, with quantitative numbers measured in that test. The `$18` copy is asserted by the separate `pattern-deck` test, which does not make the `billing-entitlement` command prove its own compound claim.

Fresh independent checks confirm that the deployed implementation is currently correct: hosted checkout shows **$18.00** as a one-time purchase; a fresh cached success makes zero verification requests; a verdict aged 86,400,001 ms makes one request; and a mocked revoked result locks Pattern Deck. Those checks do not repair the required repository claim test.

Required fix: make the single `@claim:billing-entitlement` test assert the displayed `$18` price and Sociobot checkout URL, use a controlled clock to prove no recheck before 24 hours and a recheck at/after 24 hours, and assert an invalid/revoked response locks the feature. Then rerun every exact claim command.

## Required first checks

### Claims gate

The clean clone initially had no `node_modules`, so `npm ci` installed the locked dependencies: 68 packages, zero audit vulnerabilities. Every exact command in `.factory/claims.json` was then run separately through the product demo entry point.

| Claim | Command result | Observable evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | Real work stayed separate; reset restored sample data; Start for real and tab close discarded demo storage. |
| `weekly-board` | PASS | Add, edit, copy, delete, Undo, and project-to-client recall passed. |
| `calendar-local` | PASS | Bounded recurrence, overnight import, privacy defaults, and same-origin request checks passed. |
| `csv-export` | PASS | Filename, full header, six sample rows, and sample fields passed. |
| `local-archive` | PASS | Export, erase, and restore returned the sample. |
| `offline-reload` | PASS | Manifest checks and controlled offline demo reload passed. |
| `pattern-deck` | PASS | Pattern save and three-row previous-week clone passed. |
| `privacy-local` | PASS | Normal work used IndexedDB with no account, demo storage, license, or off-origin request. |
| `billing-entitlement` | **Command PASS / contract FAIL** | Forged-token lock, mocked restore, checkout URL, and immediate cache reuse passed; price and 24-hour boundary are not asserted. |

No claim command failed at runtime. Release remains blocked because the billing claim's tagged test does not prove its complete quantitative statement.

### Cold first-read gate

PASS at 1440×900 and 390×844 in fresh contexts before scrolling or clicking.

- What it does: **“Reconstruct your freelance workweek”** into an invoice-ready timecard.
- Who it serves: freelancers logging work after the fact from calendar clues and memory.
- What to click first: **Try it with sample data**.
- What happens next: the adjacent sentence says the sample opens separately without changing real work.

At 390 px, the primary action was fully visible at y=396.9–442.9, along with the audience sentence and privacy/offline/price facts. One click opened `/demo` with six current-week blocks and the persistent **Demo — sample data, nothing is saved** banner.

Screenshots: `.factory/qa-artifacts/live-first-read-desktop.png`, `.factory/qa-artifacts/live-first-read-mobile.png`, and `.factory/qa-artifacts/live-demo-mobile.png`.

## Clean candidate gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — `git rev-parse HEAD` = `c7ae522b3317e39f36b266e4cb14f03026fd7ed9` |
| `npm ci` | PASS — 68 packages, 0 vulnerabilities |
| Nine exact claim commands | PASS at command level — 9/9 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — exact production `dist/` produced |
| `npm test` | PASS — 11 Vitest tests; 47 Playwright tests passed; 1 intentional desktop skip of a mobile-only target check |
| `git diff --check` | PASS |

The repository was already dirty only in four `graphify-out` analysis files before QA began. They were not changed intentionally, staged, or included in this verification commit.

## Independent live product workflow

- Added a normal private record with literal `<`, `>`, `&`, and quote characters; it rendered as text, not markup, and persisted after reload.
- Equal start/end time produced **End time must be later than start time** and focused End. Correcting to 23:00–01:00 with **Ends the next day** produced 2h.
- Entering the known project with different casing recalled the correct client.
- A malformed JSON backup produced the specific validation error, changed nothing, and the private record survived reload.
- Entering demo showed six realistic rows and no private record.
- An open-ended calendar recurrence produced the prescribed recovery message. Replacing it in the same dialog with two bounded recurring occurrences plus one overnight event recovered correctly.
- Selecting only two of three events imported only those two. Calendar descriptions stayed excluded and billability stayed off without explicit opt-in.
- The resulting eight-row CSV had eight data rows, included the 2-hour overnight event as non-billable calendar work, and contained no confidential descriptions.
- Reset demo restored six rows. Start for real removed `demo:backfill-timecards` and returned to the untouched private record.
- In a separate fresh normal workspace, 30 rows were created, displayed, and exported as 30 CSV rows. The automated create-and-export exercise completed in 11.986 seconds; this is functional volume evidence, not a human usability-time claim.
- Valid product routes logged zero console/page errors. The complete normal/demo workflow contacted only `https://backfill-timecards.sociobot.in`.

The representative job-to-be-done is functionally complete. No missed AI feature is indicated: the brief explicitly rejects automatic inference and the local review flow is more appropriate.

## Accessibility, responsive behavior, and motion

- `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, 626 ms navigation, `lang=en`, one h1, main landmark, complete image alt coverage, labelled buttons, and zero console/page errors.
- Fresh Playwright Axe scans found zero serious/critical findings on populated Demo, Privacy, and Terms. The 390 px populated demo also had zero serious/critical findings.
- At 390 px, document and viewport widths were both 390 px. Every visible link/button measured at least 44×44 CSS px.
- The first Tab focused the skip link with a visible 4 px solid coral outline; Enter moved focus to main.
- The demo was entered by keyboard. The native entry dialog retained focus through repeated Tab presses; Escape closed it and restored focus to its trigger.
- `prefers-reduced-motion: reduce` produced 0.01 ms transition and animation durations.
- Root first-read content and the populated demo were visually inspected at 390×844 with no clipping or hidden primary actions.

## Privacy, deployment identity, headers, and caching

Candidate and live SHA-256 hashes are identical:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `c87520b48cbc0d38cfbf382e8300f0b7f4a3f2d7f904f47113db8e62b5922543` |
| `assets/index-yP_b5WNC.js` | `bd136aeed23653986feb3b2b6446aac345469cde8ad09a664d395fb508f5ddaf` |
| `assets/index-tnjOD136.css` | `2c36da5c73499719b155ab5b4199ebe9637442bd44ffc896058d872ec1774b19` |
| `sw.js` | `d8590d3c5bd9796b5ecd85120243fd91df7ada1434209310a955a20364e27b38` |
| `manifest.webmanifest` | `a2d6cbbe52a1e3bb816aaf2ae4a76143f176b9fe6c9ac80153dc777444d11cfd` |

- `/`, `/demo`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, manifest, worker, robots, sitemap, JS, and CSS returned 200.
- An unknown route returned HTTP 404 with the designed 404 title, h1, navigation, and complete shared footer.
- HTTP redirected 301 to HTTPS. A conditional root request returned 304.
- Root and app routes use `no-cache, must-revalidate`; hashed assets use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`.
- Headers include HSTS, CSP with response-header `frame-ancestors 'none'`, nosniff, DENY framing, strict-origin referrer policy, restrictive Permissions Policy, COOP, and CORP.
- Root, Demo, Privacy, Terms, and 404 have route-appropriate titles, one h1, canonical/social/Twitter/apple metadata, landmarks, and versioned shared footers.
- All discovered internal and Param Factory links returned successfully.
- No sign-in exists, so Entra tenant validation is not applicable.

## PWA and offline behavior

- The manifest advertises the correct name, standalone display, versioned start URL, and 192/512/maskable icons.
- After live service-worker control, `/demo` reloaded offline with six rows, the demo banner, and **Offline · saved here**.
- A source-unmodified local response harness served worker revision QA-A and then QA-B. The app showed **An updated timecard is ready**, exposed **Refresh**, activated only the QA-B shell cache, removed QA-A, retained six sample rows, and logged no errors.

## Billing endpoint and product-class checks

The product is static and has no product backend, user accounts, library package, or CLI. Backend concurrency/health/persistence, Entra sign-in, and clean-consumer package checks are not applicable. The factory billing endpoints were tested because the product calls them.

- Fresh invalid-license requests 1–30 returned 200.
- Requests 31–40 returned 429 with `Retry-After: 4`.
- Observed allowance: **30 verification requests per client/window**.
- A real invalid token returned `{ valid: false, reason: "invalid" }`, stored a negative verdict, and left Pattern Deck locked.
- The product checkout endpoint returned 303 to `checkout.dodopayments.com`.
- The hosted checkout loaded successfully and displayed **Backfill Timecards Pattern Deck**, **$18.00**, and one-time-unlock copy.
- No product payment form or card field exists; payment details are handled on the hosted merchant page.

## Performance and budgets

Exact production sizes:

| Asset | Raw | gzip |
| --- | ---: | ---: |
| HTML | 8,706 B | — |
| Initial JS | 46,242 B | 14,001 B |
| Initial CSS | 18,406 B | 4,769 B |
| Mobile hero AVIF | 15,163 B | already compressed |
| Fonts | 0 B | 0 B |

Three fresh Lighthouse 13.0.1 live mobile-profile runs:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 97 | 100 | 100 | 100 | 1.435 s | 198.5 ms | 0 | 67,132 B |
| 2 | 100 | 100 | 100 | 100 | 1.428 s | 45 ms | 0 | 70,964 B |
| 3 | 99 | 100 | 100 | 100 | 1.569 s | 20.5 ms | 0 | 71,003 B |

Median Performance is 99. All static byte, LCP, CLS, and Lighthouse category gates pass.

## Evidence

- `.factory/evidence/verification-8-live/verify.json`
- `.factory/evidence/verification-8-live/screenshot-desktop.png`
- `.factory/evidence/verification-8-live/screenshot-mobile.png`
- `.factory/evidence/verification-8-live/lighthouse-1.json`
- `.factory/evidence/verification-8-live/lighthouse-2.json`
- `.factory/evidence/verification-8-live/lighthouse-3.json`
- `.factory/qa-artifacts/live-qa.mjs`
- `.factory/qa-artifacts/sw-update-qa.mjs`

## Release decision

Do not release until the `billing-entitlement` tagged claim test proves its full `$18` and one-day quantitative statement. After that test-only repair, rerun the nine exact claim commands and the normal repository gates. The deployed runtime otherwise meets the researched brief and quality bar in this verification.
