/** A parsed web page */
export interface PageData {
  url: string
  title: string
  blocks: PageBlock[]
  links: PageLink[]
  lines: PageContentLine[]
}

export interface PageBlock {
  type: 'heading' | 'paragraph' | 'listItem' | 'separator'
  text: string
  linkIndex?: number
}

export interface PageLink {
  text: string
  href: string
  lineIndex: number
}

export interface PageContentLine {
  text: string
  style: 'heading' | 'normal' | 'meta'
  linkIndex?: number
}

/** Browser history stack */
export interface BrowseHistory {
  stack: HistoryEntry[]
  currentIndex: number
}

export interface HistoryEntry {
  url: string
  pageData: PageData
  scrollOffset: number
}

/** Bookmarks */
export interface Bookmark {
  url: string
  title: string
  domain: string
  addedAt: number
}

export interface SiteCredentials {
  username: string
  password: string
}

export type FontSize = 'small' | 'medium' | 'large'

export type ReadMode = 'scroll' | 'page'
export type AppLanguage = 'en' | 'it' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh' | 'ko'

export const APP_LANGUAGES: { id: AppLanguage; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'it', name: 'Italiano' },
  { id: 'es', name: 'Espanol' },
  { id: 'fr', name: 'Francais' },
  { id: 'de', name: 'Deutsch' },
  { id: 'pt', name: 'Portugues' },
  { id: 'ja', name: 'Japanese' },
  { id: 'zh', name: 'Chinese' },
  { id: 'ko', name: 'Korean' },
]

export interface BrowseSettings {
  linesPerPage: number
  showPageNumbers: boolean
  readMode: ReadMode
  language: AppLanguage
  fontSize: FontSize
}
