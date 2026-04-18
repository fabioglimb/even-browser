const DIRECT_PROXY = `${import.meta.env.VITE_PROXY_URL}/browse`

const KNOWN_TOP_LEVEL_DIRECT_MODE_HOSTS = [
  'youtube.com',
  'youtu.be',
  'news.ycombinator.com',
  'lobste.rs',
  'lite.cnn.com',
] as const

export type DirectModeReason = 'blocked' | 'notHtml' | 'mayFail'

export interface DirectModeCheckResult {
  status: 'allowed' | 'blocked' | 'unknown'
  reason?: DirectModeReason
  finalUrl?: string
}

function hostMatches(hostname: string, target: string): boolean {
  return hostname === target || hostname.endsWith(`.${target}`)
}

function isKnownTopLevelDirectModeHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return KNOWN_TOP_LEVEL_DIRECT_MODE_HOSTS.some((target) => hostMatches(hostname, target))
  } catch {
    return false
  }
}

function getFrameAncestorsDirective(csp: string): string | null {
  if (!csp) return null
  const directives = csp
    .split(';')
    .map((directive) => directive.trim())
    .filter(Boolean)

  const frameAncestors = directives.find((directive) => directive.toLowerCase().startsWith('frame-ancestors'))
  return frameAncestors ?? null
}

function isBlockedByCspFrameAncestors(csp: string): boolean {
  const directive = getFrameAncestorsDirective(csp)
  if (!directive) return false

  const tokens = directive
    .split(/\s+/)
    .slice(1)
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.length === 0) return false
  if (tokens.includes('*') || tokens.includes('http:') || tokens.includes('https:')) return false
  return true
}

function getDirectModeBlockedReason(xFrameOptions: string, csp: string, contentType: string): DirectModeReason | null {
  const normalizedXfo = xFrameOptions.trim().toLowerCase()
  const normalizedType = contentType.trim().toLowerCase()

  if (normalizedXfo.includes('deny') || normalizedXfo.includes('sameorigin')) {
    return 'blocked'
  }

  if (isBlockedByCspFrameAncestors(csp)) {
    return 'blocked'
  }

  if (
    normalizedType &&
    !normalizedType.includes('text/html') &&
    !normalizedType.includes('application/xhtml+xml')
  ) {
    return 'notHtml'
  }

  return null
}

export async function checkDirectModeAvailability(url: string): Promise<DirectModeCheckResult> {
  if (isKnownTopLevelDirectModeHost(url)) {
    return {
      status: 'blocked',
      reason: 'blocked',
      finalUrl: url,
    }
  }

  try {
    const proxyHeaders: Record<string, string> = {}
    if (import.meta.env.VITE_PROXY_KEY) proxyHeaders['X-Proxy-Key'] = import.meta.env.VITE_PROXY_KEY
    const res = await fetch(`${DIRECT_PROXY}?url=${encodeURIComponent(url)}&head=1`, { headers: proxyHeaders })
    const xFrameOptions = res.headers.get('x-upstream-x-frame-options') ?? ''
    const csp = res.headers.get('x-upstream-content-security-policy') ?? ''
    const contentType = res.headers.get('x-upstream-content-type') ?? ''
    const finalUrl = res.headers.get('x-upstream-url') ?? url

    if (isKnownTopLevelDirectModeHost(finalUrl)) {
      return {
        status: 'blocked',
        reason: 'blocked',
        finalUrl,
      }
    }

    const blockedReason = getDirectModeBlockedReason(xFrameOptions, csp, contentType)
    if (blockedReason) {
      return { status: 'blocked', reason: blockedReason, finalUrl }
    }

    if (!res.ok) {
      return {
        status: 'unknown',
        reason: 'mayFail',
        finalUrl,
      }
    }

    return { status: 'allowed', finalUrl }
  } catch {
    return {
      status: 'unknown',
      reason: 'mayFail',
      finalUrl: url,
    }
  }
}
