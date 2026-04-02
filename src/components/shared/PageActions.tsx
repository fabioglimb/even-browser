import { BottomSheet, ListItem, Toggle } from 'even-toolkit/web'
import { useTranslation } from '../../hooks/useTranslation'
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
  const { t } = useTranslation()
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
          title={t('actions.directMode')}
          subtitle={t('actions.directModeDesc')}
          trailing={<Toggle checked={directMode} onChange={onToggleDirectMode} />}
        />
        <ListItem
          title={bookmarked ? t('actions.removeBookmark') : t('actions.addBookmark')}
          onPress={() => { onToggleBookmark(); onClose() }}
        />
        <ListItem title={t('actions.copyUrl')} onPress={handleCopyUrl} />
        <ListItem title={t('actions.copyPageText')} onPress={handleCopyText} />
      </div>
    </BottomSheet>
  )
}
