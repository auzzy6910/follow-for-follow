import { useEffect } from 'react'
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const VARIANTS = {
  success: {
    icon: CheckCircle,
    bg: 'bg-blue-accent/10 border-blue-accent/30',
    text: 'text-blue-accent',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-400/10 border-red-400/30',
    text: 'text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-400/10 border-amber-400/30',
    text: 'text-amber-400',
  },
  info: {
    icon: Info,
    bg: 'bg-cyan-400/10 border-cyan-400/30',
    text: 'text-cyan-400',
  },
}

function Toast({ notification }) {
  const { dispatch } = useAppContext()
  const variant = VARIANTS[notification.variant] || VARIANTS.info
  const Icon = variant.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_NOTIFICATION', id: notification.id })
    }, 5000)
    return () => clearTimeout(timer)
  }, [notification.id, dispatch])

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${variant.bg} shadow-lg backdrop-blur-sm animate-slide-in max-w-sm w-full`}
    >
      <Icon size={18} className={`${variant.text} shrink-0 mt-0.5`} />
      <p className="text-sm text-gray-200 flex-1">{notification.message}</p>
      <button
        onClick={() =>
          dispatch({ type: 'DISMISS_NOTIFICATION', id: notification.id })
        }
        className="text-gray-500 hover:text-white shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { notifications } = useAppContext()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-auto">
      {notifications.slice(0, 5).map(n => (
        <Toast key={n.id} notification={n} />
      ))}
    </div>
  )
}
