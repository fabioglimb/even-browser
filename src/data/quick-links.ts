/**
 * Default quick link definitions for the home screen.
 */

export interface QuickLink {
  label: string
  url: string
  description: string
}

export const quickLinks: QuickLink[] = [
  { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page', description: 'The free encyclopedia' },
  { label: 'Hacker News', url: 'https://news.ycombinator.com/', description: 'Tech news & discussion' },
  { label: 'BBC News', url: 'https://www.bbc.com/news', description: 'World news' },
  { label: 'Reuters', url: 'https://www.reuters.com/', description: 'Breaking news' },
  { label: 'NPR', url: 'https://text.npr.org/', description: 'Text-only news' },
  { label: 'Lite CNN', url: 'https://lite.cnn.com/', description: 'CNN lite edition' },
  { label: 'Lobsters', url: 'https://lobste.rs/', description: 'Computing links' },
  { label: 'Weather', url: 'https://wttr.in/?format=3', description: 'Weather forecast' },
]
