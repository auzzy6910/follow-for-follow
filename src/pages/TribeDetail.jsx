import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Users, Crown, Star, Handshake, MessageSquare,
  Send, UserPlus, UserMinus, Sparkles, ExternalLink
} from 'lucide-react'
import { useTribes, useUsers } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { TRIBE_FEED, TRIBE_CHAT_MESSAGES } from '../data/tribeData'

function MemberRow({ member, onFollow }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-dark-700 rounded-xl hover:bg-dark-600 transition-colors">
      <img src={member.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-dark-500" />
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm font-medium truncate">{member.displayName}</p>
        <p className="text-gray-500 text-xs">@{member.username} · {(member.followers / 1000).toFixed(1)}K</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          member.tier === 'legend' ? 'bg-amber-400/10 text-amber-400' :
          member.tier === 'influencer' ? 'bg-blue-accent/10 text-blue-accent' :
          'bg-dark-500 text-gray-400'
        }`}>{member.tier}</span>
        <button
          onClick={() => onFollow(member)}
          className="text-xs bg-blue-accent/10 text-blue-accent px-3 py-1.5 rounded-lg hover:bg-blue-accent/20 transition-colors flex items-center gap-1"
        >
          <UserPlus size={12} /> Follow
        </button>
      </div>
    </div>
  )
}

function FeedPost({ post }) {
  return (
    <div className="bg-dark-700 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <img src={post.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm font-medium">{post.displayName}</p>
          <p className="text-gray-500 text-xs">{post.time}</p>
        </div>
        {post.pinned && (
          <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full">Pinned</span>
        )}
      </div>
      <p className="text-gray-700 text-sm mb-3">{post.content}</p>
      {post.link && (
        <a href={post.link} target="_blank" rel="noopener noreferrer"
          className="text-cyan-400 text-xs flex items-center gap-1 hover:underline mb-3">
          <ExternalLink size={12} /> {post.link}
        </a>
      )}
      <div className="flex items-center gap-4 text-gray-500 text-xs">
        <span>❤️ {post.likes}</span>
        <span>💬 {post.replies}</span>
      </div>
    </div>
  )
}

function ChatMessage({ msg, isOwn }) {
  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <img src={msg.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-1" />
      )}
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : ''}`}>
        {!isOwn && <p className="text-gray-500 text-xs mb-0.5">{msg.displayName}</p>}
        <div className={`rounded-2xl px-3 py-2 text-sm ${
          isOwn ? 'bg-blue-accent/20 text-blue-accent rounded-br-md' : 'bg-dark-600 text-gray-700 rounded-bl-md'
        }`}>
          {msg.text}
        </div>
        <p className="text-gray-600 text-xs mt-0.5">{msg.time}</p>
      </div>
    </div>
  )
}

function CollabSuggestion({ user1, user2, matchPct }) {
  return (
    <div className="bg-dark-700 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 text-center">
          <img src={user1.avatar} alt="" className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-dark-500 mb-1" />
          <p className="text-gray-900 text-xs font-medium truncate">{user1.displayName}</p>
          <p className="text-gray-500 text-xs">{(user1.followers / 1000).toFixed(1)}K</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <Handshake size={16} className="text-cyan-400" />
          </div>
          <span className="text-cyan-400 text-xs font-semibold">{matchPct}%</span>
        </div>
        <div className="flex-1 text-center">
          <img src={user2.avatar} alt="" className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-dark-500 mb-1" />
          <p className="text-gray-900 text-xs font-medium truncate">{user2.displayName}</p>
          <p className="text-gray-500 text-xs">{(user2.followers / 1000).toFixed(1)}K</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="flex-1 py-1.5 bg-cyan-400/10 text-cyan-400 font-medium rounded-lg hover:bg-cyan-400/20 transition-colors text-xs">
          Shout-out
        </button>
        <button className="flex-1 py-1.5 bg-purple-400/10 text-purple-400 font-medium rounded-lg hover:bg-purple-400/20 transition-colors text-xs">
          Joint Live
        </button>
      </div>
    </div>
  )
}

