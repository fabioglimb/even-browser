import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { APP_LANGUAGES, type AppLanguage } from '../types'

export function Settings() {
  const { settings, setSettings, bookmarks, clearHistory } = useBrowse()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto space-y-6">
      <div className="pt-2">
        <h1 className="text-2xl font-semibold text-text">{t('settings.title')}</h1>
      </div>

      {/* Language */}
      <Card className="space-y-4">
        <h2 className="text-sm font-medium text-text-dim">{t('settings.language')}</h2>
        <div className="grid grid-cols-3 gap-2">
          {APP_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSettings({ ...settings, language: lang.id })}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                settings.language === lang.id
                  ? 'bg-accent text-white'
                  : 'bg-surface-light text-text-dim hover:text-text'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="space-y-4">
        <h2 className="text-sm font-medium text-text-dim">{t('settings.display')}</h2>

        {/* Read Mode */}
        <div className="space-y-2">
          <span className="text-sm text-text">{t('settings.readMode')}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSettings({ ...settings, readMode: 'scroll' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                settings.readMode === 'scroll'
                  ? 'bg-accent text-white'
                  : 'bg-surface-light text-text-dim hover:text-text'
              }`}
            >
              {t('settings.scroll')}
            </button>
            <button
              onClick={() => setSettings({ ...settings, readMode: 'page' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                settings.readMode === 'page'
                  ? 'bg-accent text-white'
                  : 'bg-surface-light text-text-dim hover:text-text'
              }`}
            >
              {t('settings.page')}
            </button>
          </div>
          <p className="text-xs text-text-muted">
            {settings.readMode === 'scroll' ? t('settings.scrollDesc') : t('settings.pageDesc')}
          </p>
        </div>

        {/* Lines per page */}
        <div className={`flex items-center justify-between ${settings.readMode === 'scroll' ? 'opacity-40' : ''}`}>
          <span className="text-sm text-text">{t('settings.linesPerPage')}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettings({ ...settings, linesPerPage: Math.max(3, settings.linesPerPage - 1) })}
              disabled={settings.readMode === 'scroll'}
              className="w-8 h-8 rounded-lg bg-surface-light text-text hover:bg-surface-lighter transition-colors text-sm disabled:opacity-50"
            >
              -
            </button>
            <span className="text-sm text-text w-6 text-center">{settings.linesPerPage}</span>
            <button
              onClick={() => setSettings({ ...settings, linesPerPage: Math.min(7, settings.linesPerPage + 1) })}
              disabled={settings.readMode === 'scroll'}
              className="w-8 h-8 rounded-lg bg-surface-light text-text hover:bg-surface-lighter transition-colors text-sm disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Show page numbers */}
        <div className={`flex items-center justify-between ${settings.readMode === 'scroll' ? 'opacity-40' : ''}`}>
          <span className="text-sm text-text">{t('settings.showPageNumbers')}</span>
          <button
            onClick={() => setSettings({ ...settings, showPageNumbers: !settings.showPageNumbers })}
            disabled={settings.readMode === 'scroll'}
            className={`w-10 h-6 rounded-full transition-colors ${
              settings.showPageNumbers ? 'bg-accent' : 'bg-surface-lighter'
            } disabled:opacity-50`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${
              settings.showPageNumbers ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </Card>

      {/* Data */}
      <Card className="space-y-4">
        <h2 className="text-sm font-medium text-text-dim">{t('settings.data')}</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text">{t('home.bookmarks')}</span>
          <span className="text-sm text-text-dim">{bookmarks.length} {t('settings.bookmarksSaved')}</span>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory}>
          {t('settings.clearHistory')}
        </Button>
      </Card>

      {/* About */}
      <Card className="space-y-2">
        <h2 className="text-sm font-medium text-text-dim">{t('settings.about')}</h2>
        <p className="text-sm text-text">Even Browser v1.0.0</p>
        <p className="text-xs text-text-muted">{t('settings.aboutText')}</p>
      </Card>

      <div className="pb-8" />
    </div>
  )
}
