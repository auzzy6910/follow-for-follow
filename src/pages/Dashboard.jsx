import { TrendingUp, Users, Coins, Flame, ArrowUpRight, ArrowDownRight, Clock, Star, Shield, ChevronRight } from 'lucide-react'
import { FEATURED_USER, USERS, TRIBES, USER_STATS, LEADERBOARD, QUESTS } from '../data/mockData'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, change, positive }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 card-hover">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-accent/10 flex items-center justify-center">
          <Icon size={16} className="text-green-accent sm:w-5 sm:h-5" />
        </div>
        <span className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </div>
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-[11px] sm:text-sm mt-0.5 sm:mt-1">{label}</p>
    </div>
  )
}

function FeaturedHero() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-dark-800 border border-dark-600">
      <img src={FEATURED_USER.cover} alt="" className="w-full h-40 sm:h-56 md:h-72 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
        <div className="flex items-end gap-3 sm:gap-4">
          <img
            src={FEATURED_USER.avatar}
            alt={FEATURED_USER.displayName}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl border-2 border-green-accent object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <span className="text-[10px] sm:text-xs font-semibold text-dark-900 bg-green-accent px-1.5 sm:px-2 py-0.5 rounded-full">FEATURED</span>
              <span className="text-[10px] sm:text-xs font-medium text-amber-400 bg-amber-400/10 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star size={10} /> Legend
              </span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">{FEATURED_USER.displayName}</h2>
            <p className="text-gray-400 text-xs sm:text-sm">@{FEATURED_USER.username}</p>
            <p className="text-gray-300 text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-1 hidden sm:block">{FEATURED_USER.bio}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{(FEATURED_USER.followers / 1000).toFixed(1)}K</p>
            <p className="text-gray-400 text-[11px] sm:text-sm">followers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopGainers() {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-white font-semibold text-sm sm:text-base">Top Gainers</h3>
        <Link to="/gamification" className="text-green-accent text-xs hover:underline">View All</Link>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {LEADERBOARD.slice(0, 5).map((user, i) => (
          <div key={user.id} className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-gray-500 text-xs sm:text-sm font-medium w-4 sm:w-5">{i + 1}</span>
            <img src={user.avatar} alt="" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs sm:text-sm font-medium truncate">{user.displayName}</p>
              <p className="text-gray-500 text-[10px] sm:text-xs">@{user.username}</p>
            </div>
            <div className="text-right">
              <p className="text-green-accent text-xs sm:text-sm font-semibold">+{user.weeklyFollowers.toLocaleString()}</p>
              <p className="text-gray-500 text-[10px] sm:text-xs">this week</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpotlightUsers() {
  const spotlightUsers = USERS.slice(0, 8)
  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">Spotlight Creators</h3>
        <Link to="/explore" className="text-green-accent text-xs sm:text-sm hover:underline flex items-center gap-1">
          See All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {spotlightUsers.map(user => (
          <div key={user.id} className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0">
            <div className={`p-0.5 rounded-full ${user.tier === 'legend' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : user.tier === 'influencer' ? 'bg-gradient-to-br from-green-accent to-cyan-400' : 'bg-dark-500'}`}>
              <img src={user.avatar} alt="" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-dark-900" />
            </div>
            <p className="text-gray-300 text-[10px] sm:text-xs font-medium truncate w-14 sm:w-16 text-center">@{user.username.slice(0, 8)}</p>
            <span className="text-green-accent text-xs">{user.credits} cr</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActiveQuests() {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-white font-semibold text-sm sm:text-base">Daily Quests</h3>
        <Link to="/gamification" className="text-green-accent text-xs hover:underline">View All</Link>
      </div>
      <div className="space-y-3">
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
  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">Trending Tribes</h3>
        <Link to="/tribes" className="text-green-accent text-xs sm:text-sm hover:underline flex items-center gap-1">
          See All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-3 md:overflow-visible md:pb-0">
        {TRIBES.slice(0, 5).map(tribe => (
          <div key={tribe.id} className="bg-dark-800 border border-dark-600 rounded-xl p-3 sm:p-4 card-hover cursor-pointer text-center shrink-0 w-32 sm:w-36 md:w-auto">
            <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{tribe.icon}</div>
            <p className="text-white text-xs sm:text-sm font-medium">{tribe.name}</p>
            <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{tribe.members.toLocaleString()} members</p>
            <p className="text-green-accent text-[10px] sm:text-xs mt-0.5 sm:mt-1">+{tribe.weeklyGrowth}% this week</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">Recommended For You</h3>
        <Link to="/explore" className="text-green-accent text-xs sm:text-sm hover:underline flex items-center gap-1">
          See All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {USERS.slice(0, 8).map(user => (
          <div key={user.id} className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl overflow-hidden card-hover">
            <div className="relative h-20 sm:h-28">
              <img src={user.cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
            </div>
            <div className="px-3 pb-3 sm:px-4 sm:pb-4 -mt-6 sm:-mt-8 relative">
              <img src={user.avatar} alt="" className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-dark-800 object-cover mb-1.5 sm:mb-2" />
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                <h4 className="text-white text-xs sm:text-sm font-semibold truncate">{user.displayName}</h4>
                {user.isVerified && <Shield size={10} className="text-green-accent shrink-0 sm:w-3 sm:h-3" />}
              </div>
              <p className="text-gray-500 text-[10px] sm:text-xs mb-1.5 sm:mb-2">@{user.username}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-[10px] sm:text-xs">{(user.followers / 1000).toFixed(1)}K</span>
                <button className="text-[10px] sm:text-xs font-semibold bg-green-accent/10 text-green-accent px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg hover:bg-green-accent/20 transition-colors">
                  Follow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
        <StatCard icon={Users} label="Followers Gained" value={USER_STATS.totalFollowersGained.toLocaleString()} change="+12.5%" positive />
        <StatCard icon={Coins} label="Credits Balance" value={USER_STATS.totalCredits.toLocaleString()} change="+340" positive />
        <StatCard icon={Flame} label="Day Streak" value={USER_STATS.streak} change="+1" positive />
        <StatCard icon={Shield} label="Trust Score" value={`${USER_STATS.trustScore}%`} change="-0.5%" positive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <FeaturedHero />
        </div>
        <TopGainers />
      </div>

      <SpotlightUsers />
      <TrendingTribes />
      <UserCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
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
            <div className="flex items-center justify-between bg-dark-700 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-gray-300 text-sm">Cooldown</span>
              </div>
              <span className="text-green-accent text-sm font-medium">Inactive</span>
            </div>
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
