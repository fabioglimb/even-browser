import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { useContentSearch } from '../hooks/useContentSearch'
import { LinkList } from '../components/shared/LinkList'
import { AuthDialog } from '../components/shared/AuthDialog'
import { SearchBar } from '../components/shared/SearchBar'
import { PageActions } from '../components/shared/PageActions'
import { Button, Badge, Card, Divider, EmptyState, Loading, SectionHeader, useDrawerHeader } from 'even-toolkit/web'
import { IcSearch, IcMore } from 'even-toolkit/web/icons/svg-icons'
import { displayUrl } from '../lib/url-utils'
import type { FontSize } from '../types'

export function PageView() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    currentPage,
    loading,
    error,
    loadingUrl,
    canGoBack,
    settings,
    navigateToUrl,
    goBack,
    retry,
    cancelLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    setSettings,
    authRequired,
    submitAuth,
    dismissAuth,
  } = useBrowse()

  const [showSearch, setShowSearch] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [directMode, setDirectMode] = useState(false)

  const toggleDirectMode = () => {
    if (!directMode && currentPage) {
      window.open(currentPage.url, '_blank')
    }
    setDirectMode(d => !d)
  }
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    search,
    totalMatches,
    currentMatch,
    currentMatchLine,
    nextMatch,
    prevMatch,
  } = useContentSearch(currentPage?.lines ?? [])

  // Scroll to match when it changes
  useEffect(() => {
    if (currentMatchLine >= 0 && contentRef.current) {
      const lineEl = contentRef.current.querySelector(`[data-line-index="${currentMatchLine}"]`)
      if (lineEl) lineEl.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [currentMatchLine])

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

  const bookmarked = currentPage ? isBookmarked(currentPage.url) : false

  // Determine header title based on state
  const headerTitle = loading
    ? (t('page.loading') || "Loading...")
    : (error && !currentPage)
      ? t('page.failedToLoad')
      : currentPage?.title ?? 'Browse'

  useDrawerHeader({
    title: headerTitle,
    left: (
      <Button variant="ghost" size="icon" onClick={handleBack}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    ),
    right: currentPage && !loading ? (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => setShowSearch(s => !s)}>
          <IcSearch className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowActions(true)}>
          <IcMore className="w-5 h-5" />
        </Button>
      </div>
    ) : undefined,
  })

  // Loading state
  if (loading) {
    return (
      <div className="px-3 pt-4 pb-8 space-y-4">
        <div className="text-[13px] tracking-[-0.13px] text-text-dim font-mono">{loadingUrl && displayUrl(loadingUrl)}</div>
        <div className="flex justify-center py-8">
          <Loading size={48} />
        </div>
        <Button variant="default" size="sm" onClick={() => { cancelLoading(); handleBack() }}>
          {t('page.cancel')}
        </Button>
      </div>
    )
  }

  // Error state
  if (error && !currentPage) {
    return (
      <div className="px-3 pt-4 pb-8 space-y-4">
        <EmptyState title={t('page.failedToLoad')} description={error} />
        <div className="flex gap-2 justify-center">
          <Button onClick={retry} size="sm">{t('page.retry')}</Button>
          <Button variant="default" size="sm" onClick={handleBack}>{t('page.goBack')}</Button>
        </div>
      </div>
    )
  }

  // No page loaded
  if (!currentPage) {
    navigate('/')
    return null
  }

  // Build page text for copy action
  const pageText = currentPage.blocks.map(b => b.text).filter(Boolean).join('\n')

  return (
    <div className="px-3 pt-4 pb-8 space-y-4">
      {/* Auth Dialog */}
      {authRequired && (
        <AuthDialog
          open={!!authRequired}
          domain={authRequired.domain}
          onSubmit={submitAuth}
          onCancel={dismissAuth}
        />
      )}

      {/* Search Bar */}
      {showSearch && (
        <SearchBar
          onSearch={search}
          onNext={nextMatch}
          onPrev={prevMatch}
          totalMatches={totalMatches}
          currentMatch={currentMatch}
          onClose={() => { setShowSearch(false); search('') }}
        />
      )}

      {/* Page Actions */}
      <PageActions
        open={showActions}
        onClose={() => setShowActions(false)}
        url={currentPage.url}
        pageText={pageText}
        bookmarked={bookmarked}
        onToggleBookmark={() => bookmarked ? removeBookmark(currentPage.url) : addBookmark(currentPage.url, currentPage.title)}
        fontSize={settings.fontSize}
        onFontSizeChange={(size: FontSize) => setSettings({ ...settings, fontSize: size })}
        directMode={directMode}
        onToggleDirectMode={toggleDirectMode}
      />

      {/* Direct mode — open actual site in new tab */}
      {directMode ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <p className="text-[15px] tracking-[-0.15px] text-text text-center">
            Site opened in a new tab.
          </p>
          <p className="text-[13px] tracking-[-0.13px] text-text-dim text-center">
            Login or interact there, then come back and disable direct mode to read the content.
          </p>
          <Button variant="highlight" size="sm" onClick={() => window.open(currentPage.url, '_blank')}>
            Open again
          </Button>
          <Button variant="default" size="sm" onClick={() => { setDirectMode(false); retry() }}>
            Reload as text
          </Button>
        </div>
      ) : (
        <>
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
          <Card padding="sm" className="space-y-1 max-h-64 overflow-y-auto" ref={contentRef}>
            {currentPage.blocks.slice(0, 50).map((block, i) => {
              if (block.type === 'separator') {
                return <Divider key={i} />
              }
              if (block.type === 'heading') {
                return <h3 key={i} className="text-[13px] tracking-[-0.13px] font-normal text-text mt-2">{block.text}</h3>
              }

              const lineIdx = currentPage.lines.findIndex(l => l.text === block.text)
              const isHighlighted = lineIdx >= 0 && lineIdx === currentMatchLine

              return (
                <p
                  key={i}
                  data-line-index={lineIdx >= 0 ? lineIdx : undefined}
                  className={`text-[11px] tracking-[-0.11px] text-text-dim leading-relaxed ${isHighlighted ? 'bg-accent-warning rounded-[4px] px-1' : ''}`}
                >
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
        </>
      )}

      {/* Error banner (if error but page still shown) */}
      {error && (
        <Card className="bg-negative-alpha border-negative">
          <p className="text-[13px] tracking-[-0.13px] text-negative">{error}</p>
          <Button onClick={retry} size="sm" className="mt-2">{t('page.retry')}</Button>
        </Card>
      )}
    </div>
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
