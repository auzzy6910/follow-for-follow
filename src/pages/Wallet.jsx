import { useState } from 'react'
import {
  Wallet as WalletIcon,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Clock,
  Gift,
  CreditCard,
  BarChart3,
  X,
  DollarSign,
  ArrowRightLeft,
} from 'lucide-react'
import { useAppContext } from '../context/useAppContext'
import { useAuthGuard } from '../context/useAuthGuard'

function TopUpModal({ onClose }) {
  const { dispatch, notify } = useAppContext()
  const [amount, setAmount] = useState('')
  const presets = [500, 1000, 2500, 5000]

  const handleTopUp = () => {
    const value = parseInt(amount, 10)
    if (!value || value <= 0) {
      notify('Enter a valid amount.', 'error')
      return
    }
    dispatch({ type: 'ADD_CREDITS', amount: value, reason: `Top-up via Stripe — ${value} credits` })
    notify(`${value} credits added to your wallet!`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-md z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <CreditCard size={18} className="text-green-accent" />
            Top Up Credits
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
        <p className="text-gray-400 text-sm mb-4">Purchase credits via Stripe. Select a preset or enter a custom amount.</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`py-2 rounded-xl text-sm font-medium transition-colors border ${
                amount === String(p)
                  ? 'bg-green-accent/10 border-green-accent/40 text-green-accent'
                  : 'bg-dark-700 border-dark-500 text-gray-300 hover:border-green-accent/30'
              }`}
            >
              {p} cr
            </button>
          ))}
        </div>
        <input
          type="number"
          min="1"
          placeholder="Custom amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50 mb-4"
        />
        <div className="bg-dark-700 rounded-xl p-3 mb-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Amount</span>
            <span className="text-white">{amount || 0} credits</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price</span>
            <span className="text-white">${((parseInt(amount, 10) || 0) * 0.01).toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handleTopUp}
          disabled={!amount || parseInt(amount, 10) <= 0}
          className="w-full py-2.5 bg-green-accent text-dark-900 font-semibold rounded-xl hover:bg-green-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <DollarSign size={16} /> Pay with Stripe
        </button>
        <p className="text-gray-500 text-xs text-center mt-2">Stripe integration placeholder — credits are added instantly for demo.</p>
      </div>
    </div>
  )
}

