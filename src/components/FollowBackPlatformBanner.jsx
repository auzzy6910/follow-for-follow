import { useState } from 'react'

const FOLLOWER_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'

const PLATFORMS = [
  { id: 'all', label: 'All Platforms' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'threads', label: 'Threads' },
]

export default function FollowBackPlatformBanner({
  activePlatform: activePlatformProp,
  onPlatformChange,
}) {
  const [internalPlatform, setInternalPlatform] = useState('all')
  const isControlled =
    activePlatformProp !== undefined && onPlatformChange !== undefined
  const activePlatform = isControlled ? activePlatformProp : internalPlatform
  const setActivePlatform = isControlled ? onPlatformChange : setInternalPlatform

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5 sm:gap-6 rounded-3xl bg-[#af101a] text-white px-6 sm:px-8 py-6 sm:py-8 shadow-lg">
        <img
          src={FOLLOWER_AVATAR}
          alt="@SarahStyle"
          className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-white/70"
        />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-xl sm:text-3xl leading-tight">Follow back</p>
          <p className="text-white/90 text-base sm:text-lg mt-1.5">
            @SarahStyle just followed you! Follow back to earn 50 cr.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 bg-white text-[#af101a] font-bold text-base sm:text-lg rounded-2xl px-5 sm:px-7 py-3 sm:py-4 hover:bg-white/90 transition-colors"
        >
          Follow <span className="hidden sm:inline">@SarahStyle</span>
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {PLATFORMS.map(p => {
          const active = activePlatform === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePlatform(p.id)}
              className={`shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold border transition-colors ${
                active
                  ? 'bg-[#af101a] text-white border-[#af101a]'
                  : 'bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
