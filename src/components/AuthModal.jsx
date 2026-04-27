import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { Loader2, Mail, Lock, UserPlus, LogIn, X } from 'lucide-react'
import { useAuthGuard } from '../context/useAuthGuard'

export default function AuthModal() {
  const { modalOpen, closeModal } = useAuthGuard()
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState('signIn')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!modalOpen) return null

  const isSignUp = flow === 'signUp'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    formData.set('flow', flow)
    try {
      await signIn('password', formData)
      closeModal()
    } catch (err) {
      const message =
        (err && (err.message || err.toString())) ||
        (isSignUp
          ? 'Could not sign up. Try a different email or stronger password.'
          : 'Invalid email or password.')
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleFlow = () => {
    setError(null)
    setFlow(isSignUp ? 'signIn' : 'signUp')
  }

  return (
    <>
      <div
        onClick={closeModal}
        className="fixed inset-0 z-[100] bg-black/60 transition-opacity"
      />
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-6 relative">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-green-accent to-cyan-400 items-center justify-center text-dark-900 font-bold text-xl mb-3">
                F4F
              </div>
              <h2 className="text-xl font-bold text-white">
                {isSignUp ? 'Create your account' : 'Sign in to continue'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {isSignUp
                  ? 'Join Follow for Follow to start growing your audience.'
                  : 'Sign in to perform this action.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="auth-modal-email"
                  className="text-gray-400 text-xs font-medium mb-1.5 block"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    id="auth-modal-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-modal-password"
                  className="text-gray-400 text-xs font-medium mb-1.5 block"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    id="auth-modal-password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                    minLength={8}
                    placeholder={isSignUp ? 'At least 8 characters' : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                    className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/60 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-green-accent text-dark-900 font-semibold py-2.5 rounded-xl hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isSignUp ? (
                  <UserPlus size={16} strokeWidth={2.5} />
                ) : (
                  <LogIn size={16} strokeWidth={2.5} />
                )}
                {isSignUp ? 'Create account' : 'Sign in'}
              </button>

              <div className="text-center text-xs text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleFlow}
                  className="text-green-accent font-medium hover:underline"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
