import { openDB, IDBPDatabase } from 'idb'

// Define our database structure
interface DevPulseDB {
  'coding-sessions': {
    key: string;
    value: CodingSession;
  };
  'learning-items': {
    key: string;
    value: LearningItem;
  };
  'focus-sessions': {
    key: string;
    value: FocusSession;
  };
  'sync-queue': {
    key: string;
    value: SyncQueueItem;
  };
}

// Data types
export interface CodingSession {
  id: string;
  date: string;
  duration: number; // in minutes
  project: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

export interface LearningItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'book';
  url?: string;
  completed: boolean;
  dateAdded: string;
  dateCompleted?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

export interface FocusSession {
  id: string;
  date: string;
  duration: number; // in minutes
  task: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

export interface SyncQueueItem {
  id: string;
  table: keyof DevPulseDB;
  action: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: string;
  attempts: number;
}

// Database name and version
const DB_NAME = 'devpulse-db'
const DB_VERSION = 1

// Get database instance
async function getDB(): Promise<IDBPDatabase<DevPulseDB>> {
  return openDB<DevPulseDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('coding-sessions')) {
        db.createObjectStore('coding-sessions');
      }
      if (!db.objectStoreNames.contains('learning-items')) {
        db.createObjectStore('learning-items');
      }
      if (!db.objectStoreNames.contains('focus-sessions')) {
        db.createObjectStore('focus-sessions');
      }
      if (!db.objectStoreNames.contains('sync-queue')) {
        db.createObjectStore('sync-queue');
      }
    },
  })
}

// Generic function to save data to IndexedDB
export async function saveToIndexedDB<T>(
  storeName: keyof DevPulseDB, 
  id: string, 
  data: T
): Promise<T> {
  const db = await getDB()
  await db.put(storeName, data, id)
  
  // Add to sync queue if we're offline
  if (!navigator.onLine) {
    const syncItem: SyncQueueItem = {
      id: `${storeName}_${id}_${Date.now()}`,
      table: storeName,
      action: 'update', // Treat all as updates since we're using put
      data: data as unknown as Record<string, unknown>,
      timestamp: new Date().toISOString(),
      attempts: 0
    }
    await db.put('sync-queue', syncItem, syncItem.id)
  }
  
  return data
}

// Generic function to get all items from a store
export async function getAllFromIndexedDB<T>(
  storeName: keyof DevPulseDB
): Promise<T[]> {
  const db = await getDB()
  return db.getAll(storeName)
}

// Get a single item by ID
export async function getFromIndexedDB<T>(
  storeName: keyof DevPulseDB,
  id: string
): Promise<T | undefined> {
  const db = await getDB()
  return db.get(storeName, id)
}

// Delete an item
export async function deleteFromIndexedDB(
  storeName: keyof DevPulseDB,
  id: string
): Promise<void> {
  const db = await getDB()
  await db.delete(storeName, id)
  
  // Add to sync queue if we're offline
  if (!navigator.onLine) {
    const syncItem: SyncQueueItem = {
      id: `${storeName}_${id}_${Date.now()}`,
      table: storeName,
      action: 'delete',
      data: { id } as Record<string, unknown>,
      timestamp: new Date().toISOString(),
      attempts: 0
    }
    await db.put('sync-queue', syncItem, syncItem.id)
  }
} 