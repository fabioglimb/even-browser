import { useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useGlasses } from 'even-toolkit/useGlasses'
import { useFlashPhase } from 'even-toolkit/useFlashPhase'
import { useBrowseContext } from '../contexts/BrowseContext'
import { browseSplash } from './splash'
import { toDisplayData, type BrowseSnapshot } from './selectors'
import { createActionHandler } from './actions'

function deriveScreen(path: string): string {
  if (path === '/browse') return 'page-view'
  return 'waiting'
}

// Only use the first tile (globe logo) for home — the "Loading..." tile is splash-only
const allTiles = browseSplash.getTiles()
const homeTiles = allTiles.length > 0 ? [allTiles[0]!] : []

export function BrowseGlasses() {
  const {
    currentPage,
    loading,
    error,
    loadingUrl,
    canGoBack,
    settings,
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
  }
  snapshotRef.current = snapshot

  const getSnapshot = useCallback(() => snapshotRef.current!, [snapshotRef])

  const onGlassAction = useMemo(
    () => createActionHandler(navigate, {
      navigateToUrl,
      goBack,
      retry,
      cancelLoading,
    }),
    [navigate, navigateToUrl, goBack, retry, cancelLoading],
  )

  useGlasses({
    getSnapshot,
    toDisplayData,
    onGlassAction,
    deriveScreen,
    appName: 'EVENBROWSER',
    splash: browseSplash,
    getPageMode: (screen) => screen === 'waiting' ? 'home' : 'text',
    homeImageTiles: homeTiles,
  })

  return null
}
