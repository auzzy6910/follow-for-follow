import { Search, Bell, Menu } from 'lucide-react'
import { USER_STATS } from '../data/mockData'

export default function Header({ onMenuToggle }) {
  return (
    <header className="h-14 md:h-16 bg-dark-800 border-b border-dark-600 flex items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-3 md:gap-4 shrink-0">
      <button onClick={onMenuToggle} className="hidden md:block lg:hidden text-gray-400 hover:text-white">
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-2 md:hidden shrink-0">
        <img src="/logo.png" alt="Follow for Follow" className="w-8 h-8 rounded-lg object-cover" />
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">Follow</h1>
          <p className="text-green-accent text-[10px] font-medium leading-tight">for Follow</p>
        </div>
      </div>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 md:w-[18px] md:h-[18px]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <span className="text-green-accent text-sm font-semibold">{USER_STATS.totalCredits.toLocaleString()}</span>
          <span className="text-gray-500 text-xs">credits</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-dark-700 px-3 py-1.5 rounded-lg border border-dark-500">
          <div className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
          <span className="text-gray-300 text-xs">Day {USER_STATS.streak} Streak</span>
        </div>

        <button className="relative p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={18} className="md:w-5 md:h-5" />
          <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2 h-2 bg-green-accent rounded-full" />
        </button>

        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-green-accent to-cyan-400 flex items-center justify-center cursor-pointer shrink-0">
          <span className="text-dark-900 font-bold text-xs md:text-sm">U</span>
        </div>
      </div>
    </header>
  )
}
