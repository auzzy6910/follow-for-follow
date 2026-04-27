import { Shield, Star, Users } from 'lucide-react'
import { useNiches, usePlatforms } from '../hooks/useAppData'

const tierColors = {
  rookie: 'border-gray-500 text-gray-400',
  influencer: 'border-green-accent text-green-accent',
  legend: 'border-amber-400 text-amber-400',
}

export default function UserCard({ user, onFollow }) {
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden card-hover">
      <div className="relative h-20 sm:h-32">
        <img src={user.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5">
          <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border ${tierColors[user.tier]} bg-dark-900/80 capitalize`}>
            {user.tier}
          </span>
        </div>
      </div>
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 -mt-6 sm:-mt-10 relative">
        <div className="flex items-end gap-2 sm:gap-3 mb-2 sm:mb-3 min-w-0">
          <img src={user.avatar} alt="" className={`w-11 h-11 sm:w-16 sm:h-16 rounded-full border-2 object-cover shrink-0 ${user.tier === 'legend' ? 'border-amber-400' : user.tier === 'influencer' ? 'border-green-accent' : 'border-dark-500'}`} />
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <h4 className="text-white text-xs sm:text-base font-semibold truncate min-w-0">{user.displayName}</h4>
              {user.isVerified && <Shield size={12} className="text-green-accent shrink-0" />}
            </div>
            <p className="text-gray-500 text-[11px] sm:text-xs truncate">@{user.username}</p>
          </div>
        </div>
        <p className="hidden sm:block text-gray-400 text-xs line-clamp-2 mb-3">{user.bio}</p>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-400">
            <Users size={12} />
            <span>{(user.followers / 1000).toFixed(1)}K</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
            <Star size={12} />
            <span>Q: {user.qualityScore}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
            <Shield size={12} />
            <span>Trust: {user.trustScore}%</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 mb-3">
          <span className="text-xs bg-dark-600 text-gray-300 px-2 py-0.5 rounded-full">
            {NICHES.find(n => n.id === user.niche)?.icon} {NICHES.find(n => n.id === user.niche)?.name}
          </span>
          <span className="text-xs bg-dark-600 text-gray-300 px-2 py-0.5 rounded-full">
            {PLATFORMS.find(p => p.id === user.platform)?.icon} {PLATFORMS.find(p => p.id === user.platform)?.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onFollow?.(user.id)}
            className="flex-1 min-w-0 text-[11px] sm:text-sm font-semibold bg-green-accent text-dark-900 py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl hover:bg-green-accent/90 transition-colors truncate"
          >
            Follow <span className="hidden sm:inline">(+{Math.floor(user.qualityScore / 2)} cr)</span>
          </button>
          <button className="px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium border border-dark-500 text-gray-300 rounded-lg sm:rounded-xl hover:border-green-accent/50 hover:text-green-accent transition-colors shrink-0">
            Profile
          </button>
        </div>
      </div>
    </div>
  )
}
