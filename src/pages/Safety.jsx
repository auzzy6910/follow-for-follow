import { useState } from 'react'
import { Shield, Clock, AlertTriangle, Eye, Activity, Lock, UserX, Ban, Info, CheckCircle, Gauge, Play, Sparkles } from 'lucide-react'
import { useUserStats } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import PenaltiesInbox from '../components/PenaltiesInbox'

function formatCooldownRemaining(cooldownUntil) {
  if (!cooldownUntil) return null
  const remainingMs = Math.max(0, cooldownUntil - Date.now())
  const totalSeconds = Math.ceil(remainingMs / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function Safety() {
  const [actionLimitPerHour, setActionLimitPerHour] = useState(20)
  const [cooldownMin, setCooldownMin] = useState(15)
  const [cooldownMax, setCooldownMax] = useState(30)
  const USER_STATS = useUserStats()
  const {
    userStats: liveStats,
    openWarmingWizard,
    warmingPlan,
    startCooldown,
    clearCooldown,
  } = useAppContext()
  const cooldownRemaining = liveStats.cooldownActive
    ? formatCooldownRemaining(liveStats.cooldownUntil)
    : null

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield size={24} className="text-blue-accent" /> Safety & Anti-Bot Controls
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Protect your account from platform bans with smart rate limiting and human-like behavior
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <Gauge size={20} className="text-blue-accent mb-2" />
          <p className="text-lg sm:text-xl font-bold text-gray-900">{USER_STATS.dailyFollowsRemaining}/{USER_STATS.dailyFollowLimit}</p>
          <p className="text-gray-500 text-xs">Daily follows remaining</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <Clock size={20} className={cooldownRemaining ? 'text-amber-400 mb-2 animate-pulse' : 'text-cyan-400 mb-2'} />
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            {cooldownRemaining ?? `${cooldownMin}-${cooldownMax}s`}
          </p>
          <p className="text-gray-500 text-xs">
            {cooldownRemaining ? 'Cooldown active' : 'Randomized cooldown'}
          </p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <Activity size={20} className="text-amber-400 mb-2" />
          <p className="text-lg sm:text-xl font-bold text-gray-900">{USER_STATS.unfollowRate}%</p>
          <p className="text-gray-500 text-xs">Your unfollow rate</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <Shield size={20} className="text-blue-accent mb-2" />
          <p className="text-lg sm:text-xl font-bold text-gray-900">{USER_STATS.trustScore}%</p>
          <p className="text-gray-500 text-xs">Trust score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Lock size={18} /> Action Limits
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700 text-sm">Max follows per hour</label>
                <span className="text-blue-accent text-sm font-semibold">{actionLimitPerHour}</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={actionLimitPerHour}
                onChange={e => setActionLimitPerHour(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-gray-600 text-xs mt-1">
                <span>5 (safest)</span>
                <span>30 (max)</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700 text-sm">Cooldown between actions</label>
                <span className="text-blue-accent text-sm font-semibold">{cooldownMin}-{cooldownMax}s</span>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-500 text-xs">Min (seconds)</label>
                  <input
                    type="number"
                    value={cooldownMin}
                    onChange={e => setCooldownMin(Number(e.target.value))}
                    min="10"
                    max="60"
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm text-gray-900 mt-1 focus:outline-none focus:border-blue-accent/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-500 text-xs">Max (seconds)</label>
                  <input
                    type="number"
                    value={cooldownMax}
                    onChange={e => setCooldownMax(Number(e.target.value))}
                    min="15"
                    max="120"
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-sm text-gray-900 mt-1 focus:outline-none focus:border-blue-accent/50"
                  />
                </div>
              </div>
            </div>
            <div className="bg-dark-700 rounded-xl p-3 flex items-start gap-2">
              <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-gray-400 text-xs">
                Randomized delays between {cooldownMin}-{cooldownMax} seconds mimic natural human behavior,
                preventing platform detection and protecting your account from bans.
              </p>
            </div>
            <div className="bg-dark-700 rounded-xl p-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="text-gray-900 text-sm font-medium flex items-center gap-2">
                  <Clock size={14} className={cooldownRemaining ? 'text-amber-400' : 'text-gray-400'} />
                  Live cooldown
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {cooldownRemaining
                    ? `Actions paused — ${cooldownRemaining} remaining.`
                    : 'No active cooldown. Trigger one manually to preview the countdown.'}
                </p>
              </div>
              {cooldownRemaining ? (
                <button
                  type="button"
                  onClick={clearCooldown}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-400 hover:brightness-110"
                >
                  Clear cooldown
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startCooldown(90)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-accent hover:brightness-110"
                >
                  <Play size={12} /> Start 90s cooldown
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
            <div>
              <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                <Activity size={18} /> Account Warming
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                New accounts have lower limits that gradually increase as they
                prove they aren't bots.
              </p>
            </div>
            <button
              type="button"
              onClick={openWarmingWizard}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-blue-accent hover:brightness-110 shrink-0"
            >
              <Sparkles size={14} /> {warmingPlan ? 'Re-run wizard' : 'Run warming wizard'}
            </button>
          </div>
          {warmingPlan && (
            <div className="bg-blue-accent/10 border border-blue-accent/30 rounded-xl p-3 mb-3 text-sm">
              <p className="text-blue-accent font-semibold">Warming plan active</p>
              <p className="text-gray-700 text-xs mt-1">
                Target: {warmingPlan.dailyFollows} follows/day ·{' '}
                Phase: {warmingPlan.phase}
                {warmingPlan.niches.length > 0 &&
                  ` · Niches: ${warmingPlan.niches.join(', ')}`}
              </p>
            </div>
          )}
          <div className="space-y-3">
            {[
              { day: 'Days 1-3', limit: 5, label: 'New Account' },
              { day: 'Days 4-7', limit: 10, label: 'Warming Up' },
              { day: 'Days 8-14', limit: 20, label: 'Established' },
              { day: 'Days 15-30', limit: 35, label: 'Trusted' },
              { day: 'Days 30+', limit: 50, label: 'Fully Verified' },
            ].map((phase, i) => (
              <div key={i} className={`flex items-center gap-4 bg-dark-700 rounded-xl p-3 ${
                USER_STATS.accountAge >= [1, 4, 8, 15, 30][i] && USER_STATS.accountAge < ([4, 8, 15, 30, 999][i])
                  ? 'border border-blue-accent/30' : ''
              }`}>
                <div className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center text-gray-900 text-xs font-bold">
                  {phase.limit}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{phase.day}</p>
                  <p className="text-gray-500 text-xs">{phase.label} - {phase.limit} follows/day max</p>
                </div>
                {USER_STATS.accountAge >= [1, 4, 8, 15, 30][i] && USER_STATS.accountAge < ([4, 8, 15, 30, 999][i]) && (
                  <span className="text-blue-accent text-xs font-medium">Current</span>
                )}
                {USER_STATS.accountAge >= [4, 8, 15, 30, 999][i] && (
                  <CheckCircle size={16} className="text-blue-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <UserX size={18} className="text-red-400" /> Unfollow Detection
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Users who unfollow after earning credits face penalties:
          </p>
          <div className="space-y-2">
            {[
              { label: 'First offense', action: 'Credits slashed, warning issued', severity: 'warning' },
              { label: 'Second offense', action: 'Moved to Low Trust pool', severity: 'warning' },
              { label: 'Third offense', action: 'Account suspended for 7 days', severity: 'danger' },
              { label: 'Chronic unfollower', action: 'Permanent ban', severity: 'danger' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-dark-700 rounded-xl p-3">
                {item.severity === 'warning' ? (
                  <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                ) : (
                  <Ban size={16} className="text-red-400 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
            <Eye size={18} className="text-purple-400" /> Shadow Check System
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Periodic background checks monitor user behavior across the platform:
          </p>
          <div className="space-y-3">
            {[
              { label: 'Unfollow rate monitoring', desc: 'Tracked across all follows on the platform', status: 'active' },
              { label: 'Bot behavior detection', desc: 'Unusual follow patterns flagged', status: 'active' },
              { label: 'Low Trust pool', desc: 'High unfollow rate users get reduced visibility', status: 'active' },
              { label: 'Proxy protection', desc: 'Checks routed through proxies to avoid blocks', status: 'active' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-dark-700 rounded-xl p-3">
                <div className="w-2 h-2 rounded-full bg-blue-accent" />
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                <span className="text-blue-accent text-xs font-medium">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PenaltiesInbox />

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
        <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-400" /> Report System
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Report dead accounts, offensive profiles, or suspicious activity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Dead / Inactive Account', 'Offensive Content', 'Suspicious / Bot Activity'].map((type, i) => (
            <button key={i} className="bg-dark-700 border border-dark-500 rounded-xl p-4 text-left hover:border-amber-400/30 transition-colors">
              <p className="text-gray-900 text-sm font-medium mb-1">{type}</p>
              <p className="text-gray-500 text-xs">Click to submit a report</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
