import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { PageData, Bookmark, BrowseSettings, HistoryEntry } from '../types'
import { loadBookmarks, saveBookmarks, loadSettings, saveSettings, addRecentUrl } from '../data/persistence'
import { fetchAndParse } from '../lib/html-parser'
import { extractDomain } from '../lib/url-utils'

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
  }))

  // Abort controller for cancellable fetches
  let abortRef: AbortController | null = null

  useEffect(() => {
    saveBookmarks(state.bookmarks)
  }, [state.bookmarks])

  useEffect(() => {
    saveSettings(state.settings)
  }, [state.settings])

  const navigateToUrl = (url: string) => {
    if (abortRef) abortRef.abort()
    abortRef = new AbortController()

    dispatch({ type: 'NAVIGATE_START', url })
    addRecentUrl(url)

    fetchAndParse(url)
      .then(pageData => {
        dispatch({ type: 'NAVIGATE_SUCCESS', pageData, pushHistory: true })
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          dispatch({ type: 'NAVIGATE_ERROR', error: err.message || 'Failed to load page' })
        }
      })
  }

  const retry = () => {
    const url = state.error ? (state.loadingUrl || state.historyStack[state.historyIndex]?.url) : null
    const retryUrl = url || state.currentPage?.url
    if (!retryUrl) return

    dispatch({ type: 'NAVIGATE_START', url: retryUrl })

    fetchAndParse(retryUrl)
      .then(pageData => {
        dispatch({ type: 'NAVIGATE_SUCCESS', pageData, pushHistory: false })
      })
      .catch(err => {
        dispatch({ type: 'NAVIGATE_ERROR', error: err.message || 'Failed to load page' })
      })
  }

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
    navigateToUrl,
    goBack: () => dispatch({ type: 'GO_BACK' }),
    goForward: () => dispatch({ type: 'GO_FORWARD' }),
    retry,
    cancelLoading: () => {
      if (abortRef) abortRef.abort()
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
  }

  return <BrowseContext.Provider value={value}>{children}</BrowseContext.Provider>
}

export function useBrowseContext() {
  const ctx = useContext(BrowseContext)
  if (!ctx) throw new Error('useBrowseContext must be used within BrowseProvider')
  return ctx
}
