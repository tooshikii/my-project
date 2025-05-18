'use client'

import { useTheme } from '@/lib/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="theme-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme
      </label>
      <select
        id="theme-toggle"
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
} 