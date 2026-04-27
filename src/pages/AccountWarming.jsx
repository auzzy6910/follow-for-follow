import { useState } from 'react'
import { Sprout, CheckCircle, ChevronRight, Shield, Info, Zap, Clock, Target, ArrowRight } from 'lucide-react'
import { useUserStats } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'

const WARMING_PHASES = [
  {
    day: 'Days 1-3',
    dayStart: 1,
    dayEnd: 3,
    limit: 5,
    label: 'New Account',
    description: 'Start slow to build trust with the platform. Follow a few high-quality accounts in your niche.',
    tips: [
      'Complete your profile bio and avatar',
      'Follow accounts you genuinely find interesting',
      'Spend at least 15 seconds on each profile before following',
    ],
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    day: 'Days 4-7',
    dayStart: 4,
    dayEnd: 7,
    limit: 10,
    label: 'Warming Up',
    description: 'You\'re building a natural pattern. Gradually increase activity while keeping engagement genuine.',
    tips: [
      'Like and comment on posts before following',
      'Space your follows throughout the day',
      'Engage with content from your tribe members',
    ],
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    day: 'Days 8-14',
    dayStart: 8,
    dayEnd: 14,
    limit: 20,
    label: 'Established',
    description: 'Your account looks natural. You can now follow more users per day with a healthy engagement pattern.',
    tips: [
      'Join engagement trains during Golden Hour',
      'Start earning tribe bonuses for niche follows',
      'Keep your unfollow rate below 5%',
    ],
    color: 'text-green-accent',
    bg: 'bg-green-accent/10',
  },
  {
    day: 'Days 15-30',
    dayStart: 15,
    dayEnd: 30,
    limit: 35,
    label: 'Trusted',
    description: 'You\'re now a trusted member. Higher limits and priority in the matching queue.',
    tips: [
      'Complete daily quests for bonus credits',
      'Maintain your streak for tier upgrades',
      'Help verify new users for community rewards',
    ],
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    day: 'Days 30+',
    dayStart: 30,
    dayEnd: Infinity,
    limit: 50,
    label: 'Fully Verified',
    description: 'Maximum daily limits unlocked. You have full access to all platform features.',
    tips: [
      'You\'re eligible for the Legend tier',
      'Unlock collaboration matching for shout-outs',
      'Access premium targeting filters',
    ],
    color: 'text-green-accent',
    bg: 'bg-green-accent/10',
  },
]

function getCurrentPhaseIndex(accountAge) {
  for (let i = 0; i < WARMING_PHASES.length; i++) {
    if (accountAge < WARMING_PHASES[i].dayEnd + 1) return i
  }
  return WARMING_PHASES.length - 1
}

