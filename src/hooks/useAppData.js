import { useQuery, usePaginatedQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  NICHES,
  PLATFORMS,
  LOCATIONS,
  USERS,
  FEATURED_USER,
  TRIBES,
  QUESTS,
  ESCROW_TRANSACTIONS,
  CREDIT_HISTORY,
  USER_STATS,
} from '../data/mockData'

function useWithFallback(queryRef, fallback) {
  const data = useQuery(queryRef)
  return data ?? fallback
}

export const useNiches = () => useWithFallback(api.data.getNiches, NICHES)
export const usePlatforms = () =>
  useWithFallback(api.data.getPlatforms, PLATFORMS)
export const useLocations = () =>
  useWithFallback(api.data.getLocations, LOCATIONS)
export const useUsers = () => useWithFallback(api.data.getUsers, USERS)
export const useFeaturedUser = () =>
  useWithFallback(api.data.getFeaturedUser, FEATURED_USER)
export const useTribes = () => useWithFallback(api.data.getTribes, TRIBES)
export const useQuests = () => useWithFallback(api.data.getQuests, QUESTS)
export const useEscrowTransactions = () =>
  useWithFallback(api.data.getEscrowTransactions, ESCROW_TRANSACTIONS)
export const useCreditHistory = () =>
  useWithFallback(api.data.getCreditHistory, CREDIT_HISTORY)
export const useUserStats = () =>
  useWithFallback(api.data.getUserStats, USER_STATS)

export function useSearchUsers(filters) {
  const args = {}
  if (filters.niche && filters.niche !== 'all') args.niche = filters.niche
  if (filters.platform && filters.platform !== 'all')
    args.platform = filters.platform
  if (filters.tier && filters.tier !== 'all') args.tier = filters.tier
  if (filters.location && filters.location !== 'all')
    args.location = filters.location
  if (filters.search) args.search = filters.search

  const { results, status, loadMore } = usePaginatedQuery(
    api.data.searchUsers,
    args,
    { initialNumItems: 12 },
  )

  return { results: results ?? [], status, loadMore }
}

export function useSavedSearches() {
  const data = useQuery(api.data.getSavedSearches)
  return data ?? []
}

export function useSaveSearch() {
  return useMutation(api.data.saveSearch)
}

export function useDeleteSearch() {
  return useMutation(api.data.deleteSearch)
}

export function useRecommendations() {
  const data = useQuery(api.data.getRecommendations)
  return data ?? USERS.slice(0, 6)
}

export function useOwnerProfile() {
  // Returns:
  //   undefined → loading
  //   null      → unauthenticated (no signed-up user)
  //   { userId, email, profile }
  return useQuery(api.ownerProfile.getOwnerProfile)
}

export function useSetOwnerProfile() {
  return useMutation(api.ownerProfile.setOwnerProfile)
}
