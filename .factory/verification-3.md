# Independent product verification #3 — FAIL

Date: 2026-08-28 UTC
Work order: `backfill-timecards-verify-3`
Candidate: `bc3ba5974fd520f40969e716a39ae74efff14f74`
Live URL: <https://backfill-timecards.sociobot.in/>
Artifact: offline-first PWA

## Verdict

**FAIL — do not promote this candidate.**

The former deployment-only concern is not present. A clean build at the exact candidate SHA matches every one of the 18 public product files currently served by the canonical URL. The repaired offline-shell, backup-validation, overnight calendar-duration, security-header, and response-caching work all functioned in fresh checks.

This candidate nevertheless violates an explicit product constraint: importing a calendar event unconditionally creates a billable work block, with no choice to mark it non-billable before it is added. It also fails the supplied mobile performance gate in two of three fresh default-throttled Lighthouse runs.

## Defects

### P1 — Calendar import automatically marks every selected event billable

The researched brief says calendar import must be local, selective, and must **never infer billable time automatically**. The calendar review offers event selection, an optional description checkbox, project, and client. It has no billable/non-billable control. All selected events are preselected and the import implementation writes `billable: true` for every addition.

Fresh live reproduction:

1. Open the live board in a fresh browser context and choose **Import calendar**.
2. Select a local ICS containing `Personal medical appointment`, 13:00–14:00, with no work/billing metadata; leave the optional description unchecked.
3. Enter a project/client and choose **Add selected events**.

Actual result: the resulting calendar row says `calendar ✓ Billable`. This is not merely a display issue: the CSV generator emits `"Yes"` when that stored boolean is true. A confidential/non-work calendar clue can therefore become an invoice-ready billable row without an explicit user decision. The user can edit the row afterward, but that does not make the automatic classification honest or satisfy the constraint. Source inspection corroborates the live result in `src/app.ts` (`billable: true` in calendar import) and `src/csv.ts`.

Expected result: calendar imports should default to non-billable, or require an explicit billable choice per import/event before persisting the entries.

### P2 — Throttled mobile Lighthouse performance is not reliable

Lighthouse 12.8.2 was run three times against the live URL using fresh browser profiles, its default mobile/throttled settings, and Chromium 1208. Accessibility was 100 and CLS was 0 in each run, but two performance scores miss the required 90 threshold because of variable main-thread blocking time.

| Run | Performance | Accessibility | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 88 | 100 | 1,136 ms | 1,205 ms | 489 ms | 0.000 | 80,567 B |
| 2 | 84 | 100 | 999 ms | 1,209 ms | 623 ms | 0.000 | 80,555 B |
| 3 | 91 | 100 | 1,396 ms | 1,396 ms | 375 ms | 0.000 | 80,591 B |

The supplied performance policy requires mobile Lighthouse >= 90; accepting only the fastest run would conceal the failure. The previous CLS problem is fixed, but intermittent blocking remains.

### P2 — Recurring ICS masters are silently imported only once

A live import of one VEVENT with `DTSTART:20260824T100000`, `DTEND:20260824T110000`, and `RRULE:FREQ=DAILY;COUNT=5` reported **“1 timed event found”** and offered one checkbox/date only. The parser does not expand `RRULE`, so ordinary recurring calendar exports must be pre-expanded outside the product. This is the known limitation noted in the prior handoff, but it remains a material calendar-import gap for a retrospective weekly tool.

## Clean-checkout gates

Verification used a detached clean worktree at exactly `bc3ba5974fd520f40969e716a39ae74efff14f74`; unrelated modified `graphify-out/` files in `/work/repo` were excluded.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 68 packages installed; 0 vulnerabilities reported |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (`tsc --noEmit`) |
| `npm test` | PASS — 6 Vitest tests; 21 Playwright tests passed, 1 intentional desktop-only skip |
| `npm run build` | PASS — Vite 6.4.3 wrote `dist/` |
| `git diff --check` | PASS |
| Candidate worktree after checks | Clean |

The exact production output has an inline initial JavaScript payload of 35,899 B raw / 11,255 B gzip and inline CSS of 15,831 B raw / 4,260 B gzip. There are no font files. The mobile AVIF hero is 15,163 B. All are below the stated 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Product and recovery evidence

Fresh Chromium checks against the live deployment verified the following:

- A manual entry with equal `09:00` start/end produces **“End time must be later than start time.”** and moves keyboard focus to End. Correcting it to `10:30` saves the entry; it survives reload.
- Calendar descriptions are absent until the explicit **Append calendar descriptions** opt-in. Normal browser use made no external requests beyond the product origin, produced no console/page errors, and the live populated board had no axe serious or critical findings.
- The repository browser suite additionally passed CSV export, project-to-client recall, selective calendar review, JSON backup rejection without replacing valid data, overnight `23:00–01:00` as 2.00 hours, deletion/undo, local persistence, and a 30-entry path.
- At 390 x 844 there was no horizontal overflow (`390` CSS px document width), body text was 16 px, legal/footer links measured 44 px high, the first Tab focused the skip link, and its visible focus was a 4 px coral outline. Reduced-motion transition duration was `0.01 ms`.

## PWA, privacy, accessibility, and policies

- The live worker controlled the app and used `backfill-v1.0.2-shell` and `backfill-v1.0.2-assets`. After visiting `/privacy/`, setting the browser offline, and navigating to `/`, **Add work block** remained available and the status read **Offline · saved here**.
- A separate local two-revision test of this exact built worker changed only its cache namespace from `v1.0.2` to `v1.0.3`. It displayed **“An updated timecard is ready.”** with a visible Refresh action and no console errors.
- Manifest checks passed: standalone display, versioned start URL, 192/512 and maskable icons, and matching paper theme/background colors.
- Local-first storage is IndexedDB; normal use sent no analytics, fonts, beacons, or calendar data off origin. The only runtime external code path is disclosed license verification at the allowed Sociobot billing API.
- `/privacy/` and `/terms/` exist. `verify-url.sh` passed on live: title, `lang=en`, one h1, main landmark, image alternatives, labelled buttons, and zero console/page errors.
- HTTPS root returned 200; HTTP redirected with 301. Conditional ETag revalidation returned 304. Root/legal pages were no-cache, `sw.js` was no-store, and image assets were one-year immutable. Responses supplied CSP, HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `nosniff`, COOP/CORP, Permissions-Policy, and strict-origin referrer policy. AVIF and manifest MIME types were correct.

## Deployment identity

For every public file generated in `dist/` except deployment configuration `staticwebapp.config.json`, SHA-256 of the clean candidate output equalled the SHA-256 downloaded from the corresponding live path. That is 18 matching public files and zero mismatches. `staticwebapp.config.json` is intentionally deployment configuration rather than a public product asset.

## Required remediation and retest

1. Make billability an explicit import decision (safe default non-billable is appropriate), cover calendar import plus exported CSV with tests, and verify that personal/non-work events never become billable implicitly.
2. Profile the intermittent main-thread work and rerun at least three clean default-throttled mobile Lighthouse audits; every run must score >= 90.
3. Either expand `RRULE` occurrences in the reviewed week or reject recurrence masters with a clear instruction before import. Then rerun the complete clean-checkout, live-identity, PWA offline/update, 390 px, keyboard, axe, privacy, and recovery matrix.
