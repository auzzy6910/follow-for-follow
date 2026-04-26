import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  NICHES,
  PLATFORMS,
  USERS,
  FEATURED_USER,
  TRIBES,
  QUESTS,
  LEADERBOARD,
  ESCROW_TRANSACTIONS,
  GOLDEN_HOUR_SESSIONS,
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
export const useUsers = () => useWithFallback(api.data.getUsers, USERS)
export const useFeaturedUser = () =>
  useWithFallback(api.data.getFeaturedUser, FEATURED_USER)
export const useTribes = () => useWithFallback(api.data.getTribes, TRIBES)
export const useQuests = () => useWithFallback(api.data.getQuests, QUESTS)
export const useLeaderboard = () =>
  useWithFallback(api.data.getLeaderboard, LEADERBOARD)
export const useEscrowTransactions = () =>
  useWithFallback(api.data.getEscrowTransactions, ESCROW_TRANSACTIONS)
export const useGoldenHourSessions = () =>
  useWithFallback(api.data.getGoldenHourSessions, GOLDEN_HOUR_SESSIONS)
export const useCreditHistory = () =>
  useWithFallback(api.data.getCreditHistory, CREDIT_HISTORY)
export const useUserStats = () =>
  useWithFallback(api.data.getUserStats, USER_STATS)
