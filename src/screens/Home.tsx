import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { UrlBar } from '../components/shared/UrlBar'
import { QuickLinks } from '../components/shared/QuickLinks'
import { loadRecentUrls } from '../data/persistence'
import { displayUrl } from '../lib/url-utils'
import { SectionHeader, ListItem, useDrawerHeader } from 'even-toolkit/web'

export function Home() {
  const navigate = useNavigate()
  const { navigateToUrl, loading, bookmarks, removeBookmark } = useBrowse()
  const { t } = useTranslation()
  const [recentUrls, setRecentUrls] = useState<string[]>([])

  useEffect(() => {
    loadRecentUrls().then(setRecentUrls)
  }, [])

  const handleNavigate = (url: string) => {
    navigateToUrl(url)
    navigate('/browse')
  }

  useDrawerHeader({
    title: (<div style={{ width: 'calc(100% + 48px)', marginRight: '-48px' }} className="overflow-visible whitespace-normal"><UrlBar onNavigate={handleNavigate} loading={loading} /></div>) as unknown as string,
  })

  return (
    <div className="px-3 pt-2 pb-8">

      {/* Quick Links */}
      <div>
        <SectionHeader title={t('home.quickLinks')} />
        <QuickLinks onNavigate={handleNavigate} />
      </div>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="mt-3">
          <SectionHeader title={t('home.bookmarks')} />
          <div className="rounded-[6px] overflow-hidden bg-surface">
            {bookmarks.map((b) => (
              <ListItem
                key={b.url}
                title={b.title}
                subtitle={b.domain}
                onPress={() => handleNavigate(b.url)}
                onDelete={() => removeBookmark(b.url)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      {recentUrls.length > 0 && (
        <div className="mt-3">
          <SectionHeader title={t('home.recent')} />
          <div className="rounded-[6px] overflow-hidden bg-surface">
            {recentUrls.slice(0, 10).map((url) => (
              <ListItem
                key={url}
                title={displayUrl(url)}
                subtitle={url}
                onPress={() => handleNavigate(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
