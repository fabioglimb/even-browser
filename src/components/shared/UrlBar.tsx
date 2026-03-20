import { useState, type FormEvent } from 'react'
import { Input, Button } from 'even-toolkit/web'
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
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('url.placeholder')}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="pr-16 font-mono"
        />
        <button
          type="button"
          onClick={handlePaste}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] tracking-[-0.11px] text-text-dim hover:text-text transition-colors cursor-pointer"
        >
          {t('url.paste')}
        </button>
      </div>
      <Button type="submit" variant="highlight" size="sm" disabled={loading || !input.trim()}>
        {loading ? t('url.loading') : t('url.go')}
      </Button>
    </form>
  )
}
