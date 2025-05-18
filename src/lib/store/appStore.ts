'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Define theme types
export type Theme = 'light' | 'dark' | 'system'
export type TimeZone = 'UTC' | 'local'

// Define the app state interface
interface AppState {
  // Theme settings
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // Time zone settings
  timeZone: TimeZone
  setTimeZone: (timeZone: TimeZone) => void
  
  // App status
  isOnline: boolean
  setIsOnline: (status: boolean) => void
  isSyncing: boolean
  setIsSyncing: (status: boolean) => void
  
  // UI state
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
}

// Create the store with persistence and immer for immutable updates
export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      // Default theme settings
      theme: 'system',
      setTheme: (theme) => set((state) => {
        state.theme = theme
      }),
      
      // Default time zone settings
      timeZone: 'local',
      setTimeZone: (timeZone) => set((state) => {
        state.timeZone = timeZone
      }),
      
      // Default online status (determined by browser)
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      setIsOnline: (status) => set((state) => {
        state.isOnline = status
      }),
      
      // Syncing status
      isSyncing: false,
      setIsSyncing: (status) => set((state) => {
        state.isSyncing = status
      }),
      
      // UI state
      sidebarOpen: true,
      toggleSidebar: () => set((state) => {
        state.sidebarOpen = !state.sidebarOpen
      }),
      setSidebarOpen: (isOpen) => set((state) => {
        state.sidebarOpen = isOpen
      }),
    })),
    {
      name: 'devpulse-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
) 