function WithdrawModal({ onClose }) {
  const { dispatch, notify, userStats } = useAppContext()
  const [amount, setAmount] = useState('')

  const handleWithdraw = () => {
    const value = parseInt(amount, 10)
    if (!value || value <= 0) {
      notify('Enter a valid amount.', 'error')
      return
    }
    if (value > userStats.totalCredits) {
      notify('Insufficient credits.', 'error')
      return
    }
    dispatch({ type: 'WITHDRAW_CREDITS', amount: value, reason: `Withdrawal — ${value} credits converted` })
    notify(`${value} credits withdrawn. Payout processing.`, 'success')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-md z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-amber-400" />
            Withdraw / Convert
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
        <p className="text-gray-400 text-sm mb-2">Convert credits to cash or transfer out.</p>
        <p className="text-gray-500 text-xs mb-4">Available: <span className="text-green-accent font-medium">{userStats.totalCredits.toLocaleString()} cr</span></p>
        <input
          type="number"
          min="1"
          max={userStats.totalCredits}
          placeholder="Amount to withdraw"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-accent/50 mb-4"
        />
        <div className="bg-dark-700 rounded-xl p-3 mb-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Credits</span>
            <span className="text-white">{amount || 0} cr</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Payout value</span>
            <span className="text-white">${((parseInt(amount, 10) || 0) * 0.008).toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={!amount || parseInt(amount, 10) <= 0}
          className="w-full py-2.5 bg-amber-400/10 text-amber-400 font-semibold rounded-xl border border-amber-400/30 hover:bg-amber-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Withdraw Credits
        </button>
        <p className="text-gray-500 text-xs text-center mt-2">Payout placeholder — credits are deducted instantly for demo.</p>
      </div>
    </div>
  )
}

export default function Wallet() {
  const { creditHistory, userStats } = useAppContext()
  const [filterType, setFilterType] = useState('all')
  const [walletModal, setWalletModal] = useState(null)
  const { requireAuth } = useAuthGuard()

  const balance = userStats.totalCredits
  const filtered = filterType === 'all'
    ? creditHistory
    : creditHistory.filter(tx => tx.type === filterType)

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <WalletIcon size={24} className="text-green-accent" /> Wallet
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage your credits and transactions</p>
      </div>

      <div className="bg-gradient-to-r from-dark-800 to-dark-700 border border-green-accent/20 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Available Balance</p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{balance.toLocaleString()}</p>
            <p className="text-green-accent text-sm font-medium mt-1">credits</p>
          </div>
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-green-accent/10 flex items-center justify-center shrink-0">
            <Coins className="text-green-accent w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-dark-900/50 rounded-xl p-3 text-center">
            <p className="text-green-accent font-bold text-lg">+{creditHistory.filter(t => t.type === 'earned').reduce((s, t) => s + t.amount, 0).toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Total Earned</p>
          </div>
          <div className="bg-dark-900/50 rounded-xl p-3 text-center">
            <p className="text-amber-400 font-bold text-lg">-{creditHistory.filter(t => t.type === 'spent').reduce((s, t) => s + t.amount, 0).toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Total Spent</p>
          </div>
          <div className="bg-dark-900/50 rounded-xl p-3 text-center">
            <p className="text-purple-400 font-bold text-lg">1,150</p>
            <p className="text-gray-500 text-xs">In Escrow</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={() => requireAuth(() => setWalletModal('topup'))}
          className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5 text-left card-hover"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-accent/10 flex items-center justify-center">
              <CreditCard size={20} className="text-green-accent" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Top Up</h3>
              <p className="text-gray-400 text-xs">Buy credits via Stripe</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => requireAuth(() => setWalletModal('withdraw'))}
          className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5 text-left card-hover"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <ArrowRightLeft size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Withdraw / Convert</h3>
              <p className="text-gray-400 text-xs">Cash out your credits</p>
            </div>
          </div>
        </button>
        <button className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-5 text-left card-hover">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
              <ArrowUpRight size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Earn Credits</h3>
              <p className="text-gray-400 text-xs">Follow users, complete quests</p>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <BarChart3 size={18} /> Transaction History
          </h3>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="earned">Earned</option>
            <option value="spent">Spent</option>
            <option value="slashed">Slashed</option>
          </select>
        </div>
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-6">No transactions match this filter.</p>
          )}
          {filtered.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 bg-dark-700 rounded-xl p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tx.type === 'earned' ? 'bg-green-accent/10' : tx.type === 'spent' ? 'bg-amber-400/10' : 'bg-red-400/10'
              }`}>
                {tx.type === 'earned' ? <ArrowUpRight size={18} className="text-green-accent" /> :
                 tx.type === 'spent' ? <ArrowDownRight size={18} className="text-amber-400" /> :
                 <TrendingDown size={18} className="text-red-400" />}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{tx.action}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock size={12} /> {tx.timestamp}
                </p>
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

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Gift size={18} className="text-purple-400" /> Premium Membership
        </h3>
        <p className="text-gray-400 text-sm mb-4">Upgrade for faster growth and priority features.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Free', price: '0', features: ['10 follows/day', 'Standard queue', 'Basic quests'] },
            { name: 'Pro', price: '9.99', features: ['50 follows/day', 'Priority queue', 'All quests + bonuses', 'Collaboration matching'] },
            { name: 'Legend', price: '24.99', features: ['Unlimited follows', 'Top of all lists', 'Custom tribe creation', 'VIP support', '5x faster growth'] },
          ].map((plan, i) => (
            <div key={i} className={`bg-dark-700 border rounded-xl p-5 ${i === 1 ? 'border-green-accent/30' : 'border-dark-500'}`}>
              {i === 1 && <span className="text-xs text-green-accent font-semibold mb-2 block">Most Popular</span>}
              <h4 className="text-white font-bold text-lg">{plan.name}</h4>
              <p className="text-2xl font-bold text-white mt-1">${plan.price}<span className="text-gray-500 text-sm font-normal">/mo</span></p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-gray-400 text-xs flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-green-accent" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                i === 0 ? 'bg-dark-600 text-gray-400' :
                i === 1 ? 'bg-green-accent text-dark-900 hover:bg-green-accent/90' :
                'bg-amber-400/10 text-amber-400 hover:bg-amber-400/20'
              }`}>
                {i === 0 ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {walletModal === 'topup' && <TopUpModal onClose={() => setWalletModal(null)} />}
      {walletModal === 'withdraw' && <WithdrawModal onClose={() => setWalletModal(null)} />}
    </div>
  )
}
