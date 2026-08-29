# Backfill Timecards demo sandbox

Demo URL: <https://backfill-timecards.sociobot.in/demo>

Query-string entry: <https://backfill-timecards.sociobot.in/?demo=1>

The first screen also links to the demo with **Try it with sample data**. No account, file, or license is needed. Demo mode opens directly on the populated weekly board instead of repeating the marketing hero. It has six realistic blocks for Redwood Studio, Northstar Press, and freelance admin. Three prior-week blocks, two client mappings, and one reusable pattern support the Pattern Deck preview.

Demo records use tab-scoped session storage under `demo:backfill-timecards`. Normal work uses the `backfill-timecards` IndexedDB database; the application never reads that normal database while the demo banner is shown. A real license is also neither read nor verified in demo mode.

- **Reset demo** clears the demo session storage and restores the shipped sample.
- **Start for real** clears the demo session storage before returning to the normal workspace.
- Closing the demo tab discards its session storage by browser construction; no unload-time IndexedDB transaction is needed.
- Demo links that leave for Privacy, Terms, the home page, or Param Factory also clear demo records first.
- Reloading the demo restores the original sample. The sample and demo route remain available offline after the service worker controls the page.

Six claim tests open `/demo` in a fresh Playwright browser context. Isolation, normal privacy, and billing claims begin in clean normal workspaces. See `.factory/claims.json` for each exact command and observable assertion.
