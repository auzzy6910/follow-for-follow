import { useMemo, useState } from 'react'
import { Star, Loader2, UserPlus, LogIn, Camera, Check } from 'lucide-react'
import {
  useFeaturedUser,
  useNiches,
  usePlatforms,
  useOwnerProfile,
  useSetOwnerProfile,
} from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'

const TIER_LABELS = {
  rookie: 'Rookie',
  influencer: 'Influencer',
  legend: 'Legend',
}

const REQUIRED_FIELDS = ['displayName', 'username', 'bio']

const HAS_BACKEND = Boolean(import.meta.env.VITE_CONVEX_URL)

function formatFollowers(n) {
  if (n == null) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

function FeaturedCard({ user, isOwner }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-dark-800 border border-dark-600">
      <img src={user.cover} alt="" className="w-full h-48 sm:h-72 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <div className="flex items-end gap-3 sm:gap-4">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-2 border-blue-accent object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] sm:text-xs font-semibold text-white bg-blue-accent px-2 py-0.5 rounded-full">
                {isOwner ? 'YOUR PROFILE' : 'FEATURED'}
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star size={10} /> {TIER_LABELS[user.tier] || 'Rookie'}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
              {user.displayName}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm truncate">
              @{user.username}
            </p>
            <p className="hidden sm:block text-gray-700 text-sm mt-1 line-clamp-1">
              {user.bio}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatFollowers(user.followers)}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">followers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignInPrompt() {
  const { requireAuth } = useAuthGuard()
  return (
    <div className="rounded-2xl bg-dark-800 border border-dark-600 p-6 sm:p-8 text-center">
      <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-accent to-cyan-400 items-center justify-center text-white font-bold text-xl mb-3">
        F4F
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
        Sign up to claim your featured spot
      </h2>
      <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
        Create an account to make this section yours. Your display name,
        username, bio, and avatar will appear here as the featured profile.
      </p>
      <div className="flex items-center justify-center gap-2 mt-5">
        <button
          type="button"
          onClick={() => requireAuth(() => {})}
          className="inline-flex items-center gap-1.5 bg-blue-accent text-white font-semibold text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          <UserPlus size={16} /> Sign up
        </button>
        <button
          type="button"
          onClick={() => requireAuth(() => {})}
          className="inline-flex items-center gap-1.5 bg-dark-700 border border-dark-500 text-gray-800 text-sm px-4 py-2 rounded-xl hover:bg-dark-600 transition-colors"
        >
          <LogIn size={16} /> Sign in
        </button>
      </div>
    </div>
  )
}

