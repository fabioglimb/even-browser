/**
 * Core browse hook — wraps BrowseContext for convenient use in components.
 */

import { useBrowseContext } from '../contexts/BrowseContext'

export function useBrowse() {
  return useBrowseContext()
}
