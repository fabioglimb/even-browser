import { useNavigate } from 'react-router'
import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { UrlBar } from '../components/shared/UrlBar'
import { QuickLinks } from '../components/shared/QuickLinks'
import { loadRecentUrls } from '../data/persistence'
import { displayUrl } from '../lib/url-utils'
import { AppShell, Button, SectionHeader, ListItem } from 'even-toolkit/web'

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
    <AppShell
      header={
        <div className="px-3">
          <header className="mt-4 mb-3 flex items-center justify-between">
            <h1 className="text-[24px] tracking-[-0.72px] font-normal">EvenBrowser</h1>
            <Button variant="default" size="sm" onClick={() => navigate('/settings')}>
              Settings
            </Button>
          </header>
        </div>
      }
    >
      <div className="px-3 pb-8">
        {/* URL Bar */}
        <UrlBar onNavigate={handleNavigate} loading={loading} />

        {/* Quick Links */}
        <div className="mt-3">
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
    </AppShell>
  )
}
