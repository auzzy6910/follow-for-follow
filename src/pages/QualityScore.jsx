import { Sparkles, ShieldCheck, AlertTriangle, CheckCircle, XCircle, User, Image, FileText, BarChart3, MessageSquare } from 'lucide-react'
import { useUserStats } from '../hooks/useAppData'

function ScoreGauge({ score, label, size = 'lg' }) {
  const radius = size === 'lg' ? 60 : 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#39ff14' : score >= 60 ? '#ffb800' : '#ff4444'

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={radius * 2 + 20} height={radius * 2 + 20} className="-rotate-90">
          <circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            stroke="#2a2a38"
            strokeWidth={size === 'lg' ? 8 : 5}
            fill="none"
          />
          <circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            stroke={color}
            strokeWidth={size === 'lg' ? 8 : 5}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-white ${size === 'lg' ? 'text-3xl' : 'text-lg'}`}>{score}</span>
        </div>
      </div>
      <p className={`text-gray-400 mt-2 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>{label}</p>
    </div>
  )
}

function AuditItem({ icon: Icon, label, status, detail }) {
  const statusColors = {
    pass: 'text-green-accent bg-green-accent/10',
    warning: 'text-amber-400 bg-amber-400/10',
    fail: 'text-red-400 bg-red-400/10',
  }
  const StatusIcon = status === 'pass' ? CheckCircle : status === 'warning' ? AlertTriangle : XCircle

  return (
    <div className="flex items-center gap-4 bg-dark-700 rounded-xl p-4">
      <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center">
        <Icon size={18} className="text-gray-300" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-gray-500 text-xs">{detail}</p>
      </div>
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[status]}`}>
        <StatusIcon size={14} />
        <span className="capitalize">{status}</span>
      </div>
    </div>
  )
}

export default function QualityScore() {
  const USER_STATS = useUserStats()
  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles size={24} className="text-green-accent" /> AI Quality Score
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">AI-powered profile auditing to ensure high-quality community members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center">
          <ScoreGauge score={USER_STATS.qualityScore} label="Overall Quality Score" />
          <p className="text-green-accent text-sm font-medium mt-3">Excellent</p>
          <p className="text-gray-400 text-xs text-center mt-1">Your profile meets all quality criteria</p>
        </div>

        <div className="lg:col-span-2 bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
          <h3 className="text-white font-semibold mb-4">Score Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <ScoreGauge score={95} label="Profile Photo" size="sm" />
            <ScoreGauge score={82} label="Bio Quality" size="sm" />
            <ScoreGauge score={90} label="Post Activity" size="sm" />
            <ScoreGauge score={85} label="Engagement" size="sm" />
          </div>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-accent" /> Profile Audit Results
        </h3>
        <div className="space-y-3">
          <AuditItem icon={Image} label="Profile Picture" status="pass" detail="High-quality, real photo detected" />
          <AuditItem icon={User} label="Username" status="pass" detail="Unique, professional, non-spammy" />
          <AuditItem icon={FileText} label="Bio" status="pass" detail="Descriptive, includes niche keywords" />
          <AuditItem icon={BarChart3} label="Post History" status="pass" detail="247 posts, consistent posting schedule" />
          <AuditItem icon={MessageSquare} label="Engagement Rate" status="warning" detail="3.2% - slightly below niche average of 4.1%" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Rejection Criteria</h3>
          <p className="text-gray-400 text-sm mb-4">Profiles that don't meet these standards are rejected from the platform:</p>
          <div className="space-y-2">
            {[
              'No profile picture or stock photo',
              'Empty or AI-generated spam bio',
              'Zero posts / completely inactive',
              'Suspicious follower-to-following ratio',
              'Known bot patterns detected',
              'Account age less than 30 days',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                <XCircle size={14} className="text-red-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-cyan-400" /> AI Comment Engine
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            AI-generated, contextual comments based on post content. No more generic "Nice!" or spam emojis.
          </p>
          <div className="space-y-3">
            <div className="bg-dark-700 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">For a fitness post:</p>
              <p className="text-gray-200 text-sm italic">"Love the form breakdown here! The cue about hip hinge really clicks."</p>
            </div>
            <div className="bg-dark-700 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">For a tech post:</p>
              <p className="text-gray-200 text-sm italic">"This approach to microservices architecture is elegant. Have you considered event sourcing?"</p>
            </div>
            <div className="bg-dark-700 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">For a travel post:</p>
              <p className="text-gray-200 text-sm italic">"Kyoto in cherry blossom season is magical. The temple backdrop makes this shot perfect."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
