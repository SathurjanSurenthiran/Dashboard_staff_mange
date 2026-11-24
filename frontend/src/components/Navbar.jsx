import { Menu, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export default function Navbar({ onMenuClick }) {
  const { admin, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
  }

  // Get initials from email
  const initials = admin?.email
    ? admin.email.charAt(0).toUpperCase()
    : 'A'

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-white/60 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
      {/* Left — hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Left — greeting (desktop) */}
      <div className="hidden lg:flex flex-col">
        <span className="text-xs text-gray-400 font-medium">Welcome back 👋</span>
        <span className="text-sm font-semibold text-navy truncate max-w-xs">
          {admin?.email}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Bell */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Avatar + logout */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-navy max-w-[140px] truncate">
            {admin?.email?.split('@')[0]}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title="Logout"
          className="flex items-center gap-1.5 px-2.5 py-2 text-sm text-gray-400
                     hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors
                     disabled:opacity-50 ml-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block text-xs font-medium">Logout</span>
        </button>
      </div>
    </header>
  )
}
