import { useState } from 'react'
import { Search, Filter, MapPin, Shield, Star, Users, ChevronDown } from 'lucide-react'
import { USERS, NICHES, PLATFORMS } from '../data/mockData'

function UserCard({ user, onFollow }) {
  const tierColors = {
    rookie: 'border-gray-500 text-gray-400',
    influencer: 'border-green-accent text-green-accent',
    legend: 'border-amber-400 text-amber-400',
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl overflow-hidden card-hover">
      <div className="relative h-24 sm:h-32">
        <img src={user.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${tierColors[user.tier]} bg-dark-900/80 capitalize`}>
            {user.tier}
          </span>
        </div>
      </div>
      <div className="px-4 pb-4 -mt-10 relative">
        <div className="flex items-end gap-3 mb-3">
          <img src={user.avatar} alt="" className={`w-16 h-16 rounded-full border-2 object-cover ${user.tier === 'legend' ? 'border-amber-400' : user.tier === 'influencer' ? 'border-green-accent' : 'border-dark-500'}`} />
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-white font-semibold truncate">{user.displayName}</h4>
              {user.isVerified && <Shield size={14} className="text-green-accent shrink-0" />}
            </div>
            <p className="text-gray-500 text-xs">@{user.username}</p>
          </div>
        </div>
        <p className="text-gray-400 text-xs line-clamp-2 mb-3">{user.bio}</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={12} />
            <span>{(user.followers / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Star size={12} />
            <span>Q: {user.qualityScore}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Shield size={12} />
            <span>Trust: {user.trustScore}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-dark-600 text-gray-300 px-2 py-0.5 rounded-full">
            {NICHES.find(n => n.id === user.niche)?.icon} {NICHES.find(n => n.id === user.niche)?.name}
          </span>
          <span className="text-xs bg-dark-600 text-gray-300 px-2 py-0.5 rounded-full">
            {PLATFORMS.find(p => p.id === user.platform)?.icon} {PLATFORMS.find(p => p.id === user.platform)?.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFollow(user.id)}
            className="flex-1 text-sm font-semibold bg-green-accent text-dark-900 py-2 rounded-xl hover:bg-green-accent/90 transition-colors"
          >
            Follow (+{Math.floor(user.qualityScore / 2)} cr)
          </button>
          <button className="px-3 py-2 text-sm font-medium border border-dark-500 text-gray-300 rounded-xl hover:border-green-accent/50 hover:text-green-accent transition-colors">
            Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const filteredUsers = USERS.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesNiche = selectedNiche === 'all' || user.niche === selectedNiche
    const matchesPlatform = selectedPlatform === 'all' || user.platform === selectedPlatform
    const matchesTier = selectedTier === 'all' || user.tier === selectedTier
    return matchesSearch && matchesNiche && matchesPlatform && matchesTier
  })

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Explore Users</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Smart targeting: discover accounts in your niche</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-dark-700 border border-dark-500 rounded-xl text-gray-300 hover:text-white hover:border-green-accent/50 transition-colors"
        >
          <Filter size={14} />
          <span className="text-xs sm:text-sm">Filters</span>
          <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showFilters && (
        <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username or display name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Niche / Category</label>
              <select
                value={selectedNiche}
                onChange={e => setSelectedNiche(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50 appearance-none"
              >
                <option value="all">All Niches</option>
                {NICHES.map(n => (
                  <option key={n.id} value={n.id}>{n.icon} {n.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Platform</label>
              <select
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50 appearance-none"
              >
                <option value="all">All Platforms</option>
                {PLATFORMS.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Tier</label>
              <select
                value={selectedTier}
                onChange={e => setSelectedTier(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50 appearance-none"
              >
                <option value="all">All Tiers</option>
                <option value="rookie">Rookie</option>
                <option value="influencer">Influencer</option>
                <option value="legend">Legend</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gray-500" />
            <span className="text-gray-500 text-xs">Location filter coming soon</span>
          </div>
        </div>
      )}

      <p className="text-gray-400 text-sm">{filteredUsers.length} users found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} onFollow={(id) => console.log('Follow', id)} />
        ))}
      </div>
    </div>
  )
}
