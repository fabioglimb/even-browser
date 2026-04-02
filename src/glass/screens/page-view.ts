import type { GlassScreen } from 'even-toolkit/glass-screen-router'
import type { DisplayData } from 'even-toolkit/types'
import { line, glassHeader } from 'even-toolkit/types'
import { buildActionBar, buildStaticActionBar } from 'even-toolkit/action-bar'
import { truncate, applyScrollIndicators } from 'even-toolkit/text-utils'
import { pageIndicator } from 'even-toolkit/paginate-text'
import { DEFAULT_CONTENT_SLOTS } from 'even-toolkit/glass-display-builders'
import { createModeEncoder } from 'even-toolkit/glass-mode'
import { moveHighlight, clampIndex } from 'even-toolkit/glass-nav'
import type { PageData, AppLanguage } from '../../types'
import type { BrowseSnapshot, BrowseActions } from '../shared'
import { t } from '../../utils/i18n'

// ── Mode Encoding ──

export const browseMode = createModeEncoder({
  buttons: 0,
  read: 100,
  links: 200,
  find: 300,
})

// ── Button definitions ──

export function getPageButtons(lang: AppLanguage, canGoBack: boolean): string[] {
  const btns = [t('glass.read', lang), t('glass.links', lang), t('glass.find', lang)]
  if (canGoBack) btns.push(t('glass.back', lang))
  return btns
}

export function getErrorButtons(lang: AppLanguage, canGoBack: boolean): string[] {
  const btns = [t('glass.retry', lang)]
  if (canGoBack) btns.push(t('glass.back', lang))
  return btns
}

// ── Helpers ──

export function pageContentLineCount(page: PageData | null): number {
  return page?.lines.length ?? 0
}

export function pageLinkCount(page: PageData | null): number {
  return page?.links.length ?? 0
}

export function totalPageCount(page: PageData | null, linesPerPage: number): number {
  if (!page) return 0
  return Math.max(1, Math.ceil(page.lines.length / linesPerPage))
}

// ── Sub-displays ──

const CONTENT_SLOTS = DEFAULT_CONTENT_SLOTS

