import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { useNiches, usePlatforms } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { ENGAGEMENT_OPTIONS } from '../data/mockData'

const FOLLOWER_PRESETS = [500, 1000, 2500, 5000, 10000, 25000]
const REWARD_PRESETS = [25, 50, 100, 150, 250]

export default function CreatePostModal({ open, onClose, defaults }) {
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const { createF4FPost } = useAppContext()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [niche, setNiche] = useState(defaults?.niche || 'tech')
  const [platform, setPlatform] = useState(defaults?.platform || 'instagram')
  const [minFollowers, setMinFollowers] = useState(1000)
  const [rewardCredits, setRewardCredits] = useState(50)
  const [capacity, setCapacity] = useState(50)
  const [postsToEngage, setPostsToEngage] = useState(2)
  const [engagementAsks, setEngagementAsks] = useState(['like', 'comment'])
  const [error, setError] = useState('')

  if (!open) return null

  const toggleEngagement = id => {
    setEngagementAsks(curr =>
      curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id],
    )
  }

  const reset = () => {
    setTitle('')
    setDescription('')
    setNiche(defaults?.niche || 'tech')
    setPlatform(defaults?.platform || 'instagram')
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

    createF4FPost({
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
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
      <div
        onClick={onClose}
        className="absolute inset-0"
        aria-hidden
      />
      <div className="relative w-full max-w-xl bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600 sticky top-0 bg-dark-800 z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-accent" />
            <h2 className="text-white text-base font-semibold">New F4F post</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Tech mutuals — building in public"
              className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent"
              maxLength={80}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Who you want, what you give back, and how engagement should look."
              className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent resize-none"
              maxLength={400}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Niche">
              <select
                value={niche}
                onChange={e => setNiche(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-accent"
              >
                {NICHES.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.icon} {n.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Platform">
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-accent"
              >
                {PLATFORMS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity (max participants)">
              <input
                type="number"
                min={1}
                max={1000}
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-accent"
              />
            </Field>

            <Field label="Posts to engage with">
              <input
                type="number"
                min={1}
                max={10}
                value={postsToEngage}
                onChange={e => setPostsToEngage(e.target.value)}
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-accent"
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
                        ? 'bg-blue-accent/15 border-blue-accent text-blue-accent'
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

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-accent text-dark-900 hover:bg-blue-accent/90"
            >
              Publish post
            </button>
          </div>
        </form>
      </div>
    </div>
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
        className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-accent"
      />
      <div className="flex flex-wrap gap-1.5">
        {presets.map(p => (
          <button
            type="button"
            key={p}
            onClick={() => onChange(p)}
            className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
              Number(value) === p
                ? 'bg-blue-accent/15 border-blue-accent text-blue-accent'
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
