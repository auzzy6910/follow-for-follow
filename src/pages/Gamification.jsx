import { useState } from 'react'
import { Trophy, Flame, Target, Crown, Star, TrendingUp, Medal, Zap, Gift } from 'lucide-react'
import { useLeaderboard, useQuests, useUserStats } from '../hooks/useAppData'

function TierBadge({ tier }) {
  const tierConfig = {
    rookie: { color: 'text-gray-400 border-gray-500 bg-gray-500/10', label: 'Rookie', limit: '10/day', icon: Star },
    influencer: { color: 'text-green-accent border-green-accent bg-green-accent/10', label: 'Influencer', limit: '50/day', icon: Crown },
    legend: { color: 'text-amber-400 border-amber-400 bg-amber-400/10', label: 'Legend', limit: '5x Priority', icon: Trophy },
  }
  const config = tierConfig[tier]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} text-sm font-medium`}>
      <Icon size={14} />
      {config.label}
    </div>
  )
}

export default function Gamification() {
  const [activeTab, setActiveTab] = useState('leaderboard')
  const LEADERBOARD = useLeaderboard()
  const QUESTS = useQuests()
  const USER_STATS = useUserStats()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy size={24} className="text-amber-400" /> Gamification
        </h2>
        <p className="text-gray-400 text-sm mt-1">Compete, earn tiers, and complete quests for bonus credits</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={18} className="text-green-accent" />
            <span className="text-gray-400 text-sm">Current Tier</span>
          </div>
          <TierBadge tier={USER_STATS.tier} />
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-orange-400" />
            <span className="text-gray-400 text-sm">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{USER_STATS.streak} days</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-cyan-400" />
            <span className="text-gray-400 text-sm">Quests Done</span>
          </div>
          <p className="text-2xl font-bold text-white">18</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={18} className="text-purple-400" />
            <span className="text-gray-400 text-sm">Bonus Earned</span>
          </div>
          <p className="text-2xl font-bold text-white">1,250 cr</p>
        </div>
      </div>

      <div className="flex gap-2 bg-dark-800 p-1 rounded-xl border border-dark-600 w-fit">
        {[
          { id: 'leaderboard', label: 'Leaderboard' },
          { id: 'quests', label: 'Quests' },
          { id: 'tiers', label: 'Tier System' },
          { id: 'streaks', label: 'Streaks' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-green-accent/10 text-green-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'leaderboard' && (
        <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-dark-600">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Medal size={18} className="text-amber-400" /> Weekly Top Gainers
            </h3>
          </div>
          <div className="divide-y divide-dark-600">
            {LEADERBOARD.map((user, i) => (
              <div key={user.id} className={`flex items-center gap-4 px-5 py-4 ${i < 3 ? 'bg-dark-700/50' : ''}`}>
                <span className={`w-8 text-center font-bold ${
                  i === 0 ? 'text-amber-400 text-lg' : i === 1 ? 'text-gray-300 text-lg' : i === 2 ? 'text-orange-400 text-lg' : 'text-gray-500'
                }`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                </span>
                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user.displayName}</p>
                  <p className="text-gray-500 text-xs">@{user.username}</p>
                </div>
                <TierBadge tier={user.tier} />
                <div className="text-right min-w-[80px]">
                  <p className="text-green-accent text-sm font-bold">+{user.weeklyFollowers.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">followers</p>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="text-amber-400 text-sm font-semibold">{user.streak}d</p>
                  <p className="text-gray-500 text-xs">streak</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'quests' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUESTS.map(quest => (
              <div key={quest.id} className={`bg-dark-800 border rounded-2xl p-5 ${
                quest.progress >= quest.total ? 'border-green-accent/30' : 'border-dark-600'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    quest.type === 'daily' ? 'bg-cyan-400/10 text-cyan-400' :
                    quest.type === 'weekly' ? 'bg-purple-400/10 text-purple-400' :
                    'bg-amber-400/10 text-amber-400'
                  }`}>
                    {quest.type}
                  </span>
                  <span className="text-amber-400 text-sm font-bold flex items-center gap-1">
                    <Gift size={14} /> +{quest.reward} cr
                  </span>
                </div>
                <h4 className="text-white font-medium mb-3">{quest.title}</h4>
                <div className="w-full bg-dark-500 rounded-full h-2 mb-2">
                  <div
                    className="progress-bar h-2"
                    style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{quest.progress}/{quest.total} completed</span>
                  {quest.progress >= quest.total ? (
                    <button className="text-xs bg-green-accent text-dark-900 font-semibold px-3 py-1.5 rounded-lg">
                      Claim Reward
                    </button>
                  ) : (
                    <button className="text-xs bg-green-accent/10 text-green-accent font-medium px-3 py-1.5 rounded-lg hover:bg-green-accent/20 transition-colors">
                      Continue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tiers' && (
        <div className="space-y-4">
          {[
            { tier: 'rookie', name: 'Rookie', color: 'gray-400', limit: '10 follows/day', desc: 'New members start here. Build trust and earn credits.', perks: ['10 follows per day', 'Standard credit earning', 'Access to all tribes'] },
            { tier: 'influencer', name: 'Influencer', color: 'green-accent', limit: '50 follows/day', desc: 'High trust members with proven engagement history.', perks: ['50 follows per day', '1.5x credit earning', 'Priority in tribe feeds', 'Collaboration matching'] },
            { tier: 'legend', name: 'Legend', color: 'amber-400', limit: 'Unlimited + Priority', desc: 'Elite members with legendary engagement and trust.', perks: ['Unlimited follows', '2x credit earning', '5x Priority pools', 'Golden Hour priority', 'VIP support', 'Custom tribe creation'] },
          ].map(t => (
            <div key={t.tier} className={`bg-dark-800 border rounded-2xl p-6 ${
              t.tier === USER_STATS.tier ? `border-${t.color}/30` : 'border-dark-600'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <TierBadge tier={t.tier} />
                {t.tier === USER_STATS.tier && (
                  <span className="text-green-accent text-xs font-medium bg-green-accent/10 px-2 py-0.5 rounded-full">Current</span>
                )}
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{t.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{t.desc}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {t.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Zap size={12} className={`text-${t.color}`} />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'streaks' && (
        <div className="space-y-6">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-orange-400/10 flex items-center justify-center">
                <Flame size={28} className="text-orange-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{USER_STATS.streak} Day Streak</p>
                <p className="text-gray-400 text-sm">Keep following daily to maintain your streak!</p>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-4">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  i < USER_STATS.streak
                    ? 'bg-green-accent/20 text-green-accent'
                    : i === USER_STATS.streak
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                    : 'bg-dark-600 text-gray-600'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { days: 7, reward: 200, status: 'claimed' },
              { days: 14, reward: 500, status: USER_STATS.streak >= 14 ? 'claimable' : 'locked' },
              { days: 30, reward: 1000, status: 'locked' },
            ].map(milestone => (
              <div key={milestone.days} className={`bg-dark-800 border rounded-2xl p-5 ${
                milestone.status === 'claimed' ? 'border-green-accent/30' : 'border-dark-600'
              }`}>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">{milestone.days}</p>
                  <p className="text-gray-400 text-sm mb-3">day streak</p>
                  <p className="text-amber-400 font-bold text-lg mb-3">+{milestone.reward} cr</p>
                  {milestone.status === 'claimed' && (
                    <span className="text-green-accent text-sm font-medium bg-green-accent/10 px-3 py-1.5 rounded-lg">Claimed</span>
                  )}
                  {milestone.status === 'claimable' && (
                    <button className="text-sm bg-green-accent text-dark-900 font-semibold px-4 py-2 rounded-lg hover:bg-green-accent/90 transition-colors">
                      Claim Now
                    </button>
                  )}
                  {milestone.status === 'locked' && (
                    <span className="text-gray-500 text-sm">Locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
