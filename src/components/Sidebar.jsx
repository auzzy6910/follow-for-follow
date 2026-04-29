import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Compass, Coins, Clock,
  Users, Trophy, Shield, Settings, Wallet, LogOut, LogIn, Sparkles, X
} from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useAuthGuard } from '../context/useAuthGuard'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/credits', label: 'Credits', icon: Coins },
  { path: '/golden-hour', label: 'Golden Hour', icon: Clock },
  { path: '/quality', label: 'AI Quality', icon: Sparkles },
  { path: '/tribes', label: 'Tribes', icon: Users },
  { path: '/gamification', label: 'Leaderboards', icon: Trophy },
  { path: '/safety', label: 'Safety', icon: Shield },
]

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
]

export default function Sidebar({ isOpen, onToggle, mobileOpen = false, onMobileClose }) {
  const { signOut } = useAuthActions()
  const { isAuthenticated, openModal } = useAuthGuard()
  // On large screens, sidebar is hidden by default and revealed when isOpen=true via the
  // hamburger toggle in the header. On mobile, it slides in as a drawer when mobileOpen=true.
  const desktopHiddenClass = isOpen ? '' : 'lg:hidden'

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onMobileClose}
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 transition-opacity ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden
      />

      <aside
        className={`bg-dark-800 border-r border-dark-600 flex flex-col shrink-0
          fixed lg:static top-0 left-0 z-50 h-full w-64 lg:w-60
          transition-transform duration-300 lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${desktopHiddenClass}`}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-dark-600">
          <img
            src="/logo.png"
            alt="Follow for Follow"
            className="w-10 h-10 rounded-xl shrink-0 object-cover"
          />
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight whitespace-nowrap">Follow</h1>
            <p className="text-blue-accent text-xs font-medium leading-tight whitespace-nowrap">for Follow</p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden ml-auto text-gray-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          {/* Desktop close button */}
          <button
            onClick={onToggle}
            className="hidden lg:block ml-auto text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-accent/10 text-blue-accent'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="py-4 px-3 space-y-1 border-t border-dark-600">
          {bottomItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-accent/10 text-blue-accent'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => void signOut()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 w-full"
            >
              <LogOut size={20} className="shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={openModal}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-blue-accent hover:bg-blue-accent/10 transition-all duration-200 w-full"
            >
              <LogIn size={20} className="shrink-0" />
              <span className="text-sm font-medium">Sign in</span>
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
