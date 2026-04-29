import { useState } from 'react'
import { UserPlus } from 'lucide-react'

const PLATFORMS = [
  { id: 'all', label: 'All Platforms' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'threads', label: 'Threads' },
]

export default function FollowBackPlatformBanner() {
  const [activePlatform, setActivePlatform] = useState('all')

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-[#af101a] text-white px-4 sm:px-5 py-3 sm:py-4 shadow-sm">
        <div className="shrink-0 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
          <UserPlus size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm sm:text-base leading-tight">Follow Back Banner</p>
          <p className="text-white/85 text-xs sm:text-sm mt-0.5 truncate">
            @SarahStyle just followed you! Follow back to earn 50 cr.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 bg-white text-[#af101a] font-bold text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2 hover:bg-white/90 transition-colors"
        >
          Follow <span className="hidden sm:inline">@SarahStyle</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PLATFORMS.map(p => {
          const active = activePlatform === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePlatform(p.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors ${
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
