import { useState, useEffect, useCallback } from 'react'
import {
  Clock, Zap, Users, Calendar, Play, Timer, Eye, MessageSquare,
  Plus, CheckCircle2, Circle, Link as LinkIcon, Flame
} from 'lucide-react'
import {
  useGoldenHourSessions,
  usePlatforms,
} from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'

function LiveCounter({ base }) {
  const [count, setCount] = useState(base)
  useEffect(() => {
    const iv = setInterval(() => {
      setCount(c => c + (Math.random() > 0.6 ? 1 : 0))
    }, 3000)
    return () => clearInterval(iv)
  }, [])
  return (
    <span className="text-green-accent font-bold tabular-nums">{count}</span>
  )
}

function PostChecklist({ onComplete }) {
  const [checks, setChecks] = useState([
    { id: 'post', label: 'Post is live on platform', done: false },
    { id: 'url', label: 'Post URL added', done: false },
    { id: 'engage', label: 'Engaged with 3+ other posts (15s+ dwell)', done: false },
    { id: 'comment', label: 'Left a genuine comment on 2+ posts', done: false },
    { id: 'share', label: 'Shared the train link with a friend', done: false },
  ])

  const toggle = useCallback((id) => {
    setChecks(prev => {
      const next = prev.map(c => c.id === id ? { ...c, done: !c.done } : c)
      if (next.every(c => c.done)) onComplete()
      return next
    })
  }, [onComplete])

  const completedCount = checks.filter(c => c.done).length

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-accent" /> Post-Completion Checklist
        </h3>
        <span className="text-xs text-gray-400">{completedCount}/{checks.length} done</span>
      </div>
      <div className="w-full bg-dark-600 rounded-full h-1.5 mb-4">
        <div
          className="progress-bar h-1.5"
          style={{ width: `${(completedCount / checks.length) * 100}%` }}
        />
      </div>
      <div className="space-y-2">
        {checks.map(check => (
          <button
            key={check.id}
            onClick={() => toggle(check.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
              check.done ? 'bg-green-accent/5' : 'bg-dark-700 hover:bg-dark-600'
            }`}
          >
            {check.done
              ? <CheckCircle2 size={18} className="text-green-accent shrink-0" />
              : <Circle size={18} className="text-gray-500 shrink-0" />
            }
            <span className={`text-sm ${check.done ? 'text-green-accent line-through' : 'text-gray-300'}`}>
              {check.label}
            </span>
          </button>
        ))}
      </div>
      {completedCount === checks.length && (
        <div className="mt-4 p-3 bg-green-accent/10 rounded-xl text-center">
          <p className="text-green-accent text-sm font-semibold">All tasks complete! +100 bonus credits earned 🎉</p>
        </div>
      )}
    </div>
  )
}

function ScheduleForm({ platforms, onSchedule }) {
  const [platform, setPlatform] = useState(platforms[0]?.id || '')
  const [postUrl, setPostUrl] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [credits, setCredits] = useState(200)

  const handleSubmit = () => {
    if (!postUrl || !dateTime) return
    onSchedule({ platform, postUrl, dateTime, credits })
    setPostUrl('')
    setDateTime('')
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Plus size={18} /> Schedule Your Post
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Schedule your post through our platform. When it goes live, we alert 50+ users to engage immediately during the golden window.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-xs font-medium mb-1.5 block">Platform</label>
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50 appearance-none"
          >
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs font-medium mb-1.5 block">Post URL</label>
          <div className="relative">
            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              value={postUrl}
              onChange={e => setPostUrl(e.target.value)}
              placeholder="https://instagram.com/p/..."
              className="w-full bg-dark-700 border border-dark-500 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs font-medium mb-1.5 block">Date</label>
            <input
              type="date"
              value={dateTime.split('T')[0] || ''}
              onChange={e => setDateTime(e.target.value + 'T' + (dateTime.split('T')[1] || '12:00'))}
              className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium mb-1.5 block">Time</label>
            <input
              type="time"
              value={dateTime.split('T')[1] || ''}
              onChange={e => setDateTime((dateTime.split('T')[0] || '') + 'T' + e.target.value)}
              className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-accent/50"
            />
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-xs font-medium mb-1.5 block">
            Credits to Spend: <span className="text-green-accent font-semibold">{credits} cr</span>
            <span className="text-gray-500 ml-1">(≈ {Math.floor(credits / 10)} participants)</span>
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={credits}
            onChange={e => setCredits(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-gray-500 text-xs mt-1">
            <span>50 cr (5 users)</span>
            <span>500 cr (50+ users)</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!postUrl || !dateTime}
          className="w-full py-3 bg-green-accent text-dark-900 font-semibold rounded-xl hover:bg-green-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Calendar size={16} /> Schedule Post
        </button>
      </div>
    </div>
  )
}

function EngagementTrain({ session, platform, onJoin }) {
  const time = new Date(session.scheduledTime)
  const isUpcoming = session.status === 'upcoming'
  const isLive = session.status === 'live'
  const [joined, setJoined] = useState(false)

  const handleJoin = () => {
    setJoined(true)
    onJoin(session.id)
  }

  return (
    <div className={`bg-dark-800 border rounded-2xl p-4 sm:p-5 ${
      isLive ? 'border-amber-400/40' : isUpcoming ? 'border-green-accent/30' : 'border-dark-600'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
            isLive ? 'bg-amber-400/10' : isUpcoming ? 'bg-green-accent/10' : 'bg-dark-600'
          }`}>
            {platform?.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-white font-semibold text-sm sm:text-base">{platform?.name} Engagement Train</h4>
              {isLive && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 flex items-center gap-1">
                  <Flame size={10} /> LIVE
                </span>
              )}
              {isUpcoming && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-accent/10 text-green-accent">
                  upcoming
                </span>
              )}
              {session.status === 'completed' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-dark-600 text-gray-400">
                  completed
                </span>
              )}
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
                {(isLive || isUpcoming) ? (
                  <><LiveCounter base={session.participants} /> participants</>
                ) : (
                  <>{session.participants} participants</>
                )}
              </span>
            </div>
          </div>
        </div>
        {(isUpcoming || isLive) && !joined && (
          <button
            onClick={handleJoin}
            className={`w-full sm:w-auto px-5 py-2.5 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 ${
              isLive
                ? 'bg-amber-400 text-dark-900 hover:bg-amber-400/90'
                : 'bg-green-accent text-dark-900 hover:bg-green-accent/90'
            }`}
          >
            <Play size={16} /> {isLive ? 'Join Now' : 'Join Train'}
          </button>
        )}
        {joined && (
          <span className="text-green-accent text-sm font-medium flex items-center gap-1">
            <CheckCircle2 size={16} /> Joined
          </span>
        )}
      </div>
    </div>
  )
}

export default function GoldenHour() {
  const [activeTab, setActiveTab] = useState('sessions')
  const GOLDEN_HOUR_SESSIONS = useGoldenHourSessions()
  const PLATFORMS = usePlatforms()
  const { notify } = useAppContext()
  const { requireAuth } = useAuthGuard()
  const [scheduled, setScheduled] = useState([])

  const enhancedSessions = [
    { id: 'gh-live', scheduledTime: new Date().toISOString(), platform: 'instagram', participants: 43, status: 'live', postUrl: '' },
    ...GOLDEN_HOUR_SESSIONS,
  ]

  const handleSchedule = (data) => {
    requireAuth(() => {
      const platform = PLATFORMS.find(p => p.id === data.platform)
      setScheduled(prev => [...prev, {
        id: `sched-${Date.now()}`,
        scheduledTime: data.dateTime,
        platform: data.platform,
        participants: 0,
        status: 'upcoming',
        postUrl: data.postUrl,
        credits: data.credits,
      }])
      notify(`Post scheduled on ${platform?.name || data.platform} for ${new Date(data.dateTime).toLocaleString()}!`, 'success')
    })
  }

  const handleJoinTrain = () => {
    requireAuth(() => {
      notify('Joined engagement train! You\'ll be notified when it starts.', 'success')
    })
  }

  const handleChecklistComplete = () => {
    requireAuth(() => {
      notify('All checklist items complete! +100 bonus credits earned!', 'success')
    })
  }

  const allSessions = [...enhancedSessions, ...scheduled].sort((a, b) => {
    const order = { live: 0, upcoming: 1, completed: 2 }
    return (order[a.status] ?? 3) - (order[b.status] ?? 3)
  })

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
              <p className="text-lg sm:text-xl font-bold text-white">
                <LiveCounter base={50} />+
              </p>
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
          { id: 'sessions', label: 'Engagement Trains' },
          { id: 'schedule', label: 'Schedule a Post' },
          { id: 'checklist', label: 'Completion Checklist' },
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
          {allSessions.map(session => {
            const platform = PLATFORMS.find(p => p.id === session.platform)
            return (
              <EngagementTrain
                key={session.id}
                session={session}
                platform={platform}
                onJoin={handleJoinTrain}
              />
            )
          })}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ScheduleForm platforms={PLATFORMS} onSchedule={handleSchedule} />
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Calendar size={16} /> Your Scheduled Posts
            </h3>
            {scheduled.length === 0 ? (
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 text-center">
                <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No posts scheduled yet.</p>
                <p className="text-gray-600 text-xs mt-1">Schedule your first post to start an engagement train.</p>
              </div>
            ) : (
              scheduled.map(s => {
                const plat = PLATFORMS.find(p => p.id === s.platform)
                const t = new Date(s.scheduledTime)
                return (
                  <div key={s.id} className="bg-dark-800 border border-green-accent/20 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-accent/10 flex items-center justify-center text-xl shrink-0">
                      {plat?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{plat?.name}</p>
                      <p className="text-gray-500 text-xs">
                        {t.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                        {t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-accent text-xs font-medium">{s.credits} cr</p>
                      <p className="text-gray-500 text-xs">≈{Math.floor(s.credits / 10)} users</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="max-w-2xl mx-auto">
          <PostChecklist onComplete={handleChecklistComplete} />
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
