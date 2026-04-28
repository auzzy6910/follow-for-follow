import { Bell, Menu, UserPlus, LogOut, LogIn } from 'lucide-react'
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
    <header className="bg-dark-800 border-b border-dark-600 flex flex-col md:flex-row md:items-center md:h-16 px-3 sm:px-4 lg:px-6 md:gap-4 py-2 md:py-0 shrink-0">
      <button
        type="button"
        onClick={onSidebarToggle}
        aria-label="Toggle navigation"
        className="hidden lg:flex w-9 h-9 rounded-xl bg-dark-700 border border-dark-500 text-gray-300 hover:text-white hover:border-blue-accent/50 items-center justify-center transition-colors shrink-0 order-1 md:order-1 md:mr-2"
      >
        <Menu size={18} />
      </button>
      <div className="flex items-center justify-start gap-2 sm:gap-3 lg:gap-4 order-1 md:order-2 md:ml-auto md:justify-end md:shrink-0">
        <button
          className="w-9 h-9 rounded-full bg-blue-accent text-dark-900 flex items-center justify-center hover:brightness-110 transition-colors shrink-0"
          aria-label="Follow"
        >
          <UserPlus size={18} strokeWidth={2.5} />
        </button>

        <button
          className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shrink-0 ring-1 ring-blue-accent/40"
          aria-label="Profile"
        >
          <img src="/logo.png" alt="Profile" className="w-full h-full object-cover" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={toggleNotificationCenter}
            className="relative w-9 h-9 rounded-full bg-dark-700 border border-dark-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-haspopup="dialog"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-blue-accent text-dark-900 text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter />
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <span className="text-blue-accent text-sm font-semibold">{userStats.totalCredits.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">credits</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <div className="w-2 h-2 rounded-full bg-blue-accent animate-pulse" />
          <span className="text-gray-300 text-xs">Day {userStats.streak} Streak</span>
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => void signOut()}
            aria-label="Sign out"
            title="Sign out"
            className="w-9 h-9 rounded-full bg-dark-700 border border-dark-500 text-gray-300 hover:text-white hover:border-red-400/40 flex items-center justify-center transition-colors shrink-0"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-accent text-dark-900 text-sm font-semibold hover:brightness-110 transition-colors shrink-0"
          >
            <LogIn size={16} strokeWidth={2.5} />
            Sign in
          </button>
        )}
      </div>

      <div className="hidden md:block md:order-1 md:flex-1 md:min-w-0 md:max-w-xl">
        <input
          type="text"
          placeholder="Search users, tribes & niches..."
          className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50 transition-colors"
        />
      </div>
    </header>
  )
}
