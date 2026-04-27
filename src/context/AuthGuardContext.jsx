import { useState, useCallback } from 'react'
import { useConvexAuth } from 'convex/react'
import { AuthGuardContext } from './authGuardCtx'

export function AuthGuardProvider({ children }) {
  const { isAuthenticated } = useConvexAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const requireAuth = useCallback(
    (callback) => {
      if (isAuthenticated) {
        callback()
        return true
      }
      setModalOpen(true)
      return false
    },
    [isAuthenticated],
  )

  const closeModal = useCallback(() => setModalOpen(false), [])

  return (
    <AuthGuardContext.Provider
      value={{ isAuthenticated, modalOpen, requireAuth, openModal: () => setModalOpen(true), closeModal }}
    >
      {children}
    </AuthGuardContext.Provider>
  )
}
