import { useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'
import {
  User, Mail, Shield, LogOut, Star, Coins, Flame, Trophy,
  Calendar, CheckCircle,
} from 'lucide-react'
import { useUserStats } from '../hooks/useAppData'
import { useAuthGuard } from '../context/useAuthGuard'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { isAuthenticated, openModal } = useAuthGuard()
  const { signOut } = useAuthActions()
  const convexUser = useQuery(api.users.currentUser)
  const USER_STATS = useUserStats()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-6">
          <User size={36} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Sign in to view your profile</h2>
        <p className="text-gray-400 text-sm mb-6">
          Create an account or sign in to access your profile, track your stats, and manage your account.
        </p>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-accent text-dark-900 font-semibold rounded-xl hover:brightness-110 transition-colors"
        >
          <User size={16} strokeWidth={2.5} />
          Sign in
        </button>
      </div>
    )
  }

  const displayName = convexUser?.name || convexUser?.email?.split('@')[0] || 'User'
  const email = convexUser?.email || '—'
  const initials = displayName.slice(0, 2).toUpperCase()

  const tierConfig = {
    rookie: { color: 'text-gray-400 border-gray-500 bg-gray-500/10', label: 'Rookie', icon: Star },
    influencer: { color: 'text-green-accent border-green-accent bg-green-accent/10', label: 'Influencer', icon: Trophy },
    legend: { color: 'text-amber-400 border-amber-400 bg-amber-400/10', label: 'Legend', icon: Trophy },
  }
  const tier = tierConfig[USER_STATS.tier] || tierConfig.rookie

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <User size={24} className="text-green-accent" /> My Profile
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Your account details and stats</p>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          {convexUser?.image ? (
            <img
              src={convexUser.image}
              alt={displayName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-green-accent object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-accent to-cyan-400 flex items-center justify-center text-dark-900 font-bold text-xl sm:text-2xl shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">{displayName}</h3>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-0.5">
              <Mail size={14} />
              <span className="truncate">{email}</span>
            </div>
            {convexUser?.emailVerified && (
              <div className="flex items-center gap-1 text-green-accent text-xs mt-1">
                <CheckCircle size={12} />
                Email verified
              </div>
            )}
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-6 ${tier.color}`}>
          <tier.icon size={14} />
          {tier.label}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-dark-700 rounded-xl p-3 text-center">
            <Coins size={18} className="text-green-accent mx-auto mb-1.5" />
            <p className="text-white font-bold text-lg">{USER_STATS.totalCredits.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Credits</p>
          </div>
          <div className="bg-dark-700 rounded-xl p-3 text-center">
            <User size={18} className="text-cyan-400 mx-auto mb-1.5" />
            <p className="text-white font-bold text-lg">{USER_STATS.totalFollowersGained.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Followers gained</p>
          </div>
          <div className="bg-dark-700 rounded-xl p-3 text-center">
            <Flame size={18} className="text-amber-400 mx-auto mb-1.5" />
            <p className="text-white font-bold text-lg">{USER_STATS.streak}</p>
            <p className="text-gray-500 text-xs">Day streak</p>
          </div>
          <div className="bg-dark-700 rounded-xl p-3 text-center">
            <Shield size={18} className="text-purple-400 mx-auto mb-1.5" />
            <p className="text-white font-bold text-lg">{USER_STATS.trustScore}%</p>
            <p className="text-gray-500 text-xs">Trust score</p>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Calendar size={18} /> Account Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-dark-600">
            <span className="text-gray-400 text-sm">Quality Score</span>
            <span className="text-white text-sm font-medium">{USER_STATS.qualityScore}/100</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dark-600">
            <span className="text-gray-400 text-sm">Follows Given</span>
            <span className="text-white text-sm font-medium">{USER_STATS.totalFollowsGiven.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dark-600">
            <span className="text-gray-400 text-sm">Daily Follow Limit</span>
            <span className="text-white text-sm font-medium">{USER_STATS.dailyFollowsRemaining}/{USER_STATS.dailyFollowLimit}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dark-600">
            <span className="text-gray-400 text-sm">Account Age</span>
            <span className="text-white text-sm font-medium">{USER_STATS.accountAge} days</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-400 text-sm">Unfollow Rate</span>
            <span className="text-white text-sm font-medium">{USER_STATS.unfollowRate}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/settings')}
          className="flex-1 py-2.5 bg-dark-700 border border-dark-500 text-gray-300 font-semibold rounded-xl hover:border-green-accent/50 hover:text-white transition-colors text-sm text-center"
        >
          Edit Settings
        </button>
        <button
          onClick={() => void signOut()}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
