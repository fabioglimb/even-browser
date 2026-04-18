import { createGlassScreenRouter } from 'even-toolkit/glass-screen-router'
import type { BrowseSnapshot, BrowseActions } from './shared'
import { waitingScreen } from './screens/waiting'
import { pageViewScreen } from './screens/page-view'

export type { BrowseSnapshot, BrowseActions }

export const { toDisplayData, onGlassAction } = createGlassScreenRouter<BrowseSnapshot, BrowseActions>({
  'waiting': waitingScreen,
  'page-view': pageViewScreen,
}, 'waiting')
