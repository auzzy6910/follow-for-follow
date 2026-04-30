import { useMemo, useState } from 'react'
import { Sparkles, UserPlus, X, Check } from 'lucide-react'
import { useUsers } from '../hooks/useAppData'

const PLATFORMS = [
  { id: 'all', label: 'All Platforms' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'threads', label: 'Threads' },
]

const FOLLOW_BACK_REWARD = 50
const FOLLOW_BACK_GOAL = 5

function ProgressRing({ progress, goal, src, alt, complete }) {
  const size = 64
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = Math.min(1, progress / goal)
  const dash = circumference * ratio

  return (
    <div
      className={`relative shrink-0 ${complete ? '' : 'follow-back-pulse'}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(175,16,26,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#fb-progress-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <defs>
          <linearGradient id="fb-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#af101a" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="absolute inset-1.5 rounded-full overflow-hidden bg-white"
        aria-hidden={!alt}
      >
        {src ? (
          <img src={src} alt={alt ?? ''} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#fff2f0] text-[#af101a]">
            <UserPlus size={22} />
          </div>
        )}
      </div>
      <span
        className={`absolute -bottom-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-white ${
          complete ? 'bg-emerald-500 text-white' : 'bg-[#af101a] text-white'
        }`}
        aria-label={`Follow-back progress ${progress} of ${goal}`}
      >
        {complete ? <Check size={12} /> : `${progress}/${goal}`}
      </span>
    </div>
  )
}

function FollowBackPulseCard({ queue, completed, onFollow, onDismiss }) {
  const current = queue[0]
  const complete = !current

  return (
    <div className="sticky top-3 z-30">
      <div className="relative rounded-2xl bg-white/95 backdrop-blur border border-[#af101a]/15 shadow-[0_10px_30px_-12px_rgba(175,16,26,0.35)] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-[#af101a] to-[#f97316]"
        />

        <ProgressRing
          progress={completed}
          goal={FOLLOW_BACK_GOAL}
          src={current?.avatar}
          alt={current ? `@${current.username}` : 'Follow-back goal complete'}
          complete={complete}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold text-[#af101a]">
            <Sparkles size={12} className="shrink-0" />
            <span>{complete ? 'Daily goal complete' : 'New follower'}</span>
          </div>
          {complete ? (
            <p className="text-gray-900 font-semibold text-sm sm:text-base leading-snug truncate">
              You earned {FOLLOW_BACK_REWARD * FOLLOW_BACK_GOAL} cr — nice streak!
            </p>
          ) : (
            <p className="text-gray-900 font-semibold text-sm sm:text-base leading-snug truncate">
              <span className="text-[#af101a]">@{current.username}</span>{' '}
              <span className="font-normal text-gray-700">followed you</span>
            </p>
          )}
          <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
            {complete
              ? 'Come back tomorrow for a fresh follow-back streak.'
              : `Follow back to fill your ring · +${FOLLOW_BACK_REWARD} cr each`}
          </p>
        </div>

        {!complete && (
          <button
            type="button"
            onClick={onFollow}
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#af101a] hover:bg-[#931017] text-white font-semibold text-xs sm:text-sm rounded-full px-3 sm:px-4 py-2 transition-colors shadow-sm"
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Follow back</span>
            <span className="sm:hidden">Follow</span>
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss follow-back prompt"
          className="shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default function FollowBackPlatformBanner() {
  const users = useUsers()
  const [activePlatform, setActivePlatform] = useState('all')
  const [completed, setCompleted] = useState(0)
  const [skipped, setSkipped] = useState({})
  const [dismissed, setDismissed] = useState(false)

  const queue = useMemo(() => {
    if (!users?.length) return []
    return users
      .slice(0, FOLLOW_BACK_GOAL)
      .filter(u => !skipped[u.id])
  }, [users, skipped])

  const handleFollow = () => {
    const next = queue[0]
    if (!next) return
    setCompleted(c => Math.min(FOLLOW_BACK_GOAL, c + 1))
    setSkipped(s => ({ ...s, [next.id]: true }))
  }

  return (
    <div className="space-y-5">
      {!dismissed && (
        <FollowBackPulseCard
          queue={queue}
          completed={completed}
          onFollow={handleFollow}
          onDismiss={() => setDismissed(true)}
        />
      )}

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {PLATFORMS.map(p => {
          const active = activePlatform === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePlatform(p.id)}
              className={`shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold border transition-colors ${
                active
                  ? 'bg-[#af101a] text-white border-[#af101a]'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
