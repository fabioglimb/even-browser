import { quickLinks } from '../../data/quick-links'
import { Card } from '../ui/Card'

interface QuickLinksProps {
  onNavigate: (url: string) => void
}

export function QuickLinks({ onNavigate }: QuickLinksProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {quickLinks.map((link) => (
        <Card
          key={link.url}
          variant="interactive"
          padding="sm"
          className="cursor-pointer active:scale-[0.98]"
          onClick={() => onNavigate(link.url)}
        >
          <div className="text-sm font-medium text-text">{link.label}</div>
          <div className="text-xs text-text-dim mt-0.5">{link.description}</div>
        </Card>
      ))}
    </div>
  )
}
