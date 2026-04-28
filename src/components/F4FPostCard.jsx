import { Link } from 'react-router-dom'
import { Coins, Users } from 'lucide-react'
import { ENGAGEMENT_ASKS } from '../data/mockData'
import { useNiches, usePlatforms } from '../hooks/useAppData'

function formatCount(n) {
  if (n == null) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
  return `${n}`
}

export default function F4FPostCard({ post }) {
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const niche = NICHES.find(n => n.id === post.niche)
  const platform = PLATFORMS.find(p => p.id === post.platform)
  const asks = (post.engagementAsks || [])
    .map(id => ENGAGEMENT_ASKS.find(a => a.id === id))
    .filter(Boolean)

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group relative aspect-square overflow-hidden bg-dark-700 rounded-md sm:rounded-lg block"
    >
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />

      {/* Reward badge — top right */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-amber-500/95 text-dark-900 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow">
        <Coins size={11} />
        <span>{post.rewardCredits}</span>
      </div>

      {/* Niche/platform pill — top left */}
      {niche && (
        <div
          className="absolute top-1.5 left-1.5 text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-sm bg-black/40"
          style={{ color: niche.color }}
        >
          {niche.icon}
          {platform && <span className="ml-1 text-gray-200">{platform.icon}</span>}
        </div>
      )}

      {/* Hover / mobile-visible overlay with requirements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 sm:p-3 gap-1">
        <p className="text-white text-[11px] sm:text-xs font-semibold line-clamp-2 leading-tight">
          {post.title}
        </p>
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-200">
          <span className="flex items-center gap-0.5">
            <Users size={10} /> ≥{formatCount(post.minFollowers)}
          </span>
          <span className="text-gray-400">·</span>
          <span>{asks.length} ask{asks.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </Link>
  )
}
