import type { AppBackup, Pattern, ProjectMapping, TimeEntry } from "./types";

const DB_NAME = "backfill-timecards";
export const DEMO_DB_NAME = "demo:backfill-timecards";
const DB_VERSION = 1;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isTime = (value: unknown): value is string => typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
const isIsoDate = (value: unknown): value is string => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};
const isTimestamp = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
const timeMinutes = (value: string): number => {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
};
const hasValidTimeRange = (start: unknown, end: unknown, endsNextDay = false): boolean => {
  if (!isTime(start) || !isTime(end)) return false;
  return endsNextDay ? timeMinutes(end) < timeMinutes(start) : timeMinutes(end) > timeMinutes(start);
};

function isTimeEntry(value: unknown): value is TimeEntry {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.id)
    && isIsoDate(value.date)
    && hasValidTimeRange(value.start, value.end, value.endsNextDay === true)
    && typeof value.project === "string"
    && typeof value.client === "string"
    && isNonEmptyString(value.description)
    && typeof value.billable === "boolean"
    && (value.source === "manual" || value.source === "calendar" || value.source === "pattern")
    && isTimestamp(value.createdAt)
    && isTimestamp(value.updatedAt)
    && (value.endsNextDay === undefined || typeof value.endsNextDay === "boolean");
}

function isMapping(value: unknown): value is ProjectMapping {
  return isRecord(value) && isNonEmptyString(value.project) && typeof value.client === "string" && isTimestamp(value.updatedAt);
}

function isPattern(value: unknown): value is Pattern {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && isNonEmptyString(value.title)
    && hasValidTimeRange(value.start, value.end, value.endsNextDay === true)
    && isNonEmptyString(value.project)
    && typeof value.client === "string"
    && isNonEmptyString(value.description)
    && typeof value.billable === "boolean"
    && isTimestamp(value.updatedAt)
    && (value.endsNextDay === undefined || typeof value.endsNextDay === "boolean");
}

/** Validate every record before an import touches the current archive. */
export function validateBackup(value: unknown): asserts value is AppBackup {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.entries) || !Array.isArray(value.mappings) || !Array.isArray(value.patterns)) {
    throw new Error("That file is not a Backfill Timecards backup.");
  }
  if (value.exportedAt !== undefined && typeof value.exportedAt !== "string") throw new Error("Backup export date is invalid.");
  const invalidEntry = value.entries.findIndex((entry) => !isTimeEntry(entry));
  if (invalidEntry >= 0) throw new Error(`Backup work block ${invalidEntry + 1} is incomplete or invalid. Nothing was changed.`);
  const invalidMapping = value.mappings.findIndex((mapping) => !isMapping(mapping));
  if (invalidMapping >= 0) throw new Error(`Backup project mapping ${invalidMapping + 1} is incomplete or invalid. Nothing was changed.`);
  const invalidPattern = value.patterns.findIndex((pattern) => !isPattern(pattern));
  if (invalidPattern >= 0) throw new Error(`Backup pattern ${invalidPattern + 1} is incomplete or invalid. Nothing was changed.`);
}

function openDb(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("entries")) db.createObjectStore("entries", { keyPath: "id" });
      if (!db.objectStoreNames.contains("mappings")) db.createObjectStore("mappings", { keyPath: "project" });
      if (!db.objectStoreNames.contains("patterns")) db.createObjectStore("patterns", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function all<T>(dbName: string, storeName: string): Promise<T[]> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName).objectStore(storeName).getAll();
    request.onsuccess = () => { db.close(); resolve(request.result as T[]); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

async function put<T>(dbName: string, storeName: string, value: T): Promise<void> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

async function replaceAll(dbName: string, backup: AppBackup): Promise<void> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["entries", "mappings", "patterns"], "readwrite");
    transaction.objectStore("entries").clear();
    transaction.objectStore("mappings").clear();
    transaction.objectStore("patterns").clear();
    backup.entries.forEach((entry) => transaction.objectStore("entries").put(entry));
    backup.mappings.forEach((mapping) => transaction.objectStore("mappings").put(mapping));
    backup.patterns.forEach((pattern) => transaction.objectStore("patterns").put(pattern));
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onabort = () => { db.close(); reject(transaction.error || new Error("The backup could not be saved.")); };
    transaction.onerror = () => { db.close(); reject(transaction.error || new Error("The backup could not be saved.")); };
  });
}

async function remove(dbName: string, storeName: string, key: IDBValidKey): Promise<void> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(key);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

export type TimecardStore = ReturnType<typeof createStore>;

export function createStore(dbName: string) {
  return {
  // Filter data written by an older broken build. The settings screen remains
  // usable so the owner can export valid records or erase the damaged store.
    entries: async () => (await all<unknown>(dbName, "entries")).filter(isTimeEntry),
    mappings: async () => (await all<unknown>(dbName, "mappings")).filter(isMapping),
    patterns: async () => (await all<unknown>(dbName, "patterns")).filter(isPattern),
    saveEntry: (value: TimeEntry) => put(dbName, "entries", value),
    saveMapping: (value: ProjectMapping) => put(dbName, "mappings", value),
    savePattern: (value: Pattern) => put(dbName, "patterns", value),
    deleteEntry: (id: string) => remove(dbName, "entries", id),
    deletePattern: (id: string) => remove(dbName, "patterns", id),
    async exportAll(): Promise<AppBackup> {
      return {
        version: 1,
        exportedAt: new Date().toISOString(),
        entries: (await all<unknown>(dbName, "entries")).filter(isTimeEntry),
        mappings: (await all<unknown>(dbName, "mappings")).filter(isMapping),
        patterns: (await all<unknown>(dbName, "patterns")).filter(isPattern),
      } as AppBackup;
    },
    async importAll(backup: AppBackup): Promise<void> {
      validateBackup(backup);
      await replaceAll(dbName, backup);
    },
    async clearAll(): Promise<void> {
      const db = await openDb(dbName);
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["entries", "mappings", "patterns"], "readwrite");
        ["entries", "mappings", "patterns"].forEach((name) => transaction.objectStore(name).clear());
        transaction.oncomplete = () => { db.close(); resolve(); };
        transaction.onerror = () => { db.close(); reject(transaction.error); };
      });
    },
  };
}

export const store = createStore(DB_NAME);
export const demoStore = createStore(DEMO_DB_NAME);
