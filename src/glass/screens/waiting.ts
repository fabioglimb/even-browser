import type { GlassScreen } from 'even-toolkit/glass-screen-router'
import { line } from 'even-toolkit/types'
import type { BrowseSnapshot, BrowseActions } from '../shared'
import { t } from '../../utils/i18n'

export const waitingScreen: GlassScreen<BrowseSnapshot, BrowseActions> = {
  display(snapshot) {
    const lang = snapshot.language
    return {
      lines: [
        line(t('glass.waiting', lang), 'meta'),
        line(t('glass.waitingSub', lang), 'meta'),
        line(''),
        line(t('glass.waitingStatus', lang), 'meta'),
      ],
    }
  },

  action(_action, nav) {
    return nav
  },
}
