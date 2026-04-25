import { useState } from 'react'
import { Users, TrendingUp, Crown, Handshake, ChevronRight, Plus, Star } from 'lucide-react'
import { TRIBES, USERS, NICHES } from '../data/mockData'

function TribeCard({ tribe }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 card-hover">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${tribe.color}15` }}>
          {tribe.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{tribe.name}</h3>
          <p className="text-gray-500 text-xs">{tribe.members.toLocaleString()} members</p>
        </div>
        <div className="text-right">
          <p className="text-green-accent text-sm font-semibold">+{tribe.weeklyGrowth}%</p>
          <p className="text-gray-500 text-xs">this week</p>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4">{tribe.description}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
          <span className="text-gray-400 text-xs">{tribe.activeNow} active now</span>
        </div>
        <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
          <Star size={12} /> 2x credit bonus
        </span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-2">
          {tribe.topMembers.map((member, i) => (
            <img key={i} src={member.avatar} alt="" className="w-7 h-7 rounded-full border-2 border-dark-800 object-cover" />
          ))}
        </div>
        <span className="text-gray-500 text-xs">Top members</span>
      </div>
      <button className="w-full py-2.5 bg-green-accent/10 text-green-accent font-semibold rounded-xl hover:bg-green-accent/20 transition-colors text-sm">
        Join Tribe
      </button>
    </div>
  )
}

function CollaborationCard({ user1, user2 }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5 card-hover">
      <div className="flex items-center gap-2 mb-3">
        <Handshake size={16} className="text-cyan-400" />
        <span className="text-cyan-400 text-xs font-medium">Collaboration Match</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 text-center">
          <img src={user1.avatar} alt="" className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-dark-500 mb-2" />
          <p className="text-white text-sm font-medium truncate">{user1.displayName}</p>
          <p className="text-gray-500 text-xs">{(user1.followers / 1000).toFixed(1)}K followers</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
            <Handshake size={18} className="text-cyan-400" />
          </div>
          <span className="text-cyan-400 text-xs">92% match</span>
        </div>
        <div className="flex-1 text-center">
          <img src={user2.avatar} alt="" className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-dark-500 mb-2" />
          <p className="text-white text-sm font-medium truncate">{user2.displayName}</p>
          <p className="text-gray-500 text-xs">{(user2.followers / 1000).toFixed(1)}K followers</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 py-2 bg-cyan-400/10 text-cyan-400 font-semibold rounded-xl hover:bg-cyan-400/20 transition-colors text-sm">
          Shout-out
        </button>
        <button className="flex-1 py-2 bg-purple-400/10 text-purple-400 font-semibold rounded-xl hover:bg-purple-400/20 transition-colors text-sm">
          Joint Live
        </button>
      </div>
    </div>
  )
}

export default function Tribes() {
  const [activeTab, setActiveTab] = useState('browse')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={24} className="text-green-accent" /> Niche Tribes
          </h2>
          <p className="text-gray-400 text-sm mt-1">Join micro-communities for relevant, high-value followers</p>
        </div>
      </div>

      <div className="flex gap-2 bg-dark-800 p-1 rounded-xl border border-dark-600 w-fit">
        {[
          { id: 'browse', label: 'Browse Tribes' },
          { id: 'my-tribes', label: 'My Tribes' },
          { id: 'collab', label: 'Collaboration' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-green-accent/10 text-green-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6">
          <div className="bg-dark-800 border border-green-accent/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Star size={20} className="text-amber-400" />
              <h3 className="text-white font-semibold">Why Tribes?</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Mass following is dead — niche following is the future. Follow people in your tribe and earn
              <span className="text-amber-400 font-semibold"> 2x credits</span>. Your followers will be relevant, engaged, and more likely to interact with your content.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRIBES.map(tribe => (
              <TribeCard key={tribe.id} tribe={tribe} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my-tribes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TRIBES.slice(0, 3).map(tribe => (
              <div key={tribe.id} className="bg-dark-800 border border-green-accent/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${tribe.color}15` }}>
                    {tribe.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{tribe.name}</h3>
                      <span className="text-xs text-green-accent bg-green-accent/10 px-2 py-0.5 rounded-full">Joined</span>
                    </div>
                    <p className="text-gray-500 text-xs">{tribe.members.toLocaleString()} members</p>
                  </div>
                  <Crown size={18} className="text-amber-400" />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center bg-dark-700 rounded-lg p-2">
                    <p className="text-green-accent font-bold text-lg">127</p>
                    <p className="text-gray-500 text-xs">Follows Given</p>
                  </div>
                  <div className="text-center bg-dark-700 rounded-lg p-2">
                    <p className="text-cyan-400 font-bold text-lg">98</p>
                    <p className="text-gray-500 text-xs">Follows Received</p>
                  </div>
                  <div className="text-center bg-dark-700 rounded-lg p-2">
                    <p className="text-amber-400 font-bold text-lg">2x</p>
                    <p className="text-gray-500 text-xs">Credit Bonus</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-dark-600 text-gray-300 font-medium rounded-xl hover:bg-dark-500 transition-colors text-sm">
                  View Tribe Members
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'collab' && (
        <div className="space-y-6">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Handshake size={18} className="text-cyan-400" /> Collaboration Matching
            </h3>
            <p className="text-gray-400 text-sm">
              Partnered with users who have similar follower counts and niches. Perfect for shout-outs and joint live streams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              <CollaborationCard key={i} user1={USERS[i * 2]} user2={USERS[i * 2 + 1]} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
