import { useCallback } from 'react'
import { useBrowseContext } from '../contexts/BrowseContext'
import { t as translate } from '../utils/i18n'

export function useTranslation() {
  const { settings } = useBrowseContext()
  const lang = settings.language

  const t = useCallback(
    (key: string) => translate(key, lang),
    [lang],
  )

  return { t, lang }
}
