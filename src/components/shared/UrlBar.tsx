import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { normalizeUrl } from '../../lib/url-utils'
import { useTranslation } from '../../hooks/useTranslation'

interface UrlBarProps {
  onNavigate: (url: string) => void
  loading?: boolean
  initialUrl?: string
}

export function UrlBar({ onNavigate, loading, initialUrl = '' }: UrlBarProps) {
  const [input, setInput] = useState(initialUrl)
  const { t } = useTranslation()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const url = normalizeUrl(input)
    if (url) onNavigate(url)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const url = normalizeUrl(text)
      if (url) {
        setInput(url)
        onNavigate(url)
      }
    } catch {
      // Clipboard not available
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('url.placeholder')}
          className="h-11 w-full rounded-lg border border-border bg-surface px-4 pr-20 text-sm text-text placeholder:text-text-muted transition-colors focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 font-mono"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={handlePaste}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-dim hover:text-text px-2 py-1 rounded transition-colors"
        >
          {t('url.paste')}
        </button>
      </div>
      <Button type="submit" disabled={loading || !input.trim()} size="lg">
        {loading ? t('url.loading') : t('url.go')}
      </Button>
    </form>
  )
}
