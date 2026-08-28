import { entryMinutes } from "./dates";
import type { TimeEntry } from "./types";

const quote = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;

export function entriesToCsv(entries: TimeEntry[]): string {
  const header = ["Date", "Start", "End", "Hours", "Client", "Project", "Description", "Billable", "Source"];
  const rows = entries
    .slice()
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))
    .map((entry) => [
      entry.date,
      entry.start,
      entry.end,
      (entryMinutes(entry) / 60).toFixed(2),
      entry.client,
      entry.project,
      entry.description,
      entry.billable ? "Yes" : "No",
      entry.source,
    ]);
  return [header, ...rows].map((row) => row.map(quote).join(",")).join("\r\n");
}

export function downloadText(filename: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
