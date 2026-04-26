import { useState } from 'react'
import { Coins, ArrowUpRight, ArrowDownRight, Clock, Shield, AlertTriangle, CheckCircle, XCircle, Lock } from 'lucide-react'
import {
  useCreditHistory,
  useEscrowTransactions,
  useUserStats,
} from '../hooks/useAppData'

function CreditStatCard({ icon: Icon, label, value, sublabel, color }) {
  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-gray-500 text-xs">{label}</p>
        </div>
      </div>
      {sublabel && <p className="text-gray-400 text-xs">{sublabel}</p>}
    </div>
  )
}

export default function Credits() {
  const [activeTab, setActiveTab] = useState('overview')
  const CREDIT_HISTORY = useCreditHistory()
  const ESCROW_TRANSACTIONS = useEscrowTransactions()
  const USER_STATS = useUserStats()

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History' },
    { id: 'escrow', label: 'Escrow' },
    { id: 'earn', label: 'Earn Credits' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Credit & Exchange System</h2>
        <p className="text-gray-400 text-sm mt-1">Earn credits by following, spend to get followers</p>
      </div>

      <div className="flex gap-2 bg-dark-800 p-1 rounded-xl border border-dark-600 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-green-accent/10 text-green-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CreditStatCard icon={Coins} label="Available Credits" value={USER_STATS.totalCredits.toLocaleString()} sublabel="Ready to spend" color="bg-green-accent/10 text-green-accent" />
            <CreditStatCard icon={ArrowUpRight} label="Total Earned" value="8,420" sublabel="Lifetime earnings" color="bg-cyan-400/10 text-cyan-400" />
            <CreditStatCard icon={ArrowDownRight} label="Total Spent" value="5,970" sublabel="On listing your profile" color="bg-amber-400/10 text-amber-400" />
            <CreditStatCard icon={Lock} label="In Escrow" value="1,150" sublabel="Held for 30-day verification" color="bg-purple-400/10 text-purple-400" />
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">How Credits Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-green-accent/10 flex items-center justify-center">
                  <ArrowUpRight size={24} className="text-green-accent" />
                </div>
                <h4 className="text-white font-medium">Earn by Following</h4>
                <p className="text-gray-400 text-sm">Follow other users to earn credits. Higher quality accounts earn more. Tribe matches give 2x bonus.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
                  <Coins size={24} className="text-amber-400" />
                </div>
                <h4 className="text-white font-medium">Spend to Get Followers</h4>
                <p className="text-gray-400 text-sm">List your profile and spend credits to appear in others' feed. The more you spend, the more visibility you get.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center">
                  <Shield size={24} className="text-purple-400" />
                </div>
                <h4 className="text-white font-medium">Escrow Protection</h4>
                <p className="text-gray-400 text-sm">Credits are held for 30 days. If someone unfollows, their credits are slashed and returned to you.</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-2">Verification Engine</h3>
            <p className="text-gray-400 text-sm mb-4">Each follow is verified before credits are awarded.</p>
            <div className="space-y-3">
              {['API-based automatic follow verification', 'Manual "Check" button for instant verification', '30-day escrow period for unfollows', 'Automated periodic re-checks'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-dark-700 rounded-xl p-3">
                  <CheckCircle size={16} className="text-green-accent shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Credit History</h3>
          <div className="space-y-3">
            {CREDIT_HISTORY.map(tx => (
              <div key={tx.id} className="flex items-center gap-4 bg-dark-700 rounded-xl p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'earned' ? 'bg-green-accent/10' : tx.type === 'spent' ? 'bg-amber-400/10' : 'bg-red-400/10'
                }`}>
                  {tx.type === 'earned' ? <ArrowUpRight size={18} className="text-green-accent" /> :
                   tx.type === 'spent' ? <ArrowDownRight size={18} className="text-amber-400" /> :
                   <AlertTriangle size={18} className="text-red-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{tx.action}</p>
                  <p className="text-gray-500 text-xs">{tx.timestamp}</p>
                </div>
                <span className={`text-sm font-bold ${
                  tx.type === 'earned' ? 'text-green-accent' : tx.type === 'spent' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {tx.type === 'earned' ? '+' : '-'}{tx.amount} cr
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'escrow' && (
        <div className="space-y-4">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-purple-400" />
              <h3 className="text-white font-semibold">Escrow Transactions</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Credits are held for 30 days. If someone unfollows you, their credits are slashed and returned.</p>
            <div className="space-y-3">
              {ESCROW_TRANSACTIONS.map(tx => (
                <div key={tx.id} className="flex items-center gap-4 bg-dark-700 rounded-xl p-4">
                  <img src={tx.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{tx.user.displayName}</p>
                    <p className="text-gray-500 text-xs">Followed on {tx.followDate}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      tx.status === 'held' ? 'text-amber-400' : tx.status === 'released' ? 'text-green-accent' : 'text-red-400'
                    }`}>
                      {tx.credits} cr
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {tx.status === 'held' && <Clock size={12} className="text-amber-400" />}
                      {tx.status === 'released' && <CheckCircle size={12} className="text-green-accent" />}
                      {tx.status === 'slashed' && <XCircle size={12} className="text-red-400" />}
                      <span className={`text-xs capitalize ${
                        tx.status === 'held' ? 'text-amber-400' : tx.status === 'released' ? 'text-green-accent' : 'text-red-400'
                      }`}>
                        {tx.status}{tx.daysRemaining > 0 ? ` (${tx.daysRemaining}d left)` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'earn' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 card-hover">
            <h3 className="text-white font-semibold mb-2">Follow Users</h3>
            <p className="text-gray-400 text-sm mb-4">Earn 25-50 credits per verified follow. Niche matches earn 2x.</p>
            <button className="w-full py-2.5 bg-green-accent text-dark-900 font-semibold rounded-xl hover:bg-green-accent/90 transition-colors">
              Browse Users to Follow
            </button>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 card-hover">
            <h3 className="text-white font-semibold mb-2">Complete Quests</h3>
            <p className="text-gray-400 text-sm mb-4">Daily & weekly quests reward 30-200 credits each.</p>
            <button className="w-full py-2.5 bg-amber-400/10 text-amber-400 font-semibold rounded-xl border border-amber-400/30 hover:bg-amber-400/20 transition-colors">
              View Active Quests
            </button>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 card-hover">
            <h3 className="text-white font-semibold mb-2">Golden Hour Engagement</h3>
            <p className="text-gray-400 text-sm mb-4">Participate in scheduled engagement trains. Earn credits for dwell time.</p>
            <button className="w-full py-2.5 bg-cyan-400/10 text-cyan-400 font-semibold rounded-xl border border-cyan-400/30 hover:bg-cyan-400/20 transition-colors">
              Join a Session
            </button>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 card-hover">
            <h3 className="text-white font-semibold mb-2">Maintain Streaks</h3>
            <p className="text-gray-400 text-sm mb-4">7-day streak: +200 cr, 30-day streak: +1000 cr bonuses.</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-dark-500 rounded-full h-2">
                <div className="progress-bar h-2" style={{ width: `${(USER_STATS.streak / 30) * 100}%` }} />
              </div>
              <span className="text-green-accent text-sm font-medium">{USER_STATS.streak}/30</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
