# Independent product verification 7 — FAIL

Date: 2026-08-29 UTC
Work order: backfill-timecards-verify-7
Candidate: 387132e12f514135ca2a924eab2e8f5e1e729fbe
Live URL: https://backfill-timecards.sociobot.in/
Artifact: local-first offline PWA

## Verdict

**FAIL — do not release this candidate.**

The candidate fixes the previous claims/demo/first-read failures. All seven declared claim commands pass, the cold first screen plainly identifies the job and audience, and “Try it with sample data” opens a useful isolated sample in one click. The live root, service worker, and manifest are byte-identical to the candidate build.

Fresh independent testing nevertheless found three P1 release blockers: demo records are not reliably erased when the demo tab closes, an unverified forged license unlocks paid features whenever verification is unavailable, and visitor-facing claims remain outside the required claim registry. Mandatory site-structure and performance gates also fail.

No product source was modified during verification.

## Release-blocking defects

### P1 — Demo data can remain after the demo tab closes

The banner says “Demo — sample data, nothing is saved,” and the demo contract requires data to be discarded when leaving demo mode. The candidate starts an asynchronous IndexedDB clear from pagehide without awaiting completion. In five fresh live close-and-inspect trials, the demo database retained all 9 seeded entries twice: observed counts were 9, 0, 0, 0, 9.

The explicit **Start for real** path does work: independent testing found entries, mappings, and patterns all at zero after using that action, while the real record remained untouched. The declared demo-sandbox claim test passes because it exercises only this explicit action. It does not cover closing the tab or otherwise terminating the document, so it misses the failing exit path.

Required fix: make demo storage ephemeral by construction or guarantee cleanup independently of an unload-time IndexedDB transaction. Add the tab-close/navigation boundary to the claim test.

### P1 — A forged token unlocks Pattern Deck when verification is unavailable

In a new browser context, navigation to /?license=forged-qa7 with the Sociobot verification request deliberately unavailable produced this state:

- the query token was removed from the address bar and stored as sb_license:backfill-timecards;
- the app created sb_license:backfill-timecards:verdict as {"valid":true,"checkedAt":0} before any successful verification;
- one verification request failed;
- the UI displayed “Pattern deck UNLOCKED”; and
- the paid “Reuse, then correct” dialog opened instead of the purchase dialog.

This violates the paid-unlock requirement to verify on first unlock. A network failure must preserve only a previously verified cached entitlement, not turn a newly supplied token into a positive cached verdict.

### P1 — The claim registry is incomplete

Every command currently listed in .factory/claims.json passes. However, the live pages and README contain reliance-worthy claims with no registry entry and no uniquely tagged sandbox test, which is independently release-blocking under the claims contract. Examples include:

- Privacy: no account database; no analytics, advertising trackers, third-party fonts, or third-party scripts.
- Privacy: license verification occurs at most once per day; the app never receives card details; normal timecard work needs no server request after installation.
- README: the product installs as a PWA; all timecard data lives in IndexedDB; the license token is stored in localStorage; there is no backend or runtime UI dependency.
- Billing copy: checkout and verification use only Sociobot and the $18 purchase is one-time. The pattern-deck claim test checks displayed price/free-tier text, not the checkout outcome or first-unlock enforcement.

Some untagged tests and this independent review support parts of those statements, but the acceptance contract requires each claim to be listed and mapped to exactly one tagged test.

### P2 — Required 404 and metadata/site skeleton are absent

GET /definitely-not-a-route-qa7 returned HTTP 200 with the normal 70,488-byte app shell. There is no public/404.html and staticwebapp.config.json has no 404 response override. The required designed 404 route therefore does not exist.

The root also has no canonical link, Open Graph metadata, Twitter card, or apple-touch icon. The shared footer has no version/build ID. Privacy and Terms footers omit the required product one-line, Built by Param Factory link, and version/build ID. These are mandatory items in the supplied site-structure contract.

