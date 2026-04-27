import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  UserPlus,
  Coins,
  AlertTriangle,
  Trophy,
  Check,
  Trash2,
  X,
} from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const TYPE_META = {
  follow_back: {
    icon: UserPlus,
    color: 'text-green-accent',
    bg: 'bg-green-accent/10',
  },
  escrow: {
    icon: Coins,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  penalty: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  quest: {
    icon: Trophy,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
}

function formatRelative(timestamp) {
  const diff = Date.now() - timestamp
  if (diff < 60 * 1000) return 'just now'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / (24 * 3600000))}d ago`
}

export default function NotificationCenter() {
  const {
    inboxNotifications,
    notificationCenterOpen,
    setNotificationCenterOpen,
    markInboxRead,
    markAllInboxRead,
    clearInbox,
  } = useAppContext()
  const navigate = useNavigate()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!notificationCenterOpen) return undefined
    const handler = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotificationCenterOpen(false)
      }
    }
    // Defer so the button click that opened the panel doesn't immediately close it.
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [notificationCenterOpen, setNotificationCenterOpen])

  if (!notificationCenterOpen) return null

  const unreadCount = inboxNotifications.filter(n => !n.read).length

  const handleOpen = notification => {
    markInboxRead(notification.id)
    if (notification.link) {
      navigate(notification.link)
    }
    setNotificationCenterOpen(false)
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-1rem)] bg-dark-800 border border-dark-500 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-green-accent" />
          <h3 className="text-white font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold text-dark-900 bg-green-accent px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setNotificationCenterOpen(false)}
          aria-label="Close notifications"
          className="text-gray-500 hover:text-white p-1 -m-1"
        >
          <X size={16} />
        </button>
      </div>

      <div className="max-h-[26rem] overflow-y-auto">
        {inboxNotifications.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Bell size={28} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">You're all caught up.</p>
          </div>
        ) : (
          <ul className="divide-y divide-dark-600">
            {inboxNotifications.map(n => {
              const meta = TYPE_META[n.type] || TYPE_META.escrow
              const Icon = meta.icon
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(n)}
                    className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-dark-700 transition-colors ${
                      n.read ? '' : 'bg-dark-700/40'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={16} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm truncate ${
                            n.read ? 'text-gray-300' : 'text-white font-semibold'
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-green-accent mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-gray-600 text-[10px] mt-1 uppercase tracking-wide">
                        {formatRelative(n.createdAt)}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {inboxNotifications.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-dark-600 bg-dark-900/50">
          <button
            type="button"
            onClick={markAllInboxRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-green-accent disabled:opacity-40 disabled:hover:text-gray-300"
          >
            <Check size={12} /> Mark all read
          </button>
          <button
            type="button"
            onClick={clearInbox}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400"
          >
            <Trash2 size={12} /> Clear all
          </button>
        </div>
      )}
    </div>
  )
}
