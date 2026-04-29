import { Bell, Menu, Search, Wallet, Flame, LogOut, LogIn } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'
import NotificationCenter from './NotificationCenter'

export default function Header({ onSidebarToggle }) {
  const { userStats, inboxNotifications, toggleNotificationCenter } =
    useAppContext()
  const { signOut } = useAuthActions()
  const { isAuthenticated, openModal } = useAuthGuard()
  const unreadCount = inboxNotifications.filter(n => !n.read).length

  return (
    <header className="bg-white border-b border-gray-200 flex items-center h-16 px-4 sm:px-6 gap-4 shrink-0">
      <button
        type="button"
        onClick={onSidebarToggle}
        aria-label="Toggle navigation"
        className="lg:hidden w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:text-[#af101a] flex items-center justify-center transition-colors shrink-0"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-lg sm:text-xl font-black text-[#af101a] tracking-tight uppercase">Follow for Follow</span>
      </div>

      <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-72 shrink-0">
        <Search size={16} className="text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Search creators..."
          className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full placeholder-gray-500 ml-2 text-gray-800"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-4 text-sm font-semibold">
          <div className="flex items-center gap-1.5 text-[#af101a]">
            <Wallet size={16} strokeWidth={2.5} />
            <span>{userStats.totalCredits.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-600">
            <Flame size={16} strokeWidth={2.5} />
            <span>{userStats.streak} days</span>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={toggleNotificationCenter}
            className="relative w-9 h-9 rounded-full text-gray-600 hover:text-[#af101a] flex items-center justify-center transition-colors shrink-0"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-haspopup="dialog"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#af101a] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter />
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => void signOut()}
            aria-label="Sign out"
            title="Sign out"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#af101a] hover:bg-[#931017] text-white text-sm font-bold transition-all shrink-0"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#af101a] hover:bg-[#931017] text-white text-sm font-bold transition-all shrink-0"
          >
            <LogIn size={16} />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        <button
          className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0"
          aria-label="Profile"
        >
          <img src="/logo.png" alt="Profile" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  )
}