### P2 — Median Lighthouse performance misses the required 90

Three fresh Lighthouse 13.4.1 mobile runs scored 82, 91, and 88; the median is 88, below the required 90. Median Total Blocking Time was 481.5 ms (runs: 746.5, 377, and 481.5 ms). LCP remained good at 1.24–1.28 s and CLS was 0. Accessibility, best practices, and SEO scored 100 in all runs.

The static byte budgets themselves pass: dist/index.html is 70,488 B raw / 20,322 B gzip, including 44,620 B inline JavaScript and 18,366 B inline CSS. Lighthouse transfer was 64–68 KB; there are no font files, and the mobile AVIF is 15,163 B.

## Required first checks

### Claims gate

npm ci installed 68 packages with zero audit vulnerabilities. Each command from .factory/claims.json was then run separately from the clean detached candidate worktree through the shipped demo entry point:

| Claim | Result | Observable evidence |
| --- | --- | --- |
| demo-sandbox | PASS | Real record remained separate; reset restored the sample; Start for real cleared all three demo stores. The tab-close gap above is not covered. |
| weekly-board | PASS | Add, edit, copy, delete, Undo, and project-to-client recall passed. |
| calendar-local | PASS | Bounded recurrence and overnight import passed; private description/default billability and same-origin request checks passed. |
| csv-export | PASS | Filename, complete header, six sample rows, and sample fields passed. |
| local-archive | PASS | JSON export, erase, and restore passed. |
| offline-reload | PASS | Controlled demo reloaded offline with sample data and offline status. |
| pattern-deck | PASS | Pattern save and previous-week clone passed in demo preview; price/free-tier text was present. |

Any listed claim failure would have blocked release; none failed. The release is instead blocked by the uncovered exit path and unlisted claims.

### Cold first-read gate

PASS at 1440×900 and 390×844. Before scrolling, the live page says:

- what it does: “Reconstruct your freelance workweek” into a timecard ready for invoicing;
- who it serves: freelancers logging work after the fact; and
- what to click first: **Try it with sample data**, followed by a plain explanation that it opens a separate timecard.

At 390 px the primary action was fully visible at y=397–443. The privacy, offline, and price facts were also visible. One click opened /demo with six current-week blocks, three prior-week blocks, mappings, a saved pattern, and the persistent demo banner.

## Clean candidate checks

The supplied /work/repo was at later base commit 5145335 and contained pre-existing modified graph-analysis files. It was not altered for testing. Verification used a separate clean detached worktree at the exact candidate SHA.

| Check | Result |
| --- | --- |
| npm ci | PASS — 68 packages, 0 vulnerabilities |
| Seven exact claims.json commands | PASS — 7/7 |
| npm test | PASS — 10 Vitest tests; 43 Playwright tests passed and 1 expected desktop-only skip across desktop/mobile projects |
| npm run typecheck | PASS |
| npm run lint | PASS (TypeScript no-emit check) |
| npm run build | PASS — dist produced; Vite reported 70.49 kB / 20.51 kB gzip for index.html |
| git diff --check | PASS |

## Independent live workflow

- Created a normal private work block, entered demo, and confirmed the real record was absent there.
- Demo seeded six realistic current-week rows. Case-insensitive “website REFRESH” recalled Redwood Studio.
- Equal start/end time showed “End time must be later than start time” and moved focus to End. Correcting to 23:00–01:00 with **Ends the next day** produced 2h and a 2.00-hour CSV row.
- An open-ended recurrence produced the prescribed error. Replacing it with a valid two-event file recovered in the same dialog; one deselected event stayed out, the confidential description stayed out without opt-in, and the selected event defaulted non-billable.
- Eight visible rows exported as eight CSV rows with the expected manual/calendar data. No excluded calendar content appeared.
- Reloading demo restored the original six rows. **Start for real** cleared all demo stores and restored the untouched real record.
- A separate 30-entry run displayed and exported all 30 rows without console/page errors.
- The full independent flow made 14 requests, all same-origin. It logged zero console errors, page errors, or failed requests.
- The repository suite additionally passed malformed JSON backup recovery, edit/copy/delete/Undo, archive erase/restore, explicit calendar billability, and recurring/overnight cases on desktop and mobile.

