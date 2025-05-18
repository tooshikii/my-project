'use client'

import { getAllFromIndexedDB, deleteFromIndexedDB, SyncQueueItem } from './indexdb'
import { saveDataToSupabase, deleteDataFromSupabase } from './supabase'

// Convert IndexedDB store names to Supabase table names
const storeToTableMap: Record<string, string> = {
  'coding-sessions': 'coding_sessions',
  'learning-items': 'learning_items',
  'focus-sessions': 'focus_sessions',
}

// Process the sync queue to push changes to Supabase
export async function processSyncQueue(): Promise<void> {
  try {
    // Get all items from sync queue
    const queueItems = await getAllFromIndexedDB<SyncQueueItem>('sync-queue')
    
    if (queueItems.length === 0) {
      return
    }
    
    console.log(`Processing sync queue: ${queueItems.length} items`)
    
    // Process each item
    for (const item of queueItems) {
      try {
        const tableName = storeToTableMap[item.table]
        
        if (!tableName) {
          console.error(`Unknown table mapping for ${item.table}`)
          continue
        }
        
        // Handle based on action type
        if (item.action === 'delete') {
          await deleteDataFromSupabase(tableName, item.data.id as string)
        } else {
          // For both create and update, we use upsert
          await saveDataToSupabase(tableName, item.data)
        }
        
        // Remove from queue after successful processing
        await deleteFromIndexedDB('sync-queue', item.id)
        
      } catch (error) {
        console.error(`Error processing sync item ${item.id}:`, error)
        // Could implement retry logic here
      }
    }
  } catch (error) {
    console.error('Error processing sync queue:', error)
  }
}

// Initialize listeners for online/offline events
export function initSyncListeners(): void {
  if (typeof window === 'undefined') return
  
  // Process queue when coming back online
  window.addEventListener('online', () => {
    console.log('Back online, processing sync queue')
    processSyncQueue()
  })
  
  // Update status when going offline
  window.addEventListener('offline', () => {
    console.log('Device is offline, data will be synced when connection restored')
  })
  
  // Also process on initialization if online
  if (navigator.onLine) {
    processSyncQueue()
  }
}

// Check if the device is online
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : false
} 