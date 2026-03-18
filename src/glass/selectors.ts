import type { DisplayData, GlassNavState } from 'even-toolkit/types'
import { line } from 'even-toolkit/types'
import { buildActionBar, buildStaticActionBar } from 'even-toolkit/action-bar'
import { truncate, buildHeaderLine, applyScrollIndicators } from 'even-toolkit/text-utils'
import { pageIndicator } from 'even-toolkit/paginate-text'
import type { PageData, ReadMode, AppLanguage } from '../types'
import { t } from '../utils/i18n'

// ── Snapshot ──

export interface BrowseSnapshot {
  currentPage: PageData | null
  loading: boolean
  error: string | null
  loadingUrl: string | null
  canGoBack: boolean
  flashPhase: boolean
  readMode: ReadMode
  linesPerPage: number
  showPageNumbers: boolean
  language: AppLanguage
}

// ── Mode Encoding ──

export const MODE_BUTTONS = 0     // 0-9: action bar button selection
export const MODE_READ = 100      // 100+: reading/scroll mode (line offset or page index)
export const MODE_LINKS = 200     // 200+: link navigation mode

export function browseMode(idx: number): 'buttons' | 'read' | 'links' {
  if (idx >= MODE_LINKS) return 'links'
  if (idx >= MODE_READ) return 'read'
  return 'buttons'
}

export function readOffset(idx: number): number {
  return idx - MODE_READ
}

export function linkIndex(idx: number): number {
  return idx - MODE_LINKS
}

export function buttonIndex(idx: number, buttonCount: number): number {
  return Math.min(idx, buttonCount - 1)
}

// ── Button definitions ──

export function getPageButtons(lang: AppLanguage, canGoBack: boolean): string[] {
  const btns = [t('glass.read', lang), t('glass.links', lang)]
  if (canGoBack) btns.push(t('glass.back', lang))
  return btns
}

export function getErrorButtons(lang: AppLanguage, canGoBack: boolean): string[] {
  const btns = [t('glass.retry', lang)]
  if (canGoBack) btns.push(t('glass.back', lang))
  return btns
}

// ── Screen: waiting ──

function waitingDisplay(lang: AppLanguage): DisplayData {
  return {
    lines: [
      line(t('glass.waiting', lang), 'meta'),
      line(t('glass.waitingSub', lang), 'meta'),
      line(''),
      line(t('glass.waitingStatus', lang), 'meta'),
    ],
  }
}

// ── Screen: loading ──

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

// ── Screen: page-view ──

const CONTENT_SLOTS = 8

function pageViewDisplay(page: PageData, snapshot: BrowseSnapshot, nav: GlassNavState): DisplayData {
  const mode = browseMode(nav.highlightedIndex)
  const lang = snapshot.language
  const buttons = getPageButtons(lang, snapshot.canGoBack)
  const btnIdx = buttonIndex(nav.highlightedIndex, buttons.length)

  // Header: title + action bar
  const activeLabel = mode === 'read' ? t('glass.read', lang) : mode === 'links' ? t('glass.links', lang) : null
  const actionBar = buildActionBar(buttons, btnIdx, activeLabel, snapshot.flashPhase)
  const headerLine = buildHeaderLine(truncate(page.title, 20), actionBar)

  const lines = [line(headerLine, 'normal', false), line('')]

  if (mode === 'links') {
    // Link list view
    const linkOffset = linkIndex(nav.highlightedIndex)
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
    // Page mode: show a fixed page of lines, scroll flips pages
    const linesPerPage = snapshot.linesPerPage
    const totalLines = page.lines.length
    const totalPages = Math.max(1, Math.ceil(totalLines / linesPerPage))
    const currentPageIdx = Math.min(readOffset(nav.highlightedIndex), totalPages - 1)

    const start = currentPageIdx * linesPerPage
    const end = Math.min(start + linesPerPage, totalLines)

    for (let i = start; i < end; i++) {
      const pl = page.lines[i]
      lines.push(line(pl.text, pl.style === 'heading' ? 'normal' : 'meta', false))
    }

    // Pad remaining slots so page indicator stays at bottom
    const contentCount = end - start
    const slotsForContent = snapshot.showPageNumbers ? CONTENT_SLOTS - 1 : CONTENT_SLOTS
    for (let i = contentCount; i < slotsForContent; i++) {
      lines.push(line('', 'normal', false))
    }

    // Page indicator at bottom
    if (snapshot.showPageNumbers) {
      lines.push(line(pageIndicator(currentPageIdx, totalPages), 'meta', false))
    }
  } else {
    // Scroll mode (default): content scrolls line by line
    const offset = mode === 'read' ? readOffset(nav.highlightedIndex) : 0
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

// ── Screen: error ──

function errorDisplay(error: string, url: string | null, snapshot: BrowseSnapshot, nav: GlassNavState): DisplayData {
  const lang = snapshot.language
  const buttons = getErrorButtons(lang, snapshot.canGoBack)
  const btnIdx = buttonIndex(nav.highlightedIndex, buttons.length)
  const headerLine = buildHeaderLine('EVEN BROWSER', buildStaticActionBar(buttons, btnIdx))
  const domain = url ? truncate(url.replace(/^https?:\/\//, ''), 40) : ''

  return {
    lines: [
      line(headerLine, 'normal', false),
      line(''),
      line(t('glass.failedToLoad', lang), 'meta'),
      line(truncate(error, 46), 'meta'),
      line(''),
      line(domain, 'meta'),
    ],
  }
}

// ── Router ──

export function toDisplayData(snapshot: BrowseSnapshot, nav: GlassNavState): DisplayData {
  const lang = snapshot.language
  switch (nav.screen) {
    case 'page-view': {
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
      return waitingDisplay(lang)
    }
    case 'waiting':
    default:
      return waitingDisplay(lang)
  }
}

// ── Helpers for actions ──

export function pageContentLineCount(page: PageData | null): number {
  return page?.lines.length ?? 0
}

export function pageLinkCount(page: PageData | null): number {
  return page?.links.length ?? 0
}

/** Total number of pages for page mode */
export function totalPageCount(page: PageData | null, linesPerPage: number): number {
  if (!page) return 0
  return Math.max(1, Math.ceil(page.lines.length / linesPerPage))
}