## Accessibility and responsive evidence

- /opt/fleet/lib/verify-url.sh passed live: HTTP 200, title present, lang=en, one h1, main landmark, alt text present, labelled buttons, zero console/page errors; measured navigation 720 ms.
- Fresh live axe scans found zero serious/critical findings on the populated demo, Privacy, and Terms pages.
- At 390×844, document width equalled viewport width and every rendered link/button/form target measured at least 44×44 CSS px.
- First Tab focused the skip link with a 4 px coral outline; Enter moved focus to main. Escape closed the add dialog and restored focus to its trigger.
- prefers-reduced-motion reduced transition and animation durations to 0.01 ms. The visual thesis explicitly specifies a single light paper treatment.

## PWA, deployment, privacy, and policy evidence

- Live offline reload passed after service-worker control: /demo retained six sample rows with “Offline · saved here”; the cached Privacy page also loaded offline.
- A source-unmodified local response harness served worker revisions QA-C then QA-D. The app showed “An updated timecard is ready,” exposed **Refresh**, activated QA-D, removed QA-C, and retained the six sample rows without errors.
- Root, /demo, Privacy, Terms, manifest, robots, sitemap, hero AVIF, and icons returned 200. HTTP redirected 301 to HTTPS. A conditional root request returned 304. All discovered links returned 200; checkout is covered below.
- Root and /demo are no-cache; sw.js is no-store; assets are public max-age=31536000 immutable.
- Live headers include HSTS, CSP, frame-ancestors none, X-Frame-Options DENY, nosniff, COOP/CORP, restrictive Permissions Policy, and strict-origin referrer policy.
- The exact candidate/live SHA-256 matches are: index.html adfd326ee23c9f127ce77eab2d84e217a7a4687315b8dda1c50ec05c9d34cdf1; sw.js d8a71d892175bfc575ced90c8a9346024ed9ea4de9ca6234923996c704ce9ca4; manifest.webmanifest 2c09427d202182771a80b34047923f18ab361db41330d5e1ee24d450e43af4fc.
- Manifest fields, standalone display, versioned start URL, and 192/512/maskable 512 icons are present with matching physical dimensions.

## Billing endpoint and product class checks

The static product has no sign-in and no product backend. Entra tenant verification, backend concurrency/health/persistence, and library/CLI consumer-install checks are not applicable.

- Fresh sequential invalid-license requests returned 200 for requests 1–30 and 429 for requests 31–40. Request 31 and every later response included Retry-After: 4. Observed allowance: 30 requests per client/window.
- GET /api/v1/products/backfill-timecards/checkout returned 303 to checkout.dodopayments.com. The hosted page showed Backfill Timecards Pattern Deck, $18.00, and one-time purchase copy.
- Normal and demo work made no off-origin request. License verification is the disclosed api.sociobot.in exception.

## Required remediation

1. Replace unload-time best-effort demo deletion with reliable ephemeral storage/cleanup, and add a tagged close/navigation boundary assertion.
2. Do not create a positive cached verdict for a newly returned token. Keep paid features locked until first verification succeeds; only preserve a prior successful cached verdict during outages. Add failure/offline/invalid-token claim coverage.
3. Inventory every claim on landing, Privacy, Terms, and README in claims.json and make each tagged test prove the complete claim rather than displayed copy.
4. Add the required designed 404 response and page, canonical/social/apple metadata, and complete shared footer/build identity.
5. Reduce main-thread blocking until repeated mobile Lighthouse runs reliably meet 90+, then rerun the full matrix from a clean checkout.
