import { useState } from 'react'
import { Clock, Zap, Users, Calendar, Play, Timer, Eye, MessageSquare, Plus } from 'lucide-react'
import {
  useGoldenHourSessions,
  usePlatforms,
} from '../hooks/useAppData'

export default function GoldenHour() {
  const [activeTab, setActiveTab] = useState('sessions')
  const GOLDEN_HOUR_SESSIONS = useGoldenHourSessions()
  const PLATFORMS = usePlatforms()

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Zap size={24} className="text-amber-400" /> Golden Hour Boost
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Schedule posts & join engagement trains to trigger the algorithm within the first 60-90 minutes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-white">60-90 min</p>
              <p className="text-gray-500 text-xs">Critical engagement window</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-accent/10 flex items-center justify-center shrink-0">
              <Users size={20} className="text-green-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-white">50+</p>
              <p className="text-gray-500 text-xs">Users per engagement train</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
              <Timer size={20} className="text-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-white">15-30 sec</p>
              <p className="text-gray-500 text-xs">Min dwell time per post</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-dark-800 p-1 rounded-xl border border-dark-600 overflow-x-auto no-scrollbar">
        {[
          { id: 'sessions', label: 'Scheduled Trains' },
          { id: 'schedule', label: 'Schedule a Post' },
          { id: 'dwell', label: 'Dwell Tasks' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'bg-green-accent/10 text-green-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {GOLDEN_HOUR_SESSIONS.map(session => {
            const platform = PLATFORMS.find(p => p.id === session.platform)
            const time = new Date(session.scheduledTime)
            const isUpcoming = session.status === 'upcoming'
            return (
              <div key={session.id} className={`bg-dark-800 border rounded-2xl p-4 sm:p-5 ${isUpcoming ? 'border-green-accent/30' : 'border-dark-600'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isUpcoming ? 'bg-green-accent/10' : 'bg-dark-600'}`}>
                      {platform?.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-white font-semibold text-sm sm:text-base">{platform?.name} Engagement Train</h4>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isUpcoming ? 'bg-green-accent/10 text-green-accent' : 'bg-dark-600 text-gray-400'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 mt-1 flex-wrap">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Calendar size={14} />
                          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Users size={14} />
                          {session.participants} participants
                        </span>
                      </div>
                    </div>
                  </div>
                  {isUpcoming && (
                    <button className="w-full sm:w-auto px-5 py-2.5 bg-green-accent text-dark-900 font-semibold rounded-xl hover:bg-green-accent/90 transition-colors flex items-center justify-center gap-2 shrink-0">
                      <Play size={16} /> Join Train
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} /> Schedule Your Post
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Schedule your post through our platform. When it goes live, we alert 50+ users to engage immediately.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Platform</label>
              <select className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50 appearance-none">
                {PLATFORMS.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Post URL (paste when ready)</label>
              <input
                type="text"
                placeholder="https://instagram.com/p/..."
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Scheduled Time</label>
              <input
                type="datetime-local"
                className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Credits to Spend (more = more participants)</label>
              <input
                type="range"
                min="50"
                max="500"
                defaultValue="200"
                className="w-full accent-green-500"
              />
              <div className="flex justify-between text-gray-500 text-xs mt-1">
                <span>50 cr (10 users)</span>
                <span>500 cr (50+ users)</span>
              </div>
            </div>
            <button className="w-full py-3 bg-green-accent text-dark-900 font-semibold rounded-xl hover:bg-green-accent/90 transition-colors">
              Schedule Post
            </button>
          </div>
        </div>
      )}

      {activeTab === 'dwell' && (
        <div className="space-y-4">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
            <h3 className="text-white font-semibold mb-2">Dwell Time Tasks</h3>
            <p className="text-gray-400 text-sm mb-4">
              Stay on a post for 15-30 seconds before claiming credits. This ensures genuine engagement that algorithms reward.
            </p>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-dark-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-dark-600 flex items-center justify-center shrink-0">
                    <Eye size={24} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Post #{i} from @user{i * 3}</p>
                    <p className="text-gray-500 text-xs">Platform: Instagram</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Timer size={12} className="text-amber-400" />
                      <span className="text-amber-400 text-xs">Min 15 seconds dwell time</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-accent text-sm font-bold">+30 cr</p>
                    <button className="mt-2 text-xs bg-green-accent/10 text-green-accent px-3 py-1.5 rounded-lg hover:bg-green-accent/20 transition-colors flex items-center gap-1">
                      <Eye size={12} /> View & Engage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <MessageSquare size={18} className="text-cyan-400" /> AI Comment Suggestions
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Instead of generic comments like "Nice!" or fire emojis, use AI-generated contextual comments that algorithms won't flag as spam.
            </p>
            <div className="space-y-2">
              {[
                '"This perspective on AI in healthcare is refreshing - love how you connected it to accessibility."',
                '"The lighting in this shot is incredible. What camera settings did you use for the golden hour?"',
                '"Great breakdown of the DeFi landscape. The comparison chart really helps visualize the differences."'
              ].map((comment, i) => (
                <div key={i} className="bg-dark-700 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-gray-300 text-sm flex-1 italic">{comment}</span>
                  <button className="text-xs bg-cyan-400/10 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-400/20 transition-colors shrink-0">
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
