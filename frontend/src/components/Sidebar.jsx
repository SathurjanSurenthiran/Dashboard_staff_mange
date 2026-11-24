import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Clock,
  UtensilsCrossed,
  X,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/employees',  label: 'Employees',  icon: Users },
  { to: '/attendance', label: 'Attendance', icon: Clock },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col
        bg-gradient-to-b from-[#cff8f8] via-[#b0f0f2] to-[#cdf3f5]
        border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}
    >
      {/*  Top glow accent  */}
      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-teal-400 rounded-t" /> */}

      {/*  Logo  */}
      <div className="flex items-center justify-between h-16 px-5 mt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40">
              <UtensilsCrossed className="w-4.5 h-4.5 text-white" />
            </div>
            {/* glow */}
            <div className="absolute inset-0 w-9 h-9 bg-primary-500/30 rounded-xl blur-md -z-10" />
          </div>
          <div className="leading-tight">
            <p className="text-black font-bold text-sm tracking-tight">Restaurant</p>
            <p className="text-primary-400 font-bold text-xs tracking-widest uppercase">HR Portal</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/*  Divider  */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />

      {/*  Nav  */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3 select-none">
          Main Menu
        </p>

        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl
               text-sm font-medium transition-all duration-200 select-none
               ${isActive
                 ? 'bg-gradient-to-r from-primary-600/90 to-primary-500/80 text-white shadow-lg shadow-primary-900/30'
                 : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active left bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  {/* Icon box */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                    ${isActive
                      ? 'bg-white/20 shadow-inner'
                      : 'bg-white/5 group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {label}
                </div>

                {/* Arrow indicator */}
                <ChevronRight className={`w-3.5 h-3.5 transition-all duration-200
                  ${isActive ? 'opacity-100 text-white/70' : 'opacity-0 group-hover:opacity-40'}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/*  Divider  */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/*  Footer  */}
      <div className="px-5 py-4">
        <div className="bg-white/5 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
          <p className="text-black/40 text-xs">System online</p>
          <p className="text-black/20 text-xs ml-auto">v1.0</p>
        </div>
      </div>
    </aside>
  )
}
