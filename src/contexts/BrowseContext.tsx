import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { PageData, Bookmark, BrowseSettings, HistoryEntry, FontSize } from '../types'
import {
  loadBookmarks, saveBookmarks, loadSettings, saveSettings, addRecentUrl,
  loadCredentials, saveCredentials, removeCredentials as removeStoredCredentials,
  type StoredCredentials,
} from '../data/persistence'
import { fetchAndParse } from '../lib/html-parser'
import { extractDomain } from '../lib/url-utils'

// ── Font size to chars per line mapping ──

const FONT_SIZE_CHARS: Record<FontSize, number> = {
  small: 56,
  medium: 46,
  large: 36,
}

// ── State ──

interface BrowseState {
  currentPage: PageData | null
  loading: boolean
  error: string | null
  loadingUrl: string | null
  historyStack: HistoryEntry[]
  historyIndex: number
  bookmarks: Bookmark[]
  settings: BrowseSettings
  credentials: StoredCredentials
  cookieJar: Record<string, string>
  authRequired: { url: string; domain: string } | null
}

// ── Actions ──

type BrowseAction =
  | { type: 'NAVIGATE_START'; url: string }
  | { type: 'NAVIGATE_SUCCESS'; pageData: PageData; pushHistory: boolean }
  | { type: 'NAVIGATE_ERROR'; error: string }
  | { type: 'GO_BACK' }
  | { type: 'GO_FORWARD' }
  | { type: 'CANCEL_LOADING' }
  | { type: 'ADD_BOOKMARK'; bookmark: Bookmark }
  | { type: 'REMOVE_BOOKMARK'; url: string }
  | { type: 'SET_SETTINGS'; settings: BrowseSettings }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SAVE_SCROLL_OFFSET'; offset: number }
  | { type: 'AUTH_REQUIRED'; url: string; domain: string }
  | { type: 'AUTH_DISMISS' }
  | { type: 'SET_CREDENTIALS'; domain: string; username: string; password: string }
  | { type: 'REMOVE_CREDENTIALS'; domain: string }
  | { type: 'SET_COOKIES'; domain: string; cookies: string }

// ── Context value ──

interface BrowseContextValue {
  currentPage: PageData | null
  loading: boolean
  error: string | null
  loadingUrl: string | null
  historyStack: HistoryEntry[]
  historyIndex: number
  bookmarks: Bookmark[]
  settings: BrowseSettings
  canGoBack: boolean
  canGoForward: boolean
  authRequired: { url: string; domain: string } | null
  credentials: StoredCredentials
  navigateToUrl: (url: string) => void
  goBack: () => void
  goForward: () => void
  retry: () => void
  cancelLoading: () => void
  addBookmark: (url: string, title: string) => void
  removeBookmark: (url: string) => void
  isBookmarked: (url: string) => boolean
  setSettings: (settings: BrowseSettings) => void
  clearHistory: () => void
  saveScrollOffset: (offset: number) => void
  submitAuth: (username: string, password: string, remember: boolean) => void
  dismissAuth: () => void
  removeCredentials: (domain: string) => void
}

const BrowseContext = createContext<BrowseContextValue | null>(null)

const MAX_HISTORY = 20

// ── Reducer ──

