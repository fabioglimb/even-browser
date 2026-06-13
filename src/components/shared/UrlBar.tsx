import { useState, useEffect, type FormEvent } from 'react'
import { Input, Button, Toast } from 'even-toolkit/web'
import { IcGuideGo } from 'even-toolkit/web/icons/svg-icons'
import { normalizeUrl } from '../../lib/url-utils'
import { useTranslation } from '../../hooks/useTranslation'

interface UrlBarProps {
  onNavigate: (url: string) => void
  loading?: boolean
  initialUrl?: string
}

/** A normalized URL is only usable if it has a scheme and a dotted host. */
function isUsableUrl(url: string): boolean {
  if (!url) return false
  if (!/^https?:\/\//.test(url)) return false
  try {
    const { hostname } = new URL(url)
    return hostname.includes('.')
  } catch {
    return false
  }
}

export function UrlBar({ onNavigate, loading, initialUrl = '' }: UrlBarProps) {
  const [input, setInput] = useState(initialUrl)
  const [invalid, setInvalid] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(id)
  }, [toast])

  const flagInvalid = () => {
    setInvalid(true)
    setToast(t('url.invalid'))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const url = normalizeUrl(input)
    if (!isUsableUrl(url)) {
      flagInvalid()
      return
    }
    setInvalid(false)
    onNavigate(url)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const url = normalizeUrl(text)
      if (!isUsableUrl(url)) {
        setInput(text)
        flagInvalid()
        return
      }
      setInvalid(false)
      setInput(url)
      onNavigate(url)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-1.5 min-w-0">
        <div className="relative flex-1 min-w-0">
          <Input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); if (invalid) setInvalid(false) }}
            placeholder={t('url.placeholder')}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            error={invalid}
            className="pr-12 font-mono text-[13px] tracking-[-0.13px]"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] tracking-[-0.11px] text-text-dim hover:text-text transition-colors cursor-pointer"
          >
            {t('url.paste')}
          </button>
        </div>
        <Button type="submit" variant="highlight" size="icon" disabled={loading} className="shrink-0">
          <IcGuideGo width={16} height={16} />
        </Button>
      </form>
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-3">
          <Toast message={toast} variant="error" />
        </div>
      )}
    </>
  )
}
