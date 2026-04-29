import { useMemo, useState } from 'react'
import { Link2, Sparkles, ShoppingBag, Repeat2, X, Check } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'
import { detectPlatformFromUrl } from '../utils/platformDetect'

const FOLLOWER_PRESETS = [0, 250, 500, 1000, 2500, 5000, 10000]
const REWARD_PRESETS = [0, 25, 50, 75, 100, 150]

export default function PostLinkModal({ open, onClose }) {
  const { createF4FPost } = useAppContext()
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [minFollowers, setMinFollowers] = useState(500)
  const [rewardCredits, setRewardCredits] = useState(50)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')

  const detection = useMemo(() => detectPlatformFromUrl(url), [url])

  const togglePaid = next => {
    setPaid(next)
    if (next) setRewardCredits(0)
  }

  const reset = () => {
    setUrl('')
    setDescription('')
    setMinFollowers(500)
    setRewardCredits(50)
    setPaid(false)
    setError('')
  }

  if (!open) return null

  const handleSubmit = e => {
    e.preventDefault()
    if (!detection) {
      setError("Couldn't detect a supported social media link. Try Instagram, X, TikTok, YouTube, LinkedIn, or Threads.")
      return
    }
    if (!description.trim()) {
      setError('Add a short description so others know what you offer.')
      return
    }

    createF4FPost({
      type: 'link',
      title: `@${detection.username}`,
      description: description.trim(),
      platform: detection.platform,
      username: detection.username,
      profileUrl: detection.url,
      minFollowers: paid ? 0 : Number(minFollowers) || 0,
      rewardCredits: paid ? 0 : Number(rewardCredits) || 0,
      capacity: 100,
      postsToEngage: 1,
      engagementAsks: ['like'],
      tags: [detection.platform, paid ? 'buy' : 'f4f'],
      paid,
    })
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
      <div onClick={onClose} className="absolute inset-0" aria-hidden />
      <div className="relative w-full max-w-lg bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600 sticky top-0 bg-dark-800 z-10">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-blue-accent" />
            <h2 className="text-white text-base font-semibold">Post your account</h2>
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
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Profile link
            </span>
            <div className="mt-1.5">
              <input
                type="url"
                value={url}
                onChange={e => {
                  setUrl(e.target.value)
                  setError('')
                }}
                placeholder="https://instagram.com/yourhandle"
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent"
              />
              {detection ? (
                <p className="mt-1.5 text-[11px] text-blue-accent flex items-center gap-1">
                  <Check size={12} /> Detected {detection.icon} {detection.name} — @{detection.username}
                </p>
              ) : url ? (
                <p className="mt-1.5 text-[11px] text-amber-400">
                  Paste a link to your Instagram, X/Twitter, TikTok, YouTube, LinkedIn, or Threads profile.
                </p>
              ) : (
                <p className="mt-1.5 text-[11px] text-gray-500">
                  We'll auto-detect the platform from the URL.
                </p>
              )}
            </div>
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Description
            </span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Who you want, what you give back, and how engagement should look."
              className="mt-1.5 w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent resize-none"
              maxLength={400}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => togglePaid(false)}
              className={`flex items-center gap-2 justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                !paid
                  ? 'bg-blue-accent/15 border-blue-accent text-blue-accent'
                  : 'bg-dark-700 border-dark-500 text-gray-300 hover:text-white'
              }`}
            >
              <Repeat2 size={14} /> F4F (mutual)
            </button>
            <button
              type="button"
              onClick={() => togglePaid(true)}
              className={`flex items-center gap-2 justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                paid
                  ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                  : 'bg-dark-700 border-dark-500 text-gray-300 hover:text-white'
              }`}
            >
              <ShoppingBag size={14} /> BUY (paid)
            </button>
          </div>

          {!paid && (
            <div className="grid grid-cols-2 gap-3">
              <PresetField
                label="Min followers"
                value={minFollowers}
                onChange={setMinFollowers}
                presets={FOLLOWER_PRESETS}
                formatLabel={n =>
                  n === 0 ? 'any' : n >= 1000 ? `${n / 1000}k` : `${n}`
                }
              />
              <PresetField
                label="Reward (credits)"
                value={rewardCredits}
                onChange={setRewardCredits}
                presets={REWARD_PRESETS}
                formatLabel={n => `${n} cr`}
              />
            </div>
          )}

          {paid && (
            <p className="text-xs text-amber-300/90 bg-amber-400/10 border border-amber-400/30 rounded-xl px-3 py-2">
              Marked as a <strong>paid follow</strong>. Followers won't earn credits and won't be checked against requirements — they're guaranteed slots.
            </p>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-accent text-dark-900 hover:bg-blue-accent/90"
            >
              <Sparkles size={14} /> Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PresetField({ label, value, onChange, presets, formatLabel }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
        {label}
      </span>
      <div className="mt-1.5 space-y-2">
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
    </label>
  )
}
