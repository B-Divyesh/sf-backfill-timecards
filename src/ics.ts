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

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

function recurrenceStarts(fields: Record<string, string>, start: Date): Date[] {
  const ruleText = fields.RRULE;
  if (!ruleText) return [start];
  const rule = Object.fromEntries(ruleText.split(";").map((part) => {
    const [key, ...value] = part.split("=");
    return [key.toUpperCase(), value.join("=")];
  }));
  const frequency = rule.FREQ?.toUpperCase();
  if (frequency !== "DAILY" && frequency !== "WEEKLY") {
    throw new Error("This calendar has a recurring event that cannot be expanded safely. Export the week as individual events, then try again.");
  }
  const interval = parsePositiveInteger(rule.INTERVAL, 1);
  const count = rule.COUNT === undefined ? undefined : parsePositiveInteger(rule.COUNT, 0);
  const until = rule.UNTIL ? parseIcsDate(rule.UNTIL) : null;
  if (until && /^\d{8}$/.test(rule.UNTIL)) until.setHours(23, 59, 59, 999);
  if (!interval || count === 0 || (rule.UNTIL && !until)) {
    throw new Error("This calendar has an invalid recurrence rule. Export the week as individual events, then try again.");
  }
  if (count === undefined && !until) {
    throw new Error("This calendar has an open-ended recurring event. Export the week as individual events, then try again.");
  }

  const weekdayNumbers: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
  const byDayTokens = rule.BYDAY?.toUpperCase().split(",");
  const byDays = byDayTokens?.map((day) => weekdayNumbers[day]);
  if (byDays?.some((day) => day === undefined)) {
    throw new Error("This calendar has a recurrence pattern that cannot be expanded safely. Export the week as individual events, then try again.");
  }

  const starts: Date[] = [];
  const exclusions = new Set((fields.EXDATE || "").split(",").map(parseIcsDate).filter((date): date is Date => Boolean(date)).map((date) => date.getTime()));
  let candidate = new Date(start);
  let generated = 0;
  const maxCandidates = 20_000;
  for (let checked = 0; checked < maxCandidates; checked += 1, candidate = addCalendarDays(candidate, 1)) {
    if (until && candidate > until) break;
    const daysSinceStart = Math.round((Date.UTC(candidate.getFullYear(), candidate.getMonth(), candidate.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86_400_000);
    const matches = frequency === "DAILY"
      ? daysSinceStart % interval === 0 && (byDays?.includes(candidate.getDay()) ?? true)
      : Math.floor((daysSinceStart + ((start.getDay() + 6) % 7)) / 7) % interval === 0 && (byDays?.includes(candidate.getDay()) ?? candidate.getDay() === start.getDay());
    if (matches) {
      generated += 1;
      if (!exclusions.has(candidate.getTime())) starts.push(new Date(candidate));
    }
    if (count !== undefined && generated >= count) break;
  }
  if (count !== undefined && generated < count) {
    throw new Error("This calendar recurrence is too large to review safely. Export one week as individual events, then try again.");
  }
  return starts;
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
        const duration = end.getTime() - start.getTime();
        for (const occurrenceStart of recurrenceStarts(fields, start)) {
          const occurrenceEnd = new Date(occurrenceStart.getTime() + duration);
          const startDate = isoDate(occurrenceStart);
          const endDate = isoDate(occurrenceEnd);
          // A work block lives on its start date. Preserve a normal overnight
          // event rather than treating its earlier end clock time as zero work.
          // Events lasting more than one midnight are not meaningful as one
          // timecard row, so the review UI leaves them out for manual handling.
          const endsNextDay = endDate === isoDate(addCalendarDays(occurrenceStart, 1));
          if (endDate !== startDate && !endsNextDay) continue;
          events.push({
            id: `${fields.UID || crypto.randomUUID()}::${occurrenceStart.toISOString()}`,
            date: startDate,
            start: formatTime(occurrenceStart),
            end: formatTime(occurrenceEnd),
            title: unescapeText(fields.SUMMARY || "Calendar event"),
            description: unescapeText(fields.DESCRIPTION || ""),
            endsNextDay,
          });
        }
      }
      fields = null;
      continue;
    }
    if (fields) {
      const colon = line.indexOf(":");
      if (colon > 0) {
        const key = line.slice(0, colon).split(";")[0];
        const value = line.slice(colon + 1);
        fields[key] = key === "EXDATE" && fields[key] ? `${fields[key]},${value}` : value;
      }
    }
  }
  return events.sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
}
