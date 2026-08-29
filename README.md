# Backfill Timecards

Backfill Timecards is a private weekly board for freelancers who reconstruct work after the fact. It turns memory and reviewed calendar events into clear work blocks and an invoice-ready CSV.

Live product: <https://backfill-timecards.sociobot.in>

Try the isolated sample week: <https://backfill-timecards.sociobot.in/demo>

## What it does

- Adds, edits, copies, and deletes source-labelled work blocks across a seven-day board.
- Imports `.ics` calendar files locally, with event selection, optional descriptions, and an explicit billable choice that defaults off.
- Reviews bounded daily or weekly recurring events and overnight events before import.
- Remembers project→client mappings to speed up repeat entry.
- Exports the selected week as invoice-ready CSV.
- Exports, restores, and erases a complete local JSON archive.
- Installs as a PWA and works offline after the first visit.
- Offers an optional $18 one-time Pattern Deck unlock for saved patterns and previous-week cloning. Checkout and license verification use Sociobot billing; no payment provider is embedded.

Every visitor-facing claim has a browser test in [`.factory/claims.json`](.factory/claims.json). All claim tests start at `/demo`, where realistic sample records use tab-scoped `demo:backfill-timecards` session storage. **Reset demo** restores the sample, **Start for real** clears it before opening the normal workspace, and closing the demo tab discards it. See [`.factory/demo.md`](.factory/demo.md).

All timecard data lives in IndexedDB on the current device. A purchased license token is kept in localStorage. See [`/privacy`](public/privacy/index.html) and [`/terms`](public/terms/index.html).

## Develop

Requirements: Node.js 20+ and npm.

```sh
npm install
npm run dev
```

The app uses Vite and vanilla TypeScript. It has no product backend, external fonts, or third-party runtime UI dependencies.

## Test and build

```sh
npm test          # unit + Chromium desktop/mobile end-to-end + axe + offline
npm run typecheck # TypeScript checks
npm run lint      # repository static checks
npm run build     # reproducible static output in ./dist
npm run preview   # preview the production build
```

Playwright is pinned to 1.58.2. The test suite starts production preview servers automatically. The production build uses hashed CSS and JavaScript assets, and the service worker precaches the matching app shell and assets for offline reloads.

Optional build-time variables:

```sh
VITE_PRODUCT_SLUG=backfill-timecards
VITE_BILLING_BASE=https://api.sociobot.in
```

Use `https://pilot-api.sociobot.in` as `VITE_BILLING_BASE` for registered staging products. Never commit license tokens or billing credentials.

## Deploy

Deploy the contents of `dist/` as a static site, with `index.html` at its root. The service worker is scoped to `/`; serve over HTTPS and avoid rewriting `/sw.js`, `/manifest.webmanifest`, `/privacy/`, or `/terms/` to another asset. `staticwebapp.config.json` carries the immutable asset caching, correct AVIF/manifest MIME types, and browser response headers for the Static Web Apps deployment.

## Product notes

- Scope and research: [`.factory/brief.json`](.factory/brief.json)
- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Build verification and known gaps: [`.factory/handoff.md`](.factory/handoff.md)
- Claim registry: [`.factory/claims.json`](.factory/claims.json)
- Demo sandbox: [`.factory/demo.md`](.factory/demo.md)

## License

MIT — see [LICENSE](LICENSE).
