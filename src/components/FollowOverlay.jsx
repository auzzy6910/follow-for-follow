import { Clock, X, ExternalLink } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

export default function FollowOverlay() {
  const { activeFollows, cancelFollow, settings } = useAppContext()
  const entries = Object.values(activeFollows)

  if (entries.length === 0) return null

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-[90] flex flex-col gap-2 w-[90vw] max-w-md pointer-events-auto">
      {entries.map(follow => {
        const pct =
          follow.dwellRequired > 0
            ? Math.min((follow.dwellElapsed / follow.dwellRequired) * 100, 100)
            : 100
        const remaining = Math.max(follow.dwellRequired - follow.dwellElapsed, 0)

        return (
          <div
            key={follow.userId}
            className="bg-dark-800 border border-blue-accent/30 rounded-2xl p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-accent" />
                <span className="text-gray-900 text-sm font-medium">
                  Verifying @{follow.username}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={follow.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => cancelFollow(follow.userId)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {settings.dwellTimeEnabled && follow.dwellRequired > 0 && (
              <>
                <div className="w-full bg-dark-600 rounded-full h-1.5 mb-1.5">
                  <div
                    className="progress-bar h-1.5 transition-[width] duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Dwell time: {follow.dwellElapsed}s / {follow.dwellRequired}s
                  </span>
                  {remaining > 0 ? (
                    <span>{remaining}s remaining</span>
                  ) : (
                    <span className="text-blue-accent">Completing…</span>
                  )}
                </div>
              </>
            )}

            {!settings.dwellTimeEnabled && (
              <p className="text-xs text-gray-400">
                Verifying follow… {follow.creditCost} cr will be placed in
                escrow.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
