'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/appStore'

// This component ensures Zustand stores are properly hydrated
export default function StoreHydration() {
  // Get the hydrate function from the app store
  const hydrate = useAppStore.persist.onFinishHydration

  useEffect(() => {
    // Only run once on client side to hydrate the store from localStorage
    const handleHydration = () => {
      hydrate(() => {
        console.log('Store hydration complete')
      })
    }
    
    handleHydration()
  }, [hydrate])

  // This component doesn't render anything visually
  return null
} 