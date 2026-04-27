import { useState } from 'react'
import { Search, Filter, MapPin, ChevronDown } from 'lucide-react'
import { useUsers, useNiches, usePlatforms } from '../hooks/useAppData'
import UserCard from '../components/UserCard'

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')
  const [showFilters, setShowFilters] = useState(true)
  const USERS = useUsers()
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()

  const filteredUsers = USERS.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesNiche = selectedNiche === 'all' || user.niche === selectedNiche
    const matchesPlatform = selectedPlatform === 'all' || user.platform === selectedPlatform
    const matchesTier = selectedTier === 'all' || user.tier === selectedTier
    return matchesSearch && matchesNiche && matchesPlatform && matchesTier
  })

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Explore Users</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Smart targeting: discover accounts in your niche</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-dark-700 border border-dark-500 rounded-xl text-gray-300 hover:text-white hover:border-green-accent/50 transition-colors shrink-0"
        >
          <Filter size={16} />
          <span className="text-sm hidden sm:inline">Filters</span>
          <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showFilters && (
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="relative">
            <Search size={18} className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username or display name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 sm:pl-10 sm:pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50"
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
