/**
 * Bridge-backed persistence for bookmarks, history, and settings.
 */

import type { Bookmark, BrowseSettings, FontSize } from '../types'
import { storageGet, storageSet, storageRemove } from './bridge-storage'

const BOOKMARKS_KEY = 'even-browser:bookmarks'
const HISTORY_KEY = 'even-browser:history'
const SETTINGS_KEY = 'even-browser:settings'
const CREDENTIALS_KEY = 'even-browser:credentials'

export const ALL_STORAGE_KEYS = [
  'even-browser:bookmarks',
  'even-browser:history',
  'even-browser:settings',
  'even-browser:credentials',
]

// ── Bookmarks ──

export async function loadBookmarks(): Promise<Bookmark[]> {
  return storageGet<Bookmark[]>(BOOKMARKS_KEY, [])
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  storageSet(BOOKMARKS_KEY, bookmarks)
}

// ── Recent History (URL strings only, for the home screen) ──

export async function loadRecentUrls(): Promise<string[]> {
  return storageGet<string[]>(HISTORY_KEY, [])
}

export function saveRecentUrls(urls: string[]): void {
  storageSet(HISTORY_KEY, urls.slice(0, 50))
}

export async function addRecentUrl(url: string): Promise<void> {
  const urls = (await loadRecentUrls()).filter(u => u !== url)
  urls.unshift(url)
  saveRecentUrls(urls.slice(0, 50))
}

// ── Settings ──

const DEFAULT_SETTINGS: BrowseSettings = {
  linesPerPage: 7,
  showPageNumbers: true,
  readMode: 'scroll',
  language: 'en',
  fontSize: 'medium' as FontSize,
}

// ── Credentials ──

export interface StoredCredentials {
  [domain: string]: { username: string; password: string }
}

export async function loadCredentials(): Promise<StoredCredentials> {
  return storageGet<StoredCredentials>(CREDENTIALS_KEY, {})
}

export function saveCredentials(creds: StoredCredentials): void {
  storageSet(CREDENTIALS_KEY, creds)
}

export async function removeCredentials(domain: string): Promise<void> {
  const creds = await loadCredentials()
  delete creds[domain]
  saveCredentials(creds)
}

export async function loadSettings(): Promise<BrowseSettings> {
  const stored = await storageGet<Partial<BrowseSettings> | null>(SETTINGS_KEY, null)
  if (stored) {
    return { ...DEFAULT_SETTINGS, ...stored }
  }
  return DEFAULT_SETTINGS
}

export function saveSettings(settings: BrowseSettings): void {
  storageSet(SETTINGS_KEY, settings)
}
