import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { Button, SegmentedControl, SettingsGroup, ListItem, Toggle, useDrawerHeader } from 'even-toolkit/web'
import { APP_LANGUAGES, type AppLanguage } from '../types'

export function Settings() {
  const { settings, setSettings, bookmarks, clearHistory } = useBrowse()
  const { t } = useTranslation()

  useDrawerHeader({ title: t('settings.title'), backTo: '/' })

  const languageOptions = APP_LANGUAGES.map((lang) => ({
    value: lang.id,
    label: lang.name,
  }))

  return (
    <main className="px-3 pt-4 pb-8 space-y-4">
      {/* Language */}
      <SettingsGroup label={t('settings.language')}>
        <div className="px-4 pb-4">
          <SegmentedControl
            size="small"
            options={languageOptions}
            value={settings.language}
            onValueChange={(v) => setSettings({ ...settings, language: v as AppLanguage })}
          />
        </div>
      </SettingsGroup>

      {/* Display Settings */}
      <SettingsGroup label={t('settings.display')}>
        {/* Read Mode */}
        <div className="px-4 py-4 space-y-2">
          <span className="text-[15px] tracking-[-0.15px] text-text">{t('settings.readMode')}</span>
          <SegmentedControl
            size="small"
            options={[
              { value: 'scroll', label: t('settings.scroll') },
              { value: 'page', label: t('settings.page') },
            ]}
            value={settings.readMode}
            onValueChange={(v) => setSettings({ ...settings, readMode: v as 'scroll' | 'page' })}
            className="w-full"
          />
          <p className="text-[11px] tracking-[-0.11px] text-text-muted">
            {settings.readMode === 'scroll' ? t('settings.scrollDesc') : t('settings.pageDesc')}
          </p>
        </div>

        {/* Lines per page */}
        <ListItem
          title={t('settings.linesPerPage')}
          className={settings.readMode === 'scroll' ? 'opacity-40' : ''}
          trailing={
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setSettings({ ...settings, linesPerPage: Math.max(3, settings.linesPerPage - 1) })}
                disabled={settings.readMode === 'scroll'}
              >
                -
              </Button>
              <span className="text-[13px] tracking-[-0.13px] text-text w-6 text-center">{settings.linesPerPage}</span>
              <Button
                variant="default"
                size="sm"
                onClick={() => setSettings({ ...settings, linesPerPage: Math.min(7, settings.linesPerPage + 1) })}
                disabled={settings.readMode === 'scroll'}
              >
                +
              </Button>
            </div>
          }
        />

        {/* Show page numbers */}
        <ListItem
          title={t('settings.showPageNumbers')}
          className={settings.readMode === 'scroll' ? 'opacity-40' : ''}
          trailing={
            <Toggle
              checked={settings.showPageNumbers}
              onChange={(v) => setSettings({ ...settings, showPageNumbers: v })}
              disabled={settings.readMode === 'scroll'}
            />
          }
        />
      </SettingsGroup>

      {/* Data */}
      <SettingsGroup label={t('settings.data')}>
        <ListItem
          title={t('home.bookmarks')}
          trailing={<span className="text-[13px] tracking-[-0.13px] text-text-dim">{bookmarks.length} {t('settings.bookmarksSaved')}</span>}
        />
        <div className="px-4 py-3">
          <Button variant="default" size="sm" onClick={clearHistory}>
            {t('settings.clearHistory')}
          </Button>
        </div>
      </SettingsGroup>

      {/* About */}
      <SettingsGroup label={t('settings.about')}>
        <ListItem
          title="ER Browser v1.0.0"
          subtitle={t('settings.aboutText')}
        />
      </SettingsGroup>

    </main>
  )
}
