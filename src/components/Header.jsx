import { Search, Bell, Menu } from 'lucide-react'
import { useUserStats } from '../hooks/useAppData'

export default function Header({ onMenuToggle }) {
  const USER_STATS = useUserStats()
  return (
    <header className="h-16 bg-dark-800 border-b border-dark-600 flex items-center px-6 gap-4 shrink-0">
      <button onClick={onMenuToggle} className="lg:hidden text-gray-400 hover:text-white">
        <Menu size={22} />
      </button>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search users, tribes & niches..."
            className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <span className="text-green-accent text-sm font-semibold">{USER_STATS.totalCredits.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">credits</span>
        </div>

        <div className="flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <div className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
          <span className="text-gray-300 text-xs">Day {USER_STATS.streak} Streak</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-accent rounded-full" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-accent to-cyan-400 flex items-center justify-center cursor-pointer">
          <span className="text-dark-900 font-bold text-sm">U</span>
        </div>
      </div>
    </header>
  )
}
