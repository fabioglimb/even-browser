import type { PageLink } from '../../types'
import { extractDomain } from '../../lib/url-utils'
import { ListItem, EmptyState } from 'even-toolkit/web'

interface LinkListProps {
  links: PageLink[]
  onNavigate: (url: string) => void
}

export function LinkList({ links, onNavigate }: LinkListProps) {
  if (links.length === 0) {
    return <EmptyState title="No links found" />
  }

  return (
    <div className="space-y-1">
      {links.map((link, i) => (
        <ListItem
          key={`${link.href}-${i}`}
          title={link.text}
          subtitle={extractDomain(link.href)}
          onPress={() => onNavigate(link.href)}
        />
      ))}
    </div>
  )
}
