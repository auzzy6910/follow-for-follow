import { useMemo, useState } from 'react'
import { Activity, ChevronLeft, ChevronRight, Shield, Sparkles, X } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'
import { useNiches } from '../hooks/useAppData'

const PHASES = [
  { day: 'Days 1-3', limit: 5, label: 'New Account' },
  { day: 'Days 4-7', limit: 10, label: 'Warming Up' },
  { day: 'Days 8-14', limit: 20, label: 'Established' },
  { day: 'Days 15-30', limit: 35, label: 'Trusted' },
  { day: 'Days 30+', limit: 50, label: 'Fully Verified' },
]

function phaseForAge(age) {
  if (age < 4) return PHASES[0]
  if (age < 8) return PHASES[1]
  if (age < 15) return PHASES[2]
  if (age < 30) return PHASES[3]
  return PHASES[4]
}

function WizardBody() {
  const {
    userStats,
    closeWarmingWizard,
    dismissWarmingWizard,
    saveWarmingPlan,
  } = useAppContext()
  const niches = useNiches()

  const suggestedPhase = useMemo(
    () => phaseForAge(userStats.accountAge),
    [userStats.accountAge],
  )

  const [step, setStep] = useState(0)
  const [selectedNiches, setSelectedNiches] = useState([])
  const [dailyFollows, setDailyFollows] = useState(suggestedPhase.limit)

  const toggleNiche = id => {
    setSelectedNiches(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id],
    )
  }

  const handleFinish = () => {
    saveWarmingPlan({
      niches: selectedNiches,
      dailyFollows,
      startedAt: new Date().toISOString(),
      phase: suggestedPhase.label,
    })
  }

  const handleSkip = () => {
    dismissWarmingWizard()
  }

  const steps = [
    {
      title: 'Welcome to account warming',
      body: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-accent/10 flex items-center justify-center">
              <Sparkles size={22} className="text-blue-accent" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold">
                Ramp up safely — avoid platform bans
              </p>
              <p className="text-gray-400 text-sm">
                New accounts get lower limits to look human. We'll build a plan
                that gradually unlocks more follows/day.
              </p>
            </div>
          </div>
          <div className="bg-dark-700 rounded-xl p-4 text-sm text-gray-700 space-y-2">
            <p>
              <span className="text-blue-accent font-semibold">Account age:</span>{' '}
              {userStats.accountAge} days
            </p>
            <p>
              <span className="text-blue-accent font-semibold">Current phase:</span>{' '}
              {suggestedPhase.label} ({suggestedPhase.limit} follows/day max)
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Pick your focus niches',
      body: (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">
            We'll steer recommendations and the daily quest mix toward these
            niches. Pick 1–3 for the strongest signal.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {niches.map(n => {
              const active = selectedNiches.includes(n.id)
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleNiche(n.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-sm transition-colors ${
                    active
                      ? 'border-blue-accent/60 bg-blue-accent/10 text-gray-900'
                      : 'border-dark-500 bg-dark-700 text-gray-700 hover:border-dark-400'
                  }`}
                >
                  <span>{n.icon}</span>
                  <span className="truncate">{n.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ),
    },
    {
      title: 'Pick your daily follow cadence',
      body: (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            We recommend staying at or below your current phase limit. You can
            always raise this later once your trust score stabilises.
          </p>
          <div className="bg-dark-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 text-sm">Daily follows</span>
              <span className="text-blue-accent text-sm font-semibold">
                {dailyFollows} / {suggestedPhase.limit} max
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={suggestedPhase.limit}
              value={Math.min(dailyFollows, suggestedPhase.limit)}
              onChange={e => setDailyFollows(Number(e.target.value))}
              className="w-full accent-blue-500"
              aria-label="Daily follow cadence"
            />
            <div className="flex justify-between text-gray-600 text-xs mt-1">
              <span>1 (safest)</span>
              <span>{suggestedPhase.limit} (phase max)</span>
            </div>
          </div>
          <div className="bg-dark-700 rounded-xl p-4 flex items-start gap-2">
            <Shield size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-gray-400 text-xs">
              Cooldowns will randomise between 15–45s between actions and we'll
              auto-pause if your unfollow rate spikes above 5%.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "You're all set",
      body: (
        <div className="space-y-4">
          <div className="bg-dark-700 rounded-xl p-4 space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="text-blue-accent font-semibold">Niches:</span>{' '}
              {selectedNiches.length === 0
                ? 'Any (no filter)'
                : selectedNiches.join(', ')}
            </p>
            <p className="text-gray-700">
              <span className="text-blue-accent font-semibold">
                Daily follows:
              </span>{' '}
              {dailyFollows}
            </p>
            <p className="text-gray-700">
              <span className="text-blue-accent font-semibold">Phase:</span>{' '}
              {suggestedPhase.label}
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            We'll guide you through the first week with daily quests and
            auto-suggested targets. Let's grow safely.
          </p>
        </div>
      ),
    },
  ]

  const current = steps[step]

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="warming-wizard-title"
    >
      <div className="bg-dark-800 border border-dark-500 rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-blue-accent" />
            <h2 id="warming-wizard-title" className="text-gray-900 font-semibold">
              Account-Warming Wizard
            </h2>
          </div>
          <button
            type="button"
            onClick={closeWarmingWizard}
            aria-label="Close wizard"
            className="text-gray-500 hover:text-gray-900 p-1 -m-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="flex gap-1 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-accent' : 'bg-dark-500'
                }`}
              />
            ))}
          </div>
          <h3 className="text-gray-900 font-semibold text-lg mb-3">
            {current.title}
          </h3>
          <div className="pb-4">{current.body}</div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-dark-600 bg-dark-900/40">
          <button
            type="button"
            onClick={handleSkip}
            className="text-gray-400 text-sm hover:text-gray-900"
          >
            Skip for now
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-700 bg-dark-700 border border-dark-500 hover:text-gray-900"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-accent hover:brightness-110"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-accent hover:brightness-110"
              >
                Start warming
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WarmingWizard() {
  const { warmingWizardOpen } = useAppContext()
  if (!warmingWizardOpen) return null
  return <WizardBody />
}