function ProfileSetupForm({ ownerData, onComplete }) {
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const setOwnerProfile = useSetOwnerProfile()
  const { notify } = useAppContext()
  const initial = useMemo(
    () => ({
      displayName: ownerData?.profile?.displayName ?? '',
      username:
        ownerData?.profile?.username ??
        (ownerData?.email ? ownerData.email.split('@')[0] : ''),
      bio: ownerData?.profile?.bio ?? '',
      avatar: ownerData?.profile?.avatar ?? '',
      cover: ownerData?.profile?.cover ?? '',
      niche: ownerData?.profile?.niche ?? (NICHES[0]?.id ?? ''),
      platform: ownerData?.profile?.platform ?? (PLATFORMS[0]?.id ?? ''),
      location: ownerData?.profile?.location ?? '',
    }),
    [ownerData, NICHES, PLATFORMS],
  )
  const profileId = ownerData?.profile?.id ?? 'new'
  const [form, setForm] = useState(initial)
  const [lastProfileId, setLastProfileId] = useState(profileId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Reset the form when the underlying profile identity changes (e.g. after
  // first save). Following the "adjusting state during render" pattern from
  // React docs to avoid cascading renders inside an effect.
  if (profileId !== lastProfileId) {
    setLastProfileId(profileId)
    setForm(initial)
  }

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const missingRequired = REQUIRED_FIELDS.filter(
    (key) => !String(form[key] || '').trim(),
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    if (missingRequired.length > 0) {
      setError('Please fill in display name, username, and bio.')
      return
    }
    setSubmitting(true)
    try {
      await setOwnerProfile({
        displayName: form.displayName.trim(),
        username: form.username.trim().replace(/^@+/, ''),
        bio: form.bio.trim(),
        avatar: form.avatar.trim() || undefined,
        cover: form.cover.trim() || undefined,
        niche: form.niche || undefined,
        platform: form.platform || undefined,
        location: form.location.trim() || undefined,
      })
      notify('Your featured profile is live across the site.', 'success')
      onComplete?.()
    } catch (err) {
      setError(err?.message || 'Could not save profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-dark-800 border border-dark-600 p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] sm:text-xs font-semibold text-white bg-blue-accent px-2 py-0.5 rounded-full">
          YOUR PROFILE
        </span>
        <span className="text-[10px] sm:text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star size={10} /> Setup
        </span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
        Tell the community about yourself
      </h2>
      <p className="text-gray-400 text-sm mt-1">
        Your details appear in the featured card and across your profile on the
        site. Required fields are marked with{' '}
        <span className="text-blue-accent">*</span>.
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="owner-display-name"
            className="text-gray-400 text-xs font-medium mb-1.5 block"
          >
            Display Name <span className="text-blue-accent">*</span>
          </label>
          <input
            id="owner-display-name"
            type="text"
            value={form.displayName}
            onChange={update('displayName')}
            required
            placeholder="e.g., Alex Chen"
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/60"
          />
        </div>
        <div>
          <label
            htmlFor="owner-username"
            className="text-gray-400 text-xs font-medium mb-1.5 block"
          >
            Username <span className="text-blue-accent">*</span>
          </label>
          <input
            id="owner-username"
            type="text"
            value={form.username}
            onChange={update('username')}
            required
            placeholder="@yourhandle"
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/60"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="owner-bio"
          className="text-gray-400 text-xs font-medium mb-1.5 block"
        >
          Bio <span className="text-blue-accent">*</span>
        </label>
        <textarea
          id="owner-bio"
          rows={3}
          value={form.bio}
          onChange={update('bio')}
          required
          placeholder="Tell the community what you create and who you serve."
          className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/60 resize-none"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="owner-avatar"
            className="text-gray-400 text-xs font-medium mb-1.5 block"
          >
            Avatar URL
          </label>
          <div className="relative">
            <Camera
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              id="owner-avatar"
              type="url"
              value={form.avatar}
              onChange={update('avatar')}
              placeholder="https://..."
              className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/60"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="owner-cover"
            className="text-gray-400 text-xs font-medium mb-1.5 block"
          >
            Cover Image URL
          </label>
          <input
            id="owner-cover"
            type="url"
            value={form.cover}
            onChange={update('cover')}
            placeholder="https://..."
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/60"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="owner-niche"
            className="text-gray-400 text-xs font-medium mb-1.5 block"
          >
            Primary Niche
          </label>
          <select
            id="owner-niche"
            value={form.niche}
            onChange={update('niche')}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-accent/60"
          >
            {NICHES.map((n) => (
              <option key={n.id} value={n.id}>
                {n.icon} {n.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="owner-platform"
            className="text-gray-400 text-xs font-medium mb-1.5 block"
          >
            Primary Platform
          </label>
          <select
            id="owner-platform"
            value={form.platform}
            onChange={update('platform')}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-accent/60"
          >
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="owner-location"
            className="text-gray-400 text-xs font-medium mb-1.5 block"
          >
            Location
          </label>
          <input
            id="owner-location"
            type="text"
            value={form.location}
            onChange={update('location')}
            placeholder="e.g., Nairobi, Kenya"
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/60"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
        >
          {error}
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-blue-accent text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          {ownerData?.profile ? 'Save changes' : 'Save and feature me'}
        </button>
        <p className="text-gray-500 text-xs">
          We&rsquo;ll keep your details in sync across the site.
        </p>
      </div>
    </form>
  )
}

export default function OwnerFeaturedHero() {
  const ownerData = useOwnerProfile()
  const fallbackFeatured = useFeaturedUser()
  const [editing, setEditing] = useState(false)

  // Backend not configured → render the bundled mock featured user so the UI
  // still has visual content during local development without Convex.
  if (!HAS_BACKEND) {
    return <FeaturedCard user={fallbackFeatured} isOwner={false} />
  }

  if (ownerData === undefined) {
    return (
      <div className="rounded-2xl bg-dark-800 border border-dark-600 h-48 sm:h-72 flex items-center justify-center">
        <Loader2 size={20} className="text-gray-500 animate-spin" />
      </div>
    )
  }

  if (ownerData === null) {
    return <SignInPrompt />
  }

  if (!ownerData.profile || editing) {
    return (
      <ProfileSetupForm
        ownerData={ownerData}
        onComplete={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="space-y-3">
      <FeaturedCard user={ownerData.profile} isOwner />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-blue-accent text-xs hover:underline"
        >
          Edit profile details
        </button>
      </div>
    </div>
  )
}
