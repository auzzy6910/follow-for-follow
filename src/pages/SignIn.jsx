import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { Loader2, Mail, Lock, UserPlus, LogIn } from 'lucide-react'

// Convex Auth surfaces server errors as long stack traces. Map the known
// error codes to short, user-friendly messages and fall back to a generic
// one so we never leak an internal trace into the UI.
function friendlyAuthError(err, isSignUp) {
  const raw = (err && (err.message || err.toString())) || ''
  if (/InvalidSecret|InvalidAccountId|CredentialsSignin/i.test(raw)) {
    return 'Invalid email or password.'
  }
  if (/AccountAlreadyExists|already.*exist/i.test(raw)) {
    return 'An account with that email already exists. Try signing in instead.'
  }
  if (/PasswordValidation|too short|weak/i.test(raw)) {
    return 'Password must be at least 8 characters.'
  }
  if (/Network|fetch|Failed to fetch/i.test(raw)) {
    return 'Network error — please check your connection and try again.'
  }
  return isSignUp
    ? 'Could not sign up. Try a different email or stronger password.'
    : 'Invalid email or password.'
}

export default function SignIn() {
  const { signIn } = useAuthActions()
  const [flow, setFlow] = useState('signIn')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const isSignUp = flow === 'signUp'

  const handleSubmit = async event => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    formData.set('flow', flow)
    try {
      await signIn('password', formData)
    } catch (err) {
      setError(friendlyAuthError(err, isSignUp))
    } finally {
      setSubmitting(false)
    }
  }

  const toggleFlow = () => {
    setError(null)
    setFlow(isSignUp ? 'signIn' : 'signUp')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-green-accent to-cyan-400 items-center justify-center text-dark-900 font-bold text-2xl mb-3">
            F4F
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isSignUp
              ? 'Join Follow for Follow to start growing your audience.'
              : 'Sign in to access your dashboard.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="email"
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
                id="email"
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
              htmlFor="password"
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
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                minLength={8}
                placeholder={isSignUp ? 'At least 8 characters' : '••••••••'}
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

        <p className="text-center text-[11px] text-gray-500 mt-4">
          Authentication is powered by Convex Auth.
        </p>
      </div>
    </div>
  )
}
