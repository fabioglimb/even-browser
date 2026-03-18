import type { GlassAction, GlassNavState } from 'even-toolkit/types'
import type { BrowseSnapshot } from './selectors'
import {
  browseMode,
  buttonIndex,
  readOffset,
  linkIndex,
  getPageButtons,
  getErrorButtons,
  pageContentLineCount,
  pageLinkCount,
  totalPageCount,
  MODE_READ,
  MODE_LINKS,
} from './selectors'
import { t } from '../utils/i18n'

type Navigate = (path: string) => void

interface BrowseActions {
  navigateToUrl: (url: string) => void
  goBack: () => void
  retry: () => void
  cancelLoading: () => void
}

export function createActionHandler(navigate: Navigate, actions: BrowseActions) {
  return function onGlassAction(
    action: GlassAction,
    nav: GlassNavState,
    snapshot: BrowseSnapshot,
  ): GlassNavState {
    switch (nav.screen) {
      // ── Waiting ──
      case 'waiting':
        return nav

      // ── Page View (includes loading/error sub-states) ──
      case 'page-view': {
        // Sub-state: loading
        if (snapshot.loading) {
          if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
            actions.cancelLoading()
            if (snapshot.canGoBack) {
              actions.goBack()
            } else {
              navigate('/')
            }
          }
          return nav
        }

        // Sub-state: error
        if (snapshot.error) {
          return handleError(action, nav, snapshot, navigate, actions)
        }

        // Normal page view
        if (!snapshot.currentPage) return nav

        const mode = browseMode(nav.highlightedIndex)
        const lang = snapshot.language
        const buttons = getPageButtons(lang, snapshot.canGoBack)

        // ── Button select mode ──
        if (mode === 'buttons') {
          if (action.type === 'HIGHLIGHT_MOVE') {
            const btnIdx = buttonIndex(nav.highlightedIndex, buttons.length)
            const delta = action.direction === 'up' ? -1 : 1
            const next = Math.max(0, Math.min(buttons.length - 1, btnIdx + delta))
            return { ...nav, highlightedIndex: next }
          }
          if (action.type === 'SELECT_HIGHLIGHTED') {
            const btnIdx = buttonIndex(nav.highlightedIndex, buttons.length)
            const selected = buttons[btnIdx]
            if (selected === t('glass.read', lang)) {
              return { ...nav, highlightedIndex: MODE_READ }
            }
            if (selected === t('glass.links', lang)) {
              return { ...nav, highlightedIndex: MODE_LINKS }
            }
            if (selected === t('glass.back', lang)) {
              actions.goBack()
              return { ...nav, highlightedIndex: 0 }
            }
            return nav
          }
          if (action.type === 'GO_BACK') {
            if (snapshot.canGoBack) {
              actions.goBack()
              return { ...nav, highlightedIndex: 0 }
            }
            navigate('/')
            return nav
          }
          return nav
        }

        // ── Read mode ──
        if (mode === 'read') {
          if (snapshot.readMode === 'page') {
            // Page mode: scroll flips whole pages
            if (action.type === 'HIGHLIGHT_MOVE') {
              const currentPageIdx = readOffset(nav.highlightedIndex)
              const maxPage = Math.max(0, totalPageCount(snapshot.currentPage, snapshot.linesPerPage) - 1)
              const delta = action.direction === 'up' ? -1 : 1
              const next = Math.max(0, Math.min(maxPage, currentPageIdx + delta))
              return { ...nav, highlightedIndex: MODE_READ + next }
            }
          } else {
            // Scroll mode: scroll moves line by line
            if (action.type === 'HIGHLIGHT_MOVE') {
              const offset = readOffset(nav.highlightedIndex)
              const maxOffset = Math.max(0, pageContentLineCount(snapshot.currentPage) - 1)
              const delta = action.direction === 'up' ? -1 : 1
              const next = Math.max(0, Math.min(maxOffset, offset + delta))
              return { ...nav, highlightedIndex: MODE_READ + next }
            }
          }
          if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
            const readIdx = buttons.indexOf(t('glass.read', lang))
            return { ...nav, highlightedIndex: readIdx >= 0 ? readIdx : 0 }
          }
          return nav
        }

        // ── Links mode ──
        if (mode === 'links') {
          if (action.type === 'HIGHLIGHT_MOVE') {
            const idx = linkIndex(nav.highlightedIndex)
            const maxIdx = Math.max(0, pageLinkCount(snapshot.currentPage) - 1)
            const delta = action.direction === 'up' ? -1 : 1
            const next = Math.max(0, Math.min(maxIdx, idx + delta))
            return { ...nav, highlightedIndex: MODE_LINKS + next }
          }
          if (action.type === 'SELECT_HIGHLIGHTED') {
            const idx = linkIndex(nav.highlightedIndex)
            const link = snapshot.currentPage.links[idx]
            if (link) {
              actions.navigateToUrl(link.href)
              navigate('/browse')
              return { ...nav, highlightedIndex: 0 }
            }
            return nav
          }
          if (action.type === 'GO_BACK') {
            const linksIdx = buttons.indexOf(t('glass.links', lang))
            return { ...nav, highlightedIndex: linksIdx >= 0 ? linksIdx : 0 }
          }
          return nav
        }

        return nav
      }

      default:
        return nav
    }
  }
}

function handleError(
  action: GlassAction,
  nav: GlassNavState,
  snapshot: BrowseSnapshot,
  navigate: Navigate,
  actions: BrowseActions,
): GlassNavState {
  const lang = snapshot.language
  const buttons = getErrorButtons(lang, snapshot.canGoBack)

  if (action.type === 'HIGHLIGHT_MOVE') {
    const btnIdx = buttonIndex(nav.highlightedIndex, buttons.length)
    const delta = action.direction === 'up' ? -1 : 1
    const next = Math.max(0, Math.min(buttons.length - 1, btnIdx + delta))
    return { ...nav, highlightedIndex: next }
  }
  if (action.type === 'SELECT_HIGHLIGHTED') {
    const btnIdx = buttonIndex(nav.highlightedIndex, buttons.length)
    const selected = buttons[btnIdx]
    if (selected === t('glass.retry', lang)) {
      actions.retry()
      return nav
    }
    if (selected === t('glass.back', lang)) {
      actions.goBack()
      return { ...nav, highlightedIndex: 0 }
    }
    return nav
  }
  if (action.type === 'GO_BACK') {
    if (snapshot.canGoBack) {
      actions.goBack()
      return { ...nav, highlightedIndex: 0 }
    }
    navigate('/')
    return nav
  }
  return nav
}
