import type { AppBackup, Pattern, ProjectMapping, TimeEntry } from "./types";

const DB_NAME = "backfill-timecards";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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

async function all<T>(storeName: string): Promise<T[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName).objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

async function put<T>(storeName: string, value: T): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function remove(storeName: string, key: IDBValidKey): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export const store = {
  entries: () => all<TimeEntry>("entries"),
  mappings: () => all<ProjectMapping>("mappings"),
  patterns: () => all<Pattern>("patterns"),
  saveEntry: (value: TimeEntry) => put("entries", value),
  saveMapping: (value: ProjectMapping) => put("mappings", value),
  savePattern: (value: Pattern) => put("patterns", value),
  deleteEntry: (id: string) => remove("entries", id),
  deletePattern: (id: string) => remove("patterns", id),
  async exportAll(): Promise<AppBackup> {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: await all("entries"),
      mappings: await all("mappings"),
      patterns: await all("patterns"),
    } as AppBackup;
  },
  async importAll(backup: AppBackup): Promise<void> {
    if (backup.version !== 1 || !Array.isArray(backup.entries) || !Array.isArray(backup.mappings) || !Array.isArray(backup.patterns)) {
      throw new Error("That file is not a Backfill Timecards backup.");
    }
    await this.clearAll();
    await Promise.all(backup.entries.map((value) => put("entries", value)));
    await Promise.all(backup.mappings.map((value) => put("mappings", value)));
    await Promise.all(backup.patterns.map((value) => put("patterns", value)));
  },
  async clearAll(): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["entries", "mappings", "patterns"], "readwrite");
      ["entries", "mappings", "patterns"].forEach((name) => transaction.objectStore(name).clear());
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  },
};