function loadingDisplay(url: string, lang: AppLanguage): DisplayData {
  const domain = truncate(url.replace(/^https?:\/\//, ''), 40)
  return {
    lines: [
      line(t('glass.loading', lang), 'normal'),
      line(domain, 'meta'),
      line(''),
      line(''),
      line(buildStaticActionBar([t('glass.cancel', lang)], 0), 'normal'),
    ],
  }
}

function errorDisplay(error: string, url: string | null, snapshot: BrowseSnapshot, nav: import('even-toolkit/types').GlassNavState): DisplayData {
  const lang = snapshot.language
  const buttons = getErrorButtons(lang, snapshot.canGoBack)
  const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)
  const domain = url ? truncate(url.replace(/^https?:\/\//, ''), 40) : ''

  return {
    lines: [
      ...glassHeader('EVEN BROWSER', buildStaticActionBar(buttons, btnIdx)),
      line(t('glass.failedToLoad', lang), 'meta'),
      line(truncate(error, 46), 'meta'),
      line(''),
      line(domain, 'meta'),
    ],
  }
}

function pageViewDisplay(page: PageData, snapshot: BrowseSnapshot, nav: import('even-toolkit/types').GlassNavState): DisplayData {
  const mode = browseMode.getMode(nav.highlightedIndex)
  const lang = snapshot.language
  const buttons = getPageButtons(lang, snapshot.canGoBack)
  const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)

  const activeLabel = mode === 'read' ? t('glass.read', lang) : mode === 'links' ? t('glass.links', lang) : mode === 'find' ? t('glass.find', lang) : null
  const actionBar = buildActionBar(buttons, btnIdx, activeLabel, snapshot.flashPhase)

  const lines = [...glassHeader(truncate(page.title, 20), actionBar)]

  if (mode === 'find') {
    lines.push(line(''))
    lines.push(line(t('glass.findOnPhone', lang), 'meta'))
    lines.push(line(''))
    return { lines }
  }

  if (mode === 'links') {
    const linkOffset = browseMode.getOffset(nav.highlightedIndex)
    const totalLinks = page.links.length
    if (totalLinks === 0) {
      lines.push(line(''))
      lines.push(line(t('glass.noLinks', lang), 'meta'))
      return { lines }
    }

    const start = Math.max(0, Math.min(linkOffset - 2, totalLinks - CONTENT_SLOTS))
    const end = Math.min(start + CONTENT_SLOTS, totalLinks)

    const contentLines = []
    for (let i = start; i < end; i++) {
      const prefix = i === linkOffset ? '\u25B8 ' : '  '
      const text = `${prefix}${i + 1}. ${truncate(page.links[i].text, 38)}`
      contentLines.push(line(text, 'normal', i === linkOffset))
    }

    applyScrollIndicators(contentLines, start, totalLinks, CONTENT_SLOTS, (t) => line(t, 'meta', false))
    lines.push(...contentLines)
  } else if (mode === 'read' && snapshot.readMode === 'page') {
    const linesPerPage = snapshot.linesPerPage
    const totalLines = page.lines.length
    const totalPages = Math.max(1, Math.ceil(totalLines / linesPerPage))
    const currentPageIdx = Math.min(browseMode.getOffset(nav.highlightedIndex), totalPages - 1)

    const start = currentPageIdx * linesPerPage
    const end = Math.min(start + linesPerPage, totalLines)

    for (let i = start; i < end; i++) {
      const pl = page.lines[i]
      lines.push(line(pl.text, pl.style === 'heading' ? 'normal' : 'meta', false))
    }

    const contentCount = end - start
    const slotsForContent = snapshot.showPageNumbers ? CONTENT_SLOTS - 1 : CONTENT_SLOTS
    for (let i = contentCount; i < slotsForContent; i++) {
      lines.push(line('', 'normal', false))
    }

    if (snapshot.showPageNumbers) {
      lines.push(line(pageIndicator(currentPageIdx, totalPages), 'meta', false))
    }
  } else {
    const offset = mode === 'read' ? browseMode.getOffset(nav.highlightedIndex) : 0
    const totalLines = page.lines.length
    const start = Math.max(0, Math.min(offset, totalLines - CONTENT_SLOTS))
    const end = Math.min(start + CONTENT_SLOTS, totalLines)

    const contentLines = []
    for (let i = start; i < end; i++) {
      const pl = page.lines[i]
      contentLines.push(line(pl.text, pl.style === 'heading' ? 'normal' : 'meta', false))
    }

    applyScrollIndicators(contentLines, start, totalLines, CONTENT_SLOTS, (t) => line(t, 'meta', false))
    lines.push(...contentLines)
  }

  return { lines }
}

// ── Error action handler ──

function handleError(
  action: import('even-toolkit/types').GlassAction,
  nav: import('even-toolkit/types').GlassNavState,
  snapshot: BrowseSnapshot,
  ctx: BrowseActions,
): import('even-toolkit/types').GlassNavState {
  const lang = snapshot.language
  const buttons = getErrorButtons(lang, snapshot.canGoBack)

  if (action.type === 'HIGHLIGHT_MOVE') {
    const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)
    return { ...nav, highlightedIndex: moveHighlight(btnIdx, action.direction, buttons.length - 1) }
  }
  if (action.type === 'SELECT_HIGHLIGHTED') {
    const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)
    const selected = buttons[btnIdx]
    if (selected === t('glass.retry', lang)) {
      ctx.retry()
      return nav
    }
    if (selected === t('glass.back', lang)) {
      ctx.goBack()
      return { ...nav, highlightedIndex: 0 }
    }
    return nav
  }
  if (action.type === 'GO_BACK') {
    if (snapshot.canGoBack) {
      ctx.goBack()
      return { ...nav, highlightedIndex: 0 }
    }
    ctx.navigate('/')
    return nav
  }
  return nav
}

// ── Screen ──

