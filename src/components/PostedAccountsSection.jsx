import { useState } from 'react'
import { Plus, Bell, Sparkles } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'
import { platformLabel } from '../utils/platformDetect'
import { useAuthGuard } from '../context/useAuthGuard'
import PostLinkModal from './PostLinkModal'

export default function PostedAccountsSection() {
  const { pendingFollowBacks, consumeFollowBack } = useAppContext()
  const { requireAuth } = useAuthGuard()
  const [postModalOpen, setPostModalOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="min-w-0">
          <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
            <Sparkles size={16} className="text-blue-accent" /> Follow for Follow
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">
            Accounts posted by the community — open in-site, follow, and the
            checkbox auto-ticks.
          </p>
        </div>
        <button
          type="button"
          onClick={() => requireAuth(() => setPostModalOpen(true))}
          className="shrink-0 inline-flex items-center gap-1.5 bg-blue-accent text-white text-sm font-semibold rounded-xl px-3 py-2 hover:bg-blue-accent/90"
        >
          <Plus size={14} /> Post link
        </button>
      </div>

      {pendingFollowBacks.length > 0 && (
        <FollowBackBanner
          pending={pendingFollowBacks}
          onConsume={consumeFollowBack}
        />
      )}

      <PostLinkModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
      />
    </div>
  )
}

function FollowBackBanner({ pending, onConsume }) {
  return (
    <div className="mb-4 rounded-2xl border border-pink-500/40 bg-gradient-to-r from-pink-500/10 via-fuchsia-500/10 to-amber-400/10 p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2 text-pink-300 text-xs font-semibold uppercase tracking-wider">
        <Bell size={14} className="animate-pulse" />
        Follow back ({pending.length})
      </div>
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {pending.map(fb => (
          <FollowBackChip
            key={fb.id}
            fb={fb}
            onClick={() => {
              window.open(fb.profileUrl, '_blank', 'noopener')
              onConsume(fb.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function FollowBackChip({ fb, onClick }) {
  return (
    <div className="shrink-0 flex items-center gap-2 bg-dark-800/80 border border-pink-500/30 rounded-xl pl-2 pr-1 py-1">
      <img
        src={fb.user.avatar}
        alt=""
        className="w-7 h-7 rounded-full object-cover"
      />
      <div className="text-left">
        <p className="text-gray-900 text-xs font-semibold leading-tight">
          @{fb.user.username}
        </p>
        <p className="text-gray-500 text-[10px] leading-tight">
          followed you · {platformLabel(fb.platform)}
        </p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="ml-1 inline-flex items-center gap-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-pink-500 to-amber-400 text-white px-2.5 py-1.5 follow-back-pulse"
      >
        Follow back
      </button>
    </div>
  )
}
