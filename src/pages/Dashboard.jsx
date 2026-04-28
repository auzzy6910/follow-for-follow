import { useEffect, useState } from 'react'
import { Users, Coins, Flame, ArrowUpRight, ArrowDownRight, Clock, Star, Shield, ChevronRight, Eye, EyeOff, Bookmark, Trash2, Sparkles, Play, Gift } from 'lucide-react'
import {
  useFeaturedUser,
  useUsers,
  useTribes,
  useUserStats,
  useLeaderboard,
  useQuests,
  useSavedSearches,
  useDeleteSearch,
  useRecommendations,
} from '../hooks/useAppData'
import { Link, useNavigate } from 'react-router-dom'
import UserCard from '../components/UserCard'
import { useAppContext } from '../context/useAppContext'

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
        <span className="text-gray-300 text-sm">Cooldown</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-accent text-sm font-medium">Inactive</span>
        <button
          type="button"
          onClick={() => startCooldown(90)}
          className="flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-1 rounded-md bg-dark-600 text-gray-300 hover:text-green-accent hover:bg-dark-500 transition-colors"
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
      className="md:hidden text-gray-400 hover:text-white p-1 -m-1 shrink-0"
    >
      {visible ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  )
}

function StatCard({ icon: Icon, label, value, change, positive, to }) {
  const inner = (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5 card-hover h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-green-accent/10 flex items-center justify-center">
          <Icon size={20} className="text-green-accent" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{label}</p>
    </div>
  )
  if (!to) return inner
  return (
    <Link
      to={to}
      aria-label={`${label} — view more`}
      className="block focus:outline-none focus:ring-2 focus:ring-green-accent/50 rounded-2xl"
    >
      {inner}
    </Link>
  )
}

