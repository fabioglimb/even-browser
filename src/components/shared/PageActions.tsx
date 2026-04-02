import { BottomSheet, ListItem, Toggle } from 'even-toolkit/web'
import type { FontSize } from '../../types'

interface PageActionsProps {
  open: boolean
  onClose: () => void
  url: string
  pageText: string
  bookmarked: boolean
  onToggleBookmark: () => void
  fontSize: FontSize
  onFontSizeChange: (size: FontSize) => void
  directMode: boolean
  onToggleDirectMode: () => void
}

export function PageActions({
  open,
  onClose,
  url,
  pageText,
  bookmarked,
  onToggleBookmark,
  fontSize,
  onFontSizeChange,
  directMode,
  onToggleDirectMode,
}: PageActionsProps) {
  const handleCopyUrl = async () => {
    try { await navigator.clipboard.writeText(url) } catch { /* */ }
    onClose()
  }

  const handleCopyText = async () => {
    try { await navigator.clipboard.writeText(pageText) } catch { /* */ }
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pb-2">
        <ListItem
          title="Direct mode"
          subtitle="Load actual site for login"
          trailing={<Toggle checked={directMode} onChange={onToggleDirectMode} />}
        />
        <ListItem
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          onPress={() => { onToggleBookmark(); onClose() }}
        />
        <ListItem title="Copy URL" onPress={handleCopyUrl} />
        <ListItem title="Copy page text" onPress={handleCopyText} />
      </div>
    </BottomSheet>
  )
}
