import { downloadText, entriesToCsv } from "./csv";
import { addDays, entryMinutes, formatDuration, formatWeekRange, fromIso, weekDates, weekStart } from "./dates";
import { store } from "./db";
import { parseIcs } from "./ics";
import { checkoutUrl, initialLicenseState, saveLicense, verifyLicense, type LicenseState } from "./license";
import type { AppBackup, CalendarEvent, Pattern, ProjectMapping, TimeEntry } from "./types";

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] || character);
const uid = () => crypto.randomUUID();

function dateLabel(value: string): { weekday: string; date: string } {
  const date = fromIso(value);
  return {
    weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
    date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  };
}

export class App {
  private entries: TimeEntry[] = [];
  private mappings: ProjectMapping[] = [];
  private patterns: Pattern[] = [];
  private currentWeek = weekStart();
  private license: LicenseState = initialLicenseState();
  private toastTimer = 0;

  constructor(private readonly root: HTMLElement) {}

  async start(): Promise<void> {
    // Paint the complete empty shell synchronously so IndexedDB startup cannot
    // shift the page after first render.
    this.render();
    this.bindGlobalEvents();
    this.registerServiceWorker();
    [this.entries, this.mappings, this.patterns] = await Promise.all([store.entries(), store.mappings(), store.patterns()]);
    this.render();
    if (localStorage.getItem("sb_license:backfill-timecards")) {
      this.license = { ...this.license, checking: true };
      verifyLicense().then((state) => {
        this.license = state;
        this.render();
        if (state.notice) this.showToast(state.notice);
      });
    }
  }

  private weekEntries(): TimeEntry[] {
    const end = addDays(this.currentWeek, 7);
    return this.entries
      .filter((entry) => entry.date >= this.currentWeek && entry.date < end)
      .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
  }

