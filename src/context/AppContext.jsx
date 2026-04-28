import { useReducer, useCallback, useRef, useEffect } from 'react'
import {
  ESCROW_TRANSACTIONS,
  CREDIT_HISTORY,
  USER_STATS,
  FEATURED_USER,
  PENALTIES,
  INBOX_NOTIFICATIONS,
  F4F_POSTS,
} from '../data/mockData'
import { AppContext } from './useAppContext'

const WARMING_WIZARD_STORAGE_KEY = 'ff:warming-wizard-dismissed'
const PROFILE_OVERRIDES_STORAGE_KEY = 'ff:profile-overrides'

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

function readWarmingWizardDismissed() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(WARMING_WIZARD_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function readProfileOverrides() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(PROFILE_OVERRIDES_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeProfileOverrides(overrides) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      PROFILE_OVERRIDES_STORAGE_KEY,
      JSON.stringify(overrides),
    )
  } catch {
    // ignore storage errors
  }
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
  penalties: PENALTIES.map(p => ({ ...p })),
  inboxNotifications: INBOX_NOTIFICATIONS.map(n => ({ ...n })),
  notificationCenterOpen: false,
  warmingWizardOpen: false,
  warmingWizardDismissed: readWarmingWizardDismissed(),
  warmingPlan: null,
  cooldownTick: 0,
  f4fPosts: [...F4F_POSTS],
  profileOverrides: readProfileOverrides(),
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
        inboxNotifications: [
          {
            id: generateId(),
            type: 'quest',
            title: 'Quest completed',
            body: `+${action.reward} cr for "${action.questTitle}".`,
            createdAt: Date.now(),
            read: false,
            link: '/gamification',
          },
          ...state.inboxNotifications,
        ].slice(0, 50),
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

    case 'START_COOLDOWN':
      return {
        ...state,
        userStats: {
          ...state.userStats,
          cooldownActive: true,
          cooldownUntil: action.until,
        },
      }

    case 'CLEAR_COOLDOWN':
      return {
        ...state,
        userStats: {
          ...state.userStats,
          cooldownActive: false,
          cooldownUntil: null,
        },
      }

    case 'COOLDOWN_TICK':
      return { ...state, cooldownTick: state.cooldownTick + 1 }

    case 'SUBMIT_APPEAL': {
      const now = new Date().toISOString()
      return {
        ...state,
        penalties: state.penalties.map(p =>
          p.id === action.penaltyId
            ? {
                ...p,
                status: 'appealed',
                appealText: action.text,
                appealedAt: now,
              }
            : p,
        ),
      }
    }

    case 'RESOLVE_APPEAL':
      return {
        ...state,
        penalties: state.penalties.map(p =>
          p.id === action.penaltyId
            ? { ...p, status: action.outcome }
            : p,
        ),
      }

    case 'ADD_INBOX_NOTIFICATION':
      return {
        ...state,
        inboxNotifications: [
          {
            id: generateId(),
            read: false,
            createdAt: Date.now(),
            ...action.notification,
          },
          ...state.inboxNotifications,
        ].slice(0, 50),
      }

    case 'MARK_INBOX_READ':
      return {
        ...state,
        inboxNotifications: state.inboxNotifications.map(n =>
          n.id === action.id ? { ...n, read: true } : n,
        ),
      }

    case 'MARK_ALL_INBOX_READ':
      return {
        ...state,
        inboxNotifications: state.inboxNotifications.map(n => ({ ...n, read: true })),
      }

    case 'CLEAR_INBOX':
      return { ...state, inboxNotifications: [] }

    case 'TOGGLE_NOTIFICATION_CENTER':
      return { ...state, notificationCenterOpen: !state.notificationCenterOpen }

    case 'SET_NOTIFICATION_CENTER_OPEN':
      return { ...state, notificationCenterOpen: action.open }

    case 'OPEN_WARMING_WIZARD':
      return { ...state, warmingWizardOpen: true }

    case 'CLOSE_WARMING_WIZARD':
      return { ...state, warmingWizardOpen: false }

    case 'DISMISS_WARMING_WIZARD':
      return {
        ...state,
        warmingWizardOpen: false,
        warmingWizardDismissed: true,
      }

    case 'SAVE_WARMING_PLAN':
      return {
        ...state,
        warmingPlan: action.plan,
        warmingWizardOpen: false,
        warmingWizardDismissed: true,
      }

    case 'CREATE_F4F_POST':
      return {
        ...state,
        f4fPosts: [action.post, ...state.f4fPosts],
      }

    case 'DELETE_F4F_POST':
      return {
        ...state,
        f4fPosts: state.f4fPosts.filter(p => p.id !== action.postId),
      }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profileOverrides: { ...state.profileOverrides, ...action.updates },
      }

    case 'RESET_PROFILE':
      return { ...state, profileOverrides: {} }

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
          dispatch({
            type: 'ADD_INBOX_NOTIFICATION',
            notification: {
              type: 'escrow',
              title: `Escrow held for @${user.username}`,
              body: `${creditCost} cr in escrow. +${earned} cr earned${bonusText}.`,
              link: '/wallet',
            },
          })
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

  const startCooldown = useCallback(
    (seconds = 120) => {
      const until = Date.now() + seconds * 1000
      dispatch({ type: 'START_COOLDOWN', until })
      notify(
        `Cooldown started — actions paused for ${Math.round(seconds / 60) || 1}m.`,
        'warning',
      )
    },
    [notify],
  )

  const clearCooldown = useCallback(() => {
    dispatch({ type: 'CLEAR_COOLDOWN' })
    notify('Cooldown cleared.', 'success')
  }, [notify])

  const submitAppeal = useCallback(
    (penaltyId, text) => {
      dispatch({ type: 'SUBMIT_APPEAL', penaltyId, text })
      notify('Appeal submitted — a reviewer will respond within 24h.', 'success')
      dispatch({
        type: 'ADD_INBOX_NOTIFICATION',
        notification: {
          type: 'penalty',
          title: 'Appeal filed',
          body: 'Your penalty appeal is under review.',
          link: '/safety',
        },
      })
    },
    [notify],
  )

  const markInboxRead = useCallback(id => {
    dispatch({ type: 'MARK_INBOX_READ', id })
  }, [])

  const markAllInboxRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_INBOX_READ' })
  }, [])

  const clearInbox = useCallback(() => {
    dispatch({ type: 'CLEAR_INBOX' })
  }, [])

  const toggleNotificationCenter = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOTIFICATION_CENTER' })
  }, [])

  const setNotificationCenterOpen = useCallback(open => {
    dispatch({ type: 'SET_NOTIFICATION_CENTER_OPEN', open })
  }, [])

  const openWarmingWizard = useCallback(() => {
    dispatch({ type: 'OPEN_WARMING_WIZARD' })
  }, [])

  const closeWarmingWizard = useCallback(() => {
    dispatch({ type: 'CLOSE_WARMING_WIZARD' })
  }, [])

  const dismissWarmingWizard = useCallback(() => {
    dispatch({ type: 'DISMISS_WARMING_WIZARD' })
    try {
      window.localStorage.setItem(WARMING_WIZARD_STORAGE_KEY, '1')
    } catch {
      // ignore storage errors
    }
  }, [])

  const createF4FPost = useCallback(
    post => {
      const newPost = {
        id: generateId(),
        creatorId: FEATURED_USER.id,
        createdAt: new Date().toISOString(),
        filledCount: 0,
        status: 'active',
        ...post,
      }
      dispatch({ type: 'CREATE_F4F_POST', post: newPost })
      notify(`F4F post “${newPost.title}” published.`, 'success')
      return newPost
    },
    [notify],
  )

  const deleteF4FPost = useCallback(
    postId => {
      dispatch({ type: 'DELETE_F4F_POST', postId })
      notify('F4F post deleted.', 'info')
    },
    [notify],
  )

  const updateProfile = useCallback(
    (updates, options = {}) => {
      const next = { ...state.profileOverrides, ...updates }
      dispatch({ type: 'UPDATE_PROFILE', updates })
      writeProfileOverrides(next)
      if (options.silent !== true) {
        notify('Profile updated.', 'success')
      }
    },
    [state.profileOverrides, notify],
  )

  const resetProfile = useCallback(() => {
    dispatch({ type: 'RESET_PROFILE' })
    writeProfileOverrides({})
    notify('Profile reset to defaults.', 'info')
  }, [notify])

  const saveWarmingPlan = useCallback(
    plan => {
      dispatch({ type: 'SAVE_WARMING_PLAN', plan })
      try {
        window.localStorage.setItem(WARMING_WIZARD_STORAGE_KEY, '1')
      } catch {
        // ignore storage errors
      }
      notify(
        `Account-warming plan saved — targeting ${plan.dailyFollows} follows/day.`,
        'success',
      )
    },
    [notify],
  )

  // Cooldown ticker: keeps `cooldownTick` incrementing while cooldown is
  // active so dependent components re-render each second. Auto-clears the
  // cooldown when `cooldownUntil` is reached.
  useEffect(() => {
    if (!state.userStats.cooldownActive || !state.userStats.cooldownUntil) {
      return undefined
    }
    const interval = setInterval(() => {
      if (Date.now() >= state.userStats.cooldownUntil) {
        dispatch({ type: 'CLEAR_COOLDOWN' })
        notify('Cooldown ended — actions resumed.', 'success')
        return
      }
      dispatch({ type: 'COOLDOWN_TICK' })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.userStats.cooldownActive, state.userStats.cooldownUntil, notify])

  const value = {
    ...state,
    dispatch,
    notify,
    followUser,
    cancelFollow,
    startCooldown,
    clearCooldown,
    submitAppeal,
    markInboxRead,
    markAllInboxRead,
    clearInbox,
    toggleNotificationCenter,
    setNotificationCenterOpen,
    openWarmingWizard,
    closeWarmingWizard,
    dismissWarmingWizard,
    saveWarmingPlan,
    createF4FPost,
    deleteF4FPost,
    updateProfile,
    resetProfile,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

