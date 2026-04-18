import type { Bookmark } from '../../types'
import { ListItem } from 'even-toolkit/web'

interface BookmarkCardProps {
  bookmark: Bookmark
  onNavigate: (url: string) => void
  onRemove: (url: string) => void
}

export function BookmarkCard({ bookmark, onNavigate, onRemove }: BookmarkCardProps) {
  return (
    <ListItem
      title={bookmark.title}
      subtitle={bookmark.domain}
      onPress={() => onNavigate(bookmark.url)}
      onDelete={() => onRemove(bookmark.url)}
    />
  )
}
