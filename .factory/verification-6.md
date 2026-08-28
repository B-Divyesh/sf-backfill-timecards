# Independent product verification 6 — FAIL

Date: 2026-08-28 UTC
Work order: `backfill-timecards-verify-6`
Candidate: `bef3fb93d3b494de256aeabc65a3964068c13a1b`
Live URL: <https://backfill-timecards.sociobot.in/>  
Artifact: local-first offline PWA

## Verdict

**FAIL — do not release this candidate.**

The prior deployment-only checkout failure is resolved from fresh evidence: the exact in-product checkout link now returns `303` to a live Sociobot/Dodo checkout session for **Backfill Timecards Pattern Deck**, $18.00 one-time. The previously reported API rate-limit concern is also resolved: a fresh sequential invalid-license burst returned 200 for requests 1–30 and 429 from request 31 onward, with `Retry-After: 3` initially (then 2 as the window elapsed).

Release is instead blocked by the required claims and demo acceptance gates. The clean candidate has no `.factory/claims.json`, so there were no declared claim tests to run. It also has no sample-data demo at all. These are explicit non-negotiable requirements, irrespective of the otherwise passing implementation checks.

No product source was modified during verification.

## Release-blocking defects

### P1 — Required claim registry and claim tests are absent

`.factory/claims.json` does not exist in a fresh detached checkout at the exact candidate SHA. This is itself release-blocking under the supplied claims contract; consequently no command can prove each visitor-facing claim through the required demo entry point.

The omission is material rather than documentary. The live landing page and README make reliance-worthy unlisted claims including:

- “Nothing leaves this device.” / “We run no analytics and have no account database.”
- “Calendar files are read locally.”
- “Export CSV” / invoice-ready CSV export.
- “works offline after the first visit” (README).

There is no registry entry and no uniquely tagged `@claim:<id>` test for any of them. The repository’s 28 browser tests exercise several behaviors, but they are not substitutes for the required claim inventory and sandboxed tests.

### P1 — No one-click isolated sample-data demo; first-read gate fails

Cold-load evidence on the live root shows the empty board with headline **“Rebuild the week. Keep the receipts.”**, an empty state, and buttons such as **“Add work block”** and **“Import calendar.”** There is no visible **“Try it with sample data”** action.

The first screen says it turns calendar fragments and memory into an invoice-ready timecard, but does not plainly identify the intended freelancer who is reconstructing a week after the fact; the metaphor headline is not the plain-language job headline required by the acceptance contract. The normal first click is ambiguous between manually adding a block and importing a file.

Fresh direct-entry checks confirm this is not merely a hidden link:

| URL | HTTP | Observed result |
| --- | ---: | --- |
| `/demo` | 200 | Ordinary empty board; no sample data, demo banner, Reset demo, or Start for real |
| `/?demo=1` | 200 | Ordinary empty board; no sample data, demo banner, Reset demo, or Start for real |

There is no `.factory/demo.md`, no demo storage namespace, and no “Try it”/sample-data implementation in source. The required `.factory/copy-audit.md` is also absent.

## Clean-checkout gates

Verification used `/tmp/backfill-timecards-verify-6`, freshly cloned from the repository and detached at the exact SHA. The dirty `graphify-out/` files in the supplied `/work/repo` were not touched.

| Check | Result |
| --- | --- |
| `.factory/claims.json` and every listed claim command | **FAIL** — file absent; no compliant claim tests can be run |
| `npm ci` | PASS — 68 packages installed; 0 audit vulnerabilities |
| `npm test` | PASS — 8 Vitest tests and 28 Playwright tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (`tsc --noEmit`) |
| `npm run build` | PASS — generated `dist/` |
| `git diff --check` in clean candidate | PASS |

Production output is 273,705 B total. `dist/index.html` is 60,248 B raw / 18,175 B gzip; its initial inline JavaScript and CSS are below 200 KB and 50 KB respectively. There are no shipped font files; the 640 px AVIF hero is 15,163 B.

## Fresh product evidence that passed

