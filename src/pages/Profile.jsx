import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  Coins,
  Grid3x3,
  Loader,
  MapPin,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  Users,
  UserSquare2,
} from 'lucide-react'
import {
  useNiches,
  usePlatforms,
  useUsers,
  useFeaturedUser,
} from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'
import CreatePostModal from '../components/CreatePostModal'

const tierRing = {
  rookie: 'from-gray-400 via-gray-500 to-gray-400',
  influencer: 'from-fuchsia-500 via-pink-500 to-amber-400',
  legend: 'from-amber-400 via-pink-500 to-fuchsia-600',
}

function formatCount(n) {
  if (n == null) return '0'
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
  return `${n}`
}

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop',
]

const HIGHLIGHTS = [
  { id: 'recent', label: 'Recent', emoji: '✨' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
]

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const ALL_USERS = useUsers()
  const FEATURED = useFeaturedUser()
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const { followUser, activeFollows, f4fPosts } = useAppContext()
  const { requireAuth } = useAuthGuard()
  const [activeTab, setActiveTab] = useState('f4f')
  const [createOpen, setCreateOpen] = useState(false)

  const user = useMemo(() => {
    if (FEATURED && FEATURED.id === userId) return FEATURED
    return ALL_USERS.find(u => u.id === userId)
  }, [ALL_USERS, FEATURED, userId])

  const gridPosts = useMemo(() => {
    if (!user) return []
    const seed = [...user.id].reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return Array.from({ length: 12 }, (_, i) => ({
      id: `${user.id}-grid-${i}`,
      image: POST_IMAGES[(seed + i) % POST_IMAGES.length],
      likes: ((seed * (i + 7)) % 4900) + 100,
      comments: ((seed * (i + 3)) % 480) + 8,
    }))
  }, [user])

  const userF4FPosts = useMemo(() => {
    if (!user) return []
    return f4fPosts.filter(p => p.creatorId === user.id)
  }, [f4fPosts, user])

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-gray-400">User not found.</p>
        <Link to="/explore" className="text-sky-400 hover:underline text-sm">
          Back to Explore
        </Link>
      </div>
    )
  }

  const niche = NICHES.find(n => n.id === user.niche)
  const platform = PLATFORMS.find(p => p.id === user.platform)
  const isFollowing = !!activeFollows[user.id]
  const isOwnProfile = FEATURED?.id === user.id

  const handleFollow = () => {
    requireAuth(() => followUser(user, ALL_USERS))
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
        <button className="text-gray-400 hover:text-white">
          <SettingsIcon size={18} />
        </button>
      </div>

      {/* Profile header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-6">
        <div
          className={`p-[3px] rounded-full bg-gradient-to-tr ${tierRing[user.tier] || tierRing.rookie} shrink-0`}
        >
          <div className="bg-dark-900 p-[3px] rounded-full">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 w-full">
          {/* Username row */}
          <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-4 justify-center md:justify-start">
            <div className="flex items-center gap-1.5">
              <h1 className="text-white text-xl sm:text-2xl font-light">
                {user.username}
              </h1>
              {user.isVerified && (
                <BadgeCheck
                  size={20}
                  className="text-sky-400 fill-sky-400/20 shrink-0"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  onClick={() => setCreateOpen(true)}
                  className="text-sm font-semibold py-1.5 px-4 rounded-lg bg-green-accent text-dark-900 hover:bg-green-accent/90 transition-colors flex items-center gap-1.5"
                >
                  <Plus size={14} /> New F4F post
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={isFollowing}
                  className={`text-sm font-semibold py-1.5 px-4 rounded-lg transition-colors flex items-center gap-1 ${
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
              )}
              <button className="text-sm font-semibold py-1.5 px-4 rounded-lg bg-dark-600 text-white hover:bg-dark-500 transition-colors">
                Message
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex justify-center md:justify-start gap-6 sm:gap-10 mb-3 md:mb-4 text-white">
            <div className="text-center md:text-left">
              <span className="font-bold">{userF4FPosts.length}</span>
              <span className="text-gray-400 text-sm ml-1">F4F posts</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-bold">{formatCount(user.followers)}</span>
              <span className="text-gray-400 text-sm ml-1">followers</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-bold">
                {formatCount(user.following ?? 0)}
              </span>
              <span className="text-gray-400 text-sm ml-1">following</span>
            </div>
          </div>

          {/* Display name + bio */}
          <div className="text-center md:text-left">
            <p className="text-white font-semibold text-sm">
              {user.displayName}
            </p>
            {niche && (
              <p className="text-gray-300 text-sm mt-0.5">
                <span style={{ color: niche.color }}>
                  {niche.icon} {niche.name}
                </span>
                {platform && (
                  <span className="text-gray-500">
                    {' · '}
                    {platform.icon} {platform.name}
                  </span>
                )}
              </p>
            )}
            {user.bio && (
              <p className="text-gray-300 text-sm mt-1 whitespace-pre-line">
                {user.bio}
              </p>
            )}
            {user.location && (
              <p className="flex items-center justify-center md:justify-start gap-1 text-gray-500 text-xs mt-1">
                <MapPin size={12} /> {user.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 mb-2 px-1">
        {HIGHLIGHTS.map(h => (
          <div key={h.id} className="flex flex-col items-center gap-1 shrink-0">
            <div className="p-[2px] rounded-full bg-gradient-to-tr from-gray-500 to-gray-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-dark-700 flex items-center justify-center text-2xl">
                {h.emoji}
              </div>
            </div>
            <span className="text-gray-300 text-xs">{h.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-t border-dark-600 flex justify-center gap-8 sm:gap-12 mt-2">
        <TabButton
          active={activeTab === 'f4f'}
          onClick={() => setActiveTab('f4f')}
          icon={<Sparkles size={14} />}
          label="F4F Posts"
        />
        <TabButton
          active={activeTab === 'grid'}
          onClick={() => setActiveTab('grid')}
          icon={<Grid3x3 size={14} />}
          label="Grid"
        />
        <TabButton
          active={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
          icon={<Bookmark size={14} />}
          label="Saved"
        />
        <TabButton
          active={activeTab === 'tagged'}
          onClick={() => setActiveTab('tagged')}
          icon={<UserSquare2 size={14} />}
          label="Tagged"
        />
      </div>

      {/* Tab content */}
      {activeTab === 'f4f' && (
        <F4FPostsTab
          posts={userF4FPosts}
          niches={NICHES}
          platforms={PLATFORMS}
          isOwnProfile={isOwnProfile}
          onCreate={() => setCreateOpen(true)}
        />
      )}

      {activeTab === 'grid' && (
        <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-4">
          {gridPosts.map(post => (
            <div
              key={post.id}
              className="relative aspect-square overflow-hidden bg-dark-700 group cursor-pointer"
            >
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm font-semibold">
                <span>❤ {formatCount(post.likes)}</span>
                <span>💬 {formatCount(post.comments)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'saved' || activeTab === 'tagged') && (
        <div className="py-16 text-center text-gray-500 text-sm">
          Nothing here yet.
        </div>
      )}

      <CreatePostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaults={{ niche: user.niche, platform: user.platform }}
      />
    </div>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-3 text-xs font-semibold tracking-widest uppercase ${
        active
          ? 'text-white border-t border-white -mt-px'
          : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {icon} {label}
    </button>
  )
}

function F4FPostsTab({ posts, niches, platforms, isOwnProfile, onCreate }) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <Sparkles size={32} className="mx-auto text-gray-600 mb-2" />
        <p className="text-gray-400 text-sm">
          {isOwnProfile
            ? "You haven't posted any F4F offers yet."
            : "This user hasn't posted any F4F offers yet."}
        </p>
        {isOwnProfile && (
          <button
            onClick={onCreate}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg bg-green-accent text-dark-900 hover:bg-green-accent/90"
          >
            <Plus size={14} /> Create your first F4F post
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          niche={niches.find(n => n.id === post.niche)}
          platform={platforms.find(p => p.id === post.platform)}
        />
      ))}
    </div>
  )
}

function PostCard({ post, niche, platform }) {
  const filledPct = post.capacity
    ? Math.min(100, Math.round((post.filledCount / post.capacity) * 100))
    : 0
  const isClosed = post.status === 'closed' || post.filledCount >= post.capacity

  return (
    <Link
      to={`/posts/${post.id}`}
      className="block bg-dark-800 border border-dark-600 rounded-2xl p-4 hover:border-green-accent/40 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        {niche && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${niche.color}20`,
              color: niche.color,
            }}
          >
            {niche.icon} {niche.name}
          </span>
        )}
        {platform && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-dark-600 text-gray-300">
            {platform.icon} {platform.name}
          </span>
        )}
        {isClosed && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 ml-auto">
            Closed
          </span>
        )}
      </div>

      <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">
        {post.title}
      </h3>
      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
        {post.description}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-sky-400">
          <Users size={12} /> {formatCount(post.minFollowers)}+
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <Coins size={12} /> {post.rewardCredits} cr
        </span>
        <span className="text-gray-500 ml-auto">
          {post.filledCount}/{post.capacity}
        </span>
      </div>

      <div className="mt-2 w-full bg-dark-700 rounded-full h-1">
        <div
          className="bg-green-accent h-1 rounded-full"
          style={{ width: `${filledPct}%` }}
        />
      </div>
    </Link>
  )
}
