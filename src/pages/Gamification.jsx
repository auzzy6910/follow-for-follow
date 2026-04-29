import { useState } from 'react'
import { Trophy, Flame, Target, Crown, Star, Medal, Zap, Gift, X, Sparkles, Calendar, Clock, TrendingUp } from 'lucide-react'
import { useLeaderboard, useQuests, useUserStats } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { LEADERBOARD_DAILY, LEADERBOARD_ALLTIME, FEATURED_USER } from '../data/mockData'

function TierBadge({ tier }) {
  const tierConfig = {
    rookie: { color: 'text-gray-400 border-gray-500 bg-gray-500/10', label: 'Rookie', limit: '10/day', icon: Star },
    influencer: { color: 'text-blue-accent border-blue-accent bg-blue-accent/10', label: 'Influencer', limit: '50/day', icon: Crown },
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

function TierUpModal({ celebration, onDismiss }) {
  if (!celebration) return null

  const tierLabels = { rookie: 'Rookie', influencer: 'Influencer', legend: 'Legend' }
  const tierColors = { rookie: 'text-gray-400', influencer: 'text-blue-accent', legend: 'text-amber-400' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 max-w-sm w-full mx-4 text-center relative animate-in">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div className="w-20 h-20 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={40} className="text-amber-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Tier Up!</h3>
        <p className="text-gray-400 mb-6">
          You leveled up from{' '}
          <span className={`font-semibold ${tierColors[celebration.from]}`}>
            {tierLabels[celebration.from]}
          </span>{' '}
          to{' '}
          <span className={`font-semibold ${tierColors[celebration.to]}`}>
            {tierLabels[celebration.to]}
          </span>
          !
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <TierBadge tier={celebration.from} />
          <span className="text-gray-500 text-lg">&rarr;</span>
          <TierBadge tier={celebration.to} />
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Enjoy new perks and higher limits with your upgraded tier.
        </p>
        <button
          onClick={onDismiss}
          className="w-full bg-blue-accent text-dark-900 font-semibold py-3 rounded-xl hover:bg-blue-accent/90 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}

export default function Gamification() {
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [leaderboardRange, setLeaderboardRange] = useState('weekly')
  const LEADERBOARD = useLeaderboard()
  const QUESTS = useQuests()
  const USER_STATS = useUserStats()
  const { dispatch, claimedQuests, claimedStreaks, tierUpCelebration, notify } = useAppContext()

  const leaderboardData =
    leaderboardRange === 'daily' ? LEADERBOARD_DAILY :
    leaderboardRange === 'alltime' ? LEADERBOARD_ALLTIME :
    LEADERBOARD

  const rangeLabels = { daily: 'Daily', weekly: 'Weekly', alltime: 'All-Time' }

  const currentUserRank = leaderboardData.length + 1
  const currentUserEntry = {
    id: FEATURED_USER.id,
    displayName: FEATURED_USER.displayName,
    username: FEATURED_USER.username,
    avatar: FEATURED_USER.avatar,
    tier: USER_STATS.tier,
    weeklyFollowers: 347,
    streak: USER_STATS.streak,
  }

  const handleClaimQuest = (quest) => {
    if (claimedQuests[quest.id]) return
    dispatch({ type: 'CLAIM_QUEST', questId: quest.id, reward: quest.reward, questTitle: quest.title })
    notify(`Quest reward claimed! +${quest.reward} credits`, 'success')
  }

  const handleClaimStreak = (milestone) => {
    if (claimedStreaks[milestone.days]) return
    dispatch({ type: 'CLAIM_STREAK', days: milestone.days, reward: milestone.reward })
    notify(`${milestone.days}-day streak reward claimed! +${milestone.reward} credits`, 'success')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <TierUpModal
        celebration={tierUpCelebration}
        onDismiss={() => dispatch({ type: 'DISMISS_CELEBRATION' })}
      />

      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Trophy size={24} className="text-amber-400" /> Gamification
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Compete, earn tiers, and complete quests for bonus credits</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={18} className="text-blue-accent" />
            <span className="text-gray-400 text-xs sm:text-sm">Current Tier</span>
          </div>
          <TierBadge tier={USER_STATS.tier} />
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-orange-400" />
            <span className="text-gray-400 text-xs sm:text-sm">Current Streak</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{USER_STATS.streak} days</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-cyan-400" />
            <span className="text-gray-400 text-xs sm:text-sm">Quests Done</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{Object.keys(claimedQuests).length + 18}</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={18} className="text-purple-400" />
            <span className="text-gray-400 text-xs sm:text-sm">Bonus Earned</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">1,250 cr</p>
        </div>
      </div>

      <div className="flex gap-2 bg-dark-800 p-1 rounded-xl border border-dark-600 overflow-x-auto no-scrollbar">
        {[
          { id: 'leaderboard', label: 'Leaderboard' },
          { id: 'quests', label: 'Quests' },
          { id: 'tiers', label: 'Tier System' },
          { id: 'streaks', label: 'Streaks' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'bg-blue-accent/10 text-blue-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'leaderboard' && (
        <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-dark-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Medal size={18} className="text-amber-400" /> {rangeLabels[leaderboardRange]} Top Gainers
            </h3>
            <div className="flex gap-1 bg-dark-700 p-1 rounded-lg">
              {[
                { id: 'daily', label: 'Daily', icon: Clock },
                { id: 'weekly', label: 'Weekly', icon: Calendar },
                { id: 'alltime', label: 'All-Time', icon: TrendingUp },
              ].map(range => (
                <button
                  key={range.id}
                  onClick={() => setLeaderboardRange(range.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    leaderboardRange === range.id
                      ? 'bg-blue-accent/10 text-blue-accent'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <range.icon size={12} />
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-dark-600">
            {leaderboardData.map((user, i) => (
              <div key={user.id} className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 ${i < 3 ? 'bg-dark-700/50' : ''}`}>
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
                <div className="hidden md:block"><TierBadge tier={user.tier} /></div>
                <div className="text-right min-w-[64px] sm:min-w-[80px]">
                  <p className="text-blue-accent text-xs sm:text-sm font-bold">+{user.weeklyFollowers.toLocaleString()}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs">followers</p>
                </div>
                <div className="hidden sm:block text-right min-w-[60px]">
                  <p className="text-amber-400 text-sm font-semibold">{user.streak}d</p>
                  <p className="text-gray-500 text-xs">streak</p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 bg-blue-accent/5 border-t-2 border-blue-accent/20">
              <span className="w-8 text-center font-bold text-blue-accent">#{currentUserRank}</span>
              <img src={currentUserEntry.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-accent/40" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate flex items-center gap-1.5">
                  {currentUserEntry.displayName}
                  <span className="text-[10px] bg-blue-accent/10 text-blue-accent px-1.5 py-0.5 rounded-full font-medium">You</span>
                </p>
                <p className="text-gray-500 text-xs">@{currentUserEntry.username}</p>
              </div>
              <div className="hidden md:block"><TierBadge tier={currentUserEntry.tier} /></div>
              <div className="text-right min-w-[64px] sm:min-w-[80px]">
                <p className="text-blue-accent text-xs sm:text-sm font-bold">+{currentUserEntry.weeklyFollowers.toLocaleString()}</p>
                <p className="text-gray-500 text-[10px] sm:text-xs">followers</p>
              </div>
              <div className="hidden sm:block text-right min-w-[60px]">
                <p className="text-amber-400 text-sm font-semibold">{currentUserEntry.streak}d</p>
                <p className="text-gray-500 text-xs">streak</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quests' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {QUESTS.map(quest => {
              const isComplete = quest.progress >= quest.total
              const isClaimed = claimedQuests[quest.id]
              return (
                <div key={quest.id} className={`bg-dark-800 border rounded-2xl p-4 sm:p-5 ${
                  isClaimed ? 'border-blue-accent/30 opacity-75' : isComplete ? 'border-blue-accent/30' : 'border-dark-600'
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
                    {isClaimed ? (
                      <span className="text-xs text-blue-accent font-medium bg-blue-accent/10 px-3 py-1.5 rounded-lg">
                        Claimed
                      </span>
                    ) : isComplete ? (
                      <button
                        onClick={() => handleClaimQuest(quest)}
                        className="text-xs bg-blue-accent text-dark-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-accent/90 transition-colors cursor-pointer"
                      >
                        Claim Reward
                      </button>
                    ) : (
                      <button className="text-xs bg-blue-accent/10 text-blue-accent font-medium px-3 py-1.5 rounded-lg hover:bg-blue-accent/20 transition-colors">
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'tiers' && (
        <div className="space-y-4">
          {[
            { tier: 'rookie', name: 'Rookie', color: 'gray-400', limit: '10 follows/day', desc: 'New members start here. Build trust and earn credits.', perks: ['10 follows per day', 'Standard credit earning', 'Access to all tribes'] },
            { tier: 'influencer', name: 'Influencer', color: 'blue-accent', limit: '50 follows/day', desc: 'High trust members with proven engagement history.', perks: ['50 follows per day', '1.5x credit earning', 'Priority in tribe feeds', 'Collaboration matching'] },
            { tier: 'legend', name: 'Legend', color: 'amber-400', limit: 'Unlimited + Priority', desc: 'Elite members with legendary engagement and trust.', perks: ['Unlimited follows', '2x credit earning', '5x Priority pools', 'Golden Hour priority', 'VIP support', 'Custom tribe creation'] },
          ].map(t => (
            <div key={t.tier} className={`bg-dark-800 border rounded-2xl p-4 sm:p-6 ${
              t.tier === USER_STATS.tier ? `border-${t.color}/30` : 'border-dark-600'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <TierBadge tier={t.tier} />
                {t.tier === USER_STATS.tier && (
                  <span className="text-blue-accent text-xs font-medium bg-blue-accent/10 px-2 py-0.5 rounded-full">Current</span>
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
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-orange-400/10 flex items-center justify-center shrink-0">
                <Flame size={28} className="text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-3xl font-bold text-white">{USER_STATS.streak} Day Streak</p>
                <p className="text-gray-400 text-xs sm:text-sm">Keep following daily to maintain your streak!</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 bg-dark-700 rounded-xl p-4">
              <div>
                <p className="text-white text-sm font-medium">Daily Streak Check-in</p>
                <p className="text-gray-500 text-xs">Follow at least 1 user today to maintain your streak</p>
              </div>
              <button
                onClick={() => {
                  notify('Daily streak maintained! Keep it up!', 'success')
                }}
                className="bg-blue-accent text-dark-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-accent/90 transition-colors shrink-0"
              >
                Claim Today
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mt-4">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  i < USER_STATS.streak
                    ? 'bg-blue-accent/20 text-blue-accent'
                    : i === USER_STATS.streak
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                    : 'bg-dark-600 text-gray-600'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { days: 7, reward: 200, status: 'claimed' },
              { days: 14, reward: 500, status: USER_STATS.streak >= 14 ? 'claimable' : 'locked' },
              { days: 30, reward: 1000, status: 'locked' },
            ].map(milestone => {
              const isClaimed = milestone.status === 'claimed' || claimedStreaks[milestone.days]
              const isClaimable = !isClaimed && milestone.status === 'claimable'
              return (
                <div key={milestone.days} className={`bg-dark-800 border rounded-2xl p-4 sm:p-5 ${
                  isClaimed ? 'border-blue-accent/30' : 'border-dark-600'
                }`}>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white mb-1">{milestone.days}</p>
                    <p className="text-gray-400 text-sm mb-3">day streak</p>
                    <p className="text-amber-400 font-bold text-lg mb-3">+{milestone.reward} cr</p>
                    {isClaimed && (
                      <span className="text-blue-accent text-sm font-medium bg-blue-accent/10 px-3 py-1.5 rounded-lg">Claimed</span>
                    )}
                    {isClaimable && (
                      <button
                        onClick={() => handleClaimStreak(milestone)}
                        className="text-sm bg-blue-accent text-dark-900 font-semibold px-4 py-2 rounded-lg hover:bg-blue-accent/90 transition-colors cursor-pointer"
                      >
                        Claim Now
                      </button>
                    )}
                    {!isClaimed && !isClaimable && (
                      <span className="text-gray-500 text-sm">Locked</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
