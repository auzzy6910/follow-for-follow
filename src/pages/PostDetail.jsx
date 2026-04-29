import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Coins,
  Loader,
  MapPin,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import {
  useNiches,
  usePlatforms,
  useUsers,
  useFeaturedUser,
} from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'
import { ENGAGEMENT_OPTIONS } from '../data/mockData'

function formatCount(n) {
  if (n == null) return '0'
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`
  return `${n}`
}

function timeAgo(iso) {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const ALL_USERS = useUsers()
  const FEATURED = useFeaturedUser()
  const {
    f4fPosts,
    followUser,
    activeFollows,
    deleteF4FPost,
  } = useAppContext()
  const { requireAuth } = useAuthGuard()

  const post = useMemo(
    () => f4fPosts.find(p => p.id === postId),
    [f4fPosts, postId],
  )

  const creator = useMemo(() => {
    if (!post) return null
    if (FEATURED && FEATURED.id === post.creatorId) return FEATURED
    return ALL_USERS.find(u => u.id === post.creatorId)
  }, [ALL_USERS, FEATURED, post])

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-gray-400">Post not found.</p>
        <Link to="/explore" className="text-sky-400 hover:underline text-sm">
          Back to Explore
        </Link>
      </div>
    )
  }

  const niche = NICHES.find(n => n.id === post.niche)
  const platform = PLATFORMS.find(p => p.id === post.platform)
  const isOwnPost = creator?.id === FEATURED?.id
  const isFollowing = creator ? !!activeFollows[creator.id] : false
  const filledPct = post.capacity
    ? Math.min(100, Math.round((post.filledCount / post.capacity) * 100))
    : 0
  const isClosed = post.status === 'closed' || post.filledCount >= post.capacity

  const handleFollow = () => {
    if (!creator) return
    requireAuth(() => followUser(creator, ALL_USERS))
  }

  const handleDelete = () => {
    deleteF4FPost(post.id)
    navigate(`/profile/${creator.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top bar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 text-sm mb-4"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Card */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div
          className="h-2"
          style={{ backgroundColor: niche?.color || '#1e90ff' }}
        />

        <div className="p-5 sm:p-6">
          {/* Creator row */}
          {creator && (
            <Link
              to={`/profile/${creator.id}`}
              className="flex items-center gap-3 group"
            >
              <img
                src={creator.avatar}
                alt={creator.displayName}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-900 font-semibold text-sm group-hover:underline">
                    {creator.username}
                  </span>
                  {creator.isVerified && (
                    <BadgeCheck
                      size={14}
                      className="text-sky-400 fill-sky-400/20"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>{formatCount(creator.followers)} followers</span>
                  {creator.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> {creator.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span className="ml-auto text-[11px] text-gray-500">
                {timeAgo(post.createdAt)}
              </span>
            </Link>
          )}

          {/* Title + description */}
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            <h1 className="text-gray-900 text-xl sm:text-2xl font-bold">
              {post.title}
            </h1>
            {post.paid ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/40">
                BUY
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-accent/15 text-blue-accent border border-blue-accent/40">
                F4F
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm mt-2 leading-relaxed whitespace-pre-line">
            {post.description}
          </p>

          {/* Niche / platform pills */}
          <div className="flex items-center flex-wrap gap-2 mt-4">
            {niche && (
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${niche.color}20`,
                  color: niche.color,
                }}
              >
                {niche.icon} {niche.name}
              </span>
            )}
            {platform && (
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-dark-600 text-gray-700">
                {platform.icon} {platform.name}
              </span>
            )}
            {isClosed && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400">
                Closed
              </span>
            )}
          </div>

          {/* Requirements */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <RequirementCard
              icon={<Users size={16} className="text-sky-400" />}
              label="Min followers"
              value={formatCount(post.minFollowers)}
              hint="To qualify"
            />
            <RequirementCard
              icon={<Coins size={16} className="text-amber-400" />}
              label="Reward"
              value={`${post.rewardCredits} cr`}
              hint="On verified follow"
            />
            <RequirementCard
              icon={<Sparkles size={16} className="text-fuchsia-400" />}
              label="Capacity"
              value={`${post.filledCount}/${post.capacity}`}
              hint={`${filledPct}% filled`}
            />
          </div>

          {/* Capacity progress */}
          <div className="mt-3 w-full bg-dark-700 rounded-full h-1.5">
            <div
              className="bg-blue-accent h-1.5 rounded-full transition-[width] duration-500"
              style={{ width: `${filledPct}%` }}
            />
          </div>

          {/* Engagement asks */}
          <div className="mt-6">
            <h3 className="text-gray-900 text-sm font-semibold mb-2">
              Engagement asks
            </h3>
            <p className="text-gray-400 text-xs mb-3">
              Engage with the creator&apos;s last{' '}
              <span className="text-gray-900 font-medium">
                {post.postsToEngage}
              </span>{' '}
              {post.postsToEngage === 1 ? 'post' : 'posts'}.
            </p>
            <div className="flex flex-wrap gap-2">
              {(post.engagementAsks || []).map(id => {
                const opt = ENGAGEMENT_OPTIONS.find(o => o.id === id)
                if (!opt) return null
                return (
                  <span
                    key={id}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-accent/10 border border-blue-accent/30 text-blue-accent"
                  >
                    {opt.icon} {opt.label}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center gap-2">
            {isOwnPost ? (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 size={14} /> Delete post
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={isFollowing || isClosed}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isClosed
                    ? 'bg-dark-600 text-gray-400 cursor-not-allowed'
                    : isFollowing
                      ? 'bg-dark-600 text-gray-700'
                      : 'bg-sky-500 text-gray-900 hover:bg-sky-400'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Following…
                  </>
                ) : isClosed ? (
                  'Capacity reached'
                ) : (
                  <>
                    Follow @{creator?.username}
                    <span className="text-[11px] opacity-80">
                      · earn {post.rewardCredits} cr
                    </span>
                  </>
                )}
              </button>
            )}

            {creator && (
              <Link
                to={`/profile/${creator.id}`}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-dark-700 text-gray-900 hover:bg-dark-600"
              >
                View profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RequirementCard({ icon, label, value, hint }) {
  return (
    <div className="bg-dark-700 border border-dark-600 rounded-xl px-3 py-3">
      <div className="flex items-center gap-2 text-gray-400 text-[11px] uppercase tracking-wider font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1.5 text-gray-900 text-base font-bold">{value}</div>
      {hint && <div className="text-[11px] text-gray-500 mt-0.5">{hint}</div>}
    </div>
  )
}
