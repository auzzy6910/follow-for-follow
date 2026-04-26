import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  Coins,
  Clock,
  Sparkles,
  Users,
  Trophy,
  Shield,
} from 'lucide-react'

const items = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/credits', label: 'Credits', icon: Coins },
  { path: '/golden-hour', label: 'Boost', icon: Clock },
  { path: '/quality', label: 'Quality', icon: Sparkles },
  { path: '/tribes', label: 'Tribes', icon: Users },
  { path: '/gamification', label: 'Ranks', icon: Trophy },
  { path: '/safety', label: 'Safety', icon: Shield },
]

export default function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-800/95 backdrop-blur border-t border-dark-600"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex overflow-x-auto no-scrollbar">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex-1 min-w-[64px] flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors ${
                isActive
                  ? 'text-green-accent'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={isActive ? 'drop-shadow-[0_0_6px_var(--color-green-glow)]' : ''} />
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
