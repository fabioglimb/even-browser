import type { Bookmark } from '../../types'
import { Card } from '../ui/Card'

interface BookmarkCardProps {
  bookmark: Bookmark
  onNavigate: (url: string) => void
  onRemove: (url: string) => void
}

export function BookmarkCard({ bookmark, onNavigate, onRemove }: BookmarkCardProps) {
  return (
    <Card variant="interactive" padding="sm" className="flex items-center justify-between gap-2">
      <button
        onClick={() => onNavigate(bookmark.url)}
        className="flex-1 text-left min-w-0"
      >
        <div className="text-sm font-medium text-text truncate">{bookmark.title}</div>
        <div className="text-xs text-text-dim truncate">{bookmark.domain}</div>
      </button>
      <button
        onClick={() => onRemove(bookmark.url)}
        className="text-text-muted hover:text-red-400 text-xs px-2 py-1 rounded transition-colors shrink-0"
      >
        Remove
      </button>
    </Card>
  )
}
