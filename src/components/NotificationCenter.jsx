import { useState, useRef, useEffect } from 'react'
import { Bell, UserPlus, Coins, AlertTriangle, Trophy, CheckCheck, X } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const TYPE_CONFIG = {
  follow_back: { icon: UserPlus, color: 'text-green-accent', bg: 'bg-green-accent/10' },
  escrow: { icon: Coins, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  penalty: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
  quest: { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' },
}

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationCenter() {
  const { globalNotifications, dispatch } = useAppContext()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  const unreadCount = globalNotifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleMarkAllRead = () => {
    dispatch({ type: 'READ_ALL_GLOBAL_NOTIFICATIONS' })
  }

  const handleClick = (notifId) => {
    dispatch({ type: 'READ_GLOBAL_NOTIFICATION', notifId })
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-full bg-dark-700 border border-dark-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-green-accent text-dark-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-green-accent text-xs hover:underline"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-white p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {globalNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              globalNotifications.map(notif => {
                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.quest
                const Icon = config.icon
                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => handleClick(notif.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-dark-700 transition-colors border-b border-dark-600/50 last:border-0 ${
                      !notif.read ? 'bg-dark-750' : ''
                    }`}
                  >
                    {notif.avatar ? (
                      <img src={notif.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                        <Icon size={16} className={config.color} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-green-accent rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-gray-600 text-[10px] mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