function browseReducer(state: BrowseState, action: BrowseAction): BrowseState {
  switch (action.type) {
    case 'NAVIGATE_START':
      return { ...state, loading: true, error: null, loadingUrl: action.url }

    case 'NAVIGATE_SUCCESS': {
      if (!action.pushHistory) {
        // Replace current entry (e.g. retry)
        const stack = [...state.historyStack]
        if (stack.length > 0) {
          stack[state.historyIndex] = {
            url: action.pageData.url,
            pageData: action.pageData,
            scrollOffset: 0,
          }
        }
        return {
          ...state,
          currentPage: action.pageData,
          loading: false,
          error: null,
          loadingUrl: null,
          authRequired: null,
          historyStack: stack.length > 0 ? stack : [{
            url: action.pageData.url,
            pageData: action.pageData,
            scrollOffset: 0,
          }],
          historyIndex: stack.length > 0 ? state.historyIndex : 0,
        }
      }

      // Push new entry, truncate forward history
      const truncated = state.historyStack.slice(0, state.historyIndex + 1)
      const newEntry: HistoryEntry = {
        url: action.pageData.url,
        pageData: action.pageData,
        scrollOffset: 0,
      }
      const newStack = [...truncated, newEntry].slice(-MAX_HISTORY)
      return {
        ...state,
        currentPage: action.pageData,
        loading: false,
        error: null,
        loadingUrl: null,
        authRequired: null,
        historyStack: newStack,
        historyIndex: newStack.length - 1,
      }
    }

    case 'NAVIGATE_ERROR':
      return { ...state, loading: false, error: action.error, loadingUrl: null }

    case 'GO_BACK': {
      if (state.historyIndex <= 0) {
        return { ...state, currentPage: null, historyIndex: -1 }
      }
      const prevIdx = state.historyIndex - 1
      const prev = state.historyStack[prevIdx]
      return {
        ...state,
        currentPage: prev.pageData,
        historyIndex: prevIdx,
        error: null,
      }
    }

    case 'GO_FORWARD': {
      if (state.historyIndex >= state.historyStack.length - 1) return state
      const nextIdx = state.historyIndex + 1
      const next = state.historyStack[nextIdx]
      return {
        ...state,
        currentPage: next.pageData,
        historyIndex: nextIdx,
        error: null,
      }
    }

    case 'CANCEL_LOADING':
      return { ...state, loading: false, loadingUrl: null }

    case 'ADD_BOOKMARK':
      return { ...state, bookmarks: [action.bookmark, ...state.bookmarks] }

    case 'REMOVE_BOOKMARK':
      return { ...state, bookmarks: state.bookmarks.filter(b => b.url !== action.url) }

    case 'SET_SETTINGS':
      return { ...state, settings: action.settings }

    case 'CLEAR_HISTORY':
      return { ...state, historyStack: [], historyIndex: -1 }

    case 'SAVE_SCROLL_OFFSET': {
      if (state.historyIndex < 0 || state.historyIndex >= state.historyStack.length) return state
      const stack = [...state.historyStack]
      stack[state.historyIndex] = { ...stack[state.historyIndex], scrollOffset: action.offset }
      return { ...state, historyStack: stack }
    }

    case 'AUTH_REQUIRED':
      return { ...state, loading: false, loadingUrl: null, authRequired: { url: action.url, domain: action.domain } }

    case 'AUTH_DISMISS':
      return { ...state, authRequired: null }

    case 'SET_CREDENTIALS': {
      const credentials = { ...state.credentials, [action.domain]: { username: action.username, password: action.password } }
      return { ...state, credentials, authRequired: null }
    }

    case 'REMOVE_CREDENTIALS': {
      const credentials = { ...state.credentials }
      delete credentials[action.domain]
      return { ...state, credentials }
    }

    case 'SET_COOKIES': {
      const cookieJar = { ...state.cookieJar, [action.domain]: action.cookies }
      return { ...state, cookieJar }
    }

    default:
      return state
  }
}

// ── Provider ──

