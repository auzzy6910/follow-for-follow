import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Coins,
  Loader,
  Trash2,
  Users,
} from 'lucide-react'
import { ENGAGEMENT_ASKS } from '../data/mockData'
import { useNiches, usePlatforms, useUsers, useFeaturedUser } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'

const tierRing = {
  rookie: 'from-gray-400 via-gray-500 to-gray-400',
  influencer: 'from-fuchsia-500 via-pink-500 to-amber-400',
  legend: 'from-amber-400 via-pink-500 to-fuchsia-600',
}

function formatCount(n) {
  if (n == null) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
  return `${n}`
}

function formatRelative(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export default function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const ALL_USERS = useUsers()
  const FEATURED = useFeaturedUser()
  const { posts, followUser, activeFollows, deletePost } = useAppContext()
  const { requireAuth } = useAuthGuard()

  const post = useMemo(() => posts.find(p => p.id === postId), [posts, postId])

  const author = useMemo(() => {
    if (!post) return null
    if (FEATURED && FEATURED.id === post.authorId) return FEATURED
    return ALL_USERS.find(u => u.id === post.authorId)
  }, [post, ALL_USERS, FEATURED])

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-gray-400 mb-2">Post not found.</p>
        <Link to="/explore" className="text-sky-400 hover:underline text-sm">
          Back to Explore
        </Link>
      </div>
    )
  }

  const niche = NICHES.find(n => n.id === post.niche)
  const platform = PLATFORMS.find(p => p.id === post.platform)
  const asks = (post.engagementAsks || [])
    .map(id => ENGAGEMENT_ASKS.find(a => a.id === id))
    .filter(Boolean)

  const isFollowing = author ? !!activeFollows[author.id] : false

  const handleFollow = () => {
    if (!author) return
    requireAuth(() => followUser(author, ALL_USERS))
  }

  const handleDelete = () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm('Delete this F4F post? This cannot be undone.')
      if (!ok) return
    }
    deletePost(post.id)
    if (author) {
      navigate(`/profile/${author.id}`)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-xs"
          aria-label="Delete post"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cover */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Details */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-6 flex flex-col">
          {/* Author */}
          {author && (
            <Link
              to={`/profile/${author.id}`}
              className="flex items-center gap-3 pb-4 mb-4 border-b border-dark-600 hover:opacity-90"
            >
              <div className={`p-[2px] rounded-full bg-gradient-to-tr ${tierRing[author.tier] || tierRing.rookie} shrink-0`}>
                <div className="bg-dark-800 p-[2px] rounded-full">
                  <img
                    src={author.avatar}
                    alt={author.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-white text-sm font-semibold">
                  <span className="truncate">@{author.username}</span>
                  {author.isVerified && (
                    <BadgeCheck size={14} className="text-sky-400 fill-sky-400/20 shrink-0" />
                  )}
                </div>
                <p className="text-gray-400 text-xs truncate">
                  {author.displayName} · {formatCount(author.followers)} followers
                </p>
              </div>
              <span className="text-gray-500 text-xs whitespace-nowrap">
                {formatRelative(post.createdAt)}
              </span>
            </Link>
          )}

          {/* Title + description */}
          <h1 className="text-white text-lg sm:text-xl font-semibold mb-2">{post.title}</h1>
          {post.description && (
            <p className="text-gray-300 text-sm whitespace-pre-line mb-4">{post.description}</p>
          )}

          {/* Niche / platform pills */}
          <div className="flex items-center flex-wrap gap-1.5 mb-4">
            {niche && (
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${niche.color}20`, color: niche.color }}
              >
                {niche.icon} {niche.name}
              </span>
            )}
            {platform && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-dark-600 text-gray-300">
                {platform.icon} {platform.name}
              </span>
            )}
          </div>

          {/* Requirements grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Stat
              icon={<Users size={14} className="text-sky-400" />}
              label="Min. followers"
              value={`≥ ${formatCount(post.minFollowers)}`}
            />
            <Stat
              icon={<Coins size={14} className="text-amber-400" />}
              label="Reward"
              value={`${post.rewardCredits} cr`}
            />
          </div>

          {/* Engagement asks */}
          <div className="mb-5">
            <p className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold mb-2">
              Engagement asks
            </p>
            <ul className="space-y-1.5">
              {asks.length === 0 ? (
                <li className="text-gray-500 text-sm italic">No specific asks.</li>
              ) : (
                asks.map(a => (
                  <li
                    key={a.id}
                    className="flex items-center gap-2 text-sm text-gray-200 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2"
                  >
                    <span className="text-base">{a.icon}</span>
                    <span>{a.label}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Follow CTA */}
          <div className="mt-auto">
            <button
              onClick={handleFollow}
              disabled={!author || isFollowing}
              className={`w-full text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isFollowing
                  ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                  : 'bg-sky-500 text-white hover:bg-sky-400'
              }`}
            >
              {isFollowing ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  <span>Following @{author?.username}…</span>
                </>
              ) : (
                <span>Follow @{author?.username || 'creator'}</span>
              )}
            </button>
            <p className="text-center text-gray-500 text-[11px] mt-2">
              Earn {post.rewardCredits} cr after the 30-day verification window.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div className="bg-dark-700 border border-dark-600 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-white text-base font-bold mt-1">{value}</p>
    </div>
  )
}