  private bindGlobalEvents(): void {
    this.root.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (action === "previous-week") this.changeWeek(-7);
      if (action === "next-week") this.changeWeek(7);
      if (action === "this-week") { this.currentWeek = weekStart(); this.render(); }
      if (action === "add") this.openEntryDialog(undefined, target.dataset.date);
      if (action === "edit" && id) this.openEntryDialog(this.entries.find((entry) => entry.id === id));
      if (action === "duplicate" && id) this.duplicateEntry(id);
      if (action === "delete" && id) this.deleteEntry(id);
      if (action === "save-pattern" && id) this.saveEntryAsPattern(id);
      if (action === "calendar") this.openCalendarDialog();
      if (action === "patterns") this.openPatternsDialog();
      if (action === "export-csv") this.exportCsv();
      if (action === "settings") this.openSettingsDialog();
    });
    window.addEventListener("online", () => { this.render(); this.showToast("Back online. Your local work was always available."); });
    window.addEventListener("offline", () => { this.render(); this.showToast("Offline. You can keep working; changes stay on this device."); });
  }

  private changeWeek(days: number): void {
    this.currentWeek = addDays(this.currentWeek, days);
    this.render();
    document.querySelector<HTMLElement>("#week-heading")?.focus();
  }

  private render(): void {
    const entries = this.weekEntries();
    const totalMinutes = entries.reduce((sum, entry) => sum + entryMinutes(entry), 0);
    const billableMinutes = entries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entryMinutes(entry), 0);
    const clients = new Set(entries.map((entry) => entry.client.trim()).filter(Boolean)).size;
    const isCurrentWeek = this.currentWeek === weekStart();
    const offline = !navigator.onLine;

    this.root.innerHTML = `
      <header class="site-header">
        <a class="brand" href="/" aria-label="Backfill Timecards home">
          <img src="/icons/icon.svg" width="40" height="40" alt="" />
          <span>Backfill<br>Timecards</span>
        </a>
        <div class="header-actions">
          <span class="status-pill ${offline ? "is-offline" : ""}" aria-live="polite"><span aria-hidden="true">●</span> ${offline ? "Offline · saved here" : "Local · saved here"}</span>
          <button class="icon-button" type="button" data-action="settings" aria-label="Open data and license settings" title="Data and license settings">☰</button>
        </div>
      </header>
      <main id="main">
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-copy">
            <p class="eyebrow">WEEKLY RECONSTRUCTION · SIDE A</p>
            <h1 id="hero-title">Rebuild the week.<br><span>Keep the receipts.</span></h1>
            <p class="lede">Turn calendar fragments and honest memory into an invoice-ready timecard. No timers. No surveillance. Nothing leaves this device.</p>
          </div>
          <figure class="hero-art">
            <picture>
              <source type="image/avif" srcset="/assets/hero-cassette-640.avif 640w, /assets/hero-cassette-1024.avif 1024w" sizes="(max-width: 820px) 92vw, 38vw" />
              <source type="image/webp" srcset="/assets/hero-cassette-640.webp 640w, /assets/hero-cassette-1024.webp 1024w" sizes="(max-width: 820px) 92vw, 38vw" />
              <img src="/assets/hero-cassette-640.webp" width="640" height="427" fetchpriority="high" decoding="async" alt="A collage of a cassette insert arranged as seven blank timecard tracks with pencil marks and calendar scraps" />
            </picture>
            <figcaption>Reconstruction, not automatic inference.</figcaption>
          </figure>
        </section>

        <section class="workspace" aria-labelledby="week-heading">
          <div class="week-bar">
            <div>
              <p class="eyebrow">YOUR WORK TAPE</p>
              <h2 id="week-heading" tabindex="-1">${formatWeekRange(this.currentWeek)}</h2>
            </div>
            <nav class="week-nav" aria-label="Choose week">
              <button type="button" class="square-button" data-action="previous-week" aria-label="Previous week">←</button>
              <button type="button" class="text-button" data-action="this-week" ${isCurrentWeek ? "disabled" : ""}>This week</button>
              <button type="button" class="square-button" data-action="next-week" aria-label="Next week">→</button>
            </nav>
          </div>

          <dl class="summary-strip" aria-label="Week summary">
            <div><dt>Total recorded</dt><dd>${formatDuration(totalMinutes)}</dd></div>
            <div><dt>Billable</dt><dd>${formatDuration(billableMinutes)}</dd></div>
            <div><dt>Entries</dt><dd>${entries.length}</dd></div>
            <div><dt>Clients</dt><dd>${clients}</dd></div>
          </dl>

          <div class="toolbelt" role="group" aria-label="Timecard actions">
            <button type="button" class="primary-button" data-action="add">＋ Add work block</button>
            <button type="button" data-action="calendar">Import calendar</button>
            <button type="button" data-action="patterns">Pattern deck ${this.license.unlocked ? '<span class="mini-stamp">UNLOCKED</span>' : '<span class="mini-stamp">$18</span>'}</button>
            <button type="button" data-action="export-csv" ${entries.length ? "" : "disabled"}>Export CSV</button>
          </div>

          ${entries.length ? this.renderDays(entries) : this.renderEmptyState()}
        </section>
        <section class="privacy-note" aria-labelledby="privacy-note-heading">
          <p class="registration" aria-hidden="true">＋</p>
          <div><p class="eyebrow">PRIVATE BY CONSTRUCTION</p><h2 id="privacy-note-heading">Your week stays in your browser.</h2></div>
          <p>Calendar files are read locally. We run no analytics and have no account database. Export or erase everything whenever you want.</p>
          <button type="button" data-action="settings">Manage local data</button>
        </section>
      </main>
      <footer>
        <p>Backfill Timecards · Built for honest hindsight</p>
        <nav aria-label="Legal and product links"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://sociobot.in">Param Factory</a></nav>
        <p class="generated-note">Editorial artwork generated for this product with Azure AI Foundry.</p>
      </footer>
      <div id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true"></div>`;
  }

  private renderEmptyState(): string {
    return `
      <div class="empty-state">
        <div class="empty-tape" aria-hidden="true"><span></span><span></span></div>
        <div>
          <p class="eyebrow">BLANK SIDE</p>
          <h3>No work blocks yet</h3>
          <p>Start from one thing you remember, or bring in a calendar file and choose only the events you want.</p>
          <div class="empty-actions"><button type="button" class="primary-button" data-action="add">Add the first block</button><button type="button" data-action="calendar">Review a calendar file</button></div>
        </div>
      </div>`;
  }

  private renderDays(entries: TimeEntry[]): string {
    return `<div class="days">${weekDates(this.currentWeek).map((date, index) => {
      const label = dateLabel(date);
      const dayEntries = entries.filter((entry) => entry.date === date);
      const total = dayEntries.reduce((sum, entry) => sum + entryMinutes(entry), 0);
      return `
        <section class="day" aria-labelledby="day-${index}">
          <header class="day-header">
            <div><h3 id="day-${index}">${label.weekday}</h3><p>${label.date}</p></div>
            <span>${formatDuration(total)}</span>
            <button type="button" class="add-day" data-action="add" data-date="${date}" aria-label="Add work block on ${label.weekday}, ${label.date}">＋</button>
          </header>
          ${dayEntries.length ? `<ol class="track-list">${dayEntries.map((entry) => this.renderEntry(entry)).join("")}</ol>` : '<p class="rest-day">No tracks</p>'}
        </section>`;
    }).join("")}</div>`;
  }

  private renderEntry(entry: TimeEntry): string {
    const clientProject = [entry.client, entry.project].filter(Boolean).map(escapeHtml).join(" / ");
    return `
      <li class="track">
        <div class="track-time"><strong>${escapeHtml(entry.start)}</strong><span>${formatDuration(entryMinutes(entry))}</span></div>
        <div class="track-body">
          <p class="track-title">${escapeHtml(entry.description)}</p>
          <p class="track-project">${clientProject || "Unassigned"}</p>
          <p class="track-meta"><span class="source-stamp">${entry.source}</span>${entry.billable ? '<span class="billable">✓ Billable</span>' : '<span>Not billable</span>'}</p>
        </div>
        <div class="track-actions">
          <button type="button" data-action="edit" data-id="${entry.id}" aria-label="Edit ${escapeHtml(entry.description)}">Edit</button>
          <button type="button" class="more-action" data-action="duplicate" data-id="${entry.id}" aria-label="Duplicate ${escapeHtml(entry.description)}">Copy</button>
          <button type="button" class="more-action" data-action="save-pattern" data-id="${entry.id}" aria-label="Save ${escapeHtml(entry.description)} as a pattern">Pattern</button>
          <button type="button" class="danger-action more-action" data-action="delete" data-id="${entry.id}" aria-label="Delete ${escapeHtml(entry.description)}">Delete</button>
        </div>
      </li>`;
  }

  private async duplicateEntry(id: string): Promise<void> {
    const original = this.entries.find((entry) => entry.id === id);
    if (!original) return;
    const now = Date.now();
    const copy: TimeEntry = { ...original, id: uid(), source: "pattern", createdAt: now, updatedAt: now };
    await store.saveEntry(copy);
    this.entries.push(copy);
    this.render();
    this.showToast(`Copied “${copy.description}”.`);
  }

  private async deleteEntry(id: string): Promise<void> {
    const entry = this.entries.find((item) => item.id === id);
    if (!entry || !confirm(`Delete “${entry.description}” from ${entry.date}?`)) return;
    await store.deleteEntry(id);
    this.entries = this.entries.filter((item) => item.id !== id);
    this.render();
    this.showToast(`Deleted “${entry.description}”.`, "Undo", async () => {
      await store.saveEntry(entry);
      this.entries.push(entry);
      this.render();
      this.showToast("Work block restored.");
    });
  }

  private openEntryDialog(entry?: TimeEntry, suggestedDate?: string): void {
    const editing = Boolean(entry?.id);
    const defaultDate = suggestedDate || (weekDates(this.currentWeek).includes(new Date().toLocaleDateString("en-CA")) ? new Date().toLocaleDateString("en-CA") : this.currentWeek);
    const dialog = this.makeDialog("entry-dialog", `
      <form method="dialog" class="dialog-card entry-form">
        <div class="dialog-heading"><div><p class="eyebrow">${editing ? "CORRECT TRACK" : "NEW TRACK"}</p><h2>${editing ? "Edit work block" : "Add work block"}</h2></div><button type="button" class="close-button" data-close aria-label="Close dialog">×</button></div>
        <div class="form-grid">
          <label class="field">Date<input name="date" type="date" required value="${entry?.date || defaultDate}" /></label>
          <div class="time-fields"><label class="field">Start<input name="start" type="time" required value="${entry?.start || "09:00"}" /></label><label class="field">End<input name="end" type="time" required value="${entry?.end || "10:00"}" /></label></div>
          <label class="field">Project<input name="project" list="project-options" required autocomplete="off" value="${escapeHtml(entry?.project || "")}" /></label>
          <datalist id="project-options">${this.mappings.map((mapping) => `<option value="${escapeHtml(mapping.project)}">${escapeHtml(mapping.client)}</option>`).join("")}</datalist>
          <label class="field">Client<input name="client" autocomplete="organization" value="${escapeHtml(entry?.client || "")}" /><span class="hint">Filled when this project has a remembered client.</span></label>
          <label class="field full-field">What did you do?<textarea name="description" rows="3" required>${escapeHtml(entry?.description || "")}</textarea><span class="hint">Use the wording you want to see on an invoice.</span></label>
          <label class="check-field full-field"><input name="ends-next-day" type="checkbox" ${entry?.endsNextDay ? "checked" : ""} /><span>Ends the next day</span></label>
          <label class="check-field full-field"><input name="billable" type="checkbox" ${entry?.billable === false ? "" : "checked"} /><span>Billable work</span></label>
        </div>
        <p class="form-error" role="alert" aria-live="assertive"></p>
        <div class="dialog-actions"><button type="button" data-close>Cancel</button><button type="submit" class="primary-button">${editing ? "Save changes" : "Add work block"}</button></div>
      </form>`);
    const form = dialog.querySelector<HTMLFormElement>("form")!;
    const projectInput = form.elements.namedItem("project") as HTMLInputElement;
    const clientInput = form.elements.namedItem("client") as HTMLInputElement;
    projectInput.addEventListener("input", () => {
      const mapping = this.mappings.find((item) => item.project.toLowerCase() === projectInput.value.trim().toLowerCase());
      if (mapping) clientInput.value = mapping.client;
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const start = String(data.get("start"));
      const end = String(data.get("end"));
      const error = form.querySelector<HTMLElement>(".form-error")!;
      const endsNextDay = (form.elements.namedItem("ends-next-day") as HTMLInputElement).checked;
      if ((endsNextDay && end >= start) || entryMinutes({ start, end, endsNextDay }) <= 0) {
        error.textContent = endsNextDay ? "Choose different start and end times for an overnight block." : "End time must be later than start time.";
        (form.elements.namedItem("end") as HTMLInputElement).focus();
        return;
      }
      const now = Date.now();
      const saved: TimeEntry = {
        id: entry?.id || uid(),
        date: String(data.get("date")),
        start,
        end,
        project: String(data.get("project")).trim(),
        client: String(data.get("client")).trim(),
        description: String(data.get("description")).trim(),
        billable: data.get("billable") === "on",
        source: entry?.source || "manual",
        createdAt: entry?.createdAt || now,
        updatedAt: now,
        endsNextDay,
      };
      await store.saveEntry(saved);
      if (saved.project && saved.client) {
        const mapping = { project: saved.project, client: saved.client, updatedAt: now };
        await store.saveMapping(mapping);
        this.mappings = this.mappings.filter((item) => item.project !== mapping.project).concat(mapping);
      }
      this.entries = this.entries.filter((item) => item.id !== saved.id).concat(saved);
      dialog.close();
      this.render();
      this.showToast(editing ? "Work block updated." : "Work block added.");
    });
  }

  private openCalendarDialog(): void {
    const dialog = this.makeDialog("calendar-dialog", `
      <div class="dialog-card wide-dialog">
        <div class="dialog-heading"><div><p class="eyebrow">LOCAL CALENDAR IMPORT</p><h2>Bring in calendar clues</h2></div><button type="button" class="close-button" data-close aria-label="Close dialog">×</button></div>
        <p>Choose an exported <strong>.ics</strong> file. It is read only in this browser and never uploaded.</p>
        <label class="file-drop"><span>Choose an .ics file</span><input id="calendar-file" type="file" accept=".ics,text/calendar" /></label>
        <div id="calendar-review" class="calendar-review" aria-live="polite"><p class="muted">Events will appear here for review before anything is added.</p></div>
        <div class="dialog-actions"><button type="button" data-close>Cancel</button></div>
      </div>`);
    const input = dialog.querySelector<HTMLInputElement>("#calendar-file")!;
    const review = dialog.querySelector<HTMLElement>("#calendar-review")!;
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const events = parseIcs(await file.text());
        if (!events.length) throw new Error("No timed events were found. Check that the file contains events with start and end times.");
        this.renderCalendarReview(review, events, dialog);
      } catch (error) {
        review.innerHTML = `<p class="inline-error" role="alert">${escapeHtml(error instanceof Error ? error.message : "That calendar file could not be read.")}</p>`;
      }
    });
  }

  private renderCalendarReview(review: HTMLElement, events: CalendarEvent[], dialog: HTMLDialogElement): void {
    review.innerHTML = `
      <div class="import-options">
        <label class="check-field"><input id="include-details" type="checkbox" /><span>Append calendar descriptions</span></label>
        <p>${events.length} timed event${events.length === 1 ? "" : "s"} found. Select only work you want to record.</p>
      </div>
      <form id="calendar-form">
        <div class="event-list">${events.map((event, index) => `
          <label class="event-row"><input type="checkbox" name="event" value="${index}" checked /><span><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.date)} · ${escapeHtml(event.start)}–${escapeHtml(event.end)}${event.endsNextDay ? " (next day)" : ""}</small></span></label>`).join("")}</div>
        <div class="import-assign"><label class="field">Project for selected events<input name="project" list="calendar-project-options" required /></label><datalist id="calendar-project-options">${this.mappings.map((item) => `<option value="${escapeHtml(item.project)}">`).join("")}</datalist><label class="field">Client<input name="client" /></label></div>
        <p class="form-error" role="alert"></p>
        <div class="dialog-actions"><button type="button" data-close>Cancel</button><button type="submit" class="primary-button">Add selected events</button></div>
      </form>`;
    const form = review.querySelector<HTMLFormElement>("#calendar-form")!;
    const project = form.elements.namedItem("project") as HTMLInputElement;
    const client = form.elements.namedItem("client") as HTMLInputElement;
    project.addEventListener("input", () => {
      const mapping = this.mappings.find((item) => item.project.toLowerCase() === project.value.trim().toLowerCase());
      if (mapping) client.value = mapping.client;
    });
    form.addEventListener("submit", async (submitEvent) => {
      submitEvent.preventDefault();
      const selected = [...form.querySelectorAll<HTMLInputElement>('input[name="event"]:checked')];
      if (!selected.length) {
        form.querySelector<HTMLElement>(".form-error")!.textContent = "Select at least one event to import.";
        return;
      }
      const includeDetails = review.querySelector<HTMLInputElement>("#include-details")!.checked;
      const now = Date.now();
      const additions = selected.map((checkbox) => {
        const event = events[Number(checkbox.value)];
        return {
          id: uid(), date: event.date, start: event.start, end: event.end, endsNextDay: event.endsNextDay,
          project: project.value.trim(), client: client.value.trim(),
          description: includeDetails && event.description ? `${event.title} — ${event.description}` : event.title,
          billable: true, source: "calendar" as const, createdAt: now, updatedAt: now,
        };
      });
      await Promise.all(additions.map((entry) => store.saveEntry(entry)));
      if (project.value.trim() && client.value.trim()) {
        const mapping = { project: project.value.trim(), client: client.value.trim(), updatedAt: now };
        await store.saveMapping(mapping);
        this.mappings = this.mappings.filter((item) => item.project !== mapping.project).concat(mapping);
      }
      this.entries.push(...additions);
      const first = additions[0].date;
      this.currentWeek = weekStart(fromIso(first));
      dialog.close();
      this.render();
      this.showToast(`Added ${additions.length} calendar event${additions.length === 1 ? "" : "s"}.`);
    });
  }

  private openPatternsDialog(): void {
    if (!this.license.unlocked) {
      this.openUnlockDialog();
      return;
    }
    const previousStart = addDays(this.currentWeek, -7);
    const previousEnd = this.currentWeek;
    const previousEntries = this.entries.filter((entry) => entry.date >= previousStart && entry.date < previousEnd);
    const dialog = this.makeDialog("patterns-dialog", `
      <div class="dialog-card wide-dialog">
        <div class="dialog-heading"><div><p class="eyebrow">PATTERN DECK · UNLOCKED</p><h2>Reuse, then correct</h2></div><button type="button" class="close-button" data-close aria-label="Close dialog">×</button></div>
        <p>Patterns copy known structure only. Dates and details remain yours to review.</p>
        <section class="pattern-section"><div><h3>Previous week</h3><p>${previousEntries.length ? `${previousEntries.length} blocks from ${formatWeekRange(previousStart)}` : `No blocks in ${formatWeekRange(previousStart)}`}</p></div><button id="clone-week" type="button" class="primary-button" ${previousEntries.length ? "" : "disabled"}>Clone into this week</button></section>
        <section><h3>Saved patterns</h3>${this.patterns.length ? `<ul class="pattern-list">${this.patterns.map((pattern) => `<li><div><strong>${escapeHtml(pattern.title)}</strong><span>${escapeHtml(pattern.start)}–${escapeHtml(pattern.end)} · ${escapeHtml(pattern.client || pattern.project)}</span></div><button type="button" data-use-pattern="${pattern.id}">Add</button><button type="button" class="danger-action" data-delete-pattern="${pattern.id}" aria-label="Delete ${escapeHtml(pattern.title)} pattern">Delete</button></li>`).join("")}</ul>` : '<p class="muted">No saved patterns yet. Use “Pattern” on any work block to save one.</p>'}</section>
      </div>`);
    dialog.querySelector("#clone-week")?.addEventListener("click", async () => {
      const now = Date.now();
      const additions = previousEntries.map((entry) => ({ ...entry, id: uid(), date: addDays(entry.date, 7), source: "pattern" as const, createdAt: now, updatedAt: now }));
      await Promise.all(additions.map((entry) => store.saveEntry(entry)));
      this.entries.push(...additions);
      dialog.close(); this.render(); this.showToast(`Cloned ${additions.length} blocks. Review them before exporting.`);
    });
    dialog.querySelectorAll<HTMLElement>("[data-use-pattern]").forEach((button) => button.addEventListener("click", () => {
      const pattern = this.patterns.find((item) => item.id === button.dataset.usePattern);
      if (!pattern) return;
      dialog.close();
      this.openEntryDialog({ ...pattern, id: "", date: this.currentWeek, source: "pattern", createdAt: 0 } as TimeEntry);
    }));
    dialog.querySelectorAll<HTMLElement>("[data-delete-pattern]").forEach((button) => button.addEventListener("click", async () => {
      const pattern = this.patterns.find((item) => item.id === button.dataset.deletePattern);
      if (!pattern || !confirm(`Delete the “${pattern.title}” pattern?`)) return;
      await store.deletePattern(pattern.id);
      this.patterns = this.patterns.filter((item) => item.id !== pattern.id);
      dialog.close(); this.openPatternsDialog();
    }));
  }

  private async saveEntryAsPattern(id: string): Promise<void> {
    if (!this.license.unlocked) { this.openUnlockDialog(); return; }
    const entry = this.entries.find((item) => item.id === id);
    if (!entry) return;
    const existing = this.patterns.find((item) => item.title === entry.description && item.project === entry.project);
    const pattern: Pattern = { id: existing?.id || uid(), title: entry.description, start: entry.start, end: entry.end, project: entry.project, client: entry.client, description: entry.description, billable: entry.billable, updatedAt: Date.now(), endsNextDay: entry.endsNextDay };
    await store.savePattern(pattern);
    this.patterns = this.patterns.filter((item) => item.id !== pattern.id).concat(pattern);
    this.showToast(`Saved “${pattern.title}” to the pattern deck.`);
  }

  private openUnlockDialog(): void {
    const dialog = this.makeDialog("unlock-dialog", `
      <div class="dialog-card unlock-card">
        <div class="dialog-heading"><div><p class="eyebrow">ONE-TIME UNLOCK</p><h2>Make repeat weeks faster</h2></div><button type="button" class="close-button" data-close aria-label="Close dialog">×</button></div>
        <p class="price"><strong>$18</strong> once</p>
        <ul class="feature-list"><li>Clone a previous week into matching days</li><li>Save unlimited reusable work patterns</li><li>Own the utility—no recurring subscription</li></ul>
        <p>The free workspace, calendar import, CSV/JSON export, and privacy tools remain available without a license.</p>
        ${this.license.notice ? `<p class="inline-error">${escapeHtml(this.license.notice)}</p>` : ""}
        <a class="primary-button button-link" href="${checkoutUrl}">Buy the one-time unlock</a>
        <form id="restore-form" class="restore-form"><label class="field">Have a license? Paste it here<input name="license" required autocomplete="off" /></label><button type="submit">Verify and restore</button><p class="form-error" role="status" aria-live="polite"></p></form>
        <p class="fine-print">Checkout is hosted by Sociobot; Dodo is merchant of record. Refunds are handled there and revoke the license. <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p>
      </div>`);
    dialog.querySelector<HTMLFormElement>("#restore-form")!.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const token = (form.elements.namedItem("license") as HTMLInputElement).value.trim();
      const status = form.querySelector<HTMLElement>(".form-error")!;
      status.textContent = "Checking license…";
      saveLicense(token);
      this.license = await verifyLicense(true);
      if (this.license.unlocked) { dialog.close(); this.render(); this.showToast("Pattern deck unlocked."); }
      else status.textContent = this.license.notice || "That license could not be verified.";
    });
  }

  private openSettingsDialog(): void {
    const dialog = this.makeDialog("settings-dialog", `
      <div class="dialog-card wide-dialog">
        <div class="dialog-heading"><div><p class="eyebrow">DATA + OWNERSHIP</p><h2>Your local archive</h2></div><button type="button" class="close-button" data-close aria-label="Close dialog">×</button></div>
        <p>All ${this.entries.length} work block${this.entries.length === 1 ? " is" : "s are"} stored in this browser. There is no cloud account.</p>
        <div class="settings-actions"><button id="backup-data" type="button">Export JSON backup</button><label class="button-file">Import JSON backup<input id="restore-data" type="file" accept="application/json,.json" /></label><button id="erase-data" type="button" class="danger-button">Erase all local data</button></div>
        <p id="settings-status" role="status" aria-live="polite"></p>
        <hr />
        <div class="license-row"><div><h3>Pattern deck</h3><p>${this.license.unlocked ? "One-time license active on this device." : "Free workspace · one-time pattern unlock available."}</p></div><button id="manage-license" type="button">${this.license.unlocked ? "Recheck license" : "See $18 unlock"}</button></div>
      </div>`);
    const status = dialog.querySelector<HTMLElement>("#settings-status")!;
    dialog.querySelector("#backup-data")!.addEventListener("click", async () => {
      downloadText(`backfill-timecards-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(await store.exportAll(), null, 2), "application/json");
      status.textContent = "Backup downloaded.";
    });
    dialog.querySelector<HTMLInputElement>("#restore-data")!.addEventListener("change", async (event) => {
      const file = (event.currentTarget as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const backup = JSON.parse(await file.text()) as AppBackup;
        if (!confirm(`Replace current local data with the backup from ${backup.exportedAt || "this file"}?`)) return;
        await store.importAll(backup);
        [this.entries, this.mappings, this.patterns] = await Promise.all([store.entries(), store.mappings(), store.patterns()]);
        dialog.close(); this.render(); this.showToast("Local backup restored.");
      } catch (error) { status.textContent = error instanceof Error ? error.message : "The backup could not be imported."; }
    });
    dialog.querySelector("#erase-data")!.addEventListener("click", async () => {
      if (!confirm(`Erase all ${this.entries.length} work blocks, project mappings, and saved patterns from this browser? This cannot be undone.`)) return;
      await store.clearAll(); this.entries = []; this.mappings = []; this.patterns = [];
      dialog.close(); this.render(); this.showToast("All local timecard data erased.");
    });
    dialog.querySelector("#manage-license")!.addEventListener("click", async () => {
      if (this.license.unlocked) {
        status.textContent = "Checking license…";
        this.license = await verifyLicense(true);
        status.textContent = this.license.notice || (this.license.unlocked ? "License is active." : "License is not active.");
      } else { dialog.close(); this.openUnlockDialog(); }
    });
  }

  private exportCsv(): void {
    const entries = this.weekEntries();
    if (!entries.length) return;
    downloadText(`timecard-${this.currentWeek}.csv`, entriesToCsv(entries), "text/csv;charset=utf-8");
    this.showToast(`Exported ${entries.length} invoice-ready row${entries.length === 1 ? "" : "s"}.`);
  }

  private makeDialog(id: string, html: string): HTMLDialogElement {
    document.querySelector(`#${id}`)?.remove();
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = document.createElement("dialog");
    dialog.id = id;
    dialog.innerHTML = html;
    document.body.append(dialog);
    dialog.querySelectorAll<HTMLElement>("[data-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => {
      dialog.remove();
      returnFocus?.focus();
    });
    dialog.showModal();
    return dialog;
  }

  private showToast(message: string, actionLabel?: string, action?: () => void): void {
    clearTimeout(this.toastTimer);
    const toast = document.querySelector<HTMLElement>("#toast");
    if (!toast) return;
    toast.innerHTML = `<span>${escapeHtml(message)}</span>${actionLabel ? `<button type="button">${escapeHtml(actionLabel)}</button>` : ""}`;
    toast.classList.add("is-visible");
    if (actionLabel && action) toast.querySelector("button")?.addEventListener("click", () => { action(); toast.classList.remove("is-visible"); });
    this.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), actionLabel ? 8000 : 4200);
  }

  private registerServiceWorker(): void {
    if (!("serviceWorker" in navigator)) return;
    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              this.showToast("An updated timecard is ready.", "Refresh", () => location.reload());
            }
          });
        });
      } catch (error) { console.warn("Offline support could not be installed.", error); }
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }
}