export function BrowseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(browseReducer, null, () => ({
    currentPage: null,
    loading: false,
    error: null,
    loadingUrl: null,
    historyStack: [],
    historyIndex: -1,
    bookmarks: loadBookmarks(),
    settings: loadSettings(),
    credentials: loadCredentials(),
    cookieJar: {} as Record<string, string>,
    authRequired: null,
  }))

  // Abort controller for cancellable fetches
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    saveBookmarks(state.bookmarks)
  }, [state.bookmarks])

  useEffect(() => {
    saveSettings(state.settings)
  }, [state.settings])

  useEffect(() => {
    saveCredentials(state.credentials)
  }, [state.credentials])

  const getCharsPerLine = useCallback(() => {
    return FONT_SIZE_CHARS[state.settings.fontSize] ?? 46
  }, [state.settings.fontSize])

  const buildAuthHeader = useCallback((domain: string): string | undefined => {
    const creds = state.credentials[domain]
    if (!creds) return undefined
    return `Basic ${btoa(`${creds.username}:${creds.password}`)}`
  }, [state.credentials])

  const getCookies = useCallback((domain: string): string | undefined => {
    return state.cookieJar[domain]
  }, [state.cookieJar])

  const doFetch = useCallback((url: string, pushHistory: boolean) => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    dispatch({ type: 'NAVIGATE_START', url })
    addRecentUrl(url)

    const domain = extractDomain(url)
    const authorization = buildAuthHeader(domain)
    const cookies = getCookies(domain)
    const charsPerLine = getCharsPerLine()

    fetchAndParse(url, charsPerLine, { authorization, cookies })
      .then(({ pageData, setCookies }) => {
        // Store cookies from response
        if (setCookies.length > 0) {
          const cookieValues = setCookies.map(c => c.split(';')[0]).join('; ')
          const existingCookies = getCookies(domain)
          const merged = existingCookies ? `${existingCookies}; ${cookieValues}` : cookieValues
          dispatch({ type: 'SET_COOKIES', domain, cookies: merged })
        }
        dispatch({ type: 'NAVIGATE_SUCCESS', pageData, pushHistory })
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        if (err.status === 401 || err.status === 403) {
          dispatch({ type: 'AUTH_REQUIRED', url, domain })
          return
        }
        dispatch({ type: 'NAVIGATE_ERROR', error: err.message || 'Failed to load page' })
      })
  }, [buildAuthHeader, getCookies, getCharsPerLine])

  const navigateToUrl = useCallback((url: string) => {
    doFetch(url, true)
  }, [doFetch])

  const retry = useCallback(() => {
    const url = state.error ? (state.loadingUrl || state.historyStack[state.historyIndex]?.url) : null
    const retryUrl = url || state.currentPage?.url
    if (!retryUrl) return
    doFetch(retryUrl, false)
  }, [state.error, state.loadingUrl, state.historyStack, state.historyIndex, state.currentPage, doFetch])

  const submitAuth = useCallback((username: string, password: string, remember: boolean) => {
    if (!state.authRequired) return
    const { url, domain } = state.authRequired

    if (remember) {
      dispatch({ type: 'SET_CREDENTIALS', domain, username, password })
    } else {
      dispatch({ type: 'AUTH_DISMISS' })
    }

    // Retry with the new credentials
    dispatch({ type: 'NAVIGATE_START', url })
    addRecentUrl(url)

    const authorization = `Basic ${btoa(`${username}:${password}`)}`
    const cookies = getCookies(domain)
    const charsPerLine = getCharsPerLine()

    fetchAndParse(url, charsPerLine, { authorization, cookies })
      .then(({ pageData, setCookies }) => {
        if (setCookies.length > 0) {
          const cookieValues = setCookies.map(c => c.split(';')[0]).join('; ')
          dispatch({ type: 'SET_COOKIES', domain, cookies: cookieValues })
        }
        dispatch({ type: 'NAVIGATE_SUCCESS', pageData, pushHistory: true })
      })
      .catch(err => {
        if (err.status === 401 || err.status === 403) {
          dispatch({ type: 'AUTH_REQUIRED', url, domain })
          return
        }
        dispatch({ type: 'NAVIGATE_ERROR', error: err.message || 'Failed to load page' })
      })
  }, [state.authRequired, getCookies, getCharsPerLine])

  const value: BrowseContextValue = {
    currentPage: state.currentPage,
    loading: state.loading,
    error: state.error,
    loadingUrl: state.loadingUrl,
    historyStack: state.historyStack,
    historyIndex: state.historyIndex,
    bookmarks: state.bookmarks,
    settings: state.settings,
    canGoBack: state.historyIndex > 0 || (state.historyIndex === 0 && state.historyStack.length > 0),
    canGoForward: state.historyIndex < state.historyStack.length - 1,
    authRequired: state.authRequired,
    credentials: state.credentials,
    navigateToUrl,
    goBack: () => dispatch({ type: 'GO_BACK' }),
    goForward: () => dispatch({ type: 'GO_FORWARD' }),
    retry,
    cancelLoading: () => {
      if (abortRef.current) abortRef.current.abort()
      dispatch({ type: 'CANCEL_LOADING' })
    },
    addBookmark: (url, title) => {
      dispatch({
        type: 'ADD_BOOKMARK',
        bookmark: { url, title, domain: extractDomain(url), addedAt: Date.now() },
      })
    },
    removeBookmark: (url) => dispatch({ type: 'REMOVE_BOOKMARK', url }),
    isBookmarked: (url) => state.bookmarks.some(b => b.url === url),
    setSettings: (settings) => dispatch({ type: 'SET_SETTINGS', settings }),
    clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
    saveScrollOffset: (offset) => dispatch({ type: 'SAVE_SCROLL_OFFSET', offset }),
    submitAuth,
    dismissAuth: () => dispatch({ type: 'AUTH_DISMISS' }),
    removeCredentials: (domain) => {
      removeStoredCredentials(domain)
      dispatch({ type: 'REMOVE_CREDENTIALS', domain })
    },
  }

  return <BrowseContext.Provider value={value}>{children}</BrowseContext.Provider>
}

export function useBrowseContext() {
  const ctx = useContext(BrowseContext)
  if (!ctx) throw new Error('useBrowseContext must be used within BrowseProvider')
  return ctx
}
