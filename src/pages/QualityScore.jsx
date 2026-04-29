import { useState, useEffect, useCallback } from 'react'
import {
  Sparkles, ShieldCheck, AlertTriangle, CheckCircle, XCircle, User, Image,
  FileText, BarChart3, MessageSquare, RefreshCw, Loader2, Check, ThumbsUp,
  ThumbsDown, Eye,
} from 'lucide-react'
import { useUserStats } from '../hooks/useAppData'
import { useAppContext } from '../context/useAppContext'
import { COMMENT_TEMPLATES } from '../data/mockData'

function ScoreGauge({ score, label, size = 'lg' }) {
  const radius = size === 'lg' ? 60 : 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#1e90ff' : score >= 60 ? '#ffb800' : '#ff4444'

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
    pass: 'text-blue-accent bg-blue-accent/10',
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

const MOCK_REPORT = {
  overallScore: 88,
  summary: 'Your profile demonstrates strong authenticity signals. Engagement rate is slightly below niche average but within acceptable range. No bot-like patterns detected.',
  recommendations: [
    'Increase engagement by replying to 3-5 comments per post to boost your engagement rate from 3.2% toward the 4.1% niche average.',
    'Add 2-3 niche-specific keywords to your bio for better discoverability.',
    'Consider posting during peak hours (9-11 AM, 7-9 PM) for higher reach.',
  ],
  riskFlags: [],
  checks: [
    { icon: Image, label: 'Profile Picture', status: 'pass', detail: 'High-quality, real photo detected — face confidence 97%' },
    { icon: User, label: 'Username Analysis', status: 'pass', detail: 'Non-spammy, memorable, brand-consistent' },
    { icon: FileText, label: 'Bio Quality', status: 'pass', detail: 'Descriptive, includes niche keywords, proper length' },
    { icon: BarChart3, label: 'Post History', status: 'pass', detail: '247 posts, consistent 4-5 posts/week schedule' },
    { icon: MessageSquare, label: 'Engagement Rate', status: 'warning', detail: '3.2% — slightly below niche average of 4.1%' },
    { icon: ShieldCheck, label: 'Follower Quality', status: 'pass', detail: '94% real followers, 6% inactive/bots (acceptable)' },
  ],
}

export default function QualityScore() {
  const USER_STATS = useUserStats()
  const { dispatch, qualityAudit, commentTemplates, notify } = useAppContext()
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    if (commentTemplates.length === 0) {
      dispatch({ type: 'SET_COMMENT_TEMPLATES', templates: COMMENT_TEMPLATES })
    }
  }, [commentTemplates.length, dispatch])

  const runAudit = useCallback(() => {
    dispatch({ type: 'RUN_QUALITY_AUDIT' })
    notify('Running AI audit on your profile...', 'info')
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_QUALITY_AUDIT', report: MOCK_REPORT })
      notify('Audit complete! View your AI report.', 'success')
    }, 3000)
  }, [dispatch, notify])

  const handleTemplateAction = useCallback((templateId, status) => {
    dispatch({ type: 'UPDATE_COMMENT_TEMPLATE', templateId, status })
    notify(
      status === 'accepted' ? 'Comment template accepted and saved.' : 'Comment template rejected.',
      status === 'accepted' ? 'success' : 'warning',
    )
  }, [dispatch, notify])

  const isAuditing = qualityAudit?.running
  const auditReport = qualityAudit?.report

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles size={24} className="text-blue-accent" /> AI Quality Score
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">AI-powered profile auditing to ensure high-quality community members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center">
          <ScoreGauge score={USER_STATS.qualityScore} label="Overall Quality Score" />
          <p className="text-blue-accent text-sm font-medium mt-3">
            {USER_STATS.qualityScore >= 80 ? 'Excellent' : USER_STATS.qualityScore >= 60 ? 'Good' : 'Needs Work'}
          </p>
          <p className="text-gray-400 text-xs text-center mt-1">Your profile meets all quality criteria</p>
          <button
            onClick={runAudit}
            disabled={isAuditing}
            className="mt-4 flex items-center gap-2 bg-blue-accent text-dark-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAuditing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Run Audit
              </>
            )}
          </button>
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

      {auditReport && (
        <div className="bg-dark-800 border border-blue-accent/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-accent" /> AI Audit Report
            </h3>
            <button
              onClick={() => setShowReport(!showReport)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Eye size={14} />
              {showReport ? 'Collapse' : 'View Full Report'}
            </button>
          </div>

          <p className="text-gray-300 text-sm mb-4">{auditReport.summary}</p>

          {showReport && (
            <div className="space-y-4 mt-4">
              <div className="space-y-3">
                <h4 className="text-white text-sm font-medium">Detailed Checks</h4>
                {auditReport.checks.map((check, i) => (
                  <AuditItem key={i} icon={check.icon} label={check.label} status={check.status} detail={check.detail} />
                ))}
              </div>

              <div className="bg-dark-700 rounded-xl p-4">
                <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" /> Recommendations
                </h4>
                <div className="space-y-2">
                  {auditReport.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <Check size={14} className="text-blue-accent shrink-0 mt-0.5" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {auditReport.riskFlags.length > 0 && (
                <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-4">
                  <h4 className="text-red-400 text-sm font-medium mb-2">Risk Flags</h4>
                  {auditReport.riskFlags.map((flag, i) => (
                    <p key={i} className="text-gray-300 text-sm">{flag}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-accent" /> Profile Audit Results
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
            <MessageSquare size={18} className="text-cyan-400" /> AI Comment Templates
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            AI-generated, contextual comments. Accept to save or reject to discard.
          </p>
          <div className="space-y-3">
            {commentTemplates.map(template => (
              <div key={template.id} className={`bg-dark-700 rounded-xl p-3 ${
                template.status === 'accepted' ? 'border border-blue-accent/20' :
                template.status === 'rejected' ? 'border border-red-400/20 opacity-60' :
                ''
              }`}>
                <p className="text-gray-500 text-xs mb-1">{template.postContext}</p>
                <p className="text-gray-200 text-sm italic mb-2">&ldquo;{template.text}&rdquo;</p>
                {template.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTemplateAction(template.id, 'accepted')}
                      className="flex items-center gap-1 text-xs bg-blue-accent/10 text-blue-accent px-2.5 py-1.5 rounded-lg hover:bg-blue-accent/20 transition-colors"
                    >
                      <ThumbsUp size={12} /> Accept
                    </button>
                    <button
                      onClick={() => handleTemplateAction(template.id, 'rejected')}
                      className="flex items-center gap-1 text-xs bg-red-400/10 text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-400/20 transition-colors"
                    >
                      <ThumbsDown size={12} /> Reject
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    template.status === 'accepted' ? 'bg-blue-accent/10 text-blue-accent' : 'bg-red-400/10 text-red-400'
                  }`}>
                    {template.status === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
