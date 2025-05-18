'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Stats', href: '/stats' },
  { name: 'Settings', href: '/settings' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">DevPulse</span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
} 