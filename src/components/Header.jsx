import { Search, Bell, UserPlus } from 'lucide-react'
import { useUserStats } from '../hooks/useAppData'

export default function Header() {
  const USER_STATS = useUserStats()

  return (
    <header className="bg-dark-800 border-b border-dark-600 flex flex-col md:flex-row md:items-center md:h-16 px-3 sm:px-4 lg:px-6 md:gap-4 py-2 md:py-0 shrink-0">
      <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4 order-1 md:order-2 md:shrink-0">
        <div className="hidden lg:flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <span className="text-green-accent text-sm font-semibold">{USER_STATS.totalCredits.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">credits</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <div className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
          <span className="text-gray-300 text-xs">Day {USER_STATS.streak} Streak</span>
        </div>

        <button
          className="w-9 h-9 rounded-full bg-green-accent text-dark-900 flex items-center justify-center hover:brightness-110 transition-colors shrink-0"
          aria-label="Follow"
        >
          <UserPlus size={18} strokeWidth={2.5} />
        </button>

        <button
          className="w-9 h-9 rounded-full bg-gradient-to-br from-green-accent to-cyan-400 flex items-center justify-center cursor-pointer shrink-0"
          aria-label="Profile"
        >
          <span className="text-dark-900 font-bold text-sm">U</span>
        </button>

        <button
          className="relative w-9 h-9 rounded-full bg-dark-700 border border-dark-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-accent rounded-full" />
        </button>
      </div>

      <div className="order-2 md:order-1 md:flex-1 md:min-w-0 md:max-w-xl mt-2 md:mt-0">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search users, tribes & niches..."
            className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50 transition-colors"
          />
        </div>
      </div>
    </header>
  )
}
