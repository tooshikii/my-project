'use client'

import { v4 as uuidv4 } from 'uuid'
import { 
  saveToIndexedDB, 
  getAllFromIndexedDB, 
  CodingSession,
  LearningItem,
  FocusSession
} from './indexdb'
import { saveDataToSupabase, fetchDataFromSupabase } from './supabase'
import { isOnline } from './sync'

// Helper function to generate timestamps
const createTimestamps = () => {
  const now = new Date().toISOString()
  return {
    createdAt: now,
    updatedAt: now
  }
}

// Coding Sessions API
export async function saveCodingSession(session: Omit<CodingSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<CodingSession> {
  const id = uuidv4()
  const timestamps = createTimestamps()
  
  const newSession: CodingSession = {
    id,
    ...session,
    ...timestamps
  }
  
  // Save to IndexedDB first
  await saveToIndexedDB('coding-sessions', id, newSession)
  
  // If online, also save to Supabase directly
  if (isOnline()) {
    try {
      await saveDataToSupabase('coding_sessions', newSession)
      // Mark as synced
      newSession.syncedAt = new Date().toISOString()
      await saveToIndexedDB('coding-sessions', id, newSession)
    } catch (error) {
      console.error('Failed to save to Supabase:', error)
      // Will be synced later by the sync process
    }
  }
  
  return newSession
}

export async function getCodingSessions(): Promise<CodingSession[]> {
  // Get from IndexedDB first (for offline access)
  const localSessions = await getAllFromIndexedDB<CodingSession>('coding-sessions')
  
  // If online, try to fetch the latest from Supabase
  if (isOnline()) {
    try {
      const remoteSessions = await fetchDataFromSupabase('coding_sessions')
      
      // Merge remote and local data (local takes precedence if not synced)
      // This is a simple implementation, you might want to enhance
      const mergedSessions = [...localSessions]
      
      for (const remote of remoteSessions) {
        const localIndex = mergedSessions.findIndex(local => local.id === remote.id)
        
        if (localIndex === -1) {
          // Remote item doesn't exist locally, add it
          mergedSessions.push(remote as CodingSession)
        } else {
          // Remote exists locally, check if local is more recent and not synced
          const local = mergedSessions[localIndex]
          if (!local.syncedAt || new Date(local.updatedAt) > new Date(local.syncedAt)) {
            // Local changes not synced, keep local version
          } else {
            // Remote is latest, update local
            mergedSessions[localIndex] = {
              ...remote as CodingSession,
              syncedAt: new Date().toISOString()
            }
            // Update in IndexedDB
            await saveToIndexedDB('coding-sessions', remote.id, mergedSessions[localIndex])
          }
        }
      }
      
      return mergedSessions
    } catch (error) {
      console.error('Failed to fetch from Supabase:', error)
      // Return local data only
      return localSessions
    }
  }
  
  // Offline, return local data only
  return localSessions
}

// Similar functions for LearningItem
export async function saveLearningItem(item: Omit<LearningItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningItem> {
  const id = uuidv4()
  const timestamps = createTimestamps()
  
  const newItem: LearningItem = {
    id,
    ...item,
    ...timestamps
  }
  
  await saveToIndexedDB('learning-items', id, newItem)
  
  if (isOnline()) {
    try {
      await saveDataToSupabase('learning_items', newItem)
      newItem.syncedAt = new Date().toISOString()
      await saveToIndexedDB('learning-items', id, newItem)
    } catch (error) {
      console.error('Failed to save to Supabase:', error)
    }
  }
  
  return newItem
}

export async function getLearningItems(): Promise<LearningItem[]> {
  return getAllFromIndexedDB<LearningItem>('learning-items')
}

// Similar functions for FocusSession
export async function saveFocusSession(session: Omit<FocusSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<FocusSession> {
  const id = uuidv4()
  const timestamps = createTimestamps()
  
  const newSession: FocusSession = {
    id,
    ...session,
    ...timestamps
  }
  
  await saveToIndexedDB('focus-sessions', id, newSession)
  
  if (isOnline()) {
    try {
      await saveDataToSupabase('focus_sessions', newSession)
      newSession.syncedAt = new Date().toISOString()
      await saveToIndexedDB('focus-sessions', id, newSession)
    } catch (error) {
      console.error('Failed to save to Supabase:', error)
    }
  }
  
  return newSession
}

export async function getFocusSessions(): Promise<FocusSession[]> {
  return getAllFromIndexedDB<FocusSession>('focus-sessions')
} 