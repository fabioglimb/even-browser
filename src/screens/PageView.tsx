import React from 'react'
import { useNavigate } from 'react-router'
import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { LinkList } from '../components/shared/LinkList'
import { AppShell, NavHeader, Button, Badge, Card, Divider, EmptyState, Loading, SectionHeader } from 'even-toolkit/web'
import { IcChevronBack } from 'even-toolkit/web/icons/svg-icons'
import { displayUrl } from '../lib/url-utils'

export function PageView() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    currentPage,
    loading,
    error,
    loadingUrl,
    canGoBack,
    navigateToUrl,
    goBack,
    retry,
    cancelLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useBrowse()

  const handleNavigate = (url: string) => {
    navigateToUrl(url)
  }

  const handleBack = () => {
    if (canGoBack) {
      goBack()
    } else {
      navigate('/')
    }
  }

  const backButton = (
    <Button variant="ghost" size="icon" onClick={handleBack}>
      <IcChevronBack width={20} height={20} />
    </Button>
  )

  // Loading state
  if (loading) {
    return (
      <AppShell header={<NavHeader title={t('page.loading') || "Loading..."} left={backButton} />}>
        <div className="px-3 pt-4 pb-8 space-y-4">
          <div className="text-[13px] tracking-[-0.13px] text-text-dim font-mono">{loadingUrl && displayUrl(loadingUrl)}</div>
          <div className="flex justify-center py-8">
            <Loading size={48} />
          </div>
          <Button variant="default" size="sm" onClick={() => { cancelLoading(); handleBack() }}>
            {t('page.cancel')}
          </Button>
        </div>
      </AppShell>
    )
  }

  // Error state
  if (error && !currentPage) {
    return (
      <AppShell header={<NavHeader title={t('page.failedToLoad')} left={backButton} />}>
        <div className="px-3 pt-4 pb-8 space-y-4">
          <EmptyState title={t('page.failedToLoad')} description={error} />
          <div className="flex gap-2 justify-center">
            <Button onClick={retry} size="sm">{t('page.retry')}</Button>
            <Button variant="default" size="sm" onClick={handleBack}>{t('page.goBack')}</Button>
          </div>
        </div>
      </AppShell>
    )
  }

  // No page loaded
  if (!currentPage) {
    navigate('/')
    return null
  }

  const bookmarked = isBookmarked(currentPage.url)

  return (
    <AppShell header={
      <NavHeader
        title={currentPage.title}
        left={backButton}
        right={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => bookmarked ? removeBookmark(currentPage.url) : addBookmark(currentPage.url, currentPage.title)}
            className={bookmarked ? 'text-accent' : ''}
          >
            {bookmarked ? t('page.saved') : t('page.save')}
          </Button>
        }
      />
    }>
      <div className="px-3 pt-4 pb-8 space-y-4">
        {/* URL and badges */}
        <div>
          <div className="text-[11px] tracking-[-0.11px] text-text-muted truncate font-mono">
            {displayUrl(currentPage.url)}
          </div>
          <div className="flex gap-2 mt-2">
            <Badge>{currentPage.links.length} {t('page.links')}</Badge>
            <Badge>{currentPage.lines.length} {t('page.lines')}</Badge>
          </div>
        </div>

        {/* Page content preview */}
        <Card padding="sm" className="space-y-1 max-h-64 overflow-y-auto">
          {currentPage.blocks.slice(0, 50).map((block, i) => {
            if (block.type === 'separator') {
              return <Divider key={i} />
            }
            if (block.type === 'heading') {
              return <h3 key={i} className="text-[13px] tracking-[-0.13px] font-normal text-text mt-2">{block.text}</h3>
            }
            return (
              <p key={i} className="text-[11px] tracking-[-0.11px] text-text-dim leading-relaxed">
                {renderTextWithLinks(block.text, currentPage.links, handleNavigate)}
              </p>
            )
          })}
        </Card>

        {/* Links section */}
        {currentPage.links.length > 0 && (
          <div>
            <SectionHeader title={`${t('page.linksTitle')} (${currentPage.links.length})`} />
            <Card padding="none" className="max-h-64 overflow-y-auto">
              <LinkList links={currentPage.links} onNavigate={handleNavigate} />
            </Card>
          </div>
        )}

        {/* Error banner (if error but page still shown) */}
        {error && (
          <Card className="bg-negative-alpha border-negative">
            <p className="text-[13px] tracking-[-0.13px] text-negative">{error}</p>
            <Button onClick={retry} size="sm" className="mt-2">{t('page.retry')}</Button>
          </Card>
        )}
      </div>
    </AppShell>
  )
}

/** Render paragraph text with [Link Text] markers as clickable links */
function renderTextWithLinks(text: string, links: { text: string; href: string }[], onNavigate: (url: string) => void) {
  const parts: (string | React.ReactElement)[] = []
  let remaining = text
  let key = 0

  for (const link of links) {
    const marker = `[${link.text}]`
    const idx = remaining.indexOf(marker)
    if (idx === -1) continue

    if (idx > 0) {
      parts.push(remaining.slice(0, idx))
    }
    parts.push(
      <span
        key={key++}
        role="link"
        tabIndex={0}
        onClick={() => onNavigate(link.href)}
        onKeyDown={(e) => { if (e.key === 'Enter') onNavigate(link.href) }}
        className="text-accent hover:underline inline cursor-pointer"
      >
        {link.text}
      </span>
    )
    remaining = remaining.slice(idx + marker.length)
  }

  if (remaining) parts.push(remaining)
  return parts.length > 0 ? <>{parts}</> : text
}
