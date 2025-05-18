'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/appStore'
import { useCodingSessionsStore } from '@/lib/store/codingSessionsStore'
import { useLearningItemsStore } from '@/lib/store/learningItemsStore'
import { useFocusSessionsStore } from '@/lib/store/focusSessionsStore'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Get actions from each store
  const setIsOnline = useAppStore((state) => state.setIsOnline)
  const fetchCodingSessions = useCodingSessionsStore((state) => state.fetchSessions)
  const fetchLearningItems = useLearningItemsStore((state) => state.fetchItems)
  const fetchFocusSessions = useFocusSessionsStore((state) => state.fetchSessions)
  const tickTimer = useFocusSessionsStore((state) => state.tickTimer)
  
  // Initialize data
  useEffect(() => {
    // Fetch initial data
    fetchCodingSessions()
    fetchLearningItems()
    fetchFocusSessions()
    
    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [fetchCodingSessions, fetchLearningItems, fetchFocusSessions, setIsOnline])
  
  // Timer for focus sessions
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer()
    }, 1000)
    
    return () => clearInterval(interval)
  }, [tickTimer])
  
  return <>{children}</>
} 