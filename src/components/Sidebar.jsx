import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Compass, Coins, Clock, ShieldCheck,
  Users, Trophy, Shield, Settings, Wallet, LogOut, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react'

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

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <aside className={`${isOpen ? 'w-60' : 'w-20'} bg-dark-800 border-r border-dark-600 flex flex-col transition-all duration-300 shrink-0`}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-dark-600">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-accent to-cyan-400 flex items-center justify-center shrink-0">
          <span className="text-dark-900 font-bold text-lg">F</span>
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight whitespace-nowrap">Follow</h1>
            <p className="text-green-accent text-xs font-medium leading-tight whitespace-nowrap">for Follow</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-gray-400 hover:text-white transition-colors p-1"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-green-accent/10 text-green-accent'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {isOpen && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="py-4 px-3 space-y-1 border-t border-dark-600">
        {bottomItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-green-accent/10 text-green-accent'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {isOpen && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 w-full">
          <LogOut size={20} className="shrink-0" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
