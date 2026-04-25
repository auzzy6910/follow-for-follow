import { useState } from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Link, Globe, Eye, Moon, Smartphone } from 'lucide-react'
import { PLATFORMS, NICHES } from '../data/mockData'

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-green-accent' : 'bg-dark-500'}`}
    >
      <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[3px] transition-transform ${enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
    </button>
  )
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [autoVerify, setAutoVerify] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [proxyProtection, setProxyProtection] = useState(true)
  const [dwellTimeEnabled, setDwellTimeEnabled] = useState(true)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={24} className="text-green-accent" /> Settings
        </h2>
        <p className="text-gray-400 text-sm mt-1">Manage your account preferences and connected platforms</p>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <User size={18} /> Profile Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-accent to-cyan-400 flex items-center justify-center text-dark-900 font-bold text-xl">U</div>
            <button className="text-sm bg-dark-600 text-gray-300 px-4 py-2 rounded-xl hover:bg-dark-500 transition-colors">Change Avatar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Display Name</label>
              <input type="text" defaultValue="Your Name" className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Username</label>
              <input type="text" defaultValue="@yourusername" className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium mb-1.5 block">Bio</label>
            <textarea rows={3} defaultValue="Tell the community about yourself..." className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50 resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Primary Niche</label>
              <select className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50 appearance-none">
                {NICHES.map(n => <option key={n.id} value={n.id}>{n.icon} {n.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Location</label>
              <input type="text" placeholder="e.g., Nairobi, Kenya" className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Link size={18} /> Connected Platforms (OAuth)
        </h3>
        <p className="text-gray-400 text-sm mb-4">Securely connect via OAuth. We never ask for your password.</p>
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
                  : 'bg-green-accent/10 text-green-accent hover:bg-green-accent/20'
              }`}>
                {i < 2 ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell size={18} /> Notifications & Preferences
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Push Notifications', desc: 'Get alerts for new followers and engagement trains', value: notifications, setter: setNotifications, icon: Bell },
            { label: 'Email Alerts', desc: 'Weekly summary and important updates', value: emailAlerts, setter: setEmailAlerts, icon: Globe },
            { label: 'Auto-Verify Follows', desc: 'Automatically verify follows via API', value: autoVerify, setter: setAutoVerify, icon: Shield },
            { label: 'Dark Mode', desc: 'Currently enabled', value: darkMode, setter: setDarkMode, icon: Moon },
            { label: 'Proxy Protection', desc: 'Route automated checks through proxies', value: proxyProtection, setter: setProxyProtection, icon: Eye },
            { label: 'Dwell Time Requirement', desc: 'Require 15-30s engagement before credits', value: dwellTimeEnabled, setter: setDwellTimeEnabled, icon: Smartphone },
          ].map((setting, i) => (
            <div key={i} className="flex items-center gap-4">
              <setting.icon size={18} className="text-gray-400 shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{setting.label}</p>
                <p className="text-gray-500 text-xs">{setting.desc}</p>
              </div>
              <ToggleSwitch enabled={setting.value} onChange={setting.setter} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="px-6 py-2.5 bg-green-accent text-dark-900 font-semibold rounded-xl hover:bg-green-accent/90 transition-colors">
          Save Changes
        </button>
        <button className="px-6 py-2.5 bg-dark-700 text-gray-300 font-medium rounded-xl hover:bg-dark-600 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}
