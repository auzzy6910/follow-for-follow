import { useEffect, useMemo, useState } from 'react'
import { Clock, Shield, Eye, EyeOff, Bookmark, Trash2, Play } from 'lucide-react'
import {
  useUsers,
  useUserStats,
  useQuests,
  useSavedSearches,
  useDeleteSearch,
} from '../hooks/useAppData'
import { Link, useNavigate } from 'react-router-dom'
import UserCard from '../components/UserCard'
import FollowBackPlatformBanner from '../components/FollowBackPlatformBanner'
import { useAppContext } from '../context/useAppContext'

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  threads: 'Threads',
}
const PLATFORM_ORDER = ['instagram', 'twitter', 'tiktok', 'youtube', 'linkedin', 'threads']

function formatCooldownRemaining(cooldownUntil) {
  if (!cooldownUntil) return null
  const remainingMs = Math.max(0, cooldownUntil - Date.now())
  const totalSeconds = Math.ceil(remainingMs / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function CooldownStatus() {
  const { userStats, startCooldown } = useAppContext()
  const remaining = userStats.cooldownActive
    ? formatCooldownRemaining(userStats.cooldownUntil)
    : null

  if (remaining) {
    return (
      <div className="flex items-center justify-between bg-amber-400/10 border border-amber-400/30 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-amber-400 animate-pulse" />
          <span className="text-amber-400 text-sm font-medium">Cooldown</span>
        </div>
        <span
          className="text-amber-400 text-sm font-mono font-semibold tabular-nums"
          aria-live="polite"
        >
          {remaining}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-dark-700 rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-gray-400" />
        <span className="text-gray-700 text-sm">Cooldown</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-blue-accent text-sm font-medium">Inactive</span>
        <button
          type="button"
          onClick={() => startCooldown(90)}
          className="flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-1 rounded-md bg-dark-600 text-gray-700 hover:text-blue-accent hover:bg-dark-500 transition-colors"
          aria-label="Start a 90-second cooldown"
        >
          <Play size={10} /> Test
        </button>
      </div>
    </div>
  )
}

function MobileVisibilityToggle({ visible, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={!visible}
      className="md:hidden text-gray-400 hover:text-gray-900 p-1 -m-1 shrink-0"
    >
      {visible ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  )
}

function SpotlightUsers({ activePlatform = 'all' }) {
  const USERS = useUsers()
  const spotlightUsers = useMemo(() => {
    if (activePlatform === 'all') return USERS
    return USERS.filter(u => u.platform === activePlatform)
  }, [USERS, activePlatform])
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 font-semibold text-lg">Spotlight Users</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {spotlightUsers.map(user => (
          <Link
            key={user.id}
            to={`/profile/${user.id}`}
            aria-label={`Open ${user.displayName}'s profile`}
            className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-accent/50 rounded-xl px-1 py-1"
          >
            <div className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${user.tier === 'legend' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : user.tier === 'influencer' ? 'bg-gradient-to-br from-blue-accent to-cyan-400' : 'bg-dark-500'}`}>
              <img src={user.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-dark-900" />
            </div>
            <p className="text-gray-700 text-xs font-medium truncate w-16 text-center group-hover:text-gray-900">@{user.username.slice(0, 8)}</p>
            <span className="text-blue-accent text-xs">{user.credits} cr</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ActiveQuests() {
  const QUESTS = useQuests()
  const [visible, setVisible] = useState(true)
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 font-semibold">Daily Quests</h3>
        <div className="flex items-center gap-3">
          <MobileVisibilityToggle visible={visible} onToggle={() => setVisible(v => !v)} label="daily quests" />
        </div>
      </div>
      <div className={`space-y-3 ${visible ? 'block' : 'hidden md:block'}`}>
        {QUESTS.filter(q => q.type === 'daily').slice(0, 3).map(quest => (
          <div key={quest.id} className="bg-dark-700 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-800 text-sm font-medium">{quest.title}</p>
              <span className="text-amber-400 text-xs font-semibold">+{quest.reward} cr</span>
            </div>
            <div className="w-full bg-dark-500 rounded-full h-1.5">
              <div className="progress-bar h-1.5" style={{ width: `${(quest.progress / quest.total) * 100}%` }} />
            </div>
            <p className="text-gray-500 text-xs mt-1">{quest.progress}/{quest.total} completed</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SavedSearches() {
  const searches = useSavedSearches()
  const deleteSearch = useDeleteSearch()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(true)

  if (searches.length === 0) return null

  const handleApply = (s) => {
    const params = new URLSearchParams()
    if (s.niche) params.set('niche', s.niche)
    if (s.platform) params.set('platform', s.platform)
    if (s.tier) params.set('tier', s.tier)
    if (s.location) params.set('location', s.location)
    if (s.searchQuery) params.set('q', s.searchQuery)
    navigate(`/explore?${params.toString()}`)
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark size={18} className="text-blue-accent" />
          <h3 className="text-gray-900 font-semibold">Saved Searches</h3>
        </div>
        <MobileVisibilityToggle visible={visible} onToggle={() => setVisible(v => !v)} label="saved searches" />
      </div>
      <div className={`space-y-2 ${visible ? 'block' : 'hidden md:block'}`}>
        {searches.map(s => (
          <div
            key={s._id}
            className="flex items-center justify-between bg-dark-700 rounded-xl px-4 py-3 hover:border-blue-accent/30 border border-transparent transition-colors cursor-pointer group"
            onClick={() => handleApply(s)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm font-medium truncate">{s.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {new Date(s.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={e => {
                e.stopPropagation()
                deleteSearch({ id: s._id })
              }}
              className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserCards({ activePlatform = 'all' }) {
  const USERS = useUsers()

  const grouped = useMemo(() => {
    const groups = new Map()
    for (const platformId of PLATFORM_ORDER) {
      groups.set(platformId, [])
    }
    for (const user of USERS) {
      if (!groups.has(user.platform)) groups.set(user.platform, [])
      groups.get(user.platform).push(user)
    }
    return groups
  }, [USERS])

  if (activePlatform !== 'all') {
    const platformUsers = grouped.get(activePlatform) ?? []
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 font-semibold text-lg">
            Recommended on {PLATFORM_LABELS[activePlatform] ?? 'this platform'}
          </h3>
        </div>
        {platformUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No creators yet for this platform. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {platformUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900 font-semibold text-lg">Recommended For You</h3>
      </div>
      {PLATFORM_ORDER.map(platformId => {
        const platformUsers = grouped.get(platformId) ?? []
        if (platformUsers.length === 0) return null
        return (
          <section key={platformId} aria-label={`${PLATFORM_LABELS[platformId]} creators`}>
            <h4 className="text-gray-700 font-semibold text-sm uppercase tracking-wide mb-3">
              {PLATFORM_LABELS[platformId]}
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {platformUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const USER_STATS = useUserStats()
  const [activePlatform, setActivePlatform] = useState('all')
  const {
    warmingWizardDismissed,
    warmingPlan,
    warmingWizardOpen,
    userStats: liveStats,
    openWarmingWizard,
  } = useAppContext()

  useEffect(() => {
    if (
      !warmingWizardDismissed &&
      !warmingWizardOpen &&
      !warmingPlan &&
      liveStats.accountAge <= 14
    ) {
      openWarmingWizard()
    }
  }, [
    warmingWizardDismissed,
    warmingWizardOpen,
    warmingPlan,
    liveStats.accountAge,
    openWarmingWizard,
  ])

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      <FollowBackPlatformBanner
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
      />

      <SpotlightUsers activePlatform={activePlatform} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <SavedSearches />
      </div>

      <UserCards activePlatform={activePlatform} />

      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ActiveQuests />
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <h3 className="text-gray-900 font-semibold mb-4">Safety Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-700 text-sm">Daily Follow Limit</span>
                <span className="text-blue-accent text-sm font-medium">{USER_STATS.dailyFollowsRemaining}/{USER_STATS.dailyFollowLimit}</span>
              </div>
              <div className="w-full bg-dark-500 rounded-full h-2">
                <div className="progress-bar h-2" style={{ width: `${(USER_STATS.dailyFollowsRemaining / USER_STATS.dailyFollowLimit) * 100}%` }} />
              </div>
            </div>
            <CooldownStatus />
            <div className="flex items-center justify-between bg-dark-700 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gray-400" />
                <span className="text-gray-700 text-sm">Unfollow Rate</span>
              </div>
              <span className="text-blue-accent text-sm font-medium">{USER_STATS.unfollowRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
