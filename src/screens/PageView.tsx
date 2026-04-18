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
import { checkDirectModeAvailability, type DirectModeReason } from '../lib/direct-mode'
import { displayUrl } from '../lib/url-utils'
import type { FontSize } from '../types'

interface DirectModeNotice {
  reason?: DirectModeReason
  url: string
}

type DirectModeState = 'idle' | 'checking' | 'iframe' | 'fallback'

const DIRECT_MODE_WATCHDOG_MS = 5000

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
  const [directModeState, setDirectModeState] = useState<DirectModeState>('idle')
  const [directModeFrameReady, setDirectModeFrameReady] = useState(false)
  const [directModeNotice, setDirectModeNotice] = useState<DirectModeNotice | null>(null)
  const directModeRequestId = useRef(0)
  const directModeLoadTimer = useRef<number | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const directMode = directModeState === 'iframe'
  const directModeChecking = directModeState === 'checking'
  const directModeFallback = directModeState === 'fallback'

  const openDirectModePage = (url: string) => {
    window.location.assign(url)
  }

  const clearDirectModeWatchdog = () => {
    if (directModeLoadTimer.current !== null) {
      window.clearTimeout(directModeLoadTimer.current)
      directModeLoadTimer.current = null
    }
  }

  const showDirectModeFallback = (url: string, reason: DirectModeReason = 'mayFail') => {
    clearDirectModeWatchdog()
    setDirectModeFrameReady(false)
    setDirectModeNotice({ url, reason })
    setDirectModeState('fallback')
  }

  const getDirectModeReasonText = (reason?: DirectModeReason) => {
    switch (reason) {
      case 'blocked':
        return t('page.directBlocked')
      case 'notHtml':
        return t('page.directNotHtml')
      default:
        return t('page.directMayFail')
    }
  }

  const setDirectModeEnabled = async (enabled: boolean) => {
    if (!currentPage) return

    const requestId = ++directModeRequestId.current

    if (!enabled) {
      clearDirectModeWatchdog()
      setDirectModeState('idle')
      setDirectModeFrameReady(false)
      setDirectModeNotice(null)
      retry()
      return
    }

    setShowSearch(false)
    setDirectModeNotice(null)
    setDirectModeFrameReady(false)
    setDirectModeState('checking')

    const availability = await checkDirectModeAvailability(currentPage.url)
    if (requestId !== directModeRequestId.current) return

    if (availability.status === 'blocked') {
      const targetUrl = availability.finalUrl ?? currentPage.url
      showDirectModeFallback(targetUrl, availability.reason ?? 'blocked')
      return
    }

    setDirectModeState('iframe')
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

  useEffect(() => {
    directModeRequestId.current += 1
    clearDirectModeWatchdog()
    setDirectModeState('idle')
    setDirectModeFrameReady(false)
    setDirectModeNotice(null)
  }, [currentPage?.url])

  useEffect(() => {
    return () => {
      clearDirectModeWatchdog()
    }
  }, [])

  useEffect(() => {
    if (directModeState !== 'iframe' || !currentPage) return

    clearDirectModeWatchdog()
    setDirectModeFrameReady(false)

    const requestId = directModeRequestId.current
    directModeLoadTimer.current = window.setTimeout(() => {
      if (requestId !== directModeRequestId.current) return
      showDirectModeFallback(currentPage.url, 'mayFail')
    }, DIRECT_MODE_WATCHDOG_MS)

    return () => {
      clearDirectModeWatchdog()
    }
  }, [currentPage, directModeState])

  const handleDirectModeFrameLoad = () => {
    if (!currentPage) return

    try {
      const href = iframeRef.current?.contentWindow?.location?.href ?? ''
      const bodyText = iframeRef.current?.contentDocument?.body?.textContent?.trim() ?? ''

      if ((!href || href === 'about:blank') && !bodyText) {
        showDirectModeFallback(currentPage.url, 'blocked')
        return
      }
    } catch {
      // Cross-origin access means the iframe navigated to a real page.
    }

    clearDirectModeWatchdog()
    setDirectModeFrameReady(true)
  }

  useEffect(() => {
    if (!loading && !error && !currentPage) {
      navigate('/')
    }
  }, [currentPage, error, loading, navigate])

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
    ? t('page.loading')
    : (error && !currentPage)
      ? t('page.failedToLoad')
      : currentPage?.title ?? t('page.browse')

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
        {!directMode && !directModeChecking && (
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(s => !s)}>
            <IcSearch className="w-5 h-5" />
          </Button>
        )}
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
    return null
  }

  // Build page text for copy action
  const pageText = currentPage.blocks.map(b => b.text).filter(Boolean).join('\n')

  return (
    <div className="h-full min-h-0 flex flex-col">
      {/* Auth Dialog */}
      {authRequired && (
        <AuthDialog
          open={!!authRequired}
          domain={authRequired.domain}
          onSubmit={submitAuth}
          onCancel={dismissAuth}
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
        directMode={directMode || directModeChecking}
        onToggleDirectMode={setDirectModeEnabled}
      />

      {directModeChecking ? (
        <div className="px-3 pt-4 pb-8 flex-1 min-h-0">
          <Card padding="sm" className="h-full min-h-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loading size={40} />
              <p className="text-[13px] tracking-[-0.13px] text-text">{t('page.directChecking')}</p>
            </div>
          </Card>
        </div>
      ) : directMode ? (
        <div className="relative flex-1 min-h-0 bg-white">
          {!directModeFrameReady && (
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center bg-white/90 px-4 py-4">
              <div className="flex items-center gap-3 text-center">
                <Loading size={28} />
                <p className="text-[13px] tracking-[-0.13px] text-text">{t('page.directChecking')}</p>
              </div>
            </div>
          )}
          <iframe
            key={currentPage.url}
            ref={iframeRef}
            src={currentPage.url}
            title={currentPage.title || currentPage.url}
            className="block h-full w-full border-0 bg-white"
            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={handleDirectModeFrameLoad}
            onError={() => showDirectModeFallback(currentPage.url, 'blocked')}
          />
        </div>
      ) : directModeFallback && directModeNotice ? (
        <div className="px-3 pt-4 pb-8 flex-1 min-h-0">
          <Card padding="sm" className="h-full min-h-0 flex flex-col justify-center">
            <div className="space-y-4 text-center">
              <EmptyState
                title={t('page.directFallbackTitle')}
                description={getDirectModeReasonText(directModeNotice.reason)}
              />
              <p className="text-[11px] tracking-[-0.11px] text-text-dim leading-relaxed">
                {t('page.directHint')}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button onClick={() => openDirectModePage(directModeNotice.url)} size="sm">
                  {t('page.openLivePage')}
                </Button>
                <Button variant="default" onClick={() => setDirectModeEnabled(false)} size="sm">
                  {t('page.reloadAsText')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="px-3 pt-4 pb-4 flex flex-col gap-4">
          {directModeNotice && (
            <Card padding="sm" className="space-y-2">
              <p className="text-[13px] tracking-[-0.13px] text-text">{t('page.directOpened')}</p>
              <p className="text-[11px] tracking-[-0.11px] text-text-dim leading-relaxed">
                {getDirectModeReasonText(directModeNotice.reason)}
              </p>
              <p className="text-[11px] tracking-[-0.11px] text-text-dim leading-relaxed">
                {t('page.directHint')}
              </p>
              <Button size="sm" onClick={() => openDirectModePage(directModeNotice.url)}>
                {t('page.openAgain')}
              </Button>
            </Card>
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

          {/* Error banner (if error but page still shown) */}
          {error && (
            <Card className="bg-negative-alpha border-negative">
              <p className="text-[13px] tracking-[-0.13px] text-negative">{error}</p>
              <Button onClick={retry} size="sm" className="mt-2">{t('page.retry')}</Button>
            </Card>
          )}
        </div>
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
