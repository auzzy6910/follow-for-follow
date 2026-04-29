import { useEffect, useMemo, useState } from 'react'
import {
  X,
  ExternalLink,
  Heart,
  HeartOff,
  ShieldAlert,
  ShoppingBag,
  Repeat2,
} from 'lucide-react'
import { useAppContext } from '../context/useAppContext'
import { platformLabel } from '../utils/platformDetect'

// Most social platforms send X-Frame-Options: DENY/SAMEORIGIN, so the embedded
// iframe usually fails to render. We attempt the embed, and fall back to a
// link card after a short timeout if the frame never loads.
const FRAME_LOAD_TIMEOUT_MS = 4500

export default function InSiteLinkViewer() {
  const {
    linkViewerPostId,
    closeLinkViewer,
    f4fPosts,
    postFollows,
    setPostFollow,
    userStats,
  } = useAppContext()

  const post = useMemo(
    () => f4fPosts.find(p => p.id === linkViewerPostId) || null,
    [f4fPosts, linkViewerPostId],
  )

  const [frameLoaded, setFrameLoaded] = useState(false)
  const [frameTimedOut, setFrameTimedOut] = useState(false)
  const [trackedPostId, setTrackedPostId] = useState(linkViewerPostId)

  // Reset frame state during render when the open post changes — avoids
  // cascading effect-based setState (React 19 strict mode).
  if (linkViewerPostId !== trackedPostId) {
    setTrackedPostId(linkViewerPostId)
    setFrameLoaded(false)
    setFrameTimedOut(false)
  }

  useEffect(() => {
    if (!post) return undefined
    const t = setTimeout(() => {
      setFrameTimedOut(true)
    }, FRAME_LOAD_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [post])

  if (!post) return null

  const isFollowing = !!postFollows[post.id]?.followed
  const isCounted = !!postFollows[post.id]?.counted
  const userFollowers = userStats.followers ?? 0
  const meetsRequirement =
    post.paid || !post.minFollowers || userFollowers >= post.minFollowers

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-6 bg-black/80">
      <div onClick={closeLinkViewer} className="absolute inset-0" aria-hidden />
      <div className="relative w-full max-w-3xl h-[90vh] bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-dark-600">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-gray-400 shrink-0">
              {platformLabel(post.platform)}
            </span>
            <h3 className="text-gray-900 text-sm sm:text-base font-semibold truncate">
              @{post.username}
            </h3>
            {post.paid ? (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/40">
                <ShoppingBag size={10} /> Buy
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-accent/15 text-blue-accent border border-blue-accent/40">
                <Repeat2 size={10} /> F4F
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={post.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 p-1"
              aria-label="Open in new tab"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={closeLinkViewer}
              className="text-gray-400 hover:text-gray-900 p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="relative flex-1 bg-dark-900">
          <iframe
            key={post.id}
            src={post.profileUrl}
            title={`${post.username} on ${post.platform}`}
            className="absolute inset-0 w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setFrameLoaded(true)}
          />
          {!frameLoaded && frameTimedOut && (
            <FrameFallback post={post} />
          )}
        </div>

        <footer className="border-t border-dark-600 px-4 sm:px-5 py-3 bg-dark-800">
          {!post.paid && post.minFollowers > 0 && (
            <div
              className={`flex items-start gap-2 text-xs mb-3 px-3 py-2 rounded-xl ${
                meetsRequirement
                  ? 'bg-blue-accent/10 border border-blue-accent/30 text-blue-accent'
                  : 'bg-amber-400/10 border border-amber-400/40 text-amber-300'
              }`}
            >
              <ShieldAlert size={14} className="mt-0.5 shrink-0" />
              <p>
                {meetsRequirement ? (
                  <>
                    You meet the requirement of{' '}
                    <strong>{post.minFollowers.toLocaleString()}+</strong>{' '}
                    followers — your follow will be counted and earn{' '}
                    <strong>{post.rewardCredits} cr</strong>.
                  </>
                ) : (
                  <>
                    Requires <strong>{post.minFollowers.toLocaleString()}+</strong>{' '}
                    followers — you have {userFollowers.toLocaleString()}. Your
                    follow will go through but won't be counted.
                  </>
                )}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400 flex-1 line-clamp-2">
              {post.description}
            </p>
            <button
              onClick={() => setPostFollow(post, !isFollowing)}
              className={`shrink-0 inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2 transition-colors ${
                isFollowing
                  ? 'bg-dark-600 text-gray-800 hover:bg-dark-500'
                  : 'bg-blue-accent text-white hover:bg-blue-accent/90'
              }`}
            >
              {isFollowing ? (
                <>
                  <HeartOff size={14} /> I unfollowed
                </>
              ) : (
                <>
                  <Heart size={14} /> I followed
                </>
              )}
            </button>
          </div>
          {isFollowing && (
            <p className="mt-2 text-[11px] text-gray-500">
              {isCounted
                ? 'Counted toward credits — checkbox is ticked.'
                : "Followed but not counted (didn't meet requirements)."}
            </p>
          )}
        </footer>
      </div>
    </div>
  )
}

function FrameFallback({ post }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-dark-900">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-accent/30 to-cyan-400/20 flex items-center justify-center text-blue-accent text-2xl font-bold">
        @
      </div>
      <h4 className="mt-3 text-gray-900 font-semibold">@{post.username}</h4>
      <p className="text-gray-400 text-xs mt-1 capitalize">
        {platformLabel(post.platform)}
      </p>
      <p className="text-gray-500 text-xs mt-3 max-w-sm">
        This site doesn't allow embedding inside Follow for Follow. Use the
        button below to open it in a new tab — when you come back, mark
        whether you followed.
      </p>
      <a
        href={post.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold bg-blue-accent text-white px-4 py-2 rounded-xl hover:bg-blue-accent/90"
      >
        <ExternalLink size={14} /> Open in new tab
      </a>
    </div>
  )
}
