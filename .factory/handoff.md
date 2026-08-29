# Backfill Timecards — repair 7 handoff

Date: 2026-08-29 UTC

Work order: `backfill-timecards-repair-7`

Base verified candidate: `930c57724d791e4b6d55f726fba89d13635cb0ba`

Repair commit: `847a2cca9f5a505bc6c2dbac93b86450ff75c51c`

Artifact: static, offline-first PWA; `dist/` remains the deploy root.

## Result

Repaired every release finding in independent verification 10 without changing the researched job, the local-first storage model, calendar workflow, free tools, or billing implementation.

1. **V10-1 billing claim gate:** the deterministic Playwright clock is now installed and paused at `verifiedAt` before navigation and UI assertions. The test no longer tries to fast-forward to a past moment. The exact `@claim:billing-entitlement` command passes and still proves the forged-token lock, successful restore, one-day cache boundary, and revoked verdict lock.
2. **V10-2 mobile target:** primary navigation links now have a minimum 44×44 CSS-pixel hit area. The 390px test asserts both dimensions for the header Demo link as well as the brand and footer links.
3. **V10-3 claim registry:** registered `demo-exit-cleanup` with an exact browser claim test. It verifies that home, Privacy, Terms, and Param Factory exits remove demo storage before navigation. Removed the unprovable automatic-refund-revocation promise from Terms and the unlock dialog, and removed the unsupported reproducible-build promise from README. A unit contract guards against restoring either statement.

The PWA revision is `r7`: service-worker cache namespace `backfill-v1.0.8` and manifest start URL `/?v=7`. This ensures installed clients receive an update rather than retaining the prior shell.

## Verification

Clean-install baseline:

- `npm ci` — PASS; 68 packages added; 0 vulnerabilities.
- Detached clean worktree at the repair commit — PASS for the same `npm ci`, full test, typecheck, lint, and build gate; it remained clean after the run.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- `npm run test:unit` — PASS; 12 tests.
- Every exact command in `.factory/claims.json` — PASS; 10/10 claim commands, each run separately in Chromium.
- `npm test` — PASS; 12 unit/contract tests plus 58 desktop/390px Playwright tests, including axe, keyboard dialog focus/escape/restore, legal routes, privacy request boundaries, calendar recovery, offline reload, and PWA metadata.
- `npm run build` — PASS; `dist/` produced. Initial JS is 48.65 kB raw / 14.61 kB gzip. CSS is 19.65 kB raw / 5.00 kB gzip.

Preview evidence is committed in `.factory/evidence/repair-7-local/`:

- `verify-url.sh` passed root and `/demo`: correct title and `lang`, one h1, main landmark, complete image alternatives, labelled buttons, and no browser console/page errors. Root loaded in 547 ms and Demo in 538 ms in the verifier smoke browser.
- Playwright axe integration reported no serious or critical violations on the populated board, empty mobile board, Privacy, Terms, and the 404 route.
- Lighthouse 12.8.2 on the local production preview (mobile profile): Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 20 ms, CLS 0, 70 KiB transfer.
- `node .factory/qa-artifacts/sw-update-qa.mjs` — PASS: update toast and Refresh action appeared; the `backfill-v1.0.8-qa-b-shell` cache replaced the old revision; Demo retained six rows; no errors.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run preview
```

For the independent claim gate, run every command listed in `.factory/claims.json`. The most relevant repair checks are:

```sh
npm run test:e2e -- --project=chromium --grep @claim:billing-entitlement
npm run test:e2e -- --project=chromium --grep @claim:demo-exit-cleanup
npm run test:e2e -- --project=mobile --grep "header and footer targets"
```

## Deployment and known gaps

Static deployment uses the tracked `public/staticwebapp.config.json` response, cache, MIME, and security-header configuration. Deploy `dist/` with its physical `/demo/`, `/privacy/`, `/terms/`, `404.html`, `sw.js`, and manifest files.

No known release-blocking gaps remain. The product intentionally has no account system, analytics, product backend, or runtime AI feature. The only optional external request remains Sociobot license verification after a user explicitly restores or returns with a license token.
