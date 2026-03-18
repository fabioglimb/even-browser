/**
 * URL utilities for Even Browser.
 */

/** Resolve a potentially relative URL against a base URL */
export function resolveUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).href
  } catch {
    return href
  }
}

/** Extract the domain from a URL (e.g. "en.wikipedia.org") */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/** Normalize a URL: ensure https:// prefix, trim whitespace */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  // If it looks like a domain (has a dot), add https://
  if (trimmed.includes('.')) {
    return `https://${trimmed}`
  }
  return trimmed
}

/** Truncate a URL for display (remove protocol, trim trailing slash) */
export function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
}
