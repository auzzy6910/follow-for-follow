import { useMemo, useState } from 'react'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Link2,
  Globe,
  Eye,
  Moon,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Lock,
  MapPin,
  Mail,
  Zap,
  Target,
  LogOut,
} from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'
import {
  usePlatforms,
  useNiches,
  useOwnerProfile,
  useSetOwnerProfile,
} from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import {
  detectPlatformFromUrl,
  SUPPORTED_PLATFORMS,
} from '../utils/platformDetect'

function ToggleSwitch({ enabled, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-blue-accent' : 'bg-dark-500'}`}
    >
      <div
        className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[3px] transition-transform ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}`}
      />
    </button>
  )
}

function ConnectSocialPanel() {
  const {
    connectedSocials,
    dispatch,
    notify,
    settings,
  } = useAppContext()
  const setOwnerProfile = useSetOwnerProfile()
  const ownerData = useOwnerProfile()
  const [url, setUrl] = useState('')

  const detected = useMemo(() => detectPlatformFromUrl(url), [url])
  const trimmedUrl = url.trim()
  const showInvalid = trimmedUrl.length > 4 && !detected

  const handleConnect = () => {
    if (!detected) return
    dispatch({
      type: 'CONNECT_SOCIAL',
      social: {
        ...detected,
        connectedAt: Date.now(),
      },
    })
    notify(
      `${detected.icon} ${detected.name} connected as @${detected.username}.`,
      'success',
    )
    setUrl('')

    // If signed in, also persist platform on the owner profile so the
    // featured profile reflects the connection.
    if (ownerData?.profile) {
      const profile = ownerData.profile
      void setOwnerProfile({
        displayName: profile.displayName,
        username: profile.username,
        bio: profile.bio,
        avatar: profile.avatar || undefined,
        cover: profile.cover || undefined,
        niche: profile.niche || undefined,
        platform: detected.platform,
        location: profile.location || undefined,
      }).catch(() => {
        // best-effort; localStorage already holds the connection
      })
    }
  }

  const handleDisconnect = (platform) => {
    dispatch({ type: 'DISCONNECT_SOCIAL', platform })
    notify('Account disconnected.', 'info')
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
      <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
        <Link2 size={18} /> Connect a Social Account
      </h3>
      <p className="text-gray-400 text-xs sm:text-sm mb-4">
        Paste any profile URL — we&apos;ll auto-detect the platform and save it
        to your profile. Supports{' '}
        {SUPPORTED_PLATFORMS.map((p) => p.name).join(', ')}.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-gray-400 text-xs font-medium mb-1.5 block">
            Profile URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={(e) => {
                const pasted = e.clipboardData?.getData('text') ?? ''
                if (pasted) setUrl(pasted)
              }}
              placeholder="https://instagram.com/yourhandle"
              className={`w-full bg-dark-700 border rounded-xl px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                detected
                  ? 'border-emerald-400/60 focus:border-emerald-400'
                  : showInvalid
                    ? 'border-red-500/60 focus:border-red-500'
                    : 'border-dark-500 focus:border-blue-accent/50'
              }`}
              autoComplete="off"
            />
            {detected && (
              <CheckCircle2
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
              />
            )}
            {showInvalid && (
              <AlertCircle
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400"
              />
            )}
          </div>
          {detected && (
            <p className="mt-1.5 text-[12px] text-emerald-300 flex items-center gap-1">
              <span>{detected.icon}</span>
              <span>
                Detected <strong>{detected.name}</strong> · username{' '}
                <strong>@{detected.username}</strong>
              </span>
            </p>
          )}
          {showInvalid && (
            <p className="mt-1.5 text-[12px] text-red-300">
              We couldn&apos;t recognise that URL. Try a full link like
              https://twitter.com/handle.
            </p>
          )}
          {!trimmedUrl && (
            <p className="mt-1.5 text-[11px] text-gray-500">
              Tip: paste with Ctrl+V — we&apos;ll detect the platform instantly.
            </p>
          )}
        </div>
        <div className="sm:pt-[26px]">
          <button
            type="button"
            onClick={handleConnect}
            disabled={!detected}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-accent text-dark-900 font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
          Connected accounts ({connectedSocials.length})
        </p>
        {connectedSocials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-dark-500 bg-dark-700/40 px-4 py-5 text-center">
            <p className="text-gray-400 text-sm">
              No accounts connected yet. Paste a link above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {connectedSocials.map((social) => (
              <div
                key={social.platform}
                className="flex items-center gap-3 bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5"
              >
                <span className="text-2xl shrink-0">{social.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {social.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    @{social.username}
                  </p>
                </div>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-accent p-1.5 rounded-lg"
                  aria-label={`Open ${social.name} profile`}
                  title={`Open ${social.name} profile`}
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => handleDisconnect(social.platform)}
                  className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg"
                  aria-label={`Disconnect ${social.name}`}
                  title="Disconnect"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {settings.engagementTrainOptIn && connectedSocials.length > 0 && (
        <div className="mt-4 flex items-start gap-2 text-[11px] text-blue-200/80 bg-blue-accent/5 border border-blue-accent/20 rounded-lg px-3 py-2">
          <Zap size={12} className="mt-0.5 shrink-0" />
          <span>
            You&apos;re opted in to engagement trains — connected accounts will
            be auto-suggested in Golden Hour sessions.
          </span>
        </div>
      )}
    </div>
  )
}

export default function Settings() {
  const { settings, dispatch, notify } = useAppContext()
  const PLATFORMS = usePlatforms()
  const NICHES = useNiches()
  const ownerData = useOwnerProfile()
  const setOwnerProfile = useSetOwnerProfile()
  const { signOut } = useAuthActions()

  const initialProfile = useMemo(
    () => ({
      displayName: ownerData?.profile?.displayName ?? '',
      username: ownerData?.profile?.username ?? '',
      bio: ownerData?.profile?.bio ?? '',
      avatar: ownerData?.profile?.avatar ?? '',
      cover: ownerData?.profile?.cover ?? '',
      niche: ownerData?.profile?.niche ?? '',
      location: ownerData?.profile?.location ?? '',
    }),
    [ownerData],
  )
  const profileId = ownerData?.profile?.id ?? 'new'
  const [profileForm, setProfileForm] = useState(initialProfile)
  const [lastProfileId, setLastProfileId] = useState(profileId)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState(null)

  // Sync the form with freshly loaded profile data using the
  // "adjusting state during render" pattern instead of useEffect+setState.
  if (profileId !== lastProfileId) {
    setLastProfileId(profileId)
    setProfileForm(initialProfile)
  }

  const updateSetting = (key, value) => {
    dispatch({ type: 'UPDATE_SETTING', key, value })
  }

  const updateProfileField = (key) => (event) => {
    setProfileForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const isAuthenticated = ownerData !== null && ownerData !== undefined
  const profileLoading = ownerData === undefined
  const profileFormDisabled = !isAuthenticated || savingProfile

  const handleSaveProfile = async () => {
    if (!isAuthenticated) {
      notify('Sign in to save profile changes.', 'error')
      return
    }
    const displayName = profileForm.displayName.trim()
    const username = profileForm.username.trim().replace(/^@+/, '')
    const bio = profileForm.bio.trim()
    if (!displayName || !username || !bio) {
      setProfileError('Display name, username, and bio are required.')
      return
    }
    setProfileError(null)
    setSavingProfile(true)
    try {
      await setOwnerProfile({
        displayName,
        username,
        bio,
        avatar: profileForm.avatar.trim() || undefined,
        cover: profileForm.cover.trim() || undefined,
        niche: profileForm.niche || undefined,
        location: profileForm.location.trim() || undefined,
      })
      notify('Profile saved across the site.', 'success')
    } catch (err) {
      setProfileError(err?.message || 'Could not save profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const settingsItems = [
    { key: 'notifications', label: 'Push Notifications', desc: 'Get alerts for new followers and engagement trains', icon: Bell },
    { key: 'emailAlerts', label: 'Email Alerts', desc: 'Per-event email notifications', icon: Globe },
    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Friday summary of growth, credits and streaks', icon: Mail },
    { key: 'autoVerify', label: 'Auto-Verify Follows', desc: 'Automatically verify follows via API', icon: Shield },
    { key: 'engagementTrainOptIn', label: 'Engagement Trains', desc: 'Auto-join Golden Hour trains in your niche', icon: Zap },
    { key: 'privateProfile', label: 'Private Profile', desc: 'Only your followers can see your posts and tribes', icon: Lock },
    { key: 'showLocation', label: 'Show Location', desc: 'Display your city on your public profile', icon: MapPin },
    { key: 'darkMode', label: 'Dark Mode', desc: 'Currently enabled', icon: Moon },
    { key: 'proxyProtection', label: 'Proxy Protection', desc: 'Route automated checks through proxies', icon: Eye },
    { key: 'dwellTimeEnabled', label: 'Dwell Time Requirement', desc: `Require ${settings.dwellTimeDuration}s engagement before credits are awarded`, icon: Smartphone },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={24} className="text-blue-accent" /> Settings
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage your account preferences and connected platforms</p>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
          <User size={18} /> Profile Settings
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          These details power your featured profile on the dashboard and your
          public profile page.
        </p>
        {profileLoading ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading your
            profile…
          </div>
        ) : !isAuthenticated ? (
          <p className="text-sm text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            Sign in to view and edit your profile information.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {profileForm.avatar ? (
                <img
                  src={profileForm.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover border border-dark-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-accent to-cyan-400 flex items-center justify-center text-dark-900 font-bold text-xl">
                  {(profileForm.displayName || ownerData?.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={profileForm.avatar}
                  onChange={updateProfileField('avatar')}
                  placeholder="https://..."
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">
                  Display Name <span className="text-blue-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.displayName}
                  onChange={updateProfileField('displayName')}
                  placeholder="e.g., Alex Chen"
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">
                  Username <span className="text-blue-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.username}
                  onChange={updateProfileField('username')}
                  placeholder="@yourhandle"
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">
                Bio <span className="text-blue-accent">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={profileForm.bio}
                onChange={updateProfileField('bio')}
                placeholder="Tell the community about yourself..."
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50 resize-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">
                Cover Image URL
              </label>
              <input
                type="url"
                value={profileForm.cover}
                onChange={updateProfileField('cover')}
                placeholder="https://..."
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">
                  Primary Niche
                </label>
                <select
                  value={profileForm.niche}
                  onChange={updateProfileField('niche')}
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-accent/50 appearance-none"
                >
                  <option value="">Select a niche…</option>
                  {NICHES.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.icon} {n.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">
                  Location
                </label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={updateProfileField('location')}
                  placeholder="e.g., Nairobi, Kenya"
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
                />
              </div>
            </div>
            {profileError && (
              <div
                role="alert"
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                {profileError}
              </div>
            )}
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={profileFormDisabled}
              className="inline-flex items-center gap-2 bg-blue-accent text-dark-900 font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {savingProfile && <Loader2 size={16} className="animate-spin" />}
              Save profile
            </button>
          </div>
        )}
      </div>

      <ConnectSocialPanel />

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Link2 size={18} /> OAuth Platforms
        </h3>
        <p className="text-gray-400 text-sm mb-4">Securely connect via OAuth — coming soon. We never ask for your password.</p>
        <div className="space-y-3">
          {PLATFORMS.map((platform, i) => (
            <div key={platform.id} className="flex items-center gap-4 bg-dark-700 rounded-xl p-4">
              <span className="text-2xl">{platform.icon}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{platform.name}</p>
                <p className="text-gray-500 text-xs">{i < 2 ? 'Connected' : 'Not connected'}</p>
              </div>
              <button className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                i < 2
                  ? 'bg-dark-600 text-gray-400 hover:bg-red-400/10 hover:text-red-400'
                  : 'bg-blue-accent/10 text-blue-accent hover:bg-blue-accent/20'
              }`}>
                {i < 2 ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell size={18} /> Notifications & Preferences
        </h3>
        <div className="space-y-4">
          {settingsItems.map((setting) => (
            <div key={setting.key} className="flex items-center gap-4">
              <setting.icon size={18} className="text-gray-400 shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{setting.label}</p>
                <p className="text-gray-500 text-xs">{setting.desc}</p>
              </div>
              <ToggleSwitch
                enabled={settings[setting.key]}
                onChange={(val) => updateSetting(setting.key, val)}
                ariaLabel={setting.label}
              />
            </div>
          ))}

          {settings.dwellTimeEnabled && (
            <div className="ml-8 pl-4 border-l border-dark-500">
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Dwell Time Duration (seconds)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={15}
                  max={30}
                  value={settings.dwellTimeDuration}
                  onChange={e => updateSetting('dwellTimeDuration', parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-white text-sm font-medium w-8 text-right">{settings.dwellTimeDuration}s</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 pt-2 border-t border-dark-600">
            <Target size={18} className="text-gray-400 shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium mb-1">Daily Follow Goal</p>
              <p className="text-gray-500 text-xs mb-2">
                We&apos;ll nudge you when you&apos;re below this number.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={settings.dailyFollowGoal}
                  onChange={e => updateSetting('dailyFollowGoal', parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-white text-sm font-medium w-12 text-right">{settings.dailyFollowGoal}/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => notify('Settings saved.', 'success')}
          className="px-6 py-2.5 bg-blue-accent text-dark-900 font-semibold rounded-xl hover:bg-blue-accent/90 transition-colors"
        >
          Save Changes
        </button>
        {isAuthenticated && (
          <button
            type="button"
            onClick={async () => {
              await signOut()
              notify('Signed out.', 'info')
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-dark-700 border border-dark-500 text-gray-200 font-semibold rounded-xl hover:bg-dark-600 transition-colors"
          >
            <LogOut size={16} /> Sign out
          </button>
        )}
      </div>
    </div>
  )
}
