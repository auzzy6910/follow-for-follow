import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  User as UserIcon,
  RefreshCcw,
  ImagePlus,
  ExternalLink,
  Send,
} from 'lucide-react'
import {
  useNiches,
  usePlatforms,
  useFeaturedUser,
} from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { ENGAGEMENT_OPTIONS } from '../data/mockData'

const FOLLOWER_PRESETS = [500, 1000, 2500, 5000, 10000, 25000]
const REWARD_PRESETS = [25, 50, 100, 150, 250]

export default function MyProfile() {
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const featured = useFeaturedUser()
  const { updateProfile, resetProfile, createF4FPost, f4fPosts, notify } =
    useAppContext()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <UserIcon size={22} className="text-green-accent" />
            My Profile
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Update how others see you and post a new follow-for-follow offer.
          </p>
        </div>
        {featured && (
          <Link
            to={`/profile/${featured.id}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-sky-400 hover:text-sky-300"
          >
            View public profile <ExternalLink size={14} />
          </Link>
        )}
      </header>

      <ProfileEditor
        featured={featured}
        niches={NICHES}
        platforms={PLATFORMS}
        onSave={updateProfile}
        onReset={resetProfile}
      />

      <PostFollowForFollowSection
        niches={NICHES}
        platforms={PLATFORMS}
        defaults={featured}
        onPublish={createF4FPost}
        notify={notify}
        myPostsCount={f4fPosts.filter(p => p.creatorId === featured?.id).length}
      />
    </div>
  )
}

function ProfileEditor({ featured, niches, platforms, onSave, onReset }) {
  const [draft, setDraft] = useState({})
  const base = useMemo(() => buildForm(featured), [featured])
  const form = useMemo(() => ({ ...base, ...draft }), [base, draft])

  const dirty = useMemo(
    () => Object.keys(draft).some(k => draft[k] !== base[k]),
    [draft, base],
  )

  if (!featured) {
    return (
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 text-gray-400 text-sm">
        Loading profile…
      </div>
    )
  }

  const set = (key, value) => setDraft(d => ({ ...d, [key]: value }))

  const handleAvatarFile = file => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') set('avatar', reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = e => {
    e.preventDefault()
    const updates = {
      displayName: form.displayName.trim() || featured.displayName,
      username: form.username.trim().replace(/^@/, '') || featured.username,
      bio: form.bio,
      niche: form.niche,
      platform: form.platform,
      location: form.location.trim(),
      avatar: form.avatar || featured.avatar,
    }
    onSave(updates)
    setDraft({})
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6 space-y-5"
    >
      <h2 className="text-white font-semibold flex items-center gap-2">
        <UserIcon size={18} /> Edit profile
      </h2>

      <div className="flex items-center gap-4">
        <div className="p-[3px] rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-fuchsia-600">
          <div className="bg-dark-900 p-[2px] rounded-full">
            <img
              src={form.avatar || featured.avatar}
              alt="avatar preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium px-3 py-2 rounded-xl bg-dark-700 text-gray-200 hover:bg-dark-600 w-fit">
            <ImagePlus size={16} /> Change avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleAvatarFile(e.target.files?.[0])}
            />
          </label>
          <input
            type="url"
            value={form.avatar.startsWith('data:') ? '' : form.avatar}
            onChange={e => set('avatar', e.target.value)}
            placeholder="…or paste an image URL"
            className="bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/60 w-72 max-w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Display name">
          <input
            type="text"
            value={form.displayName}
            onChange={e => set('displayName', e.target.value)}
            maxLength={60}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          />
        </Field>
        <Field label="Username">
          <input
            type="text"
            value={form.username}
            onChange={e => set('username', e.target.value)}
            maxLength={30}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          />
        </Field>
      </div>

      <Field label="Bio">
        <textarea
          rows={3}
          value={form.bio}
          onChange={e => set('bio', e.target.value)}
          maxLength={240}
          placeholder="Tell the community about yourself…"
          className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent resize-none"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Primary niche">
          <select
            value={form.niche}
            onChange={e => set('niche', e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          >
            {niches.map(n => (
              <option key={n.id} value={n.id}>
                {n.icon} {n.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Primary platform">
          <select
            value={form.platform}
            onChange={e => set('platform', e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          >
            {platforms.map(p => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input
            type="text"
            value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="e.g. Nairobi, Kenya"
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={!dirty}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
            dirty
              ? 'bg-green-accent text-dark-900 hover:bg-green-accent/90'
              : 'bg-dark-600 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => setDraft({})}
          className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onReset}
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400"
        >
          <RefreshCcw size={14} /> Reset to defaults
        </button>
      </div>
    </form>
  )
}

function buildForm(featured) {
  return {
    displayName: featured?.displayName ?? '',
    username: featured?.username ?? '',
    bio: featured?.bio ?? '',
    niche: featured?.niche ?? 'tech',
    platform: featured?.platform ?? 'instagram',
    location: featured?.location ?? '',
    avatar: featured?.avatar ?? '',
  }
}

function PostFollowForFollowSection({
  niches,
  platforms,
  defaults,
  onPublish,
  notify,
  myPostsCount,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [nicheOverride, setNicheOverride] = useState(null)
  const [platformOverride, setPlatformOverride] = useState(null)
  const [minFollowers, setMinFollowers] = useState(1000)
  const [rewardCredits, setRewardCredits] = useState(50)
  const [capacity, setCapacity] = useState(50)
  const [postsToEngage, setPostsToEngage] = useState(2)
  const [engagementAsks, setEngagementAsks] = useState(['like', 'comment'])
  const [error, setError] = useState('')

  const niche = nicheOverride ?? defaults?.niche ?? 'tech'
  const platform = platformOverride ?? defaults?.platform ?? 'instagram'

  const toggleEngagement = id => {
    setEngagementAsks(curr =>
      curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id],
    )
  }

  const reset = () => {
    setTitle('')
    setDescription('')
    setNicheOverride(null)
    setPlatformOverride(null)
    setMinFollowers(1000)
    setRewardCredits(50)
    setCapacity(50)
    setPostsToEngage(2)
    setEngagementAsks(['like', 'comment'])
    setError('')
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!title.trim()) return setError('Title is required.')
    if (!description.trim()) return setError('Description is required.')
    if (engagementAsks.length === 0)
      return setError('Pick at least one engagement ask.')
    setError('')
    onPublish({
      title: title.trim(),
      description: description.trim(),
      niche,
      platform,
      minFollowers: Number(minFollowers) || 0,
      rewardCredits: Number(rewardCredits) || 0,
      capacity: Number(capacity) || 0,
      postsToEngage: Number(postsToEngage) || 1,
      engagementAsks,
      tags: [],
    })
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6 space-y-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Sparkles size={18} className="text-green-accent" />
            Post a Follow-for-Follow
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Set the offer, who it's for, and what engagement you expect in
            return. You currently have {myPostsCount} active{' '}
            {myPostsCount === 1 ? 'post' : 'posts'}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            notify('Tip: F4F posts go live instantly.', 'info')
          }}
          className="hidden sm:inline text-[11px] text-gray-500 hover:text-gray-300 underline-offset-2 hover:underline"
        >
          How it works
        </button>
      </div>

      <Field label="Title">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Tech mutuals — building in public"
          maxLength={80}
          className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent"
        />
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Who you want, what you give back, and how engagement should look."
          className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent resize-none"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Niche">
          <select
            value={niche}
            onChange={e => setNicheOverride(e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          >
            {niches.map(n => (
              <option key={n.id} value={n.id}>
                {n.icon} {n.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Platform">
          <select
            value={platform}
            onChange={e => setPlatformOverride(e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          >
            {platforms.map(p => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Min followers">
          <PresetNumberInput
            value={minFollowers}
            onChange={setMinFollowers}
            presets={FOLLOWER_PRESETS}
            formatLabel={n => (n >= 1000 ? `${n / 1000}k` : `${n}`)}
          />
        </Field>
        <Field label="Reward (credits)">
          <PresetNumberInput
            value={rewardCredits}
            onChange={setRewardCredits}
            presets={REWARD_PRESETS}
            formatLabel={n => `${n} cr`}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Capacity (max participants)">
          <input
            type="number"
            min={1}
            max={1000}
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          />
        </Field>
        <Field label="Posts to engage with">
          <input
            type="number"
            min={1}
            max={10}
            value={postsToEngage}
            onChange={e => setPostsToEngage(e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
          />
        </Field>
      </div>

      <Field label="Engagement asks">
        <div className="flex flex-wrap gap-2">
          {ENGAGEMENT_OPTIONS.map(opt => {
            const active = engagementAsks.includes(opt.id)
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => toggleEngagement(opt.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? 'bg-green-accent/15 border-green-accent text-green-accent'
                    : 'bg-dark-700 border-dark-500 text-gray-300 hover:text-white hover:border-dark-400'
                }`}
              >
                <span className="mr-1">{opt.icon}</span>
                {opt.label}
              </button>
            )
          })}
        </div>
      </Field>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700"
        >
          Clear
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-green-accent text-dark-900 hover:bg-green-accent/90"
        >
          <Send size={14} /> Publish post
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function PresetNumberInput({ value, onChange, presets, formatLabel }) {
  return (
    <div className="space-y-2">
      <input
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-accent"
      />
      <div className="flex flex-wrap gap-1.5">
        {presets.map(p => (
          <button
            type="button"
            key={p}
            onClick={() => onChange(p)}
            className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
              Number(value) === p
                ? 'bg-green-accent/15 border-green-accent text-green-accent'
                : 'bg-dark-700 border-dark-500 text-gray-400 hover:text-white'
            }`}
          >
            {formatLabel(p)}
          </button>
        ))}
      </div>
    </div>
  )
}
