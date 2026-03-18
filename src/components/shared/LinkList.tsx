import type { PageLink } from '../../types'
import { extractDomain } from '../../lib/url-utils'

interface LinkListProps {
  links: PageLink[]
  onNavigate: (url: string) => void
}

export function LinkList({ links, onNavigate }: LinkListProps) {
  if (links.length === 0) {
    return <p className="text-text-dim text-sm">No links found on this page.</p>
  }

  return (
    <div className="space-y-1">
      {links.map((link, i) => (
        <button
          key={`${link.href}-${i}`}
          onClick={() => onNavigate(link.href)}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-light transition-colors group"
        >
          <div className="text-sm text-accent group-hover:underline truncate">{link.text}</div>
          <div className="text-xs text-text-muted truncate">{extractDomain(link.href)}</div>
        </button>
      ))}
    </div>
  )
}
