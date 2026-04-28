import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Coins, Sparkles, Users, ImagePlus } from 'lucide-react'
import { ENGAGEMENT_ASKS } from '../data/mockData'
import { useNiches, usePlatforms, useUsers, useFeaturedUser } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=600&fit=crop',
]

export default function CreatePost() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const NICHES = useNiches()
  const PLATFORMS = usePlatforms()
  const USERS = useUsers()
  const FEATURED = useFeaturedUser()
  const { addPost } = useAppContext()
  const { isAuthenticated, openModal } = useAuthGuard()

  const allUsers = useMemo(() => {
    const featured = FEATURED ? [FEATURED] : []
    return [...featured, ...(USERS || [])]
  }, [FEATURED, USERS])

  const initialAuthorId = searchParams.get('authorId') || (FEATURED ? FEATURED.id : '')
  const [authorId, setAuthorId] = useState(initialAuthorId)
  const author = allUsers.find(u => u.id === authorId) || allUsers[0]

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [niche, setNiche] = useState(author?.niche || (NICHES[0]?.id ?? ''))
  const [platform, setPlatform] = useState(author?.platform || (PLATFORMS[0]?.id ?? ''))
  const [minFollowers, setMinFollowers] = useState(1000)
  const [rewardCredits, setRewardCredits] = useState(150)
  const [asks, setAsks] = useState(['follow'])
  const [image, setImage] = useState(DEFAULT_IMAGES[0])
  const [submitting, setSubmitting] = useState(false)

  const toggleAsk = id => {
    setAsks(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const valid =
    title.trim().length > 0 &&
    asks.length > 0 &&
    Number(minFollowers) >= 0 &&
    Number(rewardCredits) > 0 &&
    !!authorId

  const handleSubmit = e => {
    e.preventDefault()
    if (!valid || submitting) return
    if (!isAuthenticated) {
      openModal()
      return
    }
    setSubmitting(true)
    const post = addPost({
      authorId,
      title: title.trim(),
      description: description.trim(),
      niche,
      platform,
      minFollowers: Number(minFollowers),
      rewardCredits: Number(rewardCredits),
      engagementAsks: asks,
      image,
    })
    navigate(`/posts/${post.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-white text-lg font-semibold flex items-center gap-2">
          <Sparkles size={18} className="text-green-accent" />
          New F4F post
        </h1>
        <span className="w-8" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-6 space-y-5"
      >
        {/* Author */}
        <Field label="Posting as">
          <select
            value={authorId}
            onChange={e => {
              const id = e.target.value
              setAuthorId(id)
              const next = allUsers.find(u => u.id === id)
              if (next) {
                setNiche(next.niche)
                setPlatform(next.platform)
              }
            }}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-accent"
          >
            {allUsers.map(u => (
              <option key={u.id} value={u.id}>
                @{u.username} — {u.displayName}
              </option>
            ))}
          </select>
        </Field>

        {/* Title */}
        <Field label="Title" hint="Short, scannable headline.">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Tech tribe boost — 200cr/follow"
            maxLength={80}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-accent"
            required
          />
        </Field>

        {/* Description */}
        <Field label="Description" hint="Optional — tell people what your account is about.">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            maxLength={400}
            placeholder="Looking for genuine engagers in the tech niche…"
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-accent resize-none"
          />
        </Field>

        {/* Niche + platform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Niche">
            <select
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-accent"
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
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-accent"
            >
              {PLATFORMS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Numeric requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Minimum followers" hint="Filter who can claim this post.">
            <div className="flex items-center gap-2 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-accent">
              <Users size={14} className="text-gray-400 shrink-0" />
              <input
                type="number"
                min={0}
                step={100}
                value={minFollowers}
                onChange={e => setMinFollowers(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none"
                required
              />
            </div>
          </Field>

          <Field label="Reward credits" hint="Credits paid per verified follow.">
            <div className="flex items-center gap-2 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-accent">
              <Coins size={14} className="text-amber-400 shrink-0" />
              <input
                type="number"
                min={1}
                step={10}
                value={rewardCredits}
                onChange={e => setRewardCredits(e.target.value)}
                className="w-full bg-transparent text-white text-sm focus:outline-none"
                required
              />
            </div>
          </Field>
        </div>

        {/* Engagement asks */}
        <Field label="Engagement asks" hint="Pick everything you want claimers to do.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ENGAGEMENT_ASKS.map(a => {
              const active = asks.includes(a.id)
              return (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => toggleAsk(a.id)}
                  className={`flex items-center gap-2 text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                    active
                      ? 'bg-green-accent/15 border-green-accent text-green-accent'
                      : 'bg-dark-700 border-dark-600 text-gray-300 hover:text-white hover:border-dark-500'
                  }`}
                >
                  <span className="text-base">{a.icon}</span>
                  <span className="font-medium">{a.label}</span>
                </button>
              )
            })}
          </div>
        </Field>

        {/* Cover image */}
        <Field label="Cover image">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DEFAULT_IMAGES.map(src => (
              <button
                type="button"
                key={src}
                onClick={() => setImage(src)}
                className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                  image === src ? 'border-green-accent' : 'border-transparent hover:border-dark-500'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <ImagePlus size={12} /> Pick a cover or paste a URL below.
          </div>
          <input
            type="url"
            value={image}
            onChange={e => setImage(e.target.value)}
            className="mt-1 w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-green-accent"
            placeholder="https://…"
          />
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Link
            to={authorId ? `/profile/${authorId}` : '/'}
            className="text-sm font-semibold py-2 px-4 rounded-lg bg-dark-600 text-white hover:bg-dark-500 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!valid || submitting}
            className="text-sm font-semibold py-2 px-5 rounded-lg bg-green-accent text-dark-900 hover:bg-green-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish post
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-white text-sm font-medium">{label}</span>
        {hint && <span className="text-gray-500 text-xs">{hint}</span>}
      </div>
      {children}
    </label>
  )
}
