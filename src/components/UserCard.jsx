import { BadgeCheck, Loader, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNiches, usePlatforms, useUsers } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'

const tierRing = {
  rookie: 'from-gray-400 via-gray-500 to-gray-400',
  influencer: 'from-fuchsia-500 via-pink-500 to-amber-400',
  legend: 'from-amber-400 via-pink-500 to-fuchsia-600',
}

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
  return `${n}`
}

export default function UserCard({ user }) {
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const ALL_USERS = useUsers()
  const {
    followUser,
    activeFollows,
    pendingFollowBacks,
    consumeFollowBack,
  } = useAppContext()
  const { requireAuth } = useAuthGuard()

  const isFollowing = !!activeFollows[user.id]
  const niche = NICHES.find(n => n.id === user.niche)
  const platform = PLATFORMS.find(p => p.id === user.platform)
  const owedFollowBack = pendingFollowBacks.find(fb => fb.user.id === user.id)

  const profileHref = `/profile/${user.id}`

  const handleFollow = () => {
    requireAuth(() => followUser(user, ALL_USERS))
  }

  const handleFollowBack = () => {
    requireAuth(() => {
      followUser(user, ALL_USERS)
      if (owedFollowBack) consumeFollowBack(owedFollowBack.id)
    })
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl card-hover flex flex-col items-center text-center px-3 sm:px-5 pt-5 sm:pt-6 pb-4 sm:pb-5 transition-colors hover:border-blue-accent/40">
      {/* Avatar — clicking navigates to the user's profile */}
      <Link
        to={profileHref}
        aria-label={`Open ${user.displayName}'s profile`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent rounded-full"
      >
        <div className={`p-[2px] sm:p-[3px] rounded-full bg-gradient-to-tr ${tierRing[user.tier] || tierRing.rookie}`}>
          <div className="bg-dark-800 p-[2px] rounded-full">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover cursor-pointer"
            />
          </div>
        </div>
      </Link>

      {/* Username + display name + stats — also link to the profile so the
          whole card box (apart from the action buttons) is clickable. */}
      <Link
        to={profileHref}
        className="w-full mt-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent rounded-lg"
      >
        <div className="flex items-center justify-center gap-1 min-w-0 w-full">
          <h4 className="text-white text-sm sm:text-base font-semibold truncate min-w-0 group-hover:text-blue-accent transition-colors">
            {user.username}
          </h4>
          {user.isVerified && (
            <BadgeCheck size={16} className="text-sky-400 fill-sky-400/20 shrink-0" />
          )}
        </div>

        <p className="text-gray-300 text-[11px] sm:text-xs font-medium truncate w-full">
          {user.displayName}
        </p>

        <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1 w-full text-white">
          <Stat value={formatCount(user.posts ?? 0)} label="posts" />
          <Stat value={formatCount(user.followers)} label="followers" />
          <Stat value={formatCount(user.following ?? 0)} label="following" />
        </div>

        {user.bio && (
          <p className="hidden sm:block mt-3 text-gray-400 text-[11px] leading-snug line-clamp-2 w-full">
            {user.bio}
          </p>
        )}

        <div className="mt-2 sm:mt-3 hidden sm:flex items-center justify-center gap-1.5 flex-wrap">
          {niche && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${niche.color}20`, color: niche.color }}
            >
              {niche.icon} {niche.name}
            </span>
          )}
          {platform && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dark-600 text-gray-300">
              {platform.icon} {platform.name}
            </span>
          )}
        </div>

        {user.location && (
          <div className="hidden sm:flex items-center justify-center gap-1 mt-1.5 text-[10px] text-gray-500">
            <MapPin size={10} />
            <span className="truncate">{user.location}</span>
          </div>
        )}
      </Link>

      {/* Follow / Follow back / Profile buttons (Instagram-style) */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2 w-full">
        <button
          onClick={handleFollow}
          disabled={isFollowing}
          className={`flex-1 min-w-0 text-[12px] sm:text-sm font-semibold py-1.5 sm:py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
            isFollowing
              ? 'bg-dark-600 text-gray-300 hover:bg-dark-500'
              : 'bg-sky-500 text-white hover:bg-sky-400'
          }`}
        >
          {isFollowing ? (
            <>
              <Loader size={14} className="animate-spin" />
              <span>Following</span>
            </>
          ) : (
            <span>Follow</span>
          )}
        </button>
        {owedFollowBack && !isFollowing && (
          <button
            onClick={handleFollowBack}
            className="flex-1 min-w-0 text-[12px] sm:text-sm font-bold py-1.5 sm:py-2 px-2 rounded-lg bg-gradient-to-r from-pink-500 to-amber-400 text-dark-900 hover:opacity-90 follow-back-pulse"
            title="They followed you — follow back"
          >
            Follow back
          </button>
        )}
        <Link
          to={profileHref}
          className="flex-1 min-w-0 text-[12px] sm:text-sm font-semibold py-1.5 sm:py-2 px-2 rounded-lg bg-dark-600 text-white hover:bg-dark-500 transition-colors text-center"
        >
          Profile
        </Link>
      </div>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-0">
      <span className="text-white text-sm sm:text-base font-bold leading-tight truncate max-w-full">
        {value}
      </span>
      <span className="text-gray-500 text-[10px] sm:text-xs leading-tight">{label}</span>
    </div>
  )
}