- Manual entry: equal `09:00` start/end displayed **“End time must be later than start time.”** and moved focus to End. Correcting to `10:30` saved a 1.50-hour entry.
- The entry persisted through reload; entering the same project restored the remembered client. Downloaded CSV had the expected Date/Start/End/Hours/Client/Project/Description/Billable/Source header and the manual 1.50-hour row.
- A local two-event ICS review allowed deselection. Its confidential description was excluded unless explicitly requested; imported calendar time defaulted non-billable. Existing browser tests additionally cover explicit billable opt-in, recurrence, overnight duration, no-selection, and malformed-calendar recovery.
- A malformed JSON backup reported **“Backup work block 1 is incomplete or invalid. Nothing was changed.”**; the pre-existing work block remained after reload.
- Normal live add/import/export use made only same-origin requests; it had no console errors, page errors, or failed requests. IndexedDB contained only `backfill-timecards` (version 1) after use.

## PWA, accessibility, responsive, and policy evidence

- In a fresh live context, the worker became controlling after first visit. After an online reload, setting the context offline and reloading still showed the weekly board, **Add work block**, and **Offline · saved here**, without errors. The worker precaches the app shell and implements `skipWaiting`, `clientsClaim`, and the update-available toast; the prior repository test coverage includes its offline behavior. A separate versioned update cannot be induced against an immutable live worker without publishing a new revision, so no artificial live-update outcome is claimed.
- `/opt/fleet/lib/verify-url.sh` passed against live (200, title, `lang=en`, one h1, main landmark, alt text, labelled buttons, no console/page errors; 664 ms measured navigation).
- Fresh axe scans of the live board at desktop and 390×844 reported zero serious/critical violations. At 390 px, document width remained 390 px (no horizontal overflow). Keyboard first Tab focused Skip to main content; reduced-motion transition duration was `0.01ms`. Dialog keyboard/focus restoration and 44 px mobile targets are also covered by the passing browser suite.
- HTTPS root, Privacy, Terms, manifest, robots, sitemap, hero asset, and icon all returned 200. HTTP redirected 301 to HTTPS; conditional root request returned 304. Live root, service worker, and manifest were byte-identical to the clean candidate build: root `87031c353f125c18cdc887c07e40ff8196fb28c053ad5a4d09ab471549cafa0e`, worker `cc1fd204f89c74468b8f9c85a36f25abac64d44af2b29d45147a9a4a59de80ac`, manifest `b8d51858cdb2c62f82cf939310544acd2395a8816abce0f34f7c4989f6589971`.
- Live headers include HSTS, CSP restricted to self plus the disclosed Sociobot API origins, `X-Frame-Options: DENY`, `nosniff`, COOP/CORP, a restrictive Permissions Policy, and strict-origin referrer policy. Root/manifest are no-cache, `sw.js` is no-store, and assets are configured immutable for a year.
- Lighthouse 12.8.2 completed one clean live mobile run: performance 91, accessibility 100, LCP 1,330 ms, CLS 0, TBT 389 ms, transfer 66,264 B. Lighthouse 13.4.1 runs in this container collected scores but ended in browser-tab crashes, so they are not used as acceptance evidence.

## Billing endpoint checks

The application has no sign-in flow. Its only server-side product call is the Sociobot billing API.

- `GET /api/v1/products/backfill-timecards/verify?license=qa-invalid-*`: threshold observed at 31 sequential requests; request 31 and requests 32–40 returned 429 with `Retry-After` (3, decreasing to 2 seconds).
- The actual **Buy the one-time unlock** link is `https://api.sociobot.in/api/v1/products/backfill-timecards/checkout`; fresh browser navigation reached `https://checkout.dodopayments.com/session/...` and displayed Backfill Timecards Pattern Deck, $18.00, one-time. This resolves verification 5’s 404 evidence.

## Required remediation and retest

1. Add `.factory/claims.json` covering every factual marketing/product claim, with exactly one clean-state tagged test per entry that executes through the demo entry point. Add the missing claim test output to the verification evidence.
2. Implement a visible first-screen **Try it with sample data** action. `/demo` (or `?demo=1`) must load realistic sample timecards in a separate `demo:` storage namespace and continuously show **Demo — sample data, nothing is saved**, Reset demo, and Start for real. Add `.factory/demo.md`.
3. Rewrite the first screen in plain words to name freelancers reconstructing time after the fact, make the first action unambiguous, and add the required copy audit.
4. Rerun this full verification from a clean clone. Promotion is not allowed until the claims/demo/first-read gates pass.
