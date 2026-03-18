import React from 'react'
import { useNavigate } from 'react-router'
import { useBrowse } from '../hooks/useBrowse'
import { LinkList } from '../components/shared/LinkList'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { displayUrl } from '../lib/url-utils'

export function PageView() {
  const navigate = useNavigate()
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-4 max-w-lg mx-auto">
        <div className="pt-6 space-y-4">
          <button onClick={handleBack} className="text-sm text-text-dim hover:text-text transition-colors">
            &larr; Back
          </button>
          <div className="space-y-3">
            <div className="h-4 bg-surface-light rounded animate-pulse w-3/4" />
            <div className="text-sm text-text-dim font-mono">{loadingUrl && displayUrl(loadingUrl)}</div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-surface-light rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => { cancelLoading(); handleBack() }}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !currentPage) {
    return (
      <div className="min-h-screen p-4 max-w-lg mx-auto">
        <div className="pt-6 space-y-4">
          <button onClick={handleBack} className="text-sm text-text-dim hover:text-text transition-colors">
            &larr; Back
          </button>
          <Card variant="elevated" className="space-y-3">
            <h2 className="text-lg font-medium text-red-400">Failed to load page</h2>
            <p className="text-sm text-text-dim">{error}</p>
            <div className="flex gap-2">
              <Button onClick={retry} size="sm">Retry</Button>
              <Button variant="outline" size="sm" onClick={handleBack}>Go Back</Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // No page loaded
  if (!currentPage) {
    navigate('/')
    return null
  }

  const bookmarked = isBookmarked(currentPage.url)

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="pt-6 space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2">
          <button onClick={handleBack} className="text-sm text-text-dim hover:text-text transition-colors shrink-0">
            &larr; Back
          </button>
          <div className="text-xs text-text-muted truncate font-mono flex-1 text-center">
            {displayUrl(currentPage.url)}
          </div>
          <button
            onClick={() => bookmarked ? removeBookmark(currentPage.url) : addBookmark(currentPage.url, currentPage.title)}
            className={`text-sm shrink-0 transition-colors ${bookmarked ? 'text-accent' : 'text-text-dim hover:text-text'}`}
          >
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Page title */}
        <div>
          <h1 className="text-xl font-semibold text-text">{currentPage.title}</h1>
          <div className="flex gap-2 mt-2">
            <Badge>{currentPage.links.length} links</Badge>
            <Badge>{currentPage.lines.length} lines</Badge>
          </div>
        </div>

        {/* Page content preview */}
        <Card padding="sm" className="space-y-1 max-h-64 overflow-y-auto">
          {currentPage.blocks.slice(0, 50).map((block, i) => {
            if (block.type === 'separator') {
              return <hr key={i} className="border-border my-2" />
            }
            if (block.type === 'heading') {
              return <h3 key={i} className="text-sm font-semibold text-text mt-2">{block.text}</h3>
            }
            return (
              <p key={i} className="text-xs text-text-dim leading-relaxed">
                {renderTextWithLinks(block.text, currentPage.links, handleNavigate)}
              </p>
            )
          })}
        </Card>

        {/* Links section */}
        {currentPage.links.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-text-dim mb-2">Links ({currentPage.links.length})</h2>
            <Card padding="none" className="max-h-64 overflow-y-auto">
              <LinkList links={currentPage.links} onNavigate={handleNavigate} />
            </Card>
          </div>
        )}

        {/* Error banner (if error but page still shown) */}
        {error && (
          <Card className="bg-red-600/10 border-red-600/20">
            <p className="text-sm text-red-400">{error}</p>
            <Button onClick={retry} size="sm" className="mt-2">Retry</Button>
          </Card>
        )}

        <div className="pb-8" />
      </div>
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
      <button
        key={key++}
        onClick={() => onNavigate(link.href)}
        className="text-accent hover:underline inline"
      >
        {link.text}
      </button>
    )
    remaining = remaining.slice(idx + marker.length)
  }

  if (remaining) parts.push(remaining)
  return parts.length > 0 ? <>{parts}</> : text
}
