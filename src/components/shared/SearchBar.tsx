import { useState, type FormEvent } from 'react'
import { Input, Button, Badge } from 'even-toolkit/web'
import { IcSearch } from 'even-toolkit/web/icons/svg-icons'
import { useTranslation } from '../../hooks/useTranslation'

interface SearchBarProps {
  onSearch: (query: string) => void
  onNext: () => void
  onPrev: () => void
  totalMatches: number
  currentMatch: number
  onClose: () => void
}

export function SearchBar({ onSearch, onNext, onPrev, totalMatches, currentMatch, onClose }: SearchBarProps) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  const handleChange = (value: string) => {
    setInput(value)
    onSearch(value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (totalMatches > 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-surface rounded-[6px] p-2">
      <IcSearch className="w-4 h-4 text-text-dim shrink-0" />
      <Input
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t('search.placeholder')}
        className="flex-1"
        autoFocus
      />
      {totalMatches > 0 && (
        <Badge>{currentMatch + 1}/{totalMatches}</Badge>
      )}
      {totalMatches > 0 && (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onPrev} type="button">
            <span className="text-[13px] tracking-[-0.13px]">&uarr;</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onNext} type="button">
            <span className="text-[13px] tracking-[-0.13px]">&darr;</span>
          </Button>
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={onClose} type="button">
        <span className="text-[13px] tracking-[-0.13px]">{t('search.done')}</span>
      </Button>
    </form>
  )
}