function FeaturedHero() {
  const FEATURED_USER = useFeaturedUser()
  return (
    <div className="relative rounded-2xl overflow-hidden bg-dark-800 border border-dark-600">
      <img src={FEATURED_USER.cover} alt="" className="w-full h-48 sm:h-72 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <div className="flex items-end gap-3 sm:gap-4">
          <img
            src={FEATURED_USER.avatar}
            alt={FEATURED_USER.displayName}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-2 border-green-accent object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] sm:text-xs font-semibold text-dark-900 bg-green-accent px-2 py-0.5 rounded-full">FEATURED</span>
              <span className="text-[10px] sm:text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star size={10} /> Legend
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white truncate">{FEATURED_USER.displayName}</h2>
            <p className="text-gray-400 text-xs sm:text-sm truncate">@{FEATURED_USER.username}</p>
            <p className="hidden sm:block text-gray-300 text-sm mt-1 line-clamp-1">{FEATURED_USER.bio}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg sm:text-2xl font-bold text-white">{(FEATURED_USER.followers / 1000).toFixed(1)}K</p>
            <p className="text-gray-400 text-xs sm:text-sm">followers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopGainers() {
  const LEADERBOARD = useLeaderboard()
  const [visible, setVisible] = useState(false)
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Top Gainers</h3>
        <MobileVisibilityToggle visible={visible} onToggle={() => setVisible(v => !v)} label="top gainers" />
      </div>
      <div className={`space-y-3 ${visible ? 'block' : 'hidden md:block'}`}>
        {LEADERBOARD.slice(0, 5).map((user, i) => (
          <div key={user.id} className="flex items-center gap-3">
            <span className="text-gray-500 text-sm font-medium w-5">{i + 1}</span>
            <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.displayName}</p>
              <p className="text-gray-500 text-xs">@{user.username}</p>
            </div>
            <div className="text-right">
              <p className="text-green-accent text-sm font-semibold">+{user.weeklyFollowers.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">this week</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpotlightUsers() {
  const USERS = useUsers()
  const spotlightUsers = USERS.slice(0, 8)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Spotlight Users</h3>
        <Link to="/explore" className="text-green-accent text-sm hover:underline hidden md:flex items-center gap-1">
          See All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {spotlightUsers.map(user => (
          <Link
            key={user.id}
            to={`/profile/${user.id}`}
            aria-label={`Open ${user.displayName}'s profile`}
            className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-green-accent/50 rounded-xl px-1 py-1"
          >
            <div className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${user.tier === 'legend' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : user.tier === 'influencer' ? 'bg-gradient-to-br from-green-accent to-cyan-400' : 'bg-dark-500'}`}>
              <img src={user.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-dark-900" />
            </div>
            <p className="text-gray-300 text-xs font-medium truncate w-16 text-center group-hover:text-white">@{user.username.slice(0, 8)}</p>
            <span className="text-green-accent text-xs">{user.credits} cr</span>
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
        <h3 className="text-white font-semibold">Daily Quests</h3>
        <div className="flex items-center gap-3">
          <Link to="/gamification" className="text-green-accent text-xs hover:underline">View All</Link>
          <MobileVisibilityToggle visible={visible} onToggle={() => setVisible(v => !v)} label="daily quests" />
        </div>
      </div>
      <div className={`space-y-3 ${visible ? 'block' : 'hidden md:block'}`}>
        {QUESTS.filter(q => q.type === 'daily').slice(0, 3).map(quest => (
          <div key={quest.id} className="bg-dark-700 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-200 text-sm font-medium">{quest.title}</p>
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

function TrendingTribes() {
  const TRIBES = useTribes()
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Trending Tribes</h3>
        <MobileVisibilityToggle visible={visible} onToggle={() => setVisible(v => !v)} label="trending tribes" />
      </div>
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 ${visible ? '' : 'hidden md:grid'}`}>
        {TRIBES.slice(0, 5).map(tribe => (
          <div key={tribe.id} className="bg-dark-800 border border-dark-600 rounded-xl p-4 card-hover cursor-pointer text-center">
            <div className="text-3xl mb-2">{tribe.icon}</div>
            <p className="text-white text-sm font-medium">{tribe.name}</p>
            <p className="text-gray-500 text-xs mt-1">{tribe.members.toLocaleString()} members</p>
            <p className="text-green-accent text-xs mt-1">+{tribe.weeklyGrowth}% this week</p>
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
          <Bookmark size={18} className="text-green-accent" />
          <h3 className="text-white font-semibold">Saved Searches</h3>
        </div>
        <MobileVisibilityToggle visible={visible} onToggle={() => setVisible(v => !v)} label="saved searches" />
      </div>
      <div className={`space-y-2 ${visible ? 'block' : 'hidden md:block'}`}>
        {searches.map(s => (
          <div
            key={s._id}
            className="flex items-center justify-between bg-dark-700 rounded-xl px-4 py-3 hover:border-green-accent/30 border border-transparent transition-colors cursor-pointer group"
            onClick={() => handleApply(s)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm font-medium truncate">{s.name}</p>
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

function Recommendations() {
  const recs = useRecommendations()
  const [visible, setVisible] = useState(true)

  if (recs.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-green-accent" />
          <h3 className="text-white font-semibold text-lg">People Like You</h3>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/explore" className="text-green-accent text-sm hover:underline hidden md:flex items-center gap-1">
            Explore More <ChevronRight size={16} />
          </Link>
          <MobileVisibilityToggle visible={visible} onToggle={() => setVisible(v => !v)} label="recommendations" />
        </div>
      </div>
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 ${visible ? '' : 'hidden md:grid'}`}>
        {recs.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

function UserCards() {
  const USERS = useUsers()
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Recommended For You</h3>
        <Link to="/explore" className="text-green-accent text-sm hover:underline hidden md:flex items-center gap-1">
          See All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {USERS.slice(0, 8).map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const USER_STATS = useUserStats()
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
      <div className="hidden md:grid md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Gift}
          label="Earn"
          value={USER_STATS.dailyFollowsRemaining}
          change="Find accounts"
          positive
          to="/explore"
        />
        <StatCard
          icon={Users}
          label="Followers Gained"
          value={USER_STATS.totalFollowersGained.toLocaleString()}
          change="+12.5%"
          positive
          to="/gamification"
        />
        <StatCard
          icon={Coins}
          label="Credits Balance"
          value={USER_STATS.totalCredits.toLocaleString()}
          change="+340"
          positive
          to="/credits"
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={USER_STATS.streak}
          change="+1"
          positive
          to="/gamification"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <FeaturedHero />
        </div>
        <div className="hidden md:block">
          <TopGainers />
        </div>
      </div>

      <SpotlightUsers />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Recommendations />
        </div>
        <SavedSearches />
      </div>

      <TrendingTribes />
      <UserCards />

      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ActiveQuests />
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Safety Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-sm">Daily Follow Limit</span>
                <span className="text-green-accent text-sm font-medium">{USER_STATS.dailyFollowsRemaining}/{USER_STATS.dailyFollowLimit}</span>
              </div>
              <div className="w-full bg-dark-500 rounded-full h-2">
                <div className="progress-bar h-2" style={{ width: `${(USER_STATS.dailyFollowsRemaining / USER_STATS.dailyFollowLimit) * 100}%` }} />
              </div>
            </div>
            <CooldownStatus />
            <div className="flex items-center justify-between bg-dark-700 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">Unfollow Rate</span>
              </div>
              <span className="text-green-accent text-sm font-medium">{USER_STATS.unfollowRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
