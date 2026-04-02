import { useCallback, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGlasses } from 'even-toolkit/useGlasses'
import { useFlashPhase } from 'even-toolkit/useFlashPhase'
import { createScreenMapper, getHomeTiles } from 'even-toolkit/glass-router'
import { useBrowseContext } from '../contexts/BrowseContext'
import { browseSplash } from './splash'
import { toDisplayData, onGlassAction, type BrowseSnapshot } from './selectors'
import type { BrowseActions } from './shared'

const deriveScreen = createScreenMapper([
  { pattern: '/browse', screen: 'page-view' },
], 'waiting')

const homeTiles = getHomeTiles(browseSplash)

export function BrowseGlasses() {
  const {
    currentPage,
    loading,
    error,
    loadingUrl,
    canGoBack,
    settings,
    bookmarks,
    navigateToUrl,
    goBack,
    retry,
    cancelLoading,
  } = useBrowseContext()

  const navigate = useNavigate()
  const location = useLocation()
  const isPageView = deriveScreen(location.pathname) === 'page-view'
  const flashPhase = useFlashPhase(isPageView)

  const snapshotRef = useMemo(() => ({
    current: null as BrowseSnapshot | null,
  }), [])

  const snapshot: BrowseSnapshot = {
    currentPage,
    loading,
    error,
    loadingUrl,
    canGoBack,
    flashPhase,
    readMode: settings.readMode,
    linesPerPage: settings.linesPerPage,
    showPageNumbers: settings.showPageNumbers,
    language: settings.language,
    bookmarks: bookmarks.map(b => ({ title: b.title, url: b.url })),
  }
  snapshotRef.current = snapshot

  const getSnapshot = useCallback(() => snapshotRef.current!, [snapshotRef])

  // Build context with side effects for screen action handlers
  const ctxRef = useRef<BrowseActions>({
    navigate,
    navigateToUrl,
    goBack,
    retry,
    cancelLoading,
  })
  ctxRef.current = { navigate, navigateToUrl, goBack, retry, cancelLoading }

  // Wrap the router's onGlassAction to inject context
  const handleGlassAction = useCallback(
    (action: Parameters<typeof onGlassAction>[0], nav: Parameters<typeof onGlassAction>[1], snap: BrowseSnapshot) =>
      onGlassAction(action, nav, snap, ctxRef.current),
    [],
  )

  useGlasses({
    getSnapshot,
    toDisplayData,
    onGlassAction: handleGlassAction,
    deriveScreen,
    appName: 'ER BROWSER',
    splash: browseSplash,
    getPageMode: (screen) => screen === 'waiting' ? 'home' : 'text',
    homeImageTiles: homeTiles,
  })

  return null
}
