import {
  X,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const STATUS_CONFIG = {
  held: {
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    label: 'In Escrow',
    desc: 'Credits held pending 30-day verification period.',
  },
  released: {
    icon: CheckCircle,
    color: 'text-green-accent',
    bg: 'bg-green-accent/10',
    border: 'border-green-accent/30',
    label: 'Released',
    desc: 'Follow verified for 30 days. Credits released.',
  },
  slashed: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
    label: 'Clawed Back',
    desc: 'User unfollowed within 30 days. Credits slashed.',
  },
}

export default function EscrowDrawer() {
  const { escrowDrawerOpen, escrowDrawerTxId, escrowTransactions, dispatch } =
    useAppContext()

  if (!escrowDrawerOpen) return null

  const tx = escrowTransactions.find(t => t.id === escrowDrawerTxId)

  return (
    <>
      <div
        onClick={() => dispatch({ type: 'CLOSE_ESCROW_DRAWER' })}
        className="fixed inset-0 z-[80] bg-black/60 transition-opacity"
      />
      <div className="fixed right-0 top-0 bottom-0 z-[85] w-full max-w-md bg-dark-800 border-l border-dark-600 overflow-y-auto shadow-2xl animate-slide-in-right">
        <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm border-b border-dark-600 px-5 py-4 flex items-center justify-between z-10">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Shield size={18} className="text-purple-400" />
            Escrow Details
          </h3>
          <button
            onClick={() => dispatch({ type: 'CLOSE_ESCROW_DRAWER' })}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {tx ? (
          <div className="p-5 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={tx.user.avatar}
                alt=""
                className="w-14 h-14 rounded-full object-cover border-2 border-dark-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {tx.user.displayName}
                </p>
                <p className="text-gray-400 text-sm">@{tx.user.username}</p>
              </div>
            </div>

            {(() => {
              const cfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG.held
              const Icon = cfg.icon
              return (
                <div
                  className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className={cfg.color} />
                    <span className={`font-semibold text-sm ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{cfg.desc}</p>
                </div>
              )
            })()}

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Credits</span>
                <span className="text-white font-semibold">
                  {tx.credits} cr
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Follow Date</span>
                <span className="text-white">{tx.followDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Days Remaining</span>
                <span className="text-white">
                  {tx.daysRemaining > 0 ? `${tx.daysRemaining} days` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span
                  className={`capitalize font-medium ${STATUS_CONFIG[tx.status]?.color || 'text-white'}`}
                >
                  {tx.status}
                </span>
              </div>
              {tx.reason && (
                <div className="flex items-start gap-2 bg-red-400/10 border border-red-400/20 rounded-xl p-3 mt-2">
                  <AlertTriangle
                    size={16}
                    className="text-red-400 shrink-0 mt-0.5"
                  />
                  <p className="text-red-300 text-sm">{tx.reason}</p>
                </div>
              )}
            </div>

            <div className="border-t border-dark-600 pt-4">
              <h4 className="text-white text-sm font-semibold mb-3">
                Verification Timeline
              </h4>
              <div className="space-y-3">
                <TimelineItem
                  label="Follow initiated"
                  date={tx.followDate}
                  status="done"
                />
                <TimelineItem
                  label="Dwell time verified"
                  date={tx.followDate}
                  status="done"
                />
                <TimelineItem
                  label="30-day escrow started"
                  date={tx.followDate}
                  status={tx.status === 'held' ? 'active' : 'done'}
                />
                {tx.status === 'released' && (
                  <TimelineItem
                    label="Credits released"
                    date="Completed"
                    status="done"
                  />
                )}
                {tx.status === 'slashed' && (
                  <TimelineItem
                    label="Credits clawed back"
                    date="Penalty applied"
                    status="error"
                  />
                )}
                {tx.status === 'held' && (
                  <TimelineItem
                    label={`Release in ${tx.daysRemaining} days`}
                    date="Pending"
                    status="pending"
                  />
                )}
              </div>
            </div>

            <a
              href={`https://instagram.com/${tx.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-dark-700 border border-dark-500 text-gray-300 rounded-xl hover:border-green-accent/50 hover:text-white transition-colors text-sm"
            >
              <ExternalLink size={14} /> View Profile
            </a>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-gray-400 text-sm">
              Select a transaction to view details.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

function TimelineItem({ label, date, status }) {
  const dotColor =
    status === 'done'
      ? 'bg-green-accent'
      : status === 'active'
        ? 'bg-amber-400 animate-pulse'
        : status === 'error'
          ? 'bg-red-400'
          : 'bg-dark-400'
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className="text-gray-500 text-xs">{date}</span>
      </div>
    </div>
  )
}
