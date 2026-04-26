import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Compass, Coins,
  Users, Settings
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/credits', label: 'Credits', icon: Coins },
  { path: '/tribes', label: 'Tribes', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600 z-50 safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1.5 transition-colors ${
                isActive
                  ? 'text-green-accent'
                  : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
