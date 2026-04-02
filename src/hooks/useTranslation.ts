import { useCallback } from 'react'
import { useBrowseContext } from '../contexts/BrowseContext'
import { t as translate } from '../utils/i18n'

export function useTranslation() {
  const { settings } = useBrowseContext()
  const lang = settings.language

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(key, lang, params),
    [lang],
  )

  return { t, lang }
}
