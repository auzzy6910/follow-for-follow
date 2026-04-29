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

const linkBaseClass =
  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group'

const activeClass =
  'text-white bg-gradient-to-r from-violet-accent/20 via-indigo-500/15 to-blue-electric/10 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'

const inactiveClass =
  'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'

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
        className={`lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden
      />

      <aside
        className={`glass-strong flex flex-col shrink-0
          fixed lg:static top-0 left-0 z-50 h-full w-64 lg:w-60
          transition-transform duration-300 lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${desktopHiddenClass}`}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl gradient-accent opacity-60 blur-md" aria-hidden />
            <img
              src="/logo.png"
              alt="Follow for Follow"
              className="relative w-10 h-10 rounded-xl object-cover ring-1 ring-white/15"
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-white font-extrabold text-lg leading-tight whitespace-nowrap tracking-tight">Follow</h1>
            <p className="gradient-text text-xs font-semibold leading-tight whitespace-nowrap">for Follow</p>
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
                `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full gradient-accent"
                    />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className={`shrink-0 ${isActive ? 'text-violet-accent drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]' : ''}`}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="py-4 px-3 space-y-1 border-t border-white/10">
          {bottomItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className={`shrink-0 ${isActive ? 'text-violet-accent' : ''}`}
                  />
                  <span className="text-sm font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => void signOut()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all duration-200 w-full"
            >
              <LogOut size={20} strokeWidth={1.75} className="shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={openModal}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200 w-full"
            >
              <LogIn size={20} strokeWidth={1.75} className="shrink-0" />
              <span className="text-sm font-medium">Sign in</span>
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
