'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NotificationDropdown from '../features/NotificationDropdown'
import UserProfileDropdown from '../features/UserProfileDropdown'

export default function NavBar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-8">
        <div className="text-xl font-bold text-obsidian-green">SecureVibe</div>
        <div className="flex space-x-4">
          <Link href="/" className={`${isActive('/') ? 'underline decoration-obsidian-green text-black font-medium' : 'text-gray-600 hover:text-black'}`}>
            Dashboard
          </Link>
          <Link href="/scan" className={`${isActive('/scan') ? 'underline decoration-obsidian-green text-black font-medium' : 'text-gray-600 hover:text-black'}`}>
            Scan
          </Link>
          <Link href="/reports" className={`${isActive('/reports') ? 'underline decoration-obsidian-green text-black font-medium' : 'text-gray-600 hover:text-black'}`}>
            Reports
          </Link>
          <Link href="/settings" className={`${isActive('/settings') ? 'underline decoration-obsidian-green text-black font-medium' : 'text-gray-600 hover:text-black'}`}>
            Settings
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationDropdown />
        <UserProfileDropdown />
      </div>
    </nav>
  )
}
