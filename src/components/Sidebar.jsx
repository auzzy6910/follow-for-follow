import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Compass, Coins,
  Users, Shield, Settings, Wallet, LogOut, LogIn, X
} from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useAuthGuard } from '../context/useAuthGuard'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/credits', label: 'Credits', icon: Coins },
  { path: '/tribes', label: 'Tribes', icon: Users },
  { path: '/safety', label: 'Safety', icon: Shield },
]

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
]

export default function Sidebar({ isOpen, onToggle, mobileOpen = false, onMobileClose }) {
  const { signOut } = useAuthActions()
  const { isAuthenticated, openModal } = useAuthGuard()
  const desktopHiddenClass = isOpen ? '' : 'lg:hidden'

  return (
    <>
      <div
        onClick={onMobileClose}
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden
      />

      <aside
        className={`bg-white border-r border-gray-200 flex flex-col shrink-0
          fixed lg:static top-0 left-0 z-50 h-full w-64 lg:w-64
          transition-transform duration-300 lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${desktopHiddenClass}`}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-black text-[#af101a] leading-tight">Creator Studio</h2>
            <p className="text-xs text-gray-500 leading-tight">Growth Strategist</p>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden ml-auto text-gray-500 hover:text-gray-900 p-1"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          <button
            onClick={onToggle}
            className="hidden lg:block ml-auto text-gray-400 hover:text-gray-700 transition-colors p-1"
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-red-50 text-[#af101a] border-r-4 border-[#af101a] font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-sm whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="py-4 px-3 space-y-1 border-t border-gray-100">
          {bottomItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 text-[#af101a] font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => void signOut()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full font-medium"
            >
              <LogOut size={20} className="shrink-0" />
              <span className="text-sm">Logout</span>
            </button>
          ) : (
            <button
              onClick={openModal}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-[#af101a] hover:bg-red-50 transition-all duration-200 w-full font-medium"
            >
              <LogIn size={20} className="shrink-0" />
              <span className="text-sm">Sign in</span>
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