function WizardStep({ phase, index, currentIndex, accountAge }) {
  const isComplete = accountAge >= phase.dayEnd + 1
  const isCurrent = index === currentIndex
  const isFuture = index > currentIndex

  return (
    <div className={`border rounded-2xl transition-all ${
      isCurrent
        ? `${phase.bg} border-${phase.color.replace('text-', '')}/30`
        : isComplete
          ? 'bg-dark-800 border-green-accent/20'
          : 'bg-dark-800 border-dark-600 opacity-70'
    }`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isCurrent
              ? `${phase.bg} border-2 border-current ${phase.color}`
              : isComplete
                ? 'bg-green-accent/10 text-green-accent'
                : 'bg-dark-700 text-gray-500'
          }`}>
            {isComplete ? (
              <CheckCircle size={24} />
            ) : (
              <span className="text-lg font-bold">{phase.limit}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isCurrent ? `${phase.bg} ${phase.color}` : isComplete ? 'bg-green-accent/10 text-green-accent' : 'bg-dark-600 text-gray-400'
              }`}>
                {phase.day}
              </span>
              <span className={`text-xs font-medium ${isCurrent ? phase.color : isComplete ? 'text-green-accent' : 'text-gray-500'}`}>
                {phase.label}
              </span>
              {isCurrent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-accent text-dark-900 animate-pulse">
                  CURRENT
                </span>
              )}
            </div>
            <p className={`text-sm ${isCurrent ? 'text-gray-200' : 'text-gray-400'}`}>
              {phase.description}
            </p>
            <p className={`text-xs mt-2 ${isCurrent ? phase.color : 'text-gray-500'}`}>
              {phase.limit} follows/day max
            </p>

            {isCurrent && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-300">Tips for this phase:</p>
                {phase.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight size={12} className={`${phase.color} shrink-0 mt-0.5`} />
                    <span className="text-gray-400 text-xs">{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isFuture && index < WARMING_PHASES.length - 1 && (
        <div className="px-5 pb-4">
          <div className="w-full bg-dark-600 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${isComplete ? 'bg-green-accent' : 'bg-amber-400'}`}
              style={{
                width: isComplete
                  ? '100%'
                  : `${Math.min(100, ((accountAge - phase.dayStart + 1) / (phase.dayEnd - phase.dayStart + 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function AccountWarming() {
  const USER_STATS = useUserStats()
  const { warmingDismissed, dispatch } = useAppContext()
  const [wizardOpen, setWizardOpen] = useState(!warmingDismissed && USER_STATS.accountAge <= 30)
  const accountAge = USER_STATS.accountAge
  const currentIndex = getCurrentPhaseIndex(accountAge)
  const currentPhase = WARMING_PHASES[currentIndex]

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Sprout size={24} className="text-green-accent" /> Account Warming
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Gradually ramp up your daily follows to build trust and avoid platform bans
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
          <Clock size={18} className="text-cyan-400 mb-2" />
          <p className="text-xl font-bold text-white">{accountAge}</p>
          <p className="text-gray-500 text-xs">Days on platform</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
          <Target size={18} className="text-green-accent mb-2" />
          <p className="text-xl font-bold text-white">{currentPhase.limit}</p>
          <p className="text-gray-500 text-xs">Daily follow limit</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
          <Zap size={18} className="text-amber-400 mb-2" />
          <p className="text-xl font-bold text-white">{currentPhase.label}</p>
          <p className="text-gray-500 text-xs">Current phase</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
          <Shield size={18} className="text-purple-400 mb-2" />
          <p className="text-xl font-bold text-white">{USER_STATS.trustScore}%</p>
          <p className="text-gray-500 text-xs">Trust score</p>
        </div>
      </div>

      {wizardOpen && accountAge <= 30 && (
        <div className="bg-dark-800 border border-green-accent/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sprout size={18} className="text-green-accent" />
              <h3 className="text-white font-semibold">Getting Started Wizard</h3>
            </div>
            <button
              onClick={() => {
                setWizardOpen(false)
                dispatch({ type: 'DISMISS_WARMING' })
              }}
              className="text-gray-500 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
          <div className="bg-dark-700 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-200 text-sm font-medium">Welcome to Follow for Follow!</p>
                <p className="text-gray-400 text-xs mt-1">
                  New accounts start with lower daily limits that gradually increase as you prove you&apos;re a real person.
                  This protects everyone from bots and keeps the platform safe. Follow the steps below to unlock your full potential.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-green-accent/5 rounded-xl p-3 border border-green-accent/20">
              <ArrowRight size={16} className="text-green-accent shrink-0" />
              <p className="text-gray-200 text-sm">
                <span className="text-green-accent font-semibold">Next milestone:</span>{' '}
                {currentIndex < WARMING_PHASES.length - 1
                  ? `Reach Day ${WARMING_PHASES[currentIndex + 1].dayStart} to unlock ${WARMING_PHASES[currentIndex + 1].limit} follows/day`
                  : 'All milestones completed! You have full access.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {WARMING_PHASES.map((phase, i) => (
          <WizardStep
            key={i}
            phase={phase}
            index={i}
            currentIndex={currentIndex}
            accountAge={accountAge}
          />
        ))}
      </div>
    </div>
  )
}
