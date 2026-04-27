import { useState } from 'react'
import { AlertTriangle, Ban, Info, Clock, CheckCircle, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const SEVERITY_CONFIG = {
  info: {
    icon: Info,
    border: 'border-cyan-400/30',
    bg: 'bg-cyan-400/5',
    badge: 'bg-cyan-400/10 text-cyan-400',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-amber-400/30',
    bg: 'bg-amber-400/5',
    badge: 'bg-amber-400/10 text-amber-400',
    label: 'Warning',
  },
  danger: {
    icon: Ban,
    border: 'border-red-400/30',
    bg: 'bg-red-400/5',
    badge: 'bg-red-400/10 text-red-400',
    label: 'Penalty',
  },
}

const STATUS_BADGE = {
  active: 'bg-red-400/10 text-red-400',
  appealed: 'bg-amber-400/10 text-amber-400',
  resolved: 'bg-green-accent/10 text-green-accent',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function WarningCard({ warning }) {
  const { dispatch } = useAppContext()
  const [expanded, setExpanded] = useState(false)
  const [appealText, setAppealText] = useState('')
  const [showAppealForm, setShowAppealForm] = useState(false)

  const config = SEVERITY_CONFIG[warning.severity] || SEVERITY_CONFIG.info
  const Icon = config.icon

  const handleAppeal = () => {
    if (!appealText.trim()) return
    dispatch({ type: 'APPEAL_WARNING', warningId: warning.id, reason: appealText.trim() })
    setShowAppealForm(false)
    setAppealText('')
  }

  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_WARNING', warningId: warning.id })
  }

  return (
    <div className={`border rounded-2xl ${config.border} ${config.bg} overflow-hidden transition-all`}>
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-3 p-4 sm:p-5 text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-dark-700 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={18} className={config.badge.split(' ').pop()} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
              {config.label}
            </span>
            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[warning.status]}`}>
              {warning.status}
            </span>
          </div>
          <p className="text-white text-sm font-medium">{warning.title}</p>
          <p className="text-gray-500 text-xs mt-1">{formatDate(warning.createdAt)}</p>
        </div>
        <div className="shrink-0 text-gray-500">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 border-t border-dark-600/50 pt-4">
          <p className="text-gray-300 text-sm">{warning.description}</p>

          {warning.creditsSlashed > 0 && (
            <div className="flex items-center gap-2 bg-red-400/10 rounded-xl px-3 py-2">
              <Ban size={14} className="text-red-400" />
              <span className="text-red-400 text-sm font-medium">-{warning.creditsSlashed} credits slashed</span>
            </div>
          )}

          {warning.appealDeadline && warning.status === 'active' && (
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Clock size={14} />
              <span>Appeal deadline: {formatDate(warning.appealDeadline)}</span>
            </div>
          )}

          {warning.status === 'appealed' && warning.appealReason && (
            <div className="bg-dark-700 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">Your appeal:</p>
              <p className="text-gray-200 text-sm">{warning.appealReason}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            {warning.status === 'active' && !showAppealForm && (
              <button
                onClick={() => setShowAppealForm(true)}
                className="px-4 py-2 bg-amber-400/10 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-400/20 transition-colors"
              >
                Appeal
              </button>
            )}
            {warning.status === 'active' && (
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-dark-600 text-gray-300 rounded-xl text-sm font-medium hover:bg-dark-500 transition-colors"
              >
                Acknowledge
              </button>
            )}
            {warning.status === 'appealed' && (
              <div className="flex items-center gap-2 text-amber-400 text-xs">
                <Clock size={14} />
                <span>Appeal under review</span>
              </div>
            )}
            {warning.status === 'resolved' && (
              <div className="flex items-center gap-2 text-green-accent text-xs">
                <CheckCircle size={14} />
                <span>Resolved</span>
              </div>
            )}
          </div>

          {showAppealForm && (
            <div className="space-y-3">
              <textarea
                value={appealText}
                onChange={e => setAppealText(e.target.value)}
                placeholder="Explain why you believe this warning is incorrect..."
                rows={3}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50 resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAppeal}
                  disabled={!appealText.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-accent text-dark-900 rounded-xl text-sm font-semibold hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                  Submit Appeal
                </button>
                <button
                  onClick={() => { setShowAppealForm(false); setAppealText('') }}
                  className="px-4 py-2 bg-dark-600 text-gray-300 rounded-xl text-sm font-medium hover:bg-dark-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Warnings() {
  const { warnings } = useAppContext()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? warnings
    : warnings.filter(w => w.status === filter)

  const activeCount = warnings.filter(w => w.status === 'active').length
  const appealedCount = warnings.filter(w => w.status === 'appealed').length

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle size={24} className="text-amber-400" /> Warnings & Penalties
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Review account warnings, credit penalties, and submit appeals
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
          <p className="text-2xl font-bold text-red-400">{activeCount}</p>
          <p className="text-gray-500 text-xs">Active warnings</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
          <p className="text-2xl font-bold text-amber-400">{appealedCount}</p>
          <p className="text-gray-500 text-xs">Under appeal</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
          <p className="text-2xl font-bold text-green-accent">{warnings.length - activeCount - appealedCount}</p>
          <p className="text-gray-500 text-xs">Resolved</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'appealed', label: 'Appealed' },
          { key: 'resolved', label: 'Resolved' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-green-accent/10 text-green-accent'
                : 'bg-dark-700 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 text-center">
            <CheckCircle size={40} className="text-green-accent mx-auto mb-3" />
            <p className="text-white font-medium">No warnings found</p>
            <p className="text-gray-500 text-sm mt-1">
              {filter === 'all' ? 'Your account is in good standing!' : `No ${filter} warnings.`}
            </p>
          </div>
        ) : (
          filtered.map(warning => (
            <WarningCard key={warning.id} warning={warning} />
          ))
        )}
      </div>
    </div>
  )
}