export default function TribeDetail() {
  const { tribeId } = useParams()
  const TRIBES = useTribes()
  const USERS = useUsers()
  const { followUser, notify } = useAppContext()
  const [activeTab, setActiveTab] = useState('feed')
  const [joined, setJoined] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [localMessages, setLocalMessages] = useState([])
  const chatEndRef = useRef(null)

  const tribe = TRIBES.find(t => t.id === tribeId)
  const nicheId = tribe?.id?.replace('tribe-', '')
  const tribeMembers = USERS.filter(u => u.niche === nicheId)
  const feed = TRIBE_FEED[tribeId] || TRIBE_FEED['default']
  const chatMessages = [...(TRIBE_CHAT_MESSAGES[tribeId] || TRIBE_CHAT_MESSAGES['default']), ...localMessages]

  const collabPairs = useMemo(() => {
    const pairs = []
    for (let i = 0; i < tribeMembers.length - 1; i += 2) {
      pairs.push({
        user1: tribeMembers[i],
        user2: tribeMembers[i + 1],
        matchPct: 80 + ((i * 7 + 3) % 20),
      })
    }
    return pairs
  }, [tribeMembers])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages.length])

  if (!tribe) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-400">Tribe not found.</p>
        <Link to="/tribes" className="text-blue-accent text-sm mt-2 inline-block hover:underline">← Back to Tribes</Link>
      </div>
    )
  }

  const handleJoin = () => {
    setJoined(!joined)
    notify(joined ? `Left ${tribe.name}` : `Joined ${tribe.name}! Earn 2× credits for in-niche follows.`, joined ? 'warning' : 'success')
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    setLocalMessages(prev => [...prev, {
      id: `local-${Date.now()}`,
      displayName: 'You',
      avatar: '',
      text: chatInput.trim(),
      time: 'Just now',
      isOwn: true,
    }])
    setChatInput('')
  }

  const handleFollow = (user) => {
    followUser(user, USERS)
  }

  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'members', label: `Members (${tribeMembers.length})` },
    { id: 'chat', label: 'Chat' },
    { id: 'collab', label: 'Matchmaking' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <Link to="/tribes" className="text-gray-400 text-sm flex items-center gap-1 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Back to Tribes
      </Link>

      {/* Tribe header */}
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ backgroundColor: `${tribe.color}15` }}>
            {tribe.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{tribe.name}</h2>
              {joined && <span className="text-xs bg-blue-accent/10 text-blue-accent px-2 py-0.5 rounded-full">Joined</span>}
            </div>
            <p className="text-gray-400 text-sm mt-1">{tribe.description}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Users size={14} /> {tribe.members.toLocaleString()} members
              </span>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-accent animate-pulse" />
                {tribe.activeNow} active now
              </span>
              <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
                <Star size={12} /> 2× credit bonus
              </span>
              <span className="text-blue-accent text-xs flex items-center gap-1">
                <Sparkles size={12} /> +{tribe.weeklyGrowth}% this week
              </span>
            </div>
          </div>
          <button
            onClick={handleJoin}
            className={`px-5 py-2.5 font-semibold rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
              joined
                ? 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                : 'bg-blue-accent text-white hover:bg-blue-accent/90'
            }`}
          >
            {joined ? <><UserMinus size={16} /> Leave</> : <><UserPlus size={16} /> Join Tribe</>}
          </button>
        </div>

        {/* Top members row */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-600">
          <Crown size={14} className="text-amber-400" />
          <span className="text-gray-500 text-xs">Top members:</span>
          <div className="flex -space-x-2">
            {tribe.topMembers.map((m, i) => (
              <img key={i} src={m.avatar} alt="" className="w-7 h-7 rounded-full border-2 border-dark-800 object-cover" />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-dark-800 p-1 rounded-xl border border-dark-600 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'bg-blue-accent/10 text-blue-accent' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed tab */}
      {activeTab === 'feed' && (
        <div className="space-y-3">
          {feed.map(post => <FeedPost key={post.id} post={post} />)}
        </div>
      )}

      {/* Members tab */}
      {activeTab === 'members' && (
        <div className="space-y-2">
          {tribeMembers.map(member => (
            <MemberRow key={member.id} member={member} onFollow={handleFollow} />
          ))}
          {tribeMembers.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No members in this tribe yet.</p>
          )}
        </div>
      )}

      {/* Chat tab */}
      {activeTab === 'chat' && (
        <div className="bg-dark-800 border border-dark-600 rounded-2xl flex flex-col" style={{ height: '460px' }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-600">
            <MessageSquare size={16} className="text-blue-accent" />
            <span className="text-gray-900 text-sm font-medium">{tribe.name} Chat</span>
            <span className="text-gray-500 text-xs ml-auto">{tribe.activeNow} online</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} isOwn={msg.isOwn} />
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-dark-600 p-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Type a message..."
              className="flex-1 bg-dark-700 border border-dark-500 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-accent/50"
            />
            <button
              onClick={handleSendChat}
              className="bg-blue-accent text-white p-2.5 rounded-xl hover:bg-blue-accent/90 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Collab matchmaking tab */}
      {activeTab === 'collab' && (
        <div className="space-y-4">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4">
            <h3 className="text-gray-900 text-sm font-semibold mb-1 flex items-center gap-2">
              <Handshake size={16} className="text-cyan-400" /> Collaboration Matchmaking
            </h3>
            <p className="text-gray-400 text-xs">
              We match tribe members with similar follower counts and engagement rates for shout-outs and joint live streams.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collabPairs.slice(0, 6).map((pair, i) => (
              <CollabSuggestion key={i} user1={pair.user1} user2={pair.user2} matchPct={pair.matchPct} />
            ))}
          </div>
          {collabPairs.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">Not enough members for matchmaking yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
