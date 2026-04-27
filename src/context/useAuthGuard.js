import { useContext } from 'react'
import { AuthGuardContext } from './authGuardCtx'

export function useAuthGuard() {
  const ctx = useContext(AuthGuardContext)
  if (!ctx) throw new Error('useAuthGuard must be used within AuthGuardProvider')
  return ctx
}
