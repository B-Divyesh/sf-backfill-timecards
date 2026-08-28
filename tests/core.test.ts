import { describe, expect, it } from "vitest";
import { entriesToCsv } from "../src/csv";
import { addDays, formatDuration, formatWeekRange, minutesBetween, weekStart } from "../src/dates";
import { parseIcs } from "../src/ics";
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
    expect(formatDuration(150)).toBe("2h 30m");
  });
});

describe("calendar parsing", () => {
  it("unfolds lines, decodes text, and ignores untimed events", () => {
    const events = parseIcs(`BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:work-1\r\nDTSTART:20260824T090000\r\nDTEND:20260824T103000\r\nSUMMARY:Client\\, planning\r\nDESCRIPTION:Roadmap\\nreview\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20260825\r\nDTEND;VALUE=DATE:20260826\r\nSUMMARY:All day\r\nEND:VEVENT\r\nEND:VCALENDAR`);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ date: "2026-08-24", start: "09:00", end: "10:30", title: "Client, planning", description: "Roadmap review" });
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
