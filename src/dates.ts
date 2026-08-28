import type { TimeEntry } from "./types";

const dateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromIso(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function weekStart(date = new Date()): string {
  const value = dateOnly(date);
  const mondayOffset = (value.getDay() + 6) % 7;
  value.setDate(value.getDate() - mondayOffset);
  return isoDate(value);
}

export function addDays(value: string, amount: number): string {
  const date = fromIso(value);
  date.setDate(date.getDate() + amount);
  return isoDate(date);
}

export function weekDates(start: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function formatWeekRange(start: string): string {
  const first = fromIso(start);
  const last = fromIso(addDays(start, 6));
  const sameYear = first.getFullYear() === last.getFullYear();
  const sameMonth = sameYear && first.getMonth() === last.getMonth();
  const shortDate = (date: Date) => date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (sameMonth) return `${shortDate(first)}–${last.getDate()}, ${last.getFullYear()}`;
  if (sameYear) return `${shortDate(first)}–${shortDate(last)}, ${last.getFullYear()}`;
  return `${shortDate(first)}, ${first.getFullYear()}–${shortDate(last)}, ${last.getFullYear()}`;
}

export function minutesBetween(start: string, end: string, endsNextDay = false): number {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const difference = endHour * 60 + endMinute - startHour * 60 - startMinute;
  return Math.max(0, difference + (endsNextDay ? 24 * 60 : 0));
}

export function entryMinutes(entry: Pick<TimeEntry, "start" | "end" | "endsNextDay">): number {
  return minutesBetween(entry.start, entry.end, entry.endsNextDay);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return `${remainder}m`;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}
