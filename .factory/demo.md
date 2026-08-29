# Backfill Timecards demo sandbox

Demo URL: <https://backfill-timecards.sociobot.in/demo>

The first screen also links to the demo with **Try it with sample data**. No account, file, or license is needed. The demo opens a populated current week with six realistic blocks for Redwood Studio, Northstar Press, and freelance admin. Three prior-week blocks, two project-to-client mappings, and one reusable pattern support the Pattern Deck preview.

Demo records use the IndexedDB database `demo:backfill-timecards`. Normal work uses `backfill-timecards`; the application never reads that normal database while the demo banner is shown. A real license is also neither read nor verified in demo mode.

- **Reset demo** clears the demo database and restores the shipped sample.
- **Start for real** clears the demo database before returning to the normal workspace.
- Demo links that leave for Privacy, Terms, the home page, or Param Factory also clear demo records first.
- Reloading the demo restores the original sample. The sample and demo route remain available offline after the service worker controls the page.

Claim tests always open `/demo` in a fresh Playwright browser context. See `.factory/claims.json` for the exact command and observable assertions for each claim.
