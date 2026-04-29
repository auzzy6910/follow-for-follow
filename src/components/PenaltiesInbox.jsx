import { useState } from 'react'
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Inbox,
  Scale,
  X,
} from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const SEVERITY_META = {
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    ring: 'ring-amber-400/30',
    label: 'Warning',
  },
  notice: {
    icon: Inbox,
    color: 'text-cyan-400',
    ring: 'ring-cyan-400/30',
    label: 'Notice',
  },
  severe: {
    icon: Ban,
    color: 'text-red-400',
    ring: 'ring-red-400/30',
    label: 'Severe',
  },
}

const STATUS_META = {
  active: { label: 'Active', color: 'text-amber-400 bg-amber-400/10' },
  appealed: { label: 'Under review', color: 'text-cyan-400 bg-cyan-400/10' },
  overturned: { label: 'Overturned', color: 'text-blue-accent bg-blue-accent/10' },
  expired: { label: 'Expired', color: 'text-gray-400 bg-dark-600' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AppealModal({ penalty, onClose }) {
  const { submitAppeal } = useAppContext()
  const [text, setText] = useState('')
  const disabled = text.trim().length < 10

  const handleSubmit = () => {
    if (disabled) return
    submitAppeal(penalty.id, text.trim())
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appeal-title"
    >
      <div className="bg-dark-800 border border-dark-500 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-blue-accent" />
            <h3 id="appeal-title" className="text-gray-900 font-semibold">
              Appeal this penalty
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close appeal form"
            className="text-gray-500 hover:text-gray-900 p-1 -m-1"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="bg-dark-700 rounded-xl p-3 text-sm">
            <p className="text-gray-900 font-medium">{penalty.title}</p>
            <p className="text-gray-400 text-xs mt-1">{penalty.reason}</p>
          </div>
          <label className="block text-sm text-gray-700">
            Why should this be overturned?
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder="Explain what happened. Reviewers usually respond within 24h."
              className="mt-1 w-full bg-dark-700 border border-dark-500 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
            />
          </label>
          <p className="text-gray-500 text-xs">
            Minimum 10 characters. False appeals may incur additional penalties.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-dark-600 bg-dark-900/40">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-dark-700 border border-dark-500 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-accent hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit appeal
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PenaltiesInbox() {
  const { penalties } = useAppContext()
  const [appealTarget, setAppealTarget] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const activeCount = penalties.filter(p => p.status === 'active').length
  const appealedCount = penalties.filter(p => p.status === 'appealed').length

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <h3 className="text-gray-900 font-semibold flex items-center gap-2">
            <Inbox size={18} className="text-amber-400" /> Warnings &amp; Penalties
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Review actions taken on your account and appeal anything you believe
            was issued in error.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-amber-400/10 text-amber-400 font-medium">
            {activeCount} active
          </span>
          {appealedCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-400 font-medium">
              {appealedCount} under review
            </span>
          )}
        </div>
      </div>

      {penalties.length === 0 ? (
        <div className="bg-dark-700 rounded-xl p-6 flex items-center gap-3">
          <CheckCircle size={20} className="text-blue-accent" />
          <p className="text-gray-700 text-sm">
            No warnings or penalties on your account. Keep it up!
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {penalties.map(p => {
            const meta = SEVERITY_META[p.severity] || SEVERITY_META.notice
            const status = STATUS_META[p.status] || STATUS_META.active
            const Icon = meta.icon
            const expanded = expandedId === p.id
            const canAppeal = p.status === 'active'
            return (
              <li
                key={p.id}
                className={`bg-dark-700 rounded-xl p-3 ring-1 ${meta.ring}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-dark-800 flex items-center justify-center shrink-0">
                    <Icon size={16} className={meta.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-900 text-sm font-medium">{p.title}</p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {formatDate(p.issuedAt)}
                      </span>
                      {p.creditsSlashed > 0 && (
                        <span className="text-red-400 font-medium">
                          -{p.creditsSlashed} cr
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : p.id)}
                        className="text-blue-accent hover:underline"
                      >
                        {expanded ? 'Hide details' : 'View details'}
                      </button>
                    </div>
                    {expanded && (
                      <div className="mt-3 bg-dark-800 rounded-lg p-3 text-sm text-gray-700 space-y-2">
                        <p>{p.reason}</p>
                        {p.appealText && (
                          <div className="bg-dark-700 rounded-lg p-2 text-xs">
                            <p className="text-gray-500 uppercase tracking-wide">
                              Your appeal ({p.appealedAt && formatDate(p.appealedAt)})
                            </p>
                            <p className="text-gray-700 mt-1">{p.appealText}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {canAppeal && (
                    <button
                      type="button"
                      onClick={() => setAppealTarget(p)}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-accent hover:brightness-110"
                    >
                      <Scale size={12} /> Appeal
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {appealTarget && (
        <AppealModal
          penalty={appealTarget}
          onClose={() => setAppealTarget(null)}
        />
      )}
    </div>
  )
}
