import { isoDate } from "./dates";
import type { CalendarEvent } from "./types";

function unfold(text: string): string[] {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").split("\n");
}

function unescapeText(value: string): string {
  return value.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\").trim();
}

function parseIcsDate(value: string): Date | null {
  const clean = value.trim();
  const match = clean.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z)?$/);
  if (!match) return null;
  const [, y, mo, d, h = "00", m = "00", s = "00", z] = match;
  return z
    ? new Date(Date.UTC(+y, +mo - 1, +d, +h, +m, +s))
    : new Date(+y, +mo - 1, +d, +h, +m, +s);
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function parseIcs(text: string): CalendarEvent[] {
  const lines = unfold(text);
  const events: CalendarEvent[] = [];
  let fields: Record<string, string> | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      fields = {};
      continue;
    }
    if (line === "END:VEVENT" && fields) {
      const startValue = fields.DTSTART ?? "";
      const start = parseIcsDate(startValue);
      const end = parseIcsDate(fields.DTEND ?? "");
      if (start && end && end > start && !/^\d{8}$/.test(startValue.trim())) {
        const startDate = isoDate(start);
        const endDate = isoDate(end);
        // A work block lives on its start date. Preserve a normal overnight
        // event rather than treating its earlier end clock time as zero work.
        // Events lasting more than one midnight are not meaningful as one
        // timecard row, so the review UI leaves them out for manual handling.
        const endsNextDay = endDate === isoDate(new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1));
        if (endDate !== startDate && !endsNextDay) {
          fields = null;
          continue;
        }
        events.push({
          id: fields.UID || crypto.randomUUID(),
          date: startDate,
          start: formatTime(start),
          end: formatTime(end),
          title: unescapeText(fields.SUMMARY || "Calendar event"),
          description: unescapeText(fields.DESCRIPTION || ""),
          endsNextDay,
        });
      }
      fields = null;
      continue;
    }
    if (fields) {
      const colon = line.indexOf(":");
      if (colon > 0) fields[line.slice(0, colon).split(";")[0]] = line.slice(colon + 1);
    }
  }
  return events.sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
}
