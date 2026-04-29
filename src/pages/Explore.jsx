import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, Filter, MapPin, ChevronDown, Loader, Bookmark } from 'lucide-react'
import {
  useNiches,
  usePlatforms,
  useLocations,
  useSearchUsers,
  useSaveSearch,
  useUsers,
} from '../hooks/useAppData'
import UserCard from '../components/UserCard'

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('all')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedTier, setSelectedTier] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showFilters, setShowFilters] = useState(true)
  const [saveLabel, setSaveLabel] = useState('')
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const LOCATIONS = useLocations()
  const saveSearch = useSaveSearch()
  const sentinelRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const filters = useMemo(
    () => ({
      niche: selectedNiche,
      platform: selectedPlatform,
      tier: selectedTier,
      location: selectedLocation,
      search: debouncedSearch,
    }),
    [selectedNiche, selectedPlatform, selectedTier, selectedLocation, debouncedSearch],
  )

  const { results: filteredUsers, status, loadMore } = useSearchUsers(filters)

  const ALL_USERS = useUsers()

  const handleLoadMore = useCallback(() => {
    if (status === 'CanLoadMore') loadMore(12)
  }, [status, loadMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) handleLoadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleLoadMore])

  const hasActiveFilters =
    selectedNiche !== 'all' ||
    selectedPlatform !== 'all' ||
    selectedTier !== 'all' ||
    selectedLocation !== 'all' ||
    debouncedSearch !== ''

  const handleSaveSearch = async () => {
    if (!hasActiveFilters) return
    const parts = []
    if (selectedNiche !== 'all') parts.push(selectedNiche)
    if (selectedPlatform !== 'all') parts.push(selectedPlatform)
    if (selectedTier !== 'all') parts.push(selectedTier)
    if (selectedLocation !== 'all') parts.push(selectedLocation)
    if (debouncedSearch) parts.push(`"${debouncedSearch}"`)
    const name = parts.join(' + ') || 'Saved search'
    await saveSearch({
      name,
      niche: selectedNiche !== 'all' ? selectedNiche : undefined,
      platform: selectedPlatform !== 'all' ? selectedPlatform : undefined,
      tier: selectedTier !== 'all' ? selectedTier : undefined,
      location: selectedLocation !== 'all' ? selectedLocation : undefined,
      searchQuery: debouncedSearch || undefined,
    })
    setSaveLabel('Saved!')
    setTimeout(() => setSaveLabel(''), 2000)
  }

  const displayedUsers = filteredUsers.length > 0 ? filteredUsers : ALL_USERS

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Explore Users</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Smart targeting: discover accounts in your niche</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-dark-700 border border-dark-500 rounded-xl text-gray-300 hover:text-white hover:border-blue-accent/50 transition-colors shrink-0"
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
              className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 sm:pl-10 sm:pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Niche / Category</label>
              <select
                value={selectedNiche}
                onChange={e => setSelectedNiche(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-accent/50 appearance-none"
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
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-accent/50 appearance-none"
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
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-accent/50 appearance-none"
              >
                <option value="all">All Tiers</option>
                <option value="rookie">Rookie</option>
                <option value="influencer">Influencer</option>
                <option value="legend">Legend</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-accent/50 appearance-none"
                >
                  <option value="all">All Locations</option>
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <MapPin size={14} />
              <span>{selectedLocation !== 'all' ? selectedLocation : 'Showing all locations'}</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleSaveSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-accent border border-blue-accent/30 rounded-lg hover:bg-blue-accent/10 transition-colors"
              >
                <Bookmark size={14} />
                {saveLabel || 'Save Search'}
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-gray-400 text-sm">{displayedUsers.length} users found{status === 'CanLoadMore' ? ' (scroll for more)' : ''}</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        {displayedUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {status === 'LoadingMore' && (
        <div className="flex justify-center py-6">
          <Loader size={24} className="animate-spin text-blue-accent" />
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />

      {status === 'CanLoadMore' && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2.5 bg-dark-700 border border-dark-500 rounded-xl text-sm text-gray-300 hover:text-white hover:border-blue-accent/50 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {status === 'Exhausted' && displayedUsers.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-4">All users loaded</p>
      )}
    </div>
  )
}
