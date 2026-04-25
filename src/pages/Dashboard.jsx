import { TrendingUp, Users, Coins, Flame, ArrowUpRight, ArrowDownRight, Clock, Star, Shield, ChevronRight } from 'lucide-react'
import { FEATURED_USER, USERS, TRIBES, USER_STATS, LEADERBOARD, QUESTS } from '../data/mockData'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, change, positive }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-green-accent/10 flex items-center justify-center">
          <Icon size={20} className="text-green-accent" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  )
}

function FeaturedHero() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-dark-800 border border-dark-600">
      <img src={FEATURED_USER.cover} alt="" className="w-full h-72 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-end gap-4">
          <img
            src={FEATURED_USER.avatar}
            alt={FEATURED_USER.displayName}
            className="w-20 h-20 rounded-2xl border-2 border-green-accent object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-dark-900 bg-green-accent px-2 py-0.5 rounded-full">FEATURED</span>
              <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star size={10} /> Legend
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{FEATURED_USER.displayName}</h2>
            <p className="text-gray-400 text-sm">@{FEATURED_USER.username}</p>
            <p className="text-gray-300 text-sm mt-1 line-clamp-1">{FEATURED_USER.bio}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{(FEATURED_USER.followers / 1000).toFixed(1)}K</p>
            <p className="text-gray-400 text-sm">followers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopGainers() {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Top Gainers</h3>
        <Link to="/gamification" className="text-green-accent text-xs hover:underline">View All</Link>
      </div>
      <div className="space-y-3">
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
  const spotlightUsers = USERS.slice(0, 8)
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Spotlight Users</h3>
        <Link to="/explore" className="text-green-accent text-sm hover:underline flex items-center gap-1">
          See All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {spotlightUsers.map(user => (
          <div key={user.id} className="flex flex-col items-center gap-2 shrink-0">
            <div className={`p-0.5 rounded-full ${user.tier === 'legend' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : user.tier === 'influencer' ? 'bg-gradient-to-br from-green-accent to-cyan-400' : 'bg-dark-500'}`}>
              <img src={user.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-dark-900" />
            </div>
            <p className="text-gray-300 text-xs font-medium truncate w-16 text-center">@{user.username.slice(0, 8)}</p>
            <span className="text-green-accent text-xs">{user.credits} cr</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActiveQuests() {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Daily Quests</h3>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Trending Tribes</h3>
        <Link to="/tribes" className="text-green-accent text-sm hover:underline flex items-center gap-1">
          See All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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

function UserCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Recommended For You</h3>
        <Link to="/explore" className="text-green-accent text-sm hover:underline flex items-center gap-1">
          See All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {USERS.slice(0, 8).map(user => (
          <div key={user.id} className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden card-hover">
            <div className="relative h-28">
              <img src={user.cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
            </div>
            <div className="px-4 pb-4 -mt-8 relative">
              <img src={user.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-dark-800 object-cover mb-2" />
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white text-sm font-semibold truncate">{user.displayName}</h4>
                {user.isVerified && <Shield size={12} className="text-green-accent shrink-0" />}
              </div>
              <p className="text-gray-500 text-xs mb-2">@{user.username}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{(user.followers / 1000).toFixed(1)}K followers</span>
                <button className="text-xs font-semibold bg-green-accent/10 text-green-accent px-3 py-1 rounded-lg hover:bg-green-accent/20 transition-colors">
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Followers Gained" value={USER_STATS.totalFollowersGained.toLocaleString()} change="+12.5%" positive />
        <StatCard icon={Coins} label="Credits Balance" value={USER_STATS.totalCredits.toLocaleString()} change="+340" positive />
        <StatCard icon={Flame} label="Day Streak" value={USER_STATS.streak} change="+1" positive />
        <StatCard icon={Shield} label="Trust Score" value={`${USER_STATS.trustScore}%`} change="-0.5%" positive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FeaturedHero />
        </div>
        <TopGainers />
      </div>

      <SpotlightUsers />
      <TrendingTribes />
      <UserCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
