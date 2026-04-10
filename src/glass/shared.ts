import type { PageData, ReadMode, AppLanguage } from '../types'

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
  bookmarks: { title: string; url: string }[]
  favoriteUrls: string[]
}

export interface BrowseActions {
  navigate: (path: string) => void
  navigateToUrl: (url: string) => void
  goBack: () => void
  retry: () => void
  cancelLoading: () => void
}
