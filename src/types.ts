export type EntrySource = "manual" | "calendar" | "pattern";

export interface TimeEntry {
  id: string;
  date: string;
  start: string;
  end: string;
  project: string;
  client: string;
  description: string;
  billable: boolean;
  source: EntrySource;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectMapping {
  project: string;
  client: string;
  updatedAt: number;
}

export interface Pattern {
  id: string;
  title: string;
  start: string;
  end: string;
  project: string;
  client: string;
  description: string;
  billable: boolean;
  updatedAt: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  start: string;
  end: string;
  title: string;
  description: string;
}

export interface AppBackup {
  version: 1;
  exportedAt: string;
  entries: TimeEntry[];
  mappings: ProjectMapping[];
  patterns: Pattern[];
}
