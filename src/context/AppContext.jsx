import { useReducer, useCallback, useRef } from 'react'
import { ESCROW_TRANSACTIONS, CREDIT_HISTORY, USER_STATS, FEATURED_USER } from '../data/mockData'
import { AppContext } from './useAppContext'

const PLATFORM_URLS = {
  instagram: 'https://instagram.com/',
  twitter: 'https://x.com/',
  tiktok: 'https://tiktok.com/@',
  linkedin: 'https://linkedin.com/in/',
  youtube: 'https://youtube.com/@',
  threads: 'https://threads.net/@',
}

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const initialState = {
  userStats: { ...USER_STATS },
  creditHistory: [...CREDIT_HISTORY],
  escrowTransactions: ESCROW_TRANSACTIONS.map(tx => ({
    ...tx,
    reason: tx.status === 'slashed' ? 'Unfollowed within 30 days' : null,
  })),
  notifications: [],
  activeFollows: {},
  settings: {
    dwellTimeEnabled: true,
    dwellTimeDuration: 20,
    notifications: true,
    emailAlerts: false,
    autoVerify: true,
    darkMode: true,
    proxyProtection: true,
  },
  escrowDrawerOpen: false,
  escrowDrawerTxId: null,
  walletModal: null,
  claimedQuests: {},
  claimedStreaks: {},
  tierUpCelebration: null,
  qualityAudit: null,
  commentTemplates: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_FOLLOW':
      return {
        ...state,
        activeFollows: {
          ...state.activeFollows,
          [action.userId]: {
            startedAt: Date.now(),
            userId: action.userId,
            username: action.username,
            creditCost: action.creditCost,
            phase: 'dwell',
            dwellRequired: state.settings.dwellTimeEnabled
              ? state.settings.dwellTimeDuration
              : 0,
            dwellElapsed: 0,
            platformUrl: action.platformUrl,
          },
        },
      }

    case 'UPDATE_DWELL': {
      const follow = state.activeFollows[action.userId]
      if (!follow) return state
      return {
        ...state,
        activeFollows: {
          ...state.activeFollows,
          [action.userId]: {
            ...follow,
            dwellElapsed: action.elapsed,
          },
        },
      }
    }

    case 'COMPLETE_FOLLOW': {
      const follow = state.activeFollows[action.userId]
      if (!follow) return state
      const cost = follow.creditCost
      const isInNiche = action.targetUser.niche === FEATURED_USER.niche
      const multiplier = isInNiche ? 2 : 1
      const newEscrow = {
        id: generateId(),
        user: action.targetUser,
        credits: cost,
        status: 'held',
        daysRemaining: 30,
        followDate: new Date().toISOString().slice(0, 10),
        reason: null,
      }
      const newCreditEntry = {
        id: generateId(),
        type: 'spent',
        amount: cost,
        action: `Followed ${action.targetUser.displayName} (escrow)`,
        timestamp: 'Just now',
      }
      const baseEarn = Math.floor(cost * 0.5)
      const earnAmount = baseEarn * multiplier
      const earnEntry = {
        id: generateId(),
        type: 'earned',
        amount: earnAmount,
        action: isInNiche
          ? `Follow verified — ${action.targetUser.displayName} (2× tribe bonus!)`
          : `Follow verified — ${action.targetUser.displayName}`,
        timestamp: 'Just now',
      }
      const { [action.userId]: _completedFollow, ...remainingFollows } = state.activeFollows
      void _completedFollow
      return {
        ...state,
        activeFollows: remainingFollows,
        userStats: {
          ...state.userStats,
          totalCredits: state.userStats.totalCredits - cost + earnAmount,
          totalFollowsGiven: state.userStats.totalFollowsGiven + 1,
        },
        escrowTransactions: [newEscrow, ...state.escrowTransactions],
        creditHistory: [earnEntry, newCreditEntry, ...state.creditHistory],
      }
    }

    case 'CANCEL_FOLLOW': {
      const { [action.userId]: _cancelledFollow, ...remainingFollows } = state.activeFollows
      void _cancelledFollow
      return { ...state, activeFollows: remainingFollows }
    }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          { id: generateId(), ...action.notification, createdAt: Date.now() },
          ...state.notifications,
        ].slice(0, 20),
      }

    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      }

    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: { ...state.settings, [action.key]: action.value },
      }

    case 'OPEN_ESCROW_DRAWER':
      return { ...state, escrowDrawerOpen: true, escrowDrawerTxId: action.txId }

    case 'CLOSE_ESCROW_DRAWER':
      return { ...state, escrowDrawerOpen: false, escrowDrawerTxId: null }

    case 'ADD_CREDITS':
      return {
        ...state,
        userStats: {
          ...state.userStats,
          totalCredits: state.userStats.totalCredits + action.amount,
        },
        creditHistory: [
          {
            id: generateId(),
            type: 'earned',
            amount: action.amount,
            action: action.reason || 'Credits added',
            timestamp: 'Just now',
          },
          ...state.creditHistory,
        ],
      }

    case 'WITHDRAW_CREDITS': {
      if (state.userStats.totalCredits < action.amount) return state
      return {
        ...state,
        userStats: {
          ...state.userStats,
          totalCredits: state.userStats.totalCredits - action.amount,
        },
        creditHistory: [
          {
            id: generateId(),
            type: 'spent',
            amount: action.amount,
            action: action.reason || 'Credits withdrawn',
            timestamp: 'Just now',
          },
          ...state.creditHistory,
        ],
      }
    }

    case 'SET_WALLET_MODAL':
      return { ...state, walletModal: action.modal }

    case 'CLAIM_QUEST': {
      if (state.claimedQuests[action.questId]) return state
      return {
        ...state,
        claimedQuests: { ...state.claimedQuests, [action.questId]: true },
        userStats: {
          ...state.userStats,
          totalCredits: state.userStats.totalCredits + action.reward,
        },
        creditHistory: [
          {
            id: generateId(),
            type: 'earned',
            amount: action.reward,
            action: `Quest reward: ${action.questTitle}`,
            timestamp: 'Just now',
          },
          ...state.creditHistory,
        ],
      }
    }

    case 'CLAIM_STREAK': {
      if (state.claimedStreaks[action.days]) return state
      const tiers = ['rookie', 'influencer', 'legend']
      const currentIdx = tiers.indexOf(state.userStats.tier)
      let newTier = state.userStats.tier
      let celebration = null
      if (action.days >= 30 && currentIdx < 2) {
        newTier = tiers[currentIdx + 1]
        celebration = { from: state.userStats.tier, to: newTier }
      } else if (action.days >= 14 && currentIdx < 1) {
        newTier = tiers[currentIdx + 1]
        celebration = { from: state.userStats.tier, to: newTier }
      }
      return {
        ...state,
        claimedStreaks: { ...state.claimedStreaks, [action.days]: true },
        userStats: {
          ...state.userStats,
          totalCredits: state.userStats.totalCredits + action.reward,
          tier: newTier,
        },
        tierUpCelebration: celebration,
        creditHistory: [
          {
            id: generateId(),
            type: 'earned',
            amount: action.reward,
            action: `${action.days}-day streak bonus`,
            timestamp: 'Just now',
          },
          ...state.creditHistory,
        ],
      }
    }

    case 'DISMISS_CELEBRATION':
      return { ...state, tierUpCelebration: null }

    case 'RUN_QUALITY_AUDIT':
      return {
        ...state,
        qualityAudit: {
          running: true,
          startedAt: Date.now(),
          report: null,
        },
      }

    case 'COMPLETE_QUALITY_AUDIT':
      return {
        ...state,
        qualityAudit: {
          running: false,
          startedAt: state.qualityAudit?.startedAt ?? null,
          report: action.report,
        },
      }

    case 'SET_COMMENT_TEMPLATES':
      return { ...state, commentTemplates: action.templates }

    case 'UPDATE_COMMENT_TEMPLATE':
      return {
        ...state,
        commentTemplates: state.commentTemplates.map(t =>
          t.id === action.templateId ? { ...t, status: action.status } : t,
        ),
      }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const dwellTimersRef = useRef({})

  const notify = useCallback((message, type = 'info') => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      notification: { message, variant: type },
    })
  }, [])

  const followUser = useCallback(
    (targetUser, users) => {
      const user = users.find(u => u.id === targetUser.id) || targetUser
      const creditCost = Math.floor(user.qualityScore / 2)
      if (state.userStats.totalCredits < creditCost) {
        notify('Insufficient credits to follow this user.', 'error')
        return
      }
      if (state.activeFollows[user.id]) {
        notify('Already following this user — wait for verification.', 'warning')
        return
      }

      const platformUrl =
        (PLATFORM_URLS[user.platform] || 'https://') + user.username

      dispatch({
        type: 'START_FOLLOW',
        userId: user.id,
        username: user.username,
        creditCost,
        platformUrl,
      })

      window.open(platformUrl, '_blank', 'noopener')

      notify(
        `Following @${user.username} — ${state.settings.dwellTimeEnabled ? `verifying (${state.settings.dwellTimeDuration}s dwell)…` : 'verifying…'}`,
        'info',
      )

      const dwellDuration = state.settings.dwellTimeEnabled
        ? state.settings.dwellTimeDuration * 1000
        : 0
      const startTs = Date.now()

      if (dwellDuration > 0) {
        const interval = setInterval(() => {
          const elapsed = Math.min(
            Math.floor((Date.now() - startTs) / 1000),
            state.settings.dwellTimeDuration,
          )
          dispatch({ type: 'UPDATE_DWELL', userId: user.id, elapsed })
        }, 1000)
        dwellTimersRef.current[user.id] = interval
      }

      setTimeout(
        () => {
          if (dwellTimersRef.current[user.id]) {
            clearInterval(dwellTimersRef.current[user.id])
            delete dwellTimersRef.current[user.id]
          }
          dispatch({ type: 'COMPLETE_FOLLOW', userId: user.id, targetUser: user })
          const isInNiche = user.niche === FEATURED_USER.niche
          const baseEarn = Math.floor(creditCost * 0.5)
          const earned = isInNiche ? baseEarn * 2 : baseEarn
          const bonusText = isInNiche ? ' (2× tribe bonus!)' : ''
          notify(
            `Follow verified! +${earned} cr earned${bonusText}, ${creditCost} cr in escrow for 30 days.`,
            'success',
          )
        },
        Math.max(dwellDuration, 2000),
      )
    },
    [state.userStats.totalCredits, state.activeFollows, state.settings, notify],
  )

  const cancelFollow = useCallback(
    userId => {
      if (dwellTimersRef.current[userId]) {
        clearInterval(dwellTimersRef.current[userId])
        delete dwellTimersRef.current[userId]
      }
      dispatch({ type: 'CANCEL_FOLLOW', userId })
      notify('Follow cancelled.', 'warning')
    },
    [notify],
  )

  const value = {
    ...state,
    dispatch,
    notify,
    followUser,
    cancelFollow,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

