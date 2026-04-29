// Detects which social platform a profile/post URL belongs to and extracts a
// best-effort username from it. Returns null when no known platform matches.

const PATTERNS = [
  {
    platform: 'instagram',
    name: 'Instagram',
    icon: '📸',
    test: /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)/i,
  },
  {
    platform: 'twitter',
    name: 'X / Twitter',
    icon: '𝕏',
    test: /^(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/(?!i\/|home|search|explore|notifications|messages|compose|settings)([^/?#]+)/i,
  },
  {
    platform: 'tiktok',
    name: 'TikTok',
    icon: '🎬',
    test: /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^/?#]+)/i,
  },
  {
    platform: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    test: /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^/?#]+)/i,
  },
  {
    platform: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    test: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:@|channel\/|c\/|user\/)([^/?#]+)/i,
  },
  {
    platform: 'threads',
    name: 'Threads',
    icon: '🧵',
    test: /^(?:https?:\/\/)?(?:www\.)?threads\.net\/@([^/?#]+)/i,
  },
]

export function detectPlatformFromUrl(rawUrl) {
  if (!rawUrl) return null
  const url = String(rawUrl).trim()
  if (!url) return null

  for (const entry of PATTERNS) {
    const match = url.match(entry.test)
    if (match) {
      const username = match[1].replace(/^@+/, '')
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
      return {
        platform: entry.platform,
        name: entry.name,
        icon: entry.icon,
        username,
        url: normalizedUrl,
      }
    }
  }

  return null
}

export function platformLabel(platformId) {
  const found = PATTERNS.find(p => p.platform === platformId)
  return found ? `${found.icon} ${found.name}` : platformId
}

export const SUPPORTED_PLATFORMS = PATTERNS.map(p => ({
  id: p.platform,
  name: p.name,
  icon: p.icon,
}))
