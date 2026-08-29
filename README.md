# Backfill Timecards

Backfill Timecards is a private weekly timecard for freelancers who reconstruct work after the fact. It turns memory and reviewed calendar events into clear work blocks and an invoice-ready CSV.

Live product: <https://backfill-timecards.sociobot.in>

Try the isolated sample week: <https://backfill-timecards.sociobot.in/demo>

## What it does

- Adds, edits, copies, and deletes work blocks marked Manual, Calendar, or Pattern.
- Imports `.ics` calendar files locally, with event selection, optional descriptions, and an explicit billable choice that defaults off.
- Reviews daily or weekly repeating events that have an end date, plus overnight events.
- Remembers the client for each project when you add more work.
- Exports the selected week as invoice-ready CSV.
- Exports, restores, and erases a complete local JSON backup.
- Installs as a web app and works offline after the first visit.
- Offers an optional $18 one-time Pattern Deck unlock for saved patterns and previous-week cloning. Checkout and license verification use Sociobot billing; no payment provider is embedded.

Seven claim tests start at `/demo`. The demo-isolation, normal-privacy, and billing tests start in clean normal workspaces as described in [`.factory/claims.json`](.factory/claims.json).

Demo records use temporary browser storage limited to that demo tab. **Reset demo** restores the sample. **Start for real** clears it before opening your weekly timecard. See [`.factory/demo.md`](.factory/demo.md).

Outside demo mode, work blocks, client mappings, and patterns stay in this browser’s local database. A purchased license token stays in this browser’s settings storage. Normal timecard work makes only same-origin requests. See [`/privacy`](public/privacy/index.html) and [`/terms`](public/terms/index.html).

Developer note: the normal database uses IndexedDB. Demo records use sessionStorage, and license settings use localStorage.

## Develop

```sh
npm ci
npm run dev
```

## Test and build

```sh
npm test          # unit + Chromium desktop/mobile end-to-end + axe + offline
npm run typecheck # TypeScript checks
npm run lint      # repository static checks
npm run build     # production files in ./dist
npm run preview   # preview the production build
```

Run `npm test`; the Playwright configuration starts its preview servers.

Optional build-time variables:

```sh
VITE_PRODUCT_SLUG=backfill-timecards
VITE_BILLING_BASE=https://api.sociobot.in
```

Use `https://pilot-api.sociobot.in` as `VITE_BILLING_BASE` for registered staging products. Never commit license tokens or billing credentials.

## Deploy

Deploy the contents of `dist/` as a static site, with `index.html` at its root. Serve `/sw.js` from the site root. Keep `/demo/`, `/privacy/`, `/terms/`, and `/404.html` as physical routes.

## Product notes

- Scope and research: [`.factory/brief.json`](.factory/brief.json)
- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Build verification and known gaps: [`.factory/handoff.md`](.factory/handoff.md)
- Claim registry: [`.factory/claims.json`](.factory/claims.json)
- Demo sandbox: [`.factory/demo.md`](.factory/demo.md)

## License

MIT — see [LICENSE](LICENSE).
