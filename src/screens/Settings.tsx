import { useState } from 'react'
import { useBrowse } from '../hooks/useBrowse'
import { useTranslation } from '../hooks/useTranslation'
import { Button, Card, Select, SegmentedControl, Toggle, useDrawerHeader } from 'even-toolkit/web'
import { APP_LANGUAGES, type AppLanguage, type FontSize } from '../types'

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <span className="text-[15px] tracking-[-0.15px] text-text font-normal">{label}</span>
        {description && <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1.5 mt-2">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

export function Settings() {
  const { settings, setSettings, bookmarks, clearHistory } = useBrowse()
  const { t } = useTranslation()
  const [confirmClear, setConfirmClear] = useState(false)

  useDrawerHeader({
    title: t('settings.title'),
    backTo: '/',
    right: <span className="text-[11px] tracking-[-0.11px] text-text-dim">v0.1.5</span>,
  })

  const handleClearHistory = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearHistory()
    setConfirmClear(false)
  }

  return (
    <div className="px-3 pt-4 pb-8">
      {/* Display */}
      <SectionLabel>{t('settings.display')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('settings.readMode')} description={settings.readMode === 'scroll' ? t('settings.scrollDesc') : t('settings.pageDesc')}>
          <SegmentedControl
            size="small"
            options={[
              { value: 'scroll', label: t('settings.scroll') },
              { value: 'page', label: t('settings.page') },
            ]}
            value={settings.readMode}
            onValueChange={(v) => setSettings({ ...settings, readMode: v as 'scroll' | 'page' })}
          />
        </SettingRow>
        <SettingRow
          label={t('settings.linesPerPage')}
          description={settings.readMode === 'scroll' ? t('settings.onlyPageMode') : t('settings.linesPerPageDesc', { n: settings.linesPerPage })}
        >
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
        </SettingRow>
        <SettingRow label={t('settings.showPageNumbers')}>
          <Toggle
            checked={settings.showPageNumbers}
            onChange={(v) => setSettings({ ...settings, showPageNumbers: v })}
            disabled={settings.readMode === 'scroll'}
          />
        </SettingRow>
        <SettingRow label={t('settings.fontSize')} description={settings.fontSize === 'small' ? t('settings.fontSizeSmallDesc') : settings.fontSize === 'large' ? t('settings.fontSizeLargeDesc') : t('settings.fontSizeMediumDesc')}>
          <SegmentedControl
            size="small"
            options={[
              { value: 'small', label: t('settings.fontSmall') },
              { value: 'medium', label: t('settings.fontMedium') },
              { value: 'large', label: t('settings.fontLarge') },
            ]}
            value={settings.fontSize}
            onValueChange={(v) => setSettings({ ...settings, fontSize: v as FontSize })}
          />
        </SettingRow>
      </Card>

      {/* Language */}
      <SectionLabel>{t('settings.language')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('settings.language')} description={t('settings.languageDesc')}>
          <Select
            options={APP_LANGUAGES.map((l) => ({ value: l.id, label: l.name }))}
            value={settings.language}
            onValueChange={(v) => setSettings({ ...settings, language: v as AppLanguage })}
            className="w-[130px]"
          />
        </SettingRow>
      </Card>

      {/* Data */}
      <SectionLabel>{t('settings.data')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('home.bookmarks')} description={`${bookmarks.length} ${t('settings.bookmarksSaved')}`}>
          <span className="text-[11px] tracking-[-0.11px] text-text-dim">{bookmarks.length}</span>
        </SettingRow>
        <SettingRow label={t('settings.clearHistory')} description={t('settings.clearHistoryDesc')}>
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>
                {t('settings.cancel')}
              </Button>
              <Button size="sm" variant="danger" onClick={handleClearHistory}>
                {t('settings.confirm')}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="danger" onClick={handleClearHistory}>
              {t('settings.clear')}
            </Button>
          )}
        </SettingRow>
      </Card>

      {/* About */}
      <SectionLabel>{t('settings.about')}</SectionLabel>
      <Card>
        <SettingRow label="ER Browser" description={t('settings.aboutText')}>
          <span className="text-[11px] tracking-[-0.11px] text-text-dim">v0.1.5</span>
        </SettingRow>
      </Card>
    </div>
  )
}
