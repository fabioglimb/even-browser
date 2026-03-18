/**
 * localStorage persistence for bookmarks, history, and settings.
 */

import type { Bookmark, BrowseSettings } from '../types'

const BOOKMARKS_KEY = 'even-browser:bookmarks'
const HISTORY_KEY = 'even-browser:history'
const SETTINGS_KEY = 'even-browser:settings'

// ── Bookmarks ──

export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

// ── Recent History (URL strings only, for the home screen) ──

export function loadRecentUrls(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecentUrls(urls: string[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(urls.slice(0, 50)))
}

export function addRecentUrl(url: string): void {
  const urls = loadRecentUrls().filter(u => u !== url)
  urls.unshift(url)
  saveRecentUrls(urls.slice(0, 50))
}

// ── Settings ──

const DEFAULT_SETTINGS: BrowseSettings = {
  linesPerPage: 7,
  showPageNumbers: true,
  readMode: 'scroll',
}

export function loadSettings(): BrowseSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: BrowseSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
