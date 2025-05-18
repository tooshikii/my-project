'use client'

import { initSyncListeners, processSyncQueue } from './sync'

let initialized = false

export function initDatabase(): void {
  // Only initialize once
  if (initialized) return
  initialized = true
  
  // Initialize sync listeners
  initSyncListeners()
  
  // Process sync queue on startup if online
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    processSyncQueue()
  }
  
  console.log('Database and sync initialized')
} 