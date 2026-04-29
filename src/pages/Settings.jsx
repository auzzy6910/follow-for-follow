import { useMemo, useState } from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Link, Globe, Eye, Moon, Smartphone, Loader2 } from 'lucide-react'
import {
  usePlatforms,
  useNiches,
  useOwnerProfile,
  useSetOwnerProfile,
} from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-blue-accent' : 'bg-dark-500'}`}
    >
      <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[3px] transition-transform ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
    </button>
  )
}

export default function Settings() {
  const { settings, dispatch, notify } = useAppContext()
  const PLATFORMS = usePlatforms()
  const NICHES = useNiches()
  const ownerData = useOwnerProfile()
  const setOwnerProfile = useSetOwnerProfile()

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
    { key: 'emailAlerts', label: 'Email Alerts', desc: 'Weekly summary and important updates', icon: Globe },
    { key: 'autoVerify', label: 'Auto-Verify Follows', desc: 'Automatically verify follows via API', icon: Shield },
    { key: 'darkMode', label: 'Dark Mode', desc: 'Currently enabled', icon: Moon },
    { key: 'proxyProtection', label: 'Proxy Protection', desc: 'Route automated checks through proxies', icon: Eye },
    { key: 'dwellTimeEnabled', label: 'Dwell Time Requirement', desc: `Require ${settings.dwellTimeDuration}s engagement before credits are awarded`, icon: Smartphone },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon size={24} className="text-blue-accent" /> Settings
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage your account preferences and connected platforms</p>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <h3 className="text-gray-900 font-semibold mb-1 flex items-center gap-2">
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-accent to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
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
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
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
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
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
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
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
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50 resize-none"
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
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
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
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-accent/50 appearance-none"
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
                  className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
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
              className="inline-flex items-center gap-2 bg-blue-accent text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {savingProfile && <Loader2 size={16} className="animate-spin" />}
              Save profile
            </button>
          </div>
        )}
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Link size={18} /> Connected Platforms (OAuth)
        </h3>
        <p className="text-gray-400 text-sm mb-4">Securely connect via OAuth. We never ask for your password.</p>
        <div className="space-y-3">
          {PLATFORMS.map((platform, i) => (
            <div key={platform.id} className="flex items-center gap-4 bg-dark-700 rounded-xl p-4">
              <span className="text-2xl">{platform.icon}</span>
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-medium">{platform.name}</p>
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
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Bell size={18} /> Notifications & Preferences
        </h3>
        <div className="space-y-4">
          {settingsItems.map((setting) => (
            <div key={setting.key} className="flex items-center gap-4">
              <setting.icon size={18} className="text-gray-400 shrink-0" />
              <div className="flex-1">
                <p className="text-gray-900 text-sm font-medium">{setting.label}</p>
                <p className="text-gray-500 text-xs">{setting.desc}</p>
              </div>
              <ToggleSwitch
                enabled={settings[setting.key]}
                onChange={(val) => updateSetting(setting.key, val)}
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
                <span className="text-gray-900 text-sm font-medium w-8 text-right">{settings.dwellTimeDuration}s</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => notify('Settings saved.', 'success')}
          className="px-6 py-2.5 bg-blue-accent text-white font-semibold rounded-xl hover:bg-blue-accent/90 transition-colors"
        >
          Save Changes
        </button>
        <button className="px-6 py-2.5 bg-dark-700 text-gray-700 font-medium rounded-xl hover:bg-dark-600 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}
