import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  Coins,
  Clock,
  Users,
} from 'lucide-react'

const items = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/credits', label: 'Credits', icon: Coins },
  { path: '/golden-hour', label: 'Boost', icon: Clock },
  { path: '/tribes', label: 'Tribes', icon: Users },
]

export default function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-800/95 backdrop-blur border-t border-dark-600"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex w-full">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex-1 basis-0 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 transition-colors ${
                isActive
                  ? 'text-green-accent'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'drop-shadow-[0_0_6px_var(--color-green-glow)]' : ''} />
                <span className="text-[9px] xs:text-[10px] font-medium leading-none truncate max-w-full">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