export const pageViewScreen: GlassScreen<BrowseSnapshot, BrowseActions> = {
  display(snapshot, nav) {
    const lang = snapshot.language
    if (snapshot.loading) {
      return loadingDisplay(snapshot.loadingUrl || '', lang)
    }
    if (snapshot.error && !snapshot.currentPage) {
      return errorDisplay(snapshot.error, snapshot.loadingUrl || null, snapshot, nav)
    }
    if (snapshot.error && snapshot.currentPage) {
      return errorDisplay(snapshot.error, snapshot.currentPage.url, snapshot, nav)
    }
    if (snapshot.currentPage) {
      return pageViewDisplay(snapshot.currentPage, snapshot, nav)
    }
    // Fallback to waiting-like display
    return {
      lines: [
        line(t('glass.waiting', lang), 'meta'),
        line(t('glass.waitingSub', lang), 'meta'),
        line(''),
        line(t('glass.waitingStatus', lang), 'meta'),
      ],
    }
  },

  action(action, nav, snapshot, ctx) {
    if (snapshot.loading) {
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        ctx.cancelLoading()
        if (snapshot.canGoBack) {
          ctx.goBack()
        } else {
          ctx.navigate('/')
        }
      }
      return nav
    }

    if (snapshot.error) {
      return handleError(action, nav, snapshot, ctx)
    }

    if (!snapshot.currentPage) return nav

    const mode = browseMode.getMode(nav.highlightedIndex)
    const lang = snapshot.language
    const buttons = getPageButtons(lang, snapshot.canGoBack)

    // ── Button select mode ──
    if (mode === 'buttons') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)
        return { ...nav, highlightedIndex: moveHighlight(btnIdx, action.direction, buttons.length - 1) }
      }
      if (action.type === 'SELECT_HIGHLIGHTED') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)
        const selected = buttons[btnIdx]
        if (selected === t('glass.read', lang)) {
          return { ...nav, highlightedIndex: browseMode.encode('read') }
        }
        if (selected === t('glass.links', lang)) {
          return { ...nav, highlightedIndex: browseMode.encode('links') }
        }
        if (selected === t('glass.find', lang)) {
          return { ...nav, highlightedIndex: browseMode.encode('find') }
        }
        if (selected === t('glass.back', lang)) {
          ctx.goBack()
          return { ...nav, highlightedIndex: 0 }
        }
        return nav
      }
      if (action.type === 'GO_BACK') {
        if (snapshot.canGoBack) {
          ctx.goBack()
          return { ...nav, highlightedIndex: 0 }
        }
        ctx.navigate('/')
        return nav
      }
      return nav
    }

    // ── Read mode ──
    if (mode === 'read') {
      if (snapshot.readMode === 'page') {
        if (action.type === 'HIGHLIGHT_MOVE') {
          const currentPageIdx = browseMode.getOffset(nav.highlightedIndex)
          const maxPage = Math.max(0, totalPageCount(snapshot.currentPage, snapshot.linesPerPage) - 1)
          return { ...nav, highlightedIndex: browseMode.encode('read', moveHighlight(currentPageIdx, action.direction, maxPage)) }
        }
      } else {
        if (action.type === 'HIGHLIGHT_MOVE') {
          const offset = browseMode.getOffset(nav.highlightedIndex)
          const maxOffset = Math.max(0, pageContentLineCount(snapshot.currentPage) - 1)
          return { ...nav, highlightedIndex: browseMode.encode('read', moveHighlight(offset, action.direction, maxOffset)) }
        }
      }
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        const readIdx = buttons.indexOf(t('glass.read', lang))
        return { ...nav, highlightedIndex: readIdx >= 0 ? readIdx : 0 }
      }
      return nav
    }

    // ── Find mode ──
    if (mode === 'find') {
      if (action.type === 'SELECT_HIGHLIGHTED' || action.type === 'GO_BACK') {
        const findIdx = buttons.indexOf(t('glass.find', lang))
        return { ...nav, highlightedIndex: findIdx >= 0 ? findIdx : 0 }
      }
      return nav
    }

    // ── Links mode ──
    if (mode === 'links') {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const idx = browseMode.getOffset(nav.highlightedIndex)
        const maxIdx = Math.max(0, pageLinkCount(snapshot.currentPage) - 1)
        return { ...nav, highlightedIndex: browseMode.encode('links', moveHighlight(idx, action.direction, maxIdx)) }
      }
      if (action.type === 'SELECT_HIGHLIGHTED') {
        const idx = browseMode.getOffset(nav.highlightedIndex)
        const link = snapshot.currentPage.links[idx]
        if (link) {
          ctx.navigateToUrl(link.href)
          ctx.navigate('/browse')
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
  },
}
