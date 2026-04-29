import { useMemo, useState } from 'react'
import {
  Plus,
  ShoppingBag,
  Repeat2,
  Eye,
  ExternalLink,
  Bell,
  Sparkles,
} from 'lucide-react'
import { useAppContext } from '../context/useAppContext'
import { platformLabel } from '../utils/platformDetect'
import { useAuthGuard } from '../context/useAuthGuard'
import PostLinkModal from './PostLinkModal'

const PLATFORM_ORDER = [
  'instagram',
  'twitter',
  'tiktok',
  'youtube',
  'linkedin',
  'threads',
]

export default function PostedAccountsSection() {
  const {
    f4fPosts,
    postFollows,
    setPostFollow,
    openLinkViewer,
    pendingFollowBacks,
    consumeFollowBack,
    userStats,
  } = useAppContext()
  const { requireAuth } = useAuthGuard()
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [activePlatform, setActivePlatform] = useState('all')

  const linkPosts = useMemo(
    () => f4fPosts.filter(p => p.type === 'link'),
    [f4fPosts],
  )

  const platforms = useMemo(() => {
    const present = new Set(linkPosts.map(p => p.platform))
    return PLATFORM_ORDER.filter(p => present.has(p))
  }, [linkPosts])

  const filtered = useMemo(() => {
    if (activePlatform === 'all') return linkPosts
    return linkPosts.filter(p => p.platform === activePlatform)
  }, [linkPosts, activePlatform])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const p of filtered) {
      if (!map.has(p.platform)) map.set(p.platform, [])
      map.get(p.platform).push(p)
    }
    return Array.from(map.entries()).sort(
      ([a], [b]) => PLATFORM_ORDER.indexOf(a) - PLATFORM_ORDER.indexOf(b),
    )
  }, [filtered])

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
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
          className="shrink-0 inline-flex items-center gap-1.5 bg-blue-accent text-dark-900 text-sm font-semibold rounded-xl px-3 py-2 hover:bg-blue-accent/90"
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

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
        <PlatformChip
          id="all"
          label="All"
          icon="🌐"
          count={linkPosts.length}
          active={activePlatform === 'all'}
          onClick={() => setActivePlatform('all')}
        />
        {platforms.map(p => (
          <PlatformChip
            key={p}
            id={p}
            label={platformLabel(p)}
            count={linkPosts.filter(post => post.platform === p).length}
            active={activePlatform === p}
            onClick={() => setActivePlatform(p)}
          />
        ))}
      </div>

      <div className="space-y-5">
        {grouped.map(([platform, posts]) => (
          <div key={platform}>
            <h4 className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">
              {platformLabel(platform)}{' '}
              <span className="text-gray-600 normal-case">({posts.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {posts.map(post => (
                <PostedAccountRow
                  key={post.id}
                  post={post}
                  follow={postFollows[post.id]}
                  userFollowers={userStats.followers ?? 0}
                  onToggle={followed => setPostFollow(post, followed)}
                  onOpen={() => openLinkViewer(post.id)}
                />
              ))}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="bg-dark-800 border border-dashed border-dark-500 rounded-2xl p-6 text-center">
            <p className="text-gray-300 text-sm font-medium">
              No accounts posted yet for this platform.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Be the first — paste your profile link to get reciprocal follows.
            </p>
          </div>
        )}
      </div>

      <PostLinkModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
      />
    </div>
  )
}

function PlatformChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-blue-accent/15 border-blue-accent text-blue-accent'
          : 'bg-dark-700 border-dark-500 text-gray-300 hover:text-white'
      }`}
    >
      {label}
      <span
        className={`text-[10px] px-1.5 rounded-full ${active ? 'bg-blue-accent/20' : 'bg-dark-600'}`}
      >
        {count}
      </span>
    </button>
  )
}

function PostedAccountRow({ post, follow, userFollowers, onToggle, onOpen }) {
  const isFollowing = !!follow?.followed
  const isCounted = !!follow?.counted
  const meetsRequirement =
    post.paid || !post.minFollowers || userFollowers >= post.minFollowers

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 flex items-start gap-3 card-hover">
      <label className="shrink-0 mt-1 inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isFollowing}
          onChange={e => onToggle(e.target.checked)}
          aria-label={isFollowing ? 'Mark as unfollowed' : 'Mark as followed'}
          className="w-5 h-5 rounded-md border-2 border-dark-400 bg-dark-700 accent-blue-accent cursor-pointer"
        />
      </label>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-white text-sm font-semibold truncate">
            @{post.username}
          </p>
          {post.paid ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/40">
              <ShoppingBag size={10} /> Buy
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-accent/15 text-blue-accent border border-blue-accent/40">
              <Repeat2 size={10} /> F4F
            </span>
          )}
          {isFollowing && !isCounted && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-dark-600 text-amber-300">
              not counted
            </span>
          )}
        </div>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
          {post.description}
        </p>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
          {!post.paid && post.minFollowers > 0 && (
            <span className={meetsRequirement ? '' : 'text-amber-400'}>
              min {post.minFollowers.toLocaleString()} followers
            </span>
          )}
          {!post.paid && post.rewardCredits > 0 && (
            <span className="text-blue-accent">+{post.rewardCredits} cr</span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center gap-1 text-xs font-medium bg-dark-700 border border-dark-500 text-gray-200 hover:text-white hover:border-blue-accent/40 rounded-lg px-2.5 py-1.5"
        >
          <Eye size={12} /> Open
        </button>
        <a
          href={post.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-accent"
          aria-label="Open externally"
          title="Open externally"
        >
          <ExternalLink size={11} />
        </a>
      </div>
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
        <p className="text-white text-xs font-semibold leading-tight">
          @{fb.user.username}
        </p>
        <p className="text-gray-500 text-[10px] leading-tight">
          followed you · {platformLabel(fb.platform)}
        </p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="ml-1 inline-flex items-center gap-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-pink-500 to-amber-400 text-dark-900 px-2.5 py-1.5 follow-back-pulse"
      >
        Follow back
      </button>
    </div>
  )
}
