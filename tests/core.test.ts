import { describe, expect, it } from "vitest";
import { entriesToCsv } from "../src/csv";
import { addDays, formatDuration, formatWeekRange, minutesBetween, weekStart } from "../src/dates";
import { parseIcs } from "../src/ics";
import { validateBackup } from "../src/db";
import type { TimeEntry } from "../src/types";

describe("week calculations", () => {
  it("uses Monday as the start and crosses months safely", () => {
    expect(weekStart(new Date(2026, 7, 28))).toBe("2026-08-24");
    expect(addDays("2026-08-30", 3)).toBe("2026-09-02");
    expect(formatWeekRange("2026-08-24")).toMatch(/^Aug 24–30, 2026$/);
  });

  it("calculates honest non-negative durations", () => {
    expect(minutesBetween("09:15", "10:45")).toBe(90);
    expect(minutesBetween("12:00", "11:00")).toBe(0);
    expect(minutesBetween("23:00", "01:00", true)).toBe(120);
    expect(formatDuration(150)).toBe("2h 30m");
  });
});

describe("backup validation", () => {
  it("rejects incomplete records before an import can replace local data", () => {
    expect(() => validateBackup({ version: 1, entries: [{ id: "bad", date: "2026-08-24" }], mappings: [], patterns: [] })).toThrow(/work block 1 is incomplete or invalid/i);
  });
});

describe("overnight calendar events", () => {
  it("preserves the date boundary as an overnight work block", () => {
    const events = parseIcs("BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:overnight\nDTSTART:20260824T230000\nDTEND:20260825T010000\nSUMMARY:Overnight maintenance\nEND:VEVENT\nEND:VCALENDAR");
    expect(events).toEqual([expect.objectContaining({ date: "2026-08-24", start: "23:00", end: "01:00", endsNextDay: true })]);
  });
});

describe("calendar parsing", () => {
  it("unfolds lines, decodes text, and ignores untimed events", () => {
    const events = parseIcs(`BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:work-1\r\nDTSTART:20260824T090000\r\nDTEND:20260824T103000\r\nSUMMARY:Client\\, planning\r\nDESCRIPTION:Roadmap\\nreview\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20260825\r\nDTEND;VALUE=DATE:20260826\r\nSUMMARY:All day\r\nEND:VEVENT\r\nEND:VCALENDAR`);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ date: "2026-08-24", start: "09:00", end: "10:30", title: "Client, planning", description: "Roadmap review" });
  });

  it("expands bounded daily recurrence masters into reviewable occurrences", () => {
    const events = parseIcs(`BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:daily-review\nDTSTART:20260824T100000\nDTEND:20260824T110000\nRRULE:FREQ=DAILY;COUNT=5\nSUMMARY:Daily client review\nEND:VEVENT\nEND:VCALENDAR`);
    expect(events).toHaveLength(5);
    expect(events.map((event) => event.date)).toEqual(["2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28"]);
    expect(new Set(events.map((event) => event.id)).size).toBe(5);
  });

  it("rejects recurrence rules that cannot be bounded honestly", () => {
    const recurring = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:20260824T100000\nDTEND:20260824T110000\nRRULE:FREQ=DAILY\nSUMMARY:Open-ended review\nEND:VEVENT\nEND:VCALENDAR`;
    expect(() => parseIcs(recurring)).toThrow(/open-ended recurring event.*individual events/i);
  });
});

describe("invoice CSV", () => {
  it("orders rows and escapes invoice descriptions", () => {
    const base = { id: "1", project: "Launch", client: "Acme", billable: true, source: "manual", createdAt: 1, updatedAt: 1 } as const;
    const entries: TimeEntry[] = [
      { ...base, id: "2", date: "2026-08-25", start: "10:00", end: "11:30", description: 'Review "final"' },
      { ...base, date: "2026-08-24", start: "09:00", end: "10:00", description: "Planning" },
    ];
    const csv = entriesToCsv(entries);
    expect(csv.indexOf("2026-08-24")).toBeLessThan(csv.indexOf("2026-08-25"));
    expect(csv).toContain('"1.50"');
    expect(csv).toContain('"Review ""final"""');
  });
});
