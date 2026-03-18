import { useNavigate } from 'react-router'
import { useBrowse } from '../hooks/useBrowse'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function Settings() {
  const navigate = useNavigate()
  const { settings, setSettings, bookmarks, clearHistory } = useBrowse()

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto space-y-6">
      <div className="pt-2">
        <h1 className="text-2xl font-semibold text-text">Settings</h1>
      </div>

      {/* Display Settings */}
      <Card className="space-y-4">
        <h2 className="text-sm font-medium text-text-dim">Display</h2>

        {/* Read Mode */}
        <div className="space-y-2">
          <span className="text-sm text-text">Read mode</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSettings({ ...settings, readMode: 'scroll' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                settings.readMode === 'scroll'
                  ? 'bg-accent text-white'
                  : 'bg-surface-light text-text-dim hover:text-text'
              }`}
            >
              Scroll
            </button>
            <button
              onClick={() => setSettings({ ...settings, readMode: 'page' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                settings.readMode === 'page'
                  ? 'bg-accent text-white'
                  : 'bg-surface-light text-text-dim hover:text-text'
              }`}
            >
              Page
            </button>
          </div>
          <p className="text-xs text-text-muted">
            {settings.readMode === 'scroll'
              ? 'Scroll line by line through content'
              : 'Flip through fixed pages with page indicator'}
          </p>
        </div>

        {/* Lines per page (only relevant in page mode) */}
        <div className={`flex items-center justify-between ${settings.readMode === 'scroll' ? 'opacity-40' : ''}`}>
          <span className="text-sm text-text">Lines per page</span>
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

        {/* Show page numbers (only relevant in page mode) */}
        <div className={`flex items-center justify-between ${settings.readMode === 'scroll' ? 'opacity-40' : ''}`}>
          <span className="text-sm text-text">Show page numbers</span>
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
        <h2 className="text-sm font-medium text-text-dim">Data</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text">Bookmarks</span>
          <span className="text-sm text-text-dim">{bookmarks.length} saved</span>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory}>
          Clear Browsing History
        </Button>
      </Card>

      {/* About */}
      <Card className="space-y-2">
        <h2 className="text-sm font-medium text-text-dim">About</h2>
        <p className="text-sm text-text">Even Browser v1.0.0</p>
        <p className="text-xs text-text-muted">Web browser for Even Realities G2 smart glasses</p>
      </Card>

      <div className="pb-8" />
    </div>
  )
}
