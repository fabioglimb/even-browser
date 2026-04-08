import type { GlassScreen } from 'even-toolkit/glass-screen-router'
import { line } from 'even-toolkit/types'
import { buildStaticActionBar } from 'even-toolkit/action-bar'
import { truncate, applyScrollIndicators } from 'even-toolkit/text-utils'
import { moveHighlight, clampIndex } from 'even-toolkit/glass-nav'
import { createModeEncoder } from 'even-toolkit/glass-mode'
import { DEFAULT_CONTENT_SLOTS } from 'even-toolkit/glass-display-builders'
import type { BrowseSnapshot, BrowseActions } from '../shared'
import { t } from '../../utils/i18n'

const waitingMode = createModeEncoder({
  buttons: 0,
  bookmarks: 100,
})

export const waitingScreen: GlassScreen<BrowseSnapshot, BrowseActions> = {
  display(snapshot, nav) {
    const lang = snapshot.language
    const mode = nav ? waitingMode.getMode(nav.highlightedIndex) : 'buttons'
    const hasBookmarks = snapshot.bookmarks.length > 0

    if (mode === 'bookmarks' && hasBookmarks) {
      const offset = waitingMode.getOffset(nav.highlightedIndex)
      const total = snapshot.bookmarks.length
      const CONTENT_SLOTS = DEFAULT_CONTENT_SLOTS
      const start = Math.max(0, Math.min(offset - 2, total - CONTENT_SLOTS))
      const end = Math.min(start + CONTENT_SLOTS, total)

      const lines = [
        line(t('home.bookmarks', lang).toUpperCase(), 'normal'),
        line(''),
      ]

      const contentLines = []
      for (let i = start; i < end; i++) {
        const prefix = i === offset ? '\u25B8 ' : '  '
        const text = `${prefix}${truncate(snapshot.bookmarks[i].title, 40)}`
        contentLines.push(line(text, 'normal', i === offset))
      }

      applyScrollIndicators(contentLines, start, total, CONTENT_SLOTS, (t) => line(t, 'meta', false))
      lines.push(...contentLines)

      return { lines }
    }

    // Default waiting display with optional Bookmarks button
    const buttons = hasBookmarks ? [t('home.bookmarks', lang)] : []
    const btnIdx = buttons.length > 0 ? clampIndex(nav?.highlightedIndex ?? 0, buttons.length) : 0

    return {
      lines: [
        line('◆  E R   B R O W S E R  ◆', 'normal'),
        line('', 'separator'),
        line(t('glass.waiting', lang), 'meta'),
        line(t('glass.waitingSub', lang), 'meta'),
        line(''),
        line(t('glass.waitingStatus', lang), 'meta'),
        ...(buttons.length > 0 ? [line(buildStaticActionBar(buttons, btnIdx), 'normal')] : []),
      ],
    }
  },

  action(action, nav, snapshot, ctx) {
    const lang = snapshot.language
    const hasBookmarks = snapshot.bookmarks.length > 0
    const mode = waitingMode.getMode(nav.highlightedIndex)

    if (mode === 'bookmarks' && hasBookmarks) {
      if (action.type === 'HIGHLIGHT_MOVE') {
        const offset = waitingMode.getOffset(nav.highlightedIndex)
        const maxIdx = Math.max(0, snapshot.bookmarks.length - 1)
        return { ...nav, highlightedIndex: waitingMode.encode('bookmarks', moveHighlight(offset, action.direction, maxIdx)) }
      }
      if (action.type === 'SELECT_HIGHLIGHTED') {
        const offset = waitingMode.getOffset(nav.highlightedIndex)
        const bookmark = snapshot.bookmarks[offset]
        if (bookmark) {
          ctx.navigateToUrl(bookmark.url)
          ctx.navigate('/browse')
          return { ...nav, highlightedIndex: 0 }
        }
        return nav
      }
      if (action.type === 'GO_BACK') {
        return { ...nav, highlightedIndex: 0 }
      }
      return nav
    }

    // Button mode
    if (hasBookmarks) {
      const buttons = [t('home.bookmarks', lang)]
      if (action.type === 'HIGHLIGHT_MOVE') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)
        return { ...nav, highlightedIndex: moveHighlight(btnIdx, action.direction, buttons.length - 1) }
      }
      if (action.type === 'SELECT_HIGHLIGHTED') {
        const btnIdx = clampIndex(nav.highlightedIndex, buttons.length)
        const selected = buttons[btnIdx]
        if (selected === t('home.bookmarks', lang)) {
          return { ...nav, highlightedIndex: waitingMode.encode('bookmarks') }
        }
        return nav
      }
    }

    return nav
  },
}
