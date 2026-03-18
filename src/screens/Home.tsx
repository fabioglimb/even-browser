import { useNavigate } from 'react-router'
import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { UrlBar } from '../components/shared/UrlBar'
import { QuickLinks } from '../components/shared/QuickLinks'
import { BookmarkCard } from '../components/shared/BookmarkCard'
import { loadRecentUrls } from '../data/persistence'
import { displayUrl } from '../lib/url-utils'

export function Home() {
  const navigate = useNavigate()
  const { navigateToUrl, loading, bookmarks, removeBookmark } = useBrowse()
  const { t } = useTranslation()
  const recentUrls = loadRecentUrls()

  const handleNavigate = (url: string) => {
    navigateToUrl(url)
    navigate('/browse')
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="pt-2 pb-2">
        <p className="text-sm text-text-dim">{t('app.subtitle')}</p>
      </div>

      {/* URL Bar */}
      <UrlBar onNavigate={handleNavigate} loading={loading} />

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-medium text-text-dim mb-2">{t('home.quickLinks')}</h2>
        <QuickLinks onNavigate={handleNavigate} />
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-text-dim mb-2">{t('home.bookmarks')}</h2>
          <div className="space-y-2">
            {bookmarks.map((b) => (
              <BookmarkCard
                key={b.url}
                bookmark={b}
                onNavigate={handleNavigate}
                onRemove={removeBookmark}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      {recentUrls.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-text-dim mb-2">{t('home.recent')}</h2>
          <div className="space-y-1">
            {recentUrls.slice(0, 10).map((url) => (
              <button
                key={url}
                onClick={() => handleNavigate(url)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-light transition-colors"
              >
                <div className="text-sm text-text-dim truncate font-mono">{displayUrl(url)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pb-8" />
    </div>
  )
}